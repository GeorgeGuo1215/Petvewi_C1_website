# 下载到电脑后，让 AI 帮你安装和启动

适用于从 GitHub 下载 ZIP 或 `git clone` 后，在自己的电脑上运行项目。视频、IMU 和标签只在本机处理，不需要上传到 GitHub。

## 1. 下载并打开项目

在仓库页面选择 **Code → Download ZIP**，解压到有写入权限的普通文件夹，不要直接在压缩包内运行。也可以使用 Git 克隆。

用能够访问本地文件、执行终端命令的 AI 编程工具打开解压后的**仓库根目录**，然后发送下面的提示词。普通聊天 AI 无法直接安装软件，但可以指导你逐步执行命令。

## 2. 复制给 AI 的提示词

```text
请帮助我在这台电脑上安装并启动本仓库的“同帧：视频 / IMU / 标签审阅工具”。

先完整阅读 LOCAL_SETUP_WITH_AI.md、根 README.md 和
tools/imu-video-reviewer/README.md，检查代码和 package.json 后再操作。

要求：
1. 默认只启动审阅工具，不需要先安装整个 Next.js 官网的依赖。
2. 先检查操作系统、CPU 架构、当前目录、Node.js/npm、FFmpeg 和
   8080 端口占用情况；macOS 还需要检查 Xcode Command Line Tools。
3. 告诉我本机支持哪些功能、缺哪些依赖。优先复用现有依赖；需要
   安装系统软件、更新现有软件或使用管理员权限前，说明影响并征得
   我的同意。只从官方渠道或可信包管理器安装。
4. 不关闭安全软件，不修改系统安全策略，不删除我的文件，不上传
   视频/IMU/标签/密钥，不提交或推送任何代码。
5. 进入 tools/imu-video-reviewer，先运行 npm test，再运行 npm start。
   工具没有第三方 npm 依赖，不要无故在根目录执行 npm install。
6. 自动修复需要 FFmpeg；安装或配置后重启服务并验证。
   可以使用本工具 .local-tools 下的项目专用安装，不强制全局安装。
7. macOS 可配置本机 Vision OCR。Windows/Linux 暂不支持自动时间
   识别，请使用手动对齐，不要擅自修改代码或声称 OCR 可用。
8. 端口冲突时先识别占用者，不要直接杀进程；和我确认复用本项目
   服务，或者选择其他空闲端口。
9. 启动后检查页面、区间标签导入/编辑/导出和手动时间锚点。
   使用示例或临时文件，不覆盖原始 CSV；需要真实数据时先问我。
   自动修复测试只使用临时视频或我明确选定的视频。
10. 完成后告诉我：访问地址、实际项目目录、通过/未通过的检查、
    系统限制、以后如何启动和停止、缓存位置。

根据实际错误诊断，不要把“已安装”当作“已验证”。
如果不能使用终端，请一次给我一条操作步骤，等待反馈结果。
```

## 3. 功能与系统要求

| 功能 | Windows / Linux 本机 | macOS 本机 | GitHub Pages |
| --- | --- | --- | --- |
| 区间标签编辑、CSV 导出、可播放视频审阅 | 支持 | 支持 | 支持 |
| IMU 波形、手动对齐、倍速同步 | 支持 | 支持 | 支持 |
| 不导入 IMU，只审阅视频与标签 | 支持 | 支持 | 支持 |
| 自动修复视频 | Node.js + FFmpeg | Node.js + FFmpeg | 不支持 |
| 自动识别画面时间 | 暂不支持，使用手动对齐 | Node.js + Xcode Command Line Tools | 不支持 |

这是代码支持范围，不代表已在每种系统、架构和浏览器上实测。视频能否直接播放还取决于浏览器的编码支持，换电脑后仍需验收。

## 4. 手动快速启动

先安装受支持的 Node.js LTS 版本。工具最低要求 Node.js 18，官网最低要求 20.9；不建议新安装已经停止支持的旧版本。安装后重新打开终端，检查：

```bash
node --version
npm --version
```

在**仓库根目录**打开终端：

```bash
cd tools/imu-video-reviewer
npm test
npm start
```

访问 `http://127.0.0.1:8080/`，保持终端运行，用 `Ctrl+C` 停止。以后只需进入同一工具目录运行 `npm start`。

**工具不需要 `npm install`。在根目录运行 `npm start` 启动的是官网，不是审阅工具。**

### 安装 FFmpeg，启用自动修复

