import { db } from './db';

export enum Theme {
	LIGHT = 'light',
	DARK = 'dark',
	CUPCAKE = 'cupcake',
	BUMBLEBEE = 'bumblebee',
	EMERALD = 'emerald',
	CORPORATE = 'corporate',
	SYNTHWAVE = 'synthwave',
	RETRO = 'retro',
	CYBERPUNK = 'cyberpunk',
	VALENTINE = 'valentine',
	HALLOWEEN = 'halloween',
	GARDEN = 'garden',
	FOREST = 'forest',
	AQUA = 'aqua',
	LOFI = 'lofi',
	PASTEL = 'pastel',
	FANTASY = 'fantasy',
	WIREFRAME = 'wireframe',
	BLACK = 'black',
	LUXURY = 'luxury',
	DRACULA = 'dracula',
	CMYK = 'cmyk',
	AUTUMN = 'autumn',
	BUSINESS = 'business',
	ACID = 'acid',
	LEMONADE = 'lemonade',
	NIGHT = 'night',
	COFFEE = 'coffee',
	WINTER = 'winter',
	DIM = 'dim',
	NORD = 'nord',
	SUNSET = 'sunset',
	CARAMELLATTE = 'caramellatte',
	ABYSS = 'abyss',
	SILK = 'silk',
}

interface Settings {
	pomo_time: number;
	short_break_time: number;
	long_break_time: number;
	ui_sounds: boolean;
	timer_tick_sound: boolean;
	timer_finish_sound: boolean;
	ui_sounds_volume: number;
	timer_tick_sound_volume: number;
	timer_finish_sound_volume: number;
	theme_inactive: string;
	theme_active: string;
}

export const DEFAULT_SETTINGS: Record<SettingsKey, number | string | boolean> = {
	pomo_time: 25 * 60,
	short_break_time: 5 * 60,
	long_break_time: 15 * 60,
	ui_sounds: true,
	timer_tick_sound: true,
	timer_finish_sound: true,
	ui_sounds_volume: 100,
	timer_tick_sound_volume: 100,
	timer_finish_sound_volume: 100,
	theme_inactive: Theme.LIGHT,
	theme_active: Theme.DARK,
};

export type SettingType = string | number | boolean;

export enum SettingsKey {
	pomo_time = 'pomo_time',
	short_break_time = 'short_break_time',
	long_break_time = 'long_break_time',

	ui_sounds = 'ui_sounds',
	ui_sounds_volume = 'ui_sounds_volume',

	timer_tick_sound = 'timer_tick_sound',
	timer_tick_sound_volume = 'timer_tick_sound_volume',

	timer_finish_sound = 'timer_finish_sound',
	timer_finish_sound_volume = 'timer_finish_sound_volume',

	theme_active = 'theme_active',
	theme_inactive = 'theme_inactive',
}

export async function get_settings(): Promise<Settings | void> {
	const settings_db = await db.settings.toArray();

	if (settings_db.length == 0) {
		return DEFAULT_SETTINGS;
	} else if (settings_db.length == 1) {
		return settings_db[0];
	} else {
		throw new Error('Multiple settings entries exist. Only one entry allowed.');
	}
}
