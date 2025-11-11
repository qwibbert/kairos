import { db } from '../db/db';

export enum TimerFinishSound {
	NONE = "none",
	EIGHT_BIT = "8bit",
	EIGHT_BIT_2 = "8bit_2",
	EIGHT_BIT_3 = "8bit_3",
	AIRPLANE = "airplane",
	CHICKEN = "chicken",
	COWBELL = "cowbell",
	GLASS = "glass",
	GLOCKENSPIEL = "glockenspiel",
	GONG = "gong",
	MAGIC = "magic",
	METRO = "metro",
	METRO_2 = "metro_2",
	MYSTERY = "mystery",
	NIGHTMARE = "nightmare",
	ROBOT = "robot",
	SWEET = "sweet",
	TOASTER = "toaster",
	CLOCK = "clock"
}

const button_sound = new Audio('sounds/click.wav');
const timer_tick_sound = new Audio('sounds/tick.wav');
let timer_finish_sound: HTMLAudioElement | null = null;

db.settings.findOne({ selector: { id: { $eq: "1" } } }).$.subscribe((s) => {
	if (s?.timer_finish_sound && s.timer_finish_sound != "none" ) {
		timer_finish_sound = new Audio(`sounds/timer_finish/${s.timer_finish_sound}.mp3`);
	} else {
		timer_finish_sound = null;
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

export async function play_timer_tick_sound() {
	const enabled = (await db.settings.get_setting('timer_tick_sound')) ?? true;
	const volume = (await db.settings.get_setting('timer_tick_sound_volume')) ?? 100;

	if (enabled) {
		timer_tick_sound.volume = volume / 100;
		timer_tick_sound.play();
	}
}

export async function play_timer_finish_sound() {
	const volume = (await db.settings.get_setting('timer_finish_sound_volume')) ?? 100;

	if (timer_finish_sound) {
		timer_finish_sound.volume = volume / 100;
		timer_finish_sound.play();
	}
}
