# 验证说明

## 2026-10-29 — 0.1.2 性能与新版兼容

本版总包和七个日常插件为 **0.1.2**；快捷指令保持 **0.1.3**。以下是本版真实结果；旧版本记录保留在后文，不作为本版通过依据。

- `npm run check`：构建、**60 项数据与生命周期检查、20 个浏览器场景**及长对话性能门槛全部通过。
- 1,002 个提问、约两千消息行的合成浏览器对比：旧版每次停滚 **1,002 次整页查询、499 次矩形读取**；本版 **0 次整页查询、1 次矩形读取**。闭目录的 30 次流式更新从 **60,120 次节点读取降到 30 次**（30 次均来自测试宿主本身）。
- 阅读记忆通过独立的全量几何校验确认来源正确；真实键盘输入的完整文本保留。时间数据与可复现方法见 [性能说明](PERFORMANCE.md)，不将合成宿主计时当成所有真实对话的速度承诺。
- 发行包安装验收：**两种形式通过**。使用最新 DSH alpha.2 的两个全新 profile，分别安装总包与八个独立包，核对版本、启用清单、客户端 SHA256、全部面板和单份共享样式。安装验证后只更新本说明和性能说明；发行前逐文件核对其他运行文件与测试包一致。

安装报告为 `artifacts/install-results.json`，两种形式的页面、console 和请求错误均为 0；无模型调用或系统通知。该安装测试另从同版本官方文件加载原始模块引导脚本以避免本机连接拒绝，待测插件脚本和业务接口仍由真实 Host 提供。

### 真实 DSH 运行时

| DSH 版本 | 结果 | 重点覆盖 |
| --- | --- | --- |
| 0.2.1-rc.3 | **15 项通过** | 含真实滚轮记忆与自动滚动隔离 |
| 0.2.1-rc.4 | **15 项通过** | 含真实滚轮记忆与自动滚动隔离 |
| 0.2.2-alpha.2 | **16 项通过** | 含原生引用插入、保留及撤销 |

最新公开预览版为 [0.2.2-alpha.2](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.2.2-alpha.2)，不是正式稳定版。官方 npm `latest`、`next`、`alpha` 渠道当日分别为 rc.2、rc.4、alpha.2；本版核验当前桌面 rc.3 及后两种新版。Web CLI 的 alpha.2 需要 Node ≥24.9，本轮使用 Node 24.19。

原生验证使用独立随机 `.cache` profile、工作区与合成会话；不打开个人会话、不配置模型。三次最终报告的模型调用、系统通知、页面错误、console 错误及失败请求均为 **0**，各自创建的 Host 和无头浏览器均已关闭。

本机环回 HTTP 曾出现间歇连接拒绝，失败运行没有计入通过。最终测试只将同版本官方 `dsh-web-frontend/dist/assets` 四个静态资源从安装文件加载；HTML、插件客户端、会话与文件 API、实时 WebSocket 均连接真实隔离宿主。测试没有重绘 DSH 界面或替换业务接口。

alpha.2 的原生引用未发布到 `InputState.occurrences`，且草稿文本投影长度不等于编辑坐标。实测通过官方「引用文本」创建引用，再插入草稿历史、原生撤销后引用仍保留；含引用时禁用整段替换，并在确认时重新检查。新增 `sending` 阶段的只读保护由合成契约测试和官方状态声明交叉检查，没有为了测试真实发送消息。

真实滚轮测试另追加 20 轮合成记录：程序定位不改变阅读记忆，实际滚轮停顿后保存正确原生 userSeq，后续程序自动滚动不会覆盖；不是以主动点击目录的保存动作冒充自动阅读记忆。

