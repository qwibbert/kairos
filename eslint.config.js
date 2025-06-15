import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import boundaries from 'eslint-plugin-boundaries';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		rules: { // typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
			// see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			"no-undef": 'off'
		}
	},
	{
		files: [
			'**/*.svelte',
			'**/*.svelte.ts',
			'**/*.svelte.js'
		],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	},
	{
		plugins: {
			boundaries: boundaries
		},
		settings: {
			"boundaries/include": ["src/**/*"],
			"boundaries/elements": [
				{
					"mode": "full",
					"type": "shared",
					"pattern": [
						"src/components/**/*",
						"src/data/**/*",
						"src/hooks/**/*",
						"src/lib/**/*",
						"src/db/**/*",
						"src/paraglide/**/*"
					]
				},
				{
					"mode": "full",
					"type": "feature",
					"capture": ["featureName"],
					"pattern": ["src/features/*/**/*"]
				},
				{
					"mode": "full",
					"type": "routes",
					"capture": ["_", "fileName"],
					"pattern": ["src/routes/**/*"]
				},
				{
					"mode": "full",
					"type": "neverImport",
					"pattern": ["src/*"]
				}
			]
		},
		"rules": {
			"boundaries/no-unknown": ["error"],
			"boundaries/no-unknown-files": ["error"],
			"boundaries/element-types": [
				"error",
				{
					"default": "disallow",
					"rules": [
						{
							"from": ["shared"],
							"allow": ["shared"]
						},
						{
							"from": ["feature"],
							"allow": [
								"shared",
								["feature", { "featureName": "${from.featureName}" }]
							]
						},
						{
							"from": ["routes", "neverImport"],
							"allow": ["shared", "feature"]
						},
						{
							"from": ["routes"],
							"allow": [["routes", { "fileName": "*.css" }]]
						}
					]
				}
			]
		}
	},
);
