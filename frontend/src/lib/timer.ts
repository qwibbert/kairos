import { on_session_syncable } from "../db/sessions/client";
import { SessionStatus, type SessionDocument } from "../db/sessions/define.svelte";
import { play_timer_finish_sound } from "./sounds";

export async function tick(session: SessionDocument, interval: ReturnType<typeof setTimeout>): Promise<SessionDocument | null> {
    const now = Date.now();
    const remaining_ms = Math.max(0, (session.time_end ?? 0) - now);
    const remaining_seconds_total = Math.ceil(remaining_ms / 1000);
    const remaining_minutes = Math.floor(remaining_seconds_total / 60);
    const remaining_seconds = remaining_seconds_total % 60;

    const today = new Date().toDateString();
    session.time_elapsed[today] = session.time_target - remaining_seconds_total;

    const formatted_seconds = remaining_seconds < 10 ? `0${remaining_seconds}` : remaining_seconds;
    document.title = `${remaining_minutes}:${formatted_seconds} | Kairos`;

    // Check completion
    if (remaining_ms <= 0) {
        return await handle_session_complete(session, interval);
    } else return await session.incrementalUpdate({
        $set: {
            time_elapsed: JSON.parse(JSON.stringify(session.time_elapsed)),
            updated_at: new Date().toISOString().replace('T', ' '),
        },
    });
}

async function handle_session_complete(session: SessionDocument, interval: ReturnType<typeof setTimeout>): Promise<SessionDocument | null> {
    clearInterval(interval);

    document.title = 'Kairos';
    
    await play_timer_finish_sound();

    on_session_syncable(session.id);

    await session.incrementalUpdate({
        $set: {
            status: SessionStatus.Ready,
            time_elapsed: JSON.parse(JSON.stringify(session.time_elapsed)),
            date_finished: Date.now(),
            updated_at: new Date().toISOString().replace('T', ' '),
        },
    });

    return await session.next();
}