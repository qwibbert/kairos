import { ErrorBase } from "$lib/errors";
import { Session } from "$lib/session/session.svelte";
import { SessionStatus } from "$lib/session/types";
import { HistoryEntry } from "./appdb";
import { db } from "./db";

type ErrorName =
    | 'SESSION_INVALID_TIME'
    | 'ENTRY_INVALID_TIME'
    | 'DUPLICATE_ENTRY'
    | 'NOT_PRESENT'
    | 'OTHER';

export class HistoryError extends ErrorBase<ErrorName> { }

export async function get_history_entry(id: string): Promise<HistoryEntry | undefined> {
    return await db.history.get(id).catch(e => {
        throw new HistoryError({ name: 'OTHER', message: 'A not further specified error occured while retrieving an entry.', cause: e })
    }
    );
}

export async function add_history_entry(session: Session): Promise<string> {
    // Check session time
    if (session.time_aim <= 0) {
        throw new HistoryError({
            name: "SESSION_INVALID_TIME",
            message: session.time_aim == 0 ? 'Target time equals 0' : `Target time less than 0 (${session.time_aim})`
        })
    } else if (session.time_real > session.time_aim) {
        throw new HistoryError({
            name: "SESSION_INVALID_TIME",
            message: "Elapsed session time exceeded the time target"
        })
    }


    // TODO: check if pauses make sense

    return await db.history.add({
        id: session.uuid,
        date_finished: [SessionStatus.Skipped, SessionStatus.Ready].includes(session.status) ? new Date() : undefined,
        pauses: session.pauses,
        time_aim: session.time_aim,
        time_real: session.time_real,
        task_id: session.task_id,
        status: session.status,
        created_at: new Date(),
        updated_at: new Date(),
        pomo_type: session.pomo_type,
        cycle: session.cycle,
        paused_at: session.paused_at
    }).catch(err => {
        if (err.name == 'ConstraintError') {
            throw new HistoryError({
                name: 'DUPLICATE_ENTRY',
                message: 'Tried to add a session already present in the database.',
                cause: err
            })
        } else {
            throw new HistoryError({
                name: 'OTHER',
                message: 'A not further specified error occured while adding an entry.',
                cause: err
            })
        }
    });
};

export async function update_history_entry(id: string, updates: Partial<HistoryEntry>) {
    delete updates.id;
    delete updates.created_at;

    const entry = await db.history.get(id);

    if (!entry) {
        throw new HistoryError({
            name: "NOT_PRESENT",
            message: 'Tried to update an entry that doesn\'t exist in the database.'
        })
    }

    // Check target time
    if (updates.time_aim) {
        if (updates.time_aim <= 0) {
            throw new HistoryError({
                name: "ENTRY_INVALID_TIME",
                message: updates.time_aim == 0 ? 'Target time equals 0' : `Target time less than 0 (${updates.time_aim})`
            })
        } else if (entry.time_real > updates.time_aim) {
            throw new HistoryError({
                name: "ENTRY_INVALID_TIME",
                message: "Elapsed session time exceeded the updated time target."
            })
        }
    }

    // Check elapsed time
    if (updates.time_real) {
        if (updates.time_real < 0) {
            throw new HistoryError({
                name: "ENTRY_INVALID_TIME",
                message: 'Elapsed time smaller than 0'
            })
        } else if (updates.time_real > entry.time_aim) {
            throw new HistoryError({
                name: "ENTRY_INVALID_TIME",
                message: "Updated elapsed session time exceeded the time target."
            })
        }
    }

    // Check if updated entry with `READY` status has maximum elapsed time
    if (updates.status == SessionStatus.Ready) {
        if ((updates.time_real ?? entry.time_real) != (updates.time_aim ?? entry.time_aim)) {
            throw new HistoryError({
                name: 'ENTRY_INVALID_TIME',
                message: `Entry with 'READY' state should have a maximum elapsed time 
                (elapsed: ${(updates.time_real ?? entry.time_real)} != ${(updates.time_aim ?? entry.time_aim)})`
            })
        }
    }

    return await db.history.update(id, {
        ...updates,
        updated_at: new Date(),
        date_finished: [SessionStatus.Skipped, SessionStatus.Ready].includes(updates?.status ?? SessionStatus.Active) ? new Date() : undefined
    }).catch(e => {
        throw new HistoryError({ name: 'OTHER', message: 'A not further specified error occured while updating an entry.', cause: e });
    });
}

export async function delete_history_entry(id: string) {
    return await db.history.delete(id).catch(e => {
        throw new HistoryError({ name: 'OTHER', message: 'A not further specified error occured while deleting an entry.', cause: e });
    });
}


export async function restore_session_from_history(): Promise<Session | undefined> {
    const restoreable_states = [SessionStatus.Active, SessionStatus.Inactive, SessionStatus.Paused, SessionStatus.Interrupted];

    const entries = await db.history.where('status').anyOf(restoreable_states).toArray().catch(e => {
        throw new HistoryError({ name: 'OTHER', message: 'A not further specified error occured while retrieving restoreable entries.', cause: e });
    });

    if (entries.length > 1) {
        const latest_session = entries.toSorted((a, b) => b.updated_at.getTime() - a.updated_at.getTime())[0];

        await Promise.all(entries.map(entry => {
            if (entry.id != latest_session.id) {
                update_history_entry(entry.id, { status: SessionStatus.Skipped });
            }
        }));

        const session = new Session(latest_session.pomo_type, latest_session.time_aim - latest_session.time_real);
        session.uuid = latest_session.id;
        session.created_at = latest_session.created_at;
        session.status = latest_session.status;
        session.time_aim = latest_session.time_aim;
        session.time_real = latest_session.time_real;
        session.pauses = latest_session.pauses;
        session.cycle = latest_session.cycle;
        session.paused_at = latest_session.paused_at;

        return session;
    } else if (entries.length == 1) {
        const entry = entries[0];

        const session = new Session(entry.pomo_type, entry.time_aim - entry.time_real);
        session.uuid = entry.id;
        session.created_at = entry.created_at;
        session.status = entry.status;
        session.time_aim = entry.time_aim;
        session.time_real = entry.time_real;
        session.pauses = entry.pauses;
        session.cycle = entry.cycle;
        session.paused_at = entry.paused_at;

        return session;
    } else {
        return undefined;
    }
}