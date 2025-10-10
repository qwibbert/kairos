<script lang="ts">
	// === IMPORTS ===
	import { dev } from '$app/environment';
	import KairosLogo from '$components/ui/kairos-logo.svelte';
	import SettingsModal from '$features/settings/components/settings-modal.svelte';
	import Statsmodal from '$features/stats/components/stats-modal.svelte';
	import VineModal from '$features/vines/components/vine-modal.svelte';
	import { shortcut } from '@svelte-put/shortcut';
	import i18next from 'i18next';
	import ChartLine from 'lucide-svelte/icons/chart-line';
	import Pause from 'lucide-svelte/icons/pause';
	import Play from 'lucide-svelte/icons/play';
	import Settings from 'lucide-svelte/icons/settings';
	import SkipForward from 'lucide-svelte/icons/skip-forward';
	import Square from 'lucide-svelte/icons/square';
	import SquareCheck from 'lucide-svelte/icons/square-check';
	import { getContext, onMount } from 'svelte';

	import AccountButton from '$lib/components/account-button.svelte';
	import TimerTravel from '$lib/components/timer-travel.svelte';
	import { play_button_sound } from '$lib/sounds';
	import { tick } from '$lib/timer';

	import VinesIcon from '../components/ui/vines-icon.svelte';
	import { db } from '../db/db';
	import type { SessionDocument } from '../db/sessions/define.svelte';
	import { PomoType, SessionStatus } from '../db/sessions/define.svelte';
	import { type VinesDocument } from '../db/vines/define';

	// === STATE VARIABLES ===
	const app_state = getContext('app_state');

	let sessions: SessionDocument[] | null = $state(null);
	let vines: VinesDocument[] | null = $state(null);

	const remaining_time = $derived(app_state.session ? app_state.session.time_target - app_state.session.get_time_elapsed() : 0);
	const minutes = $derived(Math.floor(remaining_time / 60));
	const seconds = $derived(remaining_time % 60);

	// Modal references
	let settings_modal = $state<HTMLDialogElement | undefined>();
	let stats_modal = $state<HTMLDialogElement | undefined>();
	let vineselector_modal = $state<HTMLDialogElement | undefined>();
	let start_button = $state<HTMLButtonElement>();

	// === DATABASE QUERIES ===
	const settings_query = db.settings.findOne('1');
	const sessions_query = db.sessions.find();
	const vines_query = db.vines.find();

	sessions_query.$.subscribe((e) => {
		if (e) sessions = e;
	});

	vines_query.$.subscribe((e: VinesDocument[]) => {
		if (e) vines = e;
	});

	onMount(async () => {
		const resumeable_session = await db.sessions.get_last_resumable();

		if (resumeable_session) {
			app_state.session = resumeable_session;

			// Incase the session was interrupted, we can just resume it
			// TODO: session locking
			if (app_state.session?.status == SessionStatus.Active && !app_state.timer_interval) {
				await start_timer();
			}
		} else {
			app_state.session = await db.sessions.new({
				pomo_type: PomoType.Pomo,
				time_target: await db.settings.get_setting('pomo_time'),
				cycle: 0,
			});
		}
	});

	async function start_timer() {
		if (!app_state.session) return;

		if (app_state.timer_interval) {
			clearInterval(app_state.timer_interval);
			app_state.timer_interval = null;
		}

		app_state.timer_interval = setInterval(async () => {
			if (!app_state.session || app_state.session.status !== SessionStatus.Active) {
				clearInterval(app_state.timer_interval);
				app_state.timer_interval == null;
				return;
			} else if (!app_state.timer_interval) {
				return;
			}

			app_state.session = await tick(app_state.session, app_state.timer_interval);
		}, 1000);
	}

	async function start_session() {
		if (app_state.session) {
			app_state.session = await app_state.session.start(true);
			await start_timer();
		}
	}

	async function pause_session() {
		if (app_state.session) {
			app_state.session = await app_state.session.pause();
			clearInterval(app_state.timer_interval);
			app_state.timer_interval = null;
		}
	}

	async function skip_session(override_type?: PomoType) {
		if (app_state.session) {
			app_state.session = await app_state.session.skip(override_type);
			clearInterval(app_state.timer_interval);
			app_state.timer_interval = null;
		}
	}
</script>

<svelte:head>
	<title>Kairos</title>
</svelte:head>

<svelte:window
	use:shortcut={{
		trigger: {
			key: ' ',
			modifier: false,
			callback: () =>
				settings_modal?.open || stats_modal?.open || vineselector_modal?.open
					? null
					: start_button?.click(),
		},
	}}
/>

<Statsmodal bind:stats_modal />
<VineModal bind:vineselector_modal />
<SettingsModal bind:settings_modal />

