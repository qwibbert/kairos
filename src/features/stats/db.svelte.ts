import { get_parent_nodes_from_flat_list } from "$features/tasks/db";
import type { Task } from "$features/tasks/types";
import { type Session } from "$lib/session/session.svelte";
import { PomoType, SessionStatus } from "$lib/session/types";
import { DateTime } from "luxon";
import type { Stats } from "./types";

export class StatsManager {
    private stats = $state<Stats>({
        focus_sessions: 0,
        pause_sessions: 0,
        total_sessions: 0,
        time_total: 0,
        time_focus: 0,
        time_pause: 0,
        per_day: [],
        per_task: []
    });

    public load() {
        const storedStats = localStorage.getItem('stats');
        if (storedStats) {
            console.debug("Restoring stats from local storage.");
            this.stats = JSON.parse(storedStats);
        }
    }

    private save() {
        console.debug("Saving stats to local storage.");
        localStorage.setItem('stats', JSON.stringify(this.stats));
    }

    public update_on_pause(session: Session, tasks: Task[]) {
        this.update_stats(session, tasks);
        this.save();
    }

    public add_session(session: Session, tasks: Task[]) {
        this.update_stats(session, tasks);

        this.save();
    }

    public get_todayStats() {
        const todayKey = new Date().toDateString();
        return this.stats.per_day.find(d => d.date == todayKey) || {
            date: todayKey,
            focus_sessions: 0,
            pause_sessions: 0,
            total_sessions: 0,
            time_total: 0,
            time_focus: 0,
            time_pause: 0,
            per_task: []
        };
    }


    public get_task_stats(task_id: string) {
        const taskStats = this.stats.per_task.find(t => t.task_id == task_id);
        if (taskStats) {
            return taskStats;
        } else {

            return {
                task_id,
                focus_sessions: 0,
                pause_sessions: 0,
                total_sessions: 0,
                time_total: 0,
                time_focus: 0,
                time_pause: 0
            };
        }
    }

