import { type RxDatabase, addRxPlugin, createRxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { RxDBStatePlugin } from 'rxdb/plugins/state';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

import { setup_sessions_sync } from './sessions/client';
import {
	type SessionCollection,
	session_collection_methods,
	session_doc_methods,
	session_schema,
} from './sessions/define.svelte';
import './settings/client';
import { setup_settings_sync } from './settings/client';
import {
	type SettingsCollection,
	type SettingsDocType,
	settings_collection_methods,
	settings_doc_methods,
	settings_schema,
} from './settings/define';
import { setup_vines_sync } from './vines/client';
import {
	type VinesCollection,
	vines_collection_methods,
	vines_doc_methods,
	vines_schema,
} from './vines/define';

export type KairosCollections = {
	settings: SettingsCollection;
	vines: VinesCollection;
	sessions: SessionCollection;
};

export type KairosDB = RxDatabase<KairosCollections>;

import fakeIndexedDB from 'fake-indexeddb';
import fakeIDBKeyRange from 'fake-indexeddb/lib/FDBKeyRange';

addRxPlugin(RxDBJsonDumpPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBStatePlugin);

if (import.meta.env.DEV) {
	addRxPlugin(RxDBDevModePlugin);
}

export const db: KairosDB = await init_db();

export async function init_db(): Promise<KairosDB> {
	const db: KairosDB = await createRxDatabase({
		name: 'kairosdb',
		storage: wrappedValidateAjvStorage({ storage: import.meta.env.MODE == 'test' ? getRxStorageDexie({
			indexedDB: fakeIndexedDB,
			IDBKeyRange: fakeIDBKeyRange
		}) : getRxStorageDexie() }),
		eventReduce: true,
		closeDuplicates: true,
	});

	await db.addCollections({
		settings: {
			schema: settings_schema,
			statics: settings_collection_methods, // (optional) ORM-functions for this collection
			methods: settings_doc_methods, // (optional) ORM-functions for documents
			attachments: {}, // (optional) ORM-functions for attachments
			options: {}, // (optional) Custom parameters that might be used in plugins
			migrationStrategies: {}, // (optional)
			autoMigrate: true, // (optional) [default=true]
			cacheReplacementPolicy: function () {}, // (optional) custom cache replacement policy
		},
		sessions: {
			schema: session_schema,
			statics: session_collection_methods, // (optional) ORM-functions for this collection
			methods: session_doc_methods, // (optional) ORM-functions for documents
			attachments: {}, // (optional) ORM-functions for attachments
			options: {}, // (optional) Custom parameters that might be used in plugins
			migrationStrategies: {}, // (optional)
			autoMigrate: true, // (optional) [default=true]
			cacheReplacementPolicy: function () {}, // (optional) custom cache replacement policy
		},
		vines: {
			schema: vines_schema,
			statics: vines_collection_methods, // (optional) ORM-functions for this collection
			methods: vines_doc_methods, // (optional) ORM-functions for documents
			attachments: {}, // (optional) ORM-functions for attachments
			options: {}, // (optional) Custom parameters that might be used in plugins
			migrationStrategies: {}, // (optional)
			autoMigrate: true, // (optional) [default=true]
			cacheReplacementPolicy: function () {}, // (optional) custom cache replacement policy
		},
	});

	return db;
}

if ((await db.settings.count().exec()) == 0) {
	await db.settings.insertIfNotExists({
		id: '1',
		created_at: new Date().toISOString().replace('T', ' '),
		updated_at: new Date().toISOString().replace('T', ' '),
		pomo_time: 25 * 60,
		short_break_time: 5 * 60,
		long_break_time: 15 * 60,
		ui_sounds: true,
		timer_tick_sound: true,
		timer_finish_sound: true,
		ui_sounds_volume: 100,
		timer_tick_sound_volume: 100,
		timer_finish_sound_volume: 100,
		theme_active: 'light',
		theme_inactive: 'dark',
	} as SettingsDocType);
}

const kairos_state = await db.addState();

export let client_id = kairos_state.get('client_id');
if (!client_id) {
	client_id = crypto.randomUUID();

	await kairos_state.set('client_id', () => client_id);
}

// Set up syncronisation
await setup_settings_sync();
await setup_vines_sync();
await setup_sessions_sync();