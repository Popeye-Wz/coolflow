---
name: coolflow-design
description: Use when a requirement has been clarified and you need a frontend technical solution document - generated from the user's command-line input plus the coolflow-clarify-stage "需求澄清结果", strictly following the internalized team spec technical-solution-spec.md. Triggers on /coolflow-design or "做方案/技术方案/出技术方案/架构设计".
---

# 方案设计（design）

**本阶段唯一职责**：从「用户命令行输入」+「clarify 阶段产物的『需求澄清结果』部分」获取需求，
**严格按本技能内化的规范 `technical-solution-spec.md`** 生成一份前端技术方案文档。
本技能是「样板技能」，coolflow-clarify/coolflow-generate/coolflow-review 参照其结构编写。

## 内化规范
- 规范文件：**与本 SKILL 同级的 `technical-solution-spec.md`**（已内化、自包含：
  去掉原始团队规范的命名/目录规则与威胁性措辞，输入改为「用户输入 + 需求澄清结果」）。
- 这是本阶段的**唯一权威规范**，自包含无外部依赖。

## 硬门禁（开工前必过）

<HARD-GATE id="design-needs-spec">
🚫 **未 Read 内化规范 + clarify 需求澄清结果，禁止产出技术方案。**
开始前必须完成「步骤 1」：Read 同级 `technical-solution-spec.md`，
并 Read `coolflow/<需求名称>/clarify-<日期>.md` 取其「需求澄清结果」部分。凭印象写 = 违规。
**可跳过性**：仅当用户下达**精确跳过指令**（明确跳过用词 + 点名本门禁/设计阶段）才可跳过；
模糊话不算，须先追问确认一次。详见元技能 `coolflow-using-flow` 的「硬门禁跳过协议」。
</HARD-GATE>

## 阶段产物落点（遵守元技能「阶段产物落点规则」）
- 输出：`coolflow/<需求名称>/design-<YYYYMMDD>.md`

## 流程清单（请为每步建 TodoWrite）

### 步骤 1：读取规范与需求输入（硬门禁要求）
- Read 同级 `technical-solution-spec.md` —— 本阶段的强制规范与模板。
- Read `coolflow/<需求名称>/clarify-<日期>.md`，提取「需求澄清结果」部分（产物文件名仍为 clarify-<日期>.md）。
- 收集用户命令行输入（$Tapd$、【相关文档】、$涉及页面$、$改动内容$、$生成要求$ 等）。
- 把以上合并为规范所称的输入 **X**。
- 按**分层规范解析**（见元技能）检索：优先当前项目 `PROJECT_RULES/knowledge-base`、
  `PROJECT_RULES/global-rules`，缺失回退 `DEFAULTS/`；并读项目中相关页面代码。

### 步骤 2：严格按 technical-solution-spec.md 生成方案
- 遵守规范每一条：只出方案不出代码；`**...**` 是生成要求不得呈现；8 章节结构固定；
  图表规则（未指定图类型默认泳道；泳道→PlantUML、其他→Mermaid、改动后橙色高亮、架构图 flowchart TB/无箭头/classDef 等）。
- 不明确处对话询问用户，或回到 coolflow-clarify 补澄清。

### 步骤 3：输出方案文档
- 写入 `coolflow/<需求名称>/design-<YYYYMMDD>.md`（目录不存在则创建；需求名取不到就问用户）。

### 步骤 4：呈现 + 用户评审
- 按章节分段呈现要点，请用户确认。该「用户确认」是下游 `coolflow-generate` 的 code-needs-design 门禁依据。

## 输出
- `coolflow/<需求名称>/design-<YYYYMMDD>.md` —— 前端技术方案（结构 100% 对齐内化规范）

## 收尾
按 `coolflow-using-flow` 纪律调用 `coolflow-precipitate` 反思沉淀。

## 红旗表
| 念头 | 真相 |
|---|---|
| "规范我大概记得，不用 Read" | 违反 design-needs-spec。先 Read technical-solution-spec.md 与 clarify 文档。 |
| "直接从对话取需求，不读需求澄清结果" | 需求输入唯一来源是 clarify 的「需求澄清结果」+ 用户输入。必须 Read。 |
| "把规范里 ** ** 的生成要求也写进方案" | 那是生成要求，不得呈现在结果中。 |
| "顺手把实现代码也写了" | 规范明确只出方案、不出代码。代码归 generate。 |
| "方案我一次性全抛给用户" | 要分段呈现、逐段确认，否则下游无评审依据。 |
