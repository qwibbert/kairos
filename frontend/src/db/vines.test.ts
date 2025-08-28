import { VineStatus, VineType } from '$features/vines/types';
import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AppDB, { Vine } from './appdb';
import {
	add_vine,
	archive_vine,
	get_all_children,
	get_all_parents,
	get_vine,
	update_vine,
} from './vines';

describe('vines db functions', () => {
	const db = new AppDB();
	const test_entry = {
		id: 'TEST',
		title: 'Test vine',
		session_aim: 0,
		status: VineStatus.InActive,
		parent_id: undefined,
		created_at: new Date(),
		updated_at: new Date(),
		archived: 0,
		type: VineType.Task,
		public: 0,
	} as Vine;

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

		await db.vines.add(parent1);
		await db.vines.add(child1);
		await db.vines.add(child2);
		await db.vines.add(child3);
		await db.vines.add(child1_of_child3);
		await db.vines.add(child2_of_child3);
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
	});

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
				'CHILD_2_OF_CHILD_3',
			]);
			expect(children2).toEqual(['CHILD_1_OF_CHILD_3', 'CHILD_2_OF_CHILD_3']);
			expect(children3).toEqual([]);
		});
	});

	describe('get_vine function', () => {
		it('retrieves vine with certain id', async () => {
			const result = await get_vine('PARENT_1');

			expect(result).toEqual({ ...test_entry, id: 'PARENT_1' });
		});

		it('returns undefined when certain id not found', async () => {
			const result = await get_vine('TEST');

			expect(result).toBeUndefined();
		});
	});

	describe('add_vine function', () => {
		it('adds vine to database', async () => {
			const id = await add_vine('vine', VineType.Task, undefined, 'PARENT_1');

			const result = await db.vines.get(id);

			expect(result?.id).toEqual(id);
			expect(result?.title).toEqual('vine');
			expect(result?.session_aim).toBeUndefined();
			expect(result?.parent_id).toEqual('PARENT_1');
			expect(result?.status).toEqual(VineStatus.InActive);
			expect(result?.created_at.getTime()).toBeCloseTo(Date.now(), -2);
			expect(result?.updated_at).toBeUndefined();
			expect(result?.type).toEqual(VineType.Task);
			expect(result?.public).toEqual(0);
		});

		it('throws if empty title.', async () => {
			await expect(add_vine('', VineType.Task, undefined, 'PARENT_1')).rejects.toThrow(
				expect.objectContaining({ name: 'EMPTY_TITLE' }),
			);
		});
	});

	describe('update vine function', () => {
		it('updates a vine', async () => {
			await update_vine('PARENT_1', {
				title: 'PARENT',
				session_aim: 1,
				parent_id: 'CHILD_1',
				status: VineStatus.Active,
				archived: 1,
				public: 1,
				type: VineType.Course,
			});

			const vine = await db.vines.get('PARENT_1');

			expect(vine?.id).toEqual('PARENT_1');
			expect(vine?.title).toEqual('PARENT');
			expect(vine?.session_aim).toEqual(1);
			expect(vine?.parent_id).toEqual('CHILD_1');
			expect(vine?.status).toEqual(VineStatus.Active);
			expect(vine?.archived).toEqual(0);
			expect(vine?.updated_at?.getTime()).toBeCloseTo(Date.now(), -2);
			expect(vine?.public).toEqual(1);
			expect(vine?.type).toEqual(VineType.Course);
		});

		it("throws if vine doesn't exist", async () => {
			await expect(
				update_vine('TESTvine', {
					title: 'PARENT',
					session_aim: 1,
					parent_id: 'CHILD_1',
					status: VineStatus.Active,
					archived: 1,
				}),
			).rejects.toThrow(expect.objectContaining({ name: 'NOT_PRESENT' }));
		});
	});

	describe('archive_vine function', () => {
		it("archives a vine and it's children", async () => {
			await archive_vine('CHILD_3');

			const child_3 = await db.vines.get('CHILD_3');
			const child1_of_child3 = await db.vines.get('CHILD_1_OF_CHILD_3');
			const child2_of_child3 = await db.vines.get('CHILD_2_OF_CHILD_3');

			expect(child_3?.archived).toEqual(1);
			expect(child1_of_child3?.archived).toEqual(1);
			expect(child2_of_child3?.archived).toEqual(1);
		});

		it("throws if vine doesn't exist", async () => {
			await expect(archive_vine('vine')).rejects.toThrow(
				expect.objectContaining({ name: 'NOT_PRESENT' }),
			);
		});
	});
});