    public get_week_focus_time(earlier_weeks: number = 0) {
        const today = DateTime.now();
        const weekStart = today.startOf('week').minus({ weeks: earlier_weeks });

        const source = [
            ['day']
        ];

        const series = [];

        const tasks = [];
        for (let i = 0; i < 7; i++) {
            const day = weekStart.plus({ days: i });
            source[i + 1] = [day.toISODate()];

            const dayKey = weekStart.plus({ days: i }).toJSDate().toDateString();

            let dayStats = this.stats.per_day.find(d => d.date == dayKey);

            if (dayStats && !dayStats.per_task) {
                console.warn('Client is using an older version of the stats format, updating...');

                dayStats.per_task = [
                    {
                        task_id: 'NO_TASK',
                        task_title: 'Geen taak',
                        focus_sessions: dayStats.focus_sessions,
                        pause_sessions: dayStats.pause_sessions,
                        total_sessions: dayStats.total_sessions,
                        time_total: dayStats.time_total,
                        time_focus: dayStats.time_focus,
                        time_pause: dayStats.time_pause
                    }];

                if (!this.stats.per_task) {
                    this.stats.per_task = [{
                        task_id: 'NO_TASK',
                        focus_sessions: dayStats.focus_sessions,
                        pause_sessions: dayStats.pause_sessions,
                        total_sessions: dayStats.total_sessions,
                        time_total: dayStats.time_total,
                        time_focus: dayStats.time_focus,
                        time_pause: dayStats.time_pause
                    }];
                } else if (!this.stats.per_task.some(t => t.task_id == 'NO_TASK')) {
                    this.stats.per_task.push({
                        task_id: 'NO_TASK',
                        focus_sessions: dayStats.focus_sessions,
                        pause_sessions: dayStats.pause_sessions,
                        total_sessions: dayStats.total_sessions,
                        time_total: dayStats.time_total,
                        time_focus: dayStats.time_focus,
                        time_pause: dayStats.time_pause
                    });
                }
                else {
                    this.stats.per_task = this.stats.per_task.map(t => {
                        if (t.task_id == 'NO_TASK' && dayStats) {
                            return {
                                ...t,
                                focus_sessions: t.focus_sessions + dayStats.focus_sessions,
                                pause_sessions: t.pause_sessions + dayStats.pause_sessions,
                                total_sessions: t.total_sessions + dayStats.total_sessions,
                                time_total: t.time_total + dayStats.time_total,
                                time_focus: t.time_focus + dayStats.time_focus,
                                time_pause: t.time_pause + dayStats.time_pause
                            };
                        }
                        return t;
                    });
                }

                this.stats.per_day = this.stats.per_day.map(d => d.date == dayKey ? dayStats : d);
                this.save();
            } else if (!dayStats) {
                dayStats = {
                    date: dayKey,
                    focus_sessions: 0,
                    pause_sessions: 0,
                    total_sessions: 0,
                    time_total: 0,
                    time_focus: 0,
                    time_pause: 0,
                    per_task: [{
                        task_id: 'NO_TASK',
                        task_title: 'Geen taak',
                        focus_sessions: 0,
                        pause_sessions: 0,
                        total_sessions: 0,
                        time_total: 0,
                        time_focus: 0,
                        time_pause: 0
                    }]
                }
            }

            dayStats?.per_task.forEach(task => {
                if (!series.some(s => s.id == task.task_id)) {
                    series.push({
                        id: task.task_id,
                        stack: 'x',
                        name: task.task_title || 'Onbekende taak',
                        color: '#' + Math.floor(Math.random() * 16777215).toString(16), // Random color for each task
                        type: 'bar'
                    });

                    tasks.push(task);
                }
            });

        }

        // Now check for every day in the week if there are tasks that where worked on that day, then add them to the first row of the source array
        // and aggregate the time spent on each task for that day
        tasks.forEach((task, task_index) => {
            for (let i = 0; i < 7; i++) {
                const day = weekStart.plus({ days: i });
                const dayKey = day.toJSDate().toDateString();
                const dayStats = this.stats.per_day.find(d => d.date == dayKey);

                if (dayStats) {
                    const taskStats = dayStats.per_task.find(t => t.task_id == task.task_id);

                    if (taskStats) {
                        if (!source[0][task_index + 1]) {
                            source[0][task_index + 1] = task.task_title || 'Onbekende taak';
                        }
                        source[i + 1][task_index + 1] = taskStats.time_focus / 3600; // Convert seconds to hours
                    } else {
                        if (!source[0][task_index + 1]) {
                            source[0][task_index + 1] = task.task_title || 'Onbekende taak';
                        }
                        source[i + 1][task_index + 1] = 0;
                    }
                } else {
                    if (!source[0][task_index + 1]) {
                        source[0][task_index + 1] = task.task_title || 'Onbekende taak';
                    }
                    source[i + 1][task_index + 1] = 0;
                }
            }
        });


        return [source, series];
    }

    public get_stats() {
        return this.stats;
    }

