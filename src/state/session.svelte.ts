import { svelteStringify } from "$lib/utils";
import { get_instellingen } from "./instellingen.svelte";
import { StatsManager } from "./stats.svelte";

export enum PomoType {
    Pomo = "POMO",
    ShortBreak = "SHORT_BREAK",
    LongBreak = "LONG_BREAK"
}

export enum SessionStatus {
    Active = "ACTIVE",
    Paused = "PAUSED",
    Ready = "READY",
    Inactive = "INACTIVE",
    Skipped = "SKIPPED",
    Interrupted = "INTERRUPTED",
}

export interface Pauzes {
    tijdstip: number,
    duur: number
}

export class Session {
    uuid: string;
    date = new Date();
    status = $state<SessionStatus>(SessionStatus.Inactive);
    pomo_type = $state<PomoType>(PomoType.Pomo);
    time_aim = $state<number>(0);
    time_real = $state<number>(0);
    pause_timestamp = $state<number>(0);
    pauses = $state<Pauzes[]>([]);
    cycle = $state<number>(0);
    interval = $state<number>(0);
    time_end = $state<number>(0);
    minutes = $state<number>(0);
    seconds = $state<number>(0);

    constructor(pomo_type: PomoType, time: number) {
        this.uuid = crypto.randomUUID();
        this.pomo_type = pomo_type;
        this.time_aim= time;
        this.minutes = Math.floor(time / 60)
        this.seconds = time % 60;
    }

    start = () => {
        click_sound();
        const now = Date.now();

        if (this.status == SessionStatus.Ready || this.status == SessionStatus.Skipped) {
            return;
        }

        const timer_sound = new Audio("sounds/timer.wav");

        if (this.interval != 0) clearInterval(this.interval);

        if (this.status == SessionStatus.Paused) {
            this.pauses.push({ tijdstip: this.pause_timestamp, duur: Math.floor((now - this.pause_timestamp) / 1000) });
            this.time_end = now + ((this.time_aim - this.time_real) * 1000);
        } else if (this.status == SessionStatus.Interrupted) {
            this.time_end = now + ((this.time_aim - this.time_real) * 1000);
        } else {
            this.time_end = now + (this.time_aim * 1000);
        }

        if (this.pomo_type == PomoType.Pomo) {
            this.cycle += 1;
        }

        this.status = SessionStatus.Active;

        const stats_manager = new StatsManager();

        this.interval = setInterval(() => {
            const seconds_left = Math.max(0, Math.round((this.time_end - Date.now()) / 1000));

            this.minutes = Math.floor(seconds_left / 60)
            this.seconds = seconds_left % 60;

            this.time_real = this.time_aim - seconds_left;

            tick_sound();

            document.title = `${this.minutes}:${this.seconds < 10 ? '0' : ''}${this.seconds} | Kairos`;

            if (seconds_left < 1) {
                timer_sound.currentTime = 0;
                timer_sound.play();
                this.status = SessionStatus.Ready;
                this.time_real = this.time_aim;
                clearInterval(this.interval);
                document.title = `Kairos`;
                stats_manager.add_session(this);
                this.next();
            }

            this.update_local_storage();
        }, 1000)
    }

    pause = () => {
        click_sound();

        clearInterval(this.interval);

        if (this.status == SessionStatus.Ready) {
            return;
        }

        const now = Date.now()
        this.pause_timestamp = now;
        this.status = SessionStatus.Paused;

        const stats_manager = new StatsManager();
        stats_manager.update_on_pause(this);

        this.update_local_storage();
    }

    skip = () => {
        if (this.status == SessionStatus.Ready) {
            return;
        }

        if (this.status == SessionStatus.Paused) {
            this.pauses.push({ tijdstip: this.pause_timestamp, duur: Math.floor((Date.now() - this.pause_timestamp) / 1000) });
        }

        clearInterval(this.interval);

        const stats_manager = new StatsManager();
        stats_manager.add_session(this);
        this.status = SessionStatus.Skipped;

        this.next();
    }

    next = () => {
        this.save_history();
        this.clear_local();

        this.uuid = crypto.randomUUID();
        this.status = SessionStatus.Inactive;
        this.time_aim = 0;
        this.date = new Date();
        this.pause_timestamp = 0;
        this.pauses = [];

        if (this.pomo_type == PomoType.Pomo) {
            if (this.cycle > 0 && (this.cycle % 4) == 0) {
                console.log(this.cycle % 4)
                this.pomo_type = PomoType.LongBreak;
                this.time_aim = get_instellingen().lange_pauze_tijd;
            } else {
                this.pomo_type = PomoType.ShortBreak;
                this.time_aim = get_instellingen().korte_pauze_tijd;
            }
        } else if (this.pomo_type == PomoType.ShortBreak || this.pomo_type == PomoType.LongBreak) {
            this.pomo_type = PomoType.Pomo;
            this.time_aim = get_instellingen().pomo_tijd;
        }

        this.minutes = Math.floor(this.time_aim / 60)
        this.seconds = this.time_aim % 60;
    }

    update_local_storage = () => {
        localStorage.setItem('session', svelteStringify(this));
    }

    clear_local = () => {
        localStorage.removeItem('session');
    }

    save_history = () => {
        const history = localStorage.getItem('history') as Session[] | null;
        const session = {
            uuid: this.uuid,
            date: this.date,
            status: $state.snapshot(this.status),
            pomo_type: $state.snapshot(this.pomo_type),
            time_aim: $state.snapshot(this.time_aim),
            time_real: $state.snapshot(this.time_real),
            pause_timestamp: $state.snapshot(this.pause_timestamp),
            pauses: $state.snapshot(this.pauses),
            time_end: $state.snapshot(this.time_end),
        }

        if (history) {
            const history_parsed = JSON.parse(history) as Session[];

            localStorage.setItem('history', JSON.stringify([...history_parsed, session]));
        } else {
            localStorage.setItem('history', JSON.stringify([session]));
        }
    }

    static restore_local = (): Session | null => {
        const local_session = localStorage.getItem('session');

        if (local_session) {
            const parsed_session = JSON.parse(local_session) as Session;


            let session = new Session(parsed_session.pomo_type, parsed_session.time_aim - parsed_session.time_real);

            session.time_aim = parsed_session.time_aim;
            session.time_real = parsed_session.time_real;
            session.uuid = parsed_session.uuid,
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

export const click_sound = () => {
    if (get_instellingen().ui_geluiden) {
        const audio = new Audio("sounds/click.mp3");
        audio.volume = get_instellingen().ui_geluiden_volume / 100;
        audio.play();
    }
}

export const tick_sound = () => {
    if (get_instellingen().tick_geluid) {
        const audio = new Audio("sounds/tick.wav");
        audio.volume = get_instellingen().tick_geluid_volume / 100;
        audio.play();
    }
}