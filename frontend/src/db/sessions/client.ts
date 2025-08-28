import { VineType } from '$features/vines/types';
import { RxReplicationState, replicateRxCollection } from 'rxdb/plugins/replication';
import { Subject, mergeMap } from 'rxjs';

import { alert_dialog, push_toast } from '$lib/components/alerts.svelte';
import { client } from '$lib/pocketbase';

import { db } from '../db';
import type { SessionDocType } from './define.svelte';

const active_replications = new Map<string, RxReplicationState<SessionDocType, unknown>>([]); // chunkId -> replicationState

async function start_session_replication(session_id: string) {
	if (active_replications.get(session_id)) return;
	const replication_id = 'session-' + session_id;

	const replication_state = replicateRxCollection({
		collection: db.sessions,
		replicationIdentifier: replication_id,
		autoStart: false,
		push: {
			async handler(change_rows) {
				change_rows = change_rows.filter((row) => {
					// Only sync sessions with status READY or SKIPPED to ensure that different clients cannot interfere with eachothers sessions
					if (row.newDocumentState.status == 'READY' || row.newDocumentState.status == 'SKIPPED') {
						return true;
					}

					return false;
				});

				if (change_rows.length > 0) {
					try {
						const raw_response = await client.send('/api/sessions/push', {
							method: 'POST',
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json',
								Version: __KAIROS_VERSION__,
							},
							body: { change_rows },
						});

						return raw_response;
					} catch (err) {
						if (
							err.status == 424 &&
							err.response.message == 'The course relation was not found in the upstream database.'
						) {
							const affected_vine = change_rows.findLast(
								(v) => v.newDocumentState.id == err.entity_id,
							);

							// This error implies that the user tried to link a course that has been deleted from upstream.
							// We should inform the user and reset the affected vine to a task type
							alert_dialog({
								id: crypto.randomUUID(),
								type: 'ERROR',
								header: 'Sync Error',
								text: `Failed to link course with ${
									affected_vine?.newDocumentState.course_title
										? 'title of ' + affected_vine.newDocumentState.course_title
										: 'id of ' + err.context.additional_data.course
								}. The course has probably been deleted since you last tried to add it.`,
								dismissable: true,
								actions: new Map(),
							});

							const db_vine = db.vines.findOne(err.entity_id);

							if (db_vine) {
								await db.vines.update_vine(err.entity_id, {
									type: VineType.Task,
									course_id: undefined,
									course_code: undefined,
									course_instructor: undefined,
									course_title: undefined,
									course_weight: undefined,
								});
							}

							// Remove the problematic record from the change rows
							const fixed_change_rows = change_rows.filter(
								(row) =>
									row.newDocumentState.id != affected_vine?.newDocumentState.id &&
									row.newDocumentState.course_id,
							);

							const raw_response = await client.send('/api/vines/push', {
								method: 'POST',
								headers: {
									Accept: 'application/json',
									'Content-Type': 'application/json',
									Version: __KAIROS_VERSION__,
								},
								body: { fixed_change_rows },
							});

							return raw_response;
						} else if (
							err.status == 424 &&
							err.response.message == 'The parent relation was not found in the upstream database.'
						) {
							const affected_vine = change_rows.findLast(
								(v) => v.newDocumentState.id == err.response.context.entity_id,
							);

							async function try_upload(parent_id: string) {
								// Check if the parent exists in the local database
								const local = await db.vines.get_vine(parent_id);

								if (local) {
									// Try to upload the parent to upstream
									try {
										await client
											.collection('vines')
											.create({ ...local.toJSON(), user: client.authStore.record?.id });
									} catch (err_) {
										if (err_.code == 404) {
											// Recursive parent uploading
											await try_upload(local.parent_id!);
										}
									}
								}
							}

							await try_upload(affected_vine!.newDocumentState.parent_id!);

							try {
								const raw_response = await client.send('/api/vines/push', {
									method: 'POST',
									headers: {
										Accept: 'application/json',
										'Content-Type': 'application/json',
										Version: __KAIROS_VERSION__,
									},
									body: { change_rows },
								});

								return raw_response;
							} catch {
								// Trying to upload the parents did not work, remove the parent relation and inform the user
								const db_vine = db.vines.findOne(err.entity_id);

								if (db_vine) {
									await db.vines.update_vine(err.entity_id, {
										parent_id: undefined,
									});
								}

								// Remove the problematic record from the change rows
								const fixed_change_rows = change_rows.filter(
									(row) => row.newDocumentState.id != affected_vine?.newDocumentState.id,
								);

								const raw_response = await client.send('/api/vines/push', {
									method: 'POST',
									headers: {
										Accept: 'application/json',
										'Content-Type': 'application/json',
										Version: __KAIROS_VERSION__,
									},
									body: { fixed_change_rows },
								});

								push_toast('error', {
									type: 'headed',
									header: 'Sync Error',
									text: "The parent of the vine that you just added doesn't seem to exist and has thus been removed. You can find the vine at the root level",
								});

								return raw_response;
							}
						}

						throw err;
					}
				}
			},
		},
	});
	active_replications.set(session_id, replication_state);

	if (client.authStore.isValid && client.authStore.record?.id) {
		await replication_state?.start();
	}

	client.authStore.onChange(async (token) => {
		if (token) {
			await replication_state?.start();
		} else {
			await sessions_sync_state?.pause();
		}
	});

	replication_state.active$.pipe(
		mergeMap(async () => {
			await replication_state.awaitInSync();
			stop_session_replication(session_id);
		}),
	);
}

async function stop_session_replication(session_id: string) {
	const rep = active_replications.get(session_id);
	if (rep) {
		await rep.cancel();
		await rep.remove();

		active_replications.delete(session_id);
	}
}

// Called whenever the player's location changes;
// dynamically start/stop replication for nearby chunks.
export function on_session_syncable(session_id: string) {
	start_session_replication(session_id);
}

export let sessions_sync_state: RxReplicationState<SessionDocType, unknown> | null = null;
const sessions_stream$ = new Subject();

async function setup_sessions_subscription() {
	await client.realtime.subscribe(
		client.authStore.record?.id + '_sessions',
		({ event: e }) => {
			sessions_stream$.next({
				documents: e.documents,
				checkpoint: e.checkpoint,
			});
		},
		{ headers: { Version: __KAIROS_VERSION__ } },
	);

	client.realtime.onDisconnect = () => {
		sessions_stream$.next('RESYNC');
	};
}

export async function setup_sessions_sync() {
	sessions_sync_state = replicateRxCollection({
		collection: db.sessions,
		autoStart: false,
		replicationIdentifier: 'sessions-sync',
		pull: {
			async handler(checkpoint_or_null: SessionDocType, batch_size: number) {
				const updated_at = new Date(checkpoint_or_null?.updated_at ?? 0).getTime();
				const id = checkpoint_or_null ? checkpoint_or_null.id : '';
				const response = await client.send('/api/sessions/pull', {
					method: 'GET',
					query: { updated_at, batch_size, id },
					headers: { Version: __KAIROS_VERSION__ },
				});

				return {
					documents: response.documents,
					checkpoint: response.checkpoint,
				};
			},
			stream$: sessions_stream$.asObservable(),
		},
	});

	sessions_sync_state.error$.subscribe((err) => console.error(err));

	if (client.authStore.isValid && client.authStore.record?.id) {
		await setup_sessions_subscription();
		await sessions_sync_state?.start();
	}

	client.authStore.onChange(async (token) => {
		if (token) {
			await setup_sessions_subscription();
			await sessions_sync_state?.start();
		} else {
			await sessions_sync_state?.cancel();
		}
	});
}
