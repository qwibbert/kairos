<script lang="ts">
    import "$components/style.css";
    import KairosLogo from "$components/ui/kairos-logo.svelte";
    import SettingsModal from "$features/settings/components/settings-modal.svelte";
    import { setSettingsContext } from "$features/settings/context";
    import { DEFAULT_SETTINGS, retrieve_settings } from "$features/settings/db";
    import type { SettingsContext } from "$features/settings/types";
    import Statsmodal from "$features/stats/components/stats-modal.svelte";
    import { setStatsContext } from "$features/stats/context";
    import { StatsManager } from "$features/stats/db.svelte";
    import Taskmodal from "$features/tasks/components/task-modal.svelte";
    import { setTaskContext } from "$features/tasks/context";
    import { ensure_no_task_exists, retrieve_active_task, retrieve_all_tasks } from "$features/tasks/db";
    import type { TasksContext } from "$features/tasks/types";
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
    import * as m from "../lib/paraglide/messages";

    // Initialize state
    let session = $state<Session>();
    
    let settings_context = $state<SettingsContext>({settings: DEFAULT_SETTINGS});
    let task_context = $state<TasksContext>({
        tasks: [],
        active_task: 'NO_TASK',
    });
    let stats_context = $state({
        stats: new StatsManager()
    });
    setContext("session", () => session);
    setSettingsContext(settings_context);
    setTaskContext(task_context);
    setStatsContext(stats_context);

    onMount(async () => {
        console.debug("App mounted, restoring state...");
        const local_session = Session.restore_local();

        task_context.tasks = await retrieve_all_tasks();
        ensure_no_task_exists(task_context.tasks);
        task_context.active_task = retrieve_active_task(task_context.tasks);

        settings_context.settings = retrieve_settings();

        stats_context.stats.load();

        console.debug("State restored.");

        if (local_session) {
            console.debug(
                "Restored session from local storage:",
                local_session.uuid,
            );
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
            session = new Session(PomoType.Pomo, settings_context.settings.pomo_time);
        }
    });

    let settings_modal = $state<HTMLDialogElement>();
    let statistieken_modal = $state<HTMLDialogElement>();
    let taskselector_modal = $state<HTMLDialogElement>();
    let start_knop = $state<HTMLButtonElement>();

    let theme_inactive = $derived(settings_context.settings.theme_inactive);
    let theme_active = $derived(settings_context.settings.theme_active);

    $effect(() => {
        if (session?.status == SessionStatus.Active) {
            console.debug("Switch theme to active:", theme_active);
            document.documentElement.setAttribute("data-theme", theme_active);
        } else {
            console.debug("Switch theme to inactive:", theme_inactive);
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
            callback: () =>
                settings_modal?.open ||
                statistieken_modal?.open ||
                taskselector_modal?.open
                    ? null
                    : start_knop?.click(),
        },
    }}
/>

<Statsmodal bind:statistieken_modal />
<Taskmodal bind:taskselector_modal />
<SettingsModal bind:settings_modal {session} />


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
        onclick={() => {
            // Check if there is already an active session with a non-zero time_real
            // If so, skip this session
            if (session && session.time_real != 0) {
                session.skip(settings_context, stats_context, task_context);
            }

            // If there is no active session or time_real is zero, start a new session
            session = new Session(
                type,
                type == PomoType.Pomo
                    ? settings_context.settings.pomo_time
                    : type == PomoType.ShortBreak
                      ? settings_context.settings.short_break_time
                      : settings_context.settings.long_break_time,
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
                onclick={() => taskselector_modal?.showModal()}
            >
                <SquareCheck class="size-[1.2em]" />
                <span class="hidden md:block">Taken</span>
            </button>
            <button
                class="btn btn-soft md:btn-md join-item"
                onclick={() => statistieken_modal?.showModal()}
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
        {#if session?.task_id != "NO_TASK" && task_context.active_task}
            {@const active_task = task_context.tasks.find(
                (task) => task.id == task_context.active_task,
            )}
            <span class="btn btn-primary btn-sm">
                <SquareCheck class="size-[1.2em]"/>{active_task?.title}
            </span>
        {:else}
            <span class="btn btn-primary btn-sm"> <Square class="size-[1.2em]"/>Geen taak</span>
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
                    onclick={() => session?.pause(settings_context, stats_context, task_context)}
                >
                    <Pause class="size-[1.2em]" />
                    {m.pause()}
                </button>
                <button
                    class="btn btn-secondary btn-sm md:btn-md"
                    onclick={() => session?.skip(settings_context, stats_context, task_context)}
                    ><SkipForward class="size-[1.2em]" />{m.skip()}</button
                >
            {:else if session.status == SessionStatus.Paused}
                <button
                    bind:this={start_knop}
                    class="btn btn-primary btn-wide btn-sm md:btn-md"
                    onclick={() => session?.start(settings_context, stats_context, task_context)}
                >
                    <Play class="size-[1.2em]" />
                    {m.resume()}</button
                >
                <button
                    class="btn btn-secondary btn-sm md:btn-md"
                    onclick={() => session?.skip(settings_context, stats_context, task_context)}
                    ><SkipForward class="size-[1.2em]" /> {m.skip()}</button
                >
            {:else}
                <button
                    bind:this={start_knop}
                    class="btn btn-primary btn-wide btn-sm md:btn-md"
                    onclick={() => session?.start(settings_context, stats_context, task_context)}
                    ><Play class="size-[1.2em]" />{m.start()}</button
                >
            {/if}
        {/if}
    </section>
</main>
