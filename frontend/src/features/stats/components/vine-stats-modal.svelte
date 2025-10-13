<script lang="ts">
	import { formatHex } from 'culori';
	import * as echarts from 'echarts/core';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import { DateTime } from 'luxon';

	import { BarChart, PieChart } from 'echarts/charts';
	import { DatasetComponent, GridComponent, LegendComponent, TitleComponent, TooltipComponent, TransformComponent } from 'echarts/components';
	import { LabelLayout, UniversalTransition } from 'echarts/features';
	import { CanvasRenderer } from 'echarts/renderers';
	import i18next from 'i18next';
	import { db } from '../../../db/db';
	import { PomoType } from '../../../db/sessions/define.svelte';
	import type { VinesDocument } from '../../../db/vines/define';
	import { vine_day_options, vine_pie_options, vine_year_options } from '../graph-options';
	import { get_day_histogram_echarts, get_year_histogram_echarts } from '../graphs/histogram';
	import { vines_pie_chart } from '../graphs/pie';

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

	interface Props {
		vine_stats_modal?: HTMLDialogElement;
		vine: VinesDocument | undefined;
	}

	let { vine_stats_modal = $bindable(), vine = $bindable() }: Props = $props();

	let view = $state<'DAY' | 'YEAR'>('DAY');
	let chart = $state<'HISTOGRAM' | 'PIE'>('HISTOGRAM');

	let histogram_element: HTMLDivElement | null = $state(null);
	let pie_element: HTMLDivElement | null = $state(null);

	const today = DateTime.now();
	let delta_weeks = $state(0);
	let delta_years = $state(0);
	const weekStart = $derived(today.startOf('week').minus({ weeks: delta_weeks }));
	const weekEnd = $derived(today.endOf('week').minus({ weeks: delta_weeks }));

	let histogram = $state<echarts.EChartsType | undefined>();
	let pie_chart = $state<echarts.EChartsType | undefined>();

	$effect(() => {
		if (histogram && chart == 'HISTOGRAM' && view == 'DAY' && delta_weeks >= 0) {
			load_histogram();
		} else if (histogram && chart == 'HISTOGRAM' && view == 'YEAR' && delta_years >= 0) {
			load_histogram();
		}

		if (pie_chart && chart == 'PIE') {
			load_pie_chart();
		}
	});

	function load_colors() {
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

		vine_day_options.color = colors;
		vine_year_options.color = colors;
		vine_pie_options.color = colors;
		vine_day_options.tooltip.backgroundColor = style.getPropertyValue('--color-base-100');
		vine_year_options.tooltip.backgroundColor = style.getPropertyValue('--color-base-200');
		vine_day_options.tooltip.borderColor = style.getPropertyValue('--color-base-content');
		vine_year_options.tooltip.borderColor = style.getPropertyValue('--color-base-content');
		vine_day_options.tooltip.textStyle.color = style.getPropertyValue('--color-base-content');
		vine_year_options.tooltip.textStyle.color = style.getPropertyValue('--color-base-content');
		vine_day_options.legend.textStyle.color = style.getPropertyValue('--color-base-content');
		vine_year_options.legend.textStyle.color = style.getPropertyValue('--color-base-content');
		vine_day_options.xAxis.axisLine.lineStyle.color =
			style.getPropertyValue('--color-base-content');
		vine_year_options.xAxis.axisLine.lineStyle.color =
			style.getPropertyValue('--color-base-content');
		vine_day_options.yAxis.splitLine.lineStyle.color =
			style.getPropertyValue('--color-base-content');
		vine_year_options.yAxis.splitLine.lineStyle.color =
			style.getPropertyValue('--color-base-content');
		vine_day_options.yAxis.axisLabel.textStyle.color =
			style.getPropertyValue('--color-base-content');
		vine_year_options.yAxis.axisLabel.textStyle.color =
			style.getPropertyValue('--color-base-content');
		vine_day_options.yAxis.nameTextStyle.color = style.getPropertyValue('--color-base-content');
		vine_year_options.yAxis.nameTextStyle.color = style.getPropertyValue('--color-base-content');

		vine_pie_options.series[0].label.color = formatHex(
			style.getPropertyValue('--color-base-content'),
		);

		if (view == 'DAY' && chart == 'HISTOGRAM') {
			histogram?.setOption(vine_day_options);
		} else if (view == 'YEAR' && chart == 'HISTOGRAM') {
			histogram?.setOption(vine_year_options);
		}

		if (chart == 'PIE') {
			pie_chart?.setOption(vine_pie_options);
		}
	}

	async function load_histogram() {
		histogram?.clear();
		if (!histogram) {
			histogram = echarts.init(histogram_element, null, {
				height: 'auto',
				width: 'auto',
				renderer: 'canvas'
			});
		}

		if (view == 'DAY') {
			[vine_day_options.dataset.source, vine_day_options.series] =
				await get_day_histogram_echarts(
					today.minus({ weeks: delta_weeks }),
					PomoType.Pomo,
					vine?.id,
					true
				);
		} else if (view == 'YEAR') {
			[vine_year_options.dataset.source, vine_year_options.series] =
				await get_year_histogram_echarts(
					today.startOf('year').minus({ years: delta_years }),
					PomoType.Pomo,
					vine?.id,
					true
				);
		}

		load_colors();
		histogram.resize();
	}

	async function load_pie_chart() {
		pie_chart?.clear();

		const vines = await db.vines.find().exec();
		const vine_map = new Map(vines.map((v) => [v.id, v]));
		const vine_children_cache = new Map<string, string[]>();

		// Precompute vine children for all vine_ids
		for (const vine of vines) {
			vine_children_cache.set(
				vine.id,
				await db.vines.get_vine(vine.id).then((v) => v.get_all_children(vine.id)),
			);
		}

		const all_entries = await db.sessions
			.find({
				selector: { $and: [{ pomo_type: { $eq: PomoType.Pomo } }, { vine_id: { $exists: true } }] },
			})
			.exec();
		if (!pie_chart) {
			pie_chart = echarts.init(pie_chart, null, {
				height: 'auto',
				width: 'auto',
				renderer: 'canvas'
			});
		}

		vine_pie_options.series[0].data = vines_pie_chart(
			vine?.id,
			all_entries,
			vine_map,
			vine_children_cache,
		);

		load_colors();

		pie_chart?.resize();
	}
