import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { randomUUID } from "node:crypto";
import { Archive, compare, digest, hashFile, readJson, within } from "./archive.js";
import { analyze, removeCharacters, type Analysis } from "./analyze.js";

const VERSION = 1;
// Bump when parsing, conflict or output rules change; preserve discovery order.
const RULES_VERSION = 3;
interface Source {
	hash: string;
	size: number;
	mtimeMs: number;
	order: number;
}
interface Candidate {
	hash: string;
	prefix: string;
	label: string;
	orderPath?: string[];
	analysis?: Analysis;
	reason?: string;
	extra?: Record<string, string>;
}
interface Catalog {
	version: number;
	candidates: Candidate[];
	nested: string[];
}
interface Located extends Candidate {
	archive: string;
	source: string;
	order: number;
}
interface Product {
	id: string;
	file: string;
	hash: string;
	size: number;
	mtimeMs: number;
	name: string;
	source: string;
	characters: string[];
	removed: string[];
}
interface Manifest {
	version: number;
	input: string;
	transaction: string;
	nextOrder: number;
	sources: Record<string, Source>;
	products: Product[];
}
export interface Row {
	source: string;
	extension?: string;
	status: string;
	reason?: string;
	kept?: number;
	removed?: string[];
	output?: string;
}
export interface Result {
	dryRun: boolean;
	scanned: number;
	hashed: number;
	analyzed: number;
	built: number;
	reused: number;
	elapsedMs: number;
	rows: Row[];
	outputs: number;
	removedSources: string[];
}
export interface Options {
	input: string;
	output: string;
	dryRun?: boolean;
	verify?: boolean;
	log?: (message: string) => void;
}
const errorText = (e: unknown) => (e instanceof Error ? e.message : String(e));

async function atomicJson(file: string, data: unknown) {
	const temporary = `${file}.${randomUUID()}.tmp`;
	const handle = await fs.open(temporary, "wx");
	try {
		await handle.writeFile(JSON.stringify(data, null, 2) + "\n");
		await handle.sync();
	} finally {
		await handle.close();
	}
	await fs.rename(temporary, file);
}
async function regular(file: string) {
	const stat = await fs.lstat(file);
	if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`不是普通文件：${file}`);
	return stat;
}
async function acquireLock(file: string) {
	try {
		return await fs.open(file, "wx");
	} catch (e) {
		if ((e as NodeJS.ErrnoException).code !== "EEXIST") throw e;
		const recoveryFile = file + ".recovery";
		const recovery = await fs.open(recoveryFile, "wx").catch(() => {
			throw new Error(`其他进程正在检查锁，或存在中断的锁恢复记录：${recoveryFile}`);
		});
		try {
			const info = await readJson<{ pid: number }>(file).catch(() => undefined);
			if (info && Number.isInteger(info.pid) && info.pid > 0) {
				let dead = false;
				try {
					process.kill(info.pid, 0);
				} catch (error) {
					dead = (error as NodeJS.ErrnoException).code === "ESRCH";
				}
				if (dead) {
					await fs.unlink(file);
					return fs.open(file, "wx");
				}
			}
			throw new Error(`已有整理进程或无法确认的锁。确认进程已结束后可移除 ${file}`);
		} finally {
			await recovery.close();
			await fs.unlink(recoveryFile);
		}
	}
}
async function cleanupTemporary(cache: string) {
	for (const name of await fs.readdir(cache)) {
		if (/^(?:(?:build|nested)-[0-9a-f-]+|[0-9a-f]{64}\.json\.[0-9a-f-]+)\.tmp$/.test(name)) {
			const file = path.join(cache, name);
			await regular(file);
			await fs.unlink(file);
		}
	}
}
async function managedDirectory(root: string, name: string) {
	const target = path.join(root, name);
	await fs.mkdir(target, { recursive: true });
	if ((await fs.lstat(target)).isSymbolicLink() || !within(await fs.realpath(root), await fs.realpath(target))) throw new Error(`输出子目录不能是外部链接：${target}`);
	return target;
}
async function unlinkManaged(directory: string, name: string) {
	if (!/^[a-f0-9]{64}\.zip$/.test(name)) throw new Error("整理索引中的输出路径非法");
	const file = path.join(directory, name);
	if (!within(directory, file)) throw new Error("输出路径越界");
	try {
		await regular(file);
		await fs.unlink(file);
	} catch (e) {
		if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
	}
}
async function collect(root: string, relative = ""): Promise<string[]> {
	const entries = await fs.readdir(path.join(root, relative), { withFileTypes: true });
	const files: string[] = [];
	for (const entry of entries.sort((a, b) => compare(a.name, b.name))) {
		const name = relative ? `${relative}/${entry.name}` : entry.name;
		if (entry.isSymbolicLink()) throw new Error(`输入包含符号链接，请移除链接后重试：${name}`);
		if (entry.isDirectory()) files.push(...(await collect(root, name)));
		else if (entry.isFile()) files.push(name);
	}
	return files.sort(compare);
}
function decodeSource(bytes: Buffer) {
	try {
		return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
	} catch {
		throw new Error("代码不是 UTF-8，需确认原编码后手动转换");
	}
}

