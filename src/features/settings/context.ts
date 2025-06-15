import { getContext, setContext } from 'svelte';
import type { SettingsContext } from './types';

const SETTINGS_CONTEXT_KEY = {};

export function setSettingsContext(context: SettingsContext) {
    setContext(SETTINGS_CONTEXT_KEY, context);
}

export function getSettingsContext() {
    return getContext(SETTINGS_CONTEXT_KEY) as SettingsContext;
}
