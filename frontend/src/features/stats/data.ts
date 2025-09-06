import type { VineID } from '$features/vines/types';
import { DateTime } from 'luxon';
import { _ } from 'svelte-i18n';
import { get } from 'svelte/store';

import { db } from '../../db/db';
import { PomoType, type SessionDocument } from '../../db/sessions/define.svelte';
import type { VinesDocument } from '../../db/vines/define';

interface FocusTimeCounter {
	per_vine: VineTimeCount[];
	no_vine: number;
}

interface VineTimeCount {
	vine: VinesDocument,
	time: number;
}

export async function get_stats_day(
	day: DateTime,
	vine_id: string | undefined,
	entries: SessionDocument[],
	vine_map: Map<string, VinesDocument>,
	children_cache: Map<string, string[]>,
): Promise<FocusTimeCounter> {
	const entries_subset = entries.filter(
		(entry) => entry.time_elapsed[day.toJSDate().toDateString()],
	);

	const counter: FocusTimeCounter = {
		per_vine: [],
		no_vine: 0,
	};

	for (const entry of entries_subset) {
		const elapsed_time = entry.time_elapsed[day.toJSDate().toDateString()];

		if (!elapsed_time) {
			throw new Error('No elapsed time');
		}

		if (entry.vine_id && vine_id) {
			const vine = vine_map.get(vine_id);

			if (entry.vine_id == vine_id) {
				const vine_time_count = counter.per_vine.findIndex((count) => count.vine.id == vine_id);

				if (vine_time_count == -1) {
					counter.per_vine.push({
						vine,
						time: elapsed_time,
					});
				} else {
					const object = counter.per_vine[vine_time_count];
					counter.per_vine[vine_time_count] = { ...object, time: object.time + elapsed_time };
				}
			} else if (children_cache.get(vine_id)?.includes(entry.vine_id)) {
				const vine_time_count = counter.per_vine.findIndex(
					(count) => count.vine.id == vine_id,
				);

				if (vine_time_count == -1) {
					counter.per_vine.push({
						vine,
						time: elapsed_time,
					});
				} else {
					const object = counter.per_vine[vine_time_count];
					counter.per_vine[vine_time_count] = { ...object, time: object.time + elapsed_time };
				}
			}
		} else if (entry.vine_id) {
			const vine = vine_map.get(entry.vine_id);

			const vine_time_count = counter.per_vine.findIndex((count) => count.vine.id == entry.vine_id);

			if (vine_time_count == -1 && !vine) {
				// Previous entries did not yet encounter this specific vine id and it looks like the vine has been deleted
				// We provide the user with a vine name of "Unknown vine"
				counter.per_vine.push({
					vine: null,
					time: elapsed_time,
				});
			} else if (vine_time_count == -1 && vine) {
				counter.per_vine.push({
					vine,
					time: elapsed_time,
				});
			} else {
				// Previous entries already populated the `per_vine` array with vine details
				// We just need to update the `time`
				counter.per_vine[vine_time_count].time += elapsed_time;
			}
		} else {
			counter.no_vine += elapsed_time;
		}
	}

	return counter;
}

export async function get_stats_month(
	month: DateTime,
	vine_id: string | undefined,
	entries: SessionDocument[],
	vine_map: Map<string, VinesDocument>,
	children_cache: Map<string, string[]>,
): Promise<FocusTimeCounter> {
	const counter: FocusTimeCounter = {
		per_vine: [],
		no_vine: 0,
	};

	for (let i = 0; i <= (month.daysInMonth ?? 30); i++) {
		const day_stats = await get_stats_day(
			month.plus({ days: i }),
			vine_id,
			entries,
			vine_map,
			children_cache,
		);

		counter.no_vine += day_stats.no_vine;

		for (const count of day_stats.per_vine) {
			const vine_index = counter.per_vine.findIndex(
				(vine_entry) => count.vine.id == vine_entry.vine.id,
			);

			if (vine_index == -1) {
				counter.per_vine.push(count);
			} else {
				counter.per_vine[vine_index].time += count.time;
			}
		}
	}

	return counter;
}

