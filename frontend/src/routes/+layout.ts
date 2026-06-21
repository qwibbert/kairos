import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en';
import nl from '../locales/nl';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	await i18next.use(LanguageDetector).init({
		debug: true,
		ns: [
			'account',
			'changelog',
			'common',
			'session',
			'settings',
			'statistics',
			'vines',
			'onboarding',
		],
		resources: {
			en,
			nl,
		},
	});
};

export const ssr = false;
