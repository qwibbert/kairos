import { db } from '../../db/db';
import type { VinesSortBy } from '../../db/settings/define';
import type { VinesDocument } from '../../db/vines/define';
import { type VineTreeItem } from './types';

/**
 * Builds the vine tree and returns the subtree rooted at root_id as an array.
 * If root_id is undefined, returns the full tree.
 * If the root_id is not found, returns an empty array.
 */
export const build_vine_subtree = async (vines: VinesDocument[], root_id?: string, sort_by: VinesSortBy, search_string: string): Promise<VineTreeItem[]> => {
	const vine_map: { [id: string]: VineTreeItem } = {};
	const roots: VineTreeItem[] = [];

	// Initialize map and add empty children arrays
	for await (const vine of vines.map(v => {
		if (sort_by == 'LAST_USED_ASC' || sort_by == 'LAST_USED_DESC') {
			return db.sessions
				.findOne({
					selector: {
						vine_id: v.id,
					},
					sort: [{ updated_at: 'desc' }],
				})
				?.exec()
				.then((v) => new Date(v?.updated_at ?? 0).getTime()).then((last_updated) => ({ ...v.toJSON(), last_updated }));
		} else return { ...v.toJSON() };
	})) {
		if (vine.id === 'NO_VINE') continue;

		if (search_string != "" && !vine.title.toLocaleLowerCase().includes(search_string.toLocaleLowerCase())) continue;

		vine_map[vine.id] = { ...vine, children: [] };
	}

	// Build the tree
	vines.forEach((vine) => {
		if (vine.id === 'NO_VINE') return;

		if (search_string != "" && !vine.title.toLocaleLowerCase().includes(search_string.toLocaleLowerCase())) return;

		if (vine.parent_id && vine_map[vine.parent_id]) {
			vine_map[vine.parent_id].children!.push(vine_map[vine.id]);
		} else {
			roots.push(vine_map[vine.id]);
		}
	});

	if (!root_id) {
		return roots.toSorted(
		(a: VinesDocument, b: VinesDocument) => {
			switch (sort_by) {
				case 'LAST_USED_DESC':
					return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
				case 'LAST_USED_ASC':
					return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
				case 'CREATION_ASC':
					return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
				case 'CREATION_DESC':
					return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
				case 'NAME_ASC':
					return a.title.localeCompare(b.title);
				case 'NAME_DESC':
					return b.title.localeCompare(a.title);
			}
		},
	);
	}


	// Helper to find the subtree root
	function find_subtree_array(nodes: VineTreeItem[], id: string): VineTreeItem[] {
		for (const node of nodes) {
			if (node.id === id) {
				return node.children || [];
			} else if (node.children && node.children.length > 0) {
				const found = find_subtree_array(node.children, id);
				if (found.length > 0) {
					return found;
				}
			}
		}
		// If not found, return an empty array
		return [];
	}

	return find_subtree_array(roots, root_id).toSorted(
		(a: VinesDocument, b: VinesDocument) => {
			switch (sort_by) {
				case 'LAST_USED_DESC':
					return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
				case 'LAST_USED_ASC':
					return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
				case 'CREATION_ASC':
					return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
				case 'CREATION_DESC':
					return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
				case 'NAME_ASC':
					return a.title.localeCompare(b.title);
				case 'NAME_DESC':
					return b.title.localeCompare(a.title);
			}
		},
	);
};

export function find_subtree(tree: VineTreeItem[], id: string): VineTreeItem | undefined {
	for (const node of tree) {
		if (node.id === id) {
			return node;
		}
		if (node.children && node.children.length > 0) {
			const found = find_subtree(node.children, id);
			if (found) return found;
		}
	}
	return undefined;
}

export function get_parent_nodes_from_flat_list(
	list: VinesDocument[],
	id: string,
): VinesDocument[] {
	const parents: VinesDocument[] = [];
	let currentId = id;

	while (currentId) {
		const vine = list.find((t) => t.id === currentId);
		if (!vine) break; // If no vine found, exit the loop
		parents.push(vine);
		currentId = vine.parent_id; // Move to the parent
	}

	return parents.reverse(); // Return in order from root to the given id
}