export type HistogramSeriesType = { id: string; stack: string; name: string; type: string }[];
export type HistogramSourceType = (string | number)[][];
export type HistogramLegendType = { name: string }[];

export async function get_day_histogram_echarts(
	day: DateTime,
	pomo_type: PomoType,
	vine_id: string | undefined,
): Promise<[HistogramSourceType, HistogramSeriesType]> {
	const start_day = day.startOf('week');

	const vines = await db.vines.find().exec();
	const vine_map = new Map(vines.map((v) => [v.id, v]));
	const vine_children_cache = new Map<string, string[]>();

	// Precompute vine children for all vine_ids
	for (const vine of vines) {
		vine_children_cache.set(
			vine.id,
			await db.vines.get_vine(vine.id).then((v) => v?.get_all_children(vine.id)),
		);
	}

	const all_entries = await db.sessions
		.find({
			selector: {
				$and: [
					{ updated_at: { $gte: start_day.startOf('week').toISO() } },
					{ updated_at: { $lte: start_day.endOf('week').toISO() } },
					{ pomo_type: { $eq: PomoType.Pomo } },
				],
			},
		})
		.exec()
		.then((results) =>
			results.filter((res) => {
				if (vine_id) {
					return res.vine_id == vine_id || vine_children_cache.has(res?.vine_id ?? '');
				} else {
					return true;
				}
			}),
		);

	const rows = [];
	const elements: HistogramDataElement[] = [];
	for (let i = 0; i < 7; i++) {
		const day = start_day.plus({ days: i });
		rows.push(day.toISODate()!);
		const day_stats = await get_stats_day(
			day.startOf('day'),
			vine_id,
			all_entries,
			vine_map,
			vine_children_cache,
		);

		if (!vine_id) {
			elements.push({ row: rows[rows.length - 1], vine: null, time: day_stats.no_vine });
		}

		for (const count of day_stats.per_vine) {
			elements.push({
				row: rows[rows.length - 1],
				vine: count.vine,
				time: count.time
			});
		}
	}

	return build_histogram_sources({ rows, elements });
}

export async function get_year_histogram_echarts(
	day: DateTime,
	pomo_type: PomoType,
	vine_id: string | undefined,
): Promise<[HistogramSourceType, HistogramSeriesType, HistogramLegendType]> {
	const start_day = day.startOf('month');

	const vines = await db.vines.find().exec();
	const vine_map = new Map(vines.map((v) => [v.id, v]));
	const vine_children_cache = new Map<string, string[]>();

	// Precompute vine children for all vine_ids
	for (const vine of vines) {
		vine_children_cache.set(
			vine.id,
			await db.vines.get_vine().then((vine) => vine?.get_all_children(vine.id)),
		);
	}

	const all_entries = await db.sessions
		.find({
			selector: {
				$and: [
					{ updated_at: { $gte: day.startOf('year').toISO() } },
					{ updated_at: { $lte: day.endOf('year').toISO() } },
					{ pomo_type: { $eq: PomoType.Pomo } },
				],
			},
		})
		.exec()
		.then((results) =>
			results.filter((res) => {
				if (vine_id) {
					return res.vine_id == vine_id || vine_children_cache.has(res?.vine_id ?? '');
				} else {
					return true;
				}
			}),
		);

	const rows = [];
	const elements: HistogramDataElement[] = [];
	for (let i = 0; i <= 11; i++) {
		const month = start_day.plus({ months: i });
		rows.push(month.toISODate()!);

		const month_stats = await get_stats_month(
			month.startOf('month'),
			vine_id,
			all_entries,
			vine_map,
			vine_children_cache,
		);

		if (!vine_id) {
			elements.push({ row: rows[rows.length - 1], vine: null, time: month_stats.no_vine });
		}

		for (const count of month_stats.per_vine) {
			elements.push({
				row: rows[rows.length - 1],
				vine: count.vine,
				time: count.time
			});
		}
	}

	console.log('rows', rows)
	console.log('elements', elements)

	return build_histogram_sources({ rows, elements });
}

