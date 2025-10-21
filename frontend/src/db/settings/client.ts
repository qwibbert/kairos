import { RxReplicationState, replicateRxCollection } from 'rxdb/plugins/replication';
import { Subject } from 'rxjs';

import { client } from '$lib/pocketbase/';

import { db } from '../db';
import type { SettingsDocType } from './define';

export let settings_sync_state: RxReplicationState<SettingsDocType, unknown> = null;
const settings_stream$ = new Subject();

async function setup_settings_subscription() {
	await client.realtime.subscribe(
		client.authStore.record?.id + '_settings',
		({ event: e }) => {
			settings_stream$.next({
				documents: e.documents,
				checkpoint: e.checkpoint,
			});
		},
		{ headers: { Version: __KAIROS_VERSION__ } },
	);

	client.realtime.onDisconnect = () => {
		settings_stream$.next('RESYNC');
	};
}

export async function setup_settings_sync() {
	settings_sync_state = replicateRxCollection({
		collection: db.settings,
		autoStart: false,
		replicationIdentifier: 'settings-sync',
		push: {
			async handler(change_rows) {
				const raw_response = await client.send('/api/settings/push', {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						Version: __KAIROS_VERSION__,
					},
					body: { change_rows },
				});

				return raw_response;
			},
		},
		pull: {
			async handler(checkpoint_or_null: SettingsDocType, batch_size: number) {
				const updated_at = new Date(checkpoint_or_null?.updated_at ?? 0).getTime();
				const id = checkpoint_or_null ? checkpoint_or_null.id : '';
				const response = await client.send('/api/settings/pull', {
					query: { updated_at, batch_size, id },
					headers: { Version: __KAIROS_VERSION__ },
				});

				return {
					documents: response.documents,
					checkpoint: response.checkpoint,
				};
			},
			stream$: settings_stream$,
		},
	});

	settings_sync_state.error$.subscribe((err) => {
		console.error(err);
	});

	if (client.authStore.isValid && client.authStore.record?.id) {
		await setup_settings_subscription();
		await settings_sync_state?.start();
	}

	client.authStore.onChange(async (token) => {
		if (token) {
			await setup_settings_subscription();
			await settings_sync_state?.start();
		} else {
			await settings_sync_state?.cancel();
		}
	});
}
