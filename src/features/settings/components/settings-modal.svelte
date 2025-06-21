<script lang="ts">
    import ThemeSample from "$features/settings/components/theme-sample.svelte";
    import { Session } from "$lib/session/session.svelte";
    import { PomoType, SessionStatus } from "$lib/session/types";
    import ArrowRightLeft from "lucide-svelte/icons/arrow-right-left";
    import Volume from "lucide-svelte/icons/volume";
    import Volume1 from "lucide-svelte/icons/volume-1";
    import Volume2 from "lucide-svelte/icons/volume-2";
    import VolumeX from "lucide-svelte/icons/volume-x";
    import Dropzone from "svelte-file-dropzone";
    import { m } from "../../../paraglide/messages";
    import { getSettingsContext } from "../context";
    import {
        set_active_theme,
        set_inactive_theme,
        set_long_break_time,
        set_pomo_time,
        set_short_break_time,
        set_tick_sound,
        set_tick_sound_volume,
        set_ui_sound_volume,
        set_ui_sounds,
    } from "../db";
    import { Theme } from "../types";

    interface Props {
        settings_modal?: HTMLDialogElement;
        session?: Session;
    }

    let { settings_modal = $bindable(), session = $bindable() }: Props = $props();

    const settings_context = getSettingsContext();

    function dump(storage: Storage) {
        let store = {};
        for (let i = 0, l = storage.length; i < l; i++) {
            let key = storage.key(i);
            store[key] = JSON.parse(storage.getItem(key));
        }
        return store;
    }

    function triggerDownload() {
        const downloadLink = document.createElement("a");
        const blob = new Blob([JSON.stringify(dump(localStorage))], {
            type: "text/plain",
        });
        const fileURL = URL.createObjectURL(blob);
        downloadLink.href = fileURL;
        downloadLink.download = "Kairos Data.json";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }

    let files = {
        accepted: [],
        rejected: [],
    };

    let uploadSuccess = $state(false);
    let uploadError = $state(false);
    let reloadTimeStamp = $state(0);
    let progressBarWidth = $state(100);

    const updateProgressBar = () => {
        progressBarWidth = Math.max(
            0,
            Math.min(100, ((reloadTimeStamp - Date.now()) / 5000) * 100),
        );

        if (progressBarWidth < 100 && reloadTimeStamp > Date.now()) {
            requestAnimationFrame(updateProgressBar);
        }

        if (progressBarWidth <= 0) {
            window.location.reload();
            progressBarWidth = 100; // Reset progress bar width after reload
        }
    };

    function handleFilesSelect(e) {
        uploadSuccess = false;
        uploadError = false;

        const { acceptedFiles, fileRejections } = e.detail;
        files.accepted = [...files.accepted, ...acceptedFiles];
        files.rejected = [...files.rejected, ...fileRejections];

        if (files.accepted.length > 0) {
            const file = files.accepted[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result as string);

                    const requiredKey = "tasks";
                    if (!data.hasOwnProperty(requiredKey)) {
                        console.error(
                            `Database upload failed, the required key "${requiredKey}" was not found.`,
                        );
                        uploadError = true;
                        return;
                    }

                    const acceptedKeys = [
                        "session",
                        "settings",
                        "history",
                        "stats",
                        "tasks",
                    ];

                    for (const key in data) {
                        if (!acceptedKeys.includes(key)) {
                            console.error(
                                `Database upload failed, the following key was not recognised: ${key}`,
                            );
                            uploadError = true;
                            return;
                        }
                    }

                    for (const key in data) {
                        localStorage.setItem(key, JSON.stringify(data[key]));
                    }

                    uploadSuccess = true;
                    reloadTimeStamp = Date.now() + 5000; // Set reload time to 5 seconds from now
                    requestAnimationFrame(updateProgressBar);
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            };
            reader.readAsText(file);
        }
    }
</script>

