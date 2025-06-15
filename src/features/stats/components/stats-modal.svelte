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
    import ChevronLeft from "lucide-svelte/icons/chevron-left";
    import ChevronRight from "lucide-svelte/icons/chevron-right";
    import { DateTime } from "luxon";
    import { m } from "../../../paraglide/messages";
    import { getStatsContext } from "../context";

    interface Props {
        statistieken_modal?: HTMLDialogElement; // Optional dialog element
    }

    let { statistieken_modal = $bindable() }: Props = $props();

    const stats_context = getStatsContext();

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
        legend: {
            padding: [0,0, 0, 0],
            type: "scroll",
        },
        datazoom: [],
        xAxis: {
            type: "category",
            name: m.date(),
            nameLocation: "middle",
            nameGap: 30,
            axisTick: { interval: 0 },
            axisLabel: {
                interval: 0,
                formatter: (value: string) =>
                    DateTime.fromISO(value).toLocaleString({
                        day: "2-digit",
                        weekday: "short",
                    }),
            }, // Remove year from date
        },
        dataset: {
            source: [],
        },
        yAxis: {
            type: "value",
            name: m.focus_time_hours(),
            nameLocation: "end",
            nameTextStyle: {
                padding: [0, 0, 0, 30],
            },
            minInterval: 0.5,
            nameGap: 30,
            axisLabel: {
                formatter: "{value} h",
                margin: 2,
                showMinLabel: false,
            },
            min: 0,
        },
        series: [],
        tooltip: {
            trigger: "axis",
            formatter: (params) => {
                let htmlString = "";
                if (params.length > 1) {
                    htmlString += `<div><strong>${params[0].axisValue}</strong></div>`;
                }

                let total_time = 0;

                params.forEach((param) => {
                    const focusTime = param.value[param.encode.y[0]];
                    total_time += focusTime;

                    if (focusTime === undefined) return;

                    if (focusTime < 1) {
                        htmlString += `
                                <div>
                        ${param.marker} ${param.dimensionNames[param.seriesIndex + 1]}: ${Math.floor(
                            focusTime * 60,
                        )} min
                                </div>
                            `;
                        return;
                    } else {
                        htmlString += `
                                <div>
                                   ${param.marker} ${param.dimensionNames[param.seriesIndex + 1]}: ${Math.floor(
                                        focusTime,
                                    )} h ${Math.floor((focusTime % 1) * 60)} min
                                </div>
                            `;
                    }
                });

                if (Number.isNaN(total_time)) {
                    return htmlString;
                }
                if (total_time < 1) {
                    htmlString += `<div><strong>Totale tijd: ${Math.floor(
                        total_time * 60,
                    )} min</strong></div>`;
                } else {
                    htmlString += `<div><strong>Totale tijd: ${Math.floor(
                        total_time,
                    )} h ${Math.floor((total_time % 1) * 60)} min</strong></div>`;
                }
                return htmlString;
            },
        },
    };

    let stats_graph = undefined;

    const today = DateTime.now();
    let delta_weeks = $state(0);
    const weekStart = $derived(
        today.startOf("week").minus({ weeks: delta_weeks }),
    );
    const weekEnd = $derived(today.endOf("week").minus({ weeks: delta_weeks }));

    $effect(() => {
        if (statistieken_modal && stats_context.stats.get_stats() && window) {
            if (stats_graph) {
                stats_graph.dispose();
            }

            data.color = [
                formatHex(
                    window
                        .getComputedStyle(document.body)
                        .getPropertyValue("--color-primary"),
                ),
            ];

            stats_graph = echarts.init(document.getElementById("stats"), null, {
                height: "auto",
                width: "auto",
            });

            [data.dataset.source, data.series] =
                stats_context.stats.get_week_focus_time(delta_weeks);

            stats_graph.setOption(data);
            stats_graph.resize();
        }
    });

    let stats_today = $derived(stats_context.stats.get_todayStats());
</script>

<svelte:window on:resize={() => stats_graph.resize()} />

<dialog
    bind:this={statistieken_modal}
    id="statistieken"
    class="modal overflow-y-auto"
>
    <div class="modal-box">
        <div class="flex flex-row items-center justify-between mb-2">
            <h3 class="text-lg font-bold">{m.statistics()}</h3>
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost">✕</button>
            </form>
        </div>

        {#if stats_today}
            <div class="stats text-primary shadow w-full">
                <div class="stat">
                    <div class="stat-title">{m.focus_time()}</div>
                    <div class="stat-value text-md md:text-3xl">
                        {#if stats_today?.time_focus < 3600}
                            {Math.floor(stats_today?.time_focus / 60)} min
                        {:else}
                            {Math.floor(stats_today?.time_focus / 3600)}
                            h {Math.floor(
                                (stats_today?.time_focus % 3600) / 60,
                            )} min
                        {/if}
                    </div>
                    <div class="stat-desc">{m.today()}</div>
                </div>

                <div class="stat">
                    <div class="stat-title">{m.focus_sessions()}</div>
                    <div class="stat-value">
                        {stats_today?.focus_sessions}
                    </div>
                    <div class="stat-desc">{m.today()}</div>
                </div>
            </div>
        {/if}
        <div class="w-full flex flex-col mt-5">
            <div class="flex flex-row items-center justify-between mb-2">
                <button
                    class="btn btn-xs btn-primary"
                    onclick={() => (delta_weeks += 1)}
                    ><ChevronLeft class="size-[1.5em]" /></button
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
                    onclick={() => (delta_weeks -= 1)}
                    ><ChevronRight class="size-[1.5em]" /></button
                >
            </div>
            <div id="stats" class="w-full h-[50vh]"></div>
        </div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>
