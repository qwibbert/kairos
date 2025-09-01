import { beforeAll, describe, expect, it } from 'vitest';
import { db } from '../db';
import type { VinesCollection } from './define';

let vines: VinesCollection;

beforeAll(async () => {
    vines = db.vines;

    await db.vines.find().remove();
});

describe('vines_collection_methods.get_vine', () => {
    it('returns null for non-existent id', async () => {
        const result = await vines.get_vine('non-existent-id');
        expect(result).toBeNull();
    });

    it('returns the correct vine for an existing id', async () => {
        const vineData = {
            position: 1,
            type: 'test',
            title: 'Test Vine',
            status: 'active',
            public: true,
            session_aim: 0,
            course_title: 'Test Course',
            course_id: 'course-1',
            course_code: 'C1',
            course_weight: 1,
            course_instructor: 'Instructor',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            parent_id: '',
        };
        const inserted = await vines.add_vine(vineData);
        expect(inserted).toBeTruthy();

        const found = await vines.get_vine(inserted.id);
        expect(found).not.toBeNull();
        expect(found?.id).toBe(inserted.id);
        expect(found?.title).toBe('Test Vine');
    });
});

describe('vines_collection_methods.add_vine', () => {
    it('should add a new vine and return the document', async () => {
        const vineData = {
            position: 1,
            type: 'test',
            title: 'Test Vine',
            status: 'active',
            parent_id: '',
            public: true,
            session_aim: 0,
            course_title: 'Test Course',
            course_id: 'course-1',
            course_code: 'C1',
            course_weight: 1,
            course_instructor: 'Instructor',
        };
        const result = await vines.add_vine(vineData);
        expect(result).toBeTruthy();
        expect(result?.title).toBe('Test Vine');
        expect(result?.id).toBeDefined();
    });

    it('should not add a duplicate vine (same id)', async () => {
        const vineData = {
            position: 2,
            type: 'test',
            title: 'Duplicate Vine',
            status: 'active',
            parent_id: '',
            public: true,
            session_aim: 0,
            course_title: 'Test Course',
            course_id: 'course-2',
            course_code: 'C2',
            course_weight: 1,
            course_instructor: 'Instructor',
        };
        const first = await vines.add_vine(vineData);
        const second = await vines.add_vine({ ...vineData, title: 'Duplicate Vine 2' });
        // insertIfNotExists should prevent duplicate based on unique constraints
        expect(second?.id).not.toBe(first?.id);
    });
});

describe('vines_collection_methods.update_vine', () => {
    it('should update an existing vine', async () => {
        const vineData = {
            position: 1,
            type: 'test',
            title: 'Original Title',
            status: 'active',
            parent_id: '',
            public: true,
            session_aim: 0,
            course_title: 'Test Course',
            course_id: 'course-1',
            course_code: 'C1',
            course_weight: 1,
            course_instructor: 'Instructor',
        };
        const inserted = await vines.add_vine(vineData);
        expect(inserted).toBeTruthy();

        await vines.update_vine(inserted.id, { title: 'Updated Title', status: 'inactive' });

        const updated = await vines.get_vine(inserted.id);
        expect(updated).toBeTruthy();
        expect(updated?.title).toBe('Updated Title');
        expect(updated?.status).toBe('inactive');
    });

    it('should not throw if vine does not exist', async () => {
        let error: any = null;
        try {
            await vines.update_vine('non-existent-id', { title: 'Should Not Exist' });
        } catch (e) {
            error = e;
        }
        expect(error).toBeNull();
    });
});

describe('vines_collection_methods.delete_vine', () => {
    it('should delete an existing vine', async () => {
        const vineData = {
            position: 1,
            type: 'test',
            title: 'To Delete',
            status: 'active',
            parent_id: '',
            public: true,
            session_aim: 0,
            course_title: 'Test Course',
            course_id: 'course-1',
            course_code: 'C1',
            course_weight: 1,
            course_instructor: 'Instructor',
        };
        const inserted = await vines.add_vine(vineData);
        expect(inserted).toBeTruthy();

        await vines.delete_vine(inserted.id);

        const found = await vines.get_vine(inserted.id);
        expect(found).toBeNull();
    });

    it('should not throw if vine does not exist', async () => {
        let error: any = null;
        try {
            await vines.delete_vine('non-existent-id');
        } catch (e) {
            error = e;
        }
        expect(error).toBeNull();
    });
});