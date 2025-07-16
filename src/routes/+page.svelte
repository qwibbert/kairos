<script lang="ts">
    import "$components/style.css";
    import KairosLogo from "$components/ui/kairos-logo.svelte";
    import SettingsModal from "$features/settings/components/settings-modal.svelte";
    import Statsmodal from "$features/stats/components/stats-modal.svelte";
    import VineModal from "$features/vines/components/vine-modal.svelte";
    import { VineStatus } from "$features/vines/types";
    import { Session } from "$lib/session/session.svelte";
    import { PomoType, SessionStatus } from "$lib/session/types";
    import { shortcut } from "@svelte-put/shortcut";
    import ChartLine from "lucide-svelte/icons/chart-line";
    import Pause from "lucide-svelte/icons/pause";
    import Play from "lucide-svelte/icons/play";
    import Settings from "lucide-svelte/icons/settings";
    import SkipForward from "lucide-svelte/icons/skip-forward";
    import Square from "lucide-svelte/icons/square";
    import SquareCheck from "lucide-svelte/icons/square-check";
    import { onMount, setContext } from "svelte";
    import VinesIcon from '../components/ui/vines-icon.svelte';
    import { db } from "../db/db";
    import { restore_session_from_history } from "../db/history";
    import { stateQuery } from "../db/reactivity_helper.svelte";
    import { get_setting, SettingsKey } from "../db/settings";
    import * as m from "../paraglide/messages";

    // Retrieve settings
    const pomo_time_query = stateQuery(
        async () => get_setting(SettingsKey.pomo_time),
        () => [],
    );
    const short_break_query = stateQuery(
        async () => get_setting(SettingsKey.short_break_time),
        () => [],
    );
    const long_break_query = stateQuery(
        async () => get_setting(SettingsKey.long_break_time),
        () => [],
    );
    const theme_active_query = stateQuery(
        async () => get_setting(SettingsKey.theme_active),
        () => [],
    );
    const theme_inactive_query = stateQuery(
        async () => get_setting(SettingsKey.theme_inactive),
        () => [],
    );
    const pomo_time = $derived(pomo_time_query.current);
    const short_break_time = $derived(short_break_query.current);
    const long_break_time = $derived(long_break_query.current);
    const theme_active = $derived(theme_active_query.current);
    const theme_inactive = $derived(theme_inactive_query.current);

    const vines_query = stateQuery(
        async () => db.vines.where("archived").equals(0).toArray(),
        () => [],
    );
    const vines = $derived(vines_query.current);
    const active_vine = $derived(
        vines?.find((vine) => vine.status == VineStatus.Active),
    );

    // Initialize state
    let session = $state<Session>();

    setContext("session", () => session);

    onMount(async () => {
        console.debug("App mounted, restoring state...");
        const local_session = await restore_session_from_history();

        console.debug("State restored.");

        if (local_session) {
            console.debug("Restored session from history:", local_session.uuid);
            session = local_session;

            if (session.status == SessionStatus.Active) {
                console.debug(
                    "Session was previously active, correcting time_end.",
                );
                session.status = SessionStatus.Interrupted;
                session.time_end =
                    Date.now() + (session.time_aim - session.time_real) * 1000;
            }
        } else {
            console.debug("No previous session found, starting a new one.");

            session = new Session(
                PomoType.Pomo,
                (await get_setting(SettingsKey.pomo_time)) as number,
            );
        }
    });

    let settings_modal = $state<HTMLDialogElement>();
    let stats_modal = $state<HTMLDialogElement>();
    let vineselector_modal = $state<HTMLDialogElement>();
    let start_knop = $state<HTMLButtonElement>();

    $effect(() => {
        if (theme_active && theme_inactive) {
            if (session?.status == SessionStatus.Active) {
                console.debug("Switch theme to active:", theme_active);
                document.documentElement.setAttribute(
                    "data-theme",
                    theme_active as string,
                );
            } else {
                console.debug("Switch theme to inactive:", theme_inactive);
                document.documentElement.setAttribute(
                    "data-theme",
                    theme_inactive as string,
                );
            }
        }
    });

    // Update session vine_id when the active vine changes
    $effect(() => {
        if (session && session.vine_id != active_vine) {
            session.switch_vine(active_vine?.id ?? undefined);
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
            callback: () =>
                settings_modal?.open ||
                stats_modal?.open ||
                vineselector_modal?.open
                    ? null
                    : start_knop?.click(),
        },
    }}
/>

<Statsmodal bind:stats_modal />
<VineModal bind:vineselector_modal {vines} />
<SettingsModal bind:settings_modal bind:session />

