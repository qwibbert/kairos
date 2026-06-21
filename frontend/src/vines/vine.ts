import { db } from '$db/db';
import type { SessionDocument } from '$db/sessions/define.svelte';
import type { VinesDocType, VinesDocument } from '$db/vines/define';

import { push_toast } from '$lib/toasts';

import { VineError, VineErrorFactory } from './errors';

export class Vine {
	doc: VinesDocument | null = null;
	children: Vine[] | null = null;
	parents: Vine[] | null = null;

	/**
	 * Retreives a vine document with a specified ID from the database.
	 * @param id ID of vine in database
	 * @returns `VinesDocument` or `VineError` if a database error occured
	 */
	static async getDoc(id: string): Promise<VinesDocument | VineError> {
		return db.vines
			.findOne(id)
			.exec()
			.then((doc) => {
				if (doc) {
					return doc;
				} else {
					return VineErrorFactory.noVine();
				}
			})
			.catch((e) => {
				return VineErrorFactory.other(e);
			});
	}

	/**
	 * Retreives *all* vine documents from the database.
	 * @returns `VinesDocument` or `VineError` if a database error occured
	 */
	static async getDocs(): Promise<VinesDocument[] | VineError> {
		return db.vines
			.find()
			.exec()
			.catch((e) => {
				return VineErrorFactory.other(e);
			});
	}

	/**
	 * Retreives a vine document with a specified ID from the database and converts it to a `Vine` instance.
	 * @param id ID of vine in database
	 * @returns `Vine` or `VineError` if a database error occured
	 */
	static async getVine(id: string): Promise<Vine | VineError> {
		const doc = await this.getDoc(id);
		if (doc instanceof VineError) {
			return doc;
		}

		return this.fromDoc(doc);
	}

	/**
	 * Retreives *all* vine documents from the database and converts it to a `Vine` instance.
	 * @returns `Vine[]` or `VineError` if a database error occured
	 */
	static async getVines(): Promise<Vine[] | VineError> {
		const docs = await this.getDocs();
		if (docs instanceof VineError) {
			return docs;
		}

		return docs.map((d) => this.fromDoc(d));
	}

	/**
	 * Converts an existing vine document to a `Vine` instance.
	 * @param doc `VinesDocument`
	 * @returns `Vine` instance
	 */
	static fromDoc(doc: VinesDocument): Vine {
		const vine = new Vine();
		vine.doc = doc;
		return vine;
	}

	/**
	 * Adds a new vine to the database.
	 * @param fields Field to associate with new vine document
	 * @returns A `Vine` instance or a `VineError` if a database error occured.
	 */
	static async createVine(
		fields: Omit<VinesDocType, 'updated_at' | 'created_at' | 'id'>,
	): Promise<Vine | VineError> {
		try {
			const doc = await db.vines.insertIfNotExists({
				...fields,
				id: crypto.randomUUID(),
				created_at: new Date().toISOString().replace('T', ' '),
				updated_at: new Date().toISOString().replace('T', ' '),
			});

			return this.fromDoc(doc);
		} catch (e) {
			return VineErrorFactory.other(e);
		}
	}

	/**
	 * Retreives Vine document property value.
	 * @param prop Property to return value for.
	 * @returns `VinesDocType[P]`
	 */
	getDocProp<P extends keyof VinesDocType>(prop: P): VinesDocType[P] {
		return this.doc!.get(prop);
	}

	/**
	 * Updates a vine document in the database.
	 * @param what Fields that need to be updated.
	 * @returns `void` or a `VineError` if a database error occured.
	 */
	async update(
		what: Omit<Partial<VinesDocType>, 'updated_at' | 'created_at'>,
	): Promise<void | VineError> {
		try {
			await this.doc!.incrementalPatch({
				...what,
				updated_at: new Date().toISOString().replace('T', ' '),
			});
		} catch (e) {
			return VineErrorFactory.other(e);
		}
	}

	/**
	 * Sets the deleted flag for a vine document in the database.
	 * @returns `void` or a `VineError` if a database error occured.
	 */
	async delete(): Promise<void | VineError> {
		try {
			await this.doc!.incrementalPatch({
				_deleted: true,
				updated_at: new Date().toISOString().replace('T', ' '),
			} as Partial<VinesDocType>);
		} catch (e) {
			return VineErrorFactory.other(e);
		}
	}

	/**
	 * Retrieves all parents for this vine.
	 * @returns `Vine[]` or a `VineError` if a database error occured.
	 */
	async getParents(): Promise<Vine[] | VineError> {
		if (!this.doc!.parent_id) {
			return VineErrorFactory.other('No parent');
		}

		const parents = await this.recGetParents(this.doc!.parent_id);

		return parents;
	}

	/**
	 * Retrieves all children for this vine.
	 * @returns `Vine[]` or a `VineError` if a database error occured.
	 */
	private async getChildren(): Promise<Vine[] | VineError> {
		// Get direct children
		const direct_children = await db.vines
			.find({
				selector: {
					parent_id: { $eq: this.doc!.id },
				},
			})
			.exec();

		const children = [];

		for (const child of direct_children) {
			children.push(Vine.fromDoc(child));
		}

		if (children.length === 0) {
			return []; // Base case: no children
		}

		// Get all descendants recursively
		const all_descendants = [...children];

		for (const child of children) {
			if (child.doc!.id == this.doc!.id) {
				push_toast('error', { type: 'simple', text: 'Found recursive vine! Trying to fix! ' });
				await child.update({
					parent_id: undefined,
				});
				continue;
			}

			const child_descendants = await child.getChildren();

			if (child_descendants instanceof VineError) {
				return child_descendants;
			} else {
				all_descendants.push(...child_descendants);
			}
		}

		return all_descendants;
	}

	/**
	 * Recursive helper method to retrieve all parents for this vine.
	 * @returns `Vine[]` or a `VineError` if a database error occured.
	 */
	private async recGetParents(
		parent_id: string,
		parents: Vine[] = [],
	): Promise<Vine[] | VineError> {
		let vine: Vine = this;

		// If a specific parent_id is provided, find that parent
		if (parent_id) {
			const parent = await Vine.getVine(parent_id);

			if (parent instanceof VineError) {
				return VineErrorFactory.other(parent);
			} else {
				vine = parent;
			}
		}

		// If current vine has a parent, recursively get its parents
		if (vine.doc?.parent_id) {
			// Add current vine to parents array
			const updated_parents = [...parents, vine];

			// Recursively get parent's parents
			return vine.recGetParents(vine.doc!.parent_id, updated_parents);
		} else {
			// Base case: no more parents, return accumulated parents
			return parents;
		}
	}

	/**
	 * Retreives the last time the vine was used in a session.
	 * @returns `Date` or `VineError` if a database error occured.
	 */
	async whenLastUsed(): Promise<Date | VineError> {
		let last_session: SessionDocument | null;
		try {
			last_session = await db.sessions
				.findOne({ selector: { vine_id: { $eq: this.doc!.id } }, sort: [{ updated_at: 'desc' }] })
				.exec();
		} catch (e) {
			return VineErrorFactory.other(e);
		}

		if (last_session) {
			return new Date(last_session.updated_at ?? 0);
		} else {
			return new Date(0);
		}
	}
}
