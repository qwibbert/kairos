import type { Database } from "./types";

export async function retrieve_db(): Promise<Database> {
    console.debug("Retrieving database from local storage.");
    const db = localStorage.getItem('db');
    if (db) {
        return JSON.parse(db) as Database;
    } else {
        console.warn("No database found in local storage, returning empty database.");
        return { tasks: [] };
    }
}

export async function save_db(key: string, value: object): Promise<void> {
    console.debug("Saving database to local storage.");
    localStorage.setItem(key, JSON.stringify(value));
}

export async function clear_db(): Promise<void> {
    console.debug("Clearing database in local storage.");
    localStorage.clear();
}