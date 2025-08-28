/* eslint-disable svelte/prefer-svelte-reactivity */
import { VineStatus } from '$features/vines/types';
import { DateTime } from 'luxon';
import {
	type ExtractDocumentTypeFromTypedRxJsonSchema,
	type RxCollection,
	type RxDocument,
	type RxJsonSchema,
	toTypedRxJsonSchema,
} from 'rxdb';

import { PomoType, SessionStatus } from '$lib/session/types';

import { db } from '../db';
import type { VinesDocType } from '../vines/define';
import { on_session_syncable } from './client';
import { SessionError, SessionErrorFactory, SessionErrorType } from './errors';

export const session_schema_literal = {
	version: 0,
	title: 'session',
	keyCompression: false,
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: {
			type: 'string',
			maxLength: 100,
		},
		date_finished: {
			type: 'number',
			minimum: 0,
		},
		pauses: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					timestamp: {
						type: 'string',
						format: 'date-time',
					},
					duration: {
						type: 'number',
						minimum: 0,
					},
				},
			},
		},
		paused_at: {
			type: 'number',
			minimum: 0,
		},
		time_end: {
			type: 'number',
		},
		time_target: {
			type: 'number',
			minimum: 0,
		},
		time_elapsed: {
			type: 'object',
		},
		status: {
			type: 'string',
			maxLength: 100,
		},
		created_at: {
			type: 'string',
			format: 'date-time',
			maxLength: 100,
		},
		updated_at: {
			type: 'string',
			format: 'date-time',
			maxLength: 100,
		},
		pomo_type: {
			type: 'string',
			maxLength: 100,
		},
		cycle: {
			type: 'number',
			minimum: 0,
		},
		active_tab: {
			type: 'string',
		},
		vine_id: {
			type: 'string',
		},
		vine_title: {
			type: 'string',
		},
		vine_type: {
			type: 'string',
		},
		vine_course: {
			type: 'string',
		},
	},
	required: ['id', 'time_target', 'status', 'created_at', 'pomo_type', 'cycle'],
	indexes: ['status', 'pomo_type', 'created_at'],
} as const;

const schema_typed = toTypedRxJsonSchema(session_schema_literal);

export type SessionDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schema_typed>;

export const session_schema: RxJsonSchema<SessionDocType> = session_schema_literal;

export type SessionDocMethods = {
	start: () => Promise<void>;
	pause: () => Promise<void>;
	skip: (override_type?: PomoType) => Promise<void>;
	next: (override_type?: PomoType) => Promise<void>;
	get_time_elapsed: () => number;
	upload: () => Promise<void>;
};

export type SessionDocument = RxDocument<SessionDocType, SessionDocMethods>;

export type SessionCollectionMethods = {
	/** Creates a new session with the provided options
	 * @throws An instance of {@link SessionError}
	 */
	new: (opts: SessionNewOpts) => Promise<SessionDocument | null>;
	/**
	 * Get the last created session with an active state
	 */
	get_active: () => Promise<SessionDocument | null>;
	/**
	 * Get the last session with a resumable state
	 */
	get_last_resumable: () => Promise<SessionDocument | null>;
	/**
	 * Starts the last session with a resumable state
	 */
	start: () => Promise<void>;
};

export type SessionCollection = RxCollection<
	SessionDocType,
	SessionDocMethods,
	SessionCollectionMethods
>;

export type SessionNewOpts = {
	time_target: number;
	pomo_type: PomoType;
	cycle: number;
	vine?: VinesDocType;
};

type TimerInterval = string;

