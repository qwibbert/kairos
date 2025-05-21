interface Instellingen {
    pomo_tijd: number,
    korte_pauze_tijd: number,
    lange_pauze_tijd: number,
    ui_geluiden: boolean,
    ui_geluiden_volume: number,
    tick_geluid: boolean,
    tick_geluid_volume: number,
}

let instellingen = $state<Instellingen>({
    pomo_tijd: 25 * 60,
    korte_pauze_tijd: 5 * 60,
    lange_pauze_tijd: 15 * 60,
    ui_geluiden: true,
    tick_geluid: true,
    ui_geluiden_volume: 100,
    tick_geluid_volume: 100,
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
    } else {
        localStorage.setItem("instellingen", JSON.stringify(instellingen));
    }
}