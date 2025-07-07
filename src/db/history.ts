import { Session } from "$lib/session/session.svelte";
import { SessionStatus } from "$lib/session/types";
import type { HistoryEntry } from "./appdb";
import { db } from "./db";

export async function get_history_entry(id: string): Promise<HistoryEntry | undefined> {
  return await db.history.get(id);
}

export async function add_history_entry(session: Session): Promise<string> {
  return await db.history.add({
    id: session.uuid,
    date_started: session.date,
    date_finished: new Date(),
    pauses: session.pauses,
    time_aim: session.time_aim,
    time_real: session.time_real,
    task_id: session.task_id,
    status: session.status,
    created_at: new Date(),
    updated_at: new Date(),
    pomo_type: session.pomo_type,
    cycle: session.cycle
  });
};

export async function update_history_entry(id: string, updates: Partial<HistoryEntry>) {
    delete updates.id;
    delete updates.created_at;

    return await db.history.update(id, {...updates, updated_at: new Date()});
}

export async function delete_history_entry(id: string) {
    return await db.history.delete(id);
}

export async function restore_session_from_history(): Promise<Session | undefined> {
    const restoreable_states = [SessionStatus.Active, SessionStatus.Inactive, SessionStatus.Paused, SessionStatus.Interrupted];

    const entries = await db.history.where('status').anyOf(restoreable_states).toArray();

    if (entries.length > 1) {
        const latest_session = entries.toSorted((a,b) => b.updated_at.getTime() - a.updated_at.getTime())[0];

        await Promise.all(entries.map(entry => {
            if (entry.id != latest_session.id) {
                update_history_entry(entry.id, { status: SessionStatus.Skipped });
            }
        }))
    } else if (entries.length == 1) {
        const entry = entries[0];

        const session = new Session(entry.pomo_type, entry.time_aim - entry.time_real);
        session.uuid = entry.id;
        session.date = entry.created_at;
        session.status = entry.status;
        session.time_aim = entry.time_aim;
        session.time_real = entry.time_real;
        session.pauses = entry.pauses;
        session.cycle = entry.cycle;

        return session;
    } else {
        return undefined;
    }
}