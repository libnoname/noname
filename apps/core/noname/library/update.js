import { ui, game, lib } from "noname";

// https://github.com/libnoname/noname/archive/refs/tags/v1.10.10.zip

/**
 * HTTP响应头中的Rate Limit相关信息：
 * X-RateLimit-Limit: 请求总量限制
 * X-RateLimit-Remaining: 剩余请求次数
 * X-RateLimit-Reset: 限制重置时间（UTC时间戳）
 */

/** @type { HeadersInit } */
const defaultHeaders = {
	Accept: "application/vnd.github.v3+json",
	// 根据GitHub API的要求添加适当的认证头信息
	// 如果公共仓库则无需认证，私有仓库需提供token
	// 'Authorization': `token ${YOUR_GITHUB_PERSONAL_ACCESS_TOKEN}`
};

if (localStorage.getItem("noname_authorization")) {
	defaultHeaders["Authorization"] = `token ${localStorage.getItem("noname_authorization")}`;
}

/**
 * 获取github授权的token
 */
export async function gainAuthorization() {
	if (!localStorage.getItem("noname_authorization") && !sessionStorage.getItem("noname_authorization")) {
		const result = await game.promises.prompt("请输入您github的token以解除访问每小时60次的限制(可不输入)");
		if (typeof result == "string") {
			localStorage.setItem("noname_authorization", result);
			defaultHeaders["Authorization"] = `token ${localStorage.getItem("noname_authorization")}`;
		} else {
			sessionStorage.setItem("noname_authorization", "false");
		}
	}
}

const defaultResponse = async (/** @type {Response} */ response) => {
	const limit = response.headers.get("X-RateLimit-Limit");
	const remaining = response.headers.get("X-RateLimit-Remaining");
	const reset = response.headers.get("X-RateLimit-Reset");
	console.log(`请求总量限制`, limit);
	console.log(`剩余请求次数`, remaining);
	// @ts-expect-error ignore
	console.log(`限制重置时间`, new Date(reset * 1000).toLocaleString());
	if ((Number(remaining) === 0 && !sessionStorage.getItem("noname_authorization") && confirm(`您达到了每小时${limit}次的访问限制，是否输入您github账号的token以获取更高的请求总量限制`)) || (response.status === 401 && (localStorage.removeItem("noname_authorization"), true) && (alert(`身份验证凭证错误，是否重新输入您github账号的token以获取更高的请求总量限制`), true))) {
		return gainAuthorization();
	}
};

/**
 * 字节转换
 * @param { number } limit
 */
export function parseSize(limit) {
	let size = "";
	if (limit < 1 * 1024) {
		// 小于1KB，则转化成B
		size = limit.toFixed(2) + "B";
	} else if (limit < 1 * 1024 * 1024) {
		// 小于1MB，则转化成KB
		size = (limit / 1024).toFixed(2) + "KB";
	} else if (limit < 1 * 1024 * 1024 * 1024) {
		// 小于1GB，则转化成MB
		size = (limit / (1024 * 1024)).toFixed(2) + "MB";
	} else {
		// 其他转化成GB
		size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
	}

	// 转成字符串
	let sizeStr = size + "";
	// 获取小数点处的索引
	let index = sizeStr.indexOf(".");
	// 获取小数点后两位的值
	let dou = sizeStr.slice(index + 1, 2);
	// 判断后两位是否为00，如果是则删除00
	if (dou == "00") {
		return sizeStr.slice(0, index) + sizeStr.slice(index + 3, 2);
	}
	return size;
}

/**
 * 对比版本号
 * @param { string } ver1 版本号1
 * @param { string } ver2 版本号2
 * @returns { -1 | 0 | 1 } -1为ver1 < ver2, 0为ver1 == ver2, 1为ver1 > ver2
 * @throws {Error}
 */
