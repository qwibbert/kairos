import type { VineID } from '$features/vines/types';
import { DateTime } from 'luxon';
import { _ } from 'svelte-i18n';
import { get } from 'svelte/store';

import { PomoType } from '$lib/session/types';

import { db } from '../../db/db';
import type { SessionDocument } from '../../db/sessions/define.svelte';
import type { VinesDocument } from '../../db/vines/define';

interface FocusTimeCounter {
	per_vine: VineTimeCount[];
	no_vine: number;
}

interface VineTimeCount {
	vine_id: string;
	vine_title: string;
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
				const vine_time_count = counter.per_vine.findIndex((vine) => vine.vine_id == vine_id);

				if (vine_time_count == -1) {
					counter.per_vine.push({
						vine_id: vine_id ?? '',
						vine_title: vine?.title ?? 'Unknown vine',
						time: elapsed_time,
					});
				} else {
					const object = counter.per_vine[vine_time_count];
					counter.per_vine[vine_time_count] = { ...object, time: object.time + elapsed_time };
				}
			} else if (children_cache.get(vine_id)?.includes(entry.vine_id)) {
				const vine_time_count = counter.per_vine.findIndex(
					(vine_entry) => vine_entry.vine_id == vine_id,
				);

				if (vine_time_count == -1) {
					counter.per_vine.push({
						vine_id: vine_id ?? '',
						vine_title: vine?.title ?? 'Unknown vine',
						time: elapsed_time,
					});
				} else {
					const object = counter.per_vine[vine_time_count];
					counter.per_vine[vine_time_count] = { ...object, time: object.time + elapsed_time };
				}
			}
		} else if (entry.vine_id) {
			const vine = vine_map.get(entry.vine_id);

			const vine_time_count = counter.per_vine.findIndex((vine) => vine.vine_id == entry.vine_id);

			if (vine_time_count == -1 && !vine) {
				// Previous entries did not yet encounter this specific vine id and it looks like the vine has been deleted
				// We provide the user with a vine name of "Unknown vine"
				counter.per_vine.push({
					vine_id: entry.vine_id,
					vine_title: 'Unknown vine',
					time: elapsed_time,
				});
			} else if (vine_time_count == -1 && vine) {
				counter.per_vine.push({
					vine_id: entry.vine_id,
					vine_title: vine.title,
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

		for (const vine of day_stats.per_vine) {
			const vine_index = counter.per_vine.findIndex(
				(vine_entry) => vine.vine_id == vine_entry.vine_id,
			);

			if (vine_index == -1) {
				counter.per_vine.push(vine);
			} else {
				counter.per_vine[vine_index].time += vine.time;
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
): Promise<[HistogramSourceType, HistogramSeriesType, HistogramLegendType]> {
	const start_day = day.startOf('week');

	const source: HistogramSourceType = [['day']];

	const series: HistogramSeriesType = [];

	const legend = [];

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

	for (let i = 0; i < 7; i++) {
		const day = start_day.plus({ days: i });
		source[i + 1] = [day.toISODate()!];
		const day_stats = await get_stats_day(
			day.startOf('day'),
			vine_id,
			all_entries,
			vine_map,
			vine_children_cache,
		);

		if (day_stats.no_vine != 0 && !series.some((s) => s.id == 'NO_VINE') && !vine_id) {
			series.push({
				id: 'NO_VINE',
				stack: 'x',
				name: get(_)('no_vine'),
				type: 'bar',
			});

			legend.push({ name: get(_)('no_vine') });

			source[0][1] = get(_)('no_vine');

			source[i + 1][1] = day_stats.no_vine / 3600;
		} else if (day_stats.no_vine != 0 && !vine_id) {
			source[i + 1][1] = day_stats.no_vine / 3600;
		}

		let vine_i = 0;
		for (const vine of day_stats.per_vine) {
			const children = vine_children_cache
				.get(vine.vine_id)
				?.map((child_id) => vine_map.get(child_id));

			if (
				children &&
				children.length > 0 &&
				children.find((child) => child?.archived == 0) &&
				!vine_id
			) {
				continue;
			}

			if (!series.some((s) => s.id == vine.vine_id)) {
				series.push({
					id: vine.vine_id,
					stack: 'x',
					name: vine.vine_title,
					type: 'bar',
				});
				legend.push({ name: vine.vine_title });

				if (!source[0][vine_i + 1]) {
					source[0][vine_i + 1] = vine.vine_title;
				}
				source[i + 1][vine_i + 1] = vine.time / 3600;
			} else {
				source[i + 1][vine_i + 1] = vine.time / 3600;
			}

			vine_i++;
		}
	}

	if (series.length == 0) {
		if (vine_id) {
			const vine = vine_map.get(vine_id);

			series.push({
				id: vine_id,
				stack: 'x',
				name: vine?.title ?? '',
				type: 'bar',
			});

			legend.push({ name: vine?.title ?? '' });

			source[0][1] = vine?.title ?? '';

			source[1][1] = 0;
		} else {
			series.push({
				id: 'NO_VINE',
				stack: 'x',
				name: get(_)('no_vine'),
				type: 'bar',
			});

			legend.push({ name: get(_)('no_vine') });

			source[0][1] = get(_)('no_vine');

			source[1][1] = 0;
		}
	}

	return [source, series, legend];
}

export async function get_year_histogram_echarts(
	day: DateTime,
	pomo_type: PomoType,
	vine_id: string | undefined,
): Promise<[HistogramSourceType, HistogramSeriesType, HistogramLegendType]> {
	const start_day = day.startOf('month');

	const source: HistogramSourceType = [['month']];

	const series: HistogramSeriesType = [];

	const legend = vine_id ? [] : [{ name: get(_)('no_vine') }];

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

	for (let i = 0; i <= 11; i++) {
		const month = start_day.plus({ months: i });

		source[i + 1] = [month.toISODate()!];
		const month_stats = await get_stats_month(
			month.startOf('month'),
			vine_id,
			all_entries,
			vine_map,
			vine_children_cache,
		);

		if (month_stats.no_vine != 0 && !series.some((s) => s.id == 'NO_VINE') && !vine_id) {
			series.push({
				id: 'NO_VINE',
				stack: 'x',
				name: get(_)('no_vine'),
				type: 'bar',
			});

			legend.push({ name: get(_)('no_vine') });

			source[0][1] = get(_)('no_vine');

			source[i + 1][1] = month_stats.no_vine / 3600;
		} else if (month_stats.no_vine != 0 && !vine_id) {
			source[i + 1][1] = month_stats.no_vine / 3600;
		}

		let vine_i = 0;
		for (const vine of month_stats.per_vine) {
			const children = vine_children_cache
				.get(vine.vine_id)
				?.map((child_id) => vine_map.get(child_id));

			if (
				children &&
				children.length > 0 &&
				children.find((child) => child?.archived == 0) &&
				!vine_id
			) {
				continue;
			}

			if (!series.some((s) => s.id == vine.vine_id)) {
				series.push({
					id: vine.vine_id,
					stack: 'x',
					name: vine.vine_title,
					type: 'bar',
				});
				legend.push({ name: vine.vine_title });

				if (!source[0][vine_i + 1]) {
					source[0][vine_i + 1] = vine.vine_title;
				}
				source[i + 1][vine_i + 1] = vine.time / 3600;
			} else {
				source[i + 1][vine_i + 1] = vine.time / 3600;
			}

			vine_i++;
		}
	}

	if (series.length == 0) {
		if (vine_id) {
			const vine = vine_map.get(vine_id);

			series.push({
				id: vine_id,
				stack: 'x',
				name: vine?.title ?? '',
				type: 'bar',
			});

			legend.push({ name: vine?.title ?? '' });

			source[0][1] = vine?.title ?? '';

			source[1][1] = 0;
		} else {
			series.push({
				id: 'NO_VINE',
				stack: 'x',
				name: get(_)('no_vine'),
				type: 'bar',
			});

			legend.push({ name: get(_)('no_vine') });

			source[0][1] = get(_)('no_vine');

			source[1][1] = 0;
		}
	}

	return [source, series, legend];
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
