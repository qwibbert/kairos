<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import '$components/style.css';
	import VinesIcon from '$components/ui/vines-icon.svelte';
	import '$features/tour/index';
	import ChartLine from 'lucide-svelte/icons/chart-line';
	import Home from 'lucide-svelte/icons/home';
	import Settings from 'lucide-svelte/icons/settings';
	import { getContext } from 'svelte';
	import { _ } from 'svelte-i18n';

	let { children } = $props();

	const session = getContext('session');

    let dock_active: "HOME" | "VINES" | "STATISTICS" | "SETTINGS" = $state(page.url.pathname == '/' ? 'HOME' : page.url.pathname.replace('/', ''));
</script>

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
	<button class:dock-active={dock_active == 'HOME'} onclick={() => { dock_active = 'HOME'; goto('/') }}>
		<Home class="size-[1.2em]" />
		<span class="dock-label">{$_('home')}</span>
	</button>
	<button class:dock-active={dock_active == 'VINES'} onclick={() => { dock_active = 'VINES'; goto('/vines') }}>
		<VinesIcon styles={['size-[1.2em]']} />
		<span class="dock-label">{$_('vines')}</span>
	</button>

	<button class:dock-active={dock_active == 'STATISTICS'} onclick={() => { dock_active = 'STATISTICS'; goto('/statistics')  }}>
		<ChartLine class="size-[1.2em]" />
		<span class="dock-label">{$_('statistics')}</span>
	</button>

	<button class:dock-active={dock_active == 'SETTINGS'} onclick={() => {dock_active = 'SETTINGS'; goto('settings') }}>
		<Settings class="size-[1.2em]" />
		<span class="dock-label">{$_('settings')}</span>
	</button>
</footer>
