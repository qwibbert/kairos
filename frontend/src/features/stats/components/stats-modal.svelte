<script lang="ts">
	import { _ } from 'svelte-i18n';

	import StatsUi from './stats-ui.svelte';
	
	interface Props {
		stats_modal?: HTMLDialogElement;
	}

	let { stats_modal = $bindable() }: Props = $props();

	

</script>

<dialog bind:this={stats_modal} id="stats" class="modal overflow-y-auto">
	<div class="modal-box">
		<div class="flex flex-row items-center justify-between mb-2">
			<h3 class="text-lg font-bold">{$_('statistics')}</h3>
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost">✕</button>
			</form>
		</div>

		<StatsUi />
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
