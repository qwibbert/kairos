import type { PomoType } from "$lib/session/types";
import { DateTime } from "luxon";
import type { HistoryEntry, Vine } from "../../db/appdb";
import { db } from "../../db/db";
import { get_all_children } from "../../db/vines";
import * as m from '../../paraglide/messages';

interface FocusTimeCounter {
    per_vine: VineTimeCount[];
    no_vine: number;
}

interface VineTimeCount {
    vine_id: string;
    vine_title: string;
    time: number;
}

export async function get_stats_day(day: DateTime, vine_id: string | undefined, entries: HistoryEntry[], vine_map: Map<string, Vine>, children_cache: Map<string, string[]>): Promise<FocusTimeCounter> {
    const entries_subset = entries.filter(entry => DateTime.fromJSDate(entry.updated_at).hasSame(day, 'day'));

    const counter: FocusTimeCounter = {
        per_vine: [],
        no_vine: 0
    }

    for (const entry of entries_subset) {
        if (entry.vine_id && vine_id) {
            const vine = vine_map.get(vine_id);

            if (entry.vine_id == vine_id) {
                const vine_time_count = counter.per_vine.findIndex(vine => vine.vine_id == vine_id);

                if (vine_time_count == -1) {
                    counter.per_vine.push({
                        vine_id: vine_id ?? '',
                        vine_title: vine?.title ?? 'Unknown vine',
                        time: entry.time_real
                    });
                } else {
                    const object = counter.per_vine[vine_time_count]
                    counter.per_vine[vine_time_count] = { ...object, time: object.time + entry.time_real };
                }
            } else if (children_cache.get(vine_id)?.includes(entry.vine_id)) {
                const vine_time_count = counter.per_vine.findIndex(vine_entry => vine_entry.vine_id == vine_id);

                if (vine_time_count == -1) {
                    counter.per_vine.push({
                        vine_id: vine_id ?? '',
                        vine_title: vine?.title ?? 'Unknown vine',
                        time: entry.time_real
                    });
                } else {
                    const object = counter.per_vine[vine_time_count];
                    counter.per_vine[vine_time_count] = { ...object, time: object.time + entry.time_real };
                }
            }
        } else if (entry.vine_id) {
            const vine = vine_map.get(entry.vine_id);

            const vine_time_count = counter.per_vine.findIndex(vine => vine.vine_id == entry.vine_id);

            if (vine_time_count == -1 && !vine) {
                // Previous entries did not yet encounter this specific vine id and it looks like the vine has been deleted
                // We provide the user with a vine name of "Unknown vine"
                counter.per_vine.push({
                    vine_id: entry.vine_id,
                    vine_title: 'Unknown vine',
                    time: entry.time_real
                });
            } else if (vine_time_count == -1 && vine) {
                counter.per_vine.push({
                    vine_id: entry.vine_id,
                    vine_title: vine.title,
                    time: entry.time_real
                });
            } else {
                // Previous entries already populated the `per_vine` array with vine details
                // We just need to update the `time`
                counter.per_vine[vine_time_count].time += entry.time_real;
            }
        } else {
            counter.no_vine += entry.time_real;
        }
    }

    return counter;
}

export async function get_stats_month(month: DateTime, vine_id: string | undefined, entries: HistoryEntry[], vine_map: Map<string, Vine>, children_cache: Map<string, string[]>): Promise<FocusTimeCounter> {
    const counter: FocusTimeCounter = {
        per_vine: [],
        no_vine: 0
    }

    for (let i = 0; i <= (month.daysInMonth ?? 30); i++) {
        const day_stats = await get_stats_day(month.plus({ days: i }), vine_id, entries, vine_map, children_cache);

        counter.no_vine += day_stats.no_vine;

        for (const vine of day_stats.per_vine) {
            const vine_index = counter.per_vine.findIndex(vine_entry => vine.vine_id == vine_entry.vine_id);

            if (vine_index == -1) {
                counter.per_vine.push(vine);
            } else {
                counter.per_vine[vine_index].time += vine.time;
            }
        }
    }

    return counter;
}

