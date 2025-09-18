<script lang="ts">
	import ArrowRightLeft from 'lucide-svelte/icons/arrow-right-left';
	import Volume from 'lucide-svelte/icons/volume';
	import Volume1 from 'lucide-svelte/icons/volume-1';
	import Volume2 from 'lucide-svelte/icons/volume-2';
	import VolumeX from 'lucide-svelte/icons/volume-x';
	import { getContext } from 'svelte';

	import AccountButton from '$lib/components/account-button.svelte';
	import i18next from 'i18next';
	import { db } from '../../../db/db';
	import { type SessionDocument, SessionStatus } from '../../../db/sessions/define.svelte';
	import type { SettingsDocument } from '../../../db/settings/define';
	import { Theme } from '../db';
	import ThemeSample from './theme-sample.svelte';

	const session = getContext('session') as SessionDocument | null;
	let settings: SettingsDocument | null = $state(null);

	db.settings.findOne('1').$.subscribe((s) => (settings = s));
</script>

{#if settings}
	<div class="flex w-full justify-center">
		<AccountButton />
	</div>
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
					value={settings.pomo_time! / 60}
					onchange={async (e) =>
						await settings!.modify_setting(
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
					value={settings.short_break_time! / 60}
					onchange={async (e) =>
						await settings!.modify_setting(
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
					value={settings.long_break_time! / 60}
					onchange={async (e) =>
						await settings!.modify_setting(
							'long_break_time',
							parseInt((e.target as HTMLInputElement).value) * 60,
						)}
				/>
			</div>
		</div>
	</fieldset>
	<fieldset class="fieldset bg-base-100 border-base-300 rounded-box w-full border p-4">
		<legend class="fieldset-legend">{i18next.t('settings:sound')}</legend>
		<div class="flex flex-col md:flex-row gap-2 justify-evenly items-center">
			<label class="label">
				<input
					type="checkbox"
					checked={settings.ui_sounds}
					onchange={async (e) =>
						await settings!.modify_setting('ui_sounds', (e.target as HTMLInputElement).checked)}
					class="toggle"
				/>
				{i18next.t('settings:ui_sounds')}
			</label>

			<div class="flex flex-row items-center gap-2 w-full md:contents">
				<button
					class="btn btn-primary btn-circle"
					onclick={async () => {
						// TODO: add sound preview
					}}
				>
					{#if settings.ui_sounds && settings.ui_sounds_volume! < 25}
						<Volume class="size-[1.2em]" />
					{:else if settings.ui_sounds && settings.ui_sounds_volume! >= 25 && settings.ui_sounds_volume! < 75}
						<Volume1 class="size-[1.2em]" />
					{:else if settings.ui_sounds && settings.ui_sounds_volume! >= 75}
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
						await settings!.modify_setting(
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
						await settings!.modify_setting(
							'timer_tick_sound',
							(e.target as HTMLInputElement).checked,
						)}
					class="toggle"
				/>
				{i18next.t('settings:tick_sound')}
			</label>
			<div class="flex flex-row items-center gap-2 w-full md:contents">
				<button
					class="btn btn-primary btn-circle"
					onclick={async () => {
						// TODO: add sound preview
					}}
				>
					{#if settings.timer_tick_sound && settings.timer_tick_sound_volume! < 25}
						<Volume class="size-[1.2em]" />
					{:else if settings.timer_tick_sound && settings.timer_tick_sound_volume! >= 25 && settings.timer_tick_sound_volume! < 75}
						<Volume1 class="size-[1.2em]" />
					{:else if settings.timer_tick_sound && settings.timer_tick_sound_volume! >= 75}
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
						await settings!.modify_setting(
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
						await settings!.modify_setting(
							'timer_finish_sound',
							(e.target as HTMLInputElement).checked,
						)}
					class="toggle"
				/>
				{i18next.t('settings:timer_sound')}
			</label>
			<div class="flex flex-row items-center gap-2 w-full md:contents">
				<button
					class="btn btn-primary btn-circle"
					onclick={async () => {
						// TODO: add sound preview
					}}
				>
					{#if settings.timer_finish_sound && settings.timer_finish_sound_volume! < 25}
						<Volume class="size-[1.2em]" />
					{:else if settings.timer_finish_sound && settings.timer_finish_sound_volume! >= 25 && settings.timer_finish_sound_volume! < 75}
						<Volume1 class="size-[1.2em]" />
					{:else if settings.timer_finish_sound && settings.timer_finish_sound_volume! >= 75}
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
						await settings!.modify_setting(
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
				<legend class="fieldset-legend">{i18next.t('settings:inactive')}</legend>
				<select
					class="select"
					onchange={async (e) => {
						if (session?.status != SessionStatus.Active) {
							document.documentElement.setAttribute(
								'data-theme',
								(e.target as HTMLSelectElement).value,
							);
						}

						await settings!.modify_setting(
							'theme_inactive',
							(e.target as HTMLSelectElement).value as Theme,
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
				<legend class="fieldset-legend">{i18next.t('settings:active')}</legend>
				<select
					class="select"
					onchange={async (e) => {
						if (session?.status == SessionStatus.Active) {
							document.documentElement.setAttribute(
								'data-theme',
								(e.target as HTMLSelectElement).value,
							);
						}

						await settings!.modify_setting(
							'theme_active',
							(e.target as HTMLSelectElement).value as Theme,
						);
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
{/if}
