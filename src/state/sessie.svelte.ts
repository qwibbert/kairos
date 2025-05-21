import { get_instellingen } from "./instellingen.svelte";
import { Timer, TimerStatus } from "./timer.svelte";


export enum PomoType {
    Pomo = "POMO",
    KortePauze = "KORTE_PAUZE",
    LangePauze = "LANGE_PAUZE"
}

export enum SessieStatus {
    Actief = "ACTIEF",
    Gepauzeerd = "GEPAUZEERD",
    Voltooid = "VOLTOOID",
    Inactief = "INACTIEF",
    Overgeslagen = "OVERGESLAGEN"
}

export interface Pauzering {
    tijdstip: number,
    duur: number
}

export class Sessie {
    uuid: string;
    datum = new Date();
    status = $state<SessieStatus>();
    pomo_type = $state<PomoType>(PomoType.Pomo);
    cyclus = $state<number>(0);
    beoogde_tijd = $state<number>(0);
    effectieve_tijd = $state<number>(0);
    timer = $state() as Timer;
    pauzering_tijdstip = $state<number>(0);
    pauzeringen = $state<Pauzering[]>([]);

    constructor(pomo_type: PomoType, tijd: number) {
        this.uuid = crypto.randomUUID();
        this.pomo_type = pomo_type;
        this.status = SessieStatus.Inactief;
        this.timer = new Timer(tijd);
        this.beoogde_tijd = tijd;
        this.effectieve_tijd = 0;
    }

    start = () => {
        if (get_instellingen().ui_geluiden) {
            (new Audio("sounds/click.mp3")).play();
        }

        if (this.status == SessieStatus.Voltooid) {
            return;
        }

        this.status = SessieStatus.Actief;
        this.timer.start(() => {
            if (this.pomo_type == PomoType.Pomo) {
                this.cyclus += 1;
            }

            this.status = SessieStatus.Voltooid;
            this.effectieve_tijd = this.beoogde_tijd;
            this.sla_lokaal_op();

            this.volgende();
        });
        this.sla_lokaal_op();
    }

    pauzeer = () => {
        if (get_instellingen().ui_geluiden) {
            (new Audio("sounds/click.mp3")).play();
        }

        if (this.status == SessieStatus.Voltooid) {
            return;
        }

        const nu = Date.now()
        this.pauzering_tijdstip = nu;
        this.status = SessieStatus.Gepauzeerd;
        this.effectieve_tijd = this.beoogde_tijd - Math.ceil((this.timer.eindtijd - Date.now()) / 1000);
        this.sla_lokaal_op();
        this.timer.stop();
    }

    hervat = () => {
        if (get_instellingen().ui_geluiden) {
            (new Audio("sounds/click.mp3")).play();
        }
        if (this.status == SessieStatus.Voltooid) {
            return;
        }

        const nu = Date.now();

        this.timer.reset(this.beoogde_tijd - this.effectieve_tijd);
        this.timer.start(() => {
            this.status = SessieStatus.Voltooid;
            this.effectieve_tijd = this.beoogde_tijd - Math.ceil((this.timer.eindtijd - Date.now()) / 1000);
            this.sla_lokaal_op();

            this.volgende();
        });
        this.pauzeringen.push({ tijdstip: this.pauzering_tijdstip, duur: Math.floor((nu - this.pauzering_tijdstip) / 1000) });
        this.pauzering_tijdstip = 0;
        this.status = SessieStatus.Actief;
        this.sla_lokaal_op();
    }

    sla_over = () => {
        if (this.status == SessieStatus.Voltooid) {
            return;
        }

        if (this.timer.status == TimerStatus.ACTIEF) {
            this.effectieve_tijd = this.beoogde_tijd - Math.ceil((this.timer.eindtijd - Date.now()) / 1000)
        }

        this.status = SessieStatus.Overgeslagen;

        this.sla_lokaal_op();
        this.timer.stop();

        this.volgende();
    }

