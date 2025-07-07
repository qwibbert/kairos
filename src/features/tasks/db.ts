import type { Task } from "../../db/appdb";
import { type TaskTreeItem } from "./types";

/**
 * Builds the task tree and returns the subtree rooted at root_id as an array.
 * If root_id is undefined, returns the full tree.
 * If the root_id is not found, returns an empty array.
 */
export const build_task_subtree = (tasks: Task[], root_id?: string): TaskTreeItem[] => {
    const taskMap: { [id: string]: TaskTreeItem } = {};
    const roots: TaskTreeItem[] = [];

    // Initialize map and add empty children arrays
    tasks.forEach(task => {
        if (task.id === 'NO_TASK') return;
        taskMap[task.id] = { ...task, children: [] };
    });

    // Build the tree
    tasks.forEach(task => {
        if (task.id === 'NO_TASK') return;
        if (task.parent_id && taskMap[task.parent_id]) {
            taskMap[task.parent_id].children!.push(taskMap[task.id]);
        } else {
            roots.push(taskMap[task.id]);
        }
    });

    if (!root_id) {
        return roots;
    }

    // Helper to find the subtree root
    function find_subtree_array(nodes: TaskTreeItem[], id: string): TaskTreeItem[] {
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

export function find_subtree(tree: TaskTreeItem[], id: string): TaskTreeItem | undefined {
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

export function get_parent_nodes_from_flat_list(list: Task[], id: string): Task[] {
    const parents: Task[] = [];
    let currentId = id;

    while (currentId) {
        const task = list.find(t => t.id === currentId);
        if (!task) break; // If no task found, exit the loop
        parents.push(task);
        currentId = task.parent_id; // Move to the parent
    }

    return parents.reverse(); // Return in order from root to the given id

}