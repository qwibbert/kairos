<script lang="ts">
	
	
	import { _ } from 'svelte-i18n';

	import { type SessionDocument } from '../../../db/sessions/define.svelte';
	import type { SettingsDocument } from '../../../db/settings/define';
	import SettingsUi from './settings-ui.svelte';

	interface Props {
		settings_modal?: HTMLDialogElement;
		settings: SettingsDocument;
		session?: SessionDocument;
	}

	let { settings_modal = $bindable(), session, settings }: Props = $props();
</script>

<dialog bind:this={settings_modal} id="settings" class="modal">
	<div class="modal-box max-h-[90dvh]">
		<div class="flex flex-row items-center justify-between mb-2">
			<h3 class="text-lg font-bold">{$_('settings')}</h3>
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost">✕</button>
			</form>
		</div>
		<SettingsUi />
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
