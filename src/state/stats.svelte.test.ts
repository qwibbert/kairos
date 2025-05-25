import { beforeEach, describe, expect, it, vi } from "vitest";
import { StatsManager } from "./stats.svelte";

// Mock dependencies
const PomoType = {
    Pomo: "Pomo",
    ShortBreak: "ShortBreak",
    LongBreak: "LongBreak"
};

type Pause = { tijdstip: number; duur: number };
type Session = {
    pomo_type: string;
    time_real: number;
    pauses: Pause[];
    date: Date;
};

// Mock $state and $state.snapshot
(globalThis as any).$state = function <T>(val: T) {
    return val;
};
(globalThis as any).$state.snapshot = (pauses: Pause[]) => pauses;

// Mock localStorage
let localStorageMock: Record<string, string> = {};
beforeEach(() => {
    localStorageMock = {};
    vi.stubGlobal("localStorage", {
        getItem: (key: string) => localStorageMock[key] ?? null,
        setItem: (key: string, value: string) => {
            localStorageMock[key] = value;
        }
    });
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T12:00:00Z"));
});

describe("StatsManager", () => {
    it("initializes with zeroed stats", () => {
        const statsManager = new StatsManager();
        const stats = statsManager.get_stats();
        expect(stats.focus_sessions).toBe(0);
        expect(stats.pause_sessions).toBe(0);
        expect(stats.total_sessions).toBe(0);
        expect(stats.time_total).toBe(0);
        expect(stats.time_focus).toBe(0);
        expect(stats.time_pause).toBe(0);
        expect(stats.per_day).toEqual([]);
    });

    it("loads stats from localStorage if present", () => {
        localStorageMock["stats"] = JSON.stringify({
            focus_sessions: 2,
            pause_sessions: 1,
            total_sessions: 3,
            time_total: 100,
            time_focus: 60,
            time_pause: 40,
            per_day: []
        });
        const statsManager = new StatsManager();
        const stats = statsManager.get_stats();
        expect(stats.focus_sessions).toBe(2);
        expect(stats.pause_sessions).toBe(1);
        expect(stats.total_sessions).toBe(3);
        expect(stats.time_total).toBe(100);
        expect(stats.time_focus).toBe(60);
        expect(stats.time_pause).toBe(40);
    });

    it("add_session updates stats for focus session", () => {
        const statsManager = new StatsManager();
        const session: Session = {
            pomo_type: PomoType.Pomo,
            time_real: 1500,
            pauses: [],
            date: new Date("2024-01-01T10:00:00Z")
        };
        statsManager.add_session(session);
        const stats = statsManager.get_stats();
        expect(stats.focus_sessions).toBe(1);
        expect(stats.pause_sessions).toBe(0);
        expect(stats.total_sessions).toBe(1);
        expect(stats.time_total).toBe(1500);
        expect(stats.time_focus).toBe(1500);
        expect(stats.time_pause).toBe(0);
        expect(stats.per_day.length).toBe(1);
        expect(stats.per_day[0].focus_sessions).toBe(1);
        expect(stats.per_day[0].pause_sessions).toBe(0);
        expect(stats.per_day[0].total_sessions).toBe(1);
        expect(stats.per_day[0].time_total).toBe(1500);
        expect(stats.per_day[0].time_focus).toBe(1500);
        expect(stats.per_day[0].time_pause).toBe(0);
    });

    it("add_session updates stats for pause session", () => {
        const statsManager = new StatsManager();
        const session: Session = {
            pomo_type: PomoType.ShortBreak,
            time_real: 300,
            pauses: [],
            date: new Date("2024-01-01T10:00:00Z")
        };
        statsManager.add_session(session);
        const stats = statsManager.get_stats();
        expect(stats.focus_sessions).toBe(0);
        expect(stats.pause_sessions).toBe(1);
        expect(stats.total_sessions).toBe(1);
        expect(stats.time_total).toBe(300);
        expect(stats.time_focus).toBe(0);
        expect(stats.time_pause).toBe(300);
        expect(stats.per_day.length).toBe(1);
        expect(stats.per_day[0].focus_sessions).toBe(0);
        expect(stats.per_day[0].pause_sessions).toBe(1);
        expect(stats.per_day[0].total_sessions).toBe(1);
        expect(stats.per_day[0].time_total).toBe(300);
        expect(stats.per_day[0].time_focus).toBe(0);
        expect(stats.per_day[0].time_pause).toBe(300);
    });

    it("add_session adjusts time_real if pauses exist", () => {
        const statsManager = new StatsManager();
        const now = Date.now();
        const session: Session = {
            pomo_type: PomoType.Pomo,
            time_real: 1000,
            pauses: [{ tijdstip: now - 5000, duur: 2 }],
            date: new Date("2024-01-01T10:00:00Z")
        };
        statsManager.add_session(session);
        // time_real should be Math.floor((now - (now - 5000) - 2*1000)/1000) = Math.floor((5000-2000)/1000) = 3
        const stats = statsManager.get_stats();
        expect(stats.time_total).toBe(3);
        expect(stats.time_focus).toBe(3);
        expect(stats.focus_sessions).toBe(1);
    });

    it("update_on_pause updates stats for first pause", () => {
        const statsManager = new StatsManager();
        const session: Session = {
            pomo_type: PomoType.Pomo,
            time_real: 120,
            pauses: [],
            date: new Date("2024-01-01T10:00:00Z")
        };
        statsManager.update_on_pause(session);
        const stats = statsManager.get_stats();
        expect(stats.time_total).toBe(120);
        expect(stats.time_focus).toBe(120);
        expect(stats.time_pause).toBe(0);
        expect(stats.per_day[0].time_total).toBe(120);
        expect(stats.per_day[0].time_focus).toBe(120);
        expect(stats.per_day[0].time_pause).toBe(0);
    });

    it("update_on_pause updates stats for subsequent pauses", () => {
        const statsManager = new StatsManager();
        const now = Date.now();
        const session: Session = {
            pomo_type: PomoType.ShortBreak,
            time_real: 0,
            pauses: [{ tijdstip: now - 7000, duur: 2 }],
            date: new Date("2024-01-01T10:00:00Z")
        };
        statsManager.update_on_pause(session);
        // elapsedTime = Math.floor((now - (now-7000) - 2*1000)/1000) - 1 = Math.floor((7000-2000)/1000) - 1 = 5 - 1 = 4
        const stats = statsManager.get_stats();
        expect(stats.time_total).toBe(4);
        expect(stats.time_focus).toBe(0);
        expect(stats.time_pause).toBe(4);
        expect(stats.per_day[0].time_total).toBe(4);
        expect(stats.per_day[0].time_focus).toBe(0);
        expect(stats.per_day[0].time_pause).toBe(4);
    });

    it("get_todayStats returns today's stats or zeroed if none", () => {
        const statsManager = new StatsManager();
        // No sessions yet
        const todayStats = statsManager.get_todayStats();
        expect(todayStats.date).toBe(new Date().toDateString());
        expect(todayStats.focus_sessions).toBe(0);
        expect(todayStats.pause_sessions).toBe(0);
        expect(todayStats.total_sessions).toBe(0);
        expect(todayStats.time_total).toBe(0);
        expect(todayStats.time_focus).toBe(0);
        expect(todayStats.time_pause).toBe(0);

        // Add a session for today
        statsManager.add_session({
            pomo_type: PomoType.Pomo,
            time_real: 100,
            pauses: [],
            date: new Date()
        });
        const todayStats2 = statsManager.get_todayStats();
        expect(todayStats2.focus_sessions).toBe(1);
        expect(todayStats2.time_total).toBe(100);
    });
});