import "../../noname.js";
import { game } from "../game/index.js";
import { ui } from "../ui/index.js";
import { lib } from "./index.js";
const defaultHeaders = {
  Accept: "application/vnd.github.v3+json"
  // 根据GitHub API的要求添加适当的认证头信息
  // 如果公共仓库则无需认证，私有仓库需提供token
  // 'Authorization': `token ${YOUR_GITHUB_PERSONAL_ACCESS_TOKEN}`
};
if (localStorage.getItem("noname_authorization")) {
  defaultHeaders["Authorization"] = `token ${localStorage.getItem("noname_authorization")}`;
}
async function gainAuthorization() {
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
const defaultResponse = async (response) => {
  const limit = response.headers.get("X-RateLimit-Limit");
  const remaining = response.headers.get("X-RateLimit-Remaining");
  const reset = response.headers.get("X-RateLimit-Reset");
  console.log(`请求总量限制`, limit);
  console.log(`剩余请求次数`, remaining);
  console.log(`限制重置时间`, new Date(reset * 1e3).toLocaleString());
  if (Number(remaining) === 0 && !sessionStorage.getItem("noname_authorization") && confirm(`您达到了每小时${limit}次的访问限制，是否输入您github账号的token以获取更高的请求总量限制`) || response.status === 401 && (localStorage.removeItem("noname_authorization"), true) && (alert(`身份验证凭证错误，是否重新输入您github账号的token以获取更高的请求总量限制`), true)) {
    return gainAuthorization();
  }
};
function parseSize(limit) {
  let size = "";
  if (limit < 1 * 1024) {
    size = limit.toFixed(2) + "B";
  } else if (limit < 1 * 1024 * 1024) {
    size = (limit / 1024).toFixed(2) + "KB";
  } else if (limit < 1 * 1024 * 1024 * 1024) {
    size = (limit / (1024 * 1024)).toFixed(2) + "MB";
  } else {
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
  }
  let sizeStr = size + "";
  let index = sizeStr.indexOf(".");
  let dou = sizeStr.slice(index + 1, 2);
  if (dou == "00") {
    return sizeStr.slice(0, index) + sizeStr.slice(index + 3, 2);
  }
  return size;
}
function checkVersion(ver1, ver2) {
  if (typeof ver1 !== "string") {
    ver1 = String(ver1);
  }
  if (typeof ver2 !== "string") {
    ver2 = String(ver2);
  }
  if (ver1.startsWith("v")) {
    ver1 = ver1.slice(1);
  }
  if (ver2.startsWith("v")) {
    ver2 = ver2.slice(1);
  }
  if (/[^0-9.-]/i.test(ver1) || /[^0-9.-]/i.test(ver2)) {
    throw new Error("Invalid characters found in the version numbers");
  }
  function* walk(str) {
    let part = "";
    for (const char of str) {
      if (char === "." || char === "-") {
        if (part) {
          yield Number(part);
        }
        part = "";
      } else {
        part += char;
      }
    }
    if (part) {
      yield Number(part);
    }
  }
  const iterator1 = walk(ver1);
  const iterator2 = walk(ver2);
  while (true) {
    const iter1 = iterator1.next();
    const iter2 = iterator2.next();
    let { value: item1 } = iter1;
    let { value: item2 } = iter2;
    item1 = item1 === void 0 ? 0 : item1;
    item2 = item2 === void 0 ? 0 : item2;
    if (isNaN(item1) || isNaN(item2)) {
      throw new Error("Non-numeric part found in the version numbers");
    } else if (item1 > item2) {
      return 1;
    } else if (item1 < item2) {
      return -1;
    } else {
      if (iter1.done && iter2.done) {
        break;
      }
    }
  }
  return 0;
}
async function getRepoTags(options = { username: "libnoname", repository: "noname" }) {
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
async function getRepoTagDescription(tagName, options = { username: "libnoname", repository: "noname" }) {
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
  return {
    /** @type { { browser_download_url: string, content_type: string, name: string, size: number }[] } tag额外上传的素材包 */
    assets: releaseData.assets,
    author: {
      /** @type { string } 用户名 */
      login: releaseData.author.login,
      /** @type { string } 用户头像地址 */
      avatar_url: releaseData.author.avatar_url,
      /** @type { string } 用户仓库地址 */
      html_url: releaseData.author.html_url
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
    zipball_url: releaseData.zipball_url
  };
}
async function getRepoFilesList(path = "", branch, options = { username: "libnoname", repository: "noname" }) {
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
  return data.map(({ download_url, name, path: path2, sha, size, type }) => ({
    download_url,
    name,
    path: path2,
    sha,
    size,
    type
  }));
}
async function flattenRepositoryFiles(path = "", branch, options = { username: "libnoname", repository: "noname" }) {
  if (!localStorage.getItem("noname_authorization")) {
    await gainAuthorization();
  }
  const flattenedFiles = [];
  async function traverseDirectory(contents) {
    for (const item of contents) {
      if (item.type === "file") {
        flattenedFiles.push(item);
      } else if (item.type === "dir") {
        const subDirFiles = await getRepoFilesList(item.path, branch, options);
        await traverseDirectory(subDirFiles);
      }
    }
    return flattenedFiles;
  }
  const allFiles = await traverseDirectory(await getRepoFilesList(path, branch, options));
  return allFiles;
}
async function request(url, onProgress, options = {}) {
  const response = await fetch(
    url,
    Object.assign(
      {
        // 告诉服务器我们期望得到范围请求的支持
        headers: { Range: "bytes=0-" }
      },
      options
    )
  );
  if (!response.ok) {
    console.error(response);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  let total = parseInt(response.headers.get("Content-Length"), 10);
  if (isNaN(total)) {
    total = null;
  }
  const reader = response.body.getReader();
  let filename;
  try {
    filename = response.headers.get("Content-Disposition").split(";")[1].split("=")[1];
  } catch {
  }
  let receivedBytes = 0;
  let chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
    receivedBytes += value.length;
    if (typeof onProgress == "function") {
      if (total) {
        onProgress(receivedBytes, total, filename);
      } else {
        onProgress(receivedBytes, void 0, filename);
      }
    }
  }
  const blob = new Blob(chunks);
  console.log(`Download completed. Total size: ${parseSize(blob.size)}.`);
  return blob;
}
function createProgress(title, max, fileName, value) {
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
    overflow: "hidden scroll"
  });
  parent.className = "dialog";
  Object.setPrototypeOf(parent, lib.element.Dialog.prototype);
  const container = ui.create.div(parent, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%"
  });
  container.ontouchstart = ui.click.dialogtouchStart;
  container.ontouchmove = ui.click.touchScroll;
  container.style.WebkitOverflowScrolling = "touch";
  parent.ontouchstart = ui.click.dragtouchdialog;
  const caption = ui.create.div(container, "", title, {
    position: "relative",
    paddingTop: "8px",
    fontSize: "20px"
  });
  ui.create.node("br", container);
  const tip = ui.create.div(container, {
    position: "relative",
    paddingTop: "8px",
    fontSize: "20px",
    width: "100%"
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
  parent.setTitle = (title2) => caption.innerHTML = title2;
  parent.getFileName = () => file.innerText;
  parent.setFileName = (name) => file.innerHTML = name;
  parent.getProgressValue = () => progress.value;
  parent.setProgressValue = (value2) => progress.value = index.innerHTML = value2;
  parent.getProgressMax = () => progress.max;
  parent.setProgressMax = (max2) => progress.max = maxSpan.innerHTML = max2;
  parent.autoSetFileNameFromArray = (fileNameList) => {
    if (fileNameList.length > 2) {
      parent.setFileName(
        fileNameList.slice(0, 2).concat(`......等${fileNameList.length - 2}个文件`).join("<br/>")
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
async function getLatestVersionFromGitHub(owner = "libnoname", repo = "noname") {
  const tags = await getRepoTags({
    username: owner,
    repository: repo
  });
  for (const tag of tags) {
    const tagName = tag.name;
    if (tagName === "v1998") {
      continue;
    }
    try {
      checkVersion(tagName, lib.version);
      return tagName;
    } catch {
    }
  }
  throw new Error("No valid tags found in the repository");
}
async function getTreesFromGithub(directories, version, owner = "libnoname", repo = "noname") {
  const treesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${version}?recursive=1`, {
    headers: defaultHeaders
  });
  await defaultResponse(treesResponse);
  if (!treesResponse.ok) {
    throw new Error(`Failed to fetch the GitHub repository tree: HTTP status ${treesResponse.status}`);
  }
  const trees = await treesResponse.json();
  const tree = trees.tree;
  return directories.map((directory) => tree.filter(({ type, path }) => type === "blob" && path.startsWith(directory)));
}
export {
  checkVersion,
  createProgress,
  flattenRepositoryFiles,
  gainAuthorization,
  getLatestVersionFromGitHub,
  getRepoFilesList,
  getRepoTagDescription,
  getRepoTags,
  getTreesFromGithub,
  parseSize,
  request
};
