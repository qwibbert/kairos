<script lang="ts">
	import { formatHex } from 'culori';
	import { BarChart, PieChart } from 'echarts/charts';
	import { DatasetComponent, GridComponent, LegendComponent, TitleComponent, TooltipComponent, TransformComponent } from 'echarts/components';
	import * as echarts from 'echarts/core';
	import { LabelLayout, UniversalTransition } from 'echarts/features';
	import { CanvasRenderer } from 'echarts/renderers';
	import { DateTime } from 'luxon';
	import { onMount } from 'svelte';
	import { db } from '../../../db/db';
	import { PomoType, SessionStatus, type SessionDocument } from '../../../db/sessions/define.svelte';
	import type { VinesDocument } from '../../../db/vines/define';
	import { day_options, year_options } from '../graph-options';
	import { get_day_histogram_echarts, get_stats_day, get_year_histogram_echarts } from '../graphs/histogram';

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

	let { view, delta_weeks, delta_years, time_today = $bindable(), sessions_today = $bindable() }: { view: "DAY" | "YEAR", delta_weeks: number, delta_years: number, time_today: number, sessions_today: SessionDocument[] } = $props();

	let histogram = $state<echarts.EChartsType | undefined>(undefined);
	let histogram_element: HTMLDivElement | null = $state(null);

	let active_session: SessionDocument | undefined = $state(undefined);
	db.sessions
		.find({
			selector: { status: { $eq: SessionStatus.Active } },
			limit: 1,
			sort: [{ created_at: 'desc' }],
		})
		.$.subscribe((result) => (active_session = result.at(0)));

	db.sessions
		.find({
			selector: {
				$and: [
					{ date_finished: { $gte: DateTime.now().startOf('day').toMillis() } },
					{ date_finished: { $lte: DateTime.now().endOf('day').toMillis() } },
					{ pomo_type: { $eq: PomoType.Pomo } },
				],
			},
		})
		.$.subscribe((result) => (sessions_today = result));

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
		if (histogram && view == 'DAY' && delta_weeks >= 0) {
			load_histogram();
		} else if ( histogram && view == 'YEAR' && delta_years >= 0) {
			load_histogram();
		}
	});

	async function load_day_stats(): Promise<void> {
		await db.vines
			.find()
			.exec()
			.then((vines) => {
				const vine_map = new Map(vines.map((v) => [v.id, v]));
				const vine_children_cache = new Map<string, VinesDocument[]>();

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
							get_stats_day(today, undefined, results, vine_map, vine_children_cache, false).then(
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
		day_options.tooltip.textStyle!.color = style.getPropertyValue('--color-base-content');
		year_options.tooltip.textStyle!.color = style.getPropertyValue('--color-base-content');
		day_options.legend.textStyle!.color = style.getPropertyValue('--color-base-content');
		year_options.legend.textStyle!.color = style.getPropertyValue('--color-base-content');
		day_options.xAxis.axisLine!.lineStyle!.color = style.getPropertyValue('--color-base-content');
		year_options.xAxis.axisLine!.lineStyle!.color = style.getPropertyValue('--color-base-content');
		day_options.yAxis.splitLine!.lineStyle!.color = style.getPropertyValue('--color-base-content');
		year_options.yAxis.splitLine!.lineStyle!.color = style.getPropertyValue('--color-base-content');
		day_options.yAxis.axisLabel!.textStyle!.color = style.getPropertyValue('--color-base-content');
		year_options.yAxis.axisLabel!.textStyle!.color = style.getPropertyValue('--color-base-content');
		day_options.yAxis.nameTextStyle!.color = style.getPropertyValue('--color-base-content');
		year_options.yAxis.nameTextStyle!.color = style.getPropertyValue('--color-base-content');

		if (view == 'DAY') {
			histogram?.setOption(day_options);
		} else if (view == 'YEAR') {
			histogram?.setOption(year_options);
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
			[day_options.dataset.source, day_options.series] = await get_day_histogram_echarts(
				DateTime.now().minus({ weeks: delta_weeks }),
				PomoType.Pomo,
				undefined,
				false
			);
		} else if (view == 'YEAR') {
			[year_options.dataset.source, year_options.series, year_options.legend.data] =
				await get_year_histogram_echarts(
					DateTime.now().startOf('year').minus({ years: delta_years }),
					PomoType.Pomo,
					undefined,
					false
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

<div bind:this={histogram_element} class="w-full h-[50dvh]"></div>
