# 通用编码规范（common-rules）· 全局兜底

> 全局兜底规范：项目未在 `PROJECT_RULES/global-rules/` 配置时使用。
> 可由 `/coolflow-precipitate`（选「团队全局」）在用户确认后持续追加，每条保留出处注释。

## 编码原则
1. DRY —— 避免重复代码
2. KISS —— 保持简单
3. 类型安全优先 —— 不要用 `any`

## 文件组织
1. 按功能域组织，而非按类型
2. 组件文件命名：`PascalCase.tsx`
3. 工具文件命名：`camelCase.ts`

## 命名规范
1. 组件：PascalCase（如 `UserCard`）
2. 函数：camelCase（如 `fetchUser`）
3. 常量：SCREAMING_SNAKE_CASE
4. 布尔值：`is/has/should` 前缀

<!-- 沉淀区：以下由 /coolflow-precipitate 在用户确认后追加 -->
