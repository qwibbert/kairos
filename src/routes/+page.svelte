<script lang="ts">
    import Statsmodal from "$lib/components/statsmodal.svelte";
    import ThemeSample from "$lib/components/theme-sample.svelte";
    import { shortcut } from "@svelte-put/shortcut";
    import ArrowRightLeft from "lucide-svelte/icons/arrow-right-left";
    import ChartLine from "lucide-svelte/icons/chart-line";
    import Pause from "lucide-svelte/icons/pause";
    import Play from "lucide-svelte/icons/play";
    import Settings from "lucide-svelte/icons/settings";
    import SkipForward from "lucide-svelte/icons/skip-forward";
    import Volume from "lucide-svelte/icons/volume";
    import Volume1 from "lucide-svelte/icons/volume-1";
    import Volume2 from "lucide-svelte/icons/volume-2";
    import VolumeX from "lucide-svelte/icons/volume-x";
    import { onMount } from "svelte";
    import KairosLogo from "../kairos-logo.svelte";
    import {
        get_instellingen,
        restore_instellingen,
        set_active_theme,
        set_inactive_theme,
        set_korte_pauze_tijd,
        set_lange_pauze_tijd,
        set_pomo_tijd,
        set_tick_geluid,
        set_tick_geluid_volume,
        set_ui_geluiden,
        set_ui_geluiden_volume,
        Theme,
    } from "../state/instellingen.svelte";
    import { PomoType, Session, SessionStatus } from "../state/session.svelte";
    import { StatsManager } from "../state/stats.svelte";
    import "../style.css";

    let session = $state<Session>();

    let stats_manager = $state<StatsManager>();

    onMount(() => {
        restore_instellingen();

        const local_session = Session.restore_local();

        if (local_session) {
            session = local_session;

            if (session.status == SessionStatus.Active) {
                session.status = SessionStatus.Interrupted;
                session.time_end =
                    Date.now() + (session.time_aim - session.time_real) * 1000;
            }
        } else {
            session = new Session(PomoType.Pomo, get_instellingen().pomo_tijd);
        }
    });

    const reload_stats = () => {
        stats_manager = new StatsManager();
    };

    const click_geluid_url = new URL("/click.mp3", import.meta.url);

    let instellingen_modal: HTMLDialogElement;
    let statistieken_modal: HTMLDialogElement;
    let start_knop = $state<HTMLButtonElement>();

    let theme_inactive = $derived(get_instellingen().theme_inactive);
    let theme_active = $derived(get_instellingen().theme_active);

    $effect(() => {
        if (session?.status == SessionStatus.Active) {
            document.documentElement.setAttribute("data-theme", theme_active);
        } else {
            document.documentElement.setAttribute("data-theme", theme_inactive);
        }
    });
</script>

<svelte:head>
    <title>Kairos</title>
</svelte:head>

<svelte:window
    use:shortcut={{
        trigger: {
            key: " ",
            modifier: false,
            callback: () => start_knop.click(),
        },
    }}
/>

<Statsmodal bind:statistieken_modal {stats_manager} />

