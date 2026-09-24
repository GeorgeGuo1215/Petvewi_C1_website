# PetHealthAI Website

PetHealthAI 产品与公司官网。产品定位是面向宠物的连续健康智能设备：通过毫米波感知、活动与位置数据，以及 PetMind 多模态 AI，把硬件、健康时间线和服务体验整合为一套系统。

## 官网 + 同帧审阅工具 / GitHub Pages

此仓库保留官网首页、简中／繁中／英文、团队和服务地图页面，并在官网页脚加入独立审阅工具入口。

- 官网发布路径：`https://georgeguo1215.github.io/Petvewi_C1_website/`
- 审阅工具路径：`https://georgeguo1215.github.io/Petvewi_C1_website/imu-review/`
- 工具源码与说明：[tools/imu-video-reviewer](tools/imu-video-reviewer/README.md)

首次发布：在 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**，再到 Actions 手动运行 **Test and deploy website with IMU reviewer**（后续推送 `main` 自动运行）。私有仓库能否启用 Pages 取决于账户套餐；不要为了部署而误改仓库可见性。以上是预定发布地址，只有工作流部署成功后才可访问。

工作流检查审阅工具单元测试、官网 correctness lint 与 TypeScript，然后构建并校验完整站点的本地链接／资源及工具公开文件清单。PR 只构建，不部署。原官网严格风格检查仍保留在 `pnpm check`；CI correctness 门禁不代表风格检查全部通过。

```bash
pnpm install --frozen-lockfile
pnpm test:reviewer
pnpm build:pages
node scripts/check-pages.mjs
```

静态构建在临时 `.pages-build-*` 副本中排除服务器 API 和语言重定向代理，生成 `out/`，**不会删除原始服务器代码**。GitHub Pages 的申请表只展示，不接收提交；常规 `pnpm dev`／服务器部署仍保留申请接口（需自行配置 webhook）。图片、导航和 JS/CSS 已适配仓库子路径，语言页面仍可直接访问或手动切换。

本机完整审阅功能另开终端：

```bash
cd tools/imu-video-reviewer
npm start
```

打开 `http://127.0.0.1:8080/`。视频修复需要 FFmpeg；画面时间 OCR 需要 macOS 与 Xcode Command Line Tools。Pages 模式支持区间标签编辑、手动同步、倍速联动和 CSV 导出，禁用本机专属功能。视频与 IMU 不会上传到 GitHub。导出的是新 CSV，不覆盖源文件。

公开构建仅包含官网资源和工具的 5 个前端文件，不包含本地录像、IMU／标签文件、修复缓存或 FFmpeg 二进制。若改仓库名或使用自定义域名，请同步调整工作流的 `NEXT_PUBLIC_BASE_PATH` 和 `NEXT_PUBLIC_SITE_URL`；根域部署将前者设为空字符串。

验证范围与限制见 [docs/REVIEWER_QA.md](docs/REVIEWER_QA.md)。

## 技术栈

- Next.js 16 App Router + React 19 + TypeScript
- Tailwind CSS 4
- Motion for React
- Oxlint + Oxfmt
- pnpm 10

## 本地开发

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm dev
```

默认开发地址为 `http://localhost:3000`。

## 页面与语言路由

| 页面 | 简体中文 | 繁體中文      | English    |
| ---- | -------- | ------------- | ---------- |
| 首页 | `/`      | `/zh-tw`      | `/en`      |
| 团队 | `/team`  | `/zh-tw/team` | `/en/team` |

首次访问无语言前缀的页面时，服务端根据系统语言（`Accept-Language`）选择版本：简体中文地区使用简体中文，繁体中文地区使用繁体中文，英文及其他暂不支持的语言使用英文。用户主动切换语言后，选择结果会保存一年，并优先于系统语言；当前页面、查询参数和锚点会被保留。

## 常用命令

```bash
pnpm dev           # 启动开发服务器
pnpm build         # 创建生产构建
pnpm start         # 运行生产服务器
pnpm lint          # Oxlint 静态检查
pnpm lint:fix      # 应用 Oxlint 安全修复
pnpm format        # 使用 Oxfmt 写入格式化结果
pnpm format:check  # 检查格式，不改文件
pnpm typecheck     # TypeScript 类型检查
pnpm check         # lint + typecheck + format check
```

## 环境变量

| 变量                             | 作用                                              | 暴露范围       |
| -------------------------------- | ------------------------------------------------- | -------------- |
| `NEXT_PUBLIC_SITE_URL`           | 生成 canonical、hreflang 与 Open Graph 的站点来源 | 浏览器与服务端 |
| `BETA_APPLICATION_WEBHOOK_URL`   | 接收内测申请的 Webhook                            | 仅服务端       |
| `BETA_APPLICATION_WEBHOOK_TOKEN` | 可选的 Bearer Token                               | 仅服务端       |

未配置 Webhook 时，内测表单会返回可重试错误，不会伪装成提交成功。

## 文档

- [技术架构与改造说明](docs/TECHNICAL_ARCHITECTURE.md)
- [视觉设计系统](DESIGN.md)