async function catalog(file: string, hash: string, cache: string, verify: boolean, stats: Result, depth = 0, budget = { bytes: 0, archives: 0 }): Promise<Catalog> {
	if (depth > 3 || ++budget.archives > 1000) throw new Error("二次压缩超过层数或数量限制");
	const cacheFile = path.join(cache, `${hash}.json`);
	const cached = verify ? undefined : await readJson<Catalog>(cacheFile).catch(() => undefined);
	if (cached?.version === RULES_VERSION && (await Promise.all(cached.nested.map(async h => /^[a-f0-9]{64}$/.test(h) && !!(await fs.stat(path.join(cache, `${h}.zip`)).catch(() => false)))).then(v => v.every(Boolean)))) return cached;
	stats.analyzed++;
	const zip = await Archive.open(file);
	const candidates: Candidate[] = [],
		nested: string[] = [];
	try {
		const entries = [...zip.entries.keys()].filter(n => !n.startsWith("__MACOSX/") && !n.split("/").some(p => p.startsWith("._"))).sort(compare);
		const roots = [...new Set(entries.filter(n => /(^|\/)extension\.(js|ts)$/.test(n)).map(n => n.slice(0, n.lastIndexOf("/") + 1)))];
		if (roots.length) {
			for (const prefix of roots.sort(compare)) {
				const candidate: Candidate = { hash, prefix, label: prefix || "根目录", orderPath: [prefix] };
				try {
					if (roots.some(other => other !== prefix && (prefix.startsWith(other) || other.startsWith(prefix)))) throw new Error("此入口与其他扩展目录嵌套，不能安全拆分（其他入口及内嵌 ZIP 仍分别检查）");
					if (zip.entries.has(prefix + "extension.js") && zip.entries.has(prefix + "extension.ts")) throw new Error("同目录同时有 JS/TS 入口，无法确认应保留哪个");
					if (!zip.entries.has(prefix + "extension.js")) throw new Error("仅有 TypeScript 入口，需要先按扩展工程编译");
					const files = entries.filter(n => n.startsWith(prefix)).map(n => n.slice(prefix.length));
					const source = decodeSource(await zip.read(prefix + "extension.js"));
					const info = zip.entries.has(prefix + "info.json") ? JSON.parse(decodeSource(await zip.read(prefix + "info.json"))) : undefined;
					const auxiliary = zip.entries.has(prefix + "package.js") ? { "package.js": decodeSource(await zip.read(prefix + "package.js")) } : {};
					candidate.analysis = analyze(source, files, info, auxiliary);
					// Keep outer licenses/readmes when removing a wrapper or splitting siblings.
					candidate.extra = Object.create(null);
					if (prefix)
						for (const name of entries.filter(n => !roots.some(r => n.startsWith(r)) && /(^|\/)(license|licence|copying|notice|readme)([._-].*)?$/i.test(n))) {
							candidate.extra![`_organizer_source/${name}`] = (await zip.read(name, 2 * 1024 ** 2)).toString("base64");
						}
				} catch (e) {
					candidate.reason = errorText(e);
					delete candidate.analysis;
				}
				candidates.push(candidate);
			}
		}
		// A ZIP can contain both an installed extension and archived copies or
		// additional extensions. Inspect the latter even when an entry was found.
		{
			const children = entries.filter(n => /\.zip$/i.test(n));
			const outerDocuments: Record<string, string> = Object.create(null);
			let documentFailure: string | undefined;
			if (children.length)
				try {
					for (const name of entries.filter(n => /(^|\/)(license|licence|copying|notice|readme)([._-].*)?$/i.test(n))) {
						outerDocuments[`_organizer_source/${hash}/${name}`] = (await zip.read(name, 2 * 1024 ** 2)).toString("base64");
					}
				} catch (e) {
					documentFailure = `外层来源文档无法完整保留：${errorText(e)}`;
				}
			if (!roots.length && !children.length) candidates.push({ hash, prefix: "", label: "根目录", reason: "缺少扩展入口，可能是素材、补丁或非扩展文件" });
			for (const name of children) {
				try {
					if (documentFailure) throw new Error(documentFailure);
					budget.bytes += zip.entries.get(name)!.uncompressedSize;
					if (budget.bytes > 8 * 1024 ** 3) throw new Error("嵌套压缩累计解压超过限制");
					const temp = path.join(cache, `nested-${randomUUID()}.tmp`);
					let childHash: string;
					try {
						await zip.extract(name, temp);
						childHash = await hashFile(temp);
						const childPath = path.join(cache, `${childHash}.zip`);
						if ((await fs.stat(childPath).catch(() => false)) && (!verify || (await hashFile(childPath)) === childHash)) await fs.unlink(temp);
						else await fs.rename(temp, childPath);
					} finally {
						await fs.unlink(temp).catch(() => {});
					}
					nested.push(childHash);
					const child = await catalog(path.join(cache, `${childHash}.zip`), childHash, cache, verify, stats, depth + 1, budget);
					nested.push(...child.nested);
					candidates.push(...child.candidates.map(c => ({ ...c, orderPath: [name, ...(c.orderPath ?? [c.prefix])], extra: { ...c.extra, ...outerDocuments }, label: `${name} > ${c.label}` })));
				} catch (e) {
					candidates.push({ hash, prefix: "", label: name, reason: errorText(e) });
				}
			}
		}
	} finally {
		zip.close();
	}
	const result: Catalog = { version: RULES_VERSION, candidates, nested: [...new Set(nested)] };
	await atomicJson(cacheFile, result);
	return result;
}

