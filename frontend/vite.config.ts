import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import topLevelAwait from "vite-plugin-top-level-await";

import pkg from './package.json' with { type: 'json' };

export default defineConfig({
	plugins: [topLevelAwait(), sveltekit(), tailwindcss()],
	build: {
		sourcemap: true
	},
	server: {
		proxy: {
			'^/(api|_)/': {
				target: 'http://localhost:8090',
				changeOrigin: true,
			},
		},
	},
	define: {
		__KAIROS_VERSION__: `"${pkg.version}"`,
	},
	resolve: process.env.VITEST
		? {
			conditions: ['browser'],

			alias: {
				$lib: 'src/lib',
				$features: 'src/features',
				$components: 'src/components',

			}
		}
		: undefined
});
