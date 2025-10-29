<script lang="ts">
	import i18next from 'i18next';

	import SettingsUi from './settings-ui.svelte';

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
	<dialog
		bind:this={dialog_el}
		class="modal"
		onclose={(e) => {
			e.preventDefault();
			close();
		}}
	>
		<div class="modal-box max-h-[90dvh]">
			<div class="flex flex-row items-center justify-between mb-2">
				<h3 class="text-lg font-bold">{i18next.t('settings:settings')}</h3>
					<button class="btn btn-sm btn-circle btn-ghost" onclick={() => close()}>✕</button>
			</div>
			<SettingsUi />
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
{/if}
