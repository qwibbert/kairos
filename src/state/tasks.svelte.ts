export enum TaskStatus {
    Todo = 'TODO',
    InProgress = 'IN_PROGRESS',
    Done = 'DONE',
}

export interface Task {
    id: string;
    title: string;
    status: TaskStatus;
    createdAt: Date;
    updatedAt: Date;
    session_aim: number;
    parent_id?: string;
}

export interface TaskListItem extends Task {
    children?: TaskListItem[];
}

let tasks = $state<Task[]>();

export const add_task = (title: string = 'Nieuwe taak', session_aim: number = 0, parent_id: string | undefined = undefined): Task => {
    console.debug(`Adding new task with title: ${title} and session aim: ${session_aim}`);
    const task: Task = {
        id: crypto.randomUUID(),
        title,
        status: TaskStatus.Todo,
        createdAt: new Date(),
        updatedAt: new Date(),
        session_aim,
        parent_id
    };

    tasks = [...tasks, task];
    save_tasks();
    return task;
};

export const update_task = (id: string, updates: Partial<Task>): Task | undefined => {
    console.debug(`Updating task with id: ${id} with updates:`, updates);
    const index = tasks?.findIndex(task => task.id === id);
    if (index === -1) return undefined;

    const updatedTask = { ...tasks[index], ...updates, updatedAt: new Date() };

    if (updates.status == TaskStatus.InProgress) {
        tasks?.forEach(task => {
            if (task.id !== id && task.status == TaskStatus.InProgress) {
                console.debug(`Setting task with id: ${task.id} to TODO status as another task is now in progress.`);
                update_task(task.id, { status: TaskStatus.Todo });
            }
        })
    }

    tasks[index] = updatedTask;
    save_tasks();
    return updatedTask;
}

export const get_task_in_progress = (): Task | undefined => {
    const task_in_progress = tasks?.find(task => task.status === TaskStatus.InProgress);

    if (!task_in_progress) {
        return tasks?.find(task => task.id === 'NO_TASK');
    } else {
        console.debug(`Task in progress found: ${task_in_progress.title} (ID: ${task_in_progress.id})`);
        return task_in_progress;
    }
}

export const delete_task = (id: string): boolean => {
    const index = tasks?.findIndex(task => task.id === id);
    if (index === -1) return false;

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

    const idsToDelete = collectIdsToDelete(id, tasks ?? []);
    tasks = tasks?.filter(task => !idsToDelete.includes(task.id));
    save_tasks();
    return true;
}

export const get_tasks = (): Task[] | undefined => {
    return tasks;
}

export const get_task = (id: string): Task | undefined => {
    console.debug(`Retrieving task with id: ${id}`);
    return tasks?.find(task => task.id === id);
}

export const save_tasks = () => {
    console.debug("Saving tasks to local storage.");
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

export const get_task_list = (parent: string | undefined = undefined): TaskListItem[] => {
    console.debug("Generating task list.");
    const task_map: { [key: string]: TaskListItem } = {};
    tasks?.forEach(task => {
        if (task.id != 'NO_TASK') {
            task_map[task.id] = { ...task, children: [] } as TaskListItem;
        }
    });

    const taskList: TaskListItem[] = [];
    tasks?.forEach(task => {
        if (task.id == 'NO_TASK') return;

        if (task.parent_id) {
            if (task_map[task.parent_id]) {
                task_map[task.parent_id].children!.push(task_map[task.id]);
            }
        } else {
            taskList.push(task_map[task.id]);
        }
    });

    return parent ? task_map[parent].children : taskList;
}

export const get_parents = (task: string): TaskListItem[] => {
    console.debug(`Retrieving parents for task with id: ${task}`);
    const parents: TaskListItem[] = [];
    let currentTask = tasks?.find(t => task === t.id);

    while (currentTask && currentTask.parent_id) {
        const parentTask = tasks?.find(task => task.id === currentTask.parent_id);
        if (parentTask) {
            parents.unshift({ ...parentTask, children: [] });
            currentTask = parentTask;
        } else {
            break;
        }
    }

    return parents;
}
export const restore_local_tasks = (): Task[] => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        console.debug("Restoring tasks from local storage.");
        tasks = JSON.parse(storedTasks) as Task[];
    } else {
        console.debug("No tasks found in local storage, initializing empty task list.");
        tasks = [];

        // Add NO_TASK
        tasks.push({
            id: 'NO_TASK',
            title: 'No Task',
            status: TaskStatus.Todo,
            createdAt: new Date(),
            updatedAt: new Date(),
            session_aim: 0
        });

        save_tasks();
    }
    return tasks;
}