import { beforeEach, describe, expect, it, vi } from "vitest";
import { PomoType, Sessie, SessieStatus } from "./sessie.svelte";

const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();
Object.defineProperty(global, "localStorage", { value: localStorageMock });

vi.mock("./timer.svelte", () => {
    return {
        Timer: vi.fn().mockImplementation((tijd: number) => ({
            start: vi.fn(),
            stop: vi.fn(),
            reset: vi.fn(),
            eindtijd: Date.now() + tijd * 1000,
            minuten: Math.floor(tijd / 60),
            seconden: tijd % 60,
        })),
    };
});

describe("Sessie", () => {
    let sessie: Sessie;

    beforeEach(() => {
        localStorage.clear();
        sessie = new Sessie(PomoType.Pomo, 1500); // 25 minuten
    });

    it("moet initialiseren met de juiste eigenschappen", () => {
        expect(sessie.uuid).toBeDefined();
        expect(sessie.status).toBe(SessieStatus.Inactief);
        expect(sessie.pomo_type).toBe(PomoType.Pomo);
        expect(sessie.timer).toBeDefined();
        expect(sessie.effectieve_tijd).toBe(0);
        expect(sessie.pauzering_tijdstip).toBe(0);
        expect(sessie.pauzeringen).toEqual([]);
    });

    it("moet de timer starten en de status bijwerken", () => {
        sessie.start();
        expect(sessie.status).toBe(SessieStatus.Actief);
        expect(sessie.timer.start).toHaveBeenCalled();
    });

    it("moet de sessie pauzeren en de status opslaan", () => {
        sessie.start();
        sessie.pauzeer();

        expect(sessie.status).toBe(SessieStatus.Gepauzeerd);
        expect(sessie.timer.stop).toHaveBeenCalled();
        expect(sessie.effectieve_tijd).toBe(0);
        expect(sessie.pauzering_tijdstip).toBeGreaterThan(0);
    });

    it("moet de sessie hervatten en pauzegegevens bijwerken", async () => {
        sessie.start();
        sessie.pauzeer();

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const previousPauzeringTijdstip = sessie.pauzering_tijdstip;

        sessie.hervat();

        expect(sessie.status).toBe(SessieStatus.Actief);
        expect(sessie.timer.start).toHaveBeenCalled();
        expect(sessie.pauzeringen).toHaveLength(1);
        expect(sessie.pauzeringen[0].tijdstip).toBe(previousPauzeringTijdstip);
        expect(sessie.pauzeringen[0].duur).toBeCloseTo(2);
    });

    it("moet de sessie opslaan in localStorage", () => {
        sessie.start();
        sessie.sla_lokaal_op();

        const savedSessions = JSON.parse(localStorage.getItem("sessies") || "[]");
        expect(savedSessions).toHaveLength(1);
        expect(savedSessions[0].uuid).toBe(sessie.uuid);
    });

    it("moet een sessie herstellen vanuit localStorage", () => {
        sessie.start();
        sessie.sla_lokaal_op();

        const restoredSessie = Sessie.restore_lokaal();
        expect(restoredSessie).not.toBeNull();
        expect(restoredSessie?.uuid).toBe(sessie.uuid);
        expect(restoredSessie?.status).toBe(SessieStatus.Actief);
    });

    it("moet de sessie correct afhandelen bij voltooiing", { timeout: 15_000 }, async () => {
        const sessie = new Sessie(PomoType.Pomo, 10);
        sessie.start();

        await new Promise((resolve) => setTimeout(resolve, 12000));

        expect(sessie.status).toBe(SessieStatus.Voltooid);
        const savedSessions = JSON.parse(localStorage.getItem("sessies") || "[]");
        expect(savedSessions[0].status).toBe(SessieStatus.Voltooid);
    });

    it("moet de juiste minuten en seconden retourneren", () => {
        expect(sessie.get_minuten()).toBe(25);
        expect(sessie.get_seconden()).toBe(0);
    });

    it("moet geen sessie herstellen als er geen actieve of gepauzeerde sessies bestaan", () => {
        const restoredSessie = Sessie.restore_lokaal();
        expect(restoredSessie).toBeNull();
    });

    it("moet meerdere sessies in localStorage afhandelen", () => {
        const sessie2 = new Sessie(PomoType.KortePauze, 300); // 5 minuten
        sessie.start();
        sessie.sla_lokaal_op();
        sessie2.start();
        sessie2.sla_lokaal_op();

        const savedSessions = JSON.parse(localStorage.getItem("sessies") || "[]");
        expect(savedSessions).toHaveLength(2);
        expect(savedSessions[0].uuid).toBe(sessie.uuid);
        expect(savedSessions[1].uuid).toBe(sessie2.uuid);
    });

    it("moet een bestaande sessie in localStorage bijwerken", () => {
        sessie.start();
        sessie.sla_lokaal_op();

        sessie.pauzeer();
        sessie.sla_lokaal_op();

        const savedSessions = JSON.parse(localStorage.getItem("sessies") || "[]");
        expect(savedSessions).toHaveLength(1);
        expect(savedSessions[0].status).toBe(SessieStatus.Gepauzeerd);
    });

    it("moet de timer correct resetten bij hervatten", () => {
        sessie.start();
        sessie.pauzeer();
        const previousPauzeringTijdOver = sessie.pauzering_tijd_over;

        sessie.hervat();

        expect(sessie.timer.reset).toHaveBeenCalledWith(previousPauzeringTijdOver);
    });

    it("moet geen acties toestaan als de sessie al voltooid is", () => {
        sessie.bij_voltooid();

        sessie.start();
        expect(sessie.status).toBe(SessieStatus.Voltooid);

        sessie.pauzeer();
        expect(sessie.status).toBe(SessieStatus.Voltooid);

        sessie.hervat();
        expect(sessie.status).toBe(SessieStatus.Voltooid);
    });

    it("moet een gepauzeerde sessie correct herstellen", () => {
        sessie.start();
        sessie.pauzeer();
        sessie.sla_lokaal_op();

        const restoredSessie = Sessie.restore_lokaal();
        expect(restoredSessie).not.toBeNull();
        expect(restoredSessie?.status).toBe(SessieStatus.Gepauzeerd);
        expect(restoredSessie?.pauzering_tijd_over).toBeGreaterThan(0);
    });

    it("moet een sessie met meerdere pauzes correct herstellen", () => {
        sessie.start();
        sessie.pauzeer();
        sessie.hervat();
        sessie.pauzeer();
        sessie.hervat();
        sessie.sla_lokaal_op();

        const restoredSessie = Sessie.restore_lokaal();
        expect(restoredSessie).not.toBeNull();
        expect(restoredSessie?.pauzeringen).toHaveLength(2);
    });

    it("moet een sessie overslaan en de status bijwerken", () => {
        sessie.start();
        sessie.sla_over();

        expect(sessie.status).toBe(SessieStatus.Overgeslagen);
        expect(sessie.timer.stop).toHaveBeenCalled();

        const savedSessions = JSON.parse(localStorage.getItem("sessies") || "[]");
        expect(savedSessions).toHaveLength(1);
        expect(savedSessions[0].status).toBe(SessieStatus.Overgeslagen);
    });

    it("moet de totale studietijd correct sommeren", () => {
        const sessie1 = new Sessie(PomoType.Pomo, 1500);
        const sessie2 = new Sessie(PomoType.KortePauze, 300);

        sessie1.start();
        sessie1.pauzeer();
        sessie1.effectieve_tijd = 1200; // 20 minuten
        sessie1.sla_lokaal_op();

        sessie2.start();
        sessie2.pauzeer();
        sessie2.effectieve_tijd = 200; // 3 minuten en 20 seconden
        sessie2.sla_lokaal_op();

        const totaleStudietijd = Sessie.sommeer_studietijd();
        expect(totaleStudietijd).toBe(1400); // 23 minuten en 20 seconden
    });

    it("moet een sessie herstellen met de juiste pauzeringen", () => {
        sessie.start();
        sessie.pauzeer();
        sessie.hervat();
        sessie.pauzeer();
        sessie.hervat();
        sessie.sla_lokaal_op();

        const restoredSessie = Sessie.restore_lokaal();
        expect(restoredSessie).not.toBeNull();
        expect(restoredSessie?.pauzeringen).toHaveLength(2);
        expect(restoredSessie?.pauzeringen[0].duur).toBeGreaterThan(0);
        expect(restoredSessie?.pauzeringen[1].duur).toBeGreaterThan(0);
    });

    it("moet een sessie herstellen met de status 'Overgeslagen'", () => {
        sessie.start();
        sessie.sla_over();
        sessie.sla_lokaal_op();

        const restoredSessie = Sessie.restore_lokaal();
        expect(restoredSessie).not.toBeNull();
        expect(restoredSessie?.status).toBe(SessieStatus.Overgeslagen);
    });

    it("moet geen acties toestaan als de sessie is overgeslagen", () => {
        sessie.sla_over();

        sessie.start();
        expect(sessie.status).toBe(SessieStatus.Overgeslagen);

        sessie.pauzeer();
        expect(sessie.status).toBe(SessieStatus.Overgeslagen);

        sessie.hervat();
        expect(sessie.status).toBe(SessieStatus.Overgeslagen);
    });
});
