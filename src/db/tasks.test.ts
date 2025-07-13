import { TaskStatus } from "$features/tasks/types";
import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AppDB, { Task } from "./appdb";
import { add_task, archive_task, get_all_children, get_all_parents, get_task, update_task } from "./tasks";

describe('tasks db functions', () => {
    const db = new AppDB();
    const test_entry = {
        id: 'TEST',
        title: 'Test Task',
        session_aim: 0,
        status: TaskStatus.InActive,
        parent_id: undefined,
        created_at: new Date(),
        updated_at: new Date(),
        archived: 0
    } as Task;

    beforeEach(async () => {
        vi.clearAllMocks();
        await db.delete();
        await db.open();

        const parent1 = { ...test_entry, id: 'PARENT_1' };
        const child1 = { ...test_entry, id: 'CHILD_1', parent_id: 'PARENT_1' };
        const child2 = { ...test_entry, id: 'CHILD_2', parent_id: 'PARENT_1' };
        const child3 = { ...test_entry, id: 'CHILD_3', parent_id: 'PARENT_1' };
        const child1_of_child3 = { ...test_entry, id: 'CHILD_1_OF_CHILD_3', parent_id: 'CHILD_3' };
        const child2_of_child3 = { ...test_entry, id: 'CHILD_2_OF_CHILD_3', parent_id: 'CHILD_3' };

        await db.tasks.add(parent1);
        await db.tasks.add(child1);
        await db.tasks.add(child2);
        await db.tasks.add(child3);
        await db.tasks.add(child1_of_child3);
        await db.tasks.add(child2_of_child3);
    });

    describe('get_all_parents function', () => {
        it('returns the correct amount of parents', async () => {
            const parents1 = await get_all_parents('CHILD_1_OF_CHILD_3');
            const parents2 = await get_all_parents('CHILD_3');
            const parents3 = await get_all_parents('PARENT_1');

            expect(parents1).toEqual(['CHILD_3', 'PARENT_1']);
            expect(parents2).toEqual(['PARENT_1']);
            expect(parents3).toEqual([]);
        });
    })

    describe('get_all_children function', () => {
        it('returns the correct amount of children', async () => {
            const children1 = await get_all_children('PARENT_1');
            const children2 = await get_all_children('CHILD_3');
            const children3 = await get_all_children('CHILD_1_OF_CHILD_3');

            expect(children1).toEqual([
                'CHILD_1',
                'CHILD_2',
                'CHILD_3',
                'CHILD_1_OF_CHILD_3',
                'CHILD_2_OF_CHILD_3'
            ]);
            expect(children2).toEqual([
                'CHILD_1_OF_CHILD_3',
                'CHILD_2_OF_CHILD_3'
            ]);
            expect(children3).toEqual([]);
        });
    })

    describe('get_task function', () => {
        it('retrieves task with certain id', async () => {
            const result = await get_task('PARENT_1');

            expect(result).toEqual({...test_entry, id: 'PARENT_1'});
        });

        it('returns undefined when certain id not found', async () => {
            const result = await get_task('TEST');

            expect(result).toBeUndefined();
        });
    })

    describe('add_task function', () => {
        it('adds task to database', async () => {
            const id = await add_task('TASK', 0, 'PARENT_1');

            const result = await db.tasks.get(id);

            expect(result?.id).toEqual(id);
            expect(result?.title).toEqual('TASK');
            expect(result?.session_aim).toEqual(0);
            expect(result?.parent_id).toEqual('PARENT_1');
            expect(result?.status).toEqual(TaskStatus.InActive);
            expect(result?.created_at.getTime()).toBeCloseTo(Date.now(), -2);
            expect(result?.updated_at).toBeUndefined();
        });

        it('throws if empty title.', async () => {
            await expect(add_task('', 0, 'PARENT_1')).rejects.toThrow(expect.objectContaining({ name: 'EMPTY_TITLE' }));
        });
    });

    describe('update task function', () => {
        it('updates a task', async () => {
            await update_task('PARENT_1', { title: 'PARENT', session_aim: 1, parent_id: 'CHILD_1', status: TaskStatus.Active, archived: 1 });

            const task = await db.tasks.get('PARENT_1');

            expect(task?.id).toEqual('PARENT_1');
            expect(task?.title).toEqual('PARENT');
            expect(task?.session_aim).toEqual(1);
            expect(task?.parent_id).toEqual('CHILD_1');
            expect(task?.status).toEqual(TaskStatus.Active);
            expect(task?.archived).toEqual(0);
            expect(task?.updated_at?.getTime()).toBeCloseTo(Date.now(), -2);
        });

        it('throws if task doesn\'t exist', async () => {
            await expect(
                update_task('TESTTASK', { title: 'PARENT', session_aim: 1, parent_id: 'CHILD_1', status: TaskStatus.Active, archived: 1 })
            ).rejects.toThrow(expect.objectContaining({ name: 'NOT_PRESENT' }));
        });
    });

    describe('archive_task function', () => {
        it('archives a task and it\'s children', async () => {
            await archive_task('CHILD_3');

            const child_3 = await db.tasks.get('CHILD_3');
            const child1_of_child3 = await db.tasks.get('CHILD_1_OF_CHILD_3');
            const child2_of_child3 = await db.tasks.get('CHILD_2_OF_CHILD_3');

            expect(child_3?.archived).toEqual(1);
            expect(child1_of_child3?.archived).toEqual(1);
            expect(child2_of_child3?.archived).toEqual(1);
        });

        it('throws if task doesn\'t exist', async () => {
            await expect(archive_task('TASK')).rejects.toThrow(expect.objectContaining({ name: 'NOT_PRESENT' }));
        })
    })
})