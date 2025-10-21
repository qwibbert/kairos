import { getContext } from 'svelte';
import type { SessionDocument } from '../db/sessions/define.svelte';
import type { SettingsDocument } from '../db/settings/define';
import type { VinesDocument } from '../db/vines/define';
import type { UsersRecord } from './pocketbase/types';

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
    vines: VinesDocument[] | null;
    session: SessionDocument | null;
    settings: SettingsDocument | null;
    timer_interval: ReturnType<typeof setTimeout> | null;
    wake_lock: WakeLockSentinel | null;
    user: UsersRecord | null;
    active_vine: VinesDocument | null;
}


export function get_app_state() {
    return getContext(APP_STATE) as AppState;
}