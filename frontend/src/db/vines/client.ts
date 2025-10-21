import { RxReplicationState, replicateRxCollection } from 'rxdb/plugins/replication';
import { Subject } from 'rxjs';

import { client } from '$lib/pocketbase/';
import { push_toast } from '$lib/toasts';

import Alert from '$lib/components/alert.svelte';
import { modals } from 'svelte-modals';
import { db } from '../db';
import { VineType, type VinesDocType } from './define';

export let vines_sync_state: RxReplicationState<VinesDocType, unknown> = null;
const vines_stream$ = new Subject();

async function setup_vines_subscription() {
	await client.realtime.subscribe(
		client.authStore.record?.id + '_vines',
		({ event: e }) => {
			vines_stream$.next({
				documents: e.documents,
				checkpoint: e.checkpoint,
			});
		},
		{ headers: { Version: __KAIROS_VERSION__ } },
	);

	client.realtime.onDisconnect = () => {
		vines_stream$.next('RESYNC');
	};
}

export async function setup_vines_sync() {
	vines_sync_state = replicateRxCollection({
		collection: db.vines,
		autoStart: false,
		replicationIdentifier: 'vines-sync',
		push: {
			async handler(change_rows) {
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
						modals.open(Alert, {
							type: 'ERROR', header: 'Sync Error', text: `Failed to link course with ${affected_vine?.newDocumentState.course_title
									? 'title of ' + affected_vine.newDocumentState.course_title
									: 'id of ' + err.context.additional_data.course
								}. The course has probably been deleted since you last tried to add it.`, actions: new Map()
						})


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
			},
		},
		pull: {
			async handler(checkpoint_or_null: VinesDocType, batch_size: number) {
				const updated_at = new Date(checkpoint_or_null?.updated_at ?? 0).getTime();
				const id = checkpoint_or_null ? checkpoint_or_null.id : '';

				const response = await client.send('/api/vines/pull', {
					query: { updated_at, batch_size, id },
					headers: { Version: __KAIROS_VERSION__ },
				});

				return {
					documents: response.documents,
					checkpoint: response.checkpoint,
				};
			},
			stream$: vines_stream$.asObservable(),
		},
	});

	vines_sync_state.error$.subscribe((err) => console.log(err));

	if (client.authStore.isValid && client.authStore.record?.id) {
		await setup_vines_subscription();
		await vines_sync_state?.start();
	}

	client.authStore.onChange(async (token) => {
		if (token) {
			await setup_vines_subscription();
			await vines_sync_state?.start();
		} else {
			await vines_sync_state?.cancel();
		}
	});
}
