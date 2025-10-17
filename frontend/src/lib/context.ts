import { getContext } from 'svelte';
import type { SessionDocument } from '../db/sessions/define.svelte';
import type { SettingsDocument } from '../db/settings/define';
import type { VinesDocument } from '../db/vines/define';

export const APP_STATE = 'app_state';

export interface AlertDialog {
    id: string;
    type: 'INFO' | 'WARNING' | 'ERROR';
    header: string;
    text: string;
    dismissable: boolean;
    actions: Map<string, () => Promise<void>>;
}

export interface AppState {
    vines: VinesDocument[] | null,
    session: SessionDocument | null,
    settings: SettingsDocument | null,
    timer_interval: ReturnType<typeof setTimeout> | null,
    wake_lock: WakeLockSentinel | null,
    alerts: AlertDialog[]
}


export function get_app_state() {
    return getContext(APP_STATE) as AppState;
}