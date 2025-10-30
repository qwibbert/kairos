<script lang="ts">
	import { LogIn } from 'lucide-svelte';
	import User from 'lucide-svelte/icons/user';

	import { logout } from '$lib/pocketbase/';

	import { get_app_state } from '$lib/context';
	import LoginRegister from '$lib/pocketbase/login-register.svelte';
	import i18next from 'i18next';
	import { modals } from 'svelte-modals';
	import SyncIndicator from './sync-indicator.svelte';

	const app_state = get_app_state();
</script>

{#if app_state.user}
	<div class="flex flex-row gap-4 items-center">
		<SyncIndicator />
		<details class="dropdown">
			<summary class="btn m-1">
				<User class="size-[1.2em]" />
				{app_state.user.surname}
			</summary>
			<ul class="menu dropdown-content bg-base-100 rounded-box z-1 w-[10dvw] p-2 shadow-sm">
				<li><button>{i18next.t("account:account")}</button></li>
				<li><button onclick={() => logout()}>Log uit</button></li>
			</ul>
		</details>
	</div>
{:else}
	<div class="flex grow-1 basis-0 justify-center">
		<button class="btn" onclick={() => modals.open(LoginRegister)}
			><LogIn class="size-[1.2em]" />
			<span class="hidden md:block">{i18next.t('account:login_register')}</span></button
		>
	</div>
{/if}
