import fs from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { Transform, Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import yauzl from "yauzl";
import yazl from "yazl";
import iconv from "iconv-lite";

export const compare = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);
export const digest = (data: string | Buffer) => createHash("sha256").update(data).digest("hex");
export async function hashFile(file: string) {
	const hash = createHash("sha256");
	for await (const chunk of createReadStream(file)) hash.update(chunk);
	return hash.digest("hex");
}

const crcTable = Array.from({ length: 256 }, (_, n) => {
	for (let i = 0; i < 8; i++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1;
	return n >>> 0;
});
function crcUpdate(crc: number, data: Buffer) {
	for (const byte of data) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
	return crc >>> 0;
}
function crc32(data: Buffer) {
	return (crcUpdate(0xffffffff, data) ^ 0xffffffff) >>> 0;
}

export function safePath(name: string) {
	const normalized = name.replaceAll("\\", "/");
	const parts = normalized.replace(/\/$/, "").split("/");
	if (!normalized || parts.some(p => !p || p === "." || p === ".." || /[<>:"|?*]/.test(p) || [...p].some(c => c.charCodeAt(0) < 32) || /[. ]$/.test(p) || /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(?:\.|$)/i.test(p))) {
		throw new Error(`不安全或 Windows 不支持的路径：${name}`);
	}
	return normalized;
}

function entryName(entry: yauzl.Entry) {
	const bytes = entry.fileName as unknown as Buffer;
	if (entry.generalPurposeBitFlag & 0x800) return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
	const unicode = entry.extraFields.find(f => f.id === 0x7075 && f.data.length >= 5 && f.data[0] === 1 && f.data.readUInt32LE(1) === crc32(bytes));
	if (unicode) return new TextDecoder("utf-8", { fatal: true }).decode(unicode.data.subarray(5));
	// Chinese legacy archives commonly lack the UTF-8 flag. Prefer valid UTF-8,
	// otherwise use GB18030 with a reversible round-trip, never replacement chars.
	try {
		return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
	} catch {}
	const decoded = iconv.decode(bytes, "gb18030");
	if (!iconv.encode(decoded, "gb18030").equals(bytes)) throw new Error("无法可靠解码 ZIP 文件名");
	return decoded;
}

export class Archive {
	entries = new Map<string, yauzl.Entry>();
	private zip!: yauzl.ZipFile;
	private error?: Error;
	static async open(file: string) {
		const archive = new Archive();
		archive.zip = await new Promise<yauzl.ZipFile>((resolve, reject) => yauzl.open(file, { lazyEntries: true, autoClose: false, decodeStrings: false, validateEntrySizes: true }, (e, z) => (e ? reject(e) : resolve(z!))));
		archive.zip.on("error", e => {
			archive.error = e;
		});
		try {
			const collisions = new Set<string>();
			let total = 0;
			await new Promise<void>((resolve, reject) => {
				archive.zip.once("error", reject);
				archive.zip.once("end", resolve);
				archive.zip.on("entry", (entry: yauzl.Entry) => {
					try {
						const name = safePath(entryName(entry));
						const key = name.replace(/\/$/, "").normalize("NFC").toLowerCase();
						if (collisions.has(key)) throw new Error(`ZIP 存在同路径或大小写冲突：${name}`);
						collisions.add(key);
						if (entry.generalPurposeBitFlag & 1) throw new Error("加密压缩包需要先手动解密");
						if (![0, 8].includes(entry.compressionMethod)) throw new Error("不支持此 ZIP 压缩算法");
						if (((entry.externalFileAttributes >>> 16) & 0xf000) === 0xa000) throw new Error("不接受 ZIP 符号链接");
						total += entry.uncompressedSize;
						if (collisions.size > 100000 || total > 4 * 1024 ** 3 || entry.uncompressedSize > 1024 ** 3 || entry.uncompressedSize > Math.max(16 * 1024 ** 2, entry.compressedSize * 1000)) throw new Error("ZIP 超出安全大小/数量/压缩比限制");
						if (!name.endsWith("/")) archive.entries.set(name, entry);
						archive.zip.readEntry();
					} catch (e) {
						reject(e);
					}
				});
				archive.zip.readEntry();
			});
			const fileKeys = new Set([...archive.entries.keys()].map(k => k.normalize("NFC").toLowerCase()));
			for (const name of archive.entries.keys()) {
				const parts = name.split("/");
				while (parts.length > 1) {
					parts.pop();
					if (fileKeys.has(parts.join("/").normalize("NFC").toLowerCase())) throw new Error(`文件和目录冲突：${name}`);
				}
			}
			return archive;
		} catch (e) {
			archive.close();
			throw e;
		}
	}
	close() {
		this.zip.close();
	}
	async stream(name: string) {
		if (this.error) throw this.error;
		const entry = this.entries.get(name);
		if (!entry) throw new Error(`文件缺失：${name}`);
		const raw = await new Promise<NodeJS.ReadableStream>((resolve, reject) => this.zip.openReadStream(entry, (e, s) => (e ? reject(e) : resolve(s!))));
		let crc = 0xffffffff,
			size = 0;
		const check = new Transform({
			transform(chunk: Buffer, _encoding, callback) {
				size += chunk.length;
				if (size > entry.uncompressedSize) return callback(new Error(`解压长度异常：${name}`));
				crc = crcUpdate(crc, chunk);
				callback(null, chunk);
			},
			flush(callback) {
				callback(size !== entry.uncompressedSize || (crc ^ 0xffffffff) >>> 0 !== entry.crc32 ? new Error(`CRC/长度校验失败：${name}`) : undefined);
			},
		});
		raw.on("error", e => check.destroy(e));
		check.on("close", () => (raw as import("node:stream").Readable).destroy());
		raw.pipe(check);
		return check;
	}
	async read(name: string, limit = 16 * 1024 ** 2) {
		if ((this.entries.get(name)?.uncompressedSize ?? Infinity) > limit) throw new Error(`文本文件过大：${name}`);
		const chunks: Buffer[] = [];
		for await (const chunk of await this.stream(name)) chunks.push(chunk as Buffer);
		return Buffer.concat(chunks);
	}
	async extract(name: string, file: string) {
		await pipeline(await this.stream(name), createWriteStream(file, { flags: "wx" }));
	}
	async write(output: string, prefix: string, replacements: Record<string, Buffer>, omit: Set<string> = new Set()) {
		const zip = new yazl.ZipFile();
		const target = createWriteStream(output, { flags: "wx" });
		zip.on("error", e => (zip.outputStream as Readable).destroy(e));
		const completed = pipeline(zip.outputStream, target);
		// Attach immediately; errors may arrive while source streams are being queued.
		completed.catch(() => {});
		const files = [...this.entries.keys()]
			.filter(n => n.startsWith(prefix))
			.map(n => n.slice(prefix.length))
			.filter(n => !omit.has(n));
		for (const name of Object.keys(replacements)) if (!files.includes(name)) files.push(name);
		try {
			for (const name of files.sort(compare)) {
				const options = { mtime: new Date("2000-01-01T00:00:00Z"), mode: 0o100644, compress: !/\.(mp3|ogg|png|jpe?g|webp|zip|mp4)$/i.test(name) };
				if (replacements[name]) zip.addBuffer(replacements[name], name, options);
				else
					zip.addReadStreamLazy(name, options, callback => {
						this.stream(prefix + name).then(
							s => callback(null, s),
							e => callback(e, undefined!)
						);
					});
			}
			zip.end();
			await completed;
		} catch (e) {
			(zip.outputStream as Readable).destroy();
			target.destroy();
			throw e;
		}
	}
}

export async function readJson<T>(file: string): Promise<T | undefined> {
	try {
		return JSON.parse(await fs.readFile(file, "utf8"));
	} catch (e) {
		if ((e as NodeJS.ErrnoException).code === "ENOENT") return undefined;
		throw e;
	}
}
export function within(root: string, child: string) {
	const rel = path.relative(root, child);
	return rel !== "" && !rel.startsWith(".." + path.sep) && rel !== ".." && !path.isAbsolute(rel);
}
