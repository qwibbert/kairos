import { type RxDatabase, addRxPlugin, createRxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { RxDBStatePlugin } from 'rxdb/plugins/state';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';
import {
	type SessionCollection,
	session_collection_methods,
	session_doc_methods,
	session_schema,
} from './sessions/define.svelte';
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
import { RxDBCleanupPlugin } from 'rxdb/plugins/cleanup';
import { setup_sessions_sync } from './sessions/client';

addRxPlugin(RxDBJsonDumpPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBStatePlugin);
addRxPlugin(RxDBCleanupPlugin);
addRxPlugin(RxDBMigrationSchemaPlugin);

if (import.meta.env.DEV) {
	addRxPlugin(RxDBDevModePlugin);
}

export async function init_db(): Promise<KairosDB> {
	const db: KairosDB = await createRxDatabase({
		name: 'kairosdb',
		storage: wrappedValidateAjvStorage({
			storage: import.meta.env.MODE == 'test' ? getRxStorageDexie({
				indexedDB: fakeIndexedDB,
				IDBKeyRange: fakeIDBKeyRange
			}) : getRxStorageDexie()
		}),
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
			migrationStrategies: {
				1: function (old_doc) {
					old_doc.tour_completed = false;
					return old_doc
				},
				2: function (old_doc) {
					old_doc.vines_sort_by = "LAST_USED";
					return old_doc;
				},
				3: function (old_doc) {
					old_doc.vines_sort_dir = "DESC";
					return old_doc;
				},
				4: function (old_doc) {
					old_doc.theme = old_doc.theme_inactive ?? "coffee";
					delete old_doc.theme_inactive;
					delete old_doc.theme_active;
					return old_doc;
				},
				5: function (old_doc) {
					old_doc.special_periods = true;
					return old_doc;
				},
				6: function (old_doc) {
					old_doc.special_periods_tip_shown = false;
					return old_doc;
				},
				7: function (old_doc) {
					old_doc.auto_start = false;
					return old_doc;
				},
				8: function (old_doc) {
					old_doc.timer_finish_sound = "clock";
					return old_doc;
				},
				9: function (old_doc) {
					delete old_doc.timer_tick_sound;
					delete old_doc.timer_tick_sound_volume;
					old_doc.timer_active_sound = "retro";
					old_doc.timer_active_sound_volume = 100;
					return old_doc;
				},
				10: function (old_doc) {
					delete old_doc.timer_active_sound;
					delete old_doc.timer_active_sound_volume;

					return old_doc;
				}
			}, // (optional)
			autoMigrate: true, // (optional) [default=true]
			cacheReplacementPolicy: function () { }, // (optional) custom cache replacement policy
		},
		sessions: {
			schema: session_schema,
			statics: session_collection_methods, // (optional) ORM-functions for this collection
			methods: session_doc_methods, // (optional) ORM-functions for documents
			attachments: {}, // (optional) ORM-functions for attachments
			options: {}, // (optional) Custom parameters that might be used in plugins
			migrationStrategies: {}, // (optional)
			autoMigrate: true, // (optional) [default=true]
			cacheReplacementPolicy: function () { }, // (optional) custom cache replacement policy
		},
		vines: {
			schema: vines_schema,
			statics: vines_collection_methods, // (optional) ORM-functions for this collection
			methods: vines_doc_methods, // (optional) ORM-functions for documents
			attachments: {}, // (optional) ORM-functions for attachments
			options: {}, // (optional) Custom parameters that might be used in plugins
			migrationStrategies: {
				1: function (old_doc) {
					delete old_doc.position;
					return old_doc;
				},
				2: function (old_doc) {
					delete old_doc.status;
					return old_doc;
				}
			},
			autoMigrate: true, // (optional) [default=true]
			cacheReplacementPolicy: function () { }, // (optional) custom cache replacement policy
		},
	});

	return db;
}

export const db: KairosDB = await init_db();

if ((await db.settings.count().exec()) == 0) {
	await db.settings.insertIfNotExists({
		id: '1',
		created_at: new Date().toISOString().replace('T', ' '),
		updated_at: new Date().toISOString().replace('T', ' '),
		pomo_time: 25 * 60,
		short_break_time: 5 * 60,
		long_break_time: 15 * 60,
		auto_start: false,
		ui_sounds: true,
		timer_active_sound: "retro",
		timer_finish_sound: "clock",
		ui_sounds_volume: 100,
		timer_active_sound_volume: 100,
		timer_finish_sound_volume: 100,
		theme: 'coffee',
		special_periods: true,
		special_periods_tip_shown: false,
		vines_sort_by: 'LAST_USED',
		tour_completed: false
	} as SettingsDocType);
}

const kairos_state = await db.addState();

export let client_id = kairos_state.get('client_id');
if (!client_id) {
	client_id = crypto.randomUUID();

	await kairos_state.set('client_id', () => client_id);
}

// setTimeout is needed here to circumvent a bug where the stream variable inside './*/client.ts' would not be initialised
// This is due to the fact that the client.ts import this file and vice versa, we therefore need to make sure that the variable
// initialisation has completed
setTimeout(async () => {
	// Set up syncronisation
	await setup_settings_sync();
	await setup_vines_sync();
	await setup_sessions_sync();
}, 10);



