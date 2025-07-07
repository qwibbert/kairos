import AppDB from "./appdb";

export const exportDB = async (): Promise<Blob> => {
  if (typeof window !== 'undefined') {
    await import('dexie-export-import');
  }

  const blob = await db.export();
  return blob;
};

export const importDB = async (blob: Blob): Promise<void> => {
  if (typeof window !== 'undefined') {
    await import('dexie-export-import');
  }

  await db.import(blob);
};

export const db = new AppDB();