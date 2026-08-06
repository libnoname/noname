#!/usr/bin/env node
/**
 * 批量将 mp3 转码为 m4a（AAC-LC），用于「无名杀」音频体积优化。
 *
 * 输入：mp3 源目录（默认 audio-mp3-backup/audio）
 * 输出：m4a 目标目录（默认 apps/core/audio），保留相对目录结构，仅后缀变 .m4a
 *
 * 目标码率规则：
 *   - background：AAC-LC 最高 96k，保留源声道布局。
 *   - 其他目录（音效、技能、语音等）：AAC-LC 最高 48k，转单声道。
 *   - 源文件低于上限时不升码率；采样率非标时归一。
 *   - 使用单线程 ffmpeg + 本机并发，避免进程间过度争抢 CPU。
 *   - 使用 +faststart，把 M4A 的 moov atom 放到文件头，适合浏览器渐进加载。
 *   - 已存在同名 .m4a 则跳过，可断点续跑。
 *
 * 使用说明：
 * 1. 在仓库根目录准备 MP3 源目录。默认目录为 audio-mp3-backup/audio，
 *    该目录只作为本地转码输入，不属于提交内容。
 * 2. 确认 ffmpeg、ffprobe 已安装并可从 PATH 调用。
 * 3. 执行：
 *      node scripts/audio-to-m4a.mjs [MP3源目录] [M4A目标目录] [并发数]
 *    三个参数均可省略，默认值依次为：
 *      audio-mp3-backup/audio apps/core/audio CPU核数
 * 4. 例如使用 8 个并发任务：
 *      node scripts/audio-to-m4a.mjs audio-mp3-backup/audio apps/core/audio 8
 * 5. 脚本保留源目录结构，仅将 .mp3 后缀改为 .m4a；目标目录中已存在的同名
 *    文件会跳过，因此可重复执行或中断后继续执行。
 * 6. 转码完成后，脚本会校验输出是否为 AAC；存在失败项时以非零状态退出。
 */
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileP = promisify(execFile);

const SRC_ROOT = path.resolve(process.cwd(), process.argv[2] || 'audio-mp3-backup/audio');
const DEST_ROOT = path.resolve(process.cwd(), process.argv[3] || 'apps/core/audio');
const CONCURRENCY = Math.max(1, parseInt(process.argv[4] || '', 10) || os.availableParallelism?.() || os.cpus().length);

function walk(dir) {
  if (!fs.existsSync(dir)) throw new Error(`源目录不存在: ${dir}`);
  const res = [];
  for (const f of fs.readdirSync(dir)) {
    const fp = path.join(dir, f);
    const st = fs.statSync(fp);
    if (st.isDirectory()) res.push(...walk(fp));
    else if (f.toLowerCase().endsWith('.mp3')) res.push(fp);
  }
  return res;
}

async function probe(file) {
  try {
    const { stdout } = await execFileP('ffprobe', ['-v', 'error', '-of', 'json', '-show_format', '-show_streams', file], { maxBuffer: 32 * 1024 * 1024 });
    const j = JSON.parse(stdout);
    const fmt = j.format || {};
    const st = (j.streams || []).find((x) => x.codec_type === 'audio') || {};
    let br = st.bit_rate ? Number(st.bit_rate) : fmt.bit_rate ? Number(fmt.bit_rate) : null;
    if (!br && fmt.duration && fmt.size) br = (Number(fmt.size) * 8) / Number(fmt.duration);
    return {
      ok: true,
      br,
      sr: Number(st.sample_rate) || null,
      ch: st.channels ?? null,
      dur: fmt.duration ? Number(fmt.duration) : null,
      codec: st.codec_name || null,
    };
  } catch (error) {
    return { ok: false, br: null, error };
  }
}

const STD_SR = [8000, 11025, 12000, 16000, 22050, 24000, 32000, 44100, 48000, 88200, 96000];
function alignSr(sr) {
  if (!sr) return null;
  if (STD_SR.includes(sr)) return sr;
  let best = STD_SR[0],
    bd = Math.abs(sr - STD_SR[0]);
  for (const s of STD_SR) {
    const d = Math.abs(sr - s);
    if (d < bd) {
      bd = d;
      best = s;
    }
  }
  return best;
}

