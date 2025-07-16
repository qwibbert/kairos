import type { Vine } from "../../db/appdb";
import { type VineTreeItem } from "./types";

/**
 * Builds the vine tree and returns the subtree rooted at root_id as an array.
 * If root_id is undefined, returns the full tree.
 * If the root_id is not found, returns an empty array.
 */
export const build_vine_subtree = (vines: Vine[], root_id?: string): VineTreeItem[] => {
    const vine_map: { [id: string]: VineTreeItem } = {};
    const roots: VineTreeItem[] = [];

    // Initialize map and add empty children arrays
    vines.forEach(vine => {
        if (vine.id === 'NO_vine') return;
        vine_map[vine.id] = { ...vine, children: [] };
    });

    // Build the tree
    vines.forEach(vine => {
        if (vine.id === 'NO_VINE') return;
        if (vine.parent_id && vine_map[vine.parent_id]) {
            vine_map[vine.parent_id].children!.push(vine_map[vine.id]);
        } else {
            roots.push(vine_map[vine.id]);
        }
    });

    if (!root_id) {
        return roots;
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

    return find_subtree_array(roots, root_id);
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

export function get_parent_nodes_from_flat_list(list: Vine[], id: string): Vine[] {
    const parents: Vine[] = [];
    let currentId = id;

    while (currentId) {
        const vine = list.find(t => t.id === currentId);
        if (!vine) break; // If no vine found, exit the loop
        parents.push(vine);
        currentId = vine.parent_id; // Move to the parent
    }

    return parents.reverse(); // Return in order from root to the given id

}