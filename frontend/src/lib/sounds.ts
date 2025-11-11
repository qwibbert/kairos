import { db } from '../db/db';

export enum TimerFinishSound {
	NONE = "none",
	EIGHT_BIT = "8bit",
	BELL = "bell",
	COWBELL = "cowbell",
	BIRD = "bird",
	GLOCKENSPIEL = "glockenspiel",
	GONG = "gong",
	MAGIC = "magic",
	GUITAR = "guitar",
	CHIMES = "chimes",
	ROOSTER = "rooster",
	CLASSIC = "classic"
}

export enum TimerActiveSound {
	NONE = "none",
	FAST = "fast",
	FOREST = "forest",
	NATURE = "nature",
	RAIN = "rain",
	TICK = "tick",
	RETRO = "retro",
	TICKTOCK = "ticktock",
	WALL_CLOCK = "wall_clock"
}

const button_sound = new Audio('sounds/click.wav');
let timer_active_sound: HTMLAudioElement | null = null;
let timer_finish_sound: HTMLAudioElement | null = null;

db.settings.findOne({ selector: { id: { $eq: "1" } } }).$.subscribe((s) => {
	if (s?.timer_finish_sound && s.timer_finish_sound != "none") {
		timer_finish_sound = new Audio(`sounds/timer_finish/${s.timer_finish_sound}.mp3`);
	} else {
		timer_finish_sound = null;
	}

	if (s?.timer_active_sound && s.timer_active_sound != "none") {
		timer_active_sound = new Audio(`sounds/timer_active/${s.timer_active_sound}.mp3`);
	} else {
		timer_active_sound = null;
	}
})

export async function play_button_sound() {
	const enabled = (await db.settings.get_setting('ui_sounds')) ?? true;
	const volume = (await db.settings.get_setting('ui_sounds_volume')) ?? 100;

	if (enabled) {
		button_sound.volume = volume / 100;
		button_sound.play();
	}
}

export async function play_timer_active_sound(preview?: boolean) {
	console.log(timer_active_sound)
	const volume = (await db.settings.get_setting('timer_active_sound_volume')) ?? 100;

	if (timer_active_sound) {
		timer_active_sound.volume = volume / 100;
		timer_active_sound.loop = true;
		timer_active_sound.play();

		if (preview) {
			setTimeout(() => {
				timer_active_sound.pause();
			}, 5000)
		}
	}
}

export function stop_timer_active_sound() {
	if (timer_active_sound) {
		timer_active_sound.pause();
	}
}

export async function play_timer_finish_sound() {
	const volume = (await db.settings.get_setting('timer_finish_sound_volume')) ?? 100;

	if (timer_finish_sound) {
		timer_finish_sound.volume = volume / 100;
		timer_finish_sound.play();
	}
}
