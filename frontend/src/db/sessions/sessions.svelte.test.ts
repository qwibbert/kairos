import { DateTime } from 'luxon';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { db } from '../db'; // Adjust this import to your actual db instance location
import type { SessionCollection, SessionDocument } from './define.svelte';
import { PomoType, SessionStatus } from './define.svelte';

let sessions: SessionCollection;

beforeAll(async () => {
    sessions = db.sessions;

    await sessions.find().remove();
});

afterAll(() => {
})

describe('session_collection_methods.new', () => {
    it('should create a new session with valid options', async () => {
        const opts = {
            time_target: 1500,
            pomo_type: PomoType.Pomo,
            cycle: 1,
        };
        const result = await sessions.new(opts);
        expect(result).toBeTruthy();
        expect(result?.time_target).toBe(1500);
        expect(result?.pomo_type).toBe(PomoType.Pomo);
        expect(result?.cycle).toBe(1);
        expect(result?.status).toBe('INACTIVE');
    });

    it('should throw if time_target is zero', async () => {
        const opts = {
            time_target: 0,
            pomo_type: PomoType.Pomo,
            cycle: 1,
        };
        let error: any = null;
        try {
            await sessions.new(opts);
        } catch (e) {
            error = e;
        }
        expect(error).toBeTruthy();
        expect(error.name).toBe('INVALID_TIME');
    });

    it('should throw if time_target is too large', async () => {
        const opts = {
            time_target: 1000 * 60, // 1000 minutes
            pomo_type: PomoType.Pomo,
            cycle: 1,
        };
        let error: any = null;
        try {
            await sessions.new(opts);
        } catch (e) {
            error = e;
        }
        expect(error).toBeTruthy();
        expect(error.name).toBe('INVALID_TIME');
    });
});

describe('session_collection_methods.get_active', () => {
    it('should return null if there is no active session', async () => {
        const active = await sessions.get_active();
        expect(active).toBeNull();
    });

    it('should return the most recently created active session', async () => {
        // Insert two sessions, one inactive, one active
        const inactive = await sessions.new({
            time_target: 1500,
            pomo_type: PomoType.Pomo,
            cycle: 1,
        });
        const active = await sessions.new({
            time_target: 1500,
            pomo_type: PomoType.Pomo,
            cycle: 2,
        });
        // Set the second session to active
        await active?.incrementalUpdate({
            $set: {
                status: SessionStatus.Active,
                updated_at: new Date().toISOString().replace('T', ' '),
            },
        });
        const found = await sessions.get_active();
        expect(found).toBeTruthy();
        expect(found?.id).toBe(active?.id);
        expect(found?.status).toBe(SessionStatus.Active);
    });
});

describe('session_collection_methods.get_last_resumable', () => {
    it('should return null if there are no resumable sessions', async () => {
        const found = await sessions.get_last_resumable();
        expect(found).toBeNull();
    });

    it('should return the most recently updated resumable session within 8 hours', async () => {
        // Insert a session outside the 8 hour window
        const oldSession = await sessions.new({
            time_target: 1500,
            pomo_type: PomoType.Pomo,
            cycle: 1,
        });
        await oldSession?.incrementalUpdate({
            $set: {
                status: SessionStatus.Paused,
                updated_at: DateTime.now().minus({ hours: 9 }).toISO().replace('T', ' '),
            },
        });

        // Insert a valid resumable session within 8 hours
        const recentSession = await sessions.new({
            time_target: 1500,
            pomo_type: PomoType.Pomo,
            cycle: 2,
        });
        await recentSession?.incrementalUpdate({
            $set: {
                status: SessionStatus.Active,
                updated_at: DateTime.now().minus({ hours: 1 }).toISO().replace('T', ' '),
            },
        });

        const found = await sessions.get_last_resumable();
        expect(found).toBeTruthy();
        expect(found?.id).toBe(recentSession?.id);
        expect(
            [SessionStatus.Active, SessionStatus.Paused, SessionStatus.Inactive, SessionStatus.Interrupted].includes(found!.status)
        ).toBe(true);
    });
});

describe('session_doc_methods.start', () => {
    let session: SessionDocument | null;

    beforeAll(async () => {
        // Create a new session for testing
        session = await sessions.new({
            time_target: 1500,
            pomo_type: PomoType.Pomo,
            cycle: 1,
        });
    });

    it('should start a paused session and set status to Active', async () => {
        const pausedSession = await sessions.new({
            time_target: 1500,
            pomo_type: PomoType.Pomo,
            cycle: 1,
        });
        await pausedSession?.incrementalUpdate({
            $set: {
                status: SessionStatus.Paused,
                paused_at: Date.now() - 10000, // paused 10s ago
            }
        });
        await pausedSession?.start(false);
        const updated = await sessions.get_active(); // or sessions.get_active()
        expect(updated?.status).toBe(SessionStatus.Active);
    });

    it('should increment cycle if increment_cycle is true and pomo_type is Pomo', async () => {
        const cycleSession = await sessions.new({
            time_target: 1500,
            pomo_type: PomoType.Pomo,
            cycle: 1,
        });
        await cycleSession?.start(true);
        const updated = await sessions.get_active();
        expect(updated?.cycle).toBe(2);
    });
});

