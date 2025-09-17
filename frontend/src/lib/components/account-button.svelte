<script lang="ts">
	import { LogIn } from 'lucide-svelte';
	import User from 'lucide-svelte/icons/user';
	import { _ } from 'svelte-i18n';

	import { authModel, logout } from '$lib/pocketbase';

	import LoginRegister from '$lib/pocketbase/login-register.svelte';
	import SyncIndicator from './sync-indicator.svelte';

	let login_register = $state<HTMLDialogElement | undefined>();
</script>

<LoginRegister bind:login_register />

{#if $authModel}
	<div class="flex flex-row gap-4 items-center">
		<SyncIndicator />
		<details class="dropdown">
			<summary class="btn m-1">
				<User class="size-[1.2em]" />
				{$authModel?.surname}
			</summary>
			<ul class="menu dropdown-content bg-base-100 rounded-box z-1 w-[10dvw] p-2 shadow-sm">
				<li><button>Account</button></li>
				<li><button onclick={() => logout()}>Log uit</button></li>
			</ul>
		</details>
	</div>
{:else}
	<div class="flex grow-1 basis-0 justify-center">
		<button class="btn" onclick={() => login_register?.showModal()}
			><LogIn class="size-[1.2em]" />
			<span class="hidden md:block">{$_('login_register')}</span></button
		>
	</div>
{/if}
