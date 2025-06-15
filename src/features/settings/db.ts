import { Theme, type Settings } from "./types";


export const DEFAULT_SETTINGS: Settings = {
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

export const set_pomo_time = (settings: Settings, time: number) => {
    settings.pomo_time = time;
    save_settings(settings);
}
export const set_short_break_time = (settings: Settings, time: number) => {
    settings.short_break_time = time;
    save_settings(settings);
}
export const set_long_break_time = (settings: Settings, time: number) => {
    settings.long_break_time = time;
    save_settings(settings);
}
export const set_ui_sounds = (settings: Settings, ui_sounds: boolean) => {
    settings.ui_sounds = ui_sounds;
    save_settings(settings);
}
export const set_tick_sound = (settings: Settings, tick_sound: boolean) => {
    settings.tick_sound = tick_sound;
    save_settings(settings);
}

export const set_ui_sound_volume = (settings: Settings, volume: number) => {
    settings.ui_sounds_volume = volume;
    save_settings(settings);
}
export const set_tick_sound_volume = (settings: Settings, volume: number) => {
    settings.tick_sound_volume = volume;
    save_settings(settings);
}

export const set_inactive_theme = (settings: Settings, theme: Theme) => {
    settings.theme_inactive = theme;
    save_settings(settings);
}

export const set_active_theme = (settings: Settings, theme: Theme) => {
    settings.theme_active = theme;
    save_settings(settings);
}

export const save_settings = (settings: Settings) => {
    localStorage.setItem("settings", JSON.stringify(settings));
}

export const retrieve_settings = () => {
    const local_settings = localStorage.getItem("settings");
    return local_settings ? JSON.parse(local_settings) as Settings : DEFAULT_SETTINGS;
}