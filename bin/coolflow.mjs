#!/usr/bin/env node
/**
 * coolflow 安装器 —— npm 全局包路径的入口
 *
 * 把本包内的 skills/ commands/ hooks/ defaults/ 写入用户级 ~/.claude/，
 * 并在 ~/.claude/settings.json 幂等注册 SessionStart hook，使工作流全局生效。
 *
 * 用法：
 *   coolflow init           安装到 ~/.claude（已存在则跳过同名，--force 覆盖）
 *   coolflow update         等价 init --force
 *   coolflow uninstall      移除 coolflow 资源与 hook 注册
 *   coolflow doctor         自检安装状态
 *   coolflow init-project   在当前项目生成 .claude/ 项目级规范骨架
 *
 * 选项：--force 覆盖，--link 用软链代替复制（Windows 需权限，默认复制）
 */

import { promises as fs, existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CLAUDE_DIR = join(homedir(), '.claude')
const SETTINGS = join(CLAUDE_DIR, 'settings.json')
const HOOK_CMD = `node "${join(CLAUDE_DIR, 'hooks', 'session-start.mjs').replace(/\\/g, '/')}"`

// coolflow 拥有的资源（用于幂等安装与精确卸载，避免误删用户其它内容）
const RESOURCES = {
  skillDirs: ['coolflow-using-flow', 'coolflow-clarify', 'coolflow-design', 'coolflow-generate', 'coolflow-review', 'coolflow-precipitate'],
  commandFiles: [], // 无独立命令文件：/coolflow-precipitate 由同名技能直接响应
  hookFiles: ['session-start.mjs'],
  defaultsDir: 'defaults', // 整目录
}

const args = process.argv.slice(2)
const cmd = args[0] || 'help'
const has = (f) => args.includes(f)

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true })
  for (const entry of await fs.readdir(src, { withFileTypes: true })) {
    const s = join(src, entry.name)
    const d = join(dest, entry.name)
    if (entry.isDirectory()) await copyDir(s, d)
    else await fs.copyFile(s, d)
  }
}

async function linkOrCopy(src, dest) {
  if (has('--link')) {
    await fs.rm(dest, { recursive: true, force: true })
    await fs.mkdir(dirname(dest), { recursive: true })
    await fs.symlink(src, dest, 'junction').catch(() => copyDir(src, dest))
  } else {
    await copyDir(src, dest)
  }
}

async function readJSON(p, fallback) {
  try { return JSON.parse(await fs.readFile(p, 'utf8')) } catch { return fallback }
}

async function registerHook() {
  const settings = await readJSON(SETTINGS, {})
  settings.hooks ||= {}
  const list = (settings.hooks.SessionStart ||= [])
  // 去重：移除任何已存在的、命令指向 coolflow session-start 的分组
  const cleaned = list.filter((grp) =>
    !(grp?.hooks || []).some((h) => typeof h?.command === 'string' && h.command.includes('session-start.mjs')))
  cleaned.push({
    matcher: 'startup|clear|compact',
    hooks: [{ type: 'command', command: HOOK_CMD, async: false }],
  })
  settings.hooks.SessionStart = cleaned
  await fs.mkdir(CLAUDE_DIR, { recursive: true })
  await fs.writeFile(SETTINGS, JSON.stringify(settings, null, 2))
}

async function unregisterHook() {
  const settings = await readJSON(SETTINGS, null)
  if (!settings?.hooks?.SessionStart) return
  settings.hooks.SessionStart = settings.hooks.SessionStart.filter((grp) =>
    !(grp?.hooks || []).some((h) => typeof h?.command === 'string' && h.command.includes('session-start.mjs')))
  await fs.writeFile(SETTINGS, JSON.stringify(settings, null, 2))
}