export function checkVersion(ver1, ver2) {
	if (typeof ver1 !== "string") {ver1 = String(ver1);}
	if (typeof ver2 !== "string") {ver2 = String(ver2);}

	// 移除 'v' 开头
	if (ver1.startsWith("v")) {ver1 = ver1.slice(1);}
	if (ver2.startsWith("v")) {ver2 = ver2.slice(1);}

	// 验证版本号格式
	if (/[^0-9.-]/i.test(ver1) || /[^0-9.-]/i.test(ver2)) {
		throw new Error("Invalid characters found in the version numbers");
	}

	/** @param { string } str */
	function* walk(str) {
		let part = "";
		for (const char of str) {
			if (char === "." || char === "-") {
				if (part) {yield Number(part);}
				part = "";
			} else {
				part += char;
			}
		}
		if (part) {yield Number(part);}
	}

	const iterator1 = walk(ver1);
	const iterator2 = walk(ver2);

	while (true) {
		const iter1 = iterator1.next();
		const iter2 = iterator2.next();
		let { value: item1 } = iter1;
		let { value: item2 } = iter2;

		// 如果任意一个迭代器已经没有剩余值，将该值视为0
		item1 = item1 === undefined ? 0 : item1;
		item2 = item2 === undefined ? 0 : item2;

		if (isNaN(item1) || isNaN(item2)) {
			throw new Error("Non-numeric part found in the version numbers");
		} else if (item1 > item2) {
			return 1;
		} else if (item1 < item2) {
			return -1;
		} else {
			if (iter1.done && iter2.done) {break;}
		}
	}

	// 若正常遍历结束，说明版本号相等
	return 0;
}

/**
 *
 * 获取指定仓库的tags
 * @param { Object } options
 * @param { string } [options.username = 'libnoname'] 仓库拥有者
 * @param { string } [options.repository = 'noname'] 仓库名称
 * @param { string } [options.accessToken] 身份令牌
 * @returns { Promise<{ commit: { sha: string, url: string }, name: string, node_id: string, tarball_url: string, zipball_url: string }[]> }
 *
 * @example
 * ```js
 * getRepoTags().then(tags => {
 * 	console.log("All tags:", tags.map(tag => tag.name));
 * 	// 获取最新tag（假设按时间顺序排列，最新tag在数组首位）
 * 	const latestTag = tags[0].name;
 * 	console.log("Latest tag:", latestTag);
 * });
 * ```
 */
export async function getRepoTags(options = { username: "libnoname", repository: "noname" }) {
	// if (!localStorage.getItem("noname_authorization")) {
	// 	await gainAuthorization();
	// }
	const { username = "libnoname", repository = "noname", accessToken } = options;
	const headers = Object.assign({}, defaultHeaders);
	if (accessToken) {
		headers["Authorization"] = `token ${accessToken}`;
	}
	const url = `https://api.github.com/repos/${username}/${repository}/tags`;
	const response = await fetch(url, { headers });
	await defaultResponse(response);
	if (response.ok) {
		const data = await response.json();
		return data;
	} else {
		throw new Error(`Error fetching tags: ${response.statusText}`);
	}
}

/**
 * 获取指定仓库的指定tags的描述
 * @param { string } tagName tag名称
 * @param { Object } options
 * @param { string } [options.username = 'libnoname'] 仓库拥有者
 * @param { string } [options.repository = 'noname'] 仓库名称
 * @param { string } [options.accessToken] 身份令牌
 * @example
 * ```js
 * getRepoTagDescription('v1.10.10')
 * 	.then(description => console.log(description))
 * 	.catch(error => console.error('Failed to fetch description:', error));
 * ```
 */

export async function getRepoTagDescription(tagName, options = { username: "libnoname", repository: "noname" }) {
	// if (!localStorage.getItem("noname_authorization")) {
	// 	await gainAuthorization();
	// }
	const { username = "libnoname", repository = "noname", accessToken } = options;
	const headers = Object.assign({}, defaultHeaders);
	if (accessToken) {
		headers["Authorization"] = `token ${accessToken}`;
	}
	const apiUrl = `https://api.github.com/repos/${username}/${repository}/releases/tags/${tagName}`;
	const response = await fetch(apiUrl, { headers });
	await defaultResponse(response);
	if (!response.ok) {
		throw new Error(`Request failed with status ${response.status}`);
	}
	const releaseData = await response.json();
	// console.log(releaseData);
	// 从json里拿我们需要的
	return {
		/** @type { { browser_download_url: string, content_type: string, name: string, size: number }[] } tag额外上传的素材包 */
		assets: releaseData.assets,
		author: {
			/** @type { string } 用户名 */
			login: releaseData.author.login,
			/** @type { string } 用户头像地址 */
			avatar_url: releaseData.author.avatar_url,
			/** @type { string } 用户仓库地址 */
			html_url: releaseData.author.html_url,
		},
		/** @type { string } tag描述 */
		body: releaseData.body,
		// created_at: (new Date(releaseData.created_at)).toLocaleString(),
		/** @type { string } tag页面 */
		html_url: releaseData.html_url,
		/** @type { string } tag名称 */
		name: releaseData.name,
		/** 发布日期 */
		published_at: new Date(releaseData.published_at).toLocaleString(),
		/** @type { string } 下载地址 */
		zipball_url: releaseData.zipball_url,
	};
}

