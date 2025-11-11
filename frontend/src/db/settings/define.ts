import {
	type ExtractDocumentTypeFromTypedRxJsonSchema,
	type RxCollection,
	type RxDocument,
	type RxJsonSchema,
	toTypedRxJsonSchema,
} from 'rxdb';

export const settings_schema_literal = {
	version: 8,
	title: 'settings',
	keyCompression: false,
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: {
			type: 'string',
			maxLength: 36,
		},
		pomo_time: {
			type: 'number',
			minimum: 0,
			maximum: 999 * 60,
			multipleOf: 1,
			default: 25 * 60,
		},
		short_break_time: {
			type: 'number',
			minimum: 0,
			maximum: 999 * 60,
			multipleOf: 1,
			default: 5 * 60,
		},
		long_break_time: {
			type: 'number',
			minimum: 0,
			maximum: 999 * 60,
			multipleOf: 1,
			default: 15 * 60,
		},
		auto_start: {
			type: 'boolean'
		},
		ui_sounds: {
			type: 'boolean',
		},
		timer_tick_sound: {
			type: 'boolean',
		},
		timer_finish_sound: {
			type: 'string',
		},
		ui_sounds_volume: {
			type: 'number',
			minimum: 0,
			maximum: 100,
			multipleOf: 1,
			default: 100,
		},
		timer_tick_sound_volume: {
			type: 'number',
			minimum: 0,
			maximum: 100,
			multipleOf: 1,
			default: 100,
		},
		timer_finish_sound_volume: {
			type: 'number',
			minimum: 0,
			maximum: 100,
			multipleOf: 1,
			default: 100,
		},
		theme: {
			type: 'string',
			maxLength: 100,
			default: 'light',
		},
		special_periods: {
			type: 'boolean'
		},
		special_periods_tip_shown: {
			type: 'boolean'
		},
		vines_sort_by: {
			type: 'string',
			maxLength: 100
		},
		vines_sort_dir: {
			type: 'string',
			maxLength: 100
		},
		tour_completed: {
			type: 'boolean'
		},
		status: {
			type: 'string',
			maxLength: 100,
		},
		created_at: {
			type: 'string',
			format: 'date-time',
		},
		updated_at: {
			type: 'string',
			format: 'date-time',
		},
	},
	required: ['created_at'],
} as const;

export type VinesSortBy = "LAST_USED_ASC" | "LAST_USED_DESC" | "CREATION_ASC" | "CREATION_DESC" | "NAME_ASC" | "NAME_DESC";

const schema_typed = toTypedRxJsonSchema(settings_schema_literal);

export type SettingsDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schema_typed>;

export const settings_schema: RxJsonSchema<SettingsDocType> = settings_schema_literal;

export type SettingsDocMethods = {
	modify_setting: <K extends keyof SettingsDocType>(
		key: K,
		value: SettingsDocType[K],
	) => Promise<void>;
};

export type SettingsDocument = RxDocument<SettingsDocType, SettingsDocMethods>;

export type SettingsCollectionMethods = {
	get_settings: () => Promise<SettingsDocument | null>;
	get_setting: <K extends keyof SettingsDocType>(key: K) => Promise<SettingsDocType[K]>;
};

export type SettingsCollection = RxCollection<
	SettingsDocType,
	SettingsDocMethods,
	SettingsCollectionMethods
>;

export const settings_doc_methods = {
	modify_setting: async function <K extends keyof SettingsDocType>(
		this: SettingsDocument,
		key: K,
		value: SettingsDocType[K],
	): Promise<void> {
		await this.incrementalUpdate({
			$set: {
				[key]: value,
				updated_at: new Date().toISOString().replace('T', ' '),
			},
		});
	},
};

export const settings_collection_methods: SettingsCollectionMethods = {
	get_settings: async function (this: SettingsCollection) {
		return await this.findOne().exec();
	},
	get_setting: async function <K extends keyof SettingsDocType>(this: SettingsCollection, key: K) {
		return await this.findOne()
			.exec()
			.then((settings) => settings?.get(key));
	},
};
