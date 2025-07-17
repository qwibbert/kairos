import type { VineID } from "$features/vines/types";
import { ErrorBase } from "$lib/errors";
import { db } from "../../db/db";
import { add_history_entry, HistoryError, update_history_entry } from "../../db/history";
import { DEFAULT_SETTINGS, get_setting, SettingsKey } from "../../db/settings";
import { PomoType, SessionStatus, type Pauses } from "./types";

type ErrorName =
    | 'INVALID_TIME'
    | 'ACTIVE'
    | 'NOT_ACTIVE'
    | 'FINISHED'
    | 'NOT_PRESENT'
    | 'NO_VINE_WITH_ID'
    | 'OTHER';

export class SessionError extends ErrorBase<ErrorName> { }

export class Session {
    uuid = crypto.randomUUID() as string;
    status = $state(SessionStatus.Inactive);
    pomo_type = $state<PomoType>(PomoType.Pomo);
    target_time = $state<number>(0);
    elapsed_time = $state<Map<string, number>>(new Map([[(new Date()).toDateString(), 0]]));
    pauses: Pauses[] = [];
    cycle = 1;
    interval = 0;
    time_end = 0;
    minutes = $state(0);
    seconds = $state(0);
    vine_id = $state<VineID | undefined>(undefined);
    created_at = new Date();
    paused_at?: Date | undefined;

    constructor(pomo_type: PomoType, time: number) {
        if (time <= 0) {
            throw new SessionError({ name: 'INVALID_TIME', message: `Provided time should be larger than 0 seconds (${time}).` });
        } else if (time > 999 * 60) {
            throw new SessionError({ name: 'INVALID_TIME', message: `Provided time should be less than or equal 999 minutes (${time}).` });
        }

        this.pomo_type = pomo_type;
        this.target_time = time;
        this.minutes = Math.floor(time / 60);
        this.seconds = time % 60;
    }

