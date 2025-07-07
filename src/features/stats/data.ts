import type { PomoType } from "$lib/session/types";
import { DateTime } from "luxon";
import { db } from "../../db/db";

interface FocusTimeCounter {
    per_task: TaskTimeCount[];
    no_task: number;
}

interface TaskTimeCount {
    task_id: string;
    task_title: string;
    time: number;
}

export async function get_stats_day(day: DateTime, pomo_type: PomoType): Promise<FocusTimeCounter> {
    const entries = await db.history.where('date_finished').between(
        day.startOf('day').toJSDate(),
        day.endOf('day').toJSDate()
    ).and(entry => entry.pomo_type == pomo_type).toArray();

    const counter: FocusTimeCounter = {
        per_task: [],
        no_task: 0
    }

    for (const entry of entries) {
        if (entry.task_id) {
            const task = await db.tasks.where('id').equals(entry.task_id).first();

            const task_time_count = counter.per_task.findIndex(task => task.task_id == entry.task_id);

            if (task_time_count == -1 && !task) {
                // Previous entries did not yet encounter this specific task id and it looks like the task has been deleted
                // We provide the user with a task name of "Unknown Task"
                counter.per_task.push({
                    task_id: entry.task_id,
                    task_title: 'Unknown task',
                    time: entry.time_real
                });
            } else if (task_time_count == -1 && task) {
                counter.per_task.push({
                    task_id: entry.task_id,
                    task_title: task.title,
                    time: entry.time_real
                });
            } else {
                // Previous entries already populated the `per_task` array with task details
                // We just need to update the `time`
                counter.per_task[task_time_count].time += entry.time_real;
            }
        } else {
            counter.no_task += entry.time_real;
        }
    }

    return counter;
}

export async function get_stats_week(day: DateTime, pomo_type: PomoType): Promise<FocusTimeCounter> {
    const start_day = day.startOf('week');

    const counter: FocusTimeCounter = {
        per_task: [],
        no_task: 0
    }

    for (let i = 0; i <= 7; i++) {
        const day_stats = await get_stats_day(start_day.plus({ days: i }), pomo_type);

        counter.no_task += day_stats.no_task;

        for (const task of day_stats.per_task) {
            const task_index = counter.per_task.findIndex(task_entry => task.task_id == task_entry.task_id);

            if (task_index == -1) {
                counter.per_task.push(task);
            } else {
                counter.per_task[task_index].time += task.time;
            }
        }
    }

    return counter;
}

export type SeriesType = { id: string, stack: string, name: string, type: string }[];
export type SourceType = (string | number)[][];
export type LegendType = {name: string}[];
export async function get_stats_week_echarts(day: DateTime, pomo_type: PomoType): Promise<[SourceType, SeriesType, LegendType]> {
    const start_day = day.startOf('week');

    const source: SourceType = [
        ['day']
    ];

    const series: SeriesType = [];
    series.push({
        id: 'NO_TASK',
        stack: 'x',
        name: 'No Task',
        type: 'bar',
    });

    const legend = [{ name: "No Task" }];

    for (let i = 0; i < 7; i++) {
        source[i+1] = [start_day.plus({ days: i }).toISODate()!];
        const day_stats = await get_stats_day(start_day.plus({ days: i }), pomo_type);

        source[0][1] = 'No Task';
        source[i+1][1] = day_stats.no_task / 3600;

        for (const task of day_stats.per_task) {
            const task_index = day_stats.per_task.findIndex(task_entry => task.task_id == task_entry.task_id);

            if (!series.some(s => s.id == task.task_id)) {
                series.push({
                    id: task.task_id,
                    stack: 'x',
                    name: task.task_title,
                    type: 'bar',
                });
                legend.push({ name: task.task_title });

                if (!source[0][task_index + 2]) {
                    source[0][task_index + 2] = task.task_title;
                }
                source[i+1][task_index + 2] = task.time / 3600;
            }
        }
    }

    return [source, series, legend];
}