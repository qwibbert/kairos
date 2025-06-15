import type { SettingsContext } from "$features/settings/types";
import type { StatsContext } from "$features/stats/types";
import type { TaskID, TasksContext } from "$features/tasks/types";
import { svelteStringify } from "$lib/utils";
import { PomoType, SessionStatus, type Pauses } from "./types";

export class Session {
    uuid = crypto.randomUUID();
    date = new Date();
    status = $state(SessionStatus.Inactive);
    pomo_type = $state<PomoType>();
    time_aim = $state<number>();
    time_real = $state(0);
    pause_timestamp = 0;
    pauses: Pauses[] = [];
    cycle = 0;
    interval = 0;
    time_end = 0;
    minutes = $state(0);
    seconds = $state(0);
    task_id = $state<TaskID | undefined>(undefined);

    constructor(pomo_type: PomoType, time: number) {
        this.pomo_type = pomo_type;
        this.time_aim = time;
        this.minutes = Math.floor(time / 60)
        this.seconds = time % 60;
    }

    start = (settings_context: SettingsContext, stats_context: StatsContext, tasks_context: TasksContext) => {
        click_sound(settings_context);
        const now = Date.now();

        if (this.status == SessionStatus.Ready) {
            console.warn('Tried to start a session which is already active.');
            return;
        } else if (this.status == SessionStatus.Skipped) {
            console.warn('Tried to restart a skipped session');
            return;
        }

        const timer_sound = new Audio("sounds/timer.wav");

        if (this.interval != 0) clearInterval(this.interval);

        if (this.status == SessionStatus.Paused) {
            console.debug('Paused session detected, saving pause duration and adjusting end time.')
            this.pauses.push({ timestamp: this.pause_timestamp, duration: Math.floor((now - this.pause_timestamp) / 1000) });
            this.pause_timestamp = 0;
            this.time_end = now + ((this.time_aim - this.time_real) * 1000);
        } else if (this.status == SessionStatus.Interrupted) {
            console.debug('Interrupted session detected, adjusting end time.')
            this.time_end = now + ((this.time_aim - this.time_real) * 1000);
        } else {
            this.time_end = now + (this.time_aim * 1000);
        }

        if (this.pomo_type == PomoType.Pomo) {
            this.cycle += 1;
            console.debug(`Adjusting Pomo cycle: ${this.cycle}`)
        }

        this.status = SessionStatus.Active;

        this.interval = setInterval(() => {
            const seconds_left = Math.max(0, Math.round((this.time_end - Date.now()) / 1000));

            this.minutes = Math.floor(seconds_left / 60)
            this.seconds = seconds_left % 60;

            this.time_real = this.time_aim - seconds_left;

            tick_sound(settings_context);

            document.title = `${this.minutes}:${this.seconds < 10 ? '0' : ''}${this.seconds} | Kairos`;

            if (seconds_left < 1) {
                console.debug(`Session ${this.uuid} finished.`)
                timer_sound.currentTime = 0;
                timer_sound.play();
                this.status = SessionStatus.Ready;
                this.time_real = this.time_aim;
                clearInterval(this.interval);
                document.title = `Kairos`;
                stats_context.stats.add_session(this, tasks_context.tasks);
                this.next(settings_context);
            }

            this.update_local_storage();
        }, 1000)
    }

    pause = (settings_context: SettingsContext, stats_context: StatsContext, tasks_context: TasksContext) => {
        click_sound(settings_context);

        clearInterval(this.interval);

        if (this.status == SessionStatus.Ready) {
            console.warn(`Tried to pause a session which has already finished.`)
            return;
        }

        const now = Date.now()
        this.pause_timestamp = now;
        this.status = SessionStatus.Paused;

        stats_context.stats.update_on_pause(this, tasks_context.tasks);

        this.update_local_storage();
    }

