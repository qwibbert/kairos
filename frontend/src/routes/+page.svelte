<script lang="ts">
	// === IMPORTS ===
	import '$components/style.css';
	import KairosLogo from '$components/ui/kairos-logo.svelte';
	import SettingsModal from '$features/settings/components/settings-modal.svelte';
	import Statsmodal from '$features/stats/components/stats-modal.svelte';
	import '$features/tour/index';
	import VineModal from '$features/vines/components/vine-modal.svelte';
	import { shortcut } from '@svelte-put/shortcut';
	import ChartLine from 'lucide-svelte/icons/chart-line';
	import LogIn from 'lucide-svelte/icons/log-in';
	import Pause from 'lucide-svelte/icons/pause';
	import Play from 'lucide-svelte/icons/play';
	import Settings from 'lucide-svelte/icons/settings';
	import SkipForward from 'lucide-svelte/icons/skip-forward';
	import Square from 'lucide-svelte/icons/square';
	import SquareCheck from 'lucide-svelte/icons/square-check';
	import User from 'lucide-svelte/icons/user';
	import { onMount, setContext } from 'svelte';
	import { _ } from 'svelte-i18n';

	import Alerts from '$lib/components/alerts.svelte';
	import SyncIndicator from '$lib/components/sync-indicator.svelte';
	import { authModel, logout } from '$lib/pocketbase';
	import LoginRegister from '$lib/pocketbase/login-register.svelte';
	import { play_button_sound, play_timer_finish_sound, play_timer_tick_sound } from '$lib/sounds';

	import VinesIcon from '../components/ui/vines-icon.svelte';
	import { db } from '../db/db';
	import { on_session_syncable } from '../db/sessions/client';
	import type { SessionDocument } from '../db/sessions/define.svelte';
	import { PomoType, SessionStatus } from '../db/sessions/define.svelte';
	import type { SettingsDocument } from '../db/settings/define';
	import { VineStatus, type VinesDocument } from '../db/vines/define';

	// === STATE VARIABLES ===
	let session: SessionDocument | null = $state(null);
	setContext('session', () => session);
	let settings: SettingsDocument | null = $state(null);
	let sessions: SessionDocument[] | null = $state(null);
	let vines: VinesDocument[] | null = $state(null);
	let timer_interval: string | undefined = $state(undefined);

	const remaining_time = $derived(session ? session.time_target - session.get_time_elapsed() : 0);
	const minutes = $derived(Math.floor(remaining_time / 60));
	const seconds = $derived(remaining_time % 60);

	// Modal references
	let login_register = $state<HTMLDialogElement | undefined>();
	let settings_modal = $state<HTMLDialogElement | undefined>();
	let stats_modal = $state<HTMLDialogElement | undefined>();
	let vineselector_modal = $state<HTMLDialogElement | undefined>();
	let start_button = $state<HTMLButtonElement>();

	// === DATABASE QUERIES ===
	const settings_query = db.settings.findOne('1');
	const sessions_query = db.sessions.find();
	const vines_query = db.vines.find();
	const active_vine = $derived(vines ? vines.filter((v) => v.status == VineStatus.Active) : null);
	const active_session_query = db.sessions.findOne({
		selector: {
			$or: [
				{ status: { $eq: SessionStatus.Active } },
				{ status: { $eq: SessionStatus.Inactive } },
				{ status: { $eq: SessionStatus.Paused } },
			],
		},
		sort: [{ created_at: 'desc' }],
	});

	// === SUBSCRIPTION HANDLERS ===
	settings_query.$.subscribe((e) => {
		if (e) settings = e;
	});

	sessions_query.$.subscribe((e) => {
		if (e) sessions = e;
	});

	vines_query.$.subscribe((e: VinesDocument[]) => {
		if (e) vines = e;
	});

	active_session_query.$.subscribe(async (e) => {
		if (e?.id !== session?.id) {
			await handle_session_change(e);
		} else if (e) {
			session = e.getLatest();
			if (e.status == SessionStatus.Active && !timer_interval) {
				await start_timer();
			}
		}
	});

	onMount(async () => {
		session = await active_session_query.exec();

		if (session?.status == SessionStatus.Active && !timer_interval) {
			await start_timer();
		}

		if (!session) {
			await db.sessions.new({
				pomo_type: PomoType.Pomo,
				time_target: await db.settings.get_setting('pomo_time'),
				cycle: 0,
			});
		}
	});

	// // Active vine subscription with vine change logic
	// active_vine_query.$.subscribe(async (vines) => {
	//     const newActiveVine = vines[0] ?? null;
	//     active_vine = newActiveVine;

	//     if (newActiveVine && session && newActiveVine.id !== session.id) {
	//         await handle_vine_change(newActiveVine);
	//     }
	// });

	// === HELPER FUNCTIONS ===

	async function handle_session_change(new_session: SessionDocument | null) {
		if (new_session) {
			session = new_session;
		} else if (session) {
			// If current session became null, try to get resumable one
			const resumable = await db.sessions.get_last_resumable();
			session = resumable;
		}
	}

	async function start_timer() {
		if (timer_interval || !session) return; // Prevent multiple timers

		let tick_count = 0;
		timer_interval = setInterval(async () => {
			if (!session || session.status !== SessionStatus.Active) {
				stop_timer();
				return;
			}

			await update_timer_tick();
		}, 1000);
	}

	function stop_timer() {
		if (timer_interval) {
			clearInterval(timer_interval);
			timer_interval = undefined;
		}
	}

	async function update_timer_tick() {
		if (!session) return;

		const now = Date.now();
		const remaining_ms = Math.max(0, (session.time_end ?? 0) - now);
		const remaining_seconds = Math.ceil(remaining_ms / 1000);

		// Update session data
		const today = new Date().toDateString();
		session.time_elapsed[today] = session.time_target - remaining_seconds;

		await play_timer_tick_sound();

		// Update database periodically
		session = await session.incrementalUpdate({
			$set: {
				time_elapsed: $state.snapshot(session.time_elapsed),
				updated_at: new Date().toISOString().replace('T', ' '),
			},
		});

		// Update browser title
		const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
		document.title = `${minutes}:${formattedSeconds} | Kairos`;

		// Check completion
		if (remaining_ms <= 0) {
			await handle_session_complete();
		}
	}

	async function handle_session_complete() {
		if (!session) return;

		stop_timer();
		document.title = 'Kairos';
		await play_timer_finish_sound();

		session = await session.incrementalUpdate({
			$set: {
				status: SessionStatus.Ready,
				time_elapsed: $state.snapshot(session.time_elapsed),
				date_finished: Date.now(),
				updated_at: new Date().toISOString().replace('T', ' '),
			},
		});

		on_session_syncable(session.id);
		await session.next();
	}

	async function start_session() {
		if (session) {
			await session.start();
		}
	}

	async function pause_session() {
		if (session) {
			await session.pause();
		}
	}

	async function skip_session(override_type?: PomoType) {
		if (session) {
			await session.skip(override_type);
		}
	}

	// === REACTIVE EFFECTS ===
	$effect(() => {
		if (timer_interval) {
			document.documentElement.setAttribute('data-theme', settings?.theme_active);
		} else {
			document.documentElement.setAttribute('data-theme', settings?.theme_inactive);
		}
	});
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

