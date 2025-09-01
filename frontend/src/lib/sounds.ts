import { db } from '../db/db';

const button_sound = new Audio('sounds/click.wav');
const timer_tick_sound = new Audio('sounds/tick.wav');
const timer_finish_sound = new Audio('sounds/timer.wav');

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
	const enabled = (await db.settings.get_setting('timer_finish_sound')) ?? true;
	const volume = (await db.settings.get_setting('timer_finish_sound_volume')) ?? 100;

	if (enabled) {
		timer_finish_sound.volume = volume / 100;
		timer_finish_sound.play();
	}
}
