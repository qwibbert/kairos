<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import i18next from 'i18next';
	import ChartLine from 'lucide-svelte/icons/chart-line';
	import Home from 'lucide-svelte/icons/home';
	import { default as SettingsIcon } from 'lucide-svelte/icons/settings';
	import { mode } from 'mode-watcher';
	import { setContext } from 'svelte';
	import { Modals, modals } from 'svelte-modals';

	import Alert from '$lib/components/alert.svelte';
	import ChangelogModal from '$lib/components/changelog-modal.svelte';
	import VinesIcon from '$lib/components/ui/vines-icon.svelte';
	import type { AppState } from '$lib/context';
	import { client } from '$lib/pocketbase';
	import type { UsersRecord } from '$lib/pocketbase/types';
	import '$lib/style.css';

	import { db } from '../db/db';
	import { type VinesDocument } from '../db/vines/define';
	import { Settings } from '../settings/settings.svelte';
	import '../tour/index';

	let { children } = $props();

	const app_state: AppState = $state({
		session: null,
		timer_interval: null,
		settings: null,
		vines: null,
		wake_lock: null,
		user: null,
		active_vine: null,
		selected_vine: null,
		special_period: Settings.is_festive_period(),
	});

	setContext('app_state', app_state);

	client?.authStore.onChange((token, model) => {
		if (!client?.authStore.isValid) {
			app_state.user = null;
		}

		app_state.user = model as unknown as UsersRecord;
	}, true);

	db.settings.findOne('1').$.subscribe((s) => {
		app_state.settings = s;
	});

	db.vines.find().$.subscribe(async (e: VinesDocument[]) => {
		if (e) {
			app_state.vines = e;
		}
	});

	let dock_active: 'HOME' | 'VINES' | 'STATISTICS' | 'SETTINGS' = $state(
		page.url.pathname == '/' ? 'HOME' : page.url.pathname.replace('/', ''),
	);

	$effect(() => {
		if (app_state.settings?.special_periods && app_state.special_period) {
			if (app_state.special_period == 'CHRISTMAS') {
				document.documentElement.setAttribute('data-theme', 'christmas');
			} else if (app_state.special_period == 'HALLOWEEN') {
				document.documentElement.setAttribute('data-theme', 'halloween');
			}
		} else {
			if (app_state.settings?.theme) {
				document.documentElement.setAttribute('data-theme', app_state.settings?.theme);
			}
		}
	});

	$effect(() => {
		if (app_state.settings?.special_periods && app_state.special_period) {
			if (app_state.special_period == 'CHRISTMAS') {
				document.documentElement.setAttribute('data-theme', 'christmas');
			} else if (app_state.special_period == 'HALLOWEEN') {
				document.documentElement.setAttribute('data-theme', 'halloween');
			}
		} else {
			if (mode.current == 'dark' && app_state.settings?.adapt_system) {
				document.documentElement.setAttribute('data-theme', app_state.settings?.last_dark_theme!);
			} else {
				document.documentElement.setAttribute('data-theme', app_state.settings?.theme!);
			}
		}
	});
</script>

<Modals>
	{#snippet backdrop({ close })}
		<div class="backdrop" onclick={() => close()} />
	{/snippet}
</Modals>
<SvelteToast />

<div class="h-[80dvh] md:h-[90dvh] my-[5dvh] overflow-auto">
	{@render children()}
</div>

<footer class="dock md:hidden h-[10dvh]">
	<button
		id="home-button"
		class:dock-active={dock_active == 'HOME'}
		onclick={() => {
			dock_active = 'HOME';
			goto('/');
		}}
	>
		<Home class="size-[1.2em]" />
		<span class="dock-label">{i18next.t('common:home')}</span>
	</button>
	<button
		id="tour-4-mobile"
		class:dock-active={dock_active == 'VINES'}
		onclick={() => {
			dock_active = 'VINES';
			goto('/vines');
		}}
	>
		<VinesIcon styles={['size-[1.2em]']} />
		<span class="dock-label">{i18next.t('vines:vines')}</span>
	</button>

	<button
		id="tour-3-mobile"
		class:dock-active={dock_active == 'STATISTICS'}
		onclick={() => {
			dock_active = 'STATISTICS';
			goto('/statistics');
		}}
	>
		<ChartLine class="size-[1.2em]" />
		<span class="dock-label">{i18next.t('statistics:statistics')}</span>
	</button>

	<button
		id="tour-2-mobile"
		class:dock-active={dock_active == 'SETTINGS'}
		onclick={() => {
			dock_active = 'SETTINGS';
			goto('settings');
		}}
	>
		<SettingsIcon class="size-[1.2em]" />
		<span class="dock-label">{i18next.t('settings:settings')}</span>
	</button>
</footer>
