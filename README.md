# STAR 星辰 · 星辰收信处（Nuxt 3 版 · V2）

> 一个面向年轻人的情感故事社区：匿名写下真实经历，阅读他人的故事，留下善意的回应。
> 本目录是在 V1 纯 HTML/CSS/JS 原型基础上，用 **Nuxt 3 + Vue 3 + TypeScript** 重构的现代工程，
> 并同步完成了「温馨治愈化」的视觉升级。V1 原型仍保留在 `C:\Users\Administrator\Desktop\项目`，未删除。

---

## 一、快速开始

环境要求：Node.js 18+（本机实测 Node v22.23.2 / npm 10.9.8）。

```bash
npm install        # 安装依赖（已执行过可跳过）
npm run dev        # 开发模式，默认 http://localhost:3000，热更新
npm run build      # 生产构建，产物在 .output/
npm run preview    # 本地预览生产构建（需先 build；默认 3000 端口）
# 自定义预览端口：PowerShell 中  $env:PORT="3001"; node .output/server/index.mjs
```

- 检查排版用的虚拟数据：访问 `http://localhost:3000/?demo=1`
  （顶部出现金色「开发测试模式」横幅，测试故事带「测试数据」角标；**数据只在内存、绝不写入 localStorage，刷新或打开干净 URL 即还原**）。
- 当前全站 `<meta name="robots" content="noindex,nofollow">`（见 `nuxt.config.ts`），**正式上线前移除**。

---

## 二、技术栈与架构

| 关注点 | 选型 / 做法 |
|---|---|
| 框架 | Nuxt 3（SSR 开启）、Vue 3 `<script setup>`、TypeScript |
| 构建 | Vite（Nuxt 内置） |
| 路由 | 文件路由，`pages/story/[id].vue` 即故事独立 URL |
| 样式 | 原生 CSS + CSS 变量设计 Token（`assets/css/tokens.css`），无 UI 框架依赖 |
| 图标/插画 | 全部为内联 Vue SVG 组件，无图片文件、无 emoji 堆砌 |
| 数据（当前） | 静态创作数据 + 浏览器 localStorage（本机投稿/收藏/互动）+ demo 内存数据 |
| 数据（未来） | 仅替换 `composables/useStories.ts` 一层即可接入后端 API，页面无需改动 |

### SSR 与客户端数据策略（避免 hydration mismatch）

- **静态创作故事**（`data/createdStories.ts`，栏目「星辰故事集」）服务端即可渲染，利于 SEO 与独立 URL；
- **localStorage 里的本机投稿 / 收藏 / 互动只在客户端**、由 `plugins/local-data.client.ts` 在 `app:mounted` 后载入；
  因此服务端首屏 HTML 与客户端首次渲染一致，不会出现 hydration 报错；
- 故事详情页对「仅本机存在」的链接做了三态处理：**读取中 → 内容 / 不存在**，不会把本机故事误判为 404；
- `?demo=1` 数据仅存于客户端内存。demo 标志在一次 SPA 会话内保持（方便在列表/详情间连续检查排版），
  刷新或打开干净 URL 即回到正式模式，且不写入任何存储。

---

## 三、目录结构

```
star-app/
├── app.vue                      # 根布局：页头 / NuxtPage / 页脚 / Toast / Modal / demo 横幅
├── nuxt.config.ts               # SSR、组件自动导入、全局 CSS、head（noindex、favicon、标题模板）
├── assets/css/
│   ├── tokens.css               # 暖色设计 Token：配色 / 阴影 / 圆角 / 间距 / 动画时长
│   └── main.css                 # 全部组件样式 + 响应式断点（1024 / 860 / 480）+ 微动效
├── types/story.ts               # Story / Comment / StoryInput / SortKey 等类型
├── data/                        # 注意：data 目录不自动导入，用时需显式 import
│   ├── brand.ts                 # 品牌常量、EDITORIAL_NOTE 创作声明、EDITORIAL_AUTHOR
│   ├── categories.ts            # 18 分类 + 首页 12 分类 + 可投分类
│   ├── tags.ts                  # 40 个标签
│   ├── createdStories.ts        # ★ 创作故事（冷启动内容，当前为空数组占位，待第三步填充）
│   └── devStories.ts            # 3 篇 demo 测试故事（仅 ?demo=1 出现）
├── utils/                       # Nuxt 自动导入
│   ├── formatTime.ts            # 相对时间
│   ├── text.ts                  # makeExcerpt 摘要
│   ├── id.ts                    # uid / 随机匿名昵称
│   └── storyQuery.ts            # 排序 / 关键词匹配 / 相关推荐权重
├── composables/                 # Nuxt 自动导入
│   ├── useStories.ts            # ★ 数据服务层（后端接入只改这里）
│   ├── useToast.ts              # 全局轻提示
│   └── useModal.ts              # 全局弹窗
├── plugins/local-data.client.ts # 客户端挂载后载入本机数据
├── components/
│   ├── layout/                  # AppHeader / AppFooter（含移动端抽屉）
│   ├── ui/                      # AppIcon / BaseButton / TagChip / Tabs / SearchBar /
│   │                            #   EmptyState / ToastHost / AppModal
│   ├── illustrations/           # Heart / Star / Sparkle / Moon / Cloud / Envelope /
│   │                            #   PaperPlane / Flower / EmptyIllustration / HeroDecor
│   └── story/                   # StoryCard / RelatedList
└── pages/
    ├── index.vue                # 首页：Hero + Feed + 分类入口 + 标签云
    ├── discover.vue             # 发现：搜索 / 排序 / 分类 / 标签 / 收藏，状态同步 URL
    ├── story/[id].vue           # 详情：长文 / 共鸣 / 收藏 / 分享 / 评论 / 举报 / 相关推荐
    ├── write.vue                # 投稿：校验 / 标签 / 公开私密 / 本机保存反馈
    └── about.vue                # 关于与政策草案（目录滚动高亮）
```

