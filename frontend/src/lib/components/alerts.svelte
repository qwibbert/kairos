<script lang="ts" module>
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import Info from 'lucide-svelte/icons/info';
	import TriangleAlert from 'lucide-svelte/icons/triangle-alert';

	const options = {};

	const THEME_SUCCESS = {
		'--toastColor': 'var(--color-success-content)',
		'--toastBackground': 'var(--color-success)',
		'--toastBarBackground': 'var(--color-success-content)',
	};

	const THEME_WARNING = {
		'--toastColor': 'var(--color-success-content)',
		'--toastBackground': 'var(--color-success)',
		'--toastBarBackground': 'var(--color-success-content)',
	};

	const THEME_ERROR = {
		'--toastColor': 'var(--color-error-content)',
		'--toastBackground': 'var(--color-error)',
		'--toastBarBackground': 'var(--color-error-content)',
	};

	type ToastDuration = number;

	export const SHORT_DURATION: ToastDuration = 2000;
	export const DEFAULT_DURATION: ToastDuration = 4000;
	export const LONG_DURATION: ToastDuration = 8000;
	export const EXTRA_LONG_DURATION: ToastDuration = 16000;

	interface ToastOptions {
		/** Show the toast progress bar (default: true)*/
		progress_bar?: boolean;

		/** Automatically dismiss the toast. If disabled, press the close button to dismiss. (default: true)*/
		auto_dismiss?: boolean;

		/** Change auto_dismiss duration (default: 2000ms) */
		duration?: ToastDuration;

		/** Callback to run on dismiss */
		on_dismiss?: () => void;
	}

	type ToastType = 'success' | 'warning' | 'error' | 'progress';
	type ToastMessage = ToastSimpleMessage | ToastHeadedMessage | ToastHTMLMessage;
	type ToastSimpleMessage = { type: 'simple'; text: string };
	type ToastHeadedMessage = { type: 'headed'; header: string; text: string };
	type ToastHTMLMessage = { type: 'html'; html: string };

	/**
	 * Displays a toast notification with customizable options.
	 *
	 * @param {ToastType} type - The type of toast to display ('success', 'warning', 'error', or 'progress').
	 * @param {ToastMessage} message - The message content for the toast. Can be of type 'simple', 'headed', or contain raw HTML.
	 * @param {ToastOptions} [options] - Optional settings for the toast:
	 *   @param {boolean} [options.progress_bar=true] - Whether to show a progress bar.
	 *   @param {boolean} [options.auto_dismiss=true] - Whether the toast should auto-dismiss.
	 *   @param {number} [options.duration=DEFAULT_DURATION] - Duration in milliseconds before auto-dismiss.
	 *   @param {Function} [options.on_dismiss=() => {}] - Callback function when the toast is dismissed.
	 *
	 * @returns {number|undefined} - Returns the toast id if applicable, otherwise undefined.
	 *
	 * @remarks
	 * - For 'progress' type, the toast is not dismissable and has a fixed duration for each progress change.
	 * - For other types, the theme and progress bar are customizable.
	 * - TODO: Add sanitization for HTML messages to prevent XSS vulnerabilities.
	 */
	export const push_toast = (
		type: ToastType,
		message: ToastMessage,
		options: ToastOptions = {
			progress_bar: true,
			auto_dismiss: true,
			duration: DEFAULT_DURATION,
			on_dismiss: () => {},
		},
	) => {
		let text = '';

		if (message.type == 'simple') {
			text = message.text;
		} else if (message.type == 'headed') {
			text = `<strong>${message.header}</strong><br>${message.text}`;
		} else {
			// TODO: add sanitization
			text = message.html;
		}

		if (type == 'progress') {
			return toast.push(text, {
				duration: 300, // Each progress change takes 300ms
				initial: 0,
				next: 0,
				dismissable: false,
			});
		} else {
			return toast.push(text, {
				theme: {
					...(type == 'success' ? THEME_SUCCESS : type == 'warning' ? THEME_WARNING : THEME_ERROR),
					'--toastBarHeight': options.progress_bar ? '6px' : 0,
				},
				initial: options.auto_dismiss == false ? 0 : 1,
				duration: options.duration,
				onpop: options.on_dismiss,
			});
		}
	};

	interface AlertDialog {
		id: string;
		type: 'INFO' | 'WARNING' | 'ERROR';
		header: string;
		text: string;
		dismissable: boolean;
		actions: Map<string, () => Promise<void>>;
	}

	let dialogs: AlertDialog[] = $state([]);

	export const alert_dialog = (options: AlertDialog) => {
		const id = crypto.randomUUID();

		dialogs = [...dialogs, { ...options, id}];
		(document.getElementById(id) as HTMLDialogElement).showModal();
	};

	// function onunhandledrejection(e: PromiseRejectionEvent) {
	// 	const header = e.reason.toString();

	// 	let text = '';

	// 	if (typeof e.reason.response == 'object' && Object.entries(e.reason.response).length != 0) {
	// 		const { data = {} } = e.reason.response ?? {};
	// 		for (const [key, value] of Object.entries(data)) {
	// 			text += `${key}: ${value?.message} <br>`;
	// 		}
	// 	}

	// 	push_toast(
	// 		'error',
	// 		{
	// 			type: text == '' ? 'simple' : 'headed',
	// 			header: text == '' ? undefined : header,
	// 			text: text == '' ? header : text,
	// 		},
	// 		{ duration: LONG_DURATION },
	// 	);
	// }
</script>

<!-- to display alerts for unhandled promise rejections -->
<!-- <svelte:window {onunhandledrejection} /> -->

{#each dialogs as dialog (dialog.id)}
	<dialog
		id={dialog.id}
		class="modal overflow-y-auto z-50"
		onclose={() => {
			dialogs = dialogs.filter((d) => d.id != dialog.id);
		}}
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
						dialog.type == 'WARNING' ? 'text-warning' : dialog.type == 'ERROR' ? 'text-error' : '',
					]}
				>
					{#if dialog.type == 'INFO'}
						<Info class="size-[1.2em]" />
					{:else if dialog.type == 'WARNING'}<TriangleAlert
							class="size-[1.2em]"
						/>{:else if dialog.type == 'ERROR'}<CircleAlert class="size-[1.2em]" />{/if}
					{dialog.header}
				</h3>
				{#if dialog.dismissable}
					<form method="dialog">
						<button class="btn btn-sm btn-circle btn-ghost">✕</button>
					</form>
				{/if}
			</div>
			<p>{@html dialog.text}</p>
			<div class="flex flex-row items-center justify-between mt-5">
				{#each dialog.actions as action (action[0])}
					<button
						class={[
							'btn ',
							dialog.type == 'WARNING' ? 'btn-warning' : dialog.type == 'ERROR' ? 'btn-error' : '',
						]}
						onclick={async (e) => {
							await action[1]();
							e.srcElement.parentElement?.parentElement?.parentElement?.close();
						}}>{action[0]}</button
					>
				{/each}
			</div>
		</div>
	</dialog>
{/each}

<SvelteToast {options} />
