# DSH 插件公开同类观察与改进建议

研究日期：2026-10-24（Asia/Shanghai）。仓库统计取自当日约 22:26–22:28 的公开 GitHub API；发布记录补查于当晚。本文记录一个时间截面，链接指向持续更新的主分支或固定 Release。没有读取用户私有流量、下载明细或凭据，没有运行第三方插件，没有向外提交或联系维护者。

## 先看结论

我们最值得做的是：让首页迅速呈现三个具体使用场景；给独立插件补齐市场截图元数据；准备少量准确的社区收录条目；让版本、安装和升级信息稳定可复现；持续维护兼容与反馈入口。这些改动可以让用户更容易发现、理解和尝试项目。公开证据不能证明其中任何一项必然带来多少 star。

本项目与原快捷指令仓库均创建于 10 月 20–21 日，研究日尚未满四天。维护者当日公开统计基线为主仓库 1 star、原快捷指令仓库 1 star，其他七个独立仓库各 0 star。这个阶段不足以判断产品吸引力，也不适合与已积累数月甚至数年的仓库比较日均增长。

## 范围与筛选方法

起点是 [GitHub 的 dsh-plugin topic 按 stars 排序](https://github.com/topics/dsh-plugin?o=desc&s=stars)，并用 [公开仓库搜索 API](https://api.github.com/search/repositories?q=topic%3Adsh-plugin&sort=stars&order=desc&per_page=100) 获取精确 stars、forks、创建时间。随后读取作者自己的 README、package.json、Release，而非依据第三方排行榜转述功能。

topic 混有 DSH 本体、完整桌面壳、目录站、跨宿主技能及大型通用项目。打了 topic 并不等于该项目是可安装的 DSH 原生插件；大仓库的总 stars 也不能归因于其中的 DSH 支持。因此下面是**从高星候选中核验、按 stars 排序的十个插件或插件套件样本**，不是宣称已穷尽所有仓库的“官方前十”。其中 Modlens 同时支持其他宿主，应单独看待。原生身份以 `dsh.bundle` 安装声明与作者安装文档交叉核对；这不构成代码审计。

## 十个已核验样本

日期列为 GitHub `created_at` 的 UTC 日期，不代表插件最初开发日。统计是仓库级数字，不是安装用户数。

| 仓库 | Stars | Forks | 创建日期 | 主要用途 | 原生 manifest 来源 |
| --- | ---: | ---: | --- | --- | --- |
| [Ebony-Vinyl/dsh-our-free-model](https://github.com/Ebony-Vinyl/dsh-our-free-model) | 40,738 | 1,162 | 2026-09-24 | 第三方模型渠道与账号接入 | [package.json](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/main/package.json) |
| [zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web) | 9,438 | 587 | 2026-08-12 | UI、任务看板、远程、主题等套件 | [根 package.json](https://github.com/zhu1090093659/dsh-web/blob/dev/package.json) |
| [dsh-market/dsh-market](https://github.com/dsh-market/dsh-market) | 8,646 | 339 | 2026-08-14 | 浏览、安装和管理社区插件 | [package.json](https://github.com/dsh-market/dsh-market/blob/main/package.json) |
| [YuJunZhiXue/dsh-purge](https://github.com/YuJunZhiXue/dsh-purge) | 7,842 | 1,037 | 2026-08-19 | 指令注入、角色与红队测试相关功能 | [package.json](https://github.com/YuJunZhiXue/dsh-purge/blob/master/package.json) |
| [yjh051108/dsh-routing-suite](https://github.com/yjh051108/dsh-routing-suite) | 7,001 | 193 | 2026-08-14 | 指令注入、思考模式路由、分级任务协议 | [package.json](https://github.com/yjh051108/dsh-routing-suite/blob/main/package.json) |
| [MeteorNOX/DeepSeek-Balance-Whale-Widget](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget) | 5,962 | 193 | 2026-08-18 | 鲸鱼挂件、余额与每轮用量 | [package.json](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget/blob/main/package.json) |
| [ccch1mneyyy/dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) | 5,600 | 290 | 2026-08-13 | DSH 的完整终端界面插件 | [package.json](https://github.com/ccch1mneyyy/dsh-TUI/blob/main/package.json) |
| [omdsh-dev/DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) | 4,505 | 428 | 2026-08-07 | 文件、编辑器、终端、Git 侧栏工作区 | [package.json](https://github.com/omdsh-dev/DSH-better-sidebar/blob/main/package.json) |
| [liustack/modlens](https://github.com/liustack/modlens) | 4,439 | 136 | 2026-02-22 | 图片转换为文本模型可用的视觉证据；兼有其他宿主支持 | [package.json](https://github.com/liustack/modlens/blob/main/package.json) |
| [T-Auto/dsh-ops](https://github.com/T-Auto/dsh-ops) | 4,099 | 121 | 2026-10-08 | Shell、文件操作和执行流程工具箱 | [package.json](https://github.com/T-Auto/dsh-ops/blob/main/package.json) |

统计来源为上述搜索 API 的各仓库对象；每项也可通过 `https://api.github.com/repos/<owner>/<repo>` 复查。dsh-web 在连续两次采样中从 9,437 变为 9,438，表中使用较晚值。创建时间、项目年龄、跨宿主历史、作者原有受众都属于可能影响比较的混杂因素。

### 首页、安装与发布的可见证据

表中“未见”只表示本次读取的首页没有发现，不表示仓库其他位置一定不存在。安装说明是作者公开做法的摘录，不是本项目对第三方插件的安装建议。

| 样本及 README 来源 | 首页展示与语言 | 安装入口 | 本次可核验的 Release |
| --- | --- | --- | --- |
| [our-free-model README](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/main/README.md) | 图标、趋势徽章、QQ 二维码；中文及 README_EN.md；未见突出产品截图 | 本地绝对路径，另有 Release 解压及桌面插件管理说明 | [v2.5.9-macos-unofficial，10-22](https://github.com/Ebony-Vinyl/dsh-our-free-model/releases/tag/v2.5.9-macos-unofficial)，资产是 DMG，不能视为通用 DSH 插件安装包 |
| [dsh-web README](https://github.com/zhu1090093659/dsh-web/blob/dev/README.md) | 横幅、主界面及分功能截图；中英双语 | 整套 npm 包 `@linxin666/dsh-web-all` 与按需子插件；说明桌面与 Web 的区别 | [v0.4.8，10-20](https://github.com/zhu1090093659/dsh-web/releases/tag/v0.4.8)，详细升级限制与变更 |
| [market README](https://github.com/dsh-market/dsh-market/blob/main/README.md) | Logo、英文界面演示图；英文及 README.zh.md | 插件包名 `dshmarket`，Web 用标准 plugin add | [v1.70.1，10-23](https://github.com/dsh-market/dsh-market/releases/tag/v1.70.1)，API 返回无额外资产 |
| [purge README](https://github.com/YuJunZhiXue/dsh-purge/blob/master/README.md) | 横幅及多张 Dock、设置截图；英文及 README.zh-CN.md | GitHub codeload tarball、本地路径备用 | [v1.1.78，10-24](https://github.com/YuJunZhiXue/dsh-purge/releases/tag/v1.1.78)，API 返回无额外资产 |
| [routing-suite README](https://github.com/yjh051108/dsh-routing-suite/blob/main/README.md) | 组件导航表；根 README 未见产品图；中英双语 | GitHub 根包、子组件及本地路径；分组件说明 | [0.0.1-rc1，09-02](https://github.com/yjh051108/dsh-routing-suite/releases/tag/0.0.1-rc1)，含 graded-mode .tgz |
| [whale README](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget/blob/main/README.md) | 功能与安装说明很具体；中文；未确认独立英文页 | 推荐 npm `dsh-whale-widget`，GitHub 备用；单列桌面入口及迁移区别 | [v0.4.2，10-11](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget/releases/tag/v0.4.2)，含 package.zip |
| [TUI README](https://github.com/ccch1mneyyy/dsh-TUI/blob/main/README.md) | 动画 Logo SVG、终端预览 SVG；英文及 README_ZH.md | npm 包及专用 dsh-tui profile；内置 /plugin | [v0.17.0，10-24](https://github.com/ccch1mneyyy/dsh-TUI/releases/tag/v0.17.0)，说明 Windows 离线安装器；前版也提供便携包及 SHA256SUMS |
| [better-sidebar README](https://github.com/omdsh-dev/DSH-better-sidebar/blob/main/README.md) | 文件树、菜单、改动截图及 GitHub attachment；英中双语 | npm `dsh-better-sidebar`；给出宿主版本对应的插件版本表 | [v0.28.0，10-17](https://github.com/omdsh-dev/DSH-better-sidebar/releases/tag/v0.28.0)，API 返回无额外资产 |
| [Modlens README](https://github.com/liustack/modlens/blob/main/README.md) | 横幅、DSH 设置与粘贴图片的真实截图；英中双语 | 首页有固定版本 `@liustack/modlens@3.27.2` 安装命令 | [v3.27.2，10-23](https://github.com/liustack/modlens/releases/tag/v3.27.2)，API 返回无额外资产 |
| [ops README](https://github.com/T-Auto/dsh-ops/blob/main/README.md) | 横幅、基准演示附件与安装截图；中英双语 | 插件名 dsh-ops；区分 profile，附升级、卸载、dry-run | [v0.4.1，10-20](https://github.com/T-Auto/dsh-ops/releases/tag/v0.4.1)，.tgz 与 SHA256SUMS |

补充视觉案例：[PC2005-cloud/dsh-pet](https://github.com/PC2005-cloud/dsh-pet) 当日 3,891 stars、288 forks，创建于 08-14。README 使用运行截图与动画资源，给出 npm、桌面管理器和源码路径的不同安装流程；[真正的插件 manifest 在子目录](https://github.com/PC2005-cloud/dsh-pet/blob/main/dsh-pet/package.json)，不是仓库根。其 [v0.3.8 Release](https://github.com/PC2005-cloud/dsh-pet/releases/tag/v0.3.8) 发布于 10-22。本次未确认英文 README。它说明“子目录插件 + 总仓库展示”的结构本身不妨碍提供清楚的安装文档。

模型“免费/无限”、token 节省比例、第三方效果排名等属于作者声明，本次没有验证，不能搬成我们的宣传依据。GIF、SVG、视频附件与静态截图也应区分；本次没有下载或执行任何媒体资源。

### 公开传播入口：能观察到什么

作者 README 能证明他们**放置了入口**，不能证明入口贡献了多少流量。下面不推断转化率或推广成效。

| 观察 | 作者自己的证据 | 对本项目的意义 |
| --- | --- | --- |
| 多个项目互相链接 | better-sidebar 的其他插件生态表；Modlens 的相关项目及市场链接 | 可以提供真实的“可搭配使用”文档；不要无依据宣称合作 |
| 社区账号和群入口 | our-free-model 的 QQ；dsh-web 的 Discord/微信；TUI 的公众号/群；Modlens 的 X/微信 | 表明公开演示、反馈有承载处；不代表必须建群，也不能据此归因 stars |
| 趋势徽章 | our-free-model、TUI、ops README 中存在 Trendshift 等徽章 | 只证明作者展示徽章；不是可靠的新增用户或安装统计 |
| 市场有明确的上游目录 | [dsh-market README](https://github.com/dsh-market/dsh-market/blob/main/README.md) 说明目录来自 awesome-dsh-plugin，新增插件应向上游列表提交 | 准备一次高质量的上游条目，优于向多个同源市场重复“注册” |

## 官方入口与社区索引：不要混称

[DeepSeek 官方 README 的 Community and support](https://github.com/deepseek-ai/deepseek-harness#community-and-support) 明确建议仓库添加 `dsh-plugin` topic，并提供官方 Discord 和反馈 Discussions。本次没有发现它把下面的社区索引称为官方审核或官方推荐。可使用官方提供的社区入口，但发布前仍应阅读对应频道规则；不要把插件宣传发到问题反馈分类。

[awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) 是高星社区目录：本次 API 快照为 20,477 stars、5,139 forks。以**它的当前主分支文件**为准，不套用旧 PR、其他同名 awesome 仓库或第三方教程的规则。

其 [contributing.md](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/main/contributing.md) 的当前要求，压缩记录如下：

- Add YAML under `data/plugins/`: URL, name, category, English description. Monorepos may link subdirectories as `owner/repo#subname`.
- Working code, `dsh.bundle`, `dsh-plugin` topic and repository age ≥1 day are required. Accurate claims undergo maintainer review.
- Maximum three additions per PR. Dependency-only aggregates are excluded; bundles with runtime behaviour may qualify.
- Optional tarballs: GitHub-hosted HTTPS `.tgz`; versioned filenames need pinned tags.
- Put 1–8 image paths in `screenshots.json` beside the plugin manifest. Relative paths must stay inside that directory. Listing is not an audit.

这是贡献规则摘要，不是已获收录承诺。另见维护者的 [PR 模板](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/main/.github/pull_request_template.md)：推荐预构建 npm 包；官方宿主依赖放 peerDependencies；截图由插件仓库自己维护。我们已有 GitHub 预构建和独立子目录，不需要为了收录而新增运行时依赖。

其他可选渠道：[dshplugin-app 的独立注册表及投稿说明](https://github.com/dshplugin-app/deepseek-harness-plugins/blob/main/README.md)、[dsh.pub 的维护者说明](https://github.com/dsh-pub/dsh-pub)。它们是社区渠道，不能写成 DeepSeek 官方背书。本次只核对公开规则，没有提交。

## 本项目最值得落实的五项改进

下列“预计作用”是产品判断，需后续观察验证，不是由 stars 反推出的因果结论。

| 顺序 | 具体改动 | 公开依据 | 验收方式与预计作用 |
| --- | --- | --- | --- |
| 1 | 首页在功能表前展示“误清空草稿恢复”“长对话找问题”“选句收藏后再次使用”三个场景；配一段约 20–30 秒的合成内容演示，保留深浅色静态图 | dsh-web、better-sidebar、Modlens 的 README 把实际 UI 和明确动作放在显著位置 | 新访客无需理解八个插件的名称即可看出用途；演示不含个人目录或会话 |
| 2 | 为最有辨识度的 2–3 个子插件准备独立截图、方形位图图标与 screenshots.json；图片复制到插件目录内 | 社区索引的截图规则与 PR 模板 | 每个子目录能独立打开图片，深浅色标题、按钮、字段可读；不能用 `../../docs` 跳出目录 |
| 3 | 整理准确的收录草稿，先选择草稿历史、对话目录、回答收藏等独立功能，按真实分类各写一句；确认是否已被现有条目覆盖 | 上游目录的人工评审与 monorepo 规则；market 明确复用该目录 | 草稿只描述已实现行为，附可安装来源和截图；先不把整套包和八个同功能入口重复投稿 |
| 4 | 统一首页、子 README 与 Release 的主安装地址；维持预构建，发布固定版本 .tgz、校验和及简短升级说明；以后有合适发布身份再考虑 npm | ops、TUI 的版本资产与升级说明；索引接受 GitHub Release tarball | 新用户按桌面界面步骤可装；按需包无重复入口；旧链接继续解释用途；发布后检查链接而不是承诺镜像代理 GitHub |
| 5 | 把兼容版本、已验证操作和已知限制压缩成易找的卡片；反馈模板只收系统、DSH/插件版本、复现动作与脱敏错误 | better-sidebar 的版本表、whale 的具体诊断字段、官方 README 的快速迭代说明 | 每次 Release 说明实际验证过的版本；让“安全插入、不自动发送、不自行调用模型”可被复现，不泛称“支持所有新版” |

目前首页已经有中英双语、八个场景表、深浅色面板图、桌面 GitHub 安装步骤、单插件入口及数据边界，不必推倒重写。优先补展示素材和可被市场读取的元数据，比继续扩充功能列表更直接。这个优先级是维护成本与当前缺口的判断，不是竞品效果统计。

不建议为求 star 增加工作流弹窗、强制收藏提示、隐藏功能门槛，或使用无法核验的下载/用户数字。我们服务的是专注工作的人，README 尾部一次自愿支持链接已足够表达意愿；是否获得更多 star，应由用户使用后的判断决定。

## 可由维护者以后发布的材料草稿

以下仅为内部备稿，未提交任何外部平台。主仓库是统一展示入口，独立功能的索引条目应链接对应 `packages/` 目录。公开前用当前发布版本、截图和安装验证结果替换素材；不承诺未验证的宿主版本。

**中文介绍：**

> 给 DeepSeek Harness 补齐八个日常小工具：常用指令、对话目录、草稿历史、回答收藏、本轮文件、任务提醒、项目便笺和选文操作。可以整套安装，也可以只装一个。内容插入草稿后由你检查发送；插件不自行调用模型。支持中英界面及深浅色主题。示例：误清空后找回旧草稿，在长对话里搜自己问过的问题，选一句回答收藏并再次引用。

**English introduction:**

> Eight everyday tools for DeepSeek Harness: quick prompts, a conversation outline, draft history, an answer library, turn files, task alerts, project notes and selection actions. Install the full toolbox or choose a single plugin. Inserted text stays in the draft for review; the plugins do not call a model on their own. Includes English and Chinese UI with light and dark themes.

主链接：[DSH 日常工具箱](https://github.com/yxue301603/dsh-everyday-plugins)。发布配图应使用仓库中的合成内容截图；演示具体一次动作。可以邀请用户反馈一个最常遇到的操作障碍，不声称“最佳”“首个”或“官方推荐”。

**单条社区索引字段草案：**

```yaml
# Draft only; check the current upstream rules before submission.
# data/plugins/yxue301603__dsh-everyday-plugins--packages-dsh-draft-history.yml
url: https://github.com/yxue301603/dsh-everyday-plugins/tree/main/packages/dsh-draft-history
name: yxue301603/dsh-everyday-plugins#dsh-draft-history
category: session
description:
  en: Preview and restore local plain-text draft history for the current conversation.
  zh: 预览并恢复当前会话的本地纯文本草稿历史。
```

上述描述刻意不承诺附件恢复、跨设备同步或崩溃前零丢失。真实限制继续链接插件 README。类别由社区维护者最终判断；截图与安装元数据准备好之后再由维护者决定是否提交。

## 后续如何判断改进是否有用

用同一个主仓库持续观察 2–4 周，每周记录公开 stars、真实用户问题及修复内容即可。不要把八个独立仓库的 stars 相加后宣称是八倍用户；不要把 npm 下载当去重活跃用户。若维护者自行查看私有 GitHub traffic，只做内部改进参考，不把个体、来源细节或未经验证的因果解释放进公开材料。

本文的可复查事实是统计快照、仓库结构、作者公开展示及索引规则；“提高理解与尝试意愿”是待验证的设计假设。样本包含幸存者偏差和项目年龄差异，不能据此保证未来 star 数量。