export const session_doc_methods: SessionDocMethods = {
	start: async function (this: SessionDocument, increment_cycle: boolean): Promise<TimerInterval> {
		this.getLatest();

		if (
			this.status == SessionStatus.Ready ||
			this.status == SessionStatus.Active ||
			this.status == SessionStatus.Skipped
		) {
			throw SessionErrorFactory.invalid_state(
				'session has a non-resumeable state',
				'session.start',
				this.id,
				{ status: this.status },
			);
		}

		if (this.time_target <= 0) {
			throw SessionErrorFactory.invalid_time(
				`Tried to start a session with a target time ${this.time_target == 0 ? 'equal to' : 'less than'} zero (${this.time_target})`,
				'session.start',
				this.id,
				{ time_target: this.time_target },
			);
		}

		const elapsed_local_storage = JSON.parse(localStorage.getItem(this.id) ?? '{}');
		const today = new Date().toDateString();

		if (this.status == SessionStatus.Paused) {
			if (this.paused_at) {
				const pause_duration = Math.floor(Date.now() - this.paused_at);

				await this.incrementalModify((s) => {
					s.pauses = [
						...(s.pauses ?? []),
						{
							timestamp: new Date(this.paused_at ?? 0).toISOString().replace('T', ' '),
							duration: pause_duration,
						},
					];
					s.updated_at = new Date().toISOString().replace('T', ' ');
					s.time_end = Date.now() + (this.time_target - this.get_time_elapsed()) * 1000;
					return s;
				});
			} else {
				throw SessionErrorFactory.invalid_pause('session.start', this.id, {
					paused_at: this.paused_at,
				});
			}
		} else if (this.status == SessionStatus.Interrupted) {
			await this.incrementalUpdate({
				$set: {
					updated_at: new Date().toISOString().replace('T', ' '),
					time_end:
						Date.now() +
						(this.time_target -
							Math.max(this.get_time_elapsed(), elapsed_local_storage[today] ?? 0)) *
							1000,
				},
			});
		} else {
			await this.incrementalUpdate({
				$set: {
					updated_at: new Date().toISOString().replace('T', ' '),
					time_end: Date.now() + this.time_target * 1000,
				},
			});
		}

		if (this.pomo_type == PomoType.Pomo && increment_cycle) {
			await this.incrementalModify((s) => {
				s.cycle++;
				s.updated_at = new Date().toISOString().replace('T', ' ');
				return s;
			});
		}

		await this.incrementalUpdate({
			$set: {
				status: SessionStatus.Active,
				updated_at: new Date().toISOString().replace('T', ' '),
			},
		});
	},
	pause: async function (this: SessionDocument): Promise<void> {
		this.getLatest();
		if (this.status != SessionStatus.Active) {
			throw SessionErrorFactory.invalid_state(
				'tried to pause an non-active session',
				'session.start',
				this.id,
				{ status: this.status },
			);
		}

		// Calculate remaining time based on actual time, not tick count
		const remaining_ms = Math.max(0, (this.time_end ?? 0) - Date.now());
		const remaining_seconds = Math.ceil(remaining_ms / 1000);

		this.time_elapsed[new Date().toDateString()] = this.time_target - remaining_seconds;

		await this.incrementalUpdate({
			$set: {
				status: SessionStatus.Paused,
				time_elapsed: $state.snapshot(this.time_elapsed),
				paused_at: Date.now(),
				updated_at: new Date().toISOString().replace('T', ' '),
			},
		});

		localStorage.removeItem(this.id);
	},
	skip: async function (this: SessionDocument, override_type?: PomoType): Promise<void> {
		this.getLatest();
		if (this.status == SessionStatus.Ready) {
			throw SessionErrorFactory.invalid_state(
				'cannot skip an already finished session',
				'session.skip',
				this.id,
				{ status: this.status },
			);
		}

		if (this.status == SessionStatus.Paused && this.paused_at) {
			await this.incrementalModify((s) => {
				s.pauses?.push({
					timestamp: new Date(this.paused_at).toISOString().replace('T', ' '),
					duration: Math.floor((Date.now() - new Date(this.paused_at).getTime()) / 1000),
				});
				s.status = SessionStatus.Skipped;
				s.updated_at = new Date().toISOString().replace('T', ' ');
				return s;
			});
		} else {
			// Calculate remaining time based on actual time, not tick count
			const remaining_ms = Math.max(0, (this.time_end ?? 0) - Date.now());
			const remaining_seconds = Math.ceil(remaining_ms / 1000);

			this.time_elapsed[new Date().toDateString()] = this.time_target - remaining_seconds;

			await this.incrementalUpdate({
				$set: {
					status: SessionStatus.Skipped,
					time_elapsed: $state.snapshot(this.time_elapsed),
					paused_at: Date.now(),
					updated_at: new Date().toISOString().replace('T', ' '),
				},
			});
		}

		on_session_syncable(this.id);

		await this.next(override_type);
	},
	next: async function (this: SessionDocument, override_type?: PomoType): Promise<void> {
		// Determine what the next session type should be
		const next_type = override_type ?? get_next_session_type(this.pomo_type, this.cycle);

		// Get time and cycle for the next session
		const { time, cycle } = await get_session_config(next_type, this.cycle);

		// Create the next session
		await this.collection.new({
			time_target: time,
			pomo_type: next_type,
			cycle,
			vine: this.vine_id ? ({ id: this.vine_id } as VinesDocType) : undefined,
		} as SessionNewOpts);
	},
	get_time_elapsed: function (this: SessionDocument): number {
		this.getLatest();
		if (this.time_elapsed) {
			let total = 0;
			for (const entry in this.time_elapsed) {
				total += this.time_elapsed[entry];
			}
			return total;
		} else {
			return 0;
		}
	},
};

