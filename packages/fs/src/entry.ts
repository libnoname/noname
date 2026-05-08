#!/usr/bin/env node
import minimist from "minimist";
import { defaultConfig, default as createApp } from "./index";

// 解析命令行参数
// 示例: -s --maxAge 100
createApp(
	minimist(process.argv.slice(2), {
		boolean: true,
		alias: { server: "s" },
		default: defaultConfig,
	}) as any
);
