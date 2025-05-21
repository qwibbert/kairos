import { tick_sound } from "./sessie.svelte";

export enum TimerStatus {
    ACTIEF = "ACTIEF",
    GESTOPT = "GESTOPT"
}

export enum TimerFout {
    ACTIEF = "ACTIEF",
    GESTOPT = "GESTOPT",
    GEPAUZEERD = "GEPAUZEERD",
    GEEN_TIJD = "GEEN_TIJD",
    GEEN_SERVICE = "GEEN_SERVICE",
    INITIALISEER = "INITIALISEER",
    AFGELOPEN = "AFGELOPEN"
}

export type Seconden = number;
export type TijdOver = { minuten: number, seconden: number };

export class Timer {
    eindtijd = $state<number>(0);
    minuten = $state<number>(0);
    seconden = $state<number>(0);
    seconden_totaal = $state<number>(0);
    status = $state<TimerStatus>(TimerStatus.GESTOPT);
    private countdown = $state<number>(0);

    constructor(seconden: number) {
        this.seconden_totaal = seconden;
        this.minuten = Math.floor(seconden / 60);
        this.seconden = seconden % 60;
    }

    /**
     * Start de timer en werk de status regelmatig bij.
     * 
     * @param bij_voltooid - Een callbackfunctie die wordt uitgevoerd wanneer de timer voltooid is.
     * 
     * De timer berekent de eindtijd op basis van het totaal aantal seconden (`seconden_totaal`) 
     * en werkt de `minuten` en `seconden` eigenschappen elke seconde bij. 
     * Wanneer de timer nul bereikt, stopt deze, wordt de status bijgewerkt naar `GESTOPT`, 
     * wordt het interval gewist en wordt de `bij_voltooid` callback aangeroepen.
     */
    start = (bij_voltooid: () => void) => {
        this.eindtijd = Date.now() + (this.seconden_totaal * 1000);

        this.status = TimerStatus.ACTIEF;

        const timer_geluid = new Audio("sounds/timer.wav");

        this.countdown = setInterval(() => {
            const seconden_over = Math.round((this.eindtijd - Date.now()) / 1000);

            this.minuten = Math.floor(seconden_over / 60)
            this.seconden = seconden_over % 60;

            tick_sound();

            document.title = `${this.minuten}:${this.seconden < 10 ? '0' : ''}${this.seconden} | Kairos`;

            if (seconden_over < 1) {
                timer_geluid.currentTime = 0;
                timer_geluid.play();
                this.status = TimerStatus.GESTOPT;
                clearInterval(this.countdown);
                document.title = `Kairos`;
                bij_voltooid();
                return;
            }
        }, 1000)
    }

    stop = () => {
        clearInterval(this.countdown);
        this.eindtijd = Date.now();
        this.status = TimerStatus.GESTOPT;
        document.title = `Kairos`;
    }

    reset = (seconden: number) => {
        this.seconden_totaal = seconden;
        this.seconden = seconden % 60;
        this.minuten = Math.floor(seconden / 60);
    }
}