describe('session_doc_methods.pause', () => {
    let session: SessionDocument | null;

    beforeAll(async () => {
        // Create a new session for testing
        session = await sessions.new({
            time_target: 1500,
            pomo_type: PomoType.Pomo,
            cycle: 1,
        });
    });

    it('should throw if session is not active', async () => {
        expect(session).toBeTruthy();
        if (!session) return;

        // Set status to Paused
        await session.incrementalUpdate({
            $set: { status: SessionStatus.Paused }
        });

        let error: any = null;
        try {
            await session.pause();
        } catch (e) {
            error = e;
        }
        expect(error).toBeTruthy();
        expect(error.message).toMatch(/non-active session/);
    });

    it('should pause an active session and update fields', async () => {
        // Set status to Active and set a time_end in the future
        session = await session?.incrementalUpdate({
            $set: {
                status: SessionStatus.Active,
                time_end: Date.now() + 10000, // 10 seconds from now
            }
        }); 
        await session?.pause();

        const updated = await sessions.get_active(); // Should be null, as session is now paused
        const pausedSession = await sessions.findOne(session!.id).exec();

        expect(updated).toBeNull();
        expect(pausedSession?.status).toBe(SessionStatus.Paused);
        expect(typeof pausedSession?.paused_at).toBe('number');
        expect(pausedSession?.time_elapsed).toBeTruthy();
    });
});

describe('session_doc_methods.skip', () => {
    let session: SessionDocument | null;

    beforeAll(async () => {
        // Create a new session for testing
        session = await sessions.new({
            time_target: 1500,
            pomo_type: PomoType.Pomo,
            cycle: 1,
        });
    });

    it('should throw if session is already finished (Ready)', async () => {
        expect(session).toBeTruthy();
        if (!session) return;

        session = await session.incrementalUpdate({
            $set: { status: SessionStatus.Ready }
        });

        let error: any = null;
        try {
            await session.skip();
        } catch (e) {
            error = e;
        }
        expect(error).toBeTruthy();
        expect(error.message).toMatch(/already finished session/);
    });

    it('should skip a paused session and update status/pauses', async () => {
        let pausedSession = await sessions.new({
            time_target: 1500,
            pomo_type: PomoType.Pomo,
            cycle: 1,
        });
        const pausedAt = Date.now() - 5000; // paused 5s ago
        pausedSession = await pausedSession.incrementalUpdate({
            $set: {
                status: SessionStatus.Paused,
                paused_at: pausedAt,
                pauses: [],
            }
        });
        await pausedSession.skip();

        const updated = await sessions.findOne(pausedSession.id).exec();
        expect(updated?.status).toBe(SessionStatus.Skipped);
        expect(Array.isArray(updated?.pauses)).toBe(true);
        expect(updated?.pauses?.length).toBeGreaterThan(0);
        expect(updated?.pauses?.[0]?.duration).toBeGreaterThanOrEqual(5);
    });

    it('should skip an active session and update status', async () => {
        let activeSession = await sessions.new({
            time_target: 1500,
            pomo_type: PomoType.Pomo,
            cycle: 1,
        });
        activeSession = await activeSession.incrementalUpdate({
            $set: {
                status: SessionStatus.Active,
                time_end: Date.now() + 10000,
            }
        });
        await activeSession.skip();

        const updated = await sessions.findOne(activeSession.id).exec();
        expect(updated?.status).toBe(SessionStatus.Skipped);
        expect(typeof updated?.time_elapsed).toBe('object');
    });
});

describe('session_doc_methods.next', () => {
    let session: SessionDocument | null;

    beforeAll(async () => {
        // Create a new session for testing
        session = await sessions.new({
            time_target: 1500,
            pomo_type: PomoType.Pomo,
            cycle: 1,
        });
    });

    it('should create a short break after a pomodoro (not 4th cycle)', async () => {
        let pomoSession = await sessions.new({
            time_target: 1500,
            pomo_type: PomoType.Pomo,
            cycle: 1,
        });
        pomoSession = await pomoSession.incrementalUpdate({
            $set: { status: SessionStatus.Ready }
        });
        await pomoSession.next();
        const all = await sessions.find().exec();
        const next = all.find(s => s.cycle === 1 && s.pomo_type === PomoType.ShortBreak);
        expect(next).toBeTruthy();
        expect(next?.pomo_type).toBe(PomoType.ShortBreak);
    });

    it('should create a long break after a pomodoro (4th cycle)', async () => {
        let pomoSession = await sessions.new({
            time_target: 1500,
            pomo_type: PomoType.Pomo,
            cycle: 4,
        });
        pomoSession = await pomoSession.incrementalUpdate({
            $set: { status: SessionStatus.Ready }
        });
        await pomoSession.next();
        const all = await sessions.find().exec();
        const next = all.find(s => s.cycle === 4 && s.pomo_type === PomoType.LongBreak);
        expect(next).toBeTruthy();
        expect(next?.pomo_type).toBe(PomoType.LongBreak);
    });

    it('should create a pomodoro after a break', async () => {
        let breakSession = await sessions.new({
            time_target: 300,
            pomo_type: PomoType.ShortBreak,
            cycle: 2,
        });
        breakSession= await breakSession.incrementalUpdate({
            $set: { status: SessionStatus.Ready }
        });
        await breakSession.next();
        const all = await sessions.find().exec();
        const next = all.find(s => s.cycle === 3 && s.pomo_type === PomoType.Pomo);
        expect(next).toBeTruthy();
        expect(next?.pomo_type).toBe(PomoType.Pomo);
    });

    it('should use override_type if provided', async () => {
        let session = await sessions.new({
            time_target: 1500,
            pomo_type: PomoType.Pomo,
            cycle: 1,
        });
        session = await session.incrementalUpdate({
            $set: { status: SessionStatus.Ready }
        });
        await session.next(PomoType.LongBreak);
        const all = await sessions.find().exec();
        const next = all.find(s => s.pomo_type === PomoType.LongBreak);
        expect(next).toBeTruthy();
    });
});