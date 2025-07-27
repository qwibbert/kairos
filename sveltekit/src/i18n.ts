import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

register('en', () => import('./locales/en.json'));
register('nl', () => import('./locales/nl.json'));

init({
  fallbackLocale: 'en',
  initialLocale: browser ? window.navigator.language : 'en',
});