async function init() {
  await fs.mkdir(CLAUDE_DIR, { recursive: true })
  await linkOrCopy(join(PKG_ROOT, 'skills'), join(CLAUDE_DIR, 'skills'))
  await linkOrCopy(join(PKG_ROOT, 'hooks'), join(CLAUDE_DIR, 'hooks'))
  await linkOrCopy(join(PKG_ROOT, 'defaults'), join(CLAUDE_DIR, 'defaults'))
  // commands/ 为可选目录（当前无独立命令文件），存在才复制，避免发布包缺失时报错
  if (existsSync(join(PKG_ROOT, 'commands'))) {
    await linkOrCopy(join(PKG_ROOT, 'commands'), join(CLAUDE_DIR, 'commands'))
  }
  await registerHook()
  console.log('✅ coolflow 已安装到', CLAUDE_DIR)
  console.log('   - 已注册 SessionStart hook')
  console.log('   - 新开 Claude Code 会话即生效；项目级规范放各项目 <项目>/.claude/')
}

async function uninstall() {
  for (const d of RESOURCES.skillDirs) await fs.rm(join(CLAUDE_DIR, 'skills', d), { recursive: true, force: true })
  for (const f of RESOURCES.commandFiles) await fs.rm(join(CLAUDE_DIR, 'commands', f), { force: true })
  for (const f of RESOURCES.hookFiles) await fs.rm(join(CLAUDE_DIR, 'hooks', f), { force: true })
  await fs.rm(join(CLAUDE_DIR, RESOURCES.defaultsDir), { recursive: true, force: true })
  await unregisterHook()
  console.log('✅ 已移除 coolflow 资源与 hook 注册（未触碰你的其它 ~/.claude 内容）')
}

async function doctor() {
  const checks = [
    ['skills/coolflow-using-flow/SKILL.md', existsSync(join(CLAUDE_DIR, 'skills', 'coolflow-using-flow', 'SKILL.md'))],
    ['hooks/session-start.mjs', existsSync(join(CLAUDE_DIR, 'hooks', 'session-start.mjs'))],
    ['defaults/', existsSync(join(CLAUDE_DIR, 'defaults'))],
  ]
  const settings = await readJSON(SETTINGS, {})
  const hookOk = (settings?.hooks?.SessionStart || []).some((g) =>
    (g?.hooks || []).some((h) => typeof h?.command === 'string' && h.command.includes('session-start.mjs')))
  checks.push(['SessionStart hook 已注册', hookOk])
  console.log(`coolflow doctor（Node ${process.version}）`)
  for (const [name, ok] of checks) console.log(`  ${ok ? '✅' : '❌'} ${name}`)
}

async function initProject() {
  const root = process.cwd()
  const base = join(root, '.claude')
  const seeds = {
    'local-rules.md': '# 项目专属规则（最高优先级）\n\n<!-- 在此写本项目特有的硬规矩 -->\n',
    'global-rules/.gitkeep': '',
    'knowledge-base/_index.md': '# 知识库索引（项目级）\n\n## 业务域\n- _（暂无）_\n',
  }
  for (const [rel, content] of Object.entries(seeds)) {
    const p = join(base, rel)
    await fs.mkdir(dirname(p), { recursive: true })
    if (!existsSync(p)) await fs.writeFile(p, content)
  }
  console.log('✅ 已在当前项目生成 .claude/ 项目级规范骨架：', base)
}

function help() {
  console.log(`coolflow —— 团队 AI 前端工作流安装器
用法：
  coolflow init [--force] [--link]   安装到 ~/.claude
  coolflow update                    覆盖更新（= init --force）
  coolflow uninstall                 移除 coolflow 资源与 hook
  coolflow doctor                    自检安装状态
  coolflow init-project              在当前项目生成 .claude/ 规范骨架`)
}

const run = {
  init,
  update: () => { if (!has('--force')) args.push('--force'); return init() },
  uninstall,
  doctor,
  'init-project': initProject,
  help,
}
Promise.resolve((run[cmd] || help)()).catch((e) => { console.error('❌', e.message); process.exit(1) })
