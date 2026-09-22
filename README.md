# 任务看板

一个基于 **Vue 3 + Vite + Tailwind CSS** 的本地任务管理系统：三列看板视图，拖拽卡片即可切换任务状态，数据保存在浏览器 localStorage 中，刷新不丢失。

## 功能特性

- **任务增删改查**：标题必填（弹窗内校验并提示）、描述选填；支持随时编辑
- **三种状态**：待办 / 进行中 / 完成，对应看板三列，列头显示实时计数
- **三档优先级**：高（红）、中（黄）、低（绿），以彩色徽章直观区分
- **拖拽换列**：原生 HTML5 拖拽（零额外依赖），卡片拖入目标列即改状态；列随悬停高亮提示落点
- **深色模式**：一键切换，选择保存在 localStorage；下次打开自动恢复，且首屏渲染前即生效（无闪烁）
- **本地持久化**：任务数据存于浏览器 localStorage，刷新、关闭浏览器后均不丢失；加载时自动过滤损坏数据

## 技术栈

| 类别 | 选型 |
| --- | --- |
| 前端框架 | Vue 3（Composition API + `<script setup>`） |
| 构建工具 | Vite 7 |
| 样式方案 | Tailwind CSS 4（深色模式采用 class 策略） |
| 数据存储 | localStorage |
| 拖拽实现 | 原生 HTML5 Drag and Drop API |

## 快速开始

环境要求：Node.js ≥ 20.19（或 ≥ 22.12），npm ≥ 10。

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 构建生产版本（输出到 dist/）
npm run build

# 本地预览构建产物（默认 http://localhost:4173）
npm run preview
```

## 使用说明

1. **新建任务**：点击右上角「新建任务」，填写标题（必填）、描述（选填），选择优先级后保存，新任务出现在「待办」列顶部
2. **编辑 / 删除**：卡片右上角的铅笔图标进入编辑（可同时修改状态）；垃圾桶图标点击一次后进入「确认删除」状态，2.5 秒内再点一次即删除
3. **切换状态**：按住卡片拖到目标列即可；不便拖拽时（触屏、键盘操作）也可通过编辑弹窗中的状态下拉框修改
4. **切换主题**：点击头部右侧的日 / 月图标，选择会被记住

## 项目结构

```text
├── index.html                     # 入口 HTML，内含深色模式首屏恢复脚本
├── vite.config.js                 # Vite 配置（Vue + Tailwind 插件）
└── src/
    ├── main.js                    # 应用入口
    ├── style.css                  # Tailwind 引入与深色模式变体配置
    ├── App.vue                    # 布局：头部 + 看板 + 弹窗调度
    ├── components/
    │   ├── BoardColumn.vue        # 看板列：拖放接收区 + 空列提示
    │   ├── TaskCard.vue           # 任务卡片：拖拽源、编辑/两步删除
    │   └── TaskModal.vue          # 新建/编辑弹窗：表单校验
    └── composables/
        ├── useTasks.js            # 任务数据层：CRUD + localStorage 持久化
        └── useTheme.js            # 深色模式开关与记忆
```

## 数据与隐私说明

- 所有数据仅保存在**当前浏览器**中，不上传任何服务器
- 使用两个 localStorage 键：
  - `kanban.tasks.v1` — 任务列表（JSON 数组）
  - `kanban.theme` — 主题选择（`dark` / `light`）
- 清除浏览器站点数据即清空所有任务；更换浏览器或设备数据不会同步


#### ps:软工agentic开发的课堂实践(代码仓库基本只有这句话是手写的)