报告位于忽略提交的 `artifacts/native-<DSH版本>-result.json`、`artifacts/performance-results.json`。本轮客户端 SHA256：`5f1edf5484024313cd295da990cdbc6cab1e3f3c8aa4e102ca89ddcfc4b2b6ac`。发行 `.tgz` 使用不同校验值，以 [v0.1.2 清单](https://github.com/yxue301603/dsh-everyday-plugins/releases/download/v0.1.2/SHA256SUMS.txt) 为准。

### 复现原生检查

`node scripts/test-native.mjs` 使用当前本机桌面运行时。可用 `DSH_NATIVE_EXECUTABLE`、`DSH_NATIVE_BIN` 指定另一份官方 CLI，`DSH_TEST_EXPECTED_VERSION` 校验其实际版本，`DSH_NATIVE_TEST_PORT` 指定独立环回端口；`DSH_TEST_BROWSER_EXECUTABLE` 指定后台浏览器。设置 `DSH_NATIVE_TEST_QUOTES=1` 会要求原生引用用例通过，仅对具备此功能的 alpha.2 启用。可选 `DSH_NATIVE_STATIC_DIR` 必须指向版本完全相同的官方前端 `dist`；报告明确记录该静态加载方式。普通插件用户不需要运行这些开发检查。

**English:** 0.1.2 passed 60 model/lifecycle checks, 20 browser contracts and the long-chat performance gates. Native DSH rc.3 and rc.4 passed 15 checks each; alpha.2 passed 16, including actual native quote preservation and undo. Every final native run recorded zero model calls, notifications and page/console/request errors, with its own processes cleaned up. Native business APIs and WebSockets remain live; four unchanged official frontend assets were served from the matching installed files after intermittent Windows loopback failures. Sending-state protection is a contract check, not a real message submission. Both suite and eight-tool standalone installations passed on alpha.2, including client hashes and one shared stylesheet. Installation testing additionally loaded the unchanged official module bootstrap from its matching installed file; tested plugin scripts still came from the Host. Only verification/performance documentation changed after this package test; runtime contents are compared before publishing.

## 2026-10-24–25 — 历史 0.1.1 验证

总包与七个新增插件为 **0.1.1**；既有快捷指令保持 **0.1.3**。本节保留当时状态；下方 2026-10-21 的结果与哈希只对应历史 **0.1.0**。

| 检查 | 当前结果 | 范围 |
| --- | --- | --- |
| 模型与数据保护 | **41 / 41 通过** | 包含收藏全量 JSON/Markdown 备份、来源身份和 Markdown 边界 |
| 浏览器契约 | **19 / 19 通过** | 含响应式工具入口、实际下载备份及筛选不遗漏收藏 |
| 真实 DSH | **14 / 14 通过** | 真实合成会话、JSON 下载、选句收藏、深浅主题及宽窄输入区 |
| 安装与打包 | **两种安装形式通过** | 总包，以及八个独立包；版本、启用清单、安装后客户端哈希、八个面板 |

浏览器契约使用 `tests/fixture.mjs` 的**内存路由和合成宿主接口**，不启动真实 HTTP 服务，也不是一次真实 DSH 安装或集成验证。它与下面的真实 DSH 检查是不同层次。系统通知送达和系统文件管理器是否弹出仍不在后台自动化验证范围内。

v0.1.1 Release 提供九个 `.tgz`（总包、八个插件）、`SHA256SUMS.txt` 和 `packages.json`。安装报告 `artifacts/install-results.json` 中两种形式均无页面或 console 错误、无模型调用和系统通知。安装验证后只更新总包中的本验证文档；发行前另逐文件核对，确认其他运行文件与已安装测试包一致。正式档案校验值以 [Release 清单](https://github.com/yxue301603/dsh-everyday-plugins/releases/download/v0.1.1/SHA256SUMS.txt) 为准。

原生复验使用 Windows 上真实 DSH **0.2.1-rc.2**、隔离 profile 与后台 Chromium 149，浏览器通过 `localhost` 直连宿主；没有修改系统网络策略或使用者的应用。最终报告 `artifacts/native-result-0.1.1.json` 中模型调用、系统通知、页面错误、console 错误和失败请求均为 **0**。早期重试曾遇到本机 loopback 网络拒绝；这些失败保留在工作机报告中，不计为通过。

实际输入区宽 952px 时七个短名称均显示；390px 视口时保留全部图标，无横向溢出。深浅主题启用控件与正文最低对比度分别为 **5.579:1 / 5.766:1**。原生收藏 JSON 下载在搜索无匹配时仍包含全部保存内容、标签和来源身份。最终客户端 SHA256：`24eba0e40c05827eeb57a5e3d55f5d439f94ad9130727bd2f755bb566c36c021`。

**English:** The collection and seven newer tools are **0.1.1**; Quick prompts remains **0.1.3**. Model/data checks passed **41/41**, browser contracts **19/19**, and native checks **14/14**. Browser contracts use an in-memory synthetic host, not native HTTP integration. Native checks use real DSH **0.2.1-rc.2**, isolated synthetic sessions and background Chromium 149 over localhost. The final run recorded zero model calls, notifications, page/console errors and failed requests; earlier local network-denied runs remain recorded separately. Both suite and eight-tool standalone installations passed activation, client hashes and all panels. Only this verification document changed after installation testing; release package contents are compared separately to confirm unchanged runtime files. Release assets comprise nine `.tgz` archives plus `SHA256SUMS.txt` and `packages.json`. Historical results below apply only to **0.1.0**.

## 2026-10-21 — 历史 0.1.0 验证

当时新增插件与总包版本为 **0.1.0**，已有快捷指令为 **0.1.3**。以下保留当时的环境、结果及报告路径。

### 环境与范围

- Windows、Node.js 24.19.0；真实 DeepSeek Harness **0.2.1-rc.2** 桌面内置运行时，以独立的 Web profile 启动。
- 浏览器自动化使用后台、无窗口的 Microsoft Edge；公开 CI 使用 Linux Chromium。
- 原生测试使用随机 `.cache` 数据目录、合成工作区与合成会话；不会连接使用者的个人会话或读取凭据。测试从未调用模型。
- Web 与桌面共享的原生插件、聊天、草稿及文件预览接口在真实运行时验证。操作系统通知、系统文件管理器和使用者正在工作的桌面窗口不参与自动化操作。

### 分层检查

| 层次 | 命令 | 覆盖 |
| --- | --- | --- |
| 构建 | `npm run build` | 7 个自包含客户端及整套客户端；独立包携带共享代码 |
| 模型与数据保护 | `npm test` | 目录检索、草稿保留、收藏、文件归并、提醒去重与状态、便笺、选文、损坏存储、插入修订校验 |
| 浏览器契约 | `npm run test:browser` | 深浅主题、390/1440px、中英文、多会话与项目隔离、安全插入、全部独立包入口 |
| 真实 DSH | `node scripts/test-native.mjs` | 真实合成会话、原生消息节点、选文、草稿撤销、收藏、文件侧栏预览、实时事件、主题对比度与窄窗口 |
| 安装包 | `npm run pack`、`node scripts/test-install.mjs` | 预构建包内容、原生安装器、总包及独立插件组合、安装后客户端哈希和入口 |

真实 DSH 脚本需要本地安装的 DSH 桌面版及 Edge。可以用 `DSH_NATIVE_EXECUTABLE` 与 `DSH_NATIVE_BIN` 指定宿主可执行文件和其 CLI 路径；默认值是本轮 Windows 测试机路径。它们不属于普通插件安装步骤，也不在公开 CI 中假装执行。

### 测试边界

- 自动化仅向草稿插入内容，确认没有提交消息。真实宿主测试拦截并统计模型调用；系统通知替换为无操作实现。
- 文件预览使用真实宿主侧栏；“打开所在目录”在契约测试中验证宿主授权请求参数，没有主动弹出系统文件管理器。
- 提醒测试覆盖真实事件和合成状态传输。没有运行真实模型任务来测试系统级通知送达。
- 原生对比度检查读取真实计算样式，包含主按钮、正文、标签与危险操作文字；禁用控件和占位符不作为正常文字的最低对比度断言。
- 390px 时检查面板边界及所有工具入口。共享样式只对带本套插件的原生输入工具组启用换行，不依赖构建后的 CSS 类名。
- GitHub 下载依赖访问 GitHub 的网络链路。原生 tarball 安装验证、公开仓库内容验证和公开 CI 不能等同于每个用户网络中的 GitHub 下载成功。

### 结果记录

已通过 **38 项模型与数据保护检查、17 项浏览器场景、12 项真实 DSH 功能检查**。

真实 DSH 检查还覆盖 14 个深浅主题面板与 27 条布局记录。正文及启用按钮最低文字对比度：浅色 **5.766:1**、深色 **5.579:1**；390px 窗口下全部新增入口可见，面板无横向溢出。真实选句收藏严格保留选句内容，返回原文、草稿清空后恢复及原生撤销均已验证。

原生最终报告中的模型调用、系统通知、桌面程序操作、JavaScript 错误、console 错误与请求失败均为 **0**。测试创建的宿主和浏览器进程已关闭。报告：`artifacts/native-result.json`；公开截图仅使用合成内容。

原生安装器分别将总包，以及“已有快捷指令 + 七个独立包”装入两个新的隔离 profile。两种形式均通过启用清单、启动图、8 个入口、全部面板打开及已安装客户端 SHA256 校验，没有浏览器错误或模型调用。安装报告：`artifacts/install-results.json`。

桌面本地交付使用同一批已验证的七个独立安装包，并核验版本 **0.1.0**、启用清单和客户端哈希。已有快捷指令 **0.1.3** 的代码与依赖来源、原有依赖和个人 `cordis.patch.yml` 均保持完整。安装前备份包配置及锁文件；没有重启正在使用的应用。新增入口需要按宿主提示重载，或方便时完全退出托盘并重新打开。报告：`artifacts/local-install-results.json`。

总仓库和七个新增独立仓库均已公开，已有快捷指令独立仓库保持不变。八个新仓库的首次实现检查均通过；总仓库的 [GitHub Actions 记录](https://github.com/yxue301603/dsh-everyday-plugins/actions/runs/39585938987) 对应实现提交 `ff941d8b05c021ea8cacff2109e7770eed8c7837`，七个独立仓库各有自己的构建、模型检查与打包流程。后续状态可在相应仓库 Actions 中查看。

另用真实 DSH 安装器，从 **GitHub 来源**分别安装了总仓库及对话目录独立仓库；使用新的隔离 profile，均一次成功，版本、启用清单及已安装客户端 SHA256 与冻结构建一致。总包的 `private: true` 仅防止误发 npm，不影响 GitHub 安装。报告分别为 `artifacts/github-suite-install-result.json` 与 `artifacts/github-install-result.json`。其余六个新独立插件均已通过原生 tarball 安装和各自的公开 CI；没有将这些结果写成七个 GitHub 地址逐个安装的测试。

历史 **0.1.0** 总包客户端 SHA256（不是当前 0.1.1，也不是 `.tgz` 资产的校验值）：

```text
f60e72b9b23e6ea2c19350a8258987a12768c038adf77802405477858d5d808a
```

#### 主仓库的子目录独立安装

按统一仓库导航的要求，另用新的隔离 profile 实测以下完整地址：

```text
https://github.com/yxue301603/dsh-everyday-plugins#path:/packages/dsh-project-notes
```

真实 DSH 原生安装器一次成功，仅安装和启用 `dsh-project-notes 0.1.0`，确认没有安装整套包；客户端 SHA256 与当前构建一致。结果：`artifacts/github-subdirectory-install-result.json`。本次没有逐个对子目录地址做八次网络安装；八个目录的预构建结构一致，整套与独立包的功能和安装检查已覆盖前述范围。

页面浏览与主安装说明现已统一到总仓库 `packages/`。同名独立仓库保留兼容旧地址，原有本地安装与插件数据不需要因导航调整而迁移。

所有脚本、公开截图、文档和构建产物已提交；工作机完整运行报告留在忽略提交的 `artifacts/`，配置备份位于忽略提交的 `.cache/`。源码和预构建文件不包含个人会话、凭据或这些目录。

