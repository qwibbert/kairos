<script lang="ts">
	import { CloudDownload } from 'lucide-svelte';
	import CloudAlert from 'lucide-svelte/icons/cloud-alert';
	import CloudCheck from 'lucide-svelte/icons/cloud-check';
	import CloudCog from 'lucide-svelte/icons/cloud-cog';
	import CloudOff from 'lucide-svelte/icons/cloud-off';
	import { DateTime } from 'luxon';
	import { onMount } from 'svelte';

	import { db } from '../../db/db';

	onMount(() => {
		db.syncable.on('statusChanged', (s) => {
			switch (s) {
				case -1:
					status = 'ERROR';
					break;
				case 0:
					status = 'OFFLINE';
					break;
				case 1:
					status = 'CONNECTING';
					break;
				case 2:
					status = 'ONLINE';
					last_sync = DateTime.now();
					break;
				case 3:
					status = 'SYNCING';
					last_sync = DateTime.now();
					break;
				case 4:
					status = 'ERROR_WILL_RETRY';
					break;
			}
		});
	});

	let status:
		| 'ERROR'
		| 'OFFLINE'
		| 'CONNECTING'
		| 'ONLINE'
		| 'SYNCING'
		| 'ERROR_WILL_RETRY'
		| null = $state(null);

	let last_sync: DateTime | undefined = $state(undefined);
	let last_sync_str = $state('');
</script>

{#if status != null}
	{#if status == 'ERROR'}
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
		<CloudDownload color="var(--color-primary)" class="size-[1.5em]" />
	{:else if status == 'ERROR_WILL_RETRY'}
		<CloudAlert color="var(--color-error)" class="size-[1.5em]" />
	{/if}
{/if}
