import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { db } from '../db';
import type { SettingsDocument } from './define';

let settings_doc: SettingsDocument | null;

beforeAll(async () => {
    settings_doc = await db.settings.get_settings();
});

afterAll(async () => {
    await db.settings.find().remove();
})

describe('settings_doc_methods.modify_setting', () => {
    it('should update a setting value', async () => {
        expect(settings_doc).toBeTruthy();
        if (!settings_doc) return;

        await settings_doc.modify_setting('pomo_time', 1234);

        const updated = await settings_doc.collection.get_settings();
        expect(updated?.pomo_time).toBe(1234);
    });

    it('should update updated_at field', async () => {
        expect(settings_doc).toBeTruthy();
        if (!settings_doc) return;

        const before = updatedAtToNumber(settings_doc.updated_at);
        await settings_doc.modify_setting('short_break_time', 222);
        const afterDoc = await settings_doc.collection.get_settings();
        const after = updatedAtToNumber(afterDoc?.updated_at ?? '');

        expect(after).toBeGreaterThanOrEqual(before);
    });
});

// Helper to compare updated_at as numbers
function updatedAtToNumber(str: string) {
    return Number(new Date(str.replace(' ', 'T')));
}