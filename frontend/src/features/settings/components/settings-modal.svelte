<script lang="ts">
	import ThemeSample from '$features/settings/components/theme-sample.svelte';
	import ArrowRightLeft from 'lucide-svelte/icons/arrow-right-left';
	import Volume from 'lucide-svelte/icons/volume';
	import Volume1 from 'lucide-svelte/icons/volume-1';
	import Volume2 from 'lucide-svelte/icons/volume-2';
	import VolumeX from 'lucide-svelte/icons/volume-x';
	import { removeRxDatabase } from 'rxdb';
	import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
	import Dropzone from 'svelte-file-dropzone';
	import { _ } from 'svelte-i18n';

	import { db } from '../../../db/db';
	import { SessionStatus, type SessionDocument } from '../../../db/sessions/define.svelte';
	import type { SettingsDocument } from '../../../db/settings/define';
	import { Theme } from '../db';

	interface Props {
		settings_modal?: HTMLDialogElement;
		settings: SettingsDocument;
		session?: SessionDocument;
	}

	let { settings_modal = $bindable(), session, settings }: Props = $props();

	async function triggerDownload() {
		const downloadLink = document.createElement('a');
		const blob = JSON.stringify(await db.exportJSON());
		const fileURL = URL.createObjectURL(blob);
		downloadLink.href = fileURL;
		downloadLink.download = 'Kairos Data.json';
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
		progressBarWidth = Math.max(0, Math.min(100, ((reloadTimeStamp - Date.now()) / 5000) * 100));

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
				await db.close();

				removeRxDatabase('kairos_db', getRxStorageDexie());

				await db.importJSON(file);

				uploadSuccess = true;
				reloadTimeStamp = Date.now() + 5000; // Set reload time to 5 seconds from now
				requestAnimationFrame(updateProgressBar);
			} catch (error) {
				console.error(error);
			}
		}
	}
</script>

