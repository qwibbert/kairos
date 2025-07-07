import type { TaskID } from "$features/tasks/types";
import { db } from "../../db/db";
import { add_history_entry, restore_session_from_history, update_history_entry } from "../../db/history";
import { DEFAULT_SETTINGS, get_setting, SettingsKey } from "../../db/settings";
import { PomoType, SessionStatus, type Pauses } from "./types";

export class Session {
    uuid = crypto.randomUUID();
    date = new Date();
    status = $state(SessionStatus.Inactive);
    pomo_type = $state<PomoType>(PomoType.Pomo);
    time_aim = $state<number>(0);
    time_real = $state(0);
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

    start = async (pause_timestamp?: number) => {
        if (this.status == SessionStatus.Ready) {
            console.warn('Tried to start a session which is already active.');
            return;
        } else if (this.status == SessionStatus.Skipped) {
            console.warn('Tried to restart a skipped session');
            return;
        }

        const timer_sound = new Audio("sounds/timer.wav");

        if (this.interval != 0) clearInterval(this.interval);

        const now = Date.now();
        if (this.status == SessionStatus.Paused && pause_timestamp) {
            console.debug('Paused session detected, saving pause duration and adjusting end time.');
            const entry = await restore_session_from_history();

            this.pauses.push({ timestamp: pause_timestamp, duration: Math.floor((now - pause_timestamp) / 1000), task: entry?.task_id});
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

        const history_entries = await db.history.where('id').equals(this.uuid).count();
        if (history_entries == 0) {
            await add_history_entry(this);
        } else if (history_entries > 1) {
            throw new Error("Duplicate history entries found!");
        } else {
            await update_history_entry(this.uuid, { status: this.status, pauses: $state.snapshot(this.pauses) })
        }

        this.interval = setInterval(async () => {
            const seconds_left = Math.max(0, Math.round((this.time_end - Date.now()) / 1000));

            this.minutes = Math.floor(seconds_left / 60)
            this.seconds = seconds_left % 60;

            this.time_real = this.time_aim - seconds_left;

            await tick_sound();

            document.title = `${this.minutes}:${this.seconds < 10 ? '0' : ''}${this.seconds} | Kairos`;

            await update_history_entry(this.uuid, { time_real: this.time_real });

            if (seconds_left < 1) {
                console.debug(`Session ${this.uuid} finished.`)
                timer_sound.currentTime = 0;
                timer_sound.play();
                this.status = SessionStatus.Ready;
                this.time_real = this.time_aim;
                clearInterval(this.interval);
                document.title = `Kairos`;
                await update_history_entry(this.uuid, {status: this.status, time_real: this.time_real, date_finished: new Date()});
                await this.next();
            }
        }, 1000)
    }

    pause = async () => {
        await click_sound();

        clearInterval(this.interval);

        if (this.status == SessionStatus.Ready) {
            console.warn(`Tried to pause a session which has already finished.`)
            return;
        }

        this.status = SessionStatus.Paused;

        await update_history_entry(this.uuid, { status: this.status });
    }

    skip = async (pause_timestamp?: number) => {
        if (this.status == SessionStatus.Ready) {
            console.warn(`Tried to skip a session which has already finished.`);
            return;
        }

        if (this.status == SessionStatus.Paused && pause_timestamp) {
            console.warn(`Skipping a paused session.`);
            this.pauses.push({ timestamp: pause_timestamp, duration: Math.floor((Date.now() - pause_timestamp) / 1000) });
        }

        clearInterval(this.interval);

        this.status = SessionStatus.Skipped;

        await update_history_entry(this.uuid, {status: this.status, pauses: $state.snapshot(this.pauses), date_finished: new Date()});

        await this.next();
    }

    next = async () => {
        console.debug('Preparing next session.');

        this.uuid = crypto.randomUUID();
        this.status = SessionStatus.Inactive;
        this.time_real = 0;
        this.time_aim = 0;
        this.date = new Date();

        this.pauses = [];

        const long_break_time = await get_setting(SettingsKey.long_break_time) ?? DEFAULT_SETTINGS.long_break_time;

        const short_break_time = await get_setting(SettingsKey.short_break_time) ?? DEFAULT_SETTINGS.short_break_time;

        const pomo_time = await get_setting(SettingsKey.pomo_time) ?? DEFAULT_SETTINGS.pomo_time;

        if (this.pomo_type == PomoType.Pomo) {
            if (this.cycle > 0 && (this.cycle % 4) == 0) {
                console.debug('Long break cycle.');
                this.pomo_type = PomoType.LongBreak;
                this.time_aim = long_break_time as number;
            } else {
                console.debug('Short break cycle.');
                this.pomo_type = PomoType.ShortBreak;
                this.time_aim = short_break_time as number;
            }
        } else if (this.pomo_type == PomoType.ShortBreak || this.pomo_type == PomoType.LongBreak) {
            console.debug('Pomo cycle.');
            this.pomo_type = PomoType.Pomo;
            this.time_aim = pomo_time as number;
        }

        this.minutes = Math.floor(this.time_aim / 60)
        this.seconds = this.time_aim % 60;
    }

    switch_task = async (task_id: string | undefined) => {
        console.debug(`Switching task to ${task_id}`);
        this.task_id = task_id;
        await update_history_entry(this.uuid, { task_id })
    }
}

export const click_sound = async () => {
    const ui_sounds = await get_setting(SettingsKey.ui_sounds) ?? DEFAULT_SETTINGS.ui_sounds;

    const ui_sounds_volume = await get_setting(SettingsKey.ui_sounds_volume) ?? DEFAULT_SETTINGS.ui_sounds_volume;

    if (ui_sounds) {
        console.debug('Playing Click sound.');
        const audio = new Audio("sounds/click.mp3");
        audio.volume = ui_sounds_volume as number / 100;
        audio.play();
    } else {
        console.debug('Skipped playing Click sound, user disabled this function');
    }
}

export const tick_sound = async () => {
    const tick_sound = await get_setting(SettingsKey.tick_sound) ?? DEFAULT_SETTINGS.tick_sound;

    const tick_sound_volume = await get_setting(SettingsKey.tick_sound_volume) ?? DEFAULT_SETTINGS.tick_sound_volume;

    if (tick_sound) {
        const audio = new Audio("sounds/tick.wav");
        audio.volume = tick_sound_volume as number / 100;
        audio.play();
    }
}