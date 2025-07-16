<script lang="ts">
    import { PomoType } from "$lib/session/types";
    import { formatHex } from "culori";
    import * as echarts from "echarts/core";
    import ChevronLeft from "lucide-svelte/icons/chevron-left";
    import ChevronRight from "lucide-svelte/icons/chevron-right";
    import { DateTime } from "luxon";
    import { Vine } from "../../../db/appdb";
    import {
        get_day_histogram_echarts,
        get_year_histogram_echarts,
    } from "../data";
    import { vine_day_options, vine_year_options } from "../graph-options";

    interface Props {
        vine_stats_modal?: HTMLDialogElement;
        vine: Vine | undefined;
    }

    let { vine_stats_modal = $bindable(), vine = $bindable() }: Props =
        $props();

    let view = $state<"DAY" | "YEAR">("DAY");
    const today = DateTime.now();
    let delta_weeks = $state(0);
    let delta_years = $state(0);
    const weekStart = $derived(
        today.startOf("week").minus({ weeks: delta_weeks }),
    );
    const weekEnd = $derived(today.endOf("week").minus({ weeks: delta_weeks }));

    let time_today = $state(0);

    let histogram = $state<echarts.EChartsType | undefined>(undefined);

    $effect(() => {
        if (vine && view == "DAY" && delta_weeks >= 0) {
            load_histogram();
        } else if (vine && view == "YEAR" && delta_years >= 0) {
            load_histogram();
        }
    });

    $effect(() => {
        if (vine) {
            load_histogram();
        }
    })
    function load_colors() {
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

        vine_day_options.color = colors;
        vine_year_options.color = colors;
        vine_day_options.tooltip.backgroundColor =
            style.getPropertyValue("--color-base-100");
        vine_year_options.tooltip.backgroundColor =
            style.getPropertyValue("--color-base-200");
        vine_day_options.tooltip.borderColor = style.getPropertyValue(
            "--color-base-content",
        );
        vine_year_options.tooltip.borderColor = style.getPropertyValue(
            "--color-base-content",
        );
        vine_day_options.tooltip.textStyle.color = style.getPropertyValue(
            "--color-base-content",
        );
        vine_year_options.tooltip.textStyle.color = style.getPropertyValue(
            "--color-base-content",
        );
        vine_day_options.legend.textStyle.color = style.getPropertyValue(
            "--color-base-content",
        );
        vine_year_options.legend.textStyle.color = style.getPropertyValue(
            "--color-base-content",
        );
        vine_day_options.xAxis.axisLine.lineStyle.color = style.getPropertyValue(
            "--color-base-content",
        );
        vine_year_options.xAxis.axisLine.lineStyle.color = style.getPropertyValue(
            "--color-base-content",
        );
        vine_day_options.yAxis.splitLine.lineStyle.color = style.getPropertyValue(
            "--color-base-content",
        );
        vine_year_options.yAxis.splitLine.lineStyle.color = style.getPropertyValue(
            "--color-base-content",
        );
        vine_day_options.yAxis.axisLabel.textStyle.color = style.getPropertyValue(
            "--color-base-content",
        );
        vine_year_options.yAxis.axisLabel.textStyle.color = style.getPropertyValue(
            "--color-base-content",
        );
        vine_day_options.yAxis.nameTextStyle.color = style.getPropertyValue(
            "--color-base-content",
        );
        vine_year_options.yAxis.nameTextStyle.color = style.getPropertyValue(
            "--color-base-content",
        );

        if (view == "DAY") {
            histogram?.setOption(vine_day_options);
        } else if (view == "YEAR") {
            histogram?.setOption(vine_year_options);
        }
    }

    async function load_histogram() {
        histogram?.clear();
        if (!histogram) {
            histogram = echarts.init(
                document.getElementById("vine_histogram"),
                null,
                {
                    height: "auto",
                    width: "auto",
                },
            );
        }

        if (view == "DAY") {
            [
                vine_day_options.dataset.source,
                vine_day_options.series,
                vine_day_options.legend.data,
            ] = await get_day_histogram_echarts(
                today.minus({ weeks: delta_weeks }),
                PomoType.Pomo,
                vine?.id,
            );
        } else if (view == "YEAR") {
            [
                vine_year_options.dataset.source,
                vine_year_options.series,
                vine_year_options.legend.data,
            ] = await get_year_histogram_echarts(
                today.startOf("year").minus({ years: delta_years }),
                PomoType.Pomo,
                vine?.id,
            );
        }

        load_colors();
        histogram.resize();
    }
</script>

<svelte:window on:resize={() => histogram?.resize()} />

<dialog bind:this={vine_stats_modal} class="modal">
    <div class="modal-box flex flex-col items-center">
        <form method="dialog">
            <button
                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >✕</button
            >
        </form>
        <h3 class="text-lg font-bold self-baseline">{vine?.title}</h3>
        <div class="flex flex-col mt-5 items-center gap-3 w-full">
            <select bind:value={view} class="select">
                <option value="DAY">Day view</option>
                <option value="YEAR">Year view</option>
            </select>
            <div class="flex flex-row items-center justify-between mb-2 w-full">
                <button
                    class="btn btn-xs btn-primary"
                    onclick={() =>
                        view == "DAY" ? (delta_weeks += 1) : (delta_years += 1)}
                    ><ChevronLeft class="size-[1.5em]" /></button
                >
                {#if weekStart && weekEnd && view == "DAY"}
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
                {:else if view == "YEAR"}
                    <span class="mx-2 text-sm">
                        {today.minus({ years: delta_years }).year}
                    </span>
                {/if}
                <button
                    class="btn btn-xs btn-primary"
                    disabled={view == "DAY"
                        ? delta_weeks <= 0
                        : view == "YEAR"
                          ? delta_years <= 0
                          : true}
                    onclick={() =>
                        view == "DAY" ? (delta_weeks -= 1) : (delta_years -= 1)}
                    ><ChevronRight class="size-[1.5em]" /></button
                >
            </div>

            <div id="vine_histogram" class="w-full h-[50vh]"></div>
        </div>
    </div>
</dialog>
