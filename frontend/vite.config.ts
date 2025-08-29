import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

import pkg from './package.json' with { type: 'json' };

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
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
				conditions: ['browser']
			}
		: undefined
});
