import type { StatsManager } from "./db.svelte";

export interface Stats {
    focus_sessions: number;
    pause_sessions: number;
    total_sessions: number;

    time_total: number;
    time_focus: number;
    time_pause: number;

    per_day: Array<{
        date: string;
        focus_sessions: number;
        pause_sessions: number;
        total_sessions: number;
        time_total: number;
        time_focus: number;
        time_pause: number;
        per_task: Array<{
            task_id: string;
            task_title: string;
            focus_sessions: number;
            pause_sessions: number;
            total_sessions: number;
            time_total: number;
            time_focus: number;
            time_pause: number;

        }>;
    }>;

    per_task: Array<{
        task_id: string;
        focus_sessions: number;
        pause_sessions: number;
        total_sessions: number;
        time_total: number;
        time_focus: number;
        time_pause: number;
    }>;
}

export interface StatsContext {
    stats: StatsManager;
}