import { DateTime } from 'luxon';

import i18next from 'i18next';
import { db } from '../../../db/db';
import { PomoType, type SessionDocument } from '../../../db/sessions/define.svelte';
import type { VinesDocument } from '../../../db/vines/define';

interface VineTimeCount {
	vine: VinesDocument,
	time: number;
}

interface FocusTimeCounter {
	per_vine: VineTimeCount[];
	no_vine: number;
}

interface HistogramDataElement {
	row: string,
	vine: VinesDocument | null,
	time: number
}

interface HistogramData {
	rows: string[],
	elements: HistogramDataElement[]
}

export type HistogramSeriesType = { id: string; stack: string; name: string; type: string }[];
export type HistogramSourceType = (string | number)[][];
export type HistogramLegendType = { name: string }[];

export async function get_stats_day(
	day: DateTime,
	vine_id: string | undefined,
	entries: SessionDocument[],
	vine_map: Map<string, VinesDocument>,
	children_cache: Map<string, VinesDocument[]>,
	vine_stats: boolean
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
			const child_vine = children_cache.get(vine_id)?.find(child => child.id == entry.vine_id);

			if (child_vine) {
				const vine_time_count = counter.per_vine.findIndex(
					(count) => count.vine.id == entry.vine_id,
				);

				if (vine_time_count == -1) {
					counter.per_vine.push({
						vine: child_vine,
						time: elapsed_time,
					});
				} else {
					const object = counter.per_vine[vine_time_count];
					counter.per_vine[vine_time_count] = { ...object, time: object.time + elapsed_time };
				}
			}
		} else if (entry.vine_id) {
			let vine = vine_map.get(entry.vine_id);

			if (!vine) {
				// The entry references a deleted vine, we have no choice but to skip this entry
				// TODO: Due to RxDB not supporting querying for deleted documents, we should add our own deletion tracker logic
				continue;
			}

			if (vine_stats) {
				// If this vine has a parent, we will count the vine time towards the parent
				if (vine?.parent_id) {
					vine = vine_map.get(vine?.parent_id ?? '');
				}
			}

			const vine_time_count = counter.per_vine.findIndex((count) => count.vine.id == vine.id);

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
	vine_stats: boolean
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
			vine_stats
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

export async function get_day_histogram_echarts(
	day: DateTime,
	pomo_type: PomoType,
	vine_id: string | undefined,
	vine_stats: boolean
): Promise<[HistogramSourceType, HistogramSeriesType]> {
	const start_day = day.startOf('week');

	const vines = await db.vines.find().exec();
	const vine_map = new Map(vines.map((v) => [v.id, v]));
	const vine_children_cache = new Map<string, VinesDocument[]>();

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
				if (vine_stats) {
					if (vine_id) {
						return vine_children_cache.get(vine_id ?? '')?.find(child => child.id == res.vine_id);
					} else {
						return res.vine_id;
					}
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
			vine_stats
		);

		if (!vine_stats) {
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
	vine_stats: boolean
): Promise<[HistogramSourceType, HistogramSeriesType, HistogramLegendType]> {
	const start_day = day.startOf('month');

	const vines = await db.vines.find().exec();
	const vine_map = new Map(vines.map((v) => [v.id, v]));
	const vine_children_cache = new Map<string, VinesDocument[]>();

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
					{ updated_at: { $gte: day.startOf('year').toISO() } },
					{ updated_at: { $lte: day.endOf('year').toISO() } },
					{ pomo_type: { $eq: PomoType.Pomo } },
				],
			},
		})
		.exec()
		.then((results) =>
			results.filter((res) => {
				if (vine_stats) {
					if (vine_id) {
						return vine_children_cache.get(vine_id ?? '')?.find(child => child.id == res.vine_id);
					} else {
						return res.vine_id;
					}
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
			vine_stats
		);

		if (!vine_stats) {
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

	return build_histogram_sources({ rows, elements });
}



function build_histogram_sources(data: HistogramData) {
	const source = [
		['date']
	];
	const series = [];

	// Check if we need to add a series for sessions without a vine
	if (data.elements.find(el => !el.vine)) {
		series.push({ type: 'bar', stack: 'x', name: i18next.t('vines:no_vine'), emphasis: { focus: 'series' } });
		source[0][1] = undefined;
	}

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