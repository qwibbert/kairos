import { SessionStatus, type SessionDocument } from "../db/sessions/define.svelte";
import type { AppState } from "./context";
import { play_timer_finish_sound } from "./sounds";

export async function tick(app_state: AppState): Promise<SessionDocument | null> {
    if (app_state.session) {
        const now = Date.now();
        const remaining_ms = Math.max(0, (app_state.session?.time_end ?? 0) - now);
        const remaining_seconds_total = Math.ceil(remaining_ms / 1000);
        const remaining_minutes = Math.floor(remaining_seconds_total / 60);
        const remaining_seconds = remaining_seconds_total % 60;

        const today = new Date().toDateString();
        app_state.session.time_elapsed[today] = app_state.session.time_target - remaining_seconds_total;

        const formatted_seconds = remaining_seconds < 10 ? `0${remaining_seconds}` : remaining_seconds;
        document.title = `${remaining_minutes}:${formatted_seconds} | Kairos`;

        // Check completion
        if (remaining_ms <= 0) {
            return await handle_session_complete(app_state);
        } else return await app_state.session.incrementalUpdate({
            $set: {
                time_elapsed: JSON.parse(JSON.stringify(app_state.session.time_elapsed)),
                updated_at: new Date().toISOString().replace('T', ' '),
            },
        });
    } else {
        return null;
    }
}

async function handle_session_complete(app_state: AppState): Promise<SessionDocument | null> {
    if (!app_state.settings?.auto_start) {
        clearInterval(app_state.timer_interval);
    }

    if (app_state.wake_lock) {
        await app_state.wake_lock.release();
    }

    document.title = 'Kairos';

    await play_timer_finish_sound();

    await app_state.session!.incrementalUpdate({
        $set: {
            status: SessionStatus.Ready,
            time_elapsed: JSON.parse(JSON.stringify(app_state.session!.time_elapsed)),
            date_finished: Date.now(),
            updated_at: new Date().toISOString().replace('T', ' '),
        },
    });

    if (app_state.settings?.auto_start) {
        const new_session = await app_state.session!.next(undefined, app_state.active_vine ?? undefined);

        return await new_session?.start(true) ?? app_state.session;
    } else return await app_state.session!.next(undefined, app_state.active_vine ?? undefined);
}