# P0：统一标记来源提示

下文9/9和98/98为子任务初始检查点，不是最终总体兼容性验收。最终增补私有scope中的动态介绍合计回归后UI为10/10；原生浏览器发现并修复全局div absolute导致来源子行塌陷，原生弹窗可见性已复验。完整P0结果为独立Node 104通过/4失败、浏览器10已验证/3未满足，见 [P0整改报告.md](P0整改报告.md)。本轮原型未部署正式游戏。

核心 `get.nodeintro` 在原标记介绍完成后追加 `.owned-mark-sources` 区域。原介绍标题、规则文本、数量和自定义 DOM 节点保持原样；异步 `intro.mark` 完成后才追加。自定义介绍主动返回 `false` 时继续抑制整个提示。

`get/ownedMarkIntro.js` 只读取已有来源账本，不为悬浮操作新建账本或角色身份。按稳定 owner id 分组数量，显示武将译名和座位；稳定 id 只保存在 `data-owned-mark-owner` 属性。无可解析来源、旧匿名数量、未追踪数值/数组明确显示“来源未知”；无数字存储时显示“数量未记录”。公共、资源、私有和多来源语义读取可选 `game.getOwnedMarkPolicy(name)`，未声明时不推断来源。标签均以 `textContent` 写入。

测试直接执行生产 `nodeintro` 方法和真实 Player/OwnedMarkStore，DOM/dialog 边界使用内存节点；这不代替原生浏览器集成。先运行 7 个测试，均因未追加区域失败；最小实现后 7 个通过，再补 2 个回归用例，共 9 个通过：原文及数量、同名多来源/匿名混合、旧数值及数组、声明语义、自定义节点、自定义介绍抑制、标签文本安全及座位回退、异步内容顺序、恢复一致性/失联来源。

验证命令：`node --test tests/p0-owned-marks/ui.test.mjs`，9/9 通过。显式完整测试路径 `node --test tests/owned-marks/*.test.mjs tests/p0-owned-marks/*.test.mjs tests/ownedMarksGame.test.js`，98/98 通过。`git diff --check` 通过。

额外执行 `node --test` 会发现 `tools/test-owned-marks-browser.mjs`，该工具在沙箱中因 localhost `net::ERR_NETWORK_ACCESS_DENIED` 失败（99/100 通过），失败证据另存于发布根目录 `audit/mark-ownership-implementation/browser-results-p0-sandbox-denied.json`。原生浏览器的本轮证据应独立写入 `p0-browser-results.json`，不得据本单元测试宣称完成浏览器验收。此改动不部署、不提交、不编辑角色技能。