<dialog bind:this={settings_modal} id="settings" class="modal">
	<div class="modal-box max-h-[90dvh]">
		<div class="flex flex-row items-center justify-between mb-2">
			<h3 class="text-lg font-bold">{$_('settings')}</h3>
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost">✕</button>
			</form>
		</div>
		<div class="tabs tabs-border">
			<input type="radio" name="settings-tabs" class="tab" aria-label={$_('general')} checked />
			<div class="tab-content">
				<fieldset class="fieldset bg-base-100 border-base-300 rounded-box w-full border p-4">
					<legend class="fieldset-legend">{$_('focus_times')}</legend>
					<div class="flex flex-col md:flex-row gap-2">
						<div class="flex flex-col">
							<label for="pomo" class="label">{$_('pomodoro')}</label>
							<input
								id="pomo"
								type="number"
								class="input text-center"
								placeholder="25"
								value={settings.pomo_time / 60}
								onchange={async (e) =>
									await settings.modify_setting(
										'pomo_time',
										parseInt((e.target as HTMLInputElement).value) * 60,
									)}
							/>
						</div>
						<div class="flex flex-col">
							<label for="short_break" class="label">{$_('break')}</label>
							<input
								id="short_break"
								type="number"
								class="input text-center"
								placeholder="5"
								value={settings.short_break_time / 60}
								onchange={async (e) =>
									await settings.modify_setting(
										'short_break_time',
										parseInt((e.target as HTMLInputElement).value) * 60,
									)}
							/>
						</div>
						<div class="flex flex-col">
							<label for="long_break" class="label">{$_('long_break')}</label>
							<input
								id="long_break"
								type="number"
								class="input text-center"
								placeholder="15"
								value={settings.long_break_time / 60}
								onchange={async (e) =>
									await settings.modify_setting(
										'long_break_time',
										parseInt((e.target as HTMLInputElement).value) * 60,
									)}
							/>
						</div>
					</div>
				</fieldset>
				<fieldset class="fieldset bg-base-100 border-base-300 rounded-box w-full border p-4">
					<legend class="fieldset-legend">{$_('sound')}</legend>
					<div class="flex flex-col md:flex-row gap-2 justify-evenly items-center">
						<label class="label">
							<input
								type="checkbox"
								checked={settings.ui_sounds}
								onchange={async (e) =>
									await settings.modify_setting(
										'ui_sounds',
										(e.target as HTMLInputElement).checked,
									)}
								class="toggle"
							/>
							{$_('ui_sounds')}
						</label>

						<div class="flex flex-row items-center gap-2 w-full md:contents">
							<button
								class="btn btn-primary btn-circle w-1/4"
								onclick={async () => {
									// TODO: add sound preview
								}}
							>
								{#if settings.ui_sounds && settings.ui_sounds_volume < 25}
									<Volume class="size-[1.2em]" />
								{:else if settings.ui_sounds && settings.ui_sounds_volume >= 25 && settings.ui_sounds_volume < 75}
									<Volume1 class="size-[1.2em]" />
								{:else if settings.ui_sounds && settings.ui_sounds_volume >= 75}
									<Volume2 class="size-[1.2em]" />
								{:else}
									<VolumeX class="size-[1.2em]" />
								{/if}
							</button>

							<input
								disabled={!settings.ui_sounds}
								type="range"
								min="0"
								max="100"
								onchange={async (e) =>
									await settings.modify_setting(
										'ui_sounds_volume',
										parseInt((e.target as HTMLInputElement).value),
									)}
								value={settings.ui_sounds_volume}
								class="range w-3/4 md:w-[30%]"
							/>
						</div>
					</div>
					<div class="divider"></div>
					<div class="flex flex-col md:flex-row justify-evenly items-center">
						<label class="label">
							<input
								type="checkbox"
								checked={settings.timer_tick_sound}
								onchange={async (e) =>
									await settings.modify_setting(
										'timer_tick_sound',
										(e.target as HTMLInputElement).checked,
									)}
								class="toggle"
							/>
							{$_('tick_sound')}
						</label>
						<div class="flex flex-row items-center gap-2 w-full md:contents">
							<button
								class="btn btn-primary btn-circle w-1/4"
								onclick={async () => {
									// TODO: add sound preview
								}}
							>
								{#if settings.timer_tick_sound && settings.timer_tick_sound_volume < 25}
									<Volume class="size-[1.2em]" />
								{:else if settings.timer_tick_sound && settings.timer_tick_sound_volume >= 25 && settings.timer_tick_sound_volume < 75}
									<Volume1 class="size-[1.2em]" />
								{:else if settings.timer_tick_sound && settings.timer_tick_sound_volume >= 75}
									<Volume2 class="size-[1.2em]" />
								{:else}
									<VolumeX class="size-[1.2em]" />
								{/if}
							</button>
							<input
								disabled={!settings.timer_tick_sound}
								type="range"
								min="0"
								max="100"
								value={settings.timer_tick_sound_volume}
								onchange={async (e) =>
									await settings.modify_setting(
										'timer_tick_sound_volume',
										parseInt((e.target as HTMLInputElement).value),
									)}
								class="range w-3/4 md:w-[30%]"
							/>
						</div>
					</div>
					<div class="divider"></div>
					<div class="flex flex-col md:flex-row justify-evenly items-center">
						<label class="label">
							<input
								type="checkbox"
								checked={settings.timer_finish_sound}
								onchange={async (e) =>
									await settings.modify_setting(
										'timer_finish_sound',
										(e.target as HTMLInputElement).checked,
									)}
								class="toggle"
							/>
							{$_('timer_sound')}
						</label>
						<div class="flex flex-row items-center gap-2 w-full md:contents">
							<button
								class="btn btn-primary w-1/4 btn-circle"
								onclick={async () => {
									// TODO: add sound preview
								}}
							>
								{#if settings.timer_finish_sound && settings.timer_finish_sound_volume < 25}
									<Volume class="size-[1.2em]" />
								{:else if settings.timer_finish_sound && settings.timer_finish_sound_volume >= 25 && settings.timer_finish_sound_volume < 75}
									<Volume1 class="size-[1.2em]" />
								{:else if settings.timer_finish_sound && settings.timer_finish_sound_volume >= 75}
									<Volume2 class="size-[1.2em]" />
								{:else}
									<VolumeX class="size-[1.2em]" />
								{/if}
							</button>
							<input
								disabled={!settings.timer_finish_sound}
								type="range"
								min="0"
								max="100"
								value={settings.timer_finish_sound_volume}
								onchange={async (e) =>
									await settings.modify_setting(
										'timer_finish_sound_volume',
										parseInt((e.target as HTMLInputElement).value),
									)}
								class="range w-3/4 md:w-[30%]"
							/>
						</div>
					</div>
				</fieldset>
				<fieldset
					class="fieldset flex flex-row justify-evenly bg-base-100 border-base-300 rounded-box w-full border p-4"
				>
					<legend class="fieldset-legend">{$_('appearance')}</legend>
					<div class="flex flex-col gap-2 items-center">
						<fieldset class="fieldset w-full">
							<legend class="fieldset-legend">{$_('inactive')}</legend>
							<select
								class="select"
								onchange={async (e) => {
									if (session?.status != SessionStatus.Active) {
										document.documentElement.setAttribute('data-theme', e.target.value);
									}

									await settings.modify_setting(
										'theme_inactive',
										e.target.value as Theme,
									);
								}}
							>
								{#each Object.values(Theme) as theme (theme)}
									<option value={theme} selected={settings.theme_inactive == theme}>
										{theme}
									</option>
								{/each}
							</select>
						</fieldset>
						<ThemeSample theme={settings.theme_inactive} />
					</div>
					<ArrowRightLeft class="size-[2.5em] self-center" />
					<div class="flex flex-col gap-2 items-center">
						<fieldset class="fieldset w-full">
							<legend class="fieldset-legend">{$_('active')}</legend>
							<select
								class="select"
								onchange={async (e) => {
									if (session?.status == SessionStatus.Active) {
										document.documentElement.setAttribute('data-theme', e.target.value);
									}

									await settings.modify_setting('theme_active', e.target.value as Theme);
								}}
							>
								{#each Object.values(Theme) as theme (theme)}
									<option value={theme} selected={settings.theme_active == theme}>
										{theme}
									</option>
								{/each}
							</select>
						</fieldset>

						<ThemeSample theme={settings.theme_active} />
					</div>
				</fieldset>
			</div>

			<input
				type="radio"
				name="settings-tabs"
				class="tab"
				aria-label={$_('import') + '/' + $_('export')}
			/>
			<div class="tab-content">
				<div class="flex flex-row justify-evenly mt-5 items-center">
					<button class="btn btn-primary" onclick={async () => await triggerDownload()}
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
							<span class="text-success">{$_('database_import_success')}</span>
							<span>{$_('reloading_in')}</span>
							<progress class="progress w-56" value={progressBarWidth} max="100"></progress>
						{:else if uploadError}
							<span class="text-error">{$_('database_import_error')}</span>
						{:else}
							<span>{$_('database_import_dropzone')}</span>
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
