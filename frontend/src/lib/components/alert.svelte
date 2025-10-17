<script lang="ts">
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import Info from 'lucide-svelte/icons/info';
	import TriangleAlert from 'lucide-svelte/icons/triangle-alert';

	import { get_app_state } from '$lib/context';

	const app_state = get_app_state();

	const {
    // provided by <Modals />
    isOpen,
    close,

    // your props
    type,
	header,
	text,
	dismissable = true,
	actions
  }: { isOpen: boolean, close: () => {}, type: 'WARNING' | 'ERROR' | 'INFO', header?: string, text?: string, dismissable?: boolean, actions: [] } = $props();

  let dialog_el: HTMLDialogElement | null = $state(null);

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
	class="modal overflow-y-auto z-50"
	onclose={(e) => {e.preventDefault(); close()}}
>
	<div class="modal-box flex flex-col justify-between">
		<div class="flex flex-row items-center justify-between mb-5">
			<h3
				class={[
					'text-lg',
					'font-bold',
					'flex',
					'flex-row',
					'gap-2 ',
					'items-center',
					type == 'WARNING' ? 'text-warning' : type == 'ERROR' ? 'text-error' : '',
				]}
			>
				{#if type == 'INFO'}
					<Info class="size-[1.2em]" />
				{:else if type == 'WARNING'}<TriangleAlert
						class="size-[1.2em]"
					/>{:else if type == 'ERROR'}<CircleAlert class="size-[1.2em]" />{/if}
				{header}
			</h3>
			{#if dismissable}
				<form method="dialog">
					<button class="btn btn-sm btn-circle btn-ghost">✕</button>
				</form>
			{/if}
		</div>
		<p>{@html text}</p>
		<div class="flex flex-row items-center justify-between mt-5">
			{#each actions as action (action[0])}
				<button
					class={[
						'btn ',
						type == 'WARNING' ? 'btn-warning' : type == 'ERROR' ? 'btn-error' : '',
					]}
					onclick={async (e) => {
						await action[1]();
						close();
					}}>{action[0]}</button
				>
			{/each}
		</div>
	</div>
</dialog>
