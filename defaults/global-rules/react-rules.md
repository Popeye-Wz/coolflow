# React 专项规范（react-rules）· 全局兜底

> 全局兜底规范：项目未在 `PROJECT_RULES/global-rules/` 配置时使用。

## 组件设计
1. 函数组件 + Hooks 优先
2. 组件控制在 200 行以内
3. Props 接口必须显式定义

## Hooks 使用
1. 自定义 Hooks 以 `use` 开头
2. 单一职责
3. `useEffect` 依赖项要写清楚

## 状态管理
1. 本地状态：useState / useReducer
2. 服务端状态：React Query
3. 全局状态：Zustand（避免 Redux 过度设计）

<!-- 沉淀区：以下由 /coolflow-precipitate 在用户确认后追加 -->
