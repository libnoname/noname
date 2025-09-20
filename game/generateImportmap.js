const fs = require("fs");
const path = require("path");

const importMap = {
	imports: {
		vue: "./game/vue.esm-browser.js",
		typescript: "./game/typescript.js",
		"@vue/devtools-api": "./game/empty-devtools-api.js",
		"@/": "./",
		"@vue/": "./node_modules/@types/noname-typings/@vue/",
		// codemirror6
		codemirror: "./game/codemirror6.js",
		"@codemirror/autocomplete": "./game/@codemirror/autocomplete/index.js",
		"@codemirror/commands": "./game/@codemirror/commands/index.js",
		"@codemirror/lang-css": "./game/@codemirror/lang-css/index.js",
		"@codemirror/lang-html": "./game/@codemirror/lang-html/index.js",
		"@codemirror/lang-javascript": "./game/@codemirror/lang-javascript/index.js",
		"@codemirror/lang-json": "./game/@codemirror/lang-json/index.js",
		"@codemirror/lang-markdown": "./game/@codemirror/lang-markdown/index.js",
		"@codemirror/lang-vue": "./game/@codemirror/lang-vue/index.js",
		"@codemirror/language": "./game/@codemirror/language/index.js",
		"@codemirror/lint": "./game/@codemirror/lint/index.js",
		"@codemirror/search": "./game/@codemirror/search/index.js",
		"@codemirror/state": "./game/@codemirror/state/index.js",
		"@codemirror/view": "./game/@codemirror/view/index.js",
		// codemirror6的依赖
		"@lezer/common": "/node_modules/@lezer/common/dist/index.js",
		"@lezer/common/": "/node_modules/@lezer/common/",
		"@lezer/css": "/node_modules/@lezer/css/dist/index.js",
		"@lezer/css/": "/node_modules/@lezer/css/",
		"@lezer/html": "/node_modules/@lezer/html/dist/index.js",
		"@lezer/html/": "/node_modules/@lezer/html/",
		"@lezer/javascript": "/node_modules/@lezer/javascript/dist/index.js",
		"@lezer/javascript/": "/node_modules/@lezer/javascript/",
		"@lezer/json": "/node_modules/@lezer/json/dist/index.js",
		"@lezer/json/": "/node_modules/@lezer/json/",
		"@lezer/markdown": "/node_modules/@lezer/markdown/dist/index.js",
		"@lezer/markdown/": "/node_modules/@lezer/markdown/",
		"@lezer/lr": "/node_modules/@lezer/lr/dist/index.js",
		"@lezer/lr/": "/node_modules/@lezer/lr/",
		"@lezer/highlight": "/node_modules/@lezer/highlight/dist/index.js",
		"@lezer/highlight/": "/node_modules/@lezer/highlight/",
		"style-mod": "/node_modules/style-mod/src/style-mod.js",
		"style-mod/": "/node_modules/style-mod/",
		crelt: "/node_modules/crelt/index.js",
		"crelt/": "/node_modules/crelt/",
		"@marijn/find-cluster-break": "/node_modules/@marijn/find-cluster-break/src/index.js",
		"@marijn/find-cluster-break/": "/node_modules/@marijn/find-cluster-break/",
		"w3c-keyname": "/node_modules/w3c-keyname/index.js",
		"w3c-keyname/": "/node_modules/w3c-keyname/",
	},
	scopes: {},
};

const parseJson = (/** @type { string } */ path) => {
	const content = fs.readFileSync(path, "utf-8");
	try {
		return JSON.parse(content);
	} catch (error) {
		return eval(`JSON.stringify(${content})`);
	}
};

// 同步读取 package.json 和 tsconfig.json
const pkgPath = path.join(__dirname, "../package.json");
const tsconfigPath = path.join(__dirname, "../tsconfig.json");

const pkg = parseJson(pkgPath);
const tsconfig = parseJson(tsconfigPath);

const { baseUrl = ".", paths = {} } = tsconfig.compilerOptions || {};

// 第一步：处理 tsconfig.json 的 paths
for (const key in paths) {
	const [target] = paths[key];
	if (importMap.imports[key]) continue;
	const mappedPath = target.endsWith("/*") ? target.slice(0, -2) : target;
	const normalizedKey = key.endsWith("/*") ? key.slice(0, -2) + "/" : key + "/";
	const fullPath = baseUrl === "." ? mappedPath : `${baseUrl}/${mappedPath}`;
	const urlPath = fullPath.startsWith("./") ? fullPath.slice(2) : fullPath;
	importMap.imports[normalizedKey] = `/${urlPath.replace(/^\//, "")}/`;
}

