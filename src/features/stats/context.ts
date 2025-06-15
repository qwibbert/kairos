import { getContext, setContext } from 'svelte';
import type { StatsContext } from './types';

const STATS_CONTEXT_KEY = {};

export function setStatsContext(context: StatsContext) {
    setContext(STATS_CONTEXT_KEY, context);
}

export function getStatsContext() {
    return getContext(STATS_CONTEXT_KEY) as StatsContext;
}
