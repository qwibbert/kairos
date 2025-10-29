<script lang="ts">
	import i18next from 'i18next';

	import StatsUi from './stats-ui.svelte';

	let mode: 'GENERAL' | 'VINE' = $state('GENERAL');

	interface Props {
		isOpen: boolean;
		close: () => {};
	}
	const {
		// provided by <Modals />
		isOpen,
		close,
	}: Props = $props();

	let dialog_el: HTMLDialogElement | null = $state(null);

	$effect(() => {
		if (dialog_el && isOpen && !dialog_el.open) {
			dialog_el.showModal();
		} else if (dialog_el && !isOpen && dialog_el.open) {
			dialog_el.requestClose();
		}
	});
</script>

{#if isOpen}
	<dialog bind:this={dialog_el} id="stats" class="modal overflow-y-auto">
		<div class="modal-box">
			<div class="flex flex-row items-center justify-between mb-2">
				<h3 class="text-lg font-bold">{i18next.t('statistics:statistics')}</h3>
				<button class="btn btn-sm btn-circle btn-ghost" onclick={() => close()}>✕</button>
			</div>

			<StatsUi bind:mode />
		</div>
	</dialog>
{/if}
