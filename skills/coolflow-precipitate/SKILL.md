---
name: coolflow-precipitate
description: Use right after solving any concrete problem - finished a feature, fixed a bug, made an architecture decision, or hit a gotcha - to reflect on whether any reusable knowledge is worth precipitating. It actively RECOGNIZES newly-introduced business concepts/domain rules and newly-added or CHANGED code conventions from this conversation, then recommends the exact file in the CALLING PROJECT's knowledge base to write each into (append to an existing file, or create a new one from template). Also runs when the user types /coolflow-precipitate or asks to 沉淀/复盘/总结规范.
---

# 沉淀知识（元技能）

把「这次解决问题中真实涌现的、可复用的经验」**识别**出来，**匹配到调用项目知识库里
最合适的那个文件**，做成候选项，**交给用户逐条确认后**再写入。
这是 superpowers 里 `writing-skills`「自我繁殖」思想的团队版。

## 何时唤醒

- **自动**：每当你在本仓库里解决完一个具体问题（做完需求、修完 bug、
  定位完一个坑、敲定一个架构选择），收尾时由 `coolflow-using-flow`
  唤醒本技能 —— 这是工作流的固定收尾环节，不可跳过。
- **手动**：用户随时输入 `/coolflow-precipitate`，或说「复盘 / 沉淀一下 / 总结规范」。

## 第一性原则（来自 writing-skills 的核心洞见）

> **沉淀的内容必须来自本次对话里真实发生过的问题或决策，绝不能凭空发明。**

如果某条「规范/知识」你无法在本次对话中指出触发它的具体片段（哪行代码踩了坑、
哪个反复纠正、哪个澄清出来的业务约束），它就不该被沉淀。宁可少，不可造。

## 流程（严格按序，请为每步建 TodoWrite）

### 步骤 0：先摸清「调用项目」的知识库落点（识别与推荐的基础）

沉淀必须落到**当前调用根目录项目**的知识库，而不是凭空起文件名。先建立落点清单：

1. 从运行时上下文读取 `PROJECT_RULES`（`[COOLFLOW-RUNTIME]` 块里的项目 `.claude` 目录）
   与 `DEFAULTS`（全局兜底）。
2. **盘点已有落点**（用 Glob/Read，不要预加载全文，只建文件清单 + 各文件标题/小节）：
   - 业务知识：`PROJECT_RULES/knowledge-base/_index.md` 及 `business-domains/*.md`、
     `architecture/*.md`、`api-contracts/*.md`。
   - 代码规范：`PROJECT_RULES/global-rules/*.md`（通用 + 各技术栈，如 `react-rules.md`）、
     项目 `CLAUDE.md` / `local-rules`。
3. `PROJECT_RULES` 不存在或对应文件缺失 → 落点回退到 `DEFAULTS/` 下同名文件（兜底层）。
4. 形成一张「**现有文件 + 各自覆盖主题**」的清单，供步骤 2 做精准匹配。

### 步骤 1：扫描本次对话，识别候选（重点：认出"新增/变更"）

回顾本轮从开始到现在，主动**识别**符合下列任一类型、且有真实证据的项。
对每条都要判断它相对步骤 0 清单是 **🆕 新增** 还是 **✏️ 对已有条目的变更/补充**。

| 类型 | 要识别的内容 | 典型信号 |
|---|---|---|
| 业务知识 | 新增**业务概念/术语**、领域规则、状态语义、业务约束 | 澄清阶段定义了新名词；"X 必须先 Y"；后台/产品口径确认 |
| 代码规范 | **新增或有变化**的编码约定（命名、目录、写法、lint 取舍） | 用户反复纠正同一种写法；定下统一约定；推翻了某条旧规范 |
| 架构约定 | 目录结构、状态管理、分层、模块边界等可复用决策 | 敲定"这类逻辑统一放某处"；定下数据流/分层 |
| API 契约 | 接口字段含义、取值约定、前后端口径 | "周几后端返回 0–6"；分页/错误码约定 |
| 踩坑记录 | 非显然的坑（环境、依赖、API 怪异行为）及其解法 | 排查了一段时间才定位；解法不直观 |
| 流程改进 | 现有工作流/技能本身的缺漏 | 发现某技能漏了一步、门禁有洞 |

识别要点：
- **业务概念**：本次澄清/设计里第一次出现、且会复用的名词或规则 → 多半落 `business-domains/`。
- **代码规范变化**：不仅认"新增"，也要认"**与已有规范冲突/更新**"——这类要标 ✏️ 变更，
  在候选里写明"原规范 X → 现约定 Y"，由用户裁决是否覆盖性更新（仍走追加 + 出处注释，不静默改写）。

**没有符合的，就如实说「本次无值得沉淀项」并结束** —— 不要为了凑数而编造。

