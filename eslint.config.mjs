import js from "@eslint/js";
import ts from "typescript-eslint";
import vue from "eslint-plugin-vue";
import globals from "globals";

const ignores = ["node_modules/", "noname-server.js", "tsconfig.json", "game/codemirror.js", "game/jszip.js", "game/pressure.js", "game/compiler-sfc.esm-browser.js", "game/core-js-bundle.js", "game/dedent.js", "game/typescript.js", "game/vue.esm-browser.js", "game/NoSleep.js"];

export default ts.config(
	{
		...js.configs.recommended,
		ignores,
	},
	ts.configs.recommended.map(config => ({
		...config,
		ignores,
	})),
	vue.configs["flat/essential"].map(config => ({
		...config,
		ignores,
	})),
	{
		ignores,
		files: ["**/*.js", "**/*.mjs", "**/*.ts", "**/*.vue"],
		rules: {
			"@typescript-eslint/no-require-imports": 0,
			"@typescript-eslint/no-unused-vars": 0,
			"@typescript-eslint/no-unused-expressions": 0,
			"@typescript-eslint/no-this-alias": 0,
			"@typescript-eslint/no-explicit-any": 0,
			"vue/multi-word-component-names": 0,
			"no-class-assign": 0,
			"no-console": 0,
			"@typescript-eslint/ban-ts-comment": [
				"error",
				{
					"ts-nocheck": false,
				},
			],
			"no-constant-condition": [
				"error",
				{
					checkLoops: false,
				},
			],
			"no-irregular-whitespace": [
				"error",
				{
					skipStrings: true,
					skipTemplates: true,
				},
			],
			"prefer-const": 0,
			"no-redeclare": 0,
			"no-undef": 0,
			"no-empty": [
				"error",
				{
					allowEmptyCatch: true,
				},
			],
			"no-unused-vars": 0,
			"require-yield": 0,
			"no-fallthrough": ["error", { commentPattern: "\\[falls[\\s\\w]*through\\]" }],
			curly: "error",
		},
		languageOptions: {
			ecmaVersion: 13,
			sourceType: "module",
			globals: {
				...globals.browser,
				...globals.es2015,
				...globals.node,
				...globals.serviceworker,
				...globals.worker,
			},
		},
	}
);
