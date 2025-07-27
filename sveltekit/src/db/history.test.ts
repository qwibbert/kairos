import { Session } from "$lib/session/session.svelte";
import { PomoType, SessionStatus } from "$lib/session/types";
import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AppDB from "./appdb";
import { add_history_entry, delete_history_entry, get_history_entry, restore_session_from_history, update_history_entry } from "./history";


vi.mock("$lib/session/session.svelte", () => ({
    Session: vi.fn().mockImplementation((pomo_type, time) => {
        return {
            uuid: crypto.randomUUID(),
            date: new Date(),
            status: SessionStatus.Inactive,
            time_aim: time,
            time_real: 0,
            pauses: [],
            cycle: 1,
            pomo_type,
            vine_id: undefined,
        };
    }),
}));

describe("history db functions", () => {
    const db = new AppDB();
    const test_entry = {
        id: crypto.randomUUID(),
        date_started: new Date("2025-01-01T00:00:00Z"),
        date_finished: new Date("2025-01-01T00:25:00Z"),
        pauses: [],
        time_aim: 25 * 60,
        time_real: 25 * 60,
        vine_id: undefined,
        status: SessionStatus.Ready,
        created_at: new Date("2025-01-01T00:00:00Z"),
        updated_at: new Date("2025-01-01T00:25:00Z"),
        pomo_type: PomoType.Pomo,
        cycle: 1
    };

    beforeEach(async () => {
        vi.clearAllMocks();
        await db.delete();
        await db.open();
    });

    describe("get_history_entry function", () => {
        it("returns a history entry ", async () => {
            const id = await db.history.add(test_entry);
            expect(id).toEqual(test_entry.id);

            const result = await get_history_entry(test_entry.id);

            expect(result).toEqual(test_entry);
        });
    })

    describe("add_history_entry function", () => {
        it("adds a session and returns id", async () => {
            const session = new Session(PomoType.Pomo, 25 * 60);
            const id = await add_history_entry(session);

            const entry = await get_history_entry(id);

            expect(id).toBe(session.uuid);
            expect(entry).toBeTruthy();
            expect(entry?.date_finished).toBeUndefined();
            expect(entry?.pauses.length).toBe(0);
            expect(entry?.time_aim).toBe(25 * 60);
            expect(entry?.time_real).toBe(0);
            expect(entry?.vine_id).toBe(undefined);
            expect(entry?.status).toBe(SessionStatus.Inactive);
            expect(entry?.created_at.getTime()).toBeCloseTo(Date.now(), -2);
            expect(entry?.updated_at.getTime()).toBeCloseTo(Date.now(), -2);

        });

        it("rejects session with elapsed time greater than target time.", async () => {
            const session = new Session(PomoType.Pomo, 20);

            session.time_real = 30;
            await expect(add_history_entry(session)).rejects.toThrowError(expect.objectContaining({ name: 'SESSION_INVALID_TIME' }));
        });

        it("rejects session with target time less than or equal to zero", async () => {
            const session = new Session(PomoType.Pomo, 20);

            session.time_aim = -1;
            await expect(add_history_entry(session)).rejects.toThrowError(expect.objectContaining({ name: 'SESSION_INVALID_TIME' }));
        });

        it("rejects duplicate sessions", async () => {
            const session = new Session(PomoType.Pomo, 20);
            await add_history_entry(session);

            const session2 = new Session(PomoType.Pomo, 20);
            session2.uuid = session.uuid;
            await expect(add_history_entry(session)).rejects.toThrowError(expect.objectContaining({ name: 'DUPLICATE_ENTRY' }));
        });
    })

    describe("update_history_entry function", () => {
        it("updates entry and removes id/created_at", async () => {
            await db.history.add(test_entry);

            const updates = { id: 'should-be-removed', created_at: new Date(), status: SessionStatus.Skipped };
            const result = await update_history_entry(test_entry.id, { ...updates });

            expect(result).toBeGreaterThan(0);

            const entry = await get_history_entry(test_entry.id);

            expect(entry).toBeTruthy();
            expect(entry?.id).toBe(test_entry.id);
            expect(entry?.date_finished?.getTime()).toBeCloseTo(Date.now(), -2);
            expect(entry?.pauses.length).toBe(0);
            expect(entry?.time_aim).toBe(25 * 60);
            expect(entry?.time_real).toBe(25 * 60);
            expect(entry?.vine_id).toBe(undefined);
            expect(entry?.status).toBe(SessionStatus.Skipped);
            expect(entry?.created_at.getTime()).toBeLessThan(Date.now());
            expect(entry?.updated_at.getTime()).toBeCloseTo(Date.now(), -2);
        });

        it("throws if updating non-existent entry", async () => {
            await expect(
                update_history_entry("non-existent-id", { status: SessionStatus.Skipped })
            ).rejects.toThrowError(expect.objectContaining({ name: "NOT_PRESENT" }));
        });

        it("throws if invalid target time", async () => {
            await db.history.add(test_entry);
            let updates = { time_aim: -1 };
            await expect(
                update_history_entry(test_entry.id, updates)
            ).rejects.toThrowError(expect.objectContaining({ name: "ENTRY_INVALID_TIME" }));

            updates = { time_aim: 24 * 60 };
            await expect(
                update_history_entry(test_entry.id, updates)
            ).rejects.toThrowError(expect.objectContaining({ name: "ENTRY_INVALID_TIME" }));
        });

        it("throws if invalid elapsed time", async () => {
            await db.history.add(test_entry);
            let updates = { time_real: -1 };
            await expect(
                update_history_entry(test_entry.id, updates)
            ).rejects.toThrowError(expect.objectContaining({ name: "ENTRY_INVALID_TIME" }));

            updates = { time_real: 26 * 60 };
            await expect(
                update_history_entry(test_entry.id, updates)
            ).rejects.toThrowError(expect.objectContaining({ name: "ENTRY_INVALID_TIME" }));
        });

        it("throws if 'READY' update with non-maximum elapsed time", async () => {
            await db.history.add(test_entry);
            const updates = { time_real: 24 * 60, status: SessionStatus.Ready };
            await expect(
                update_history_entry(test_entry.id, updates)
            ).rejects.toThrowError(expect.objectContaining({ name: "ENTRY_INVALID_TIME" }));
        });
    })

    describe("delete_history_entry function", () => {
        it("deletes entry", async () => {
            const id = await db.history.add(test_entry);

            await delete_history_entry(id);

            const result = await get_history_entry(id);

            expect(result).toBeUndefined();
        });
    })



    describe("restore_session_from_history function", () => {
        it("returns undefined if no entries", async () => {
            const result = await restore_session_from_history();
            expect(result).toBeUndefined();
        });

        it("restores session if one entry", async () => {
            await db.history.add({ ...test_entry, status: SessionStatus.Paused });

            const session = await restore_session_from_history();
            expect(session).toBeDefined();
            expect(session?.uuid).toBe(test_entry.id);
            expect(session?.status).toBe(SessionStatus.Paused);
            expect(session?.pomo_type).toBe(test_entry.pomo_type);
        });

        it("skips all but latest if multiple entries", async () => {
            await db.history.add({ ...test_entry, status: SessionStatus.Paused, updated_at: new Date() });
            await db.history.add({ ...test_entry, id: crypto.randomUUID(), status: SessionStatus.Paused, updated_at: new Date(Date.now() - 1000) });
            await db.history.add({ ...test_entry, id: crypto.randomUUID(), status: SessionStatus.Paused, updated_at: new Date(Date.now() - 2000) });
            await db.history.add({ ...test_entry, id: crypto.randomUUID(), status: SessionStatus.Paused, updated_at: new Date(Date.now() - 3000) });

            const session = await restore_session_from_history();

            expect(session?.uuid).toEqual(test_entry.id);
        });
    });
});