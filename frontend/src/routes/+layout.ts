import universalLanguageDetect from '@unly/universal-language-detector';
import i18next from 'i18next';
import en from '../locales/en';
import nl from '../locales/nl';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	const lang = universalLanguageDetect({
		supportedLanguages: ['nl', 'en'],
		fallbackLanguage: 'en'
	});

	await i18next.init({
		debug: true,
		lng: lang,
		ns: ['account', 'common', 'session', 'settings', 'statistics', 'vines'],
		resources: {
			en,
			nl
		}
	});
}

export const ssr = false;