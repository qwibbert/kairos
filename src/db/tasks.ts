import { TaskStatus } from '$features/tasks/types';
import { ErrorBase } from '$lib/errors';
import type { Task } from './appdb';
import { db } from './db';

type ErrorName =
  | 'DUPLICATE_ENTRY'
  | 'EMPTY_TITLE'
  | 'NOT_PRESENT'
  | 'OTHER';

export class TasksError extends ErrorBase<ErrorName> { }

export async function get_all_parents(id: string, parents: string[] = []): Promise<string[]> {
  const task = await db.tasks.where('id').equals(id).first().catch(e => {
    throw new TasksError({ name: 'OTHER', message: 'A not further specified error occured while retrieving parents of ' + id + '.', cause: e });
  });

  if (!task) {
    throw new TasksError({ name: 'NOT_PRESENT', message: 'Error retrieving parents: could not find a task with id: ' + id + '.' });
  }

  const parent_id = task.parent_id;

  if (!parent_id) {
    return ([] as string[]).concat(parents);
  } else {
    return get_all_parents(parent_id, parents.concat(parent_id));
  }
}

export async function get_all_children(id: string, children: string[] = []): Promise<string[]> {
  const child_tasks = await db.tasks.where('parent_id').equals(id).primaryKeys().catch(e => {
    throw new TasksError({ name: 'OTHER', message: 'A not further specified error occured while retrieving children of ' + id + '.', cause: e });
  });

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
  return await db.tasks.get(id).catch(e => {
    throw new TasksError({ name: 'OTHER', message: 'A not further specified error occured while retrieving task with id ' + id + '.', cause: e });
  });
}

export async function add_task(title: string = 'Nieuwe taak', session_aim: number = 0, parent_id: string | undefined = undefined): Promise<string> {
  if (title == '') {
    throw new TasksError({ name: 'EMPTY_TITLE', message: 'An empty string was provided as task title.' });
  }

  return await db.tasks.add({
    id: crypto.randomUUID(),
    title,
    session_aim,
    parent_id,
    status: TaskStatus.InActive,
    created_at: new Date(),
    updated_at: undefined,
    archived: 0
  }).catch(e => {
    throw new TasksError({ name: 'OTHER', message: 'A not further specified error occured while adding task', cause: e });
  });
};

export async function update_task(id: string, updates: Partial<Task>) {
  delete updates.id;
  delete updates.created_at;
  delete updates.archived;

  // If a tasks status changes to active, we must inactivate all other tasks as there can be only one active at a time
  if (updates.status == TaskStatus.Active) {
    await db.transaction('rw', [db.tasks], async () => {
      const active_tasks = await db.tasks.where('status').equals(TaskStatus.Active).primaryKeys().catch(e => {
        throw new TasksError({ name: 'OTHER', message: 'A not further specified error occured while retrieving active tasks.', cause: e });
      });

      await Promise.all(active_tasks.map(id => db.tasks.update(id, { status: TaskStatus.InActive, updated_at: new Date() }).catch(e => {
        throw new TasksError({ name: 'OTHER', message: 'A not further specified error occured while inactivating active tasks.', cause: e });
      })));
    });
  }

  await db.tasks.update(id, { ...updates, updated_at: new Date() }).catch(e => {
    throw new TasksError({ name: 'OTHER', message: 'A not further specified error occured while updating task.', cause: e });
  }).then(result => {
    if (result == 0) {
      throw new TasksError({ name: 'NOT_PRESENT', message: 'Cannot update a non-existant task.' });
    }
  });
}

export async function archive_task(id: string) {
  await db.transaction('rw', [db.tasks], async () => {
    // Collect all ids to delete (the task and its descendants)
    const children_to_delete = await get_all_children(id);

    const changes = [...children_to_delete, id].map(task_id => ({ key: task_id, changes: { archived: 1 } }));

    await db.tasks.bulkUpdate(changes).catch(e => {
      throw new TasksError({ name: 'OTHER', message: 'A not further specified error occured while archiving task.', cause: e });
    }).then(result => {
      if (result == 0) {
        throw new TasksError({ name: 'NOT_PRESENT', message: 'Cannot update a non-existant task.' });
      }
    });
  })
}