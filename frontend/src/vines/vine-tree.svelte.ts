import { db } from '$db/db';
import type { VinesSortBy } from '$db/settings/define';
import type { VinesDocType, VinesDocument } from '$db/vines/define';
import type { RxChangeEvent, RxDocumentData } from 'rxdb';

import { Logger } from '$lib/logger';

import { VineError, VineErrorFactory } from './errors';
import { Vine } from './vine';

export class VineTree {
	#roots: VineTreeNode[] = $state([]);
	#sort_by: VinesSortBy = $state('LAST_USED_ASC');
	#parent_node: VineTreeNode | null = $state(null);

	/**
	 * Builds the VineTree from the database.
	 * @param sort_by Method by which the tree should be sorted
	 * @returns A `VineTree` or a `VineError` if a database error occured
	 */
	static async buildTree(sort_by: VinesSortBy = 'LAST_USED_DESC'): Promise<VineTree | VineError> {
		console.time('building vine tree');
		const root_vines = await VineTreeNode.getRoots();

		if (root_vines instanceof VineError) {
			return root_vines;
		}

		for (const root_vine of root_vines) {
			const res = await root_vine.retreiveChildren();

			if (res instanceof VineError) {
				return res;
			}
		}

		const tree = new VineTree();

		tree.#roots = root_vines;

		console.timeLog('building vine tree');

		return tree;
	}

	/**
	 * Gets all the nodes at the root level or the child nodes of a defined parent node.
	 * @returns `VineTreeNode[]`
	 */
	getNodesAtLevel(): VineTreeNode[] {
		if (this.#parent_node) {
			for (const root of this.#roots) {
				if (root.getDocProp('id') == this.#parent_node.getDocProp('id')) {
					return root.getChildren();
				} else {
					const matched_children = root.getChildrenOnParentMatch(
						this.#parent_node.getDocProp('id'),
					);

					if (matched_children.length >= 1) {
						return matched_children;
					}
				}
			}

			return [];
		} else {
			return this.getRoots();
		}
	}

	/**
	 * Returns the root tree nodes.
	 * @returns `VineTreeNode[]`
	 */
	getRoots(): VineTreeNode[] {
		return this.#roots;
	}

	/**
	 * Sets the currently "selected" parent node. Following this call, the `getNodesAtLevel` method will return the children of `node`.
	 * @param node New parent node.
	 */
	setParentNode(node: VineTreeNode | null) {
		this.#parent_node = node;
	}

	/**
	 * Gets the currently "selected" parent node.
	 * @returns `VineTreeNode` or `null` if no parent is set
	 */
	getParentNode(): VineTreeNode | null {
		return this.#parent_node;
	}

	/**
	 * Recursively sets the sort method for the tree.
	 */
	applySort(sort_by: VinesSortBy) {
		this.#sort_by = sort_by;

		for (const root_vine of this.#roots) {
			root_vine.applySort(this.#sort_by);
		}
	}

	/**
	 * Recursively traverses the tree in search for a node that matches the specified ID.
	 * @param id node ID to look for
	 * @returns `VineTreeNode | null`
	 */
	findVine(id: string): VineTreeNode | null {
		return this.findVineWithPropValue('id', id);
	}

	/**
	 * Recursively traverses the tree in search for a node with a property that matches the specified value.
	 * @param prop property to look for
	 * @param value value to look for
	 * @returns `VineTreeNode | null`
	 */
	findVineWithPropValue<P extends keyof VinesDocType>(prop: P, value: string): VineTreeNode | null {
		for (const root of this.#roots) {
			if (root.getDocProp(prop) === value) {
				return root;
			}

			const found = root.findNodeWithPropValue(prop, value);

			if (found) {
				return found;
			}
		}

		return null;
	}
}

export class VineTreeNode {
	#vine: Vine;
	#children: VineTreeNode[] | null;
	#children_last_used_cache: Map<string, Date> | null;

	constructor(vine: Vine) {
		this.#vine = vine;
		this.#children = null;
		this.#children_last_used_cache = null;
	}

	/**
	 * Helper method to fetch the root nodes (nodes that don't have a `parent_id` set) from the database.
	 * @returns `VineTreeNode[]` or `VineError` if a database error occured.
	 */
	static async getRoots(): Promise<VineTreeNode[] | VineError> {
		let root_vines: VinesDocument[] | null;

		try {
			root_vines = await db.vines.find({ selector: { parent_id: { $eq: '' } } }).exec();
		} catch (e) {
			return VineErrorFactory.other(e);
		}

		let root_nodes: VineTreeNode[] = [];

		for (const root of root_vines) {
			const root_node = new VineTreeNode(Vine.fromDoc(root));
			await root_node.retreiveChildren();

			root_nodes.push(root_node);
		}

		return root_nodes;
	}

	/**
	 * Returns the children for this node.
	 * @returns `VineTreeNode[]`
	 */
	getChildren(): VineTreeNode[] {
		return this.#children ?? [];
	}

	/**
	 * Recursively traverses all the children in search for a parent node that matches the specified ID. On ID match, return the children of this parent node.
	 * @param parent_id Parent node ID to look for
	 * @returns `VineTreeNode[]`
	 */
	getChildrenOnParentMatch(parent_id: string): VineTreeNode[] {
		for (const child of this.#children ?? []) {
			if (child.getDocProp('id') == parent_id) {
				return child.getChildren();
			} else {
				const result = child.getChildrenOnParentMatch(parent_id);
				if (result.length > 0) {
					return result;
				}
			}
		}

		return [];
	}