> 自动导入提示：`components/`、`composables/`、`utils/` 由 Nuxt 自动导入；
> `data/` 与 `types/` **不会**自动导入，在页面/组件中用到时请显式 `import`（如 `import { TAGS } from '~/data/tags'`）。

---

## 四、数据模型与本地存储键

Story 关键字段：`id / title / content / category / tags / authorName / createdAt /
visibility('public'|'private') / likes / liked / comments / source('editorial'|'user') / _dev?`。

- `source` 用于**内容分轨**：`editorial` = 星辰故事集（编辑创作，金色角标 + 显著声明）；`user` = 用户投稿；
- 创作故事的本机点赞/评论存独立互动表，不改动静态数据本身；本机投稿直接修改故事对象；demo 故事只改内存。

localStorage 键（V2，勿与 V1 的 `star.*.v1` 混用）：

| key | 内容 |
|---|---|
| `star.stories.v2` | 本机投稿（含私密） |
| `star.bookmarks.v2` | 收藏的故事 id |
| `star.interactions.v2` | 创作故事的本机点赞 / 评论 |

### 接入后端时怎么做

只改 `composables/useStories.ts`：把 `loadLocal / publicStories / getStoryById /
createStory / toggleLike / toggleBookmark / addComment ...` 内部实现换成 `$fetch` / `useFetch`
调用对应 API，并把 localStorage 键替换为 token / 用户体系；页面与组件层不用改。
审核态、访问控制、真实举报与评论审核都应在后端实现，前端只保留交互与状态展示。

---

## 五、视觉与内容合规

- 暖色 Token：奶油底 `#FBF7F1`、暖分区、奶白卡片、暖粉 `#E58C9B`、淡紫 `#7165B5`、杏色、星辰金、暖深棕文字；
  Hero 为柔和暖紫渐变。杜绝大面积纯白，装饰服务情绪、不抢正文；微动效尊重 `prefers-reduced-motion`。
- 创作内容红线（写 `createdStories.ts` 时必须遵守）：统一栏目「星辰故事集」、作者「星辰编辑部」、
  每篇显著展示 `EDITORIAL_NOTE`（见 `data/brand.ts`）；**不伪装真实投稿、不伪造阅读/点赞/评论数**；
  只用公共情感母题、文字全部原创虚构化，不逐字复制任何文章或私人树洞。

---

## 六、本次验证记录（2026-10-10）

- `npm install` 成功；`npm run dev` 与 `npm run build` 均通过（构建产物约 536 KB gzip）；
- 五个页面 + 筛选 query + 详情页 SSR 全部 HTTP 200；生产预览（`node .output/server/index.mjs`）路由 200；
- 浏览器实测：hydration 无报错；demo 列表/详情、共鸣、收藏、Toast、评论（无重复渲染）、相关推荐空状态正常；
- 投稿校验通过、写入 localStorage、成功面板与「查看故事」正常；本机故事直接访问三态、不存在故事缺失态正确；
- 移动端 390px：无横向溢出，导航折叠为汉堡、Hero 字号自适应、分类卡 2 列、筛选单列堆叠、标签自动换行。

迁移中修复的问题：两个 SVG 插画组件（MoonIcon / CloudIcon）模板闭合标签错误；
数据层 `loadLocal` 已定义但漏导出导致客户端插件报错；demo 模式在 SPA 内跳详情丢参（改为会话内存标志，不落盘）。

---

## 七、待办（下一步）

- [x] ~~**冷启动创作内容**~~ ✅ 已完成：8 篇创作故事已写入 `data/createdStories.ts` 并入库；
- [ ] 正式上线前移除 `noindex,nofollow`，补齐运营主体 / 备案 / 隐私与举报的真实信息；
- [ ] 后端接入：P1 已完成（数据库 + 只读接口 + SSR 切真库）；待做 P2 账号与投稿审核流、P3 互动与举报。

---

## 八、Git 与换机开发

仓库地址：`https://github.com/qin-xuan-boop/star-app`（分支 `main`）

### 换一台电脑继续开发

```bash
git clone https://github.com/qin-xuan-boop/star-app.git
cd star-app
npm install        # 依赖不在仓库里，必须装（约 1-2 分钟）
npm run dev        # 打开 http://localhost:3000
```

**首次启动会自动做两件事**：

1. 创建 SQLite 数据库文件 `工程/.data/star.sqlite`（已 gitignore，不进仓库）；
2. 自动执行 seed，把 `data/createdStories.ts` 里的创作故事灌进数据库——所以换机后站点仍有全部 8 篇故事。

> 需要 Node 18 以上（推荐 22）。公司电脑没有就先装 Node。

### 每天开始干活前 / 收工后

```bash
git pull           # 开工前先拉最新（避免两台机器改冲突）
# ...改代码...
git add -A
git commit -m "说明这次改了什么"
git push           # 推回远程，另一台电脑就能 pull 到
```

### 仓库里有什么、没有什么

| 会被跟踪（进仓库） | 不会进仓库（gitignore） |
|---|---|
| 全部源码、`pages/` `components/` `server/` `composables/` `data/` `assets/` | `node_modules/` 依赖包 |
| `package.json` + `package-lock.json`（依赖清单） | `.data/` 本地 SQLite 数据库（各机器独立，自动重建） |
| 配置文件、README | `.output/` `.nuxt/` 构建产物 |
| | `.env` 环境变量（以后放密钥，永不提交） |

**因此：换机会丢的只有本机的测试投稿 / 点赞 / 评论**（这些数据本来就只在浏览器里），故事正文和代码都在。
