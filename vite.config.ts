import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [paraglideVitePlugin({ project: './project.inlang', 
		outdir: './src/paraglide', strategy: ['preferredLanguage', 'baseLocale'] }), enhancedImages(), tailwindcss(), sveltekit()],
});