若 `ffmpeg -version` 成功，通常可直接使用。否则可以让 AI 协助安装，或在**工具目录**用 Python 安装项目专用版本：

```bash
# macOS / Linux，已安装 Python 时
python3 -m pip install --target .local-tools imageio-ffmpeg
```

```powershell
# Windows PowerShell，已安装 Python Launcher 时
py -m pip install --target .local-tools imageio-ffmpeg
```

安装后停止并重新运行 `npm start`。程序会查找系统 PATH、常见安装位置，以及工具目录的 `.local-tools/imageio_ffmpeg/binaries`。部分架构没有预编译包，需要使用系统适配的 FFmpeg。

手动安装的 FFmpeg 不在 PATH 时，指定可执行文件完整路径：

```bash
# macOS / Linux：替换为实际路径
FFMPEG_PATH="/actual/path/to/ffmpeg" npm start
```

```powershell
# Windows PowerShell：替换为实际路径
$env:FFMPEG_PATH = 'C:\tools\ffmpeg\bin\ffmpeg.exe'
npm start
```

### 自动画面时间识别：仅 macOS

先检查 `xcode-select -p`。尚未安装开发工具时，由用户确认后执行 `xcode-select --install`，完成系统安装提示。

首次识别会编译项目中的 Swift 程序，可能需要约一分钟；使用系统 Vision，引擎不上传截图到云端。其他系统暂用“手动对齐”。

### 端口冲突

不要结束未知进程。可选择其他空闲端口：

```bash
# macOS / Linux
PORT=8081 npm start
```

```powershell
# Windows PowerShell
$env:PORT = '8081'
npm start
```

随后访问 `http://127.0.0.1:8081/`。

## 5. 安装验收清单

- `npm test` 全部通过，页面顶部显示“本机服务已连接”。
- 导入浏览器支持的视频，播放、暂停、拖动正常；倍速变化时 IMU 时间跟随视频时钟。
- 标签 CSV 包含 `start_seconds` 和 `end_seconds`，可以只有动作区间，无需每秒一行，IMU 可不导入。
- 手动将视频 10 秒绑定到 `2026-09-03 15:35:15.098`，跳到 28 秒，显示应为 `15:35:33.098`。正式使用请填写真实锚点。
- 修改一个测试区间，保存并导出 CSV，确认新文件修改正确、其他区间不变、原始文件未覆盖。
- 如需修复，用临时视频验证输出可播放；不能仅凭 FFmpeg 已安装就认定验证通过。
- macOS OCR 使用包含完整日期时间的视频，核对三帧识别依据；没有合适的视频时明确标为未验证。

## 6. 重要限制与排错

- **CSV 下载的是新文件 `*_reviewed.csv`，不是覆盖原始文件，也不写回 GitHub。**确认下载成功后再关闭页面；需要替换源文件时先备份并自行核对。
- 编辑区间不自动拆分/合并邻接标签。重叠区间显示 CSV 中第一条匹配记录，保存重叠边界时会提示。
- OCR 精度约 ±1 秒，三帧校验不排除中间局部录像断点；单个时间锚点不补偿长期时钟漂移。
- 修复版默认**不含音频**，不覆盖原视频；不能恢复丢失图像，且可能改变时间起点，需重新核对锚点。
- 单次修复最多 8 GB，要为输入副本和多个输出预留磁盘空间。
- 修复结果与缓存保存在工具目录 `.local-data/`；FFmpeg/OCR 编译产物在 `.local-tools/`。停止服务并确认不再需要后才清理；清理修复缓存会使旧修复链接失效。不要让 AI 擅自清理数据目录。
- 页面显示“静态模式”时，检查是否使用 `npm start` 并打开本机服务地址，而不是双击 HTML 或访问 GitHub Pages。
- 服务只监听 `127.0.0.1`，供本机使用，没有用户登录系统；不要随意改为公网监听或暴露修复 API。

## 7. 另行运行原官网

这一步不是启动审阅工具的前提。在仓库根目录，按照 `package.json` 安装匹配的 Node.js 和 pnpm，再运行：

```bash
pnpm install --frozen-lockfile
pnpm dev
```

访问终端显示的官网地址（通常 `http://localhost:3000/`）。官网页脚入口是静态审阅工具；使用修复/OCR 时需另行启动上述 8080 本机服务，并使用它的地址。

官网申请接口需要自行配置 webhook；未配置时不能真正接收申请。GitHub Pages 上该表单只展示，不提交。详见根 README。
