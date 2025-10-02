<script lang="ts">
	import VinesUi from './vines-ui.svelte';

	interface Props {
		vineselector_modal?: HTMLDialogElement;
	}

	let { vineselector_modal = $bindable() }: Props = $props();
</script>

<dialog bind:this={vineselector_modal} class="modal" id="vines">
	<div class="modal-box max-h-[90dvh]">
		<div class="flex flex-row justify-between items-center w-full">
			<h3 class="text-lg font-bold self-baseline">Vines</h3>
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost">✕</button>
			</form>
		</div>
		<VinesUi />
	</div>
</dialog>
