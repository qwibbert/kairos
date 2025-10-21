<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import '$components/style.css';
	import VinesIcon from '$components/ui/vines-icon.svelte';
	import '$features/tour/index';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import i18next from 'i18next';
	import ChartLine from 'lucide-svelte/icons/chart-line';
	import Home from 'lucide-svelte/icons/home';
	import Settings from 'lucide-svelte/icons/settings';
	import { setContext } from 'svelte';
	import { Modals } from 'svelte-modals';

	import { client } from '$lib/pocketbase';

	import type { AppState } from '$lib/context';
	import type { UsersRecord } from '$lib/pocketbase/types';
	import { db } from '../db/db';
	import { VineStatus, type VinesDocument } from '../db/vines/define';

	let { children } = $props();

	const app_state: AppState = $state({
		session: null,
		timer_interval: null,
		settings: null,
		vines: null,
		wake_lock: null,
		user: null,
		active_vine: null
	});

	client?.authStore.onChange((token, model) => {
		if (!client?.authStore.isValid) {
			app_state.user = null;	
		}

		app_state.user = model as unknown as UsersRecord;
	}, true);

	db.settings.findOne('1').$.subscribe((s) => (app_state.settings = s));
	db.vines.find().$.subscribe(async (e: VinesDocument[]) => {
		console.log('update!')
		if (e) {
			const active_vines = e.filter((v) => v.status == VineStatus.Active );

			if (active_vines.length > 1) {
				// Multiple vines have an active state. Is there a session with a defined vine?
				// If yes, make this session the active one and deactivate all other vines
				// If no, deactivate all other vines
				for (const active_vine of active_vines) {
					if (app_state.session && app_state.session.vine_id == active_vine.id && app_state.active_vine?.id != active_vine.id) {
						app_state.active_vine = active_vine;
						break;
					}
				}

				// Since this function gets called everytime the vines change, the following code can be considered recursive
				// Hence, we only need to inactivate one vine at a time
				if (app_state.active_vine) {
					const vines_to_inactivate = active_vines.filter((v) => v.id != app_state.active_vine?.id);
					
					if (vines_to_inactivate.length != 0) {
						await db.vines.update_vine(vines_to_inactivate[0].id, { status: VineStatus.InActive });
					}
				} else {
					await db.vines.update_vine(active_vines[0].id, { status: VineStatus.InActive });
				}
			} else if (active_vines.length == 1 && app_state.active_vine?.id != active_vines[0].id) {
				app_state.active_vine = active_vines[0];
			}

			app_state.vines = e;
		}
	});

	setContext('app_state', app_state);

	let dock_active: 'HOME' | 'VINES' | 'STATISTICS' | 'SETTINGS' = $state(
		page.url.pathname == '/' ? 'HOME' : page.url.pathname.replace('/', ''),
	);

	$effect(() => {
		if (app_state.settings?.theme_active && app_state.settings?.theme_inactive) {
			if (app_state.timer_interval) {
				document.documentElement.setAttribute('data-theme', app_state.settings?.theme_active);
			} else {
				document.documentElement.setAttribute('data-theme', app_state.settings?.theme_inactive);
			}
		}
	});
</script>

<Modals />
<SvelteToast />

<div class="h-[80dvh] m-[5dvh]">
	{@render children()}
</div>

<footer class="h-[10dvh] hidden md:flex flex-row w-full items-center justify-center gap-4">
	<a href="privacy.pdf" class="link link-hover text-sm">privacy</a>
	<a href="mailto:libert1quinten@gmail.com" target="_blank" class="link link-hover text-sm"
		>meld problemen</a
	>
	<a href="https://github.com/qwibbert/kairos" class="link link-hover text-sm">github</a>
</footer>
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
		<Settings class="size-[1.2em]" />
		<span class="dock-label">{i18next.t('settings:settings')}</span>
	</button>
</footer>
