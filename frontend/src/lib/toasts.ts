import { toast } from "@zerodevx/svelte-toast";

const THEME_SUCCESS = {
    '--toastColor': 'var(--color-success-content)',
    '--toastBackground': 'var(--color-success)',
    '--toastBarBackground': 'var(--color-success-content)',
};

const THEME_WARNING = {
    '--toastColor': 'var(--color-warning-content)',
    '--toastBackground': 'var(--color-warning)',
    '--toastBarBackground': 'var(--color-warning-content)',
};

const THEME_ERROR = {
    '--toastColor': 'var(--color-error-content)',
    '--toastBackground': 'var(--color-error)',
    '--toastBarBackground': 'var(--color-error-content)',
};

export type ToastDuration = number;

export const SHORT_DURATION: ToastDuration = 2000;
export const DEFAULT_DURATION: ToastDuration = 4000;
export const LONG_DURATION: ToastDuration = 8000;
export const EXTRA_LONG_DURATION: ToastDuration = 16000;

export interface ToastOptions {
    /** Show the toast progress bar (default: true)*/
    progress_bar?: boolean;

    /** Automatically dismiss the toast. If disabled, press the close button to dismiss. (default: true)*/
    auto_dismiss?: boolean;

    /** Change auto_dismiss duration (default: 2000ms) */
    duration?: ToastDuration;

    /** Callback to run on dismiss */
    on_dismiss?: () => void;
}

export type ToastType = 'success' | 'warning' | 'error' | 'progress';
export type ToastMessage = ToastSimpleMessage | ToastHeadedMessage | ToastHTMLMessage;
export type ToastSimpleMessage = { type: 'simple'; text: string };
export type ToastHeadedMessage = { type: 'headed'; header: string; text: string };
export type ToastHTMLMessage = { type: 'html'; html: string };

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
export function push_toast(
    type: ToastType,
    message: ToastMessage,
    options: ToastOptions = {
        progress_bar: true,
        auto_dismiss: true,
        duration: DEFAULT_DURATION,
        on_dismiss: () => { },
    },
) {
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