<dialog bind:this={instellingen_modal} id="instellingen" class="modal">
    <div class="modal-box">
        <div class="flex flex-row items-center justify-between mb-2">
            <h3 class="text-lg font-bold">Instellingen</h3>
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost">✕</button>
            </form>
        </div>
        <fieldset
            class="fieldset bg-base-100 border-base-300 rounded-box w-full border p-4"
        >
            <legend class="fieldset-legend">Focustijden</legend>
            <div class="flex flex-row gap-2">
                <div class="flex flex-col">
                    <label for="pomo" class="label">Pomodoro</label>
                    <input
                        id="pomo"
                        type="number"
                        class="input"
                        placeholder="25"
                        value={get_instellingen().pomo_tijd / 60}
                        onchange={(e) => {
                            set_pomo_tijd(
                                parseInt((e.target as HTMLInputElement).value) *
                                    60,
                            );
                            session = new Session(
                                PomoType.Pomo,
                                parseInt((e.target as HTMLInputElement).value) *
                                    60,
                            );
                        }}
                    />
                </div>
                <div class="flex flex-col">
                    <label for="korte_pauze" class="label">Korte pauze</label>
                    <input
                        id="korte_pauze"
                        type="number"
                        class="input"
                        placeholder="5"
                        value={get_instellingen().korte_pauze_tijd / 60}
                        onchange={(e) => {
                            set_korte_pauze_tijd(
                                parseInt((e.target as HTMLInputElement).value) *
                                    60,
                            );
                            session = new Session(
                                PomoType.ShortBreak,
                                parseInt((e.target as HTMLInputElement).value) *
                                    60,
                            );
                        }}
                    />
                </div>
                <div class="flex flex-col">
                    <label for="lange_pauze" class="label">Lange pauze</label>
                    <input
                        id="lange_pauze"
                        type="number"
                        class="input"
                        placeholder="15"
                        value={get_instellingen().lange_pauze_tijd / 60}
                        onchange={(e) => {
                            set_lange_pauze_tijd(
                                parseInt((e.target as HTMLInputElement).value) *
                                    60,
                            );
                            session = new Session(
                                PomoType.LongBreak,
                                parseInt((e.target as HTMLInputElement).value) *
                                    60,
                            );
                        }}
                    />
                </div>
            </div>
        </fieldset>
        <fieldset
            class="fieldset bg-base-100 border-base-300 rounded-box w-full border p-4"
        >
            <legend class="fieldset-legend">Geluid</legend>
            <div class="flex flex-row justify-evenly items-center">
                <label class="label">
                    <input
                        type="checkbox"
                        checked={get_instellingen().ui_geluiden}
                        onchange={(e) =>
                            set_ui_geluiden(
                                (e.target as HTMLInputElement).checked,
                            )}
                        class="toggle"
                    />
                    UI-geluiden
                </label>
                <button class="btn btn-primary btn-circle">
                    {#if get_instellingen().ui_geluiden && get_instellingen().ui_geluiden_volume < 25}
                        <Volume class="size-[1.2em]" />
                    {:else if get_instellingen().ui_geluiden && get_instellingen().ui_geluiden_volume >= 25 && get_instellingen().ui_geluiden_volume < 75}
                        <Volume1 class="size-[1.2em]" />
                    {:else if get_instellingen().ui_geluiden && get_instellingen().ui_geluiden_volume >= 75}
                        <Volume2 class="size-[1.2em]" />
                    {:else}
                        <VolumeX class="size-[1.2em]" />
                    {/if}
                </button>

                <input
                    disabled={!get_instellingen().ui_geluiden}
                    type="range"
                    min="0"
                    max="100"
                    onchange={(e) =>
                        set_ui_geluiden_volume(
                            parseInt((e.target as HTMLInputElement).value),
                        )}
                    value={get_instellingen().ui_geluiden_volume}
                    class="range w-[30%]"
                />
            </div>
            <div class="divider"></div>
            <div class="flex flex-row justify-evenly items-center">
                <label class="label">
                    <input
                        type="checkbox"
                        checked={get_instellingen().tick_geluid}
                        onchange={(e) =>
                            set_tick_geluid(
                                (e.target as HTMLInputElement).checked,
                            )}
                        class="toggle"
                    />
                    Tick-geluid
                </label>
                <button class="btn btn-primary btn-circle">
                    {#if get_instellingen().tick_geluid && get_instellingen().tick_geluid_volume < 25}
                        <Volume class="size-[1.2em]" />
                    {:else if get_instellingen().tick_geluid && get_instellingen().tick_geluid_volume >= 25 && get_instellingen().tick_geluid_volume < 75}
                        <Volume1 class="size-[1.2em]" />
                    {:else if get_instellingen().tick_geluid && get_instellingen().tick_geluid_volume >= 75}
                        <Volume2 class="size-[1.2em]" />
                    {:else}
                        <VolumeX class="size-[1.2em]" />
                    {/if}
                </button>
                <input
                    disabled={!get_instellingen().tick_geluid}
                    type="range"
                    min="0"
                    max="100"
                    value={get_instellingen().tick_geluid_volume}
                    onchange={(e) =>
                        set_tick_geluid_volume(
                            parseInt((e.target as HTMLInputElement).value),
                        )}
                    class="range w-[30%]"
                />
            </div>
        </fieldset>
        <fieldset
            class="fieldset flex flex-row justify-evenly bg-base-100 border-base-300 rounded-box w-full border p-4"
        >
            <legend class="fieldset-legend">Uiterlijk</legend>
            <div class="flex flex-col gap-2 items-center">
                <fieldset class="fieldset w-full">
                    <legend class="fieldset-legend">Inactief</legend>
                    <select
                        class="select"
                        onchange={(e) => {
                            if (session?.status != SessionStatus.Active) {
                                document.documentElement.setAttribute(
                                    "data-theme",
                                    e.target.value,
                                );
                            }

                            set_inactive_theme(e.target.value as Theme);
                        }}
                    >
                        {#each Object.values(Theme) as theme}
                            <option
                                value={theme}
                                selected={get_instellingen().theme_inactive ==
                                    theme}
                            >
                                {theme}
                            </option>
                        {/each}
                    </select>
                </fieldset>
                <ThemeSample theme={theme_inactive} />
            </div>
            <ArrowRightLeft class="size-[2.5em] self-center" />
            <div class="flex flex-col gap-2 items-center">
                <fieldset class="fieldset w-full">
                    <legend class="fieldset-legend">Tijdens sessie</legend>
                    <select
                        class="select"
                        onchange={(e) => {
                            if (session?.status == SessionStatus.Active) {
                                document.documentElement.setAttribute(
                                    "data-theme",
                                    e.target.value,
                                );
                            }

                            set_active_theme(e.target.value as Theme);
                        }}
                    >
                        {#each Object.values(Theme) as theme}
                            <option
                                value={theme}
                                selected={get_instellingen().theme_active ==
                                    theme}
                            >
                                {theme}
                            </option>
                        {/each}
                    </select>
                </fieldset>

                <ThemeSample theme={theme_active} />
            </div>
        </fieldset>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>

<header class="flex flex-row justify-evenly items-center mt-5">
    <div class="flex flex-row gap-2 items-center">
        <KairosLogo /><span class="text-2xl md:text-3xl xl:text-4xl text-primary font-bold">Kairos</span
        >
    </div>
    {#if session?.status != SessionStatus.Active}
        <div class="join">
            <button
                class="btn btn-soft md:btn-md join-item"
                onclick={() => {
                    reload_stats();
                    statistieken_modal.showModal();
                }}
            >
                <ChartLine class="size-[1.2em]" />
                <span class="hidden md:block">Statistieken</span>
            </button>
            <button
                class="btn btn-soft join-item"
                onclick={() => instellingen_modal.showModal()}
            >
                <Settings class="size-[1.2em]" />
                <span class="hidden md:block">Instellingen</span>
            </button>
        </div>
    {/if}
</header>
<main
    class="h-[90vh] w-[100vw] flex flex-col justify-around items-center py-10"
>
    <section class="w-full flex flex-row gap-2 justify-center rounded">
        <button
            disabled={session?.status == SessionStatus.Active}
            class={[
                "btn btn-sm md:btn-md",
                {
                    "btn-primary disabled:bg-primary":
                        session?.pomo_type == PomoType.Pomo,
                },
                { "btn-neutral": session?.pomo_type != PomoType.Pomo },
                {
                    "disabled:!bg-primary disabled:text-neutral":
                        session?.pomo_type == PomoType.Pomo,
                },
            ]}
            onclick={() => {
                if (session?.status != SessionStatus.Active) {
                    session = new Session(
                        PomoType.Pomo,
                        get_instellingen().pomo_tijd,
                    );
                }
            }}
        >
            Pomodoro
        </button>
        <button
            disabled={session?.status == SessionStatus.Active}
            class={[
                "btn btn-sm md:btn-md",
                { "btn-primary": session?.pomo_type == PomoType.ShortBreak },
                { "btn-neutral": session?.pomo_type != PomoType.ShortBreak },
                {
                    "disabled:!bg-primary disabled:text-neutral":
                        session?.pomo_type == PomoType.ShortBreak,
                },
            ]}
            onclick={() => {
                if (session?.status != SessionStatus.Active) {
                    session = new Session(
                        PomoType.ShortBreak,
                        get_instellingen().korte_pauze_tijd,
                    );
                }
            }}
        >
            Pauze
        </button>
        <button
            disabled={session?.status == SessionStatus.Active}
            class={[
                "btn btn-sm md:btn-md",
                { "btn-primary": session?.pomo_type == PomoType.LongBreak },
                { "btn-neutral": session?.pomo_type != PomoType.LongBreak },
                {
                    "disabled:!bg-primary disabled:text-neutral":
                        session?.pomo_type == PomoType.LongBreak,
                },
            ]}
            onclick={() => {
                if (session?.status != SessionStatus.Active) {
                    session = new Session(
                        PomoType.LongBreak,
                        get_instellingen().lange_pauze_tijd,
                    );
                }
            }}
        >
            Lange pauze
        </button>
    </section>
    <section>
        <span class="countdown font-mono text-8xl rounded w-full">
            {#if session}
                <span
                    style={`--value:${session.minutes};`}
                    aria-live="polite"
                    aria-label={session.minutes}>{session.minutes}</span
                >
                :
                <span
                    style={`--value:${session.seconds};`}
                    aria-live="polite"
                    aria-label={session.seconds}>{session.seconds}</span
                >
            {/if}
        </span>
    </section>
    <section class="flex flex-row gap-2 justify-center">
        {#if session}
            {#if session.status == SessionStatus.Active}
                <button
                    bind:this={start_knop}
                    class="btn btn-primary btn-wide btn-sm md:btn-md"
                    onclick={() => session?.pause()}
                >
                    <Pause class="size-[1.2em]" />
                    Pauzeer
                </button>
                <button
                    class="btn btn-secondary btn-sm md:btn-md"
                    onclick={() => session?.skip()}
                    ><SkipForward class="size-[1.2em]" />Sla over</button
                >
            {:else if session.status == SessionStatus.Paused}
                <button
                    bind:this={start_knop}
                    class="btn btn-primary btn-wide btn-sm md:btn-md"
                    onclick={() => session?.start()}
                >
                    <Play class="size-[1.2em]" />
                    Hervat</button
                >
                <button
                    class="btn btn-secondary btn-sm md:btn-md"
                    onclick={() => session?.skip()}
                    ><SkipForward class="size-[1.2em]" /> Sla over</button
                >
            {:else}
                <button
                    bind:this={start_knop}
                    class="btn btn-primary btn-wide btn-sm md:btn-md"
                    onclick={() => session?.start()}
                    ><Play class="size-[1.2em]" />Start</button
                >
            {/if}
        {/if}
    </section>
</main>
