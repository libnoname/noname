import { registerPlugin } from '@capacitor/core';

export type SafStat = {
  path: string;
  name: string;
  isDir: boolean;
  size?: number;        // file only
  mtime?: number;       // best-effort; SAF 常常拿不到，可能为 undefined
};

export type SafListResult = {
  items: SafStat[];
};

export interface SafFsPlugin {
  /** 让用户选择一个目录，并持久化授权 */
  pickDirectory(): Promise<{ uri: string }>;

  /** 读取当前已授权目录（不存在则抛错或返回空） */
  getDirectory(): Promise<{ uri: string | null }>;

  /** 列出目录（相对根目录） */
  list(options: { path?: string }): Promise<SafListResult>;

  /** 读取文件内容，返回 base64 */
  readFile(options: { path: string }): Promise<{ data: string }>;

  /** 写入文件（base64），可选 overwrite */
  writeFile(options: { path: string; data: string; overwrite?: boolean }): Promise<void>;

  /** 创建目录（递归创建） */
  mkdir(options: { path: string }): Promise<void>;

  /** 删除文件/目录（目录需为空或递归删除由你决定；这里给递归实现） */
  delete(options: { path: string; recursive?: boolean }): Promise<void>;

  /** 查询信息 */
  stat(options: { path: string }): Promise<SafStat>;

  /** 是否存在 */
  exists(options: { path: string }): Promise<{ exists: boolean }>;
}

export const SafFs = registerPlugin<SafFsPlugin>('SafFs');
