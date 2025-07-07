<script lang="ts">
    import ThemeSample from "$features/settings/components/theme-sample.svelte";
    import { Session } from "$lib/session/session.svelte";
    import { SessionStatus } from "$lib/session/types";
    import ArrowRightLeft from "lucide-svelte/icons/arrow-right-left";
    import Volume from "lucide-svelte/icons/volume";
    import Volume1 from "lucide-svelte/icons/volume-1";
    import Volume2 from "lucide-svelte/icons/volume-2";
    import VolumeX from "lucide-svelte/icons/volume-x";
    import { onMount } from "svelte";
    import Dropzone from "svelte-file-dropzone";
    import { db, exportDB, importDB } from "../../../db/db";
    import { stateQuery } from "../../../db/reactivity_helper.svelte";
    import {
        get_setting,
        SettingsKey,
        type SettingType,
    } from "../../../db/settings";
    import { m } from "../../../paraglide/messages";
    import { Theme } from "../db";

    interface Props {
        settings_modal?: HTMLDialogElement;
        session?: Session;
    }

    let { settings_modal = $bindable(), session = $bindable() }: Props =
        $props();

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
    const ui_sounds_query = stateQuery(
        async () => get_setting(SettingsKey.ui_sounds),
        () => [],
    );
    const ui_sounds_volume_query = stateQuery(
        async () => get_setting(SettingsKey.ui_sounds_volume),
        () => [],
    );
    const tick_sound_query = stateQuery(
        async () => get_setting(SettingsKey.tick_sound),
        () => [],
    );
    const tick_sound_volume_query = stateQuery(
        async () => get_setting(SettingsKey.tick_sound_volume),
        () => [],
    );
    const pomo_time = $derived(pomo_time_query.current as number);
    const short_break_time = $derived(short_break_query.current as number);
    const long_break_time = $derived(long_break_query.current as number);
    const theme_active = $derived(theme_active_query.current as Theme);
    const theme_inactive = $derived(theme_inactive_query.current as Theme);
    const ui_sounds = $derived(ui_sounds_query.current as boolean);
    const ui_sounds_volume = $derived(ui_sounds_volume_query.current as number);
    const tick_sound = $derived(tick_sound_query.current as boolean);
    const tick_sound_volume = $derived(
        tick_sound_volume_query.current as number,
    );

    onMount(async () => {
        await import("dexie-export-import");
    });

    async function triggerDownload() {
        const downloadLink = document.createElement("a");
        const blob = await exportDB();
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

    async function handleFilesSelect(e) {
        uploadSuccess = false;
        uploadError = false;

        const { acceptedFiles, fileRejections } = e.detail;
        files.accepted = [...files.accepted, ...acceptedFiles];
        files.rejected = [...files.rejected, ...fileRejections];

        if (files.accepted.length > 0) {
            const file = files.accepted[0];

            try {
                await db.delete();
                await db.open();
                await importDB(file);

                uploadSuccess = true;
                reloadTimeStamp = Date.now() + 5000; // Set reload time to 5 seconds from now
                requestAnimationFrame(updateProgressBar);
            } catch (error) {
                console.error(error);
            }
        }
    }

    const update_setting = async (setting: SettingsKey, value: SettingType) => {
        try {
            await db.settings.put({ value, key: setting });
        } catch {
            console.error(`Failed to update setting: ${setting}`);
        }
    };
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
                                value={pomo_time / 60}
                                onchange={async (e) =>
                                    await update_setting(
                                        SettingsKey.pomo_time,
                                        parseInt(
                                            (e.target as HTMLInputElement)
                                                .value,
                                        ) * 60,
                                    )}
                            />
                        </div>
                        <div class="flex flex-col">
                            <label for="short_break" class="label"
                                >{m.break()}</label
                            >
                            <input
                                id="short_break"
                                type="number"
                                class="input"
                                placeholder="5"
                                value={short_break_time / 60}
                                onchange={async (e) =>
                                    await update_setting(
                                        SettingsKey.short_break_time,
                                        parseInt(
                                            (e.target as HTMLInputElement)
                                                .value,
                                        ) * 60,
                                    )}
                            />
                        </div>
                        <div class="flex flex-col">
                            <label for="long_break" class="label"
                                >{m.long_break()}</label
                            >
                            <input
                                id="long_break"
                                type="number"
                                class="input"
                                placeholder="15"
                                value={long_break_time / 60}
                                onchange={async (e) =>
                                    await update_setting(
                                        SettingsKey.long_break_time,
                                        parseInt(
                                            (e.target as HTMLInputElement)
                                                .value,
                                        ) * 60,
                                    )}
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
                                checked={ui_sounds}
                                onchange={async (e) =>
                                    await update_setting(
                                        SettingsKey.ui_sounds,
                                        (e.target as HTMLInputElement).checked,
                                    )}
                                class="toggle"
                            />
                            {m.ui_sounds()}
                        </label>
                        <button class="btn btn-primary btn-circle">
                            {#if ui_sounds && ui_sounds_volume < 25}
                                <Volume class="size-[1.2em]" />
                            {:else if ui_sounds && ui_sounds_volume >= 25 && ui_sounds_volume < 75}
                                <Volume1 class="size-[1.2em]" />
                            {:else if ui_sounds && ui_sounds_volume >= 75}
                                <Volume2 class="size-[1.2em]" />
                            {:else}
                                <VolumeX class="size-[1.2em]" />
                            {/if}
                        </button>

                        <input
                            disabled={!ui_sounds}
                            type="range"
                            min="0"
                            max="100"
                            onchange={async (e) =>
                                await update_setting(
                                    SettingsKey.ui_sounds_volume,
                                    parseInt(
                                        (e.target as HTMLInputElement).value,
                                    ),
                                )}
                            value={ui_sounds_volume}
                            class="range w-[30%]"
                        />
                    </div>
                    <div class="divider"></div>
                    <div class="flex flex-row justify-evenly items-center">
                        <label class="label">
                            <input
                                type="checkbox"
                                checked={tick_sound}
                                onchange={async (e) =>
                                    await update_setting(
                                        SettingsKey.tick_sound,
                                        (e.target as HTMLInputElement).checked,
                                    )}
                                class="toggle"
                            />
                            {m.tick_sound()}
                        </label>
                        <button class="btn btn-primary btn-circle">
                            {#if tick_sound && tick_sound_volume < 25}
                                <Volume class="size-[1.2em]" />
                            {:else if tick_sound && tick_sound_volume >= 25 && tick_sound_volume < 75}
                                <Volume1 class="size-[1.2em]" />
                            {:else if tick_sound && tick_sound_volume >= 75}
                                <Volume2 class="size-[1.2em]" />
                            {:else}
                                <VolumeX class="size-[1.2em]" />
                            {/if}
                        </button>
                        <input
                            disabled={!tick_sound}
                            type="range"
                            min="0"
                            max="100"
                            value={tick_sound_volume}
                            onchange={async (e) =>
                                await update_setting(
                                    SettingsKey.tick_sound_volume,
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
                                onchange={async (e) => {
                                    if (
                                        session?.status != SessionStatus.Active
                                    ) {
                                        document.documentElement.setAttribute(
                                            "data-theme",
                                            e.target.value,
                                        );
                                    }

                                    await update_setting(
                                        SettingsKey.theme_inactive,
                                        e.target.value as Theme,
                                    );
                                }}
                            >
                                {#each Object.values(Theme) as theme (theme)}
                                    <option
                                        value={theme}
                                        selected={theme_inactive == theme}
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
                            <legend class="fieldset-legend">{m.active()}</legend
                            >
                            <select
                                class="select"
                                onchange={async (e) => {
                                    if (
                                        session?.status == SessionStatus.Active
                                    ) {
                                        document.documentElement.setAttribute(
                                            "data-theme",
                                            e.target.value,
                                        );
                                    }

                                    await update_setting(
                                        SettingsKey.theme_active,
                                        e.target.value as Theme,
                                    );
                                }}
                            >
                                {#each Object.values(Theme) as theme (theme)}
                                    <option
                                        value={theme}
                                        selected={theme_active == theme}
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
                        onclick={async () => await triggerDownload()}
                        >Exporteer data</button
                    >
                    <div class="divider divider-horizontal"></div>
                    <Dropzone
                        on:drop={handleFilesSelect}
                        accept="application/json"
                        containerClasses="!bg-base-100 !border-base-300"
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
