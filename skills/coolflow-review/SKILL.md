---
name: coolflow-review
description: Use when code changes are ready and need an AI-assisted, rigorous code review that strictly follows the internalized team CR spec team-cr-principles.md - 12 CR principles plus P0/P1/P2/P3 grading. Triggers on /coolflow-review or "代码审查/CR/review/看下这段代码".
---

# 代码审查（review）

对**本次改动的代码**进行认真细致的 review，**完全参考本技能内化的规范
`team-cr-principles.md`**，结果输出至产物文档。

## 内化规范
- 规范文件：**与本 SKILL 同级的 `team-cr-principles.md`**（已内化、自包含，
  含 12 条 CR 原则、执行顺序、P0–P3 输出格式）。
- 这是本阶段的**唯一权威规范**，开工前必须 Read。

## 阶段产物落点（遵守元技能「阶段产物落点规则」）
- 输出：`coolflow/<需求名称>/review-<YYYYMMDD>.md`

## 流程清单（请为每步建 TodoWrite）

### 步骤 1：读取内化规范（必做）
- Read 同级 `team-cr-principles.md`，按其「执行顺序」与「12 条原则」开展审查。

### 步骤 2：加载工程规范与变更
- 按规范执行顺序与**分层规范解析**（见元技能）：先 Read 当前项目 `PROJECT_RULES`（CLAUDE.md、
  local-rules、global-rules）、`AGENTS.md`/`.claude/guidelines/`（如有），缺失回退 `DEFAULTS/`。
- 取本次改动 diff（`git diff` / `--range`），识别变更范围，关联 `coolflow/<需求名称>/design-<日期>.md`。

### 步骤 3：按 12 条原则逐项审查
- 通用维度（correctness/回归风险/边界条件/可维护性）+ 技术栈最佳实践 + 团队 12 条原则。
- 重点：主流程、状态边界、调用链完整性、线上可观测性；对主流程更关注长期维护与线上可还原性。

### 步骤 4：输出报告到产物文档
- 写入 `coolflow/<需求名称>/review-<YYYYMMDD>.md`，按 **P0/P1/P2/P3** 分组。
- 每条含：① 问题类型 ② 文件位置 `file_path:line` ③ 问题说明 ④ 为什么重要 ⑤ 建议改法。
- 附正向反馈与（如命中）团队原则 + 技术栈两层原因说明。

## 收尾
按 `coolflow-using-flow` 纪律调用 `coolflow-precipitate` 反思沉淀
（CR 常是最高产沉淀源：反复出现的问题 → 编码规范；业务理解偏差 → 业务知识）。

## 红旗表
| 念头 | 真相 |
|---|---|
| "规范我记得，直接审" | 必须先 Read team-cr-principles.md，按其 12 条原则与顺序审。 |
| "只报代码风格问题" | 规范明确禁止只报风格；要覆盖完整性/状态/入口/埋点/测试。 |
| "只说'可能有问题'不给原因" | 每条必须给『为什么重要』+ 建议改法。 |
| "P0 和 P3 混在一起说" | 必须按 P0/P1/P2/P3 分级，关键问题要能阻断合并。 |