{#snippet type_control(type: PomoType)}
    <button
        disabled={session?.status == SessionStatus.Active}
        class={[
            "btn btn-sm md:btn-md",
            {
                "btn-primary disabled:bg-primary": session?.pomo_type == type,
            },
            { "btn-neutral": session?.pomo_type != type },
            {
                "disabled:!bg-primary disabled:text-neutral":
                    session?.pomo_type == type,
            },
        ]}
        onclick={async () => {
            // Check if there is already an active session with a non-zero time_real
            // If so, skip this session
            if (session && session.time_real != 0) {
                await session.skip();
            }

            // If there is no active session or time_real is zero, start a new session
            session = new Session(
                type,
                type == PomoType.Pomo
                    ? (pomo_time as number)
                    : type == PomoType.ShortBreak
                      ? (short_break_time as number)
                      : (long_break_time as number),
            );
        }}
    >
        {#if type == PomoType.Pomo}
            {m.pomodoro()}
        {:else if type == PomoType.ShortBreak}
            {m.break()}
        {:else}
            {m.long_break()}
        {/if}</button
    >
{/snippet}

<header class="flex flex-row justify-evenly items-center mt-5">
    <div class="flex flex-row gap-2 items-center">
        <KairosLogo /><span
            class="text-2xl md:text-3xl xl:text-4xl text-primary font-bold"
            >Kairos</span
        >
    </div>
    {#if session?.status != SessionStatus.Active}
        <div class="join">
            <button
                class="btn btn-soft md:btn-md join-item"
                onclick={() => vineselector_modal?.showModal()}
            >
                <VinesIcon styles={['size-[2.5em]']} />
                <span class="hidden md:block">{m.vines()}</span>
            </button>
            <button
                class="btn btn-soft md:btn-md join-item"
                onclick={() => stats_modal?.showModal()}
            >
                <ChartLine class="size-[1.2em]" />
                <span class="hidden md:block">{m.statistics()}</span>
            </button>
            <button
                class="btn btn-soft join-item"
                onclick={() => settings_modal?.showModal()}
            >
                <Settings class="size-[1.2em]" />
                <span class="hidden md:block">{m.settings()}</span>
            </button>
        </div>
    {/if}
</header>
<main
    class="h-[90vh] w-[100vw] flex flex-col justify-around items-center py-10"
>
    <section class="flex flex-col gap-5 items-center">
        <div class="flex flex-row justify-center gap-2">
            {@render type_control(PomoType.Pomo)}
            {@render type_control(PomoType.ShortBreak)}
            {@render type_control(PomoType.LongBreak)}
        </div>
        {#if active_vine}
            <span class="btn btn-primary btn-sm">
                <SquareCheck class="size-[1.2em]" />{active_vine.title}
            </span>
        {:else}
            <span class="btn btn-primary btn-sm">
                <Square class="size-[1.2em]" />Geen taak</span
            >
        {/if}
    </section>
    <section>
        <span class="countdown font-mono text-8xl rounded w-full">
            {#if session}
                <span
                    style={`--value:${session.minutes};`}
                    aria-live="polite"
                    aria-label={`${session.minutes}`}>{session.minutes}</span
                >
                :
                <span
                    style={`--value:${session.seconds};`}
                    aria-live="polite"
                    aria-label={`${session.seconds}`}>{session.seconds}</span
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
                    onclick={async () => await session?.pause()}
                >
                    <Pause class="size-[1.2em]" />
                    {m.pause()}
                </button>
                <button
                    class="btn btn-secondary btn-sm md:btn-md"
                    onclick={async () => await session?.skip()}
                    ><SkipForward class="size-[1.2em]" />{m.skip()}</button
                >
            {:else if session.status == SessionStatus.Paused}
                <button
                    bind:this={start_knop}
                    class="btn btn-primary btn-wide btn-sm md:btn-md"
                    onclick={async () => await session?.start()}
                >
                    <Play class="size-[1.2em]" />
                    {m.resume()}</button
                >
                <button
                    class="btn btn-secondary btn-sm md:btn-md"
                    onclick={async () => await session?.skip()}
                    ><SkipForward class="size-[1.2em]" /> {m.skip()}</button
                >
            {:else}
                <button
                    bind:this={start_knop}
                    class="btn btn-primary btn-wide btn-sm md:btn-md"
                    onclick={async () => await session?.start()}
                    ><Play class="size-[1.2em]" />{m.start()}</button
                >
            {/if}
        {/if}
    </section>
</main>
