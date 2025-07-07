import { TaskStatus } from '$features/tasks/types';
import type { Task } from './appdb';
import { db } from './db';

export async function get_all_parents(id: string, parents: string[] = []): Promise<string[]> {
  const task = await db.tasks.where('id').equals(id).first();

  if (!task) {
    throw new Error("Error retrieving parents: could not find a task with id: " + id)
  }

  const parent_id = task.parent_id;

  if (!parent_id) {
    return ([] as string[]).concat(parents);
  } else {
    return get_all_parents(parent_id, parents)
  }
}

export async function get_all_children(id: string, children: string[] = []): Promise<string[]> {
  const child_tasks = await db.tasks.where('parent_id').equals(id).primaryKeys();

  if (!child_tasks) {
    return children;
  }

  const childrenArrays = await Promise.all(
    child_tasks.map(child_id => get_all_children(child_id))
  );

  const all_children = child_tasks.concat(...childrenArrays);

  return children.concat(all_children);
}

export async function get_task(id: string): Promise<Task | undefined> {
  return await db.tasks.get(id);
}

export async function add_task(title: string = 'Nieuwe taak', session_aim: number = 0, parent_id: string | undefined = undefined): Promise<string> {
  return await db.tasks.add({
    id: crypto.randomUUID(),
    title,
    session_aim,
    parent_id,
    status: TaskStatus.InActive,
    created_at: new Date(),
    updated_at: new Date(),
    archived: 0
  });
};

export async function update_task(id: string, updates: Partial<Task>) {
  // If a tasks status changes to active, we must inactivate all other tasks as there can be only one active at a time
  if (updates.status == TaskStatus.Active) {
    await db.transaction('rw', [db.tasks], async () => {
      const active_tasks = await db.tasks.where('status').equals(TaskStatus.Active).primaryKeys();

      await Promise.all(active_tasks.map(id => db.tasks.update(id, { status: TaskStatus.InActive, updated_at: new Date() })));

      await db.tasks.update(id, { ...updates, updated_at: new Date() });
    });
  } else {
    await db.tasks.update(id, { ...updates, updated_at: new Date() })
  }
}

export async function archive_task(id: string) {
  await db.transaction('rw', [db.tasks], async () => {
    // Collect all ids to delete (the task and its descendants)
    const children_to_delete = await get_all_children(id);

    const changes = [...children_to_delete, id].map(task_id => ({key: task_id, changes: { archived: 1 }}));

    await db.tasks.bulkUpdate(changes);
  })
}