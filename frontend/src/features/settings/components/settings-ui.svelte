<script lang="ts">
	import { goto } from '$app/navigation';
	import i18next from 'i18next';
	import Volume from 'lucide-svelte/icons/volume';
	import Volume1 from 'lucide-svelte/icons/volume-1';
	import Volume2 from 'lucide-svelte/icons/volume-2';
	import VolumeX from 'lucide-svelte/icons/volume-x';

	import AccountButton from '$lib/components/account-button.svelte';
	import { get_app_state } from '$lib/context';
	import {
		TimerFinishSound,
		play_button_sound,
		play_timer_finish_sound
	} from '$lib/sounds';
	import { push_toast } from '$lib/toasts';

	import { db, init_db } from '../../../db/db';
	import { SessionStatus } from '../../../db/sessions/define.svelte';
	import { Theme } from '../db';
	import ThemeSample from './theme-sample.svelte';

	const { mobile }: { mobile: boolean } = $props();

	const app_state = get_app_state();

	let files: FileList | undefined = $state();

	$effect(() => {
		if (files) {
			if (files.length == 0) {
				push_toast('error', {
					type: 'headed',
					header: i18next.t('settings:err_import'),
					text: i18next.t('settings:err_import_no_files'),
				});
			} else if (files.length > 1) {
				push_toast('error', {
					type: 'headed',
					header: i18next.t('settings:err_import'),
					text: i18next.t('settings:err_import_multiple_files'),
				});
			} else {
				const reader = new FileReader();

				reader.onload = async () => {
					await import_data(reader.result as string);
				};
				reader.onerror = () => {
					push_toast('error', {
						type: 'headed',
						header: i18next.t('settings:err_import'),
						text: i18next.t('settings:err_import_failed_read'),
					});
				};
				reader.readAsText(files[0]);
			}
		}
	});

	async function export_data() {
		const exported_data = await db.exportJSON();

		const file_url = URL.createObjectURL(
			new Blob([JSON.stringify(exported_data)], { type: 'application/json' }),
		);

		const downloadLink = document.createElement('a');
		downloadLink.href = file_url;
		downloadLink.download = 'kairos_data.json';
		document.body.appendChild(downloadLink);
		downloadLink.click();

		URL.revokeObjectURL(file_url);
	}

	async function import_data(json_string: string) {
		if (app_state.user) {
			push_toast('error', {
				type: 'headed',
				header: i18next.t('settings:err_import'),
				text: i18next.t('err_import_logged_in'),
			});

			return;
		}

		let obj: object | null = null;
		try {
			obj = JSON.parse(json_string);
		} catch {
			push_toast('error', {
				type: 'headed',
				header: i18next.t('settings:err_import'),
				text: i18next.t('settings:err_import_parse_failed'),
			});
		}

		if (obj) {
			try {
				await db.remove();
				const new_db = await init_db();
				await new_db.addState();
				await new_db.importJSON(obj);
				goto('/');
			} catch (e) {
				console.log(e);
				push_toast('error', {
					type: 'headed',
					header: i18next.t('settings:err_import'),
					text: i18next.t('settings:err_import_database_init'),
				});
			}
		}
	}
</script>

