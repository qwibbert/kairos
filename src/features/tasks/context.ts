import { getContext, setContext } from 'svelte';
import type { TasksContext } from './types';

const TASKS_CONTEXT_KEY = {};

export function setTaskContext(context: TasksContext) {
    setContext(TASKS_CONTEXT_KEY, context);
}

export function getTaskContext() {
	return getContext(TASKS_CONTEXT_KEY) as TasksContext;
}
