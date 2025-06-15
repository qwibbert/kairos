<script lang="ts">
    import ThemeSample from "$features/settings/components/theme-sample.svelte";
    import { Session } from "$lib/session/session.svelte";
    import { PomoType, SessionStatus } from "$lib/session/types";
    import ArrowRightLeft from "lucide-svelte/icons/arrow-right-left";
    import Volume from "lucide-svelte/icons/volume";
    import Volume1 from "lucide-svelte/icons/volume-1";
    import Volume2 from "lucide-svelte/icons/volume-2";
    import VolumeX from "lucide-svelte/icons/volume-x";
    import { m } from "../../../paraglide/messages";
    import { getSettingsContext } from "../context";
    import { set_active_theme, set_inactive_theme, set_long_break_time, set_pomo_time, set_short_break_time, set_tick_sound, set_tick_sound_volume, set_ui_sound_volume, set_ui_sounds } from "../db";
    import { Theme } from "../types";

    interface Props {
        settings_modal?: HTMLDialogElement;
        session?: Session;
    }

    let { settings_modal = $bindable(), session }: Props = $props();

    const settings_context = getSettingsContext();
</script>


<dialog bind:this={settings_modal} id="settings" class="modal">
    <div class="modal-box">
        <div class="flex flex-row items-center justify-between mb-2">
            <h3 class="text-lg font-bold">{m.settings()}</h3>
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost">✕</button>
            </form>
        </div>
        <fieldset
            class="fieldset bg-base-100 border-base-300 rounded-box w-full border p-4"
        >
            <legend class="fieldset-legend">{m.focus_times()}</legend>
            <div class="flex flex-row gap-2">
                <div class="flex flex-col">
                    <label for="pomo" class="label">{m.pomodoro()}</label>
                    <input
                        id="pomo"
                        type="number"
                        class="input"
                        placeholder="25"
                        value={settings_context.settings.pomo_time / 60}
                        onchange={(e) => {
                            set_pomo_time(settings_context.settings,
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
                    <label for="korte_pauze" class="label">{m.break()}</label>
                    <input
                        id="korte_pauze"
                        type="number"
                        class="input"
                        placeholder="5"
                        value={settings_context.settings.short_break_time / 60}
                        onchange={(e) => {
                            set_short_break_time(settings_context.settings,
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
                    <label for="lange_pauze" class="label"
                        >{m.long_break()}</label
                    >
                    <input
                        id="lange_pauze"
                        type="number"
                        class="input"
                        placeholder="15"
                        value={settings_context.settings.long_break_time / 60}
                        onchange={(e) => {
                            set_long_break_time(settings_context.settings,
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
            <legend class="fieldset-legend">{m.sound()}</legend>
            <div class="flex flex-row justify-evenly items-center">
                <label class="label">
                    <input
                        type="checkbox"
                        checked={settings_context.settings.ui_sounds}
                        onchange={(e) =>
                            set_ui_sounds(settings_context.settings,
                                (e.target as HTMLInputElement).checked,
                            )}
                        class="toggle"
                    />
                    {m.ui_sounds()}
                </label>
                <button class="btn btn-primary btn-circle">
                    {#if settings_context.settings.ui_sounds && settings_context.settings.ui_sounds_volume < 25}
                        <Volume class="size-[1.2em]" />
                    {:else if settings_context.settings.ui_sounds && settings_context.settings.ui_sounds_volume >= 25 && settings_context.settings.ui_sounds_volume < 75}
                        <Volume1 class="size-[1.2em]" />
                    {:else if settings_context.settings.ui_sounds && settings_context.settings.ui_sounds_volume >= 75}
                        <Volume2 class="size-[1.2em]" />
                    {:else}
                        <VolumeX class="size-[1.2em]" />
                    {/if}
                </button>

                <input
                    disabled={!settings_context.settings.ui_sounds}
                    type="range"
                    min="0"
                    max="100"
                    onchange={(e) =>
                        set_ui_sound_volume(settings_context.settings,
                            parseInt((e.target as HTMLInputElement).value),
                        )}
                    value={settings_context.settings.ui_sounds_volume}
                    class="range w-[30%]"
                />
            </div>
            <div class="divider"></div>
            <div class="flex flex-row justify-evenly items-center">
                <label class="label">
                    <input
                        type="checkbox"
                        checked={settings_context.settings.tick_sound}
                        onchange={(e) =>
                            set_tick_sound(settings_context.settings,
                                (e.target as HTMLInputElement).checked,
                            )}
                        class="toggle"
                    />
                    {m.tick_sound()}
                </label>
                <button class="btn btn-primary btn-circle">
                    {#if settings_context.settings.tick_sound && settings_context.settings.tick_sound_volume < 25}
                        <Volume class="size-[1.2em]" />
                    {:else if settings_context.settings.tick_sound && settings_context.settings.tick_sound_volume >= 25 && settings_context.settings.tick_sound_volume < 75}
                        <Volume1 class="size-[1.2em]" />
                    {:else if settings_context.settings.tick_sound && settings_context.settings.tick_sound_volume >= 75}
                        <Volume2 class="size-[1.2em]" />
                    {:else}
                        <VolumeX class="size-[1.2em]" />
                    {/if}
                </button>
                <input
                    disabled={!settings_context.settings.tick_sound}
                    type="range"
                    min="0"
                    max="100"
                    value={settings_context.settings.tick_sound_volume}
                    onchange={(e) =>
                        set_tick_sound_volume(settings_context.settings,
                            parseInt((e.target as HTMLInputElement).value),
                        )}
                    class="range w-[30%]"
                />
            </div>
        </fieldset>
        <fieldset
            class="fieldset flex flex-row justify-evenly bg-base-100 border-base-300 rounded-box w-full border p-4"
        >
            <legend class="fieldset-legend">{m.appearance()}</legend>
            <div class="flex flex-col gap-2 items-center">
                <fieldset class="fieldset w-full">
                    <legend class="fieldset-legend">{m.inactive()}</legend>
                    <select
                        class="select"
                        onchange={(e) => {
                            if (session?.status != SessionStatus.Active) {
                                document.documentElement.setAttribute(
                                    "data-theme",
                                    e.target.value,
                                );
                            }

                            set_inactive_theme(settings_context.settings, e.target.value as Theme);
                        }}
                    >
                        {#each Object.values(Theme) as theme (theme)}
                            <option
                                value={theme}
                                selected={settings_context.settings.theme_inactive ==
                                    theme}
                            >
                                {theme}
                            </option>
                        {/each}
                    </select>
                </fieldset>
                <ThemeSample theme={settings_context.settings.theme_inactive} />
            </div>
            <ArrowRightLeft class="size-[2.5em] self-center" />
            <div class="flex flex-col gap-2 items-center">
                <fieldset class="fieldset w-full">
                    <legend class="fieldset-legend">{m.active()}</legend>
                    <select
                        class="select"
                        onchange={(e) => {
                            if (session?.status == SessionStatus.Active) {
                                document.documentElement.setAttribute(
                                    "data-theme",
                                    e.target.value,
                                );
                            }

                            set_active_theme(settings_context.settings, e.target.value as Theme);
                        }}
                    >
                        {#each Object.values(Theme) as theme (theme)}
                            <option
                                value={theme}
                                selected={settings_context.settings.theme_active ==
                                    theme}
                            >
                                {theme}
                            </option>
                        {/each}
                    </select>
                </fieldset>

                <ThemeSample theme={settings_context.settings.theme_active} />
            </div>
        </fieldset>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>