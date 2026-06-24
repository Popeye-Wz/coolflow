#!/usr/bin/env node
/**
 * SessionStart Hook —— 团队 AI 前端工作流（coolflow）的「引导注入器」
 *
 * 在每个会话最开头，把元技能 `coolflow-using-flow` 全文 + 一段「运行时上下文块」
 * 注入 Agent 上下文。让磁盘上的技能从死文件变成会话开始就生效的活指令。
 *
 * 位置无关：用 import.meta.url 定位自身。`coolflow init` 把本文件与 skills/defaults
 * 一并装到 ~/.claude/，于是同级 ../skills 与 ../defaults 总能被正确找到。
 *
 * 运行时上下文块：把算好的绝对路径交给技能，技能不必关心自己被装在哪。
 *   GLOBAL_ROOT / DEFAULTS / CWD / PROJECT_ROOT / PROJECT_RULES
 *
 * 任何异常都静默降级（输出空对象并 exit 0），绝不阻断会话启动。
 */

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const GLOBAL_ROOT = join(HERE, '..');           // ~/.claude（安装后）
const DEFAULTS = join(GLOBAL_ROOT, 'defaults'); // 全局兜底规范

function readSkill(name) {
  return readFileSync(join(GLOBAL_ROOT, 'skills', name, 'SKILL.md'), 'utf8');
}

// 从当前执行目录向上探测项目根：首个含 .claude/ 或 .git/ 或 package.json 的目录
function detectProjectRoot(start) {
  let dir = start;
  for (let i = 0; i < 50; i++) {
    if (existsSync(join(dir, '.claude')) || existsSync(join(dir, '.git')) || existsSync(join(dir, 'package.json'))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return start; // 没探测到就用 CWD
}

try {
  const metaSkill = readSkill('coolflow-using-flow');

  const cwd = process.cwd();
  const projectRoot = detectProjectRoot(cwd);
  const projectRules = join(projectRoot, '.claude');
  const hasProjectRules = existsSync(projectRules);

  const runtime = [
    '<!-- coolflow-injected v=1.0.0 -->',
    '[COOLFLOW-RUNTIME] 本次运行的路径上下文（技能据此做分层规范解析）：',
    `- GLOBAL_ROOT（全局根）: ${GLOBAL_ROOT}`,
    `- DEFAULTS（全局兜底规范）: ${DEFAULTS}`,
    `- CWD（当前执行目录，阶段产物 coolflow/ 落此）: ${cwd}`,
    `- PROJECT_ROOT（当前项目根）: ${projectRoot}`,
    `- PROJECT_RULES（当前项目规范目录）: ${projectRules}${hasProjectRules ? '（存在）' : '（不存在，回退 DEFAULTS）'}`,
    '[/COOLFLOW-RUNTIME]',
  ].join('\n');

  const banner = [
    '<EXTREMELY_IMPORTANT>',
    'You are operating under the TEAM AI FRONTEND WORKFLOW (coolflow).',
    '',
    runtime,
    '',
    '下面是元技能 `coolflow-using-flow` 的全文 —— 它规定了你在任何项目里',
    '【任何回应/动作之前】必须先检索并使用技能、必须遵守的硬门禁、以及',
    '每次解决完问题后必须反思沉淀的纪律。请逐字遵守。',
    '',
    '对于其它技能，使用 Skill 工具加载，切勿用 Read 直接读取技能文件。',
    '',
    '--- BEGIN coolflow-using-flow ---',
    metaSkill,
    '--- END coolflow-using-flow ---',
    '</EXTREMELY_IMPORTANT>',
  ].join('\n');

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: banner },
  }));
} catch (err) {
  process.stdout.write('{}');
}
process.exit(0);
