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

interface Instellingen {
    pomo_tijd: number,
    korte_pauze_tijd: number,
    lange_pauze_tijd: number,
    ui_geluiden: boolean,
    ui_geluiden_volume: number,
    tick_geluid: boolean,
    tick_geluid_volume: number,
    theme_inactive: Theme,
    theme_active: Theme
}

let instellingen = $state<Instellingen>({
    pomo_tijd: 25 * 60,
    korte_pauze_tijd: 5 * 60,
    lange_pauze_tijd: 15 * 60,
    ui_geluiden: true,
    tick_geluid: true,
    ui_geluiden_volume: 100,
    tick_geluid_volume: 100,
    theme_inactive: Theme.LIGHT,
    theme_active: Theme.DARK
});

export const set_pomo_tijd = (tijd: number) => {
    instellingen.pomo_tijd = tijd;
    save_instellingen();
}
export const set_korte_pauze_tijd = (tijd: number) => {
    instellingen.korte_pauze_tijd = tijd;
    save_instellingen();
}
export const set_lange_pauze_tijd = (tijd: number) => {
    instellingen.lange_pauze_tijd = tijd;
    save_instellingen();
}
export const set_ui_geluiden = (geluiden: boolean) => {
    instellingen.ui_geluiden = geluiden;
    save_instellingen();
}
export const set_tick_geluid = (geluid: boolean) => {
    instellingen.tick_geluid = geluid;
    save_instellingen();
}

export const set_ui_geluiden_volume = (volume: number) => {
    instellingen.ui_geluiden_volume = volume;
    save_instellingen();
}
export const set_tick_geluid_volume = (volume: number) => { 
    instellingen.tick_geluid_volume = volume;
    save_instellingen();
}

export const set_inactive_theme = (theme: Theme) => {
    instellingen.theme_inactive = theme;
    save_instellingen();
}

export const set_active_theme = (theme: Theme) => {
    instellingen.theme_active = theme;
    save_instellingen();
}

export const get_instellingen = () => {
    return instellingen;
}

export const save_instellingen = () => {
    localStorage.setItem("instellingen", JSON.stringify(instellingen));
}

export const restore_instellingen = () => {
    const lokale_instellingen = localStorage.getItem("instellingen");

    if (lokale_instellingen) {
        const lokale_instellingen_parsed = JSON.parse(lokale_instellingen) as Instellingen;

        instellingen.pomo_tijd = lokale_instellingen_parsed.pomo_tijd;
        instellingen.korte_pauze_tijd = lokale_instellingen_parsed.korte_pauze_tijd;
        instellingen.lange_pauze_tijd = lokale_instellingen_parsed.lange_pauze_tijd;
        instellingen.ui_geluiden = lokale_instellingen_parsed.ui_geluiden;
        instellingen.tick_geluid = lokale_instellingen_parsed.tick_geluid;
        instellingen.ui_geluiden_volume = lokale_instellingen_parsed.ui_geluiden_volume;
        instellingen.tick_geluid_volume = lokale_instellingen_parsed.tick_geluid_volume;
        instellingen.theme_inactive = lokale_instellingen_parsed.theme_inactive;
        instellingen.theme_active = lokale_instellingen_parsed.theme_active;
    } else {
        localStorage.setItem("instellingen", JSON.stringify(instellingen));
    }
}