/**
 *
 * 获取仓库指定分支和指定(单个)目录内的所有文件和目录
 * @param { string } [path = ''] 路径名称(可放参数)
 * @param { string } [branch = ''] 仓库分支名称
 * @param { Object } options
 * @param { string } [options.username = 'libnoname'] 仓库拥有者
 * @param { string } [options.repository = 'noname'] 仓库名称
 * @param { string } [options.accessToken] 身份令牌
 * @returns { Promise<({ download_url: string, name: string, path: string, sha: string, size: number, type: 'file' } | { download_url: null, name: string, path: string, sha: string, size: 0, type: 'dir' })[]> }
 * @example
 * ```js
 * getRepoFilesList()
 * 	.then(files => console.log(files))
 * 	.catch(error => console.error('Failed to fetch files:', error));
 * ```
 */
export async function getRepoFilesList(path = "", branch, options = { username: "libnoname", repository: "noname" }) {
	// if (!localStorage.getItem("noname_authorization")) {
	// 	await gainAuthorization();
	// }
	const { username = "libnoname", repository = "noname", accessToken } = options;
	const headers = Object.assign({}, defaultHeaders);
	if (accessToken) {
		headers["Authorization"] = `token ${accessToken}`;
	}
	let url = `https://api.github.com/repos/${username}/${repository}/contents/${path}`;
	if (typeof branch == "string" && branch.length > 0) {
		const pathURL = new URL(url);
		const searchParams = new URLSearchParams(pathURL.search.slice(1));
		if (searchParams.has("ref")) {
			throw new TypeError(`设置了branch参数后，不应在path参数内拼接ref`);
		}
		searchParams.append("ref", branch);
		url = pathURL.origin + pathURL.pathname + "?" + searchParams.toString();
	}
	const response = await fetch(url, { headers });
	await defaultResponse(response);
	if (!response.ok) {
		throw new Error(`Request failed with status ${response.status}`);
	}
	const data = await response.json();
	// 处理响应数据，返回文件列表
	return data.map(({ download_url, name, path, sha, size, type }) => ({
		download_url,
		name,
		path,
		sha,
		size,
		type,
	}));
}

/**
 *
 * 获取仓库指定分支和指定目录内的所有文件(包含子目录的文件)
 *
 * **注意： 此api可能会大幅度消耗请求次数，请谨慎使用**
 *
 * @param { string } [path = ''] 路径名称(可放参数)
 * @param { string } [branch = ''] 仓库分支名称
 * @param { Object } options
 * @param { string } [options.username = 'libnoname'] 仓库拥有者
 * @param { string } [options.repository = 'noname'] 仓库名称
 * @param { string } [options.accessToken] 身份令牌
 * @returns { Promise<{ download_url: string, name: string, path: string, sha: string, size: number, type: 'file' }[]> }
 * @example
 * ```js
 * flattenRepositoryFiles()
 * 	.then(files => console.log(files))
 * 	.catch(error => console.error('Failed to fetch files:', error));
 * ```
 */