export type SeriesType = { id: string, stack: string, name: string, type: string }[];
export type SourceType = (string | number)[][];
export type LegendType = { name: string }[];
export async function get_day_histogram_echarts(day: DateTime, pomo_type: PomoType, vine_id: string | undefined): Promise<[SourceType, SeriesType, LegendType]> {
    const start_day = day.startOf('week');

    const source: SourceType = [
        ['day']
    ];

    const series: SeriesType = [];

    const legend = [];

    const vines = await db.vines.toArray();
    const vine_map = new Map(vines.map(v => [v.id, v]));
    const vine_children_cache = new Map<string, string[]>();

    // Precompute vine children for all vine_ids
    for (const vine of vines) {
        vine_children_cache.set(vine.id, await get_all_children(vine.id));
    }

    const all_entries = await db.history
        .where('updated_at')
        .between(start_day.toJSDate(), start_day.endOf('week').toJSDate())
        .and(entry => entry.pomo_type == pomo_type)
        .and(entry => {
            if (vine_id) {
                return entry.vine_id == vine_id || vine_children_cache.has(entry?.vine_id ?? '')
            } else {
                return true;
            }
        })
        .toArray();

    for (let i = 0; i < 7; i++) {
        const day = start_day.plus({ days: i });
        source[i + 1] = [day.toISODate()!];
        const day_stats = await get_stats_day(day.startOf('day'), vine_id, all_entries, vine_map, vine_children_cache);

        if (day_stats.no_vine != 0 && !series.some(s => s.id == 'NO_VINE') && !vine_id) {
            series.push({
                id: 'NO_VINE',
                stack: 'x',
                name: m.no_vine(),
                type: 'bar',
            });

            legend.push({ name: m.no_vine() })

            source[0][1] = m.no_vine();

            source[i + 1][1] = day_stats.no_vine / 3600;
        } else if (day_stats.no_vine != 0 && !vine_id) {
            source[i + 1][1] = day_stats.no_vine / 3600;
        }

        for (const vine of day_stats.per_vine) {
            const children = vine_children_cache.get(vine.vine_id);

            if (children?.length && !vine_id) {
                continue;
            }

            const vine_index = day_stats.per_vine.findIndex(vine_entry => vine.vine_id == vine_entry.vine_id);

            if (!series.some(s => s.id == vine.vine_id)) {
                series.push({
                    id: vine.vine_id,
                    stack: 'x',
                    name: vine.vine_title,
                    type: 'bar',
                });
                legend.push({ name: vine.vine_title });

                if (!source[0][vine_index + (vine_id ? 1 : 2)]) {
                    source[0][vine_index + (vine_id ? 1 : 2)] = vine.vine_title;
                }
                source[i + 1][vine_index + (vine_id ? 1 : 2)] = vine.time / 3600;
            } else {
                source[i + 1][vine_index + (vine_id ? 1 : 2)] = vine.time / 3600;
            }
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

            legend.push({ name: vine?.title ?? '' })

            source[0][1] = vine?.title ?? '';

            source[1][1] = 0;
        } else {
            series.push({
                id: 'NO_VINE',
                stack: 'x',
                name: m.no_vine(),
                type: 'bar',
            });

            legend.push({ name: m.no_vine() })

            source[0][1] = m.no_vine();

            source[1][1] = 0;
        }

    }

    return [source, series, legend];
}

export async function get_year_histogram_echarts(day: DateTime, pomo_type: PomoType, vine_id: string | undefined): Promise<[SourceType, SeriesType, LegendType]> {
    const start_day = day.startOf('month');

    const source: SourceType = [
        ['month']
    ];

    const series: SeriesType = [];

    const legend = vine_id ? [] : [{ name: m.no_vine() }];

    const vines = await db.vines.toArray();
    const vine_map = new Map(vines.map(v => [v.id, v]));
    const vine_children_cache = new Map<string, string[]>();

    // Precompute vine children for all vine_ids
    for (const vine of vines) {
        vine_children_cache.set(vine.id, await get_all_children(vine.id));
    }

    const all_entries = await db.history
        .where('updated_at')
        .between(day.startOf('year').toJSDate(), day.endOf('year').toJSDate())
        .and(entry => entry.pomo_type == pomo_type)
        .and(entry => {
            if (vine_id) {
                return entry.vine_id == vine_id || vine_children_cache.has(entry?.vine_id ?? '')
            } else {
                return true;
            }
        })
        .toArray();

    for (let i = 0; i <= 11; i++) {
        const month = start_day.plus({ months: i });

        source[i + 1] = [month.toISODate()!];
        const month_stats = await get_stats_month(month.startOf('month'), vine_id, all_entries, vine_map, vine_children_cache);

        if (month_stats.no_vine != 0 && !series.some(s => s.id == 'NO_VINE') && !vine_id) {
            series.push({
                id: 'NO_VINE',
                stack: 'x',
                name: m.no_vine(),
                type: 'bar',
            });

            legend.push({ name: m.no_vine() })

            source[0][1] = m.no_vine();

            source[i + 1][1] = month_stats.no_vine / 3600;
        } else if (month_stats.no_vine != 0 && !vine_id) {
            source[i + 1][1] = month_stats.no_vine / 3600;
        }

        for (const vine of month_stats.per_vine) {
            const children = vine_children_cache.get(vine.vine_id);

            if (children?.length && !vine_id) {
                continue;
            }

            const vine_index = month_stats.per_vine.findIndex(vine_entry => vine.vine_id == vine_entry.vine_id);

            if (!series.some(s => s.id == vine.vine_id)) {
                series.push({
                    id: vine.vine_id,
                    stack: 'x',
                    name: vine.vine_title,
                    type: 'bar',
                });
                legend.push({ name: vine.vine_title });

                if (!source[0][vine_index + 1]) {
                    source[0][vine_index + 1] = vine.vine_title;
                }
                source[i + 1][vine_index + 1] = vine.time / 3600;
            } else {
                source[i + 1][vine_index + 1] = vine.time / 3600;
            }
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

            legend.push({ name: vine?.title ?? '' })

            source[0][1] = vine?.title ?? '';

            source[1][1] = 0;
        } else {
            series.push({
                id: 'NO_VINE',
                stack: 'x',
                name: m.no_vine(),
                type: 'bar',
            });

            legend.push({ name: m.no_vine() })

            source[0][1] = m.no_vine();

            source[1][1] = 0;
        }
    }

    return [source, series, legend];
}