{#snippet type_control(type: PomoType)}
	<button
		disabled={app_state.session?.status == SessionStatus.Active}
		class={[
			'btn btn-sm md:btn-md',
			{
				'btn-primary disabled:bg-primary': app_state.session?.pomo_type == type,
			},
			{ 'btn-neutral': app_state.session?.pomo_type != type },
			{
				'disabled:!bg-primary disabled:text-neutral': app_state.session?.pomo_type == type,
			},
		]}
		onclick={async () => {
			// Check if there is already an active session with a non-zero time_real
			// If so, skip this session
			if (app_state.session && app_state.session.get_time_elapsed() != 0) {
				app_state.session = await app_state.session.skip(type);
			} else {
				app_state.session = await db.sessions.new({
					pomo_type: type,
					time_target: await db.settings.get_setting(
						type == PomoType.Pomo
							? 'pomo_time'
							: type == PomoType.ShortBreak
								? 'short_break_time'
								: 'long_break_time',
					),
					cycle: 0,
				});
			}
		}}
	>
		{#if type == PomoType.Pomo}
			{i18next.t('session:pomodoro')}
		{:else if type == PomoType.ShortBreak}
			{i18next.t('session:break')}
		{:else}
			{i18next.t('session:long_break')}
		{/if}</button
	>
{/snippet}

<header class="h-[10dvh] flex justify-between items-center">
	<div class="grow-1 basis-0 flex items-center gap-2 justify-center">
		<KairosLogo /><span class="text-2xl md:text-3xl xl:text-4xl text-primary font-bold">Kairos</span
		>
		<span class="badge hidden md:block">{__KAIROS_VERSION__}</span>
	</div>
	{#if app_state.session?.status != SessionStatus.Active}
		<div class="join hidden md:block">
			<button
				class="btn btn-soft md:btn-md join-item w-20 m md:w-36"
				onclick={() => vineselector_modal?.showModal()}
				id="tour-4"
			>
				<VinesIcon styles={['size-[1.2em]']} />
				<span class="hidden md:block">{i18next.t('vines:vines')}</span>
			</button>
			<button
				class="btn btn-soft md:btn-md join-item w-20 md:w-36"
				id="tour-3"
				onclick={() => stats_modal?.showModal()}
			>
				<ChartLine class="size-[1.2em]" />
				<span class="hidden md:block">{i18next.t('statistics:statistics')}</span>
			</button>
			<button
				id="tour-2"
				class="btn btn-soft join-item w-20 md:w-36"
				onclick={() => settings_modal?.showModal()}
			>
				<Settings class="size-[1.2em]" />
				<span class="hidden md:block">{i18next.t('settings:settings')}</span>
			</button>
		</div>
		<div class="hidden md:flex grow-1 basis-0 justify-center">
			<AccountButton />
		</div>
	{/if}
</header>
<main id="tour-1" class="flex flex-col justify-around items-center h-[70dvh]">
	<section class="flex flex-col gap-5 items-center">
		<div class="flex flex-row justify-center gap-2">
			{@render type_control(PomoType.Pomo)}
			{@render type_control(PomoType.ShortBreak)}
			{@render type_control(PomoType.LongBreak)}
		</div>
		{#if app_state.session?.vine_title}
			<span class="btn btn-primary btn-sm">
				<SquareCheck class="size-[1.2em]" />{app_state.session?.vine_title}
			</span>
		{:else}
			<span class="btn btn-primary btn-sm"> <Square class="size-[1.2em]" />Geen taak</span>
		{/if}
	</section>
	<section>
		<span class="countdown font-mono text-6xl md:text-7xl xl:text-8xl rounded w-full">
			<span style={`--value:${minutes}`} aria-live="polite" aria-label={`${minutes}`}
				>{minutes}</span
			>:<span style={`--value:${seconds}`} aria-live="polite" aria-label={`${seconds}`}
				>{seconds}</span
			>
		</span>
	</section>

	<section class="flex flex-row gap-2 justify-center">
		{#if app_state.session}
			{#if app_state.session.status == SessionStatus.Active}
				<button
					bind:this={start_button}
					class="btn btn-primary btn-wide btn-sm md:btn-md"
					onclick={async () => {
						await pause_session();
						await play_button_sound();
					}}
				>
					<Pause class="size-[1.2em]" />
					{i18next.t('session:pause')}
				</button>
				<button
					class="btn btn-secondary btn-sm md:btn-md"
					onclick={async () => {
						await skip_session();
						await play_button_sound();
					}}><SkipForward class="size-[1.2em]" />{i18next.t('common:skip')}</button
				>
			{:else if app_state.session.status == SessionStatus.Paused}
				<button
					bind:this={start_button}
					class="btn btn-primary btn-wide btn-sm md:btn-md"
					onclick={async () => {
						await start_session();
						await play_button_sound();
					}}
				>
					<Play class="size-[1.2em]" />
					{i18next.t('session:resume')}</button
				>
				<button
					class="btn btn-secondary btn-sm md:btn-md"
					onclick={async () => {
						await skip_session();
						await play_button_sound();
					}}><SkipForward class="size-[1.2em]" /> {i18next.t('common:skip')}</button
				>
			{:else}
				<button
					bind:this={start_button}
					class="btn btn-primary btn-wide btn-sm md:btn-md"
					onclick={async () => {
						await start_session();
						await play_button_sound();
					}}><Play class="size-[1.2em]" />{i18next.t('session:start')}</button
				>
			{/if}
		{/if}
	</section>
	{#if dev}
		<TimerTravel session={app_state.session} />
	{/if}
</main>