<dialog bind:this={settings_modal} id="settings" class="modal">
    <div class="modal-box">
        <div class="flex flex-row items-center justify-between mb-2">
            <h3 class="text-lg font-bold">{m.settings()}</h3>
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost">✕</button>
            </form>
        </div>
        <div class="tabs tabs-border">
            <input
                type="radio"
                name="settings-tabs"
                class="tab"
                aria-label={m.general()}
                checked
            />
            <div class="tab-content">
                <fieldset
                    class="fieldset bg-base-100 border-base-300 rounded-box w-full border p-4"
                >
                    <legend class="fieldset-legend">{m.focus_times()}</legend>
                    <div class="flex flex-row gap-2">
                        <div class="flex flex-col">
                            <label for="pomo" class="label"
                                >{m.pomodoro()}</label
                            >
                            <input
                                id="pomo"
                                type="number"
                                class="input"
                                placeholder="25"
                                value={settings_context.settings.pomo_time / 60}
                                onchange={(e) => {
                                    set_pomo_time(
                                        settings_context.settings,
                                        parseInt(
                                            (e.target as HTMLInputElement)
                                                .value,
                                        ) * 60,
                                    );
                                    session = new Session(
                                        PomoType.Pomo,
                                        parseInt(
                                            (e.target as HTMLInputElement)
                                                .value,
                                        ) * 60,
                                    );
                                }}
                            />
                        </div>
                        <div class="flex flex-col">
                            <label for="korte_pauze" class="label"
                                >{m.break()}</label
                            >
                            <input
                                id="korte_pauze"
                                type="number"
                                class="input"
                                placeholder="5"
                                value={settings_context.settings
                                    .short_break_time / 60}
                                onchange={(e) => {
                                    set_short_break_time(
                                        settings_context.settings,
                                        parseInt(
                                            (e.target as HTMLInputElement)
                                                .value,
                                        ) * 60,
                                    );
                                    session = new Session(
                                        PomoType.ShortBreak,
                                        parseInt(
                                            (e.target as HTMLInputElement)
                                                .value,
                                        ) * 60,
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
                                value={settings_context.settings
                                    .long_break_time / 60}
                                onchange={(e) => {
                                    set_long_break_time(
                                        settings_context.settings,
                                        parseInt(
                                            (e.target as HTMLInputElement)
                                                .value,
                                        ) * 60,
                                    );
                                    session = new Session(
                                        PomoType.LongBreak,
                                        parseInt(
                                            (e.target as HTMLInputElement)
                                                .value,
                                        ) * 60,
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
                                    set_ui_sounds(
                                        settings_context.settings,
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
                                set_ui_sound_volume(
                                    settings_context.settings,
                                    parseInt(
                                        (e.target as HTMLInputElement).value,
                                    ),
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
                                    set_tick_sound(
                                        settings_context.settings,
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
                                set_tick_sound_volume(
                                    settings_context.settings,
                                    parseInt(
                                        (e.target as HTMLInputElement).value,
                                    ),
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
                            <legend class="fieldset-legend"
                                >{m.inactive()}</legend
                            >
                            <select
                                class="select"
                                onchange={(e) => {
                                    if (
                                        session?.status != SessionStatus.Active
                                    ) {
                                        document.documentElement.setAttribute(
                                            "data-theme",
                                            e.target.value,
                                        );
                                    }

                                    set_inactive_theme(
                                        settings_context.settings,
                                        e.target.value as Theme,
                                    );
                                }}
                            >
                                {#each Object.values(Theme) as theme (theme)}
                                    <option
                                        value={theme}
                                        selected={settings_context.settings
                                            .theme_inactive == theme}
                                    >
                                        {theme}
                                    </option>
                                {/each}
                            </select>
                        </fieldset>
                        <ThemeSample
                            theme={settings_context.settings.theme_inactive}
                        />
                    </div>
                    <ArrowRightLeft class="size-[2.5em] self-center" />
                    <div class="flex flex-col gap-2 items-center">
                        <fieldset class="fieldset w-full">
                            <legend class="fieldset-legend">{m.active()}</legend
                            >
                            <select
                                class="select"
                                onchange={(e) => {
                                    if (
                                        session?.status == SessionStatus.Active
                                    ) {
                                        document.documentElement.setAttribute(
                                            "data-theme",
                                            e.target.value,
                                        );
                                    }

                                    set_active_theme(
                                        settings_context.settings,
                                        e.target.value as Theme,
                                    );
                                }}
                            >
                                {#each Object.values(Theme) as theme (theme)}
                                    <option
                                        value={theme}
                                        selected={settings_context.settings
                                            .theme_active == theme}
                                    >
                                        {theme}
                                    </option>
                                {/each}
                            </select>
                        </fieldset>

                        <ThemeSample
                            theme={settings_context.settings.theme_active}
                        />
                    </div>
                </fieldset>
            </div>

            <input
                type="radio"
                name="settings-tabs"
                class="tab"
                aria-label={m.import() + " / " + m.export()}
            />
            <div class="tab-content">
                <div class="flex flex-row justify-evenly mt-5 items-center">
                    <button
                        class="btn btn-primary"
                        onclick={() => triggerDownload()}>Exporteer data</button
                    >
                    <div class="divider divider-horizontal"></div>
                    <Dropzone
                        on:drop={handleFilesSelect}
                        accept="application/json"
                        multiple={false}
                    >
                        {#if uploadSuccess}
                            <span class="text-success"
                                >{m.database_import_success()}</span
                            >
                            <span
                                >{m.reloading_in({
                                    seconds: Math.floor(
                                        (progressBarWidth / 100) * 5,
                                    ),
                                })}</span
                            >
                            <progress
                                class="progress w-56"
                                value={progressBarWidth}
                                max="100"
                            ></progress>
                        {:else if uploadError}
                            <span class="text-error"
                                >{m.database_import_error()}</span
                            >
                        {:else}
                            <span>{m.database_import_dropzone()}</span>
                        {/if}
                    </Dropzone>
                </div>
            </div>
        </div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>
