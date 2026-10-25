# 社区收录条目：发布后可直接提交

这里是拟提交给 [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) 的三条独立功能条目，**尚未提交、尚未获收录**。依据是研究日 2026-10-24 的维护者 [贡献规则](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/main/contributing.md) 和 [PR 模板](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/main/.github/pull_request_template.md)。规则以后可能更新，真正投稿时应再核对。

将三个 `.yml` 文件原样放到上游仓库的 `data/plugins/` 下；这是三条独立插件，不是把整套工具箱重复列三次。类别是按实际用途选择的草稿，最终由上游维护者判断。不要修改上游自动生成的 README，也不要顺带修改其他作者的条目。

这三个本地子包当前版本均为 `0.1.1`。YAML 已填写根仓库 Release `v0.1.1` 的固定版本 `tarball` 和实际生成的 PNG 图标地址，没有自造 `npm`、`install`、`version` 字段。**Release 发布、相关提交推送完成且维护者核验这些 HTTPS 地址可访问后，可以直接提交这三个文件**；发布前，配置中的地址仅表示本次发布目标，不构成资产已上线或条目已收录的声明。

八个插件目录均已在 `package.json` 同目录提供 `screenshots.json`，每份包含 1–8 张图片。这里使用维护者支持的直接 JSON 数组形式，通过 GitHub raw 绝对 HTTPS 地址复用根仓库 `docs/media/` 中的真实 PNG 素材。截图清单使用 PNG / JPG / WebP，不放 README 演示 GIF；图标使用 `docs/media/icon.png`，不使用 SVG。素材来源与复现方式见 [媒体说明](../media/README.md)。

本次文件与资产一一对应，所有带版本号的 `.tgz` 都固定到 `releases/download/v0.1.1/`，不使用 `latest/download`：

| 上游条目文件 | Release 资产 |
| --- | --- |
| `yxue301603__dsh-everyday-plugins--packages-dsh-draft-history.yml` | `dsh-draft-history-0.1.1.tgz` |
| `yxue301603__dsh-everyday-plugins--packages-dsh-answer-library.yml` | `dsh-answer-library-0.1.1.tgz` |
| `yxue301603__dsh-everyday-plugins--packages-dsh-conversation-outline.yml` | `dsh-conversation-outline-0.1.1.tgz` |

普通 GitHub 子目录安装入口继续由插件仓库的文档提供。不要把整个工具箱的 tarball 填到这些单插件条目中。

建议维护者投稿前确认三个源目录 manifest、截图链接、发布包和一句话描述都对应同一版本；附真实验证说明，不声称安全审核、官方推荐、用户数或下载量。发布与投稿由维护者决定，本目录不触发任何自动外发。