    volgende = () => {
        this.uuid = crypto.randomUUID();
        this.status = SessieStatus.Inactief;
        this.effectieve_tijd = 0;
        this.datum = new Date();
        this.pauzering_tijdstip = 0;
        this.pauzeringen = [];

        if (this.pomo_type == PomoType.Pomo) {
            if (this.cyclus > 0 && (this.cyclus % 4) == 0) {
                console.log(this.cyclus % 4)
                this.pomo_type = PomoType.LangePauze;
                this.beoogde_tijd = get_instellingen().lange_pauze_tijd;
                this.timer = new Timer(get_instellingen().lange_pauze_tijd);
            } else {
                this.pomo_type = PomoType.KortePauze;
                this.beoogde_tijd = get_instellingen().korte_pauze_tijd;
                this.timer = new Timer(get_instellingen().korte_pauze_tijd);
            }
        } else if (this.pomo_type == PomoType.KortePauze) {
            this.pomo_type = PomoType.Pomo;
            this.beoogde_tijd = get_instellingen().pomo_tijd;
            this.timer = new Timer(get_instellingen().pomo_tijd);
        }
    }

    sla_lokaal_op = () => {
        const lokale_sessies = localStorage.getItem('sessies');
        const sessie_cloned = {
            datum: this.datum,
            uuid: this.uuid,
            status: $state.snapshot(this.status),
            pomo_type: $state.snapshot(this.pomo_type),
            beoogde_tijd: $state.snapshot(this.beoogde_tijd),
            effectieve_tijd: $state.snapshot(this.effectieve_tijd),
            pauzering_tijdstip: $state.snapshot(this.pauzering_tijdstip),
            pauzeringen: $state.snapshot(this.pauzeringen)
        }

        if (lokale_sessies) {
            const lokale_sessies_parsed = JSON.parse(lokale_sessies) as Sessie[];

            const huidige_sessie = lokale_sessies_parsed.find((s) => s.uuid == this.uuid);

            if (!huidige_sessie) {
                localStorage.setItem('sessies', JSON.stringify([...lokale_sessies_parsed, sessie_cloned]));

            } else {
                localStorage.setItem('sessies', JSON.stringify(lokale_sessies_parsed.map((s) => s.uuid == this.uuid ? sessie_cloned : s)));
            }
        } else {
            localStorage.setItem('sessies', JSON.stringify([sessie_cloned]));
        }
    }

    get_minuten = () => {
        return this.timer.minuten;
    }

    get_seconden = () => {
        return this.timer.seconden;
    }

    get_status = () => {
        return this.status;
    }

    static restore_lokaal = (): Sessie | null => {
        const lokale_sessies = localStorage.getItem('sessies');

        if (lokale_sessies) {
            const lokale_sessies_parsed = JSON.parse(lokale_sessies) as Sessie[];

            const actieve_lokale_sessies = lokale_sessies_parsed.filter(s => s.status == SessieStatus.Actief || s.status == SessieStatus.Gepauzeerd);
            const laatste_sessie = actieve_lokale_sessies[actieve_lokale_sessies.length - 1];

            if (laatste_sessie) {
                let sessie = new Sessie(laatste_sessie.pomo_type, laatste_sessie.beoogde_tijd - laatste_sessie.effectieve_tijd);

                sessie.beoogde_tijd = laatste_sessie.beoogde_tijd;
                sessie.effectieve_tijd = laatste_sessie.effectieve_tijd;
                sessie.uuid = laatste_sessie.uuid,
                    sessie.datum = new Date(laatste_sessie.datum);
                sessie.status = laatste_sessie.status;
                sessie.pauzering_tijdstip = laatste_sessie.pauzering_tijdstip;
                sessie.pauzeringen = laatste_sessie.pauzeringen;

                return sessie;

            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    static sommeer_studietijd = (datum: Date) => {
        const lokale_sessies = localStorage.getItem('sessies');

        if (lokale_sessies) {
            const lokale_sessies_parsed = JSON.parse(lokale_sessies) as Sessie[];

            return lokale_sessies_parsed.reduce((acc, sessie) => {
                const sessie_datum = new Date(sessie.datum);

                if (sessie.pomo_type == PomoType.Pomo && sessie_datum.getDate() == datum.getDate() && sessie_datum.getMonth() == datum.getMonth() && sessie_datum.getFullYear() == datum.getFullYear()) {
                    return acc + sessie.effectieve_tijd;
                }
                return acc;
            }, 0);
        } else {
            return 0;
        }
    }
}
