<script lang="ts">
    import { PomoType, SessionStatus } from "$lib/session/types";
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
    import { onMount } from "svelte";
    import { db } from "../../../db/db";
    import { stateQuery } from "../../../db/reactivity_helper.svelte";
    import { get_setting, SettingsKey } from "../../../db/settings";
    import { m } from "../../../paraglide/messages";
    import { get_stats_day, get_stats_week_echarts } from "../data";
    import { week_graph_options } from "../week-graph-options";

    interface Props {
        stats_modal?: HTMLDialogElement;
    }

    let { stats_modal = $bindable() }: Props = $props();

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

    let theme = $state<string | null>(null);

    const today = DateTime.now();
    let delta_weeks = $state(0);
    const weekStart = $derived(
        today.startOf("week").minus({ weeks: delta_weeks }),
    );
    const weekEnd = $derived(today.endOf("week").minus({ weeks: delta_weeks }));

    let time_today = $state(0);

    let stats_graph = $state<echarts.EChartsType | undefined>(undefined);

    const tasks_query = stateQuery(
        async () =>
            db.history.where("status").equals(SessionStatus.Active).toArray(),
        () => [],
    );
    const active_session = $derived(tasks_query.current);

    const sessions_today_query = stateQuery(
        async () =>
            db.history
                .where("date_finished")
                .between(
                    DateTime.now().startOf("day").toJSDate(),
                    DateTime.now().endOf("day").toJSDate(),
                )
                .count(),
        () => [],
    );
    const sessions_today = $derived(sessions_today_query.current);

    const theme_inactive_query = stateQuery(
        async () => get_setting(SettingsKey.theme_inactive),
        () => [],
    );
    const theme_inactive = $derived(theme_inactive_query.current);

    $effect(() => {
        if (theme && stats_graph && active_session?.length == 0) {
            load_week_graph();
            get_stats_day(today, PomoType.Pomo).then((stats) => {
                time_today =
                    stats.no_task +
                    stats.per_task.reduce((time, task) => time + task.time, 0);
            });
        }
    });

    onMount(() => {
        load_week_graph();
        get_stats_day(today, PomoType.Pomo).then((stats) => {
            time_today =
                stats.no_task +
                stats.per_task.reduce((time, task) => time + task.time, 0);
        });
    });

    $effect(() => {
        get_stats_week_echarts(
            today.minus({ weeks: delta_weeks }),
            PomoType.Pomo,
        ).then(([source, series, legend]) => {
            week_graph_options.dataset.source = source;
            week_graph_options.series = series;
            week_graph_options.legend.data = legend;

            stats_graph?.setOption(week_graph_options);
        });
    });

    $effect(() => {
        if (theme_inactive && stats_graph && window) {
            const style = window.getComputedStyle(document.body);

            week_graph_options.legend.textStyle.color = formatHex(style.getPropertyValue("--color-base-content")) ?? '#333';
            week_graph_options.color = [
                formatHex(style.getPropertyValue("--color-primary")),
                formatHex(style.getPropertyValue("--color-secondary")),
                formatHex(style.getPropertyValue("--color-accent")),
                formatHex(style.getPropertyValue("--color-accent")),
                formatHex(style.getPropertyValue("--color-accent-content")),
                formatHex(style.getPropertyValue("--color-info")),
                formatHex(style.getPropertyValue("--color-info-content")),
                formatHex(style.getPropertyValue("--color-success")),
                formatHex(style.getPropertyValue("--color-success-content")),
                formatHex(style.getPropertyValue("--color-warning")),
                formatHex(style.getPropertyValue("--color-warning-content")),
                formatHex(style.getPropertyValue("--color-error")),
                formatHex(style.getPropertyValue("--color-error-content")),
            ] as string[];
            stats_graph?.setOption(week_graph_options);
        }
    });

    async function load_week_graph() {
        const style = window.getComputedStyle(document.body);

        const colors = [
            formatHex(style.getPropertyValue("--color-primary")),
            formatHex(style.getPropertyValue("--color-secondary")),
            formatHex(style.getPropertyValue("--color-accent")),
            formatHex(style.getPropertyValue("--color-accent")),
            formatHex(style.getPropertyValue("--color-accent-content")),
            formatHex(style.getPropertyValue("--color-info")),
            formatHex(style.getPropertyValue("--color-info-content")),
            formatHex(style.getPropertyValue("--color-success")),
            formatHex(style.getPropertyValue("--color-success-content")),
            formatHex(style.getPropertyValue("--color-warning")),
            formatHex(style.getPropertyValue("--color-warning-content")),
            formatHex(style.getPropertyValue("--color-error")),
            formatHex(style.getPropertyValue("--color-error-content")),
        ] as string[];

        week_graph_options.color = colors;

        if (!stats_graph) {
            stats_graph = echarts.init(
                document.getElementById("week_stats_graph"),
                null,
                {
                    height: "auto",
                    width: "auto",
                },
            );
        }

        [
            week_graph_options.dataset.source,
            week_graph_options.series,
            week_graph_options.legend.data,
        ] = await get_stats_week_echarts(
            today.minus({ weeks: delta_weeks }),
            PomoType.Pomo,
        );

        stats_graph.setOption(week_graph_options);
        stats_graph.resize();
    }
</script>

<svelte:window on:resize={async () => await load_week_graph()} />

<dialog bind:this={stats_modal} id="stats" class="modal overflow-y-auto">
    <div class="modal-box">
        <div class="flex flex-row items-center justify-between mb-2">
            <h3 class="text-lg font-bold">{m.statistics()}</h3>
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost">✕</button>
            </form>
        </div>

        <div class="stats text-primary shadow w-full">
            <div class="stat">
                <div class="stat-title">{m.focus_time()}</div>
                <div class="stat-value text-md md:text-3xl">
                    {#if time_today < 3600}
                        {Math.floor(time_today / 60)} min
                    {:else}
                        {Math.floor(time_today / 3600)}
                        h {Math.floor((time_today % 3600) / 60)} min
                    {/if}
                </div>
                <div class="stat-desc">{m.today()}</div>
            </div>

            <div class="stat">
                <div class="stat-title">{m.focus_sessions()}</div>
                <div class="stat-value">{sessions_today ?? 0}</div>
                <div class="stat-desc">{m.today()}</div>
            </div>
        </div>

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
            <div id="week_stats_graph" class="w-full h-[50vh]"></div>
        </div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>