    start = async () => {
        if (this.status == SessionStatus.Ready) {
            throw new SessionError({ name: 'FINISHED', message: 'Tried to start a session that is already finished.' });
        } else if (this.status == SessionStatus.Skipped) {
            throw new SessionError({ name: 'FINISHED', message: 'Tried to start a session that was skipped.' });
        } else if (this.status == SessionStatus.Active) {
            throw new SessionError({ name: 'ACTIVE', message: 'Tried to start as session that is already active.' });
        }

        if (this.target_time <= 0) {
            throw new SessionError({
                name: 'INVALID_TIME',
                message: `Tried to start a session with a target time ${this.target_time == 0 ? 'equal to' : 'less than'} zero (${this.target_time})`
            });
        }

        if (this.interval != 0) clearInterval(this.interval);

        if (this.status == SessionStatus.Paused && this.paused_at) {
            console.debug('Paused session detected, saving pause duration and adjusting end time.');

            const now = Date.now();
            this.pauses.push({ timestamp: this.paused_at, duration: Math.floor((now - this.paused_at.getTime()) / 1000) });
            this.time_end = now + ((this.target_time - elapsed_time_sum(this.elapsed_time)) * 1000);
        } else if (this.status == SessionStatus.Interrupted) {
            console.debug('Interrupted session detected, adjusting end time.')
            const now = Date.now();
            this.time_end = now + ((this.target_time - elapsed_time_sum(this.elapsed_time)) * 1000);
        } else {
            const now = Date.now();
            this.time_end = now + (this.target_time * 1000);
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
            if (this.target_time <= 0) {
                throw new SessionError({
                    name: 'INVALID_TIME',
                    message: `Tried to start a session with a target time ${this.target_time == 0 ? 'equal to' : 'less than'} zero (${this.target_time})`
                });
            }

            const seconds_left = Math.max(0, Math.round((this.time_end - Date.now()) / 1000));

            this.minutes = Math.floor(seconds_left / 60)
            this.seconds = seconds_left % 60;

            const today = new Date().toDateString();

            // We use a calculated delta_t here instead of the timer interval of one second to ignore inaccuracies of the setInterval API
            const delta_t = this.target_time - seconds_left - elapsed_time_sum(this.elapsed_time);

            this.elapsed_time.set(today, (this.elapsed_time.get(today) ?? 0) + delta_t);

            await tick_sound();

            document.title = `${this.minutes}:${this.seconds < 10 ? '0' : ''}${this.seconds} | Kairos`;

            await update_history_entry(this.uuid, { elapsed_time: this.elapsed_time });

            if (seconds_left < 1) {
                console.debug(`Session ${this.uuid} finished.`)
                this.status = SessionStatus.Ready;
                clearInterval(this.interval);
                document.title = `Kairos`;
                await timer_sound();
                await update_history_entry(this.uuid, { status: this.status, date_finished: new Date() });
                await this.next();
            }
        }, 1000)
    }

    pause = async () => {
        if (this.status != SessionStatus.Active) {
            throw new SessionError({ name: 'NOT_ACTIVE', message: 'Tried to pause a session that is not active.' });
        }

        await click_sound();

        clearInterval(this.interval);

        this.status = SessionStatus.Paused;
        this.paused_at = new Date();

        await update_history_entry(this.uuid, { status: this.status, paused_at: this.paused_at });
    }

    skip = async () => {
        if (this.status == SessionStatus.Ready) {
            throw new SessionError({ name: 'FINISHED', message: 'Tried to skip a session that has already finished.' });
        }

        if (this.status == SessionStatus.Paused && this.paused_at) {
            this.pauses.push({ timestamp: this.paused_at, duration: Math.floor((Date.now() - this.paused_at.getTime()) / 1000) });
        }

        clearInterval(this.interval);

        this.status = SessionStatus.Skipped;

        await update_history_entry(this.uuid, { status: this.status, pauses: $state.snapshot(this.pauses), date_finished: new Date() });

        await this.next();
    }

    next = async () => {
        console.debug('Preparing next session.');

        this.uuid = crypto.randomUUID();
        this.status = SessionStatus.Inactive;
        this.elapsed_time = new Map();
        this.target_time = 0;
        this.created_at = new Date();
        this.paused_at = undefined;

        this.pauses = [];

        const long_break_time = await get_setting(SettingsKey.long_break_time) ?? DEFAULT_SETTINGS.long_break_time;

        const short_break_time = await get_setting(SettingsKey.short_break_time) ?? DEFAULT_SETTINGS.short_break_time;

        const pomo_time = await get_setting(SettingsKey.pomo_time) ?? DEFAULT_SETTINGS.pomo_time;

        if (this.pomo_type == PomoType.Pomo) {
            if (this.cycle > 0 && (this.cycle % 4) == 0) {
                console.debug('Long break cycle.');
                this.pomo_type = PomoType.LongBreak;
                this.target_time = long_break_time as number;
            } else {
                console.debug('Short break cycle.');
                this.pomo_type = PomoType.ShortBreak;
                this.target_time = short_break_time as number;
            }
        } else if (this.pomo_type == PomoType.ShortBreak || this.pomo_type == PomoType.LongBreak) {
            console.debug('Pomo cycle.');
            this.pomo_type = PomoType.Pomo;
            this.target_time = pomo_time as number;
            this.cycle += 1;
        }

        this.minutes = Math.floor(this.target_time / 60)
        this.seconds = this.target_time % 60;
    }

    switch_vine = async (vine_id: string | undefined) => {
        if (vine_id && !(await db.vines.get(vine_id))) {
            throw new SessionError({ name: 'NO_VINE_WITH_ID', message: 'Tried to switch to a vine that doesn\'t exist.' });
        }

        this.vine_id = vine_id;
        await update_history_entry(this.uuid, { vine_id }).catch((e: HistoryError) => {
            // A history entry would not yet have been created if the vine was changed while the session hasn't been started yet
            if (e.name != 'NOT_PRESENT') {
                throw e;
            }
        })
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

export const timer_sound = async () => {
    const timer_sound = await get_setting(SettingsKey.timer_sound) ?? DEFAULT_SETTINGS.timer_sound;

    const timer_sound_volume = await get_setting(SettingsKey.timer_sound_volume) ?? DEFAULT_SETTINGS.timer_sound_volume;

    if (timer_sound) {
        const audio = new Audio("sounds/timer.wav");
        audio.volume = timer_sound_volume as number / 100;
        audio.play();
    }
}

export const elapsed_time_sum = (elapsed_time: Map<string, number>) => {
    let sum = 0;

    elapsed_time.forEach(time => sum += time);

    return sum;
}