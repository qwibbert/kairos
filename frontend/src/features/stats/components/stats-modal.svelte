<script lang="ts">
	import { formatHex } from 'culori';
	import { BarChart, PieChart } from 'echarts/charts';
	import {
		DatasetComponent,
		GridComponent,
		LegendComponent,
		TitleComponent,
		TooltipComponent,
		TransformComponent,
	} from 'echarts/components';
	import * as echarts from 'echarts/core';
	import { LabelLayout, UniversalTransition } from 'echarts/features';
	import { CanvasRenderer } from 'echarts/renderers';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import { DateTime } from 'luxon';
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';

	import { db } from '../../../db/db';
	import {
		PomoType,
		type SessionDocument,
		SessionStatus,
	} from '../../../db/sessions/define.svelte';
	import { day_options, year_options } from '../graph-options';
	import { get_day_histogram_echarts, get_stats_day, get_year_histogram_echarts } from '../graphs/histogram';

	interface Props {
		stats_modal?: HTMLDialogElement;
	}

	let { stats_modal = $bindable() }: Props = $props();

	echarts.use([
		PieChart,
		BarChart,
		TitleComponent,
		TooltipComponent,
		GridComponent,
		DatasetComponent,
		TransformComponent,
		LabelLayout,
		UniversalTransition,
		CanvasRenderer,
		LegendComponent,
	]);

	let view = $state<'DAY' | 'YEAR'>('DAY');
	const today = DateTime.now();
	let delta_weeks = $state(0);
	let delta_years = $state(0);
	const weekStart = $derived(today.startOf('week').minus({ weeks: delta_weeks }));
	const weekEnd = $derived(today.endOf('week').minus({ weeks: delta_weeks }));

	let time_today = $state(0);

	let histogram = $state<echarts.EChartsType | undefined>(undefined);

	let active_session: SessionDocument | undefined = $state(undefined);
	const active_session_query = db.sessions.find({
		selector: { status: { $eq: SessionStatus.Active } },
		limit: 1,
		sort: [{ created_at: 'desc' }],
	});
	active_session_query.$.subscribe((result) => (active_session = result.at(0)));

	let sessions_today: SessionDocument[] | undefined = $state(undefined);
	const sessions_today_query = db.sessions.find({
		selector: {
			$and: [
				{ date_finished: { $gte: DateTime.now().startOf('day').toMillis() } },
				{ date_finished: { $lte: DateTime.now().endOf('day').toMillis() } },
				{ pomo_type: { $eq: PomoType.Pomo } },
			],
		},
	});
	sessions_today_query.$.subscribe((result) => (sessions_today = result));

	$effect(() => {
		if (histogram && active_session) {
			load_histogram();

			load_day_stats();
		}
	});

	onMount(async () => {
		await load_histogram();
		await load_day_stats();
	});

	$effect(() => {
		if (view == 'DAY' && delta_weeks >= 0) {
			load_histogram();
		} else if (view == 'YEAR' && delta_years >= 0) {
			load_histogram();
		}
	});

	async function load_day_stats(): Promise<void> {
		await db.vines
			.find()
			.exec()
			.then((vines) => {
				const vine_map = new Map(vines.map((v) => [v.id, v]));
				const vine_children_cache = new Map<string, string[]>();

				Promise.all(
					vines.map(
						async (vine) =>
							await db.vines.get_vine(vine.id).then((v) =>
								v?.get_all_children().then((vs) =>
									vine_children_cache.set(
										vine.id,
										vs.map((vss) => vss.id),
									),
								),
							),
					),
				).then(() => {
					// Now vine_children_cache is fully populated
					const today = DateTime.now().startOf('day');
					db.sessions
						.find({
							selector: {
								$and: [
									{ updated_at: { $gte: DateTime.now().startOf('day').toISO().replace('T', ' ') } },
									{ updated_at: { $lte: DateTime.now().endOf('day').toISO().replace('T', '') } },
									{ pomo_type: { $eq: PomoType.Pomo } },
								],
							},
						})
						.exec()
						.then((results) => {
							get_stats_day(today, undefined, results, vine_map, vine_children_cache).then(
								(stats) => {
									time_today =
										stats.no_vine + stats.per_vine.reduce((time, vine) => time + vine.time, 0);
								},
							);
						});
				});
			});
	}

	export function load_colors() {
		const style = window.getComputedStyle(document.body);

		const colors = [
			formatHex(style.getPropertyValue('--color-primary')),
			formatHex(style.getPropertyValue('--color-secondary')),
			formatHex(style.getPropertyValue('--color-accent')),
			formatHex(style.getPropertyValue('--color-accent')),
			formatHex(style.getPropertyValue('--color-accent-content')),
			formatHex(style.getPropertyValue('--color-info')),
			formatHex(style.getPropertyValue('--color-info-content')),
			formatHex(style.getPropertyValue('--color-success')),
			formatHex(style.getPropertyValue('--color-success-content')),
			formatHex(style.getPropertyValue('--color-warning')),
			formatHex(style.getPropertyValue('--color-warning-content')),
			formatHex(style.getPropertyValue('--color-error')),
			formatHex(style.getPropertyValue('--color-error-content')),
		] as string[];

		day_options.color = colors;
		year_options.color = colors;
		day_options.tooltip.backgroundColor = style.getPropertyValue('--color-base-100');
		year_options.tooltip.backgroundColor = style.getPropertyValue('--color-base-200');
		day_options.tooltip.borderColor = style.getPropertyValue('--color-base-content');
		year_options.tooltip.borderColor = style.getPropertyValue('--color-base-content');
		day_options.tooltip.textStyle.color = style.getPropertyValue('--color-base-content');
		year_options.tooltip.textStyle.color = style.getPropertyValue('--color-base-content');
		day_options.legend.textStyle.color = style.getPropertyValue('--color-base-content');
		year_options.legend.textStyle.color = style.getPropertyValue('--color-base-content');
		day_options.xAxis.axisLine.lineStyle.color = style.getPropertyValue('--color-base-content');
		year_options.xAxis.axisLine.lineStyle.color = style.getPropertyValue('--color-base-content');
		day_options.yAxis.splitLine.lineStyle.color = style.getPropertyValue('--color-base-content');
		year_options.yAxis.splitLine.lineStyle.color = style.getPropertyValue('--color-base-content');
		day_options.yAxis.axisLabel.textStyle.color = style.getPropertyValue('--color-base-content');
		year_options.yAxis.axisLabel.textStyle.color = style.getPropertyValue('--color-base-content');
		day_options.yAxis.nameTextStyle.color = style.getPropertyValue('--color-base-content');
		year_options.yAxis.nameTextStyle.color = style.getPropertyValue('--color-base-content');

		if (view == 'DAY') {
			histogram?.setOption(day_options);
		} else if (view == 'YEAR') {
			histogram?.setOption(year_options);
		}
	}

	async function load_histogram() {
		histogram?.clear();

		if (!histogram) {
			histogram = echarts.init(document.getElementById('histogram'), null, {
				height: 'auto',
				width: 'auto',
			});
		}

		if (view == 'DAY') {
			[day_options.dataset.source, day_options.series] =
				await get_day_histogram_echarts(
					today.minus({ weeks: delta_weeks }),
					PomoType.Pomo,
					undefined,
				);
		} else if (view == 'YEAR') {
			[year_options.dataset.source, year_options.series, year_options.legend.data] =
				await get_year_histogram_echarts(
					today.startOf('year').minus({ years: delta_years }),
					PomoType.Pomo,
					undefined,
				);
		}

		histogram.resize();

		load_colors();
	}

	new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			if (mutation.type === 'attributes') {
				load_colors();
			}
		});
	}).observe(document.documentElement, { attributes: true });