export const session_collection_methods: SessionCollectionMethods = {
	new: async function (
		this: SessionCollection,
		opts: SessionNewOpts,
	): Promise<SessionDocument | null> {
		if (opts.time_target <= 0) {
			throw new SessionError({
				name: SessionErrorType.INVALID_TIME,
				message: `Provided time should be larger than 0 seconds.`,
				context: {
					operation: 'session.new',
					timestamp: new Date(),
					additional_data: {
						time_target: opts.time_target,
					},
				},
			});
		} else if (opts.time_target > 999 * 60) {
			throw new SessionError({
				name: SessionErrorType.INVALID_TIME,
				message: `Provided time should be less than or equal 999 minutes.`,
				context: {
					operation: 'session.new',
					timestamp: new Date(),
					additional_data: {
						time_target: opts.time_target,
					},
				},
			});
		}

		const active_vine = await db.vines
			.find({
				selector: { status: VineStatus.Active },
				limit: 1,
			})
			.exec()
			.then((r) => {
				if (r.length != 0) {
					return r[0];
				} else {
					return undefined;
				}
			});

		const session: SessionDocType = {
			id: crypto.randomUUID(),
			date_finished: undefined,
			pauses: [],
			time_target: opts.time_target,
			time_elapsed: {},
			status: SessionStatus.Inactive,
			created_at: new Date().toISOString().replace('T', ' '),
			updated_at: new Date().toISOString().replace('T', ' '),
			pomo_type: opts.pomo_type,
			cycle: opts.cycle,
			paused_at: undefined,
			vine_id: active_vine?.id,
			vine_title: active_vine?.title,
			vine_type: active_vine?.type,
			vine_course: active_vine?.course_id,
		};

		// TODO: normalize RxDB errors
		return await this.insertIfNotExists(session);
	},
	get_active: async function (this: SessionCollection): Promise<SessionDocument | null> {
		return await this.findOne({
			selector: {
				status: { $eq: SessionStatus.Active },
			},
			sort: [{ created_at: 'desc' }],
		}).exec();
	},
	get_last_resumable: async function (this: SessionCollection): Promise<SessionDocument | null> {
		return await this.findOne({
			selector: {
				$and: [
					{
						$or: [
							{ status: { $eq: SessionStatus.Active } },
							{ status: { $eq: SessionStatus.Paused } },
							{ status: { $eq: SessionStatus.Inactive } },
							{ status: { $eq: SessionStatus.Interrupted } },
						],
					},
					{ updated_at: { $gt: DateTime.now().minus({ hours: 8 }).toISO().replace('T', ' ') } },
				],
			},
			sort: [{ created_at: 'desc' }],
		}).exec();
	},
	start: async function (this: SessionCollection): Promise<void> {
		const resumeable_session = await this.get_last_resumable();

		if (resumeable_session) {
			// TODO: invoke session start
		} else {
			// TODO: Throw error
		}
	},
};

function get_next_session_type(current_type: PomoType, cycle: number): PomoType {
	if (current_type === PomoType.Pomo) {
		// After a pomodoro, decide break type based on cycle
		return cycle > 0 && cycle % 4 === 0 ? PomoType.LongBreak : PomoType.ShortBreak;
	} else {
		// After any break, next is always a pomodoro
		return PomoType.Pomo;
	}
}

async function get_session_config(
	type: PomoType,
	current_cycle: number,
): Promise<{ time: number; cycle: number }> {
	switch (type) {
		case PomoType.Pomo:
			return {
				time: (await db.settings.get_setting('pomo_time')) ?? 25 * 60,
				cycle: current_cycle + 1,
			}; // TODO: read from settings
		case PomoType.ShortBreak:
			return {
				time: (await db.settings.get_setting('short_break_time')) ?? 5 * 60,
				cycle: current_cycle,
			}; // TODO: read from settings
		case PomoType.LongBreak:
			return {
				time: (await db.settings.get_setting('long_break_time')) ?? 15 * 60,
				cycle: current_cycle,
			}; // TODO: read from settings
		default:
			throw new Error(`Unknown PomoType: ${type}`);
	}
}
