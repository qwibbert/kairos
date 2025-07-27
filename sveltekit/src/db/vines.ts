import { VineStatus, VineType } from '$features/vines/types';
import { ErrorBase } from '$lib/errors';
import { _ } from 'svelte-i18n';
import { get } from 'svelte/store';
import type { Vine } from './appdb';
import { db } from './db';

type ErrorName =
  | 'DUPLICATE_ENTRY'
  | 'EMPTY_TITLE'
  | 'NOT_PRESENT'
  | 'OTHER';

export class VineError extends ErrorBase<ErrorName> { }

export async function get_all_parents(id: string, parents: string[] = []): Promise<string[]> {
  const vine = await db.vines.where('id').equals(id).first().catch(e => {
    throw new VineError({ name: 'OTHER', message: 'A not further specified error occured while retrieving parents of ' + id + '.', cause: e });
  });

  if (!vine) {
    throw new VineError({ name: 'NOT_PRESENT', message: 'Error retrieving parents: could not find a vine with id: ' + id + '.' });
  }

  const parent_id = vine.parent_id;

  if (!parent_id) {
    return ([] as string[]).concat(parents);
  } else {
    return get_all_parents(parent_id, parents.concat(parent_id));
  }
}

export async function get_all_children(id: string, children: string[] = []): Promise<string[]> {
  const child_vines = await db.vines.where('parent_id').equals(id).primaryKeys().catch(e => {
    throw new VineError({ name: 'OTHER', message: 'A not further specified error occured while retrieving children of ' + id + '.', cause: e });
  });

  if (!child_vines) {
    return children;
  }

  const childrenArrays = await Promise.all(
    child_vines.map(child_id => get_all_children(child_id))
  );

  const all_children = child_vines.concat(...childrenArrays);

  return children.concat(all_children);
}

export async function get_vine(id: string): Promise<Vine | undefined> {
  return await db.vines.get(id).catch(e => {
    throw new VineError({ name: 'OTHER', message: 'A not further specified error occured while retrieving vine with id ' + id + '.', cause: e });
  });
}

export async function add_vine(title: string = get(_)('new_vine'), type: VineType, session_aim: number | undefined = undefined, parent_id: string): Promise<string> {
  if (title == '') {
    throw new VineError({ name: 'EMPTY_TITLE', message: 'An empty string was provided as vine title.' });
  }
  const length = await db.vines.where('parent_id').equals(parent_id).sortBy("position").then(result => result.length);

  return await db.vines.add({
    id: crypto.randomUUID(),
    position: length,
    type: VineType.Task,
    title,
    session_aim,
    parent_id,
    status: VineStatus.InActive,
    created_at: new Date(),
    updated_at: undefined,
    archived: 0,
    public: 0
  }).catch(e => {
    throw new VineError({ name: 'OTHER', message: 'A not further specified error occured while adding vine', cause: e });
  });
};

export async function update_vine(id: string, updates: Partial<Vine>) {
  delete updates.id;
  delete updates.created_at;
  delete updates.archived;

  // If a vines status changes to active, we must inactivate all other vines as there can be only one active at a time
  if (updates.status == VineStatus.Active) {
    await db.transaction('rw', [db.vines], async () => {
      const active_vines = await db.vines.where('status').equals(VineStatus.Active).primaryKeys().catch(e => {
        throw new VineError({ name: 'OTHER', message: 'A not further specified error occured while retrieving active vines.', cause: e });
      });

      await Promise.all(active_vines.map(id => db.vines.update(id, { status: VineStatus.InActive, updated_at: new Date() }).catch(e => {
        throw new VineError({ name: 'OTHER', message: 'A not further specified error occured while inactivating active vines.', cause: e });
      })));
    });
  }

  if (updates.position != undefined) {
    const vine = await get_vine(id);

    if (!vine) {
      throw new VineError({ name: 'NOT_PRESENT', message: 'Could not update position of vine with id ' + id });
    }

    await db.transaction('rw', [db.vines], async () => {
      // Get all siblings (including the current vine)
      const siblings = await db.vines
        .where('parent_id')
        .equals(vine.parent_id)
        .and(entry => entry.archived != 1)
        .sortBy('position');

      // Remove the current vine from the array
      const oldIndex = siblings.findIndex(v => v.id === id);
      if (oldIndex === -1) throw new VineError({ name: 'NOT_PRESENT', message: 'Vine not found among siblings.' });
      const [movingVine] = siblings.splice(oldIndex, 1);

      // Clamp new position
      const new_position = Math.max(0, Math.min(updates.position!, siblings.length));

      // Insert at new position
      siblings.splice(new_position, 0, movingVine);

      // Update positions in DB
      await Promise.all(
        siblings.map((v, idx) =>
          db.vines.update(v.id, { position: idx, updated_at: new Date() }).catch(() => {
            throw new VineError({ name: 'OTHER', message: 'A not further specified error occured while updating vine positions' })
          })
        )
      );
    })
  }

  if (updates.parent_id != undefined) {
    const length = await db.vines.where('parent_id').equals(updates.parent_id).sortBy("position").then(result => result.length);

    await db.vines.update(id, { parent_id: updates.parent_id, position: length });
  }

  await db.vines.update(id, { ...updates, updated_at: new Date() }).catch(e => {
    throw new VineError({ name: 'OTHER', message: 'A not further specified error occured while updating vine.', cause: e });
  }).then(result => {
    if (result == 0) {
      throw new VineError({ name: 'NOT_PRESENT', message: 'Cannot update a non-existant vine.' });
    }
  });
}

export async function archive_vine(id: string) {
  await db.transaction('rw', [db.vines], async () => {
    // Collect all ids to delete (the vine and its descendants)
    const children_to_delete = await get_all_children(id);

    const changes = [...children_to_delete, id].map(vine_id => ({ key: vine_id, changes: { archived: 1, position: -1 } }));

    await db.vines.bulkUpdate(changes).catch(e => {
      throw new VineError({ name: 'OTHER', message: 'A not further specified error occured while archiving vine.', cause: e });
    }).then(result => {
      if (result == 0) {
        throw new VineError({ name: 'NOT_PRESENT', message: 'Cannot update a non-existant vine.' });
      }
    });
  })
}