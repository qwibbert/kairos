<script lang="ts">
	import { _ } from 'svelte-i18n';

	import { login } from '.';

	interface Props {
		login_register: HTMLDialogElement | undefined;
	}

	let { login_register = $bindable() }: Props = $props();

	let active_tab: 'LOGIN' | 'REGISTER' = $state('LOGIN');
	let email = $state('');
	let password = $state('');
	let password_confirm = $state('');
	let surname = $state('');
	let name = $state('');

	async function handle_register(email: string, password: string, surname: string, name: string) {
		await login(email, password, true, { surname, name });
		login_register?.close();
	}

	async function handle_login(email: string, password: string) {
		await login(email, password);
		login_register?.close();
	}
</script>

<dialog bind:this={login_register} class="modal">
	<div class="modal-box flex flex-col items-center">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<h3 class="text-lg font-bold self-baseline">{$_('login_register')}</h3>
		<div class="flex flex-col mt-5 items-center gap-3 w-full">
			<div role="tablist" class="tabs tabs-box">
				<a
					role="tab"
					onclick={() => (active_tab = 'LOGIN')}
					class={['tab', active_tab == 'LOGIN' ? 'tab-active' : '']}>{$_('login')}</a
				>
				<a
					role="tab"
					onclick={() => (active_tab = 'REGISTER')}
					class={['tab', active_tab == 'REGISTER' ? 'tab-active' : '']}>{$_('register')}</a
				>
			</div>
		</div>
		<form class="flex flex-col items-center gap-3 w-full mt-5">
			{#if active_tab == 'REGISTER'}
				<div class="flex flex-row gap-2">
					<fieldset class="fieldset">
						<legend class="fieldset-legend">{$_('surname')}</legend>
						<input
							bind:value={surname}
							type="text"
							class="input"
							placeholder={$_('surname_placeholder')}
						/>
					</fieldset>
					<fieldset class="fieldset">
						<legend class="fieldset-legend">{$_('name')}</legend>
						<input
							bind:value={name}
							type="text"
							class="input"
							placeholder={$_('name_placeholder')}
						/>
					</fieldset>
				</div>
			{/if}
			<fieldset class="fieldset">
				<legend class="fieldset-legend">{$_('e_mail')}</legend>
				<input
					bind:value={email}
					type="text"
					class="input"
					placeholder={$_('e_mail_placeholder')}
				/>
			</fieldset>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">{$_('password')}</legend>
				<input
					bind:value={password}
					type="password"
					class="input"
					placeholder={$_('password_placeholder')}
				/>
			</fieldset>
			{#if active_tab == 'REGISTER'}
				<fieldset class="fieldset">
					<legend class="fieldset-legend">{$_('password_confirm')}</legend>
					<input
						bind:value={password_confirm}
						type="password"
						class="input"
						placeholder={$_('password_confirm_placeholder')}
					/>
				</fieldset>
				<p>
					Bij het aanmaken van een account ga je akkoord met onze <a href="privacy.pdf" class="link"
						>privacy-verklaring</a
					>.
				</p>
			{/if}
			<button
				disabled={active_tab == 'LOGIN'
					? email == '' || password == ''
					: email == '' ||
						password == '' ||
						password_confirm == '' ||
						name == '' ||
						surname == '' ||
						password != password_confirm}
				class="btn mt-5"
				type="submit"
				onclick={async () =>
					active_tab == 'LOGIN'
						? await handle_login(email, password)
						: await handle_register(email, password, surname, name)}
				>{active_tab == 'LOGIN' ? $_('login') : $_('register')}</button
			>
		</form>
	</div>
</dialog>