</script>

<svelte:window
	on:resize={() => {
		if (chart == 'HISTOGRAM') {
			histogram?.resize();
		} else if (chart == 'PIE') {
			pie_chart?.resize();
		}
	}}
/>

<dialog bind:this={vine_stats_modal} class="modal">
	<div class="modal-box flex flex-col items-center">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<h3 class="text-lg font-bold self-baseline">{vine?.title}</h3>
		<div class="flex flex-col mt-5 items-center gap-3 w-full">
			<div class="flex flex-row justify-evenly w-full gap-2">
				<select bind:value={chart} class="select">
					<option value="PIE">{i18next.t('statistics:pie_chart')}</option>
						<option value="HISTOGRAM">{i18next.t('statistics:histogram')}</option>
				</select>
				{#if chart == 'HISTOGRAM'}
					<select bind:value={view} class="select">
						<option value="DAY">{i18next.t('statistics:day_view')}</option>
						<option value="YEAR">{i18next.t('statistics:year_view')}</option>
					</select>
				{/if}
			</div>

			{#if chart == 'HISTOGRAM'}
				<div class="flex flex-row items-center justify-between mb-2 w-full">
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
			{/if}

			<div bind:this={histogram_element} class="w-full h-[50vh]" class:hidden={chart != 'HISTOGRAM'}></div>

			<div bind:this={pie_element} class="w-full h-[50vh]" class:hidden={chart != 'PIE'}></div>
		</div>
	</div>
</dialog>
