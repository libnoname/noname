import { lib, game, ui, get, ai, _status } from '../../../noname.js';

export let config = {
	Huodong_Update: {
		clear: true,
		name: '<button type="button">检查扩展更新</button>',
		async onclick() {
			if (this.textContent !== '检查扩展更新') return;
			const rawBase = `https://raw.githubusercontent.com/mengxinzxz/HuoDong-update/main`;
			const saveState = async state => {
				lib.config['extension_活动武将_update_state'] = state;
				await game.promises.saveConfig('extension_活动武将_update_state', state);
			};
			const ensureDirByFile = async (base, file) => {
				const parts = file.split('/');
				parts.pop();
				if (parts.length) await game.promises.ensureDirectory(`${base}/${parts.join('/')}`);
			};
			const listFiles = async dir => {
				const result = [];
				const walk = async current => {
					const [folders, files] = await game.promises.getFileList(current);
					for (const file of files) result.push(`${current}/${file}`.replace(`${dir}/`, ''));
					for (const folder of folders) await walk(`${current}/${folder}`);
				};
				try {
					await walk(dir);
				}
				catch (e) {
					//目录不存在时认为没有文件，其余错误继续抛出
					if (e && (e.code === 'ENOENT' || /not\s*found/i.test(String(e.message)))) return [];
					throw e;
				}
				return result;
			};
			const copyFiles = async (fromDir, toDir, files) => {
				for (const file of files) {
					const data = await game.promises.readFile(`${fromDir}/${file}`);
					await ensureDirByFile(toDir, file);
					await game.promises.writeFile(data, file.includes('/') ? `${toDir}/${file.split('/').slice(0, -1).join('/')}` : toDir, file.split('/').pop());
				}
			};
			try {
				this.textContent = '检查更新中...';
				const remoteInfo = await fetch(`${rawBase}/info.json?t=${Date.now()}`).then(res => {
					if (!res.ok) throw new Error('获取远程info.json失败');
					return res.json();
				});
				if (typeof remoteInfo !== 'object' || remoteInfo === null || Array.isArray(remoteInfo)) throw new Error('远程info.json数据无效');
				const remoteTime = String(remoteInfo.lastEditTime || '');
				const localTime = String(lib.extensionPack['活动武将'].lastEditTime || '');
				const parseTime = str => {
					if (!str) return 0;
					const match = str.match(/(\d+)\/(\d+)\/(\d+)\s+(\d+):(\d+):(\d+)/);
					if (!match) return 0;
					return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4]), Number(match[5]), Number(match[6])).getTime();
				};
				const remoteValue = parseTime(remoteTime);
				const localValue = parseTime(localTime);
				const updateType = remoteValue === localValue ? 0 : remoteValue > localValue ? 1 : 2;
				if (!confirm([
					'当前扩展已是最新版本，是否重新安装扩展？',
					'检测到仓库有更新，是否安装仓库版本？',
					'本地扩展比仓库版本更新，是否仍然安装仓库版本？',
				][updateType])) {
					this.innerHTML = '<button type="button">检查扩展更新</button>';
					return;
				}
				const fileData = await fetch(`${rawBase}/js/file.json?t=${Date.now()}`).then(res => {
					if (!res.ok) throw new Error('获取file.json失败');
					return res.json();
				});
				const remoteFiles = fileData.files;
				if (!Array.isArray(remoteFiles)) throw new Error('file.json格式错误');
				const remotePaths = remoteFiles.map(item => item.path);
				let localFileData = { files: [] };
				try {
					const localFileText = await game.promises.readFileAsText('extension/活动武将/js/file.json');
					localFileData = JSON.parse(localFileText);
				}
				catch (e) { }
				const localFilesInfo = Array.isArray(localFileData.files) ? localFileData.files : [];
				const localMap = new Map(localFilesInfo.map(item => [item.path, item.size]));
				let needDownload = [];
				if (updateType === 1) {
					for (const item of remoteFiles) {
						if (!localMap.has(item.path) || localMap.get(item.path) !== item.size) needDownload.push(item.path);
					}
					//info.json和file.json保存更新时间，哪怕size一样也必须更新
					if (!needDownload.includes('info.json')) needDownload.push('info.json');
					if (!needDownload.includes('js/file.json')) needDownload.push('js/file.json');
				}
				else {
					//版本一致重装，或者本地比仓库新但仍安装仓库版本：直接全量覆盖
					needDownload = remotePaths.slice();
				}
				await saveState({
					stage: 'downloading',
					time: Date.now(),
					lastEditTime: remoteTime,
				});
				await game.promises.removeDir('extension/活动武将/update_temp').catch(() => { });
				await game.promises.removeDir('extension/活动武将/update_backup').catch(() => { });
				await game.promises.createDir('extension/活动武将/update_temp');
				//先下载到临时目录
				for (let i = 0; i < needDownload.length; i++) {
					const file = needDownload[i];
					const dir = file.split('/').slice(0, -1).join('/');
					const targetDir = dir ? `extension/活动武将/update_temp/${dir}` : 'extension/活动武将/update_temp';
					await ensureDirByFile('extension/活动武将/update_temp', file);
					this.textContent = `正在下载：${file} (${i + 1}/${needDownload.length})`;
					const res = await fetch(`${rawBase}/${file}?t=${Date.now()}`);
					if (!res.ok) throw new Error(`下载失败：${rawBase}/${file}`);
					const data = await res.arrayBuffer();
					await game.promises.writeFile(data, targetDir, file.split('/').pop());
				}
				//校验临时目录
				this.textContent = '下载完毕，校验临时目录中...';
				const tempInfoText = await game.promises.readFileAsText('extension/活动武将/update_temp/info.json');
				const tempInfo = JSON.parse(tempInfoText);
				if (String(tempInfo.lastEditTime || '') !== remoteTime) throw new Error('临时目录info.json时间校验失败');
				await saveState({
					stage: 'installing',
					time: Date.now(),
					lastEditTime: remoteTime,
				});
				//备份旧扩展
				this.textContent = '校验完毕，备份旧扩展中...';
				await game.promises.createDir('extension/活动武将/update_backup');
				const localFiles = await listFiles('extension/活动武将');
				const remoteSet = new Set(remotePaths);
				const deletedFiles = localFiles.filter(file => !remoteSet.has(file));
				for (const file of [...new Set([...needDownload, ...deletedFiles])]) {
					try {
						const data = await game.promises.readFile(`extension/活动武将/${file}`);
						await ensureDirByFile('extension/活动武将/update_backup', file);
						await game.promises.writeFile(data, file.includes('/') ? `extension/活动武将/update_backup/${file.split('/').slice(0, -1).join('/')}` : 'extension/活动武将/update_backup', file.split('/').pop());
					}
					catch (e) { }
				}
				//安装新文件，删除仓库已经不存在的多余文件
				this.textContent = '备份完毕，载入新内容中...';
				await copyFiles('extension/活动武将/update_temp', 'extension/活动武将', needDownload);
				for (const file of localFiles) {
					if (new Set(['info.json', 'js/file.json']).has(file)) continue;
					if (!remoteSet.has(file)) await game.promises.removeFile(`extension/活动武将/${file}`).catch(() => { });
				}
				//清理缓存
				this.textContent = '载入完毕，缓存清理中...';
				await game.promises.removeDir('extension/活动武将/update_temp').catch(() => { });
				await game.promises.removeDir('extension/活动武将/update_backup').catch(() => { });
				//安装完成
				this.textContent = '扩展更新完成';
				alert(`扩展更新完成！\n\n即将重启游戏`);
				delete lib.config['extension_活动武将_update_state'];
				await game.promises.saveConfig('extension_活动武将_update_state');
				game.reload();
			}
			catch (e) {
				console.error(e);
				this.textContent = '扩展更新失败';
				const state = lib.config['extension_活动武将_update_state'];
				if (state && state.stage === 'installing') {
					try {
						const backupFiles = await listFiles('extension/活动武将/update_backup');
						await copyFiles('extension/活动武将/update_backup', 'extension/活动武将', backupFiles);
					}
					catch (restoreError) {
						console.error(restoreError);
					}
				}
				await game.promises.removeDir('extension/活动武将/update_temp').catch(() => { });
				alert(`更新失败：\n${e.message || e}`);
				this.innerHTML = '<button type="button">检查扩展更新</button>';
			}
		},
	},
	HDcheckNew: {
		name: (() => {
			//孩子们，牢大在天上化为彩虹看着你们（bushi）
			const text = '点击查看更新公告';
			if (!document.getElementById('hd-rainbow-style')) {
				const style = document.createElement('style');
				style.id = 'hd-rainbow-style';
				let css = '';
				for (let i = 0; i < text.length; i++) {
					const animName = `hd_bol_author_${i}`;
					css += `@keyframes ${animName}{`;
					for (let j = 0; j <= 20; j++) {
						const r = Math.floor(Math.random() * 255);
						const g = Math.floor(Math.random() * 255);
						const b = Math.floor(Math.random() * 255);
						css += `${j * 5}%{color:rgb(${r},${g},${b});text-shadow:0 0 5px rgba(${r},${g},${b},0.8);}`;
					}
					css += `}`;
				}
				style.innerHTML = css;
				document.head.appendChild(style);
			}
			return [...text].map((ch, i) => {
				const delay = (i * 0.3).toFixed(1);
				return `<span style="display:inline-block; animation:hd_bol_author_${i} 3s linear ${delay}s infinite; font-weight:bold; transition:color 0.5s;">${ch}</span>`;
			}).join('');
		})(),
		clear: true,
		onclick() {
			game.closeMenu();
			const extname = '活动武将', dialog = ui.create.dialog();
			dialog.classList.add('fullwidth');
			dialog.classList.add('fullheight');
			dialog.add(ui.create.div('.placeholder'));
			const controls = ui.controls.slice();
			if (controls.length > 0) controls.forEach(i => i.hide());
			const closeButton = ui.create.div('.menubutton.round', '<span style="font-size:22px;">×</span>', dialog, () => {
				dialog.close();
				if (controls.length > 0) controls.forEach(i => i.show());
			});
			closeButton.style.top = `40px`;
			closeButton.style.left = `calc(100% - 155px)`;
			dialog.add(`${extname} ${lib.extensionPack[extname].version} 更新内容`);
			dialog.add(ui.create.div('.placeholder'));
			const changeLogList = _status.HDWJ_ChangeLog;
			changeLogList.forEach(item => {
				switch (item.type) {
					case 'text':
						const list = Array.isArray(item.data) ? item.data : [item.data];
						if (item.addText) list.forEach(value => dialog.addText(value));
						else {
							list.forEach(value => {
								const li = document.createElement('li');
								li.innerHTML = value;
								li.style.textAlign = item.textAlign || 'center';
								dialog.content.appendChild(li);
							});
						}
						break;
					case 'players':
						dialog.addSmall([item.data, 'character']);
						dialog.classList.add('forcebutton');
						dialog.classList.add('withbg');
						break;
					case 'cards':
						dialog.addSmall([item.data.map(value => [get.translation(get.type(value)), '', value]), 'vcard']);
						dialog.classList.add('forcebutton');
						dialog.classList.add('withbg');
						break;
					default:
						return;
				}
			});
			dialog.open();
		},
	},
	FenJieXianA: {
		clear: true,
		name: '·功能杂项（点击折叠）',
		onclick() {
			const innerHTML = get.plainText(this.innerHTML);
			const goon = innerHTML.endsWith('（点击折叠）'), config = `hdwj_config_${innerHTML.slice(0, -6)}}`;
			this.innerHTML = `<li>${this.textContent.slice(0, -6)}${goon ? '（点击展开）' : '（点击折叠）'}`;
			if (goon) {
				_status[config] ??= [];
				let item = this.nextSibling;
				while (item && ['（点击折叠）', '（点击展开）', '删除此扩展'].every(i => !item.innerHTML.includes(i))) {
					item.hide();
					_status[config].add(item);
					item = item.nextSibling;
				}
			}
			else {
				for (const item of _status[config]) item.show();
				delete _status[config];
			}
		},
	},
	showDerivation: {
		name: '技能翻译优化',
		intro: '结合get.poptip方法优化有衍生技的技能翻译',
		init: false,
	},
	HD_shanshan: {
		name: '牌堆加入【闪闪】',
		intro: '将牌堆中的一张方片5，一张方片6，一张方片7的【闪】替换为【闪闪】',
		init: false,
	},
	ShenZhangJiao: {
		name: '神张角184彩蛋',
		intro: '打开此选项后，神张角【异兆】“黄”标记上限为184',
		init: true,
	},
	XvXiang: {
		name: '偶像の虚拟',
		intro: '开启此选项后，线下包的五个虚拟偶像将获得【虚像】',
		init: false,
	},
	ShenSunQuan: {
		name: '神孙权全扩技能池',
		intro: '打开此选项后，神孙权【驭衡】获得的技能池扩大为全扩（实时生效）',
		init: false,
		onclick(bool) {
			game.saveConfig('extension_活动武将_ShenSunQuan', bool);
			game.uncheck();
			game.check();
		},
	},
	ShenJiaXu: {
		name: '神贾诩限定技能池',
		intro: '打开此选项后，神贾诩【络殊】获得的技能池缩小为玄蝶初版（实时生效）',
		init: false,
		onclick(bool) {
			game.saveConfig('extension_活动武将_ShenJiaXu', bool);
			game.uncheck();
			game.check();
		},
	},
	edit_PingJianName: {
		name: '编辑欢杀将池',
		clear: true,
		intro: "编辑欢杀将池，此将池仅影响欢乐三国杀武将包中的角色发动技能的武将筛选范围，不会涉及禁将层面",
		onclick() {
			var map = game.getExtensionConfig('活动武将', 'PingJianName') || lib.skill.minipingjian.getList();
			ui.create.editor({
				language: 'json',
				value: JSON.stringify(map),
				saveInput: result => {
					const PingJianName = JSON.parse(result);
					if (!Array.isArray(PingJianName)) {
						throw new Error("代码格式有错误，请对比示例代码仔细检查");
					}
					game.saveExtensionConfig('活动武将', 'PingJianName', PingJianName);
				},
			});
		},
	},
	reset_PingJianName: {
		name: '重置欢杀将池',
		clear: true,
		onclick() {
			if (confirm('是否重置已编辑的欢杀将池？')) {
				if (confirm('该操作不可撤销！是否确认重置？')) {
					game.saveConfig('extension_活动武将_PingJianName', null);
					alert('自定义欢杀将池已重置');
				}
			}
		},
	},
	HD_zhengsu: {
		name: '整肃优化',
		intro: '开启此选项后，吕范，皇甫嵩，朱儁整肃技能会获得优化（重启生效）',
		init: true,
	},
	HD_renku: {
		name: '仁库优化',
		intro: '开启此选项后，仁库展示会获得优化（重启生效）',
		init: true,
	},
	ShowSeatNum: {
		name: '座位号显示',
		intro: '开启此选项后，游戏开始时，所有角色显示号位（实时生效）',
		init: true,
	},
	HD_REname: {
		name: '名称还原',
		intro: '开启此选项后，游戏内部分武将的名称翻译将调整为和官服一致（实时生效）',
		init: false,
	},
	Boss_TZ_level: {
		name: '挑战模式玩家等阶',
		intro: '设置玩家在挑战模式中的等阶（重启生效）' +
			'<br><li>一阶：无特权。' +
			'<br><li>二阶：起始手牌+1。' +
			'<br><li>三阶：体力上限+1，起始手牌+1，出【杀】次数+1。' +
			'<br><li>四阶：体力上限+1，起始手牌+2，出【杀】次数+1，摸牌阶段摸牌数+1。' +
			'<br><li>五阶：体力上限+2，起始手牌+2，出【杀】次数+1，摸牌阶段摸牌数+1，获得【重生】。',
		init: '1',
		item: {
			'1': '一阶',
			'2': '二阶',
			'3': '三阶',
			'4': '四阶',
			'5': '五阶',
		},
	},
	Boss_YZ_level: {
		name: '挑战模式敌方等阶',
		intro: '设置挑战模式中敌方的等阶（重启生效）' +
			'<br><li>一阶：无特权。' +
			'<br><li>二阶：体力上限+1，起始手牌+1，登场时随机使用一张装备牌。' +
			'<br><li>三阶：体力上限+2，起始手牌+1，出【杀】次数+1。' +
			'<br><li>四阶：体力上限+3，起始手牌+2，出【杀】次数+1，摸牌阶段摸牌数+1。' +
			'<br><li>五阶：体力上限+5，起始手牌+2，出【杀】次数+1，神武再世模式敌方获得【困兽】。',
		init: '1',
		item: {
			'1': '一阶',
			'2': '二阶',
			'3': '三阶',
			'4': '四阶',
			'5': '五阶',
		},
	},
	KQShiJian: {
		name: '抗秦事件（点击选择）',
		intro: '选择不同事件，于游戏开始时令本局游戏进行本事件（挑战模式无效）',
		clear: true,
		onclick() {
			const mask = ui.create.div(ui.window);
			mask.style.position = 'absolute';
			mask.style.left = '0';
			mask.style.top = '0';
			mask.style.width = '100%';
			mask.style.height = '100%';
			mask.style.zIndex = 1145141919809;
			const dialog = ui.create.div(mask);
			dialog.style.position = 'absolute';
			dialog.style.left = '50%';
			dialog.style.top = '50%';
			dialog.style.transform = 'translate(-50%, -50%)';
			dialog.style.background = 'rgba(0,0,0,0.72)';
			dialog.style.padding = '12px';
			dialog.style.borderRadius = '12px';
			dialog.style.width = 'fit-content';
			dialog.style.height = 'fit-content';
			const title = ui.create.div(dialog);
			title.style.position = 'relative';
			title.style.width = '100%';
			title.style.textAlign = 'center';
			title.style.fontSize = '24px';
			title.style.marginBottom = '12px';
			title.innerHTML = '抗秦事件';
			const content = ui.create.div(dialog);
			content.style.display = 'grid';
			content.style.position = 'relative';
			content.style.gridTemplateColumns = 'repeat(3, auto)';
			content.style.gap = '12px';
			if (!Array.isArray(lib.config.extension_活动武将_KQShiJian)) game.saveConfig('extension_活动武将_KQShiJian', []);
			const list = ['qin_bianfatuqiang', 'qin_hezonglianheng', 'qin_changpingzhizhan', 'qin_hengsaoliuhe', 'qin_lvshichunqiu', 'qin_shaqiuzhibian', 'qin_zhaojizhiluan', 'qin_shichengtaihou'];
			list.forEach(name => {
				const item = ui.create.div(content);
				item.style.display = 'flex';
				item.style.position = 'relative';
				item.style.alignItems = 'center';
				item.style.justifyContent = 'space-between';
				item.style.padding = '8px 12px';
				item.style.border = '1px solid #999';
				item.style.borderRadius = '8px';
				item.style.background = 'rgba(0,0,0,0.35)';
				item.style.color = 'white';
				item.style.fontSize = '18px';
				item.style.cursor = 'pointer';
				item.style.minHeight = '48px';
				item.style.boxSizing = 'border-box';
				item.style.gap = '5px';
				const text = ui.create.div(item);
				text.style.position = 'relative';
				text.style.whiteSpace = 'nowrap';
				text.innerHTML = lib.translate[name];
				const check = ui.create.div(item);
				check.style.position = 'relative';
				check.style.flexShrink = '0';
				check.style.width = '22px';
				check.style.height = '22px';
				check.style.border = '2px solid white';
				check.style.borderRadius = '6px';
				check.style.display = 'flex';
				check.style.alignItems = 'center';
				check.style.justifyContent = 'center';
				check.style.fontSize = '18px';
				check.style.transition = 'all 0.2s';
				if (lib.config.extension_活动武将_KQShiJian.includes(name)) {
					check.innerHTML = '✓';
					check.style.background = '#4caf50';
				}
				else {
					check.innerHTML = '';
					check.style.background = 'transparent';
				}
				item.onclick = () => {
					if (lib.config.extension_活动武将_KQShiJian.includes(name)) {
						check.innerHTML = '';
						check.style.background = 'transparent';
						lib.config.extension_活动武将_KQShiJian.remove(name);
					}
					else {
						check.innerHTML = '✓';
						check.style.background = '#4caf50';
						lib.config.extension_活动武将_KQShiJian.push(name);
					}
					game.saveConfig('extension_活动武将_KQShiJian', lib.config.extension_活动武将_KQShiJian);
				};
			});
			//关闭逻辑，点击dialog外的区域关闭dialog
			mask.onclick = () => {
				dialog?.remove();
				mask?.remove();
			};
			dialog.onclick = e => e.stopPropagation();
		},
	},
	GDShiJian: {
		name: '官渡事件（点击选择）',
		intro: '选择不同事件，于游戏开始时令本局游戏进行本事件（挑战模式无效）',
		clear: true,
		onclick() {
			const mask = ui.create.div(ui.window);
			mask.style.position = 'absolute';
			mask.style.left = '0';
			mask.style.top = '0';
			mask.style.width = '100%';
			mask.style.height = '100%';
			mask.style.zIndex = 1145141919809;
			const dialog = ui.create.div(mask);
			dialog.style.position = 'absolute';
			dialog.style.left = '50%';
			dialog.style.top = '50%';
			dialog.style.transform = 'translate(-50%, -50%)';
			dialog.style.background = 'rgba(0,0,0,0.72)';
			dialog.style.padding = '12px';
			dialog.style.borderRadius = '12px';
			dialog.style.width = 'fit-content';
			dialog.style.height = 'fit-content';
			const title = ui.create.div(dialog);
			title.style.position = 'relative';
			title.style.width = '100%';
			title.style.textAlign = 'center';
			title.style.fontSize = '24px';
			title.style.marginBottom = '12px';
			title.innerHTML = '官渡事件';
			const content = ui.create.div(dialog);
			content.style.display = 'grid';
			content.style.position = 'relative';
			content.style.gridTemplateColumns = 'repeat(3, auto)';
			content.style.gap = '12px';
			if (!Array.isArray(lib.config.extension_活动武将_GDShiJian)) game.saveConfig('extension_活动武将_GDShiJian', []);
			const list = ['bilibili_liangjunxiangchi', 'bilibili_xutuhuanjin', 'bilibili_jianshoudaiyuan', 'bilibili_huoshaowuchao', 'bilibili_liangcaokuifa', 'bilibili_zhanzhuyanwen', 'bilibili_shishengshibai', 'bilibili_yiruoshengqiang', 'bilibili_shichongerjiao'];
			list.forEach(name => {
				const item = ui.create.div(content);
				item.style.display = 'flex';
				item.style.position = 'relative';
				item.style.alignItems = 'center';
				item.style.justifyContent = 'space-between';
				item.style.padding = '8px 12px';
				item.style.border = '1px solid #999';
				item.style.borderRadius = '8px';
				item.style.background = 'rgba(0,0,0,0.35)';
				item.style.color = 'white';
				item.style.fontSize = '18px';
				item.style.cursor = 'pointer';
				item.style.minHeight = '48px';
				item.style.boxSizing = 'border-box';
				item.style.gap = '5px';
				const text = ui.create.div(item);
				text.style.position = 'relative';
				text.style.whiteSpace = 'nowrap';
				text.innerHTML = lib.translate[name];
				const check = ui.create.div(item);
				check.style.position = 'relative';
				check.style.flexShrink = '0';
				check.style.width = '22px';
				check.style.height = '22px';
				check.style.border = '2px solid white';
				check.style.borderRadius = '6px';
				check.style.display = 'flex';
				check.style.alignItems = 'center';
				check.style.justifyContent = 'center';
				check.style.fontSize = '18px';
				check.style.transition = 'all 0.2s';
				if (lib.config.extension_活动武将_GDShiJian.includes(name)) {
					check.innerHTML = '✓';
					check.style.background = '#4caf50';
				}
				else {
					check.innerHTML = '';
					check.style.background = 'transparent';
				}
				item.onclick = () => {
					if (lib.config.extension_活动武将_GDShiJian.includes(name)) {
						check.innerHTML = '';
						check.style.background = 'transparent';
						lib.config.extension_活动武将_GDShiJian.remove(name);
					}
					else {
						check.innerHTML = '✓';
						check.style.background = '#4caf50';
						lib.config.extension_活动武将_GDShiJian.push(name);
					}
					game.saveConfig('extension_活动武将_GDShiJian', lib.config.extension_活动武将_GDShiJian);
				};
			});
			//关闭逻辑，点击dialog外的区域关闭dialog
			mask.onclick = () => {
				dialog?.remove();
				mask?.remove();
			};
			dialog.onclick = e => e.stopPropagation();
		},
	},
	FenJieXianB: {
		clear: true,
		name: '·关于特效（点击折叠）',
		onclick() {
			const innerHTML = get.plainText(this.innerHTML);
			const goon = innerHTML.endsWith('（点击折叠）'), config = `hdwj_config_${innerHTML.slice(0, -6)}}`;
			this.innerHTML = `<li>${this.textContent.slice(0, -6)}${goon ? '（点击展开）' : '（点击折叠）'}`;
			if (goon) {
				_status[config] ??= [];
				let item = this.nextSibling;
				while (item && ['（点击折叠）', '（点击展开）', '删除此扩展'].every(i => !item.innerHTML.includes(i))) {
					item.hide();
					_status[config].add(item);
					item = item.nextSibling;
				}
			}
			else {
				for (const item of _status[config]) item.show();
				delete _status[config];
			}
		},
	},
	HDfightAudio: {
		name: '各项游戏播报',
		intro: [
			'游戏播报包括以下内容：',
			'游戏开始播报（让步十周年UI）',
			'癫狂屠戮，万军取首播报',
			'击杀角色，回复体力播报',
		].join('<br><li>'),
		init: 'default',
		item: {
			off: '关闭',
			default: '手杀',
			ol: 'OL',
			decade: '十周年',
		},
	},
	HDkillAudio: {
		name: '手杀击杀播报选择',
		intro: '使用手杀游戏播报时，选择新旧版本',
		init: 'default',
		item: {
			default: '旧版',
			new: '新版',
		},
	},
	HDskillAnimateAudio: {
		name: 'skillAnimation音效',
		intro: '打开此选项后，含skillAnimation标签的技能发动时将会播放对应的音效',
		init: true,
	},
	HD_bgmPlay: {
		name: 'OL互通版专属BGM',
		intro: '打开此选项后，普通身份局将会播放OL互通版专属BGM' +
			'<br>具体如下：' +
			'<br><li>游戏选将专属BGM' +
			'<br><li>初始主公势力bgm' +
			'<br><li>游戏正常对局bgm' +
			'<br><li>进入残局激昂bgm',
		init: false,
	},
}