import { save_db } from "../../db/db";
import { TaskStatus, type Task, type TaskID, type TasksContext, type TaskTreeItem } from "./types";

export async function add_task(tasks: Task[], title: string = 'Nieuwe taak', session_aim: number = 0, parent_id: string | undefined = undefined): Promise<TaskID> {
    const task: Task = {
        id: crypto.randomUUID(),
        title,
        status: TaskStatus.Todo,
        createdAt: new Date(),
        updatedAt: new Date(),
        session_aim,
        parent_id
    };

    save_tasks([...tasks, task]);

    tasks.push(task);
    return task.id as TaskID;
};

export async function update_task(tasks_context: TasksContext, tasks: Task[], id: string, updates: Partial<Task>) {
    if (!tasks) {
        throw new Error("No tasks found in the database.");
    }

    const index = tasks?.findIndex(task => task.id === id);
    if (index === -1) throw new Error(`Task with id ${id} not found.`);

    const updatedTask = { ...tasks[index], ...updates, updatedAt: new Date() };

    if (updates.status == TaskStatus.InProgress) {
        tasks_context.active_task = updatedTask.id;

        tasks?.forEach(task => {
            if (task.id !== id && task.status == TaskStatus.InProgress) {
                console.debug(`Setting task with id: ${task.id} to TODO status as another task is now in progress.`);
                update_task(tasks_context, tasks, task.id, { status: TaskStatus.Todo });
            }
        })
    } else if (updates.status == TaskStatus.Done || updates.status == TaskStatus.Todo) {
        if (tasks_context.active_task == id) {
            tasks_context.active_task = 'NO_TASK';
        }
    }

    tasks[index] = updatedTask;

    await save_tasks(tasks);
}

// This function requires the tasks_context due to svelte not detecting 
// a full reassignment of the tasks array when directly passed
export async function delete_task(tasks_context: TasksContext, id: string) {
    const index = tasks_context.tasks?.findIndex(task => task.id === id);
    if (index === -1) throw new Error(`Task with id ${id} not found.`);

    // Collect all ids to delete (the task and its descendants)
    const collectIdsToDelete = (parentId: string, allTasks: Task[]): string[] => {
        let ids = [parentId];
        allTasks.forEach(task => {
            if (task.parent_id === parentId) {
                ids = ids.concat(collectIdsToDelete(task.id, allTasks));
            }
        });
        return ids;
    };

    const idsToDelete = collectIdsToDelete(id, tasks_context.tasks ?? []);

    tasks_context.tasks = tasks_context.tasks?.filter(task => !idsToDelete.includes(task.id));

    await save_tasks(tasks_context.tasks);
}

export function retrieve_active_task(tasks: Task[]): string {
    const task_in_progress = tasks?.find(task => task.status === TaskStatus.InProgress)?.id;

    if (!task_in_progress) {
        return 'NO_TASK';
    } else {
        return task_in_progress;
    }
}

export async function retrieve_all_tasks(): Promise<Task[]> {
    return JSON.parse(localStorage.getItem('tasks') ?? '[]');
}

export async function retrieve_task(id: string): Promise<Task | undefined> {
    return retrieve_all_tasks().then(tasks => {
        console.debug(`Retrieving task with id: ${id}`);
        return tasks?.find(task => task.id === id);
    });
}

export async function ensure_no_task_exists(tasks: Task[]) {
    if (!tasks.find(task => task.id === 'NO_TASK')) {
        tasks.push({
            id: 'NO_TASK',
            title: 'No Task',
            status: TaskStatus.Todo,
            createdAt: new Date(),
            updatedAt: new Date(),
            session_aim: 0
        });
        await save_tasks(tasks);
    }
}

export async function save_tasks(tasks: Task[]) {
    try {
        console.debug("Saving tasks to local storage.");
        await save_db('tasks', tasks);
    } catch (error) {
        console.error("Failed to save tasks:", error);
    }
}

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