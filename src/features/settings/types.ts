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

export interface Settings {
    pomo_time: number,
    short_break_time: number,
    long_break_time: number,
    ui_sounds: boolean,
    ui_sounds_volume: number,
    tick_sound: boolean,
    tick_sound_volume: number,
    theme_inactive: Theme,
    theme_active: Theme
}

export interface SettingsContext {
    settings: Settings;
}