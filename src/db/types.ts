import type { Task } from "$features/tasks/types";

export interface Database {
    tasks: Task[],
}