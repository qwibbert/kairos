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
	import { onMount } from 'svelte';

	import { category_color, generate_color_palette } from '$lib/colors';
	import { get_app_state } from '$lib/context';

	import { db } from '../../../db/db';
	import { PomoType, type SessionDocument } from '../../../db/sessions/define.svelte';
	import type { VinesDocument } from '../../../db/vines/define';
	import { pie_options } from '../graph-options';

	const app_state = get_app_state();

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

	let pie_chart = $state<echarts.EChartsType | undefined>(undefined);
	let pie_chart_element: HTMLDivElement | null = $state(null);
	let sessions: SessionDocument[] = $state([]);

	db.sessions
		.find({
			selector: {
				$and: [{ pomo_type: { $eq: PomoType.Pomo } }],
			},
		})
		.$.subscribe((result) => (sessions = result));

	$effect(() => {
		if (pie_chart && (app_state.session || app_state.selected_vine)) {
			load_pie_chart(app_state.selected_vine, sessions);
		}
	});

	onMount(async () => {
		await load_pie_chart(app_state.selected_vine, sessions);
	});

	export function load_colors() {
		const style = window.getComputedStyle(document.body);

		pie_chart?.resize();

		pie_options.series[0].label.color = formatHex(style.getPropertyValue('--color-base-content'));
		pie_options.series[0].tooltip.backgroundColor = style.getPropertyValue('--color-base-100');
		pie_options.series[0].tooltip.backgroundColor = style.getPropertyValue('--color-base-200');
		pie_options.series[0].borderColor = style.getPropertyValue('--color-base-content');
		pie_options.series[0].tooltip.borderColor = style.getPropertyValue('--color-base-content');
		pie_options.series[0].tooltip.textStyle.color = style.getPropertyValue('--color-base-content');

		pie_chart?.clear();
		pie_chart?.setOption(pie_options);
	}

	type PieChartData = { name: string; value: number }[];

	async function load_pie_chart(vine: VinesDocument, entries: SessionDocument[]) {
		if (!pie_chart) {
			pie_chart = echarts.init(pie_chart_element, null, {
				height: 'auto',
				width: 'auto',
				renderer: 'canvas',
			});
		}

		const style = window.getComputedStyle(document.body);

		const base_colors = [
			formatHex(style.getPropertyValue('--color-primary')),
			formatHex(style.getPropertyValue('--color-secondary')),
			formatHex(style.getPropertyValue('--color-accent')),
			formatHex(style.getPropertyValue('--color-info')),
			formatHex(style.getPropertyValue('--color-success')),
			formatHex(style.getPropertyValue('--color-warning')),
			formatHex(style.getPropertyValue('--color-error')),
		] as string[];

		const color_palette = generate_color_palette(base_colors, 60);

		const vine_map = new Map(app_state.vines.map((v) => [v.id, v]));
		const vine_children_cache = new Map<string, VinesDocument[]>();

		// Precompute vine children for all vine_ids
		for (const vine of app_state.vines) {
			vine_children_cache.set(
				vine.id,
				await db.vines.get_vine(vine.id).then((v) => v?.get_all_children(vine.id)),
			);
		}

		const data: PieChartData = [];

		for (const entry of entries) {
			// Only include children of the specified vine if vine_id is provided
			if (
				entry.vine_id != vine.id &&
				!vine_children_cache.get(vine.id)?.find((child) => child.id == entry?.vine_id)
			) {
				continue;
			}

			const entry_vine = vine_map.get(entry.vine_id ?? '');

			// Determine the label for this pie slice
			let slice_name: string = '';

			slice_name = entry_vine?.title ?? '';

			// Find if this slice already exists
			const data_index = data.findIndex((dataEntry) => dataEntry.name === slice_name);

			if (data_index === -1) {
				data.push({
					name: slice_name,
					value: entry.get_time_elapsed(),
					itemStyle: {
						color: category_color(entry.vine_id ?? '', color_palette),
					},
				});
			} else {
				// Aggregate time if slice already exists
				data[data_index] = {
					...data[data_index],
					value: data[data_index].value + entry.get_time_elapsed(),
				};
			}
		}

		// No data was found, we need to distribute the pie chart evenly
		if (data.length == 0) {
			const children = vine_children_cache.get(vine.id);
			// Check if vine has children
			if (children && children.length != 0) {
				for (const child of children) {
					data.push({
						name: child?.title ?? 'Unknown Task',
						value: 0,
						itemStyle: {
							color: category_color(child.id ?? '', color_palette),
						},
					});
				}
			} else {

				data.push({
					name: vine.title,
					value: 0,
					itemStyle: {
						color: category_color(vine.id ?? '', color_palette),
					}
				});
			}
		}
		pie_options.series[0].data = data;

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

<div bind:this={pie_chart_element} class="w-full h-[50dvh]"></div>