export async function flattenRepositoryFiles(path = "", branch, options = { username: "libnoname", repository: "noname" }) {
	if (!localStorage.getItem("noname_authorization")) {
		await gainAuthorization();
	}
	/**
	 * @type { { download_url: string, name: string, path: string, sha: string, size: number, type: 'file' }[] }
	 */
	const flattenedFiles = [];

	/**
	 * @param {({ download_url: string; name: string; path: string; sha: string; size: number; type: "file"; } | { download_url: null; name: string; path: string; sha: string; size: 0; type: "dir"; })[]} contents
	 */
	async function traverseDirectory(contents) {
		for (const item of contents) {
			if (item.type === "file") {
				flattenedFiles.push(item);
			} else if (item.type === "dir") {
				// 获取子目录下的文件列表
				const subDirFiles = await getRepoFilesList(item.path, branch, options);
				// 递归处理子目录中的文件和子目录
				await traverseDirectory(subDirFiles);
			}
		}
		return flattenedFiles;
	}

	// 开始遍历初始dir目录下的内容
	const allFiles = await traverseDirectory(await getRepoFilesList(path, branch, options));

	// 返回不含文件夹的扁平化文件列表
	return allFiles;
}

/**
 * 请求一个文件而不是直接储存为文件，这样可以省内存空间
 * @param { string } url
 * @param { (receivedBytes: number, total?:number, filename?: string) => void } [onProgress]
 * @param { RequestInit } [options={}]
 * @example
 * ```js
 * await getRepoTagDescription('v1.10.10').then(({ zipball_url }) => request(zipball_url));
 * ```
 */
export async function request(url, onProgress, options = {}) {
	const response = await fetch(
		url,
		Object.assign(
			{
				// 告诉服务器我们期望得到范围请求的支持
				headers: { Range: "bytes=0-" },
			},
			options
		)
	);

	if (!response.ok) {
		console.error(response);
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	// @ts-expect-error ignore
	let total = parseInt(response.headers.get("Content-Length"), 10);
	// 如果服务器未返回Content-Length，则无法准确计算进度
	// @ts-expect-error ignore
	if (isNaN(total)) {total = null;}
	// @ts-expect-error ignore
	const reader = response.body.getReader();
	let filename;
	try {
		// @ts-expect-error ignore
		filename = response.headers.get("Content-Disposition").split(";")[1].split("=")[1];
	} catch {
		/* empty */
	}
	let receivedBytes = 0;
	let chunks = [];

	while (true) {
		// 使用ReadableStream来获取部分数据并计算进度
		const { done, value } = await reader.read();

		if (done) {
			break;
		}

		chunks.push(value);
		receivedBytes += value.length;

		if (typeof onProgress == "function") {
			if (total) {
				// const progress = (receivedBytes / total) * 100;
				onProgress(receivedBytes, total, filename);
			} else {
				onProgress(receivedBytes, void 0, filename);
			}
		}
	}

	// 合并chunks并转换为Blob
	const blob = new Blob(chunks);

	// 仅做演示，打印已合并的Blob大小
	console.log(`Download completed. Total size: ${parseSize(blob.size)}.`);

	return blob;
}

/**
 *
 * @param { string } [title]
 * @param { string | number } [max]
 * @param { string } [fileName]
 * @param { string | number } [value]
 * @returns { progress }
 */
export function createProgress(title, max, fileName, value) {
	/** @type { progress } */
	// @ts-expect-error ignore
	const parent = ui.create.div(ui.window, {
		textAlign: "center",
		width: "300px",
		height: "150px",
		left: "calc(50% - 150px)",
		top: "auto",
		bottom: "calc(50% - 75px)",
		zIndex: "10",
		boxShadow: "rgb(0 0 0 / 40 %) 0 0 0 1px, rgb(0 0 0 / 20 %) 0 3px 10px",
		backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))",
		borderRadius: "8px",
		overflow: "hidden scroll",
	});

	// 可拖动
	parent.className = "dialog";
	Object.setPrototypeOf(parent, lib.element.Dialog.prototype);

	const container = ui.create.div(parent, {
		position: "absolute",
		top: "0",
		left: "0",
		width: "100%",
		height: "100%",
	});

	container.ontouchstart = ui.click.dialogtouchStart;
	container.ontouchmove = ui.click.touchScroll;
	// @ts-expect-error ignore
	container.style.WebkitOverflowScrolling = "touch";
	parent.ontouchstart = ui.click.dragtouchdialog;

	const caption = ui.create.div(container, "", title, {
		position: "relative",
		paddingTop: "8px",
		fontSize: "20px",
	});

	ui.create.node("br", container);

	const tip = ui.create.div(container, {
		position: "relative",
		paddingTop: "8px",
		fontSize: "20px",
		width: "100%",
	});

	const file = ui.create.node("span", tip, "", fileName);
	file.style.width = file.style.maxWidth = "100%";
	ui.create.node("br", tip);
	const index = ui.create.node("span", tip, "", String(value || "0"));
	ui.create.node("span", tip, "", "/");
	const maxSpan = ui.create.node("span", tip, "", String(max || "未知"));

	ui.create.node("br", container);

	const progress = ui.create.node("progress.progress", container);
	progress.setAttribute("value", value || "0");
	progress.setAttribute("max", max);

	parent.getTitle = () => caption.innerText;
	parent.setTitle = title => (caption.innerHTML = title);
	parent.getFileName = () => file.innerText;
	parent.setFileName = name => (file.innerHTML = name);
	parent.getProgressValue = () => progress.value;
	parent.setProgressValue = value => (progress.value = index.innerHTML = value);
	parent.getProgressMax = () => progress.max;
	parent.setProgressMax = max => (progress.max = maxSpan.innerHTML = max);
	parent.autoSetFileNameFromArray = fileNameList => {
		if (fileNameList.length > 2) {
			parent.setFileName(
				fileNameList
					.slice(0, 2)
					.concat(`......等${fileNameList.length - 2}个文件`)
					.join("<br/>")
			);
		} else if (fileNameList.length == 2) {
			parent.setFileName(fileNameList.join("<br/>"));
		} else if (fileNameList.length == 1) {
			parent.setFileName(fileNameList[0]);
		} else {
			parent.setFileName("当前没有正在下载的文件");
		}
	};
	return parent;
}

