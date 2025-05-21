import { describe, expect, it, vi } from "vitest";
import { Timer, TimerStatus } from "./timer.svelte";

describe("Timer", () => {
    it("moet initialiseren met de correcte waarden", () => {
        const timer = new Timer(90); // 1 minuut 30 seconden
        expect(timer.seconden_totaal).toBe(90);
        expect(timer.minuten).toBe(1);
        expect(timer.seconden).toBe(30);
        expect(timer.status).toBe(TimerStatus.GESTOPT);
    });

    it("moet de timer starten en de status bijwerken naar ACTIEF", () => {
        const timer = new Timer(10);
        const bij_voltooid = vi.fn();

        timer.start(bij_voltooid);

        expect(timer.status).toBe(TimerStatus.ACTIEF);
        expect(timer.eindtijd).toBeGreaterThan(Date.now());
    });

    it("moet bij_voltooid aanroepen wanneer de timer voltooid is", async () => {
        const timer = new Timer(1); // 1 seconde
        const bij_voltooid = vi.fn();

        timer.start(bij_voltooid);

        await new Promise((resolve) => setTimeout(resolve, 1500)); // Wacht tot de timer afgelopen is

        expect(timer.status).toBe(TimerStatus.GESTOPT);
        expect(bij_voltooid).toHaveBeenCalled();
    });

    it("moet de timer stoppen en de status bijwerken naar GESTOPT", () => {
        const timer = new Timer(10);
        const bij_voltooid = vi.fn();

        timer.start(bij_voltooid);
        timer.stop();

        expect(timer.status).toBe(TimerStatus.GESTOPT);
        expect(timer.eindtijd).toBeLessThanOrEqual(Date.now());
    });

    it("moet de timer resetten met nieuwe seconden", () => {
        const timer = new Timer(90); // 1 minuut 30 seconden
        timer.reset(120); // 2 minuten

        expect(timer.seconden_totaal).toBe(120);
        expect(timer.minuten).toBe(2);
        expect(timer.seconden).toBe(0);
    });
});