	/**
	 * Recursively traverses all the children in search for a node with the specified ID. If the node is
	 * found, return the children of this node. If the node matches the current node, return this node.
	 * @param id Node ID to look for. If the ID matches the ID of the current node, return the children of
	 * @returns `VineTreeNode | null`
	 */
	findNode(id: string): VineTreeNode | null {
		return this.findNodeWithPropValue('id', id);
	}

	/**
	 * Recursively traverses the tree in search for a node with a property that matches the specified value.
	 * @param prop property to look for
	 * @param value value to look for
	 * @returns `VineTreeNode | null`
	 */
	findNodeWithPropValue<P extends keyof VinesDocType>(prop: P, value: string): VineTreeNode | null {
		if (this.getDocProp(prop) == value) {
			return this;
		}

		for (const child of this.#children ?? []) {
			if (child.getDocProp(prop) == value) {
				return child;
			} else {
				const found = child.findNodeWithPropValue(prop, value);
				if (found) {
					return found;
				}
			}
		}

		return null;
	}

	/**
	 * Recursively traverses and returns all ancestors of this node.
	 * @returns `VineTreeNode[]` or `VineError` if a database error occured.
	 */
	async getParents(): Promise<VineTreeNode[] | VineError> {
		const parent_id = this.getDocProp('parent_id');

		if (!parent_id) {
			return [];
		}

		const parent_vine = await Vine.getVine(parent_id);

		if (parent_vine instanceof VineError) {
			return parent_vine;
		} else {
			const parent_node = new VineTreeNode(parent_vine);

			const ancestors = await parent_node.getParents();

			if (ancestors instanceof VineError) {
				return ancestors;
			}

			return [...ancestors, parent_node];
		}
	}

	/**
	 * Returns the underlying Vine instance.
	 * @returns `Vine`
	 */
	getVine(): Vine {
		return this.#vine;
	}

	/**
	 * Retreives Vine document property value.
	 * @param prop Property to return value for.
	 * @returns `VinesDocType[P]`
	 */
	getDocProp<P extends keyof VinesDocType>(prop: P): VinesDocType[P] {
		return this.#vine.getDocProp(prop);
	}

	/**
	 * Recursively fetches all children of this node from the database.
	 * @returns `void` or `VineError` if a database error occured.
	 */
	async retreiveChildren(): Promise<void | VineError> {
		const id = this.#vine.doc!.id;

		let children_docs: VinesDocument[] | null;

		try {
			children_docs = await db.vines.find({ selector: { parent_id: { $eq: id } } }).exec();
		} catch (e) {
			return VineErrorFactory.other(e);
		}

		const tree_nodes = children_docs.map((cd) => new VineTreeNode(Vine.fromDoc(cd)));

		for (const item of tree_nodes) {
			const res = await item.retreiveChildren();

			if (res instanceof VineError) {
				return res;
			}
		}

		this.#children = tree_nodes;
	}

	/**
	 * Recursively applies the specified sort method to this node's children.
	 * @param sort_by Sort method to apply
	 */
	async applySort(sort_by: VinesSortBy) {
		if (this.#children == null) {
			return;
		}

		if (['LAST_USED_DESC', 'LAST_USED_ASC'].includes(sort_by)) {
			if (!this.#children_last_used_cache) {
				this.#children_last_used_cache = new Map();
				for (const child of this.#children) {
					const last_used = await child.#vine.whenLastUsed();

					if (last_used instanceof VineError) {
						return last_used;
					}

					this.#children_last_used_cache.set(child.#vine.doc!.id, last_used);
				}
			}

			this.#children?.sort((a, b) => {
				const last_used_a = this.#children_last_used_cache!.get(a.#vine.doc!.id) ?? new Date(0);
				const last_used_b = this.#children_last_used_cache!.get(b.#vine.doc!.id) ?? new Date(0);

				if (sort_by == 'LAST_USED_ASC') {
					return last_used_b.getTime() - last_used_a.getTime();
				} else {
					return last_used_a.getTime() - last_used_b.getTime();
				}
			});
		} else if (sort_by == 'CREATION_ASC') {
			this.#children?.sort((a, b) => {
				return (
					new Date(a.#vine.doc!.created_at).getTime() - new Date(b.#vine.doc!.created_at).getTime()
				);
			});
		} else if (sort_by == 'CREATION_DESC') {
			this.#children?.sort((a, b) => {
				return (
					new Date(b.#vine.doc!.created_at).getTime() - new Date(a.#vine.doc!.created_at).getTime()
				);
			});
		} else if (sort_by == 'NAME_ASC') {
			this.#children?.sort((a, b) => {
				return a.#vine.doc!.title.localeCompare(b.#vine.doc!.title);
			});
		} else if (sort_by == 'NAME_DESC') {
			this.#children?.sort((a, b) => {
				return b.#vine.doc!.title.localeCompare(a.#vine.doc!.title);
			});
		}

		for (const child of this.#children) {
			child.applySort(sort_by);
		}
	}

	/**
	 * Deletes vine from database.
	 * @returns `void` or `VineError` if a database error occured.
	 */
	async delete(): Promise<void | VineError> {
		return this.#vine.delete();
	}

	/**
	 * Updates vine in database.
	 * @param what What properties to update.
	 * @returns `void` or `VineError` if a database error occured.
	 */
	async update(
		what: Omit<Partial<VinesDocType>, 'updated_at' | 'created_at'>,
	): Promise<void | VineError> {
		return this.#vine.update(what);
	}
}