/**
 * 从GitHub存储库检索最新版本(tag)，不包括特定tag。
 *
 * 此函数从GitHub存储库中获取由所有者和存储库名称指定的tags列表，然后返回不是“v1998”的最新tag名称。
 * @param {string} owner GitHub上拥有存储库的用户名或组织名称。
 * @param {string} repo 要从中提取tag的存储库的名称。
 * @returns {Promise<string>} 以最新版本tag的名称解析的promise，或者如果操作失败则以错误拒绝。
 * @throws {Error} 如果获取操作失败或找不到有效tag，将抛出错误。
 */
export async function getLatestVersionFromGitHub(owner = "libnoname", repo = "noname") {
	const tags = await getRepoTags({
		username: owner,
		repository: repo,
	});

	for (const tag of tags) {
		const tagName = tag.name;
		if (tagName === "v1998") {continue;}
		try {
			checkVersion(tagName, lib.version);
			return tagName;
		} catch {
			// 非标准版本号
		}
	}

	throw new Error("No valid tags found in the repository");
}

/**
 * 从指定目录中的GitHub存储库中获取树
 * @param {string[]} directories 要从中获取树的目录列表
 * @param {string} version 从中获取树的版本或分支。
 * @param {string} [owner = 'libnoname'] GitHub上拥有存储库的用户名或组织名称。
 * @param {string} [repo = 'noname'] GitHub存储库的名称
 * @returns {Promise<{
 * 	path: string;
 * 	mode: string;
 * 	type: "blob" | "tree";
 * 	sha: string;
 * 	size: number;
 * 	url: string;
 * }[][]>} A promise that resolves with trees from the specified directories.
 * @throws {Error} Will throw an error if unable to fetch the repository tree from GitHub.
 */
export async function getTreesFromGithub(directories, version, owner = "libnoname", repo = "noname") {
	// if (!localStorage.getItem("noname_authorization")) await gainAuthorization();

	const treesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${version}?recursive=1`, {
		headers: defaultHeaders,
	});
	await defaultResponse(treesResponse);
	if (!treesResponse.ok) {throw new Error(`Failed to fetch the GitHub repository tree: HTTP status ${treesResponse.status}`);}
	/**
	 * @type {{
	 * 	sha: string;
	 * 	url: string;
	 * 	tree: {
	 * 		path: string;
	 * 		mode: string;
	 * 		type: "blob" | "tree";
	 * 		sha: string;
	 * 		size: number;
	 * 		url: string;
	 * 	}[];
	 * 	truncated: boolean;
	 * }}
	 */
	const trees = await treesResponse.json();
	const tree = trees.tree;
	return directories.map(directory => tree.filter(({ type, path }) => type === "blob" && path.startsWith(directory)));
}
