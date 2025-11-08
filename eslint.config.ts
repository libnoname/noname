import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import ts from "typescript-eslint";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import globals from "globals";

export default defineConfig(globalIgnores(["dist", "node_modules"]), js.configs.recommended, ts.configs.recommended, vue.configs["flat/essential"], {
	files: ["**/*.js", "**/*.mts", "**/*.cts", "**/*.ts", "**/*.vue"],
	rules: {
		"@typescript-eslint/no-require-imports": 0,
		"@typescript-eslint/no-unused-vars": 0,
		"@typescript-eslint/no-unused-expressions": 0,
		"@typescript-eslint/no-this-alias": 0,
		"@typescript-eslint/no-explicit-any": 0,
		"@typescript-eslint/no-unsafe-function-type": 0,
		"vue/multi-word-component-names": 0,
		"no-class-assign": 0,
		"no-console": 0,
		"@typescript-eslint/ban-ts-comment": [
			"error",
			{
				"ts-ignore": false,
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
		// curly: "error",
	},
	languageOptions: {
		ecmaVersion: 13,
		sourceType: "module",
		parser: vueParser,
		parserOptions: {
			parser: ts.parser,
		},
		globals: {
			...globals.browser,
			...globals.es2015,
			...globals.node,
			...globals.serviceworker,
			...globals.worker,
		},
	},
});
