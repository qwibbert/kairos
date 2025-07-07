import type { Task } from "../../db/appdb";

export type TaskID = string;

export interface TaskTreeItem extends Task {
    children?: TaskTreeItem[];
}

export enum TaskStatus {
    Active = 'ACTIVE',
    InActive = 'INACTIVE',
}

export interface TasksContext {
    tasks: Task[],
    active_task: string | undefined,
}