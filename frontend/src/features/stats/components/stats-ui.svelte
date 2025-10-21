<script lang="ts">
	import i18next from 'i18next';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import { DateTime } from 'luxon';

	import { get_app_state } from '$lib/context';

	import { db } from '../../../db/db';
	import { PomoType } from '../../../db/sessions/define.svelte';
	import Histogram from './histogram.svelte';

	const app_state = get_app_state();

	let view = $state<'DAY' | 'YEAR'>('DAY');
	let delta_weeks = $state(0);
	let delta_years = $state(0);
	const today = DateTime.now();
	const week_start = $derived(today.startOf('week').minus({ weeks: delta_weeks }));
	const week_end = $derived(today.endOf('week').minus({ weeks: delta_weeks }));

	let time_today = $state(0);
	let n_sessions_today = $state(0);

	$effect(() => {
		if (app_state.session || !app_state.session) {
			load_day_stats();
		}
	});

	async function load_day_stats(): Promise<void> {
		const sessions_today = await db.sessions.find({
			selector: {
				$and: [
					{ updated_at: { $gte: DateTime.now().startOf('day').toISO().replace('T', ' ') } },
					{ updated_at: { $lte: DateTime.now().endOf('day').toISO().replace('T', '') } },
					{ pomo_type: { $eq: PomoType.Pomo }},
					{ time_end: {$exists: true} }
				],
			},
		}).exec();

		time_today = sessions_today.reduce((sum, session) => sum + session.get_time_elapsed(), 0);
		n_sessions_today = sessions_today.length;
	}
</script>

<div class="stats text-primary shadow w-full">
	<div class="stat">
		<div class="stat-title">{i18next.t('statistics:focus_time')}</div>
		<div class="stat-value text-md md:text-3xl">
			{#if time_today < 3600}
				{Math.floor(time_today / 60)} min
			{:else}
				{Math.floor(time_today / 3600)}
				h {Math.floor((time_today % 3600) / 60)} min
			{/if}
		</div>
		<div class="stat-desc">{i18next.t('common:today')}</div>
	</div>

	<div class="stat">
		<div class="stat-title">{i18next.t('statistics:focus_sessions')}</div>
		<div class="stat-value">{n_sessions_today}</div>
		<div class="stat-desc">{i18next.t('statistics:today')}</div>
	</div>
</div>

<div class="flex flex-col mt-5 items-center gap-3">
	<select bind:value={view} class="select">
		<option value="DAY">{i18next.t('statistics:day_view')}</option>
		<option value="YEAR">{i18next.t('statistics:year_view')}</option>
	</select>
	<div class="flex flex-row items-center justify-between mb-2">
		<button
			class="btn btn-xs btn-primary"
			onclick={() => (view == 'DAY' ? (delta_weeks += 1) : (delta_years += 1))}
			><ChevronLeft class="size-[1.5em]" /></button
		>
		{#if week_start && week_end && view == 'DAY'}
			<span class="mx-2 text-sm">
				{week_start.toLocaleString({
					day: '2-digit',
					month: 'short',
					year: 'numeric',
				})} - {week_end.toLocaleString({
					day: '2-digit',
					month: 'short',
					year: 'numeric',
				})}
			</span>
		{:else if view == 'YEAR'}
			<span class="mx-2 text-sm">
				{today.minus({ years: delta_years }).year}
			</span>
		{/if}
		<button
			class="btn btn-xs btn-primary"
			disabled={view == 'DAY' ? delta_weeks <= 0 : view == 'YEAR' ? delta_years <= 0 : true}
			onclick={() => (view == 'DAY' ? (delta_weeks -= 1) : (delta_years -= 1))}
			><ChevronRight class="size-[1.5em]" /></button
		>
	</div>
	<Histogram {view} {time_today} {delta_weeks} {delta_years} />
</div>
