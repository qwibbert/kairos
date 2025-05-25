<script lang="ts">
    import { formatHex } from "culori";
    import { BarChart } from "echarts/charts";
    import {
        DatasetComponent,
        GridComponent,
        LegendComponent,
        TitleComponent,
        TooltipComponent,
        TransformComponent,
    } from "echarts/components";
    import * as echarts from "echarts/core";
    import { LabelLayout, UniversalTransition } from "echarts/features";
    import { CanvasRenderer } from "echarts/renderers";
    import { onMount } from "svelte";
    import type { StatsManager } from "../../state/stats.svelte";

    interface Props {
        stats_manager: StatsManager;
        statistieken_modal?: HTMLDialogElement; // Optional dialog element
    }

    let { stats_manager, statistieken_modal = $bindable() }: Props = $props();

    echarts.use([
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

    let data = {
        xAxis: { type: "category", name: "Datum", data: [] },
        dataset: {
            source: [],
        },
        yAxis: {
            type: "value",
            name: "Focustijd (uren)",
            axisLabel: {
                formatter: "{value} h",
            },
            min: 0,
        },
        series: [
            {
                type: "bar",
                data: [],
            },
        ],
    };

    let myChart = undefined;

    onMount(() => {});

    $effect(() => {
        if (statistieken_modal && stats_manager && window) {
            data.color = [
                formatHex(
                    window
                        .getComputedStyle(document.body)
                        .getPropertyValue("--color-primary"),
                ),
            ];

            myChart = echarts.init(document.getElementById("stats"), null, {
                height: "auto",
                width: "auto",
            });

            const laatste_week = stats_manager.get_stats().per_day.slice(-7);

            laatste_week.forEach((item) => {
                data.xAxis.data.push(
                    new Date(item.date).toLocaleDateString("nl-NL", {
                        weekday: "short",
                        day: "numeric",
                    }),
                );

                data.series[0].data.push((item.time_focus / 3600).toFixed(1));
            });
            myChart.setOption(data);
            myChart.resize();
        }
    });

    let stats_today = $derived(stats_manager?.get_todayStats());
</script>

<svelte:window on:resize={() => myChart.resize()} />

<dialog bind:this={statistieken_modal} id="statistieken" class="modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold">Statistieken</h3>

        {#if stats_manager}
            <div
                class="stats text-primary stats-vertical lg:stats-horizontal shadow w-full"
            >
                <div class="stat">
                    <div class="stat-title">Focustijd</div>
                    <div class="stat-value">
                        {#if stats_today?.time_focus < 3600}
                            {Math.floor(stats_today?.time_focus / 60)} min
                        {:else}
                            {Math.floor(stats_today?.time_focus / 3600)}
                            h {Math.floor(
                                (stats_today?.time_focus % 3600) / 60,
                            )} min
                        {/if}
                    </div>
                </div>

                <div class="stat">
                    <div class="stat-title">Focus-sessies</div>
                    <div class="stat-value">
                        {stats_today?.focus_sessions}
                    </div>
                </div>
            </div>
        {/if}
        <div id="stats" class="w-full h-[50vh]"></div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>
