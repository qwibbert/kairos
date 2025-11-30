<script lang="ts">
	import { CloudDownload } from 'lucide-svelte';
	import CloudCheck from 'lucide-svelte/icons/cloud-check';
	import { DateTime } from 'luxon';
	import { onMount } from 'svelte';

	import { sessions_sync_state } from '../../db/sessions/client';
	import { settings_sync_state } from '../../db/settings/client';
	import { vines_sync_state } from '../../db/vines/client';

	let sync_history: Array<{
		collection: 'sessions' | 'settings' | 'vines';
		type: 'PUSH' | 'PULL';
		timestamp: number;
	}> = $state([]);
	let settings_active = $state(false);
	let vines_active = $state(false);
	let sessions_active = $state(false);

	onMount(() => {
		settings_sync_state?.sent$.subscribe((doc) => {
			sync_history.push({ collection: 'settings', type: 'PUSH', timestamp: Date.now() });
		});

		settings_sync_state?.received$.subscribe((doc) => {
			sync_history.push({ collection: 'settings', type: 'PULL', timestamp: Date.now() });
		});

		settings_sync_state?.active$.subscribe((bool) => {
			if (bool) {
				last_sync = DateTime.now();
			}

			settings_active = bool;
		});

		vines_sync_state?.sent$.subscribe((doc) => {
			sync_history.push({ collection: 'vines', type: 'PUSH', timestamp: Date.now() });
		});

		vines_sync_state?.received$.subscribe((doc) => {
			sync_history.push({ collection: 'vines', type: 'PULL', timestamp: Date.now() });
		});

		vines_sync_state?.active$.subscribe((bool) => {
			if (bool) {
				last_sync = DateTime.now();
			}

			vines_active = bool;
		});

		sessions_sync_state?.received$.subscribe((doc) => {
			sync_history.push({ collection: 'sessions', type: 'PULL', timestamp: Date.now() });
		});

		sessions_sync_state?.active$.subscribe((bool) => {
			if (bool) {
				last_sync = DateTime.now();
			}

			sessions_active = bool;
		});
	});

	let last_sync: DateTime | undefined = $state(undefined);
</script>

{#if sessions_active || vines_active || settings_active}
	<CloudDownload color="var(--color-primary)" class="size-[1.5em]" />
	<!-- {#if status == 'ERROR'}
		<CloudAlert color="var(--color-error)" class="size-[1.5em]" />
	{:else if status == 'OFFLINE'}
		<CloudOff class="size-[1.5em]" />
	{:else if status == 'CONNECTING'}
		<CloudCog class="size-[1.5em]" />
	{:else if status == 'ONLINE'}
		<div
			aria-haspopup="dialog"
			class="tooltip"
			data-tip={`Laatste syncronisatie: ${last_sync_str}`}
			onmouseenter={() => (last_sync_str = last_sync?.toRelative())}
		>
			<CloudCheck color="var(--color-primary)" class="size-[1.5em] " />
		</div>
	{:else if status == 'SYNCING'}
		
	{:else if status == 'ERROR_WILL_RETRY'}
		<CloudAlert color="var(--color-error)" class="size-[1.5em]" />
	{/if} -->
{:else}
	<CloudCheck color="var(--color-primary)" class="size-[1.5em] " />
{/if}