{#if settings != null && vines != null && session != null && sessions != null}
	<Statsmodal bind:stats_modal {vines} {sessions} />
	<VineModal bind:vineselector_modal {vines} />
	<SettingsModal bind:settings_modal {settings} />
	<LoginRegister bind:login_register />
	<Alerts />

	{#snippet type_control(type: PomoType)}
		<button
			disabled={session?.status == SessionStatus.Active}
			class={[
				'btn btn-sm md:btn-md',
				{
					'btn-primary disabled:bg-primary': session?.pomo_type == type,
				},
				{ 'btn-neutral': session?.pomo_type != type },
				{
					'disabled:!bg-primary disabled:text-neutral': session?.pomo_type == type,
				},
			]}
			onclick={async () => {
				// Check if there is already an active session with a non-zero time_real
				// If so, skip this session
				if (session && session.get_time_elapsed() != 0) {
					await session.skip(type);
				} else {
					await db.sessions.new({
						pomo_type: type,
						time_target: await db.settings.get_setting(
							type == PomoType.Pomo
								? 'pomo_time'
								: type == PomoType.ShortBreak
									? 'short_break_time'
									: 'long_break_time',
						),
						vine: active_vine?.id,
						cycle: 0,
					});
				}
			}}
		>
			{#if type == PomoType.Pomo}
				{$_('pomodoro')}
			{:else if type == PomoType.ShortBreak}
				{$_('break')}
			{:else}
				{$_('long_break')}
			{/if}</button
		>
	{/snippet}

	<header
		class="h-[15dvh] flex justify-between items-center"
	>
		<div class="grow-1 basis-0 flex items-center gap-2 justify-center">
			<KairosLogo /><span class="text-2xl md:text-3xl xl:text-4xl text-primary font-bold"
				>Kairos</span
			>
			<span class="badge">{__KAIROS_VERSION__}</span>
		</div>
		{#if session?.status != SessionStatus.Active}
			<div class="join">
				<button
					class="btn btn-soft md:btn-md join-item w-20 m md:w-36"
					onclick={() => vineselector_modal?.showModal()}
					id="tour-4"
				>
					<VinesIcon styles={['size-[1.2em]']} />
					<span class="hidden md:block">{$_('vines')}</span>
				</button>
				<button
					class="btn btn-soft md:btn-md join-item w-20 md:w-36"
					id="tour-3"
					onclick={() => stats_modal?.showModal()}
				>
					<ChartLine class="size-[1.2em]" />
					<span class="hidden md:block">{$_('statistics')}</span>
				</button>
				<button
					id="tour-2"
					class="btn btn-soft join-item w-20 md:w-36"
					onclick={() => settings_modal?.showModal()}
				>
					<Settings class="size-[1.2em]" />
					<span class="hidden md:block">{$_('settings')}</span>
				</button>
			</div>
			{#if $authModel}
				<div class="flex flex-row gap-4 items-center grow-1 basis-0 justify-center">
					<SyncIndicator />
					<details class="dropdown">
						<summary class="btn m-1">
							<User class="size-[1.2em]" />
							{$authModel?.surname}
						</summary>
						<ul class="menu dropdown-content bg-base-100 rounded-box z-1 w-[10dvw] p-2 shadow-sm">
							<li><button>Account</button></li>
							<li><button onclick={() => logout()}>Log uit</button></li>
						</ul>
					</details>
				</div>
			{:else}
					<button class="btn grow-1 basis-0 justify-center" onclick={() => login_register?.showModal()}
						><LogIn class="size-[1.2em]" />
						<span class="hidden md:block">{$_('login_register')}</span></button
					>
			{/if}
		{/if}
	</header>
	<main id="tour-1" class="flex flex-col justify-around items-center h-[80dvh]">
		<section class="flex flex-col gap-5 items-center">
			<div class="flex flex-row justify-center gap-2">
				{@render type_control(PomoType.Pomo)}
				{@render type_control(PomoType.ShortBreak)}
				{@render type_control(PomoType.LongBreak)}
			</div>
			{#if session?.vine_title}
				<span class="btn btn-primary btn-sm">
					<SquareCheck class="size-[1.2em]" />{session?.vine_title}
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
			{#if session}
				{#if session.status == SessionStatus.Active}
					<button
						bind:this={start_button}
						class="btn btn-primary btn-wide btn-sm md:btn-md"
						onclick={async () => {
							await pause_session();
							await play_button_sound();
						}}
					>
						<Pause class="size-[1.2em]" />
						{$_('pause')}
					</button>
					<button
						class="btn btn-secondary btn-sm md:btn-md"
						onclick={async () => {
							await skip_session();
							await play_button_sound();
						}}><SkipForward class="size-[1.2em]" />{$_('skip')}</button
					>
				{:else if session.status == SessionStatus.Paused}
					<button
						bind:this={start_button}
						class="btn btn-primary btn-wide btn-sm md:btn-md"
						onclick={async () => {
							await start_session();
							await play_button_sound();
						}}
					>
						<Play class="size-[1.2em]" />
						{$_('resume')}</button
					>
					<button
						class="btn btn-secondary btn-sm md:btn-md"
						onclick={async () => {
							await skip_session();
							await play_button_sound();
						}}><SkipForward class="size-[1.2em]" /> {$_('skip')}</button
					>
				{:else}
					<button
						bind:this={start_button}
						class="btn btn-primary btn-wide btn-sm md:btn-md"
						onclick={async () => await start_session()}
						><Play class="size-[1.2em]" />{$_('start')}</button
					>
				{/if}
			{/if}
		</section>
	</main>
	{#if session.status != SessionStatus.Active}
		<footer class="h-[5dvh] flex flex-row w-full items-center justify-center gap-4">
			<a href="privacy.pdf" class="link link-hover text-sm">privacy</a>
			<a href="mailto:libert1quinten@gmail.com" target="_blank" class="link link-hover text-sm"
				>meld problemen</a
			>
			<a href="https://github.com/qwibbert/kairos" class="link link-hover text-sm">github</a>
		</footer>
	{/if}
{/if}
