export type TaskID = string;

export interface Task {
    id: TaskID;
    title: string;
    status: TaskStatus;
    createdAt: Date;
    updatedAt: Date;
    session_aim: number;
    parent_id?: string;
}

export interface TaskTreeItem extends Task {
    children?: TaskTreeItem[];
}

export enum TaskStatus {
    Todo = 'TODO',
    InProgress = 'IN_PROGRESS',
    Done = 'DONE',
}

export interface TasksContext {
    tasks: Task[],
    active_task: string | undefined,
}