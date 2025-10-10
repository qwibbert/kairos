import { getContext } from 'svelte';
import type { SessionDocument } from '../db/sessions/define.svelte';
import type { SettingsDocument } from '../db/settings/define';
import type { VinesDocument } from '../db/vines/define';

const APP_STATE = 'app_state';

export interface AppState {
    vines: VinesDocument[] | null,
    session: SessionDocument | null,
    settings: SettingsDocument | null,
    timer_interval: ReturnType<typeof setTimeout> | null
}


export function get_app_state() {
    return getContext(APP_STATE) as AppState;
}