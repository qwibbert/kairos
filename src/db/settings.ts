import { db } from './db';

export enum Theme {
    LIGHT = "light",
    DARK = "dark",
    CUPCAKE = "cupcake",
    BUMBLEBEE = "bumblebee",
    EMERALD = "emerald",
    CORPORATE = "corporate",
    SYNTHWAVE = "synthwave",
    RETRO = "retro",
    CYBERPUNK = "cyberpunk",
    VALENTINE = "valentine",
    HALLOWEEN = "halloween",
    GARDEN = "garden",
    FOREST = "forest",
    AQUA = "aqua",
    LOFI = "lofi",
    PASTEL = "pastel",
    FANTASY = "fantasy",
    WIREFRAME = "wireframe",
    BLACK = "black",
    LUXURY = "luxury",
    DRACULA = "dracula",
    CMYK = "cmyk",
    AUTUMN = "autumn",
    BUSINESS = "business",
    ACID = "acid",
    LEMONADE = "lemonade",
    NIGHT = "night",
    COFFEE = "coffee",
    WINTER = "winter",
    DIM = "dim",
    NORD = "nord",
    SUNSET = "sunset",
    CARAMELLATTE = "caramellatte",
    ABYSS = "abyss",
    SILK = "silk"
}


export const DEFAULT_SETTINGS = {
    pomo_time: 25 * 60,
    short_break_time: 5 * 60,
    long_break_time: 15 * 60,
    ui_sounds: true,
    tick_sound: true,
    ui_sounds_volume: 100,
    tick_sound_volume: 100,
    theme_inactive: Theme.LIGHT,
    theme_active: Theme.DARK
};

export type SettingType = string | number | boolean;

export enum SettingsKey {
  pomo_time = 'pomo_time',
  short_break_time = 'short_break_time',
  long_break_time = 'long_break_time',

  ui_sounds = 'ui_sounds',
  ui_sounds_volume = 'ui_sounds_volume',

  tick_sound = 'tick_sound',
  tick_sound_volume = 'tick_sound_volume',

  theme_active = 'theme_active',
  theme_inactive = 'theme_inactive',
}

export async function get_setting(key: SettingsKey): Promise<SettingType> {
  return await db.settings.get(key).then(setting => setting?.value ?? DEFAULT_SETTINGS[key]);
}