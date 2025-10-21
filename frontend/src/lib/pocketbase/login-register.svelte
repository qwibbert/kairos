<script lang="ts">
	import i18next from 'i18next';

	import { push_toast } from '$lib/toasts';
	import { login } from './';

	interface Props {
		isOpen: boolean;
		close: () => {};
	}
	const { isOpen, close }: Props = $props();

	let dialog_el: HTMLDialogElement | null = $state(null);

	$effect(() => {
		if (dialog_el && isOpen && !dialog_el.open) {
			dialog_el.showModal();
		} else if (dialog_el && !isOpen && dialog_el.open) {
			dialog_el.requestClose();
		}
	});

	let active_tab: 'LOGIN' | 'REGISTER' = $state('LOGIN');
	let email = $state('');
	let password = $state('');
	let password_confirm = $state('');
	let surname = $state('');
	let name = $state('');
	let invalid_credentials = $state(false);
	let email_in_use = $state(false);
	let other_error = $state(false);

	const password_pattern = "(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}";

	async function handle_register(email: string, password: string, surname: string, name: string) {
		const result = await login(email, password, true, { surname, name });

		if (result == 'EMAIL_IN_USE') {
			email_in_use = true;
		} else if (result == 'OTHER_ERROR') {
			other_error = true;
			push_toast('error', { type: 'headed', header: 'Server Error', text: 'Failed to create account, please try again later.' });
		} else if (result == 'SUCCESS') {
			email_in_use = false;
			other_error = false;
			invalid_credentials = false;
			close();
		}
	}

	async function handle_login(email: string, password: string) {
		const result = await login(email, password);

		if (result == 'INVALID_CREDENTIALS') {
			invalid_credentials = true;
		}

		if (result == 'SUCCESS') {
			invalid_credentials = false;
			close();
		}
	}
</script>

<dialog
	bind:this={dialog_el}
	class="modal"
	onclose={(e) => {
		e.preventDefault();
		close();
	}}
>
	<div class="modal-box flex flex-col items-center">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<h3 class="text-lg font-bold self-baseline">{i18next.t('account:login_register')}</h3>
		<div class="flex flex-col mt-5 items-center gap-3 w-full">
			<div role="tablist" class="tabs tabs-box">
				<a
					role="tab"
					onclick={() => (active_tab = 'LOGIN')}
					class={['tab', active_tab == 'LOGIN' ? 'tab-active' : '']}>{i18next.t('account:login')}</a
				>
				<a
					role="tab"
					onclick={() => (active_tab = 'REGISTER')}
					class={['tab', active_tab == 'REGISTER' ? 'tab-active' : '']}
					>{i18next.t('account:register')}</a
				>
			</div>
		</div>
		<form class="flex flex-col items-center gap-3 w-full mt-5" onsubmit={
			async () =>
					active_tab == 'LOGIN'
						? await handle_login(email, password)
						: await handle_register(email, password, surname, name)
		}>
			{#if active_tab == 'REGISTER'}
				<div class="flex flex-row gap-2">
					<fieldset class="fieldset">
						<legend class="fieldset-legend">{i18next.t('account:surname')}</legend>
						<input
							bind:value={surname}
							type="text"
							class="input"
							placeholder={i18next.t('account:surname_placeholder')}
						/>
					</fieldset>
					<fieldset class="fieldset">
						<legend class="fieldset-legend">{i18next.t('account:name')}</legend>
						<input
							bind:value={name}
							type="text"
							class="input"
							placeholder={i18next.t('account:name_placeholder')}
						/>
					</fieldset>
				</div>
			{/if}
			<fieldset class="fieldset">
				<legend class="fieldset-legend">{i18next.t('account:e_mail')}</legend>
				<input
					bind:value={email}
					type="email"
					class={[
						'input',
						invalid_credentials || email_in_use || other_error ? 'input-error' : active_tab == 'REGISTER' ? 'validator' : '',
					]}
					placeholder={i18next.t('account:e_mail_placeholder')}
				/>
				<div class="validator-hint hidden">Enter valid email address</div>
				{#if active_tab == 'REGISTER' && email_in_use}
						<div class="text-error">This email address is already in use</div>
				{/if}
			</fieldset>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">{i18next.t('account:password')}</legend>
				<input
					bind:value={password}
					type="password"
					class={[
						'input',
						invalid_credentials ? 'input-error' : active_tab == 'REGISTER' ? 'validator' : '',
					]}
					title={active_tab == 'REGISTER'
						? 'Must be more than 8 characters'
						: ''}
					placeholder={i18next.t('account:password_placeholder')}
					minlength={active_tab == 'REGISTER' ? 8 : undefined}
				/>
				<p class="validator-hint hidden">
					Must be more than 8 characters
				</p>
			</fieldset>
			{#if active_tab == 'REGISTER'}
				<fieldset class="fieldset">
					<legend class="fieldset-legend">{i18next.t('account:password_confirm')}</legend>
					<input
						bind:value={password_confirm}
						type="password"
						required
						pattern={password}
						class={[
							'input',
							invalid_credentials ? 'input-error' : active_tab == 'REGISTER' ? 'validator' : '',
						]}
						placeholder={i18next.t('account:password_confirm_placeholder')}
					/>
					<p class="validator-hint hidden">Passwords must match</p>
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
				>{active_tab == 'LOGIN'
					? i18next.t('account:login')
					: i18next.t('account:register')}</button
			>
		</form>
	</div>
</dialog>