export async function organize(options: Options): Promise<Result> {
	const started = Date.now(),
		log = options.log ?? (() => {});
	const input = await fs.realpath(path.resolve(options.input));
	const output = path.resolve(options.output);
	if (input === output || within(input, output) || within(output, input)) throw new Error("输入和输出目录不能相同或相互包含");
	const existingOutput = await fs.realpath(output).catch(() => undefined);
	if (existingOutput && (existingOutput === input || within(input, existingOutput) || within(existingOutput, input))) throw new Error("实际输入输出路径重叠");
	const temporaryRoot = options.dryRun ? await fs.mkdtemp(path.join(os.tmpdir(), "noname-organizer-")) : undefined;
	const work = temporaryRoot ?? output;
	await fs.mkdir(work, { recursive: true });
	const cache = await managedDirectory(work, ".cache");
	const packages = await managedDirectory(work, "packages");
	const lockFile = path.join(work, ".lock");
	const lock = await acquireLock(lockFile);
	await lock.writeFile(JSON.stringify({ pid: process.pid, started: new Date().toISOString() }));
	const stats: Result = { dryRun: !!options.dryRun, scanned: 0, hashed: 0, analyzed: 0, built: 0, reused: 0, outputs: 0, elapsedMs: 0, rows: [], removedSources: [] };
	try {
		const old = await readJson<Manifest>(path.join(output, "manifest.json"));
		if (old && (old.version !== VERSION || old.input !== input)) throw new Error("输出索引版本或来源目录不匹配，请选择新的输出目录");
		await cleanupTemporary(cache);
		// A journal is durable before outputs are created. On interruption either the
		// previous manifest wins (discard new files) or the new one wins (retire old).
		const journalFile = path.join(work, "journal.json");
		const pending = await readJson<{ transaction: string; created: string[]; retired: string[] }>(journalFile);
		if (pending) {
			const committed = old?.transaction === pending.transaction;
			const active = new Set(old?.products.map(p => p.file) ?? []);
			for (const name of new Set(committed ? [...pending.retired, ...pending.created] : pending.created)) if (!active.has(name)) await unlinkManaged(packages, name);
			await fs.unlink(journalFile);
		}
		const names = await collect(input);
		stats.scanned = names.length;
		const sources: Record<string, Source> = Object.create(null);
		const located: Located[] = [];
		let nextOrder = old?.nextOrder ?? 0;
		const hashOrders = new Map<string, number>();
		for (const source of Object.values(old?.sources ?? {})) hashOrders.set(source.hash, Math.min(hashOrders.get(source.hash) ?? Infinity, source.order));
		const discovered = new Map<string, Catalog>();
		let count = 0;
		for (const name of names) {
			const sourcePath = path.join(input, name);
			const stat = await regular(sourcePath);
			const previous = old?.sources[name];
			let hash: string;
			if (!options.verify && previous && previous.size === stat.size && previous.mtimeMs === stat.mtimeMs) hash = previous.hash;
			else {
				hash = await hashFile(sourcePath);
				stats.hashed++;
			}
			const after = await regular(sourcePath);
			if (stat.size !== after.size || stat.mtimeMs !== after.mtimeMs) throw new Error(`扫描时源文件被修改，请重试：${name}`);
			const order = previous?.order ?? hashOrders.get(hash) ?? nextOrder++;
			hashOrders.set(hash, Math.min(hashOrders.get(hash) ?? Infinity, order));
			sources[name] = { hash, size: stat.size, mtimeMs: stat.mtimeMs, order };
			if (!/\.zip$/i.test(name)) {
				stats.rows.push({ source: name, status: "跳过", reason: "非 ZIP 扩展压缩包" });
				continue;
			}
			let cat = discovered.get(hash);
			if (!cat) {
				try {
					cat = await catalog(sourcePath, hash, cache, !!options.verify, stats);
				} catch (e) {
					cat = { version: RULES_VERSION, candidates: [{ hash, prefix: "", label: "根目录", reason: errorText(e) }], nested: [] };
					await atomicJson(path.join(cache, `${hash}.json`), cat);
				}
				discovered.set(hash, cat);
			}
			for (const c of cat.candidates) located.push({ ...c, archive: c.hash === hash ? sourcePath : path.join(cache, `${c.hash}.zip`), source: name, order });
			if (++count % 10 === 0) log(`已扫描 ${count} 个 ZIP，实际分析 ${stats.analyzed} 个压缩包`);
		}
		stats.removedSources = Object.keys(old?.sources ?? {}).filter(n => !sources[n]);
		located.sort((a, b) => {
			const sourceOrder = a.order - b.order || compare(a.source, b.source);
			if (sourceOrder) return sourceOrder;
			const left = a.orderPath ?? [a.prefix],
				right = b.orderPath ?? [b.prefix];
			for (let i = 0; i < Math.max(left.length, right.length); i++) {
				const order = compare(left[i] ?? "", right[i] ?? "");
				if (order) return order;
			}
			return compare(a.label, b.label);
		});
		const characters = new Map<string, string>(),
			extensions = new Set<string>(),
			skills = new Map<string, string>(),
			seen = new Set<string>();
		const products: Product[] = [];
		const transaction = randomUUID();
		const journal = { transaction, created: [] as string[], retired: old?.products.map(p => p.file) ?? [] };
		if (!options.dryRun) await atomicJson(journalFile, journal);
		for (const c of located) {
			const row: Row = { source: `${c.source} > ${c.label}`, extension: c.analysis?.name, status: "跳过" };
			stats.rows.push(row);
			if (!c.analysis) {
				row.reason = c.reason;
				continue;
			}
			const identity = `${c.hash}:${c.prefix}`;
			if (seen.has(identity)) {
				row.status = "重复原包";
				row.reason = "同一内容只输出一份，保留全部来源关联";
				continue;
			}
			const a = c.analysis;
			if (extensions.has(a.name.normalize("NFC").toLowerCase())) {
				row.reason = `扩展内部名称冲突：${a.name}（安装会互相替换）`;
				continue;
			}
			const removed = a.characters.filter(id => characters.has(id));
			row.removed = removed;
			const kept = a.characters.filter(id => !characters.has(id));
			if (!kept.length) {
				row.reason = a.characters.length ? "武将全部重复，未输出；如包内有独立卡牌/模式功能，请人工处理" : "不含可整理的武将";
				continue;
			}
			const conflict = Object.entries(a.skills).find(([id, hash]) => skills.has(id) && skills.get(id) !== hash);
			if (conflict) {
				row.reason = `技能 ID 冲突且实现不同：${conflict[0]}`;
				continue;
			}
			try {
				const source = removeCharacters(a, removed);
				const id = digest(JSON.stringify([VERSION, RULES_VERSION, c.hash, c.prefix, c.extra, removed]));
				const file = `${id}.zip`;
				const previous = old?.products.find(p => p.id === id);
				const outputPath = path.join(packages, file);
				let product: Product | undefined;
				if (!options.dryRun && previous) {
					const stat = await fs.stat(outputPath).catch(() => undefined);
					if (stat?.size === previous.size && (options.verify ? (await hashFile(outputPath)) === previous.hash : stat.mtimeMs === previous.mtimeMs)) {
						product = { ...previous, source: row.source };
						stats.reused++;
					}
				}
				if (!product && !options.dryRun) {
					// Recovering/repairing an existing content-addressed output is safe: this
					// file is owned by the previous manifest or this transaction journal.
					if (!previous && (await fs.lstat(outputPath).catch(() => false))) throw new Error("输出文件已存在但不受索引管理，请移走后重试");
					journal.created.push(file);
					await atomicJson(journalFile, journal);
					const staging = path.join(cache, `build-${randomUUID()}.tmp`);
					const archive = await Archive.open(c.archive);
					try {
						const replacements: Record<string, Buffer> = Object.create(null);
						replacements["extension.js"] = Buffer.from(source);
						if (!archive.entries.has(c.prefix + "info.json")) replacements["info.json"] = Buffer.from(JSON.stringify(a.metadata, null, 2));
						for (const [name, content] of Object.entries(c.extra ?? {})) replacements[name] = Buffer.from(content, "base64");
						if (archive.entries.has(c.prefix + "_organizer.json")) throw new Error("原包已含整理标记，避免递归整理输出");
						replacements["_organizer.json"] = Buffer.from(JSON.stringify({ version: VERSION, sourceHash: c.hash, extension: a.name, removed, warnings: a.warnings }, null, 2));
						const omit = new Set(
							[...archive.entries.keys()]
								.filter(n => n.startsWith(c.prefix))
								.map(n => n.slice(c.prefix.length))
								.filter(n => n.startsWith("__MACOSX/") || n.split("/").some(p => p.startsWith("._")) || /(^|\/)(\.DS_Store|Thumbs\.db)$/i.test(n))
						);
						await archive.write(staging, c.prefix, replacements, omit);
					} finally {
						archive.close();
					}
					const verifyZip = await Archive.open(staging);
					try {
						const outputSource = decodeSource(await verifyZip.read("extension.js"));
						const auxiliary = verifyZip.entries.has("package.js") ? { "package.js": decodeSource(await verifyZip.read("package.js")) } : {};
						const actual = analyze(outputSource, [...verifyZip.entries.keys()], JSON.parse(decodeSource(await verifyZip.read("info.json"))), auxiliary);
						if (JSON.stringify(actual.characters) !== JSON.stringify(kept)) throw new Error("输出压缩包的武将清单不匹配");
					} finally {
						verifyZip.close();
					}
					await fs.rename(staging, outputPath);
					const stat = await regular(outputPath);
					product = { id, file, hash: await hashFile(outputPath), size: stat.size, mtimeMs: stat.mtimeMs, name: a.name, source: row.source, characters: kept, removed };
					stats.built++;
					log(`已生成 ${a.name}：保留 ${kept.length}，剔除 ${removed.length}`);
				}
				if (options.dryRun) product = { id, file, hash: "", size: 0, mtimeMs: 0, name: a.name, source: row.source, characters: kept, removed };
				products.push(product!);
				seen.add(identity);
				extensions.add(a.name.normalize("NFC").toLowerCase());
				for (const id of kept) characters.set(id, a.name);
				for (const [id, hash] of Object.entries(a.skills)) skills.set(id, hash);
				row.status = options.dryRun ? "可整理（预览）" : "成功";
				row.kept = kept.length;
				row.output = `packages/${file}`;
			} catch (e) {
				if (["ENOSPC", "EACCES", "EPERM", "EMFILE", "ENFILE", "EIO"].includes((e as NodeJS.ErrnoException).code ?? "")) throw e;
				row.reason = errorText(e);
			}
		}
		// Do not publish a mixed snapshot if a source changed during a long build.
		if (JSON.stringify(await collect(input)) !== JSON.stringify(names)) throw new Error("整理过程中源目录发生增删，请重跑；原索引未更新");
		for (const [name, snapshot] of Object.entries(sources)) {
			const stat = await regular(path.join(input, name));
			if (stat.size !== snapshot.size || stat.mtimeMs !== snapshot.mtimeMs) throw new Error(`整理时源文件被修改：${name}`);
		}
		stats.outputs = products.length;
		stats.elapsedMs = Date.now() - started;
		if (!options.dryRun) {
			const manifest: Manifest = { version: VERSION, input, transaction, nextOrder, sources, products };
			await atomicJson(path.join(work, "manifest.json"), manifest);
			await atomicJson(path.join(work, "report.json"), stats);
			const escaped = (s: string) => s.replaceAll("|", "\\|").replace(/[\r\n]/g, " ");
			const lines = ["# 扩展整理报告", "", `输入：${input}`, "", `输出 ${products.length} 个扩展；扫描 ${stats.scanned} 个文件；哈希 ${stats.hashed} 个；分析 ${stats.analyzed} 个；生成 ${stats.built} 个；复用 ${stats.reused} 个。`, "", "整理通过表示结构与支持范围内的静态检查通过，不代表所有技能已完成实机对局测试。技能和资源保守保留。", "", "| 来源 | 扩展 | 状态 | 保留/剔除 | 原因或输出 |", "| --- | --- | --- | --- | --- |", ...stats.rows.map(r => `| ${escaped(r.source)} | ${escaped(r.extension ?? "")} | ${r.status} | ${r.kept ?? "-"}/${r.removed?.length ?? 0} | ${r.output ? `[下载 ZIP](${r.output})` : escaped(r.reason ?? "")} |`), "", "完整武将剔除清单见 report.json；当前有效来源与输出见 manifest.json。"];
			await fs.writeFile(path.join(work, "整理报告.md"), lines.join("\n") + "\n");
			const active = new Set(products.map(p => p.file));
			for (const file of new Set([...journal.created, ...journal.retired])) if (!active.has(file)) await unlinkManaged(packages, file);
			await fs.unlink(journalFile);
		}
		return stats;
	} finally {
		await cleanupTemporary(cache).catch(() => {});
		await lock.close();
		await fs.unlink(lockFile);
		if (temporaryRoot && within(os.tmpdir(), temporaryRoot) && path.basename(temporaryRoot).startsWith("noname-organizer-")) await fs.rm(temporaryRoot, { recursive: true, force: true });
	}
}