</script>

<svelte:window on:resize={() => histogram?.resize()} />

<dialog bind:this={stats_modal} id="stats" class="modal overflow-y-auto">
	<div class="modal-box">
		<div class="flex flex-row items-center justify-between mb-2">
			<h3 class="text-lg font-bold">{$_('statistics')}</h3>
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost">✕</button>
			</form>
		</div>

		<div class="stats text-primary shadow w-full">
			<div class="stat">
				<div class="stat-title">{$_('focus_time')}</div>
				<div class="stat-value text-md md:text-3xl">
					{#if time_today < 3600}
						{Math.floor(time_today / 60)} min
					{:else}
						{Math.floor(time_today / 3600)}
						h {Math.floor((time_today % 3600) / 60)} min
					{/if}
				</div>
				<div class="stat-desc">{$_('today')}</div>
			</div>

			<div class="stat">
				<div class="stat-title">{$_('focus_sessions')}</div>
				<div class="stat-value">{sessions_today?.length ?? 0}</div>
				<div class="stat-desc">{$_('today')}</div>
			</div>
		</div>

		<div class="flex flex-col mt-5 items-center gap-3">
			<select bind:value={view} class="select">
				<option value="DAY">{$_('day_view')}</option>
				<option value="YEAR">{$_('year_view')}</option>
			</select>
			<div class="flex flex-row items-center justify-between mb-2">
				<button
					class="btn btn-xs btn-primary"
					onclick={() => (view == 'DAY' ? (delta_weeks += 1) : (delta_years += 1))}
					><ChevronLeft class="size-[1.5em]" /></button
				>
				{#if weekStart && weekEnd && view == 'DAY'}
					<span class="mx-2 text-sm">
						{weekStart.toLocaleString({
							day: '2-digit',
							month: 'short',
							year: 'numeric',
						})} - {weekEnd.toLocaleString({
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

			<div id="histogram" class="w-full h-[50vh]"></div>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