{#if app_state.settings}
	{#if mobile}
		<div class="flex w-full justify-center">
			<AccountButton />
		</div>
	{/if}
	<fieldset class="fieldset bg-base-100 border-base-300 rounded-box w-full border p-4">
		<legend class="fieldset-legend">{i18next.t('statistics:focus_time')}</legend>
		<div class="flex flex-col md:flex-row gap-2">
			<div class="flex flex-col">
				<label for="pomo" class="label">{i18next.t('session:pomodoro')}</label>
				<input
					id="pomo"
					type="number"
					class="input text-center"
					placeholder="25"
					value={app_state.settings.pomo_time! / 60}
					onchange={async (e) =>
						await app_state.settings!.modify_setting(
							'pomo_time',
							parseInt((e.target as HTMLInputElement).value) * 60,
						)}
				/>
			</div>
			<div class="flex flex-col">
				<label for="short_break" class="label">{i18next.t('session:break')}</label>
				<input
					id="short_break"
					type="number"
					class="input text-center"
					placeholder="5"
					value={app_state.settings.short_break_time! / 60}
					onchange={async (e) =>
						await app_state.settings!.modify_setting(
							'short_break_time',
							parseInt((e.target as HTMLInputElement).value) * 60,
						)}
				/>
			</div>
			<div class="flex flex-col">
				<label for="long_break" class="label">{i18next.t('session:long_break')}</label>
				<input
					id="long_break"
					type="number"
					class="input text-center"
					placeholder="15"
					value={app_state.settings.long_break_time! / 60}
					onchange={async (e) =>
						await app_state.settings!.modify_setting(
							'long_break_time',
							parseInt((e.target as HTMLInputElement).value) * 60,
						)}
				/>
			</div>
		</div>
		<label class="label mx-auto">
			<input
				type="checkbox"
				checked={app_state.settings.auto_start}
				class="checkbox"
				onchange={async (e) => {
					await app_state.settings!.modify_setting('auto_start', e.currentTarget.checked);
				}}
			/>
			{i18next.t('settings:auto_start')}
		</label>
	</fieldset>
	<fieldset class="fieldset bg-base-100 border-base-300 rounded-box w-full border p-4">
		<legend class="fieldset-legend">{i18next.t('settings:sound')}</legend>
		<div class="divider mt-[-1em]">{i18next.t('settings:ui_sounds')}</div>
		<div class="flex flex-col md:flex-row gap-2 justify-evenly items-center">
			<input
				type="checkbox"
				checked={app_state.settings.ui_sounds}
				onchange={async (e) =>
					await app_state.settings!.modify_setting(
						'ui_sounds',
						(e.target as HTMLInputElement).checked,
					)}
				class="toggle"
			/>

			<div class="flex flex-row items-center gap-2 w-full md:contents">
				<button
					class="btn btn-primary btn-circle"
					onclick={async () => {
						await play_button_sound();
					}}
				>
					{#if app_state.settings.ui_sounds && app_state.settings.ui_sounds_volume! < 25}
						<Volume class="size-[1.2em]" />
					{:else if app_state.settings.ui_sounds && app_state.settings.ui_sounds_volume! >= 25 && app_state.settings.ui_sounds_volume! < 75}
						<Volume1 class="size-[1.2em]" />
					{:else if app_state.settings.ui_sounds && app_state.settings.ui_sounds_volume! >= 75}
						<Volume2 class="size-[1.2em]" />
					{:else}
						<VolumeX class="size-[1.2em]" />
					{/if}
				</button>

				<input
					disabled={!app_state.settings.ui_sounds}
					type="range"
					min="0"
					max="100"
					onchange={async (e) =>
						await app_state.settings!.modify_setting(
							'ui_sounds_volume',
							parseInt((e.target as HTMLInputElement).value),
						)}
					value={app_state.settings.ui_sounds_volume}
					class="range w-3/4 md:w-[30%]"
				/>
			</div>
		</div>
		<div class="divider">{i18next.t('settings:timer_sound')}</div>
		<div class="flex flex-col md:flex-row justify-evenly items-center">
			<select
				class="select"
				onchange={async (e) => {
					app_state.settings?.modify_setting('timer_finish_sound', e.currentTarget.value);
				}}
			>
				{#each Object.values(TimerFinishSound) as sound}
					<option selected={app_state.settings.timer_finish_sound == sound}>{sound}</option>
				{/each}
			</select>
			<div class="flex flex-row items-center gap-2 w-full md:contents">
				<button
					class="btn btn-primary btn-circle"
					onclick={async () => {
						await play_timer_finish_sound();
					}}
				>
					{#if app_state.settings.timer_finish_sound && app_state.settings.timer_finish_sound_volume! < 25}
						<Volume class="size-[1.2em]" />
					{:else if app_state.settings.timer_finish_sound && app_state.settings.timer_finish_sound_volume! >= 25 && app_state.settings.timer_finish_sound_volume! < 75}
						<Volume1 class="size-[1.2em]" />
					{:else if app_state.settings.timer_finish_sound && app_state.settings.timer_finish_sound_volume! >= 75}
						<Volume2 class="size-[1.2em]" />
					{:else}
						<VolumeX class="size-[1.2em]" />
					{/if}
				</button>
				<input
					disabled={!app_state.settings.timer_finish_sound}
					type="range"
					min="0"
					max="100"
					value={app_state.settings.timer_finish_sound_volume}
					onchange={async (e) =>
						await app_state.settings!.modify_setting(
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
		<legend class="fieldset-legend">{i18next.t('settings:appearance')}</legend>
		<div class="flex flex-col gap-2 items-center">
			<fieldset class="fieldset w-full">
				<legend class="fieldset-legend">{i18next.t('settings:theme')}</legend>
				<select
					class="select"
					disabled={app_state.settings?.special_periods && app_state.special_period != null}
					title={app_state.settings?.special_periods && app_state.special_period != null
						? i18next.t('settings:theme_locked_hint')
						: ''}
					onchange={async (e) => {
						if (app_state.session?.status != SessionStatus.Active) {
							document.documentElement.setAttribute(
								'data-theme',
								(e.target as HTMLSelectElement).value,
							);
						}

						await app_state.settings!.modify_setting(
							'theme',
							(e.target as HTMLSelectElement).value as Theme,
						);
					}}
				>
					{#each Object.values(Theme) as theme (theme)}
						<option value={theme} selected={app_state.settings.theme == theme}>
							<ThemeSample {theme} />
						</option>
					{/each}
				</select>
			</fieldset>
			<fieldset class="fieldset w-full">
				<legend class="fieldset-legend">{i18next.t('settings:hollydays')}</legend>
				<label class="label">
					<input
						type="checkbox"
						checked={app_state.settings.special_periods}
						class="checkbox"
						onchange={async (e) => {
							await app_state.settings!.modify_setting('special_periods', e.currentTarget.checked);
						}}
					/>
					{i18next.t('settings:adjust_theme')}
				</label>
			</fieldset>
		</div>
	</fieldset>
	<fieldset
		class="fieldset flex flex-row justify-evenly bg-base-100 border-base-300 rounded-box w-full border p-4"
	>
		<legend class="fieldset-legend">{i18next.t('settings:data_management')}</legend>
		<button class="btn" onclick={() => export_data()}>{i18next.t('settings:export')}</button>
		{#if import.meta.env.DEV}
			<input
				bind:files
				accept="application/json"
				type="file"
				class="file-input"
				placeholder={i18next.t('settings:import')}
			/>
		{/if}
	</fieldset>
{/if}
