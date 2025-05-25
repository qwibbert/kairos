import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PomoType, Session, SessionStatus } from "./session.svelte";

// Mocks
vi.mock("$lib/utils", () => ({
    svelteStringify: (obj: any) => JSON.stringify(obj),
}));
vi.mock("./instellingen.svelte", () => ({
    get_instellingen: () => ({
        ui_geluiden: false,
        ui_geluiden_volume: 100,
        tick_geluid: false,
        tick_geluid_volume: 100,
        lange_pauze_tijd: 900,
        korte_pauze_tijd: 300,
        pomo_tijd: 1500,
    }),
}));


globalThis.Audio = class {
    src: string;
    volume: number = 1;
    currentTime: number = 0;
    constructor(src: string) {
        this.src = src;
    }
    play = vi.fn();
};

let localStorageMock: Record<string, string> = {};
globalThis.localStorage = {
    getItem: (key: string) => localStorageMock[key] ?? null,
    setItem: (key: string, value: string) => { localStorageMock[key] = value; },
    removeItem: (key: string) => { delete localStorageMock[key]; },
    clear: () => { localStorageMock = {}; },
} as any;

describe("Session", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.useFakeTimers();
        vi.spyOn(globalThis, "setInterval").mockImplementation((fn: any, ms: number) => {
            // Return a dummy interval id
            return 1 as any;
        });
        vi.spyOn(globalThis, "clearInterval").mockImplementation(() => {});
        vi.spyOn(Date, "now").mockReturnValue(1000000);
        globalThis.document = { title: "" } as any;
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it("should initialize with correct values", () => {
        const session = new Session(PomoType.Pomo, 1500);
        expect(session.pomo_type).toBe(PomoType.Pomo);
        expect(session.time_aim).toBe(1500);
        expect(session.minutes).toBe(25);
        expect(session.seconds).toBe(0);
        expect(session.status).toBe(SessionStatus.Inactive);
    });

    it("should update localStorage on update_local_storage", () => {
        const session = new Session(PomoType.Pomo, 1500);
        session.update_local_storage();
        expect(localStorage.getItem("session")).toContain('"time_aim":1500');
    });

    it("should clear localStorage on clear_local", () => {
        const session = new Session(PomoType.Pomo, 1500);
        session.update_local_storage();
        session.clear_local();
        expect(localStorage.getItem("session")).toBeNull();
    });

    it("should save history to localStorage", () => {
        const session = new Session(PomoType.Pomo, 1500);
        session.save_history();
        const history = JSON.parse(localStorage.getItem("history")!);
        expect(Array.isArray(history)).toBe(true);
        expect(history[0].time_aim).toBe(1500);
    });

    it("should append to history if already present", () => {
        const session1 = new Session(PomoType.Pomo, 1500);
        session1.save_history();
        const session2 = new Session(PomoType.ShortBreak, 300);
        session2.save_history();
        const history = JSON.parse(localStorage.getItem("history")!);
        expect(history.length).toBe(2);
        expect(history[1].pomo_type).toBe(PomoType.ShortBreak);
    });

    it("should restore session from localStorage", () => {
        const session = new Session(PomoType.Pomo, 1500);
        session.time_real = 100;
        session.update_local_storage();
        const restored = Session.restore_local();
        expect(restored).not.toBeNull();
        expect(restored!.pomo_type).toBe(PomoType.Pomo);
        expect(restored!.time_aim).toBe(1500);
        expect(restored!.time_real).toBe(100);
    });

    it("should return null if no session in localStorage", () => {
        expect(Session.restore_local()).toBeNull();
    });

    it("should not start if status is Ready or Skipped", () => {
        const session = new Session(PomoType.Pomo, 1500);
        session.status = SessionStatus.Ready;
        session.start();
        expect(session.status).toBe(SessionStatus.Ready);
        session.status = SessionStatus.Skipped;
        session.start();
        expect(session.status).toBe(SessionStatus.Skipped);
    });

    it("should set status to Paused on pause", () => {
        const session = new Session(PomoType.Pomo, 1500);
        session.status = SessionStatus.Active;
        session.pause();
        expect(session.status).toBe(SessionStatus.Paused);
        expect(session.pause_timestamp).toBe(1000000);
    });

    it("should not pause if status is Ready", () => {
        const session = new Session(PomoType.Pomo, 1500);
        session.status = SessionStatus.Ready;
        session.pause();
        expect(session.status).toBe(SessionStatus.Ready);
    });

    it("should set status to Skipped on skip", () => {
        const session = new Session(PomoType.Pomo, 1500);
        session.status = SessionStatus.Active;
        const nextSpy = vi.spyOn(session, "next");
        session.skip();
        expect(nextSpy).toHaveBeenCalled();
    });

    it("should not skip if status is Ready", () => {
        const session = new Session(PomoType.Pomo, 1500);
        session.status = SessionStatus.Ready;
        const nextSpy = vi.spyOn(session, "next");
        session.skip();
        expect(session.status).toBe(SessionStatus.Ready);
        expect(nextSpy).not.toHaveBeenCalled();
    });

    it("should transition to ShortBreak after Pomo in next()", () => {
        const session = new Session(PomoType.Pomo, 1500);
        session.cycle = 1;
        session.next();
        expect(session.pomo_type).toBe(PomoType.ShortBreak);
        expect(session.time_aim).toBe(300);
    });

    it("should transition to LongBreak after 4th Pomo in next()", () => {
        const session = new Session(PomoType.Pomo, 1500);
        session.cycle = 4;
        session.next();
        expect(session.pomo_type).toBe(PomoType.LongBreak);
        expect(session.time_aim).toBe(900);
    });

    it("should transition to Pomo after ShortBreak in next()", () => {
        const session = new Session(PomoType.ShortBreak, 300);
        session.next();
        expect(session.pomo_type).toBe(PomoType.Pomo);
        expect(session.time_aim).toBe(1500);
    });

    it("should transition to Pomo after LongBreak in next()", () => {
        const session = new Session(PomoType.LongBreak, 900);
        session.next();
        expect(session.pomo_type).toBe(PomoType.Pomo);
        expect(session.time_aim).toBe(1500);
    });
});