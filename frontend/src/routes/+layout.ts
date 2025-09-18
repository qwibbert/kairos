import i18next from 'i18next';
import en from '../locales/en';
import nl from '../locales/nl';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	await i18next.init({
		lng: 'en', // if you're using a language detector, do not define the lng option
		debug: true,
		ns: ['account', 'common', 'session', 'settings', 'statistics', 'vines'],
		resources: {
			en,
			nl
		}
	});
}

export const ssr = false;