# coolflow

> 团队 AI 前端工作流安装器 —— **强制流程 + 自动检索技能 + 知识沉淀闭环**。

把前端开发流程拆成可被 AI 自动接管的环节(目前仅四个环节，之后会迭代)，并在每步收尾自动沉淀团队知识：

```
需求澄清 → 方案设计 → 代码生成 → 代码审查
/coolflow-clarify  /coolflow-design  /coolflow-generate  /coolflow-review
        每步收尾 → /coolflow-precipitate 反思沉淀（你确认后才写入）
```

> 阶段产物统一落到 `coolflow/<需求名称>/<阶段名>-<YYYYMMDD>.md`。

---

## 核心特性

1. **强制流程**：自动注入规则，AI 必须先查技能再动手，关键节点不许跳步。
2. **自动检索技能**：你说人话即可（如「帮我加个积分页」），AI 自动选对环节技能，无需记命令。
3. **沉淀闭环**：每解决完一个问题，AI 自动反思"有没有值得沉淀的规范/踩坑"，**列候选给你逐条确认**，确认后才写入规则库/知识库。

---

## 安装

### 前置条件
- 已安装 **Claude Code**（CLI / 桌面端 / IDE 插件均可）。
- 已安装 **Node.js ≥ 18**（hook 用它跨平台运行）。

### 安装命令
```bash
npm i -g coolflow         # 或团队私服
coolflow init             # 把 skills/hooks/defaults 写入 ~/.claude 并注册 hook
coolflow doctor           # 自检安装状态
```

| 命令 | 作用 |
|---|---|
| `coolflow init [--force] [--link]` | 安装到 `~/.claude`（`--force` 覆盖、`--link` 用软链代替复制） |
| `coolflow update` | 覆盖更新（= `init --force`） |
| `coolflow uninstall` | 精确移除 coolflow 相关资源，不动你其它 `~/.claude` 内容 |
| `coolflow doctor` | 自检安装状态 |
| `coolflow init-project` | 在当前项目生成 `.claude/` 项目级规范骨架 |

### 验证是否生效
新开一个 Claude Code 会话，发一句「帮我加个 X 页」，应自动唤醒 `coolflow-clarify` / `coolflow-design`。

看到 `Skill(coolflow-clarify)
  ⎿  Successfully loaded skill` 即正常。

---

## 日常使用

### 两种用法

**说人话**（推荐），AI 自动选技能：
```
帮我加一个「用户积分」页面，前端在 project-a
```

**显式命令**（精确控制从哪步开始）：

| 命令 | 何时用 | 产出 |
|---|---|---|
| `/coolflow-clarify` | 需求还很模糊，要先澄清（多轮对话：一次性收集问题、逐条回答、含次生问题） | `coolflow/<需求名>/clarify-<日期>.md` |
| `/coolflow-design` | 需求已澄清，要技术方案（按内化规范 `technical-solution-spec.md`） | `coolflow/<需求名>/design-<日期>.md` |
| `/coolflow-generate` | 方案已评审，要生产级真实代码（任务清单分步执行，含 D2C） | 代码（落项目）+ `coolflow/<需求名>/generate-<日期>.md` |
| `/coolflow-review` | 代码写完，要做 CR（按内化规范 `team-cr-principles.md`，P0–P3 分级） | `coolflow/<需求名>/review-<日期>.md` |
| `/coolflow-precipitate` | 随时想复盘沉淀经验 | 候选清单 → 你确认 → 写入规则/知识库 |

### 阶段产物落点
所有阶段文档统一落到**当前执行目录**下的 `coolflow/<需求名称>/`，文件名 `<阶段名>-<YYYYMMDD>.md`，便于聚合归档。

---

## 项目级规范（可选）

要让某项目用自己的规范：在项目根建 `<项目>/.claude/`（`local-rules.md`、`global-rules/`、`knowledge-base/`），
或在项目里跑 `coolflow init-project` 生成骨架。**不配则自动回退到全局 `defaults/` 兜底规范**。

规范按**分层就近覆盖**解析：项目专属 > 项目级通用/技术栈 > 项目天然规范（`package.json`/`.eslintrc`/`tsconfig`）> 全局兜底。

---

## 强制规则（硬门禁）

工作流只在**三个关键节点**设硬门禁，其余环节 AI 可灵活变通：