function getEncodingProfile(rel, origK) {
  const category = rel.split(path.sep)[0];
  if (category === 'background') {
    return { targetK: Math.min(origK, 96), channels: null };
  }
  return { targetK: Math.min(origK, 48), channels: 1 };
}

async function processOne(file) {
  const rel = path.relative(SRC_ROOT, file);
  const destM4a = path.join(DEST_ROOT, rel.replace(/\.mp3$/i, '.m4a'));
  if (fs.existsSync(destM4a)) return { skip: true };
  const sourceProbe = await probe(file);
  const { br, sr, ch } = sourceProbe;
  if (!sourceProbe.ok || !br || br < 1000) {
    return { fail: true, error: sourceProbe.error || '无法探测源文件码率' };
  }
  const origK = Math.round(br / 1000);
  const { targetK, channels } = getEncodingProfile(rel, origK);
  const outSr = alignSr(sr);
  const outCh = channels || ch;
  fs.mkdirSync(path.dirname(destM4a), { recursive: true });
  const args = [
    '-y',
    '-i',
    file,
    '-map_metadata',
    '-1',
    '-threads',
    '1',
    '-c:a',
    'aac',
    '-profile:a',
    'aac_low',
    '-b:a',
    targetK + 'k',
    '-movflags',
    '+faststart',
  ];
  if (outSr) args.push('-ar', String(outSr));
  if (outCh) args.push('-ac', String(outCh));
  args.push(destM4a);
  await execFileP('ffmpeg', args, { stdio: 'ignore' });
  const outputProbe = await probe(destM4a);
  if (!outputProbe.ok || outputProbe.codec !== 'aac') {
    return { fail: true, error: '输出不是可识别的 AAC 文件' };
  }
  const o = fs.statSync(file).size;
  const n = fs.statSync(destM4a).size;
  return { o, n, origK, targetK };
}

let files;
try {
  files = walk(SRC_ROOT);
} catch (error) {
  console.error(`无法扫描源目录：${error.message || error}`);
  process.exit(1);
}
console.log(`源: ${SRC_ROOT}`);
console.log(`目标: ${DEST_ROOT}`);
console.log(`待转码 mp3: ${files.length}，并发: ${CONCURRENCY}`);
console.log('规则: background≤96k保留声道 | 其他目录≤48k转单声道 | 低码率源文件不升码率');

let done = 0, skip = 0, fail = 0, saved = 0, total = 0;
let active = 0, idx = 0;

function pump() {
  while (active < CONCURRENCY && idx < files.length) {
    const file = files[idx++];
    active++;
    processOne(file)
      .then((r) => {
        if (r.skip) skip++;
        else if (r.o != null) {
          done++;
          saved += r.o - r.n;
          total += r.o;
        } else if (r.fail) {
          fail++;
          console.error('FAIL', file, r.error);
        }
        if ((done + skip + fail) % 300 === 0)
          console.log(`进度 ${(done + skip + fail)}/${files.length}  转 ${done} 跳 ${skip} 败 ${fail}  已省 ${(saved / 1048576).toFixed(0)} MB`);
      })
      .catch((e) => {
        fail++;
        console.error('FAIL', file, String(e.message || e).slice(0, 120));
      })
      .finally(() => {
        active--;
        pump();
      });
  }
}

pump();

const iv = setInterval(() => {
  if (active === 0 && idx >= files.length) {
    clearInterval(iv);
    console.log(`\n完成：转码 ${done}，跳过 ${skip}，失败 ${fail}`);
    console.log(
      `原总体积 ${(total / 1048576).toFixed(0)} MB，m4a 节省 ${(saved / 1048576).toFixed(0)} MB (${total ? ((saved / total) * 100).toFixed(0) : 0}%)`,
    );
    process.exitCode = fail ? 1 : 0;
  }
}, 500);
