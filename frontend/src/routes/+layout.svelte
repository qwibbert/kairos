<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import '$components/style.css';
	import VinesIcon from '$components/ui/vines-icon.svelte';
	import '$features/tour/index';
	import Alerts from '$lib/components/alerts.svelte';
	import i18next from 'i18next';
	import ChartLine from 'lucide-svelte/icons/chart-line';
	import Home from 'lucide-svelte/icons/home';
	import Settings from 'lucide-svelte/icons/settings';
	import { setContext } from 'svelte';
	import type { SessionDocument } from '../db/sessions/define.svelte';
	let { children } = $props();
	
	const app_state: { session: SessionDocument | null } = $state({
		session: null
	})
	const session = setContext('app_state', app_state);

    let dock_active: "HOME" | "VINES" | "STATISTICS" | "SETTINGS" = $state(page.url.pathname == '/' ? 'HOME' : page.url.pathname.replace('/', ''));
</script>

<Alerts />

<div class="h-[80dvh] m-[5dvh] overflow-y-auto">
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
	<button id="home-button" class:dock-active={dock_active == 'HOME'} onclick={() => { dock_active = 'HOME'; goto('/') }}>
		<Home class="size-[1.2em]" />
		<span class="dock-label">{i18next.t('common:home')}</span>
	</button>
	<button id="tour-4-mobile" class:dock-active={dock_active == 'VINES'} onclick={() => { dock_active = 'VINES'; goto('/vines') }}>
		<VinesIcon styles={['size-[1.2em]']} />
		<span class="dock-label">{i18next.t('vines:vines')}</span>
	</button>

	<button id="tour-3-mobile" class:dock-active={dock_active == 'STATISTICS'} onclick={() => { dock_active = 'STATISTICS'; goto('/statistics')  }}>
		<ChartLine class="size-[1.2em]" />
		<span class="dock-label">{i18next.t('statistics:statistics')}</span>
	</button>

	<button id="tour-2-mobile" class:dock-active={dock_active == 'SETTINGS'} onclick={() => {dock_active = 'SETTINGS'; goto('settings') }}>
		<Settings class="size-[1.2em]" />
		<span class="dock-label">{i18next.t('settings:settings')}</span>
	</button>
</footer>