| 硬门禁 | 含义 |
|---|---|
| 🚫 `design-needs-spec` | 未读内化规范 + 澄清结果，不许出方案 |
| 🚫 `code-needs-design` | 无通过评审的设计，不许生成业务代码 |
| 🚫 `precipitation-needs-confirm` | 未经你逐条确认，不许写规则/知识库 |

**临时跳过硬门禁需精确指令**：必须**同时**给出 ① 明确跳过用词（跳过/别走/不用…）＋ ② 点名跳哪一步
（如「跳过设计，直接写代码」），AI 才会跳并先回显风险。只说「快点/直接改」这类模糊话不会被擅自跳过，
而是先追问确认一次。仅 `design` / `generate` 两道流程门禁可跳；**「写知识库前逐条确认」那道不可跳过**。

---

## 知识沉淀

- **项目级（默认）** → 当前项目 `<项目>/.claude/`：`global-rules/*`、`knowledge-base/business-domains/{模块}.md`
- **团队全局** → 全局 `defaults/`（写回源仓库 `defaults/` 并发版，作为新项目兜底基线）
- **流程改进** → 直接改进对应技能的 `SKILL.md`

每条沉淀都带出处注释（`<!-- 沉淀于 日期，来源：场景 -->`）。AI **只沉淀本次对话真实发生过的经验**，
不会凭空造规则，且永远是追加不覆盖、等你确认才写。

---

## 仓库结构

```
coolflow/                        # npm 包源仓库
├── package.json                 # bin: coolflow
├── bin/coolflow.mjs             # 安装器：init / update / uninstall / doctor / init-project
├── hooks/session-start.mjs      # 引导注入器（Node，自定位 + 注入运行时上下文）
├── skills/                      # 全部技能（每目录一个 SKILL.md）
│   ├── coolflow-using-flow/         元技能（自动注入，强制+检索+分层规范解析）
│   ├── coolflow-precipitate/        沉淀元技能（项目级/全局两档）
│   ├── coolflow-clarify/            需求澄清（一次性收集问题+多轮对话+知识库检索）
│   ├── coolflow-design/             方案设计样板技能（+ technical-solution-spec.md 内化规范）
│   ├── coolflow-generate/           代码生成（任务清单分步执行 + 单测判断 + 分项自检）
│   └── coolflow-review/             代码审查（+ team-cr-principles.md 内化 CR 规范）
└── defaults/                    # 全局兜底规范（项目没配时用）
    ├── global-rules/
    └── knowledge-base/
```

安装后的用户级结构（`~/.claude/`）= 上面 skills/hooks/defaults 的副本 + `settings.json` 里注册的 SessionStart hook。

---

## 扩展与维护

- **新增技能**：在 `skills/<coolflow-name>/` 建 `SKILL.md`，frontmatter 只写 `name` 和 `description`
  （`description` 只写"何时使用/触发关键词"，不要概括工作流），正文参照 `coolflow-design/SKILL.md`。
- **改内化规范**：design 模板改 `skills/coolflow-design/technical-solution-spec.md`；
  CR 规范改 `skills/coolflow-review/team-cr-principles.md`。两份是各自阶段的唯一权威来源。
- 改完后 `coolflow update` 重新安装即生效。

---
## 卸载
注意，卸载前一定要执行`coolflow uninstall`来清理全局注入到claude code中的文件，否则残留的文件会对claude code产生影响

---

## 常见问题（FAQ）

**Q：AI 没有自动走流程 / 没注入纪律？**
A：跑 `coolflow doctor` 自检；确认①已 `coolflow init` 安装；②Node ≥ 18；③是新会话或 `/clear` 后。hook 任何异常会静默降级，不报错但也不注入。

**Q：技能调用为什么用 Skill 工具而不是直接读文件？**
A：直接 Read 技能文件会绕过渐进式披露、吃上下文。统一用 Skill 工具按需加载。

**Q：可以临时跳过某道硬门禁吗？**
A：能，但要**精确指令**：必须同时说清「跳过」意图 ＋ 点名跳哪一步（如「一行修复，跳过设计直接写」），
AI 才会跳并先提示风险；只说「快点 / 直接改」会被**追问确认一次**，不会擅自跳。且仅 design / generate
两道流程门禁可跳，「写规则/知识库前逐条确认」那道**不可跳过**。

**Q：沉淀会不会乱写我的规则文件？**
A：不会。AI 只提候选，**必须等你回复要哪几条**才写，且永远是追加不覆盖。

---
