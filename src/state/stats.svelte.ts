import { DateTime, Interval } from 'luxon';
import { PomoType, SessionStatus, type Session } from "../state/session.svelte";

interface Stats {
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
    }>;
}

let stats_manager = $state<StatsManager>();

export const restore_stats = () => {
    if (!stats_manager) {
        stats_manager = new StatsManager();
        stats_manager.load();
    }
};

export const update_on_pause = (session: Session) =>
    stats_manager?.update_on_pause(session);

export const add_session = (session: Session) =>
    stats_manager?.add_session(session);

export const get_todayStats = () =>
    stats_manager?.get_todayStats()

export const get_week_focus_time = (earlier_weeks: number = 0) =>
    stats_manager?.get_week_focus_time(earlier_weeks);

export const get_stats = () =>
    stats_manager?.get_stats();


class StatsManager {
    private stats = $state<Stats>({
        focus_sessions: 0,
        pause_sessions: 0,
        total_sessions: 0,
        time_total: 0,
        time_focus: 0,
        time_pause: 0,
        per_day: []
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

    public update_on_pause(session: Session) {
        let elapsedTime = 0;

        const pauses = $state.snapshot(session.pauses);

        if (pauses.length == 0) {
            console.debug("No pauses found, adding elapsed time from session.");
            // On the first pause, we can just add the elapsed time
            elapsedTime = session.time_real;
        } else {
            console.debug("Pauses found, calculating elapsed time since last pause.");
            // If there are any previous pauses, we just need to update the time elapsed since the last pause
            const lastPause = pauses[pauses.length - 1];
            elapsedTime = Math.floor((Date.now() - lastPause.tijdstip - (lastPause.duur * 1000)) / 1000) - 1; // Substract 1 second to account for the pause itself
        }

        this.stats.time_total += elapsedTime;
        if (session.pomo_type == PomoType.Pomo) {
            this.stats.time_focus += elapsedTime;
        }
        else if (session.pomo_type == PomoType.ShortBreak || session.pomo_type == PomoType.LongBreak) {
            this.stats.time_pause += elapsedTime;
        }

        const dayKey = session.date.toDateString();
        const dayStats = this.stats.per_day.find(d => d.date == dayKey);

        if (dayStats) {
            console.debug("Updating existing day stats for", dayKey);
            dayStats.time_total += elapsedTime;
            dayStats.time_focus += session.pomo_type == PomoType.Pomo ? elapsedTime : 0;
            dayStats.time_pause += session.pomo_type == PomoType.ShortBreak || session.pomo_type == PomoType.LongBreak ? elapsedTime : 0;
        } else {
            console.debug("Creating new day stats for", dayKey);
            this.stats.per_day.push({
                date: dayKey,
                focus_sessions: 0,
                pause_sessions: 0,
                total_sessions: 0,
                time_total: elapsedTime,
                time_focus: session.pomo_type == PomoType.Pomo ? elapsedTime : 0,
                time_pause: session.pomo_type == PomoType.ShortBreak || session.pomo_type == PomoType.LongBreak ? elapsedTime : 0
            });
        }

        this.save();
    }

    public add_session(session: Session) {
        this.stats.total_sessions += 1;

        let time_real = session.time_real;

        const pauses = $state.snapshot(session.pauses);

        if (pauses.length > 0) {
            console.debug("Session has pauses, calculating real time.");
            // If there are pauses, we need to adjust the real time
            if (session.status != SessionStatus.Paused) {
                console.debug("Session is not paused, calculating time since last pause.");
                const lastPause = pauses[pauses.length - 1];
                time_real = Math.floor((Date.now() - lastPause.tijdstip - (lastPause.duur * 1000)) / 1000); // Convert milliseconds to seconds
            } else {
                console.debug("Session is paused, setting real time to 0.");
                // Since the session is paused, we can assume that the time has already been added to the stats
                // and we should not add it again.
                // This is to prevent double counting when the session is paused.
                time_real = 0;
            }
        }

        this.stats.time_total += time_real;

        if (session.pomo_type == PomoType.Pomo) {
            console.debug("Adding focus session.");
            this.stats.focus_sessions += 1;
            this.stats.time_focus += time_real;
        } else if (session.pomo_type == PomoType.LongBreak || session.pomo_type == PomoType.ShortBreak) {
            console.debug("Adding pause session.");
            this.stats.pause_sessions += 1;
            this.stats.time_pause += time_real;
        }

        const dayKey = session.date.toDateString();
        const dayStats = this.stats.per_day.find(d => d.date == dayKey);

        if (dayStats) {
            console.debug("Updating existing day stats for", dayKey);
            dayStats.focus_sessions += session.pomo_type == PomoType.Pomo ? 1 : 0;
            dayStats.pause_sessions += session.pomo_type == PomoType.ShortBreak || session.pomo_type == PomoType.LongBreak ? 1 : 0;
            dayStats.total_sessions += 1;
            dayStats.time_total += time_real;
            dayStats.time_focus += session.pomo_type == PomoType.Pomo ? time_real : 0;
            dayStats.time_pause += session.pomo_type == PomoType.ShortBreak || session.pomo_type == PomoType.LongBreak ? time_real : 0;
        } else {
            console.debug("Creating new day stats for", dayKey);
            this.stats.per_day.push({
                date: dayKey,
                focus_sessions: session.pomo_type == PomoType.Pomo ? 1 : 0,
                pause_sessions: session.pomo_type == PomoType.ShortBreak || session.pomo_type == PomoType.LongBreak ? 1 : 0,
                total_sessions: 1,
                time_total: time_real,
                time_focus: session.pomo_type == PomoType.Pomo ? time_real : 0,
                time_pause: session.pomo_type == PomoType.ShortBreak || session.pomo_type == PomoType.LongBreak ? time_real : 0
            });
        }

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
            time_pause: 0
        };
    }

    public get_week_focus_time(earlier_weeks: number = 0) {
        const today = DateTime.now();
        const weekStart = today.startOf('week').minus({ weeks: earlier_weeks });
        const weekEnd = today.endOf('week').minus({ weeks: earlier_weeks });
        const weekInterval = Interval.fromDateTimes(weekStart, weekEnd.plus({ days: 1 }));

        let days = [];
        for (let i = 0; i < 7; i++) {
            const day = weekStart.plus({ days: i });
            days.push(day.toISODate());
        }

        return [days, days.map(day => {
            const dayKey = weekStart.plus({ days: days.indexOf(day) }).toJSDate().toDateString();
            const dayStats = this.stats.per_day.find(d => d.date == dayKey);

            return dayStats ? dayStats.time_focus / 3600 : 0;
        })];
    }
    public get_stats() {
        return this.stats;
    }
}