    skip = (settings_context: SettingsContext, stats_context: StatsContext, tasks_context: TasksContext) => {
        if (this.status == SessionStatus.Ready) {
            console.warn(`Tried to skip a session which has already finished.`);
            return;
        }

        if (this.status == SessionStatus.Paused) {
            console.warn(`Skipping a paused session.`);
            this.pauses.push({ timestamp: this.pause_timestamp, duration: Math.floor((Date.now() - this.pause_timestamp) / 1000) });
        }

        clearInterval(this.interval);

        this.status = SessionStatus.Skipped;

        stats_context.stats.add_session(this, tasks_context.tasks);

        this.next(settings_context);
    }

    next = (settings_context: SettingsContext) => {
        console.debug('Preparing next session.');
        this.save_history();
        this.clear_local();

        this.uuid = crypto.randomUUID();
        this.status = SessionStatus.Inactive;
        this.time_real = 0;
        this.time_aim = 0;
        this.date = new Date();
        this.pause_timestamp = 0;
        this.pauses = [];

        if (this.pomo_type == PomoType.Pomo) {
            if (this.cycle > 0 && (this.cycle % 4) == 0) {
                console.debug('Long break cycle.');
                this.pomo_type = PomoType.LongBreak;
                this.time_aim = settings_context.settings.long_break_time;
            } else {
                console.debug('Short break cycle.');
                this.pomo_type = PomoType.ShortBreak;
                this.time_aim = settings_context.settings.short_break_time;
            }
        } else if (this.pomo_type == PomoType.ShortBreak || this.pomo_type == PomoType.LongBreak) {
            console.debug('Pomo cycle.');
            this.pomo_type = PomoType.Pomo;
            this.time_aim = settings_context.settings.pomo_time;
        }

        this.minutes = Math.floor(this.time_aim / 60)
        this.seconds = this.time_aim % 60;
    }

    update_local_storage = () => {
        console.debug('Updating local session storage.')
        localStorage.setItem('session', svelteStringify(this));
    }

    switch_task = (task_id: string | undefined) => {
        console.debug(`Switching task to ${task_id}`);
        this.task_id = task_id;
        this.update_local_storage();
    }

    clear_local = () => {
        console.debug('Clearing local session storage.')
        localStorage.removeItem('session');
    }

    save_history = () => {
        console.debug('Saving history to local storage.');

        const history = localStorage.getItem('history');
        const session = {
            uuid: this.uuid,
            date: this.date,
            status: this.status,
            pomo_type: this.pomo_type,
            time_aim: this.time_aim,
            time_real: this.time_real,
            pause_timestamp: this.pause_timestamp,
            pauses: this.pauses,
            time_end: this.time_end,
        }

        if (history) {
            console.debug('History key exists, adding this session.')
            const history_parsed = JSON.parse(history) as Session[];

            localStorage.setItem('history', JSON.stringify([...history_parsed, session]));
        } else {
            console.debug('History key does not exist, adding key.')
            localStorage.setItem('history', JSON.stringify([session]));
        }
    }

    static restore_local = (): Session | null => {
        const local_session = localStorage.getItem('session');

        if (local_session) {
            const parsed_session = JSON.parse(local_session) as Session;

            const session = new Session(parsed_session.pomo_type, parsed_session.time_aim - parsed_session.time_real);

            session.time_aim = parsed_session.time_aim;
            session.time_real = parsed_session.time_real;
            session.uuid = parsed_session.uuid;
            session.date = new Date(parsed_session.date);
            session.status = parsed_session.status;
            session.pause_timestamp = parsed_session.pause_timestamp;
            session.pauses = parsed_session.pauses;

            return session;

        } else {
            return null;
        }
    }
}

export const click_sound = (settings_context: SettingsContext) => {
    if (settings_context.settings.ui_sounds) {
        console.debug('Playing Click sound.');
        const audio = new Audio("sounds/click.mp3");
        audio.volume = settings_context.settings.ui_sounds_volume / 100;
        audio.play();
    } else {
        console.debug('Skipped playing Click sound, user disabled this function');
    }
}

export const tick_sound = (settings_context: SettingsContext) => {
    if (settings_context.settings.tick_sound) {
        const audio = new Audio("sounds/tick.wav");
        audio.volume = settings_context.settings.tick_sound_volume / 100;
        audio.play();
    }
}