type PieChartData = { name: string; value: number }[];

export function vines_pie_chart(
	vine_id: VineID | undefined,
	entries: SessionDocument[],
	vine_map: Map<string, VinesDocument>,
	children_map: Map<string, string[]>,
): PieChartData {
	const data: PieChartData = [];
	const parent_vine = vine_map.get(vine_id ?? '');

	for (const entry of entries) {
		if (vine_id && !children_map.get(vine_id)?.includes(entry?.vine_id ?? '')) {
			continue;
		}

		const vine = vine_map.get(entry.vine_id ?? '');

		if (vine?.archived) {
			continue;
		}

		const parent_vine = vine_map.get(vine?.parent_id ?? '');

		const data_index = data.findIndex((data_entry) =>
			vine_id || !parent_vine
				? data_entry.name == vine?.title
				: data_entry.name == parent_vine?.title,
		);

		if (data_index == -1) {
			// Calculate the elapsed_time of all the child tasks
			const children = children_map.get(entry?.vine_id ?? '');
			let children_elapsed_time = 0;

			if (children) {
				for (const child_id of children) {
					const child = vine_map.get(child_id);

					if (child?.archived) {
						continue;
					}

					if (child) {
						const entries_with_child = entries.filter((e) => e.vine_id == child.id);

						for (const child_entry of entries_with_child) {
							children_elapsed_time += child_entry.get_time_elapsed();
						}
					}
				}
			}

			data.push({
				name: vine_id || !parent_vine ? (vine?.title ?? '') : (parent_vine?.title ?? ''),
				value: children_elapsed_time + entry.get_time_elapsed(),
			});
		} else {
			data[data_index] = {
				...data[data_index],
				value: data[data_index].value + entry.get_time_elapsed(),
			};
		}
	}

	// No data was found, we need to distribute the pie chart evenly
	if (data.length == 0) {
		if (parent_vine) {
			for (const child_id of children_map.get(parent_vine.id) ?? []) {
				const child = vine_map.get(child_id);

				if (child?.archived) {
					continue;
				}

				data.push({
					name: child?.title ?? 'Unknown Task',
					value: 0,
				});
			}
		} else {
			for (const parentless_vine of vine_map
				.values()
				.filter((entry) => (entry.parent_id ? false : true) && entry.archived == 0)) {
				data.push({
					name: parentless_vine.title,
					value: 0,
				});
			}
		}
	}

	return data;
}

interface HistogramData {
	rows: string[],
	elements: HistogramDataElement[]
}

interface HistogramDataElement {
	row: string,
	vine: VinesDocument | null,
	time: number
}

function build_histogram_sources(data: HistogramData) {
	const source = [
		['date', undefined]
	];
	const series = [];

	// Add undefined vine to series
	series.push({ type: 'bar', stack: 'x', name: get(_)('no_vine'), emphasis: { focus: 'series' } })

	const vine_h_map = new Map<string, number>();

	// Create date rows
	for (const row of data.rows) {
		source[source.length] = [row];
	}

	for (const element of data.elements) {
		// Start counting after 'date'
		const v_pos = data.rows.findIndex(e => e == element.row) + 1;
		if (element.vine) {
			let vine_h_pos = vine_h_map.get(element.vine.id);

			if (vine_h_pos) {
				// Use the existing horizontal position of the time
				source[v_pos][vine_h_pos] = element.time / 3600;
			} else {
				// Claim a new horizontal position for this vine
				vine_h_pos = source[0].length;
				source[0][vine_h_pos] = element.vine.id;
				source[v_pos][vine_h_pos] = element.time / 3600;

				series.push({ type: 'bar', stack: 'x', name: element.vine.title, emphasis: { focus: 'series' } });
			}
		} else {
			// Count this element as an undefined vine
			const vine_h_pos = 1;
			source[v_pos][vine_h_pos] = element.time / 3600;
		}
	}

	return [source, series]
}