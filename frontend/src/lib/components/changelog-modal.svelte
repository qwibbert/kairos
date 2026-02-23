<script lang="ts">
	import i18next from 'i18next';
	import ScrollText from 'lucide-svelte/icons/scroll-text';
	import { Settings } from 'src/settings/settings.svelte';

	import { get_app_state } from '$lib/context';

	interface Props {
		isOpen: boolean;
		close: () => {};
		autoshow: boolean;
	}
	const {
		// provided by <Modals />
		isOpen,
		close,
		autoshow,
	}: Props = $props();

	let dialog_el: HTMLDialogElement | null = $state(null);
	let app_state = get_app_state();

	let versions = Object.entries(__KAIROS_VERSIONS__);

	$effect(() => {
		if (dialog_el && isOpen && !dialog_el.open) {
			dialog_el.showModal();
		} else if (dialog_el && !isOpen && dialog_el.open) {
			dialog_el.requestClose();
		}
	});
</script>

<dialog
	bind:this={dialog_el}
	class="modal"
	onclose={async (e) => {
		e.preventDefault();
		if (autoshow) {
			await Settings.writeSetting('changelog_latest_shown', __KAIROS_VERSION__);
		}
		close();
	}}
>
	<div class="modal-box max-h-[90dvh]">
		<div class="flex flex-row items-center justify-between mb-2">
			<h3 class="flex flex-row items-center gap-2 text-lg font-bold">
				<ScrollText class="size-[1.2em]" />
				{i18next.t('changelog:changelog')}
			</h3>
			<button
				class="btn btn-sm btn-circle btn-ghost"
				onclick={async () => {
					if (autoshow) {
						await Settings.writeSetting('changelog_latest_shown', __KAIROS_VERSION__);
					}
					close();
				}}>✕</button
			>
		</div>
		{#if autoshow}
			{i18next.t('changelog:updated')}
			<button
				onclick={async () => {
					await Settings.writeSetting('changelog_autoshow', false);
					await Settings.writeSetting('changelog_latest_shown', __KAIROS_VERSION__);
					close();
				}}
				class="link">{i18next.t('changelog:disable_autoshow')}</button
			>
			<div class="divider"></div>
		{/if}
		{#each versions as [version, date]}
			<div class="collapse collapse-arrow">
				<input type="radio" name="version" checked={version == __KAIROS_VERSION__} />
				<div class="collapse-title font-semibold flex flex-row items-center gap-2">
					{version} ({date})
					{#if version == __KAIROS_VERSION__}
						<div class="badge badge-primary">{i18next.t('changelog:latest')}</div>
					{/if}
				</div>
				<div class="collapse-content text-sm">
					{#if i18next.exists(`changelog:${version}_notes`)}
						{i18next.t(`changelog:${version}_notes`)}
					{:else}
						{i18next.t('changelog:no_notes')}
					{/if}
				</div>
			</div>
		{/each}
	</div>
</dialog>
