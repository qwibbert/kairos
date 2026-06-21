import {
	type ExtractDocumentTypeFromTypedRxJsonSchema,
	type RxCollection,
	type RxDocument,
	type RxJsonSchema,
	toTypedRxJsonSchema,
} from 'rxdb';

import { push_toast } from '$lib/toasts';

import { VinesErrorFactory } from './errors';

export const vines_schema_literal = {
	version: 2,
	title: 'vines',
	keyCompression: false,
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: {
			type: 'string',
			maxLength: 100,
		},
		type: {
			type: 'string',
			maxLength: 100,
		},
		title: {
			type: 'string',
			maxLength: 200,
		},
		parent_id: {
			type: 'string',
			maxLength: 100,
		},
		public: {
			type: 'boolean',
		},
		session_aim: {
			type: 'number',
			minimum: 0,
		},
		course_title: {
			type: 'string',
			maxLength: 200,
		},
		course_id: {
			type: 'string',
			maxLength: 100,
		},
		course_code: {
			type: 'string',
			maxLength: 100,
		},
		course_weight: {
			type: 'number',
			minimum: 0,
		},
		course_instructor: {
			type: 'string',
			maxLength: 200,
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
	required: ['id', 'type', 'title', 'public', 'session_aim', 'created_at'],
	indexes: ['type', 'title', 'public'],
} as const;

const schema_typed = toTypedRxJsonSchema(vines_schema_literal);

export type VinesDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schema_typed>;

export const vines_schema: RxJsonSchema<VinesDocType> = vines_schema_literal;

export type VinesDocument = RxDocument<VinesDocType>;

export type VineID = string;

export interface VineTreeItem extends VinesDocument {
	children?: VineTreeItem[];
}

export enum VineType {
	Course = 'COURSE',
	Task = 'TASK',
}

export type VinesCollection = RxCollection<VinesDocType>;