### 步骤 2：为每条候选匹配「精准落点」（新建 / 追加 / 更新某节）

对每条候选，用步骤 0 清单决定落点动作，三选一：
- **追加到已有文件的对应小节**：命中已有业务域/规范文件（如 `react-rules.md` 的「命名规范」、
  `business-domains/user-module.md` 的「业务概念」）。优先复用，避免新建重复文件。
- **新建文件**：无任何已有文件覆盖该主题（如全新业务域）→ 按 `knowledge-base/business-domains/_template.md`
  新建，并准备在 `_index.md` 登记。
- **更新已有条目**（✏️ 变更类）：定位到旧条目，**追加新约定 + 出处注释**并标注它取代/修订了旧条目；
  绝不静默删改旧文。

落点范围默认 **项目级**（`PROJECT_RULES`）；仅当用户判断该经验对所有项目通用时，才选 **团队全局**（`DEFAULTS/`）。

### 步骤 3：产出候选清单（编号呈现）

每条候选必须包含以下要素：

```
[N] 类型：<业务知识 / 代码规范 / 架构约定 / API 契约 / 踩坑记录 / 流程改进>
    新增or变更：<🆕 新增 / ✏️ 变更（原:… → 现:…）>
    标题：<一句话>
    落点范围：<项目级（默认）/ 团队全局>
    建议落点：<具体文件 + 小节 + 动作，例：
              追加 → PROJECT_RULES/global-rules/react-rules.md「命名规范」
              新建 → PROJECT_RULES/knowledge-base/business-domains/points.md（并登记 _index.md）
              更新 → 同上文件某条目（取代旧约定）
              （选「团队全局」则把 PROJECT_RULES 换成 DEFAULTS）>
    原始证据：<本次对话中触发它的具体片段 / 行为>
    Why：<为什么值得沉淀（以后能避免什么返工/错误）>
    How to apply：<以后具体怎么用这条>
```

### 步骤 4：停下，请用户逐条确认（硬门禁）

<HARD-GATE id="precipitation-needs-confirm">
🚫 **未经用户逐条确认，禁止写入任何文件。**
列出 `[1] [2] [3] ...` 后，明确问用户：

> 「以上是本次可沉淀的候选项（含建议落点）。请告诉我确认沉淀**哪几条**（如：1、3），
>  或回复『都不要』。如对某条落点有异议也请直接说，我改完再写。」

收到确认前，**一个字都不许写进项目级或全局规范库/知识库**。
默认落点是**当前项目** `PROJECT_RULES`；若用户选「团队全局」，才写 `DEFAULTS/`（见运行时上下文）。
**可跳过性**：🔒 **本门禁不可跳过**——它保护用户文件不被擅自写入，任何跳过指令都不适用本门禁。
</HARD-GATE>

### 步骤 5：按确认结果写入并更新索引

仅对用户确认的条目：

1. **追加 / 新建 / 定向更新**到步骤 2 选定的文件 + 小节（永不覆盖删除旧内容）。
   文件不存在则先按对应模板创建。
2. 写入格式（每条带出处与日期，便于日后审计）：
   ```markdown
   <!-- 沉淀于 <YYYY-MM-DD>，来源：<一句话场景>；<🆕 新增 / ✏️ 修订自上方某条> -->
   ### <标题>
   <规则/知识正文>
   ```
3. 若新建或改动了业务域/架构/契约文档，**同步更新**对应 `knowledge-base/_index.md`
   （项目级落 `PROJECT_RULES/knowledge-base/_index.md`，全局落 `DEFAULTS/knowledge-base/_index.md`）。
4. 向用户回报：写入了哪几条、各落到哪个文件的哪个小节、是新建还是追加/更新、跳过了哪几条。

## 红旗表

| 念头 | 真相 |
|---|---|
| "这次没什么好沉淀的，跳过吧" | 反思本身不能跳；可以反思后得出「无」，但必须反思。 |
| "不看项目现有知识库，直接起个文件名" | 违反步骤 0。必须先盘点 PROJECT_RULES 已有文件，能复用就别新建。 |
| "新规范和旧的冲突，我直接改掉旧的" | ✏️ 变更也走追加 + 出处注释并标注取代关系，由用户裁决，绝不静默删改。 |
| "这条挺通用的，直接写进去" | 违反 precipitation-needs-confirm。用户没确认，不许写。 |
| "我帮用户把相关的也补全一下" | 只沉淀本次真实涌现的。凭空补全 = 造规则。 |
| "用户说要1和3，我把2也顺手加了" | 严格只写确认项。多一条都算违规。 |
| "新业务概念太小，塞进规范文件就行" | 业务概念/术语归 knowledge-base 业务域，规范归 global-rules，别混落点。 |
