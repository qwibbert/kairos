import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import AppDB from '../../db/appdb';
import { add_vine } from '../../db/vines';
import { Session } from './session.svelte';
import { PomoType, SessionStatus } from './types';

const Audio = vi.fn(() => ({
	currentTime: 0,
	play: vi.fn(),
}));

const Document = vi.fn(() => ({
	title: '',
}));

vi.stubGlobal('Audio', Audio);
vi.stubGlobal('document', Document);

describe('session', () => {
	const db = new AppDB();

	beforeEach(async () => {
		vi.useRealTimers();
		await db.delete();
		await db.open();
	});

	afterEach(async () => {
		vi.restoreAllMocks();
	});

	describe('constructor function', () => {
		it('correctly initialises new session', async () => {
			const session = new Session(PomoType.ShortBreak, 100);

			expect(session.uuid).toBeTypeOf('string');
			expect(session.status).toEqual(SessionStatus.Inactive);
			expect(session?.pomo_type).toEqual(PomoType.ShortBreak);
			expect(session.time_aim).toEqual(100);
			expect(session?.time_real).toEqual(0);
			expect(session?.pauses).toEqual([]);
			expect(session?.cycle).toEqual(1);
			expect(session.interval).toEqual(0);
			expect(session.minutes).toEqual(1);
			expect(session.seconds).toEqual(40);
			expect(session.vine_id).toBeUndefined();
			expect(session.created_at.getTime()).toBeCloseTo(Date.now(), -2);
		});

		it('throws when invalid time is provided', () => {
			expect(() => new Session(PomoType.ShortBreak, -1)).toThrow(
				expect.objectContaining({ name: 'INVALID_TIME' }),
			);
			expect(() => new Session(PomoType.ShortBreak, 0)).toThrow(
				expect.objectContaining({ name: 'INVALID_TIME' }),
			);
			expect(() => new Session(PomoType.ShortBreak, 10000 * 60)).toThrow(
				expect.objectContaining({ name: 'INVALID_TIME' }),
			);
		});
	});

	describe('start function', () => {
		let session = new Session(PomoType.Pomo, 60);

		beforeEach(() => {
			vi.useFakeTimers();
			session = new Session(PomoType.Pomo, 25 * 60);
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it('starts a session and handles end of timer', async () => {
			session.start();

			// Disable the next function so we can get a clear look on the session
			const spy = vi.spyOn(session, 'next');
			expect(spy.getMockName()).toEqual('next');
			spy.mockImplementationOnce(async () => {});

			await vi.advanceTimersByTimeAsync(12 * 60 * 1000 + 1000);
			expect(session.time_real).toEqual(720);

			await vi.advanceTimersByTimeAsync(13 * 60 * 1000);
			expect(session.time_real).toEqual(session.time_aim);
			expect(session.minutes).toEqual(0);
			expect(session.seconds).toEqual(0);
		});

		it('throws if session already finished', async () => {
			session.status = SessionStatus.Ready;
			await expect(session.start()).rejects.toThrow(expect.objectContaining({ name: 'FINISHED' }));

			session.status = SessionStatus.Skipped;
			await expect(session.start()).rejects.toThrow(expect.objectContaining({ name: 'FINISHED' }));
		});

		it('throws if session already active', async () => {
			session.status = SessionStatus.Active;
			await expect(session.start()).rejects.toThrow(expect.objectContaining({ name: 'ACTIVE' }));
		});

		it('throws if invalid target time', async () => {
			session.time_aim = 0;
			await expect(session.start()).rejects.toThrow(
				expect.objectContaining({ name: 'INVALID_TIME' }),
			);
		});

		it('resumes a paused state', async () => {
			session.start();

			await vi.advanceTimersByTimeAsync(12 * 60 * 1000 + 1000);

			session.pause();

			await vi.runAllTimersAsync();
			expect(session.paused_at?.getTime()).toBeCloseTo(Date.now(), -2);
			expect(session.status).toEqual(SessionStatus.Paused);
			expect(session.minutes).toEqual(13);

			session.start();
			await vi.advanceTimersByTimeAsync(1 * 60 * 1000 + 1000);

			expect(session.time_real).toEqual(12 * 60 + 60);
			expect(session.time_end).toBeCloseTo(Date.now() + 720 * 1000, -4);
			expect(session.pauses.length).toEqual(1);

			await vi.advanceTimersByTimeAsync(12 * 60 * 1000 + 1000);
			expect(session.pomo_type).toEqual(PomoType.ShortBreak);
			expect(session.status).toEqual(SessionStatus.Inactive);
		});
	});

	describe('pause function', () => {
		let session = new Session(PomoType.Pomo, 60);

		beforeEach(() => {
			vi.useFakeTimers();
			session = new Session(PomoType.Pomo, 25 * 60);
		});

		afterEach(() => {
			vi.useFakeTimers();
		});

		it('pauses a session', async () => {
			session.start();

			await vi.advanceTimersByTimeAsync(12 * 60 * 1000 + 1000);

			session.pause();

			await vi.runAllTimersAsync();
			expect(session.paused_at?.getTime()).toBeCloseTo(Date.now(), -2);
			expect(session.status).toEqual(SessionStatus.Paused);
			expect(session.minutes).toEqual(13);
		});

		it('throws if session not active', async () => {
			await expect(session.pause()).rejects.toThrow(
				expect.objectContaining({ name: 'NOT_ACTIVE' }),
			);
		});
	});

	describe('skip function', () => {
		let session = new Session(PomoType.Pomo, 60);

		beforeEach(() => {
			vi.useFakeTimers();
			session = new Session(PomoType.Pomo, 25 * 60);
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it('skips a session', async () => {
			// Disable the next function so we can get a clear look on the session
			const spy = vi.spyOn(session, 'next');
			expect(spy.getMockName()).toEqual('next');
			spy.mockImplementationOnce(async () => {});

			session.start();

			await vi.advanceTimersByTimeAsync(12 * 60 * 1000 + 1000);

			session.skip();

			await vi.runAllTimersAsync();

			expect(session.status).toEqual(SessionStatus.Skipped);
		});

		it('skips a paused session', async () => {
			// Disable the next function so we can get a clear look on the session
			const spy = vi.spyOn(session, 'next');
			expect(spy.getMockName()).toEqual('next');
			spy.mockImplementationOnce(async () => {});

			session.start();

			await vi.advanceTimersByTimeAsync(12 * 60 * 1000 + 1000);

			session.pause();

			await vi.runAllTimersAsync();

			session.skip();

			await vi.runAllTimersAsync();

			expect(session.status).toEqual(SessionStatus.Skipped);
			expect(session.pauses.length).toEqual(1);
		});

		it('throws if finished session', async () => {
			session.status = SessionStatus.Ready;

			await expect(session.skip()).rejects.toThrow(expect.objectContaining({ name: 'FINISHED' }));
		});
	});

	describe('next function', () => {
		let session = new Session(PomoType.Pomo, 60);

		beforeEach(() => {
			session = new Session(PomoType.Pomo, 25 * 60);
		});

		it("initialises a short break after a pomo session that hasn't reached a 4th cycle.", async () => {
			const old_session_id = session.uuid;

			await session.next();

			expect(session.uuid).not.toEqual(old_session_id);
			expect(session.status).toEqual(SessionStatus.Inactive);
			expect(session.pomo_type).toEqual(PomoType.ShortBreak);
			expect(session.time_aim).toEqual(300);
			expect(session.time_real).toEqual(0);
			expect(session.pauses.length).toEqual(0);
			expect(session.cycle).toEqual(1);
			expect(session.interval).toEqual(0);
			expect(session.time_end).toEqual(0);
			expect(session.minutes).toEqual(5);
			expect(session.seconds).toEqual(0);
			expect(session.vine_id).toBeUndefined();
			expect(session.created_at.getTime()).toBeCloseTo(Date.now(), -2);
			expect(session.paused_at).toBeUndefined();
		});

		it('initialises a long break after a pomo session that reached a 4th cycle.', async () => {
			const old_session_id = session.uuid;

			await session.next();

			expect(session.uuid).not.toEqual(old_session_id);
			expect(session.status).toEqual(SessionStatus.Inactive);
			expect(session.pomo_type).toEqual(PomoType.ShortBreak);
			expect(session.time_aim).toEqual(300);
			expect(session.time_real).toEqual(0);
			expect(session.pauses.length).toEqual(0);
			expect(session.cycle).toEqual(1);
			expect(session.interval).toEqual(0);
			expect(session.time_end).toEqual(0);
			expect(session.minutes).toEqual(5);
			expect(session.seconds).toEqual(0);
			expect(session.vine_id).toBeUndefined();
			expect(session.created_at.getTime()).toBeCloseTo(Date.now(), -2);
			expect(session.paused_at).toBeUndefined();

			await session.next();

			expect(session.uuid).not.toEqual(old_session_id);
			expect(session.status).toEqual(SessionStatus.Inactive);
			expect(session.pomo_type).toEqual(PomoType.Pomo);
			expect(session.time_aim).toEqual(1500);
			expect(session.time_real).toEqual(0);
			expect(session.pauses.length).toEqual(0);
			expect(session.cycle).toEqual(2);
			expect(session.interval).toEqual(0);
			expect(session.time_end).toEqual(0);
			expect(session.minutes).toEqual(25);
			expect(session.seconds).toEqual(0);
			expect(session.vine_id).toBeUndefined();
			expect(session.created_at.getTime()).toBeCloseTo(Date.now(), -2);
			expect(session.paused_at).toBeUndefined();

			await session.next();

			expect(session.uuid).not.toEqual(old_session_id);
			expect(session.status).toEqual(SessionStatus.Inactive);
			expect(session.pomo_type).toEqual(PomoType.ShortBreak);
			expect(session.time_aim).toEqual(300);
			expect(session.time_real).toEqual(0);
			expect(session.pauses.length).toEqual(0);
			expect(session.cycle).toEqual(2);
			expect(session.interval).toEqual(0);
			expect(session.time_end).toEqual(0);
			expect(session.minutes).toEqual(5);
			expect(session.seconds).toEqual(0);
			expect(session.vine_id).toBeUndefined();
			expect(session.created_at.getTime()).toBeCloseTo(Date.now(), -2);
			expect(session.paused_at).toBeUndefined();

			await session.next();

			expect(session.uuid).not.toEqual(old_session_id);
			expect(session.status).toEqual(SessionStatus.Inactive);
			expect(session.pomo_type).toEqual(PomoType.Pomo);
			expect(session.time_aim).toEqual(1500);
			expect(session.time_real).toEqual(0);
			expect(session.pauses.length).toEqual(0);
			expect(session.cycle).toEqual(3);
			expect(session.interval).toEqual(0);
			expect(session.time_end).toEqual(0);
			expect(session.minutes).toEqual(25);
			expect(session.seconds).toEqual(0);
			expect(session.vine_id).toBeUndefined();
			expect(session.created_at.getTime()).toBeCloseTo(Date.now(), -2);
			expect(session.paused_at).toBeUndefined();

			await session.next();

			expect(session.uuid).not.toEqual(old_session_id);
			expect(session.status).toEqual(SessionStatus.Inactive);
			expect(session.pomo_type).toEqual(PomoType.ShortBreak);
			expect(session.time_aim).toEqual(300);
			expect(session.time_real).toEqual(0);
			expect(session.pauses.length).toEqual(0);
			expect(session.cycle).toEqual(3);
			expect(session.interval).toEqual(0);
			expect(session.time_end).toEqual(0);
			expect(session.minutes).toEqual(5);
			expect(session.seconds).toEqual(0);
			expect(session.vine_id).toBeUndefined();
			expect(session.created_at.getTime()).toBeCloseTo(Date.now(), -2);
			expect(session.paused_at).toBeUndefined();

			await session.next();

			expect(session.uuid).not.toEqual(old_session_id);
			expect(session.status).toEqual(SessionStatus.Inactive);
			expect(session.pomo_type).toEqual(PomoType.Pomo);
			expect(session.time_aim).toEqual(1500);
			expect(session.time_real).toEqual(0);
			expect(session.pauses.length).toEqual(0);
			expect(session.cycle).toEqual(4);
			expect(session.interval).toEqual(0);
			expect(session.time_end).toEqual(0);
			expect(session.minutes).toEqual(25);
			expect(session.seconds).toEqual(0);
			expect(session.vine_id).toBeUndefined();
			expect(session.created_at.getTime()).toBeCloseTo(Date.now(), -2);
			expect(session.paused_at).toBeUndefined();

			await session.next();

			expect(session.uuid).not.toEqual(old_session_id);
			expect(session.status).toEqual(SessionStatus.Inactive);
			expect(session.pomo_type).toEqual(PomoType.LongBreak);
			expect(session.time_aim).toEqual(900);
			expect(session.time_real).toEqual(0);
			expect(session.pauses.length).toEqual(0);
			expect(session.cycle).toEqual(4);
			expect(session.interval).toEqual(0);
			expect(session.time_end).toEqual(0);
			expect(session.minutes).toEqual(15);
			expect(session.seconds).toEqual(0);
			expect(session.vine_id).toBeUndefined();
			expect(session.created_at.getTime()).toBeCloseTo(Date.now(), -2);
			expect(session.paused_at).toBeUndefined();
		});
	});

	describe('switch_vine function', async () => {
		let session = new Session(PomoType.Pomo, 60);

		beforeEach(() => {
			session = new Session(PomoType.Pomo, 25 * 60);
		});

		it('switches to a specified vine', async () => {
			const vine = await add_vine('TEST', 0, undefined);

			await session.switch_vine(vine);
			expect(session.vine_id).toEqual(vine);
		});

		it("throws when vine doesn't exist", async () => {
			await expect(session.switch_vine('TEST')).rejects.toThrow(
				expect.objectContaining({ name: 'NO_vine_WITH_ID' }),
			);
		});
	});
});