// 第二步：处理 dependencies 和 devDependencies
const processedModules = new Set();
const queue = [];
const topLevelDeps = { ...pkg.dependencies, ...pkg.devDependencies };
const browserFriendlyExtensions = [".esm-browser.js", ".esm.browser.js", ".browser.esm.js", ".esm.js", ".mjs"];

for (const moduleName of Object.keys(topLevelDeps)) {
	if (!processedModules.has(moduleName) && !importMap.imports[moduleName]) {
		queue.push(moduleName);
		processedModules.add(moduleName);
	}
}

while (queue.length > 0) {
	/** @type {string} */
	// @ts-ignore
	const moduleName = queue.shift();
	console.log("正在处理模块", moduleName);
	try {
		const modPkgPath = path.join(__dirname, "../node_modules", moduleName, "package.json");
		const modPkg = parseJson(modPkgPath);

		let moduleEntry = modPkg.module || modPkg.main;

		if (!moduleEntry || !/\.(js|mjs)$/i.test(moduleEntry)) {
			console.log(`过滤非 ESM 的入口的模块 ${moduleName}`);
			continue;
		}

		// 获取模块在 node_modules 中的真实路径
		const moduleRootDir = path.join(__dirname, "../node_modules", moduleName);

		// 解析 module 字段的目录和文件名
		const moduleRelativePath = moduleEntry.startsWith("./") ? moduleEntry.slice(2) : moduleEntry;
		const moduleFullPath = path.join(moduleRootDir, moduleRelativePath);

		const moduleDir = path.dirname(moduleFullPath); // 如 dist/
		const moduleBaseName = path.basename(moduleRelativePath, path.extname(moduleRelativePath));

		let resolvedPath;

		// 同步读取目标目录下的文件
		try {
			const files = fs.readdirSync(moduleDir);

			for (const ext of browserFriendlyExtensions) {
				const tryFilename = `${moduleBaseName}${ext}`;
				if (files.includes(tryFilename)) {
					// 构造最终路径：例如 /node_modules/pinia/dist/pinia.esm-browser.js
					resolvedPath = `/node_modules/${moduleName}/${path.relative(moduleRootDir, path.join(moduleDir, tryFilename)).replace(/\\/g, "/")}`;
					break;
				}
			}
		} catch (err) {
			console.warn(`无法读取目录 ${moduleDir}`, err);
		}

		// 注：有import 包名的时候又没有提供browser兼容的js可以用这个
		// 或许可以使用require esm判断引入
		if (!resolvedPath) {
			// 尝试使用原始模块名
			resolvedPath = `/node_modules/${moduleName}/${moduleEntry.replace(/\\/g, "/")}`;
		}

		if (resolvedPath) {
			importMap.imports[moduleName] = resolvedPath;
			importMap.imports[`${moduleName}/`] = `/node_modules/${moduleName}/`;
			console.log(`已处理模块 ${moduleName}，入口文件为 ${resolvedPath}`);
		} else {
			console.warn(`无法处理模块 ${moduleName}`);
			continue;
		}

		console.log(`正在处理模块 ${moduleName} 的依赖...`);
		const deps = { ...modPkg.dependencies, ...modPkg.devDependencies };
		for (const depName of Object.keys(deps)) {
			if (!processedModules.has(depName)) {
				queue.push(depName);
				processedModules.add(depName);
			}
		}
	} catch (e) {
		console.warn(`无法加载模块 ${moduleName} 的 package.json`);
	}
}

// console.log("importmap", importMap);
const js = `// 具体功能参考 https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/script/type/importmap
if (typeof HTMLScriptElement.supports === 'function' && HTMLScriptElement.supports('importmap')) {
  const importMap = ${JSON.stringify(importMap, null, 2)}
  if (
    typeof window.require == "function" &&
    typeof window.process == "object" &&
    typeof window.__dirname == "string"
  ) {
    // 使importMap解析node内置模块
    const builtinModules = require("module").builtinModules;
    if (Array.isArray(builtinModules)) {
      for (const module of builtinModules) {
        importMap.imports[module] = importMap.imports[\`node:\${module}\`] =
          \`./noname-builtinModules/\${module}\`;
      }
    }
  }
  const im = document.createElement("script");
  im.type = "importmap";
  im.textContent = JSON.stringify(importMap, null, 2);
  // @ts-ignore
  document.currentScript.after(im);
}`;
fs.writeFileSync(path.join(__dirname, "importmap.js"), js);
