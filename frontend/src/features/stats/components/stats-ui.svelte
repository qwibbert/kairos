<script lang="ts">
	import VineSelectModal from '$features/vines/components/vine-select-modal.svelte';
	import i18next from 'i18next';
	import ChartColumn from 'lucide-svelte/icons/chart-column';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import { DateTime } from 'luxon';
	import { modals } from 'svelte-modals';

	import { get_app_state } from '$lib/context';

	import { db } from '../../../db/db';
	import { PomoType } from '../../../db/sessions/define.svelte';
	import type { VinesDocument } from '../../../db/vines/define';
	import Histogram from './histogram.svelte';
	import PieChart from './pie-chart.svelte';

	const app_state = get_app_state();

	let { mode = $bindable() }: { mode: 'GENERAL' | 'VINE' } = $props();

	let vine_total_time = $state(0);
	let chart_type: 'BAR' | 'PIE' = $state('BAR');

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

	$effect(() => {
		if ((app_state.session || !app_state.session) && app_state.selected_vine) {
			load_vine_stats(app_state.selected_vine);
		}
	});

	async function load_day_stats(): Promise<void> {
		const sessions_today = await db.sessions
			.find({
				selector: {
					$and: [
						{ updated_at: { $gte: DateTime.now().startOf('day').toISO().replace('T', ' ') } },
						{ updated_at: { $lte: DateTime.now().endOf('day').toISO().replace('T', '') } },
						{ pomo_type: { $eq: PomoType.Pomo } },
						{ time_end: { $exists: true } },
					],
				},
			})
			.exec();

		time_today = sessions_today.reduce((sum, session) => sum + session.get_time_elapsed(), 0);
		n_sessions_today = sessions_today.length;
	}

	async function load_vine_stats(vine: VinesDocument | null): Promise<void> {
		if (vine) {
			const vine_map = new Map(app_state.vines?.map((v) => [v.id, v]));
			const vine_children_cache = new Map<string, VinesDocument[]>();

			// Precompute vine children for all vine_ids
			for (const vine of app_state.vines) {
				vine_children_cache.set(
					vine.id,
					await db.vines.get_vine(vine.id).then((v) => v?.get_all_children(vine.id)),
				);
			}

			const all_entries = await db.sessions
				.find({
					selector: {
						$and: [{ pomo_type: { $eq: PomoType.Pomo } }],
					},
				})
				.exec()
				.then((results) =>
					results
						.filter((res) => {
							if (vine) {
								if (res.vine_id == vine.id) {
									return true;
								} else if (vine_children_cache.get(vine.id)?.find((r) => r.id == res.vine_id)) {
									return true;
								} else {
									return false;
								}
							} else {
								return true;
							}
						})
						.map((v) => v.get_time_elapsed()),
				);

			vine_total_time = all_entries.reduce((sum, vine) => {
				return sum + vine;
			}, 0);
		}
	}
</script>

<div role="tablist" class="tabs tabs-lift w-full">
	<a
		role="tab"
		class={['tab w-[50%]', mode == 'GENERAL' ? 'tab-active' : '']}
		onclick={() => (mode = 'GENERAL')}>Algemeen</a
	>
	<a
		role="tab"
		class={['tab w-[50%]', mode == 'VINE' ? 'tab-active' : '']}
		onclick={() => (mode = 'VINE')}>Tros</a
	>
</div>

{#if mode == 'GENERAL'}
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
		<Histogram {view} {time_today} {delta_weeks} {delta_years} vine={null} />
	</div>
{:else}
	<div class="flex flex-row justify-around w-full my-5">
		<select
			class="select w-[40%]"
			onclick={async (e) => {
				e.preventDefault();
				app_state.selected_vine = await modals.open(VineSelectModal, { vine_moving: null });
			}}
		>
			<option>{app_state.selected_vine?.title ?? i18next.t("vines:select_vine")}</option>
		</select>
		<select class="select w-[40%]" bind:value={chart_type}>
			<option value="BAR">{i18next.t("statistics:bar_chart")}</option>
			<option value="PIE">{i18next.t("statistics:pie_chart")}</option>
		</select>
	</div>

	{#if app_state.selected_vine}
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
		{#if chart_type == 'BAR'}
			<Histogram view="DAY" {delta_weeks} {delta_years} vine={app_state.selected_vine} />
		{:else}
			<PieChart />
		{/if}
		<p class="text-center">
			{i18next.t('statistics:total_time')}
			<span class="text-primary font-bold"
				>{#if vine_total_time < 3600}
					{Math.floor(vine_total_time / 60)} {i18next.t('statistics:minute_short')}
				{:else}
					{Math.floor(vine_total_time / 3600)}
					{i18next.t('statistics:hour_short')}
					{Math.floor((vine_total_time % 3600) / 60)}
					{i18next.t('statistics:minute_short')}
				{/if}</span
			>
		</p>
	{:else}
		<ChartColumn class="size-[8em] w-[50%] mx-[25%]" />
		<p class="text-center font-bold text-lg">{i18next.t('vines:no_vine_selected')}</p>
	{/if}
{/if}
