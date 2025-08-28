import {
	type ExtractDocumentTypeFromTypedRxJsonSchema,
	type RxCollection,
	type RxDocument,
	type RxJsonSchema,
	toTypedRxJsonSchema,
} from 'rxdb';

import { VinesErrorFactory } from './errors';

export const vines_schema_literal = {
	version: 0,
	title: 'vines',
	keyCompression: false,
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: {
			type: 'string',
			maxLength: 100,
		},
		position: {
			type: 'number',
			minimum: 0,
			maximum: 100000,
			multipleOf: 1,
		},
		type: {
			type: 'string',
			maxLength: 100,
		},
		title: {
			type: 'string',
			maxLength: 200,
		},
		status: {
			type: 'string',
			maxLength: 100,
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
	required: ['id', 'position', 'type', 'title', 'status', 'public', 'session_aim', 'created_at'],
	indexes: ['position', 'type', 'title', 'status', 'public'],
} as const;

const schema_typed = toTypedRxJsonSchema(vines_schema_literal);

export type VinesDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schema_typed>;

export const vines_schema: RxJsonSchema<VinesDocType> = vines_schema_literal;

export type VinesDocMethods = {
	get_all_parents: (
		parent_id: string | undefined,
		parents: VinesDocument[],
	) => Promise<VinesDocument[]>;
	get_all_children: () => Promise<VinesDocument[]>;
	update_vine: (updates: Omit<Partial<VinesDocType>, 'updated_at' | 'created_at'>) => Promise<void>;
	delete_vine: () => Promise<void>;
};

export type VinesDocument = RxDocument<VinesDocType, VinesDocMethods>;

export type VinesCollectionMethods = {
	get_vine: (id: string) => Promise<VinesDocument | null>;
	update_vine: (
		id: string,
		updates: Omit<Partial<VinesDocType>, 'updated_at' | 'created_at'>,
	) => Promise<void>;
	add_vine: (
		opts: Omit<VinesDocType, 'updated_at' | 'created_at' | 'id'>,
	) => Promise<VinesDocument | void>;
	delete_vine: (id: string) => Promise<void>;
};

export type VinesCollection = RxCollection<VinesDocType, VinesDocMethods, VinesCollectionMethods>;

export const vines_doc_methods: VinesDocMethods = {
	get_all_parents: async function (
		this: VinesDocument,
		parent_id: string | undefined = undefined,
		parents: VinesDocument[] = [],
	): Promise<VinesDocument[]> {
		let vine = this;

		// If a specific parent_id is provided, find that parent
		if (parent_id) {
			const parent = await this.collection.findOne(parent_id).exec();

			if (parent) {
				vine = parent;
			} else {
				throw VinesErrorFactory.not_found('vine.get_all_parents', this.id, { parent_id });
			}
		}

		// If current vine has a parent, recursively get its parents
		if (vine.parent_id) {
			// Add current vine to parents array
			const updated_parents = [...parents, vine];

			// Recursively get parent's parents
			return vine.get_all_parents(vine.parent_id, updated_parents);
		} else {
			// Base case: no more parents, return accumulated parents
			return parents;
		}
	},
	get_all_children: async function (this: VinesDocument): Promise<VinesDocument[]> {
		// Get direct children
		const direct_children = await this.collection
			.find({
				selector: {
					parent_id: { $eq: this.id },
				},
			})
			.exec();

		if (direct_children.length === 0) {
			return []; // Base case: no children
		}

		// Get all descendants recursively
		const all_descendants = [...direct_children];

		for (const child of direct_children) {
			const child_descendants = await child.get_all_children();
			all_descendants.push(...child_descendants);
		}

		return all_descendants;
	},
	update_vine: async function (
		this: VinesDocument,
		updates: Omit<Partial<VinesDocType>, 'updated_at' | 'created_at'>,
	): Promise<void> {
		await this.incrementalPatch({
			...updates,
			updated_at: new Date().toISOString().replace('T', ' '),
		});
	},
	delete_vine: async function (this: VinesDocument): Promise<void> {
		await this.incrementalRemove();
	},
};

export const vines_collection_methods: VinesCollectionMethods = {
	get_vine: async function (this: VinesCollection, id: string): Promise<VinesDocument | null> {
		return await this.findOne(id).exec();
	},
	add_vine: async function (
		this: VinesCollection,
		opts: Omit<VinesDocType, 'updated_at' | 'created_at' | 'id'>,
	): Promise<VinesDocument | void> {
		return await this.insertIfNotExists({
			...opts,
			id: crypto.randomUUID(),
			created_at: new Date().toISOString().replace('T', ' '),
			updated_at: new Date().toISOString().replace('T', ' '),
		});
	},
	update_vine: async function (
		this: VinesCollection,
		id: string,
		updates: Omit<Partial<VinesDocType>, 'updated_at' | 'created_at'>,
	): Promise<void> {
		await this.findOne(id)
			.exec()
			.then((vine) =>
				vine?.incrementalPatch({
					...updates,
					updated_at: new Date().toISOString().replace('T', ' '),
				}),
			);
	},
	delete_vine: async function (this: VinesCollection, id: string): Promise<void> {
		await this.findOne(id)
			.exec()
			.then((vine) => vine?.incrementalRemove());
	},
};
