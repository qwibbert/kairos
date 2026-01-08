import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			fallback: 'index.html',
		}),
		alias: {
			$lib: 'src/lib',
			$components: 'src/components',
			$db: 'src/db',
			src: path.resolve('./src')
		},
		files: {
			hooks: {
				client: 'src/hooks/hooks.client',
				server: 'src/hooks/hooks.server',
				universal: 'src/hooks/hooks/universal',
			},
		},
	},
	compilerOptions: {
		experimental: {
			async: true
		}
	}
};

export default config;