    private update_stats(session: Session, tasks: Task[]) {
        console.debug("Updating stats for session:", session.uuid);
        let real_time = 0;
        const pauses = session.pauses;

        if (session.status == SessionStatus.Paused) {
            console.debug("Session is paused, so we need to calculate the real time.");

            if (pauses.length == 0) {
                console.debug("No previous pauses found, time of session is correct.");
                // On the first pause, we can just add the elapsed time
                real_time = session.time_real;
            } else {
                console.debug("Previous pauses found, calculating elapsed time since last pause.");
                const lastPause = pauses[pauses.length - 1];
                real_time = Math.floor((Date.now() - lastPause.timestamp - (lastPause.duration * 1000)) / 1000);
            }
        } else {
            console.debug("Session is not paused or has been skipped during a pause, calculating real time based on session time.");
            const pauses = session.pauses;

            // Pause timestamp is set when the session is paused, so we can use it to determine if the session was skipped while paused
            const skipped_while_paused = session.pause_timestamp ? true : false;

            if (session.status == SessionStatus.Skipped && skipped_while_paused) {
                console.debug("Session has been skipped during a pause, so we assume the time is already added to the stats.");
                real_time = 0;
            } else if (pauses.length > 0) {
                console.debug("Session has pauses, calculating time since last pause.");
                const lastPause = pauses[pauses.length - 1];
                real_time = Math.floor((Date.now() - lastPause.timestamp - (lastPause.duration * 1000)) / 1000);
            } else {
                console.debug("Session has no pauses, using session time as real time.");
                real_time = session.time_real;
            }
        }

        if (session.pomo_type == PomoType.Pomo) {
            if (session.status != SessionStatus.Paused) {
                this.stats.focus_sessions += 1;
                this.stats.total_sessions += 1;
            }

            this.stats.time_focus += real_time;
        } else if (session.pomo_type == PomoType.LongBreak || session.pomo_type == PomoType.ShortBreak) {
            if (session.status != SessionStatus.Paused) {
                this.stats.pause_sessions += 1;
                this.stats.total_sessions += 1;
            }

            this.stats.time_pause += real_time;
        }

        if (session.task_id) {
            const parents = get_parent_nodes_from_flat_list(tasks, session.task_id);

            console.debug("Task has parents, updating stats for all parent tasks.");
            parents.forEach(parent => {
                const parentStats = this.stats.per_task.find(t => t.task_id == parent.id);
                if (parentStats) {
                    console.debug("Updating existing parent task stats for", parent.id);
                    parentStats.focus_sessions += session.pomo_type == PomoType.Pomo && session.status != SessionStatus.Paused ? 1 : 0;
                    parentStats.pause_sessions += (session.pomo_type == PomoType.ShortBreak || session.pomo_type == PomoType.LongBreak) && session.status != SessionStatus.Paused ? 1 : 0;
                    parentStats.total_sessions += session.status == SessionStatus.Paused ? 0 : 1;
                    parentStats.time_total += real_time;
                    parentStats.time_focus += session.pomo_type == PomoType.Pomo ? real_time : 0;
                    parentStats.time_pause += session.pomo_type == PomoType.ShortBreak || session.pomo_type == PomoType.LongBreak ? real_time : 0;
                } else {
                    console.debug("Creating new parent task stats for", parent.id);
                    this.stats.per_task.push({
                        task_id: parent.id,
                        focus_sessions: session.pomo_type == PomoType.Pomo && session.status != SessionStatus.Paused ? 1 : 0,
                        pause_sessions: (session.pomo_type == PomoType.ShortBreak || session.pomo_type == PomoType.LongBreak) && session.status != SessionStatus.Paused ? 1 : 0,
                        total_sessions: session.status != SessionStatus.Paused ? 1 : 0,
                        time_total: real_time,
                        time_focus: session.pomo_type == PomoType.Pomo ? real_time : 0,
                        time_pause: session.pomo_type == PomoType.ShortBreak || session.pomo_type == PomoType.LongBreak ? real_time : 0
                    });
                }
            });

            console.debug("Updating stats for the current task:", session.task_id);
            const taskStats = this.stats.per_task.find(t => t.task_id == session.task_id);

            if (taskStats) {
                console.debug("Updating existing task stats for", session.task_id);
                taskStats.focus_sessions += session.pomo_type == PomoType.Pomo && session.status != SessionStatus.Paused ? 1 : 0;
                taskStats.pause_sessions += (session.pomo_type == PomoType.ShortBreak || session.pomo_type == PomoType.LongBreak) && session.status != SessionStatus.Paused ? 1 : 0;
                taskStats.total_sessions += session.status != SessionStatus.Paused ? 1 : 0;
                taskStats.time_total += real_time;
                taskStats.time_focus += session.pomo_type == PomoType.Pomo ? real_time : 0;
                taskStats.time_pause += session.pomo_type == PomoType.ShortBreak || session.pomo_type == PomoType.LongBreak ? real_time : 0;
            } else {
                console.debug("Creating new task stats for", session.task_id);
                this.stats.per_task.push({
                    task_id: session.task_id,
                    focus_sessions: session.pomo_type == PomoType.Pomo && session.status != SessionStatus.Paused ? 1 : 0,
                    pause_sessions: (session.pomo_type == PomoType.ShortBreak || session.pomo_type == PomoType.LongBreak) && session.status != SessionStatus.Paused ? 1 : 0,
                    total_sessions: session.status != SessionStatus.Paused ? 1 : 0,
                    time_total: real_time,
                    time_focus: session.pomo_type == PomoType.Pomo ? real_time : 0,
                    time_pause: session.pomo_type == PomoType.ShortBreak || session.pomo_type == PomoType.LongBreak ? real_time : 0
                });
            }
        }

        const dayKey = session.date.toDateString();
        const dayStats = this.stats.per_day.find(d => d.date == dayKey);

        if (dayStats) {
            console.debug("Updating existing day stats for", dayKey);
            dayStats.focus_sessions += session.pomo_type == PomoType.Pomo && session.status != SessionStatus.Paused ? 1 : 0;
            dayStats.pause_sessions += (session.pomo_type == PomoType.ShortBreak || session.pomo_type == PomoType.LongBreak) && session.status != SessionStatus.Paused ? 1 : 0;
            dayStats.total_sessions += session.status != SessionStatus.Paused ? 1 : 0;
            dayStats.time_total += real_time;
            dayStats.time_focus += session.pomo_type == PomoType.Pomo ? real_time : 0;
            dayStats.time_pause += session.pomo_type == PomoType.ShortBreak || session.pomo_type == PomoType.LongBreak ? real_time : 0;

            if (session.task_id) {
                const task = tasks.find(task => task.id == session.task_id);

                if (!dayStats.per_task.some(t => t.task_id == session.task_id)) {
                    console.debug("Adding task stats to day's per_task for", session.task_id);
                    dayStats.per_task.push({
                        task_id: task!.id,
                        task_title: task!.title,
                        focus_sessions: session.pomo_type == PomoType.Pomo && session.status != SessionStatus.Paused ? 1 : 0,
                        pause_sessions: (session.pomo_type == PomoType.ShortBreak || session.pomo_type == PomoType.LongBreak) && session.status != SessionStatus.Paused ? 1 : 0,
                        total_sessions: session.status != SessionStatus.Paused ? 1 : 0,
                        time_total: real_time,
                        time_focus: session.pomo_type == PomoType.Pomo ? real_time : 0,
                        time_pause: session.pomo_type == PomoType.ShortBreak || session.pomo_type == PomoType.LongBreak ? real_time : 0
                    });
                } else {
                    console.debug("Updating existing task stats for", session.task_id, "in day's per_task");
                    const taskDayStats = dayStats.per_task.find(t => t.task_id == session.task_id);
                    if (taskDayStats) {
                        taskDayStats.focus_sessions += session.pomo_type == PomoType.Pomo && session.status != SessionStatus.Paused ? 1 : 0;
                        taskDayStats.pause_sessions += (session.pomo_type == PomoType.ShortBreak || session.pomo_type == PomoType.LongBreak) && session.status != SessionStatus.Paused ? 1 : 0;
                        taskDayStats.total_sessions += session.status != SessionStatus.Paused ? 1 : 0;
                        taskDayStats.time_total += real_time;
                        taskDayStats.time_focus += session.pomo_type == PomoType.Pomo ? real_time : 0;
                        taskDayStats.time_pause += session.pomo_type == PomoType.ShortBreak || session.pomo_type == PomoType.LongBreak ? real_time : 0;
                    }
                }
            }
        } else {
            console.debug("Creating new day stats for", dayKey);
            this.stats.per_day.push({
                date: dayKey,
                focus_sessions: session.pomo_type == PomoType.Pomo && session.status != SessionStatus.Paused ? 1 : 0,
                pause_sessions: (session.pomo_type == PomoType.ShortBreak || session.pomo_type == PomoType.LongBreak) && session.status != SessionStatus.Paused ? 1 : 0,
                total_sessions: session.status != SessionStatus.Paused ? 1 : 0,
                time_total: real_time,
                time_focus: session.pomo_type == PomoType.Pomo ? real_time : 0,
                time_pause: session.pomo_type == PomoType.ShortBreak || session.pomo_type == PomoType.LongBreak ? real_time : 0,
                per_task: session.task_id ? [{
                    task_id: session.task_id,
                    task_title: tasks.find(task => session.task_id == task.id)?.title || 'Onbekende taak',
                    focus_sessions: session.pomo_type == PomoType.Pomo && session.status != SessionStatus.Paused ? 1 : 0,
                    pause_sessions: (session.pomo_type == PomoType.ShortBreak || session.pomo_type == PomoType.LongBreak) && session.status != SessionStatus.Paused ? 1 : 0,
                    total_sessions: session.status != SessionStatus.Paused ? 1 : 0,
                    time_total: real_time,
                    time_focus: session.pomo_type == PomoType.Pomo ? real_time : 0,
                    time_pause: session.pomo_type == PomoType.ShortBreak || session.pomo_type == PomoType.LongBreak ? real_time : 0
                }] : []
            });
        }
    }
}
