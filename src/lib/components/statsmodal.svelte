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
    import { DateTime } from "luxon";
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

    const today = DateTime.now();
    let delta_weeks = $state(0);
    const weekStart = $derived(
        today.startOf("week").minus({ weeks: delta_weeks }),
    );
    const weekEnd = $derived(today.endOf("week").minus({ weeks: delta_weeks }));

    $effect(() => {
        if (statistieken_modal && stats_manager && window) {
            if (myChart) {
                myChart.dispose();
            }

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

            [data.xAxis.data, data.series[0].data] =
                stats_manager.get_week_focus_time(delta_weeks);

            myChart.setOption(data);
            myChart.resize();
        }
    });

    let stats_today = $derived(stats_manager?.get_todayStats());
</script>

<svelte:window on:resize={() => myChart.resize()} />

<dialog bind:this={statistieken_modal} id="statistieken" class="modal">
    <div class="modal-box h-[80vh] flex flex-col items-center justify-between">
        <h3 class="text-lg font-bold">Statistieken</h3>

        {#if stats_manager}
            <div
                class="stats text-primary shadow w-full"
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
        <div class="w-full flex flex-col">
            <div class="flex flex-row items-center justify-between">
                <button
                    class="btn btn-xs btn-primary"
                    onclick={() => (delta_weeks += 1)}>Vorige week</button
                >
                {#if weekStart && weekEnd}
                    <span class="mx-2 text-sm">
                        {weekStart.toLocaleString({
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })} - {weekEnd.toLocaleString({
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </span>
                {/if}
                <button
                    class="btn btn-xs btn-primary"
                    disabled={delta_weeks <= 0}
                    onclick={() => (delta_weeks -= 1)}>Volgende week</button
                >
            </div>
            <div id="stats" class="w-full h-[50vh]"></div>
        </div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>
