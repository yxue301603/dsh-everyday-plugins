# 安装、切换与升级

[返回工具箱](../README.md) · [English quick guide](#english-quick-guide)

## 安装前确认

- 面向 DeepSeek Harness **0.2.1-rc.2 及其后的 0.2.x**，支持 Web 与桌面版使用原生插件管理器。其他版本是否可用，以验证说明和实际宿主接口为准。
- 发布仓库包含预构建 `lib/client.js`，使用者不需要自行编译，也不需要配置模型 API Key。
- 总包包含全部 8 个插件。独立插件可以任意组合；**同一个功能只安装一份**，不要同时装总包和对应独立包。
- GitHub 来源需要本机可以访问 GitHub。DSH 的「安装源 / npm 镜像」只影响 npm 包，不能代理 GitHub 地址。

## 方式一：整个工具箱

在 DSH 打开「插件 → 添加插件」，输入：

```text
https://github.com/yxue301603/dsh-everyday-plugins
```

点击安装，完成后启用，按 DSH 提示重新加载或重启。桌面版若提示重启，应先保存正在编辑的内容，再通过托盘完全退出并重新打开；无需为了安装操作其他窗口。

装好后，在会话输入框工具区可找到各插件入口。「快捷指令」还可显示置顶按钮；收藏入口在回答下方，选文入口在选中的消息旁。

## 方式二：只装需要的插件

八个插件集中在总仓库的 `packages/` 下。目录页面用于浏览源码；在同一个「添加插件」输入框中使用以下 `#path:` 安装地址：

| 功能 | 可直接填写的 GitHub 来源 |
| --- | --- |
| 常用指令快捷面板 | `https://github.com/yxue301603/dsh-everyday-plugins#path:/packages/dsh-quick-prompts` |
| 对话目录 | `https://github.com/yxue301603/dsh-everyday-plugins#path:/packages/dsh-conversation-outline` |
| 草稿历史 | `https://github.com/yxue301603/dsh-everyday-plugins#path:/packages/dsh-draft-history` |
| 回答收藏 | `https://github.com/yxue301603/dsh-everyday-plugins#path:/packages/dsh-answer-library` |
| 本轮文件 | `https://github.com/yxue301603/dsh-everyday-plugins#path:/packages/dsh-turn-files` |
| 任务提醒 | `https://github.com/yxue301603/dsh-everyday-plugins#path:/packages/dsh-task-alerts` |
| 项目便笺 | `https://github.com/yxue301603/dsh-everyday-plugins#path:/packages/dsh-project-notes` |
| 选文操作 | `https://github.com/yxue301603/dsh-everyday-plugins#path:/packages/dsh-selection-actions` |

每个子目录都自带构建产物和必要共享代码，只安装选中的插件，不安装整套工具箱。该语法由原生安装器使用的 [pnpm Git 子目录来源](https://pnpm.io/package-sources#install-from-a-subdirectory-of-a-git-repository)提供；本轮已用真实 DSH 从项目便笺子目录安装，验证版本、自动启用和客户端哈希。

兼容之前发布的地址时，也可以继续使用 `https://github.com/yxue301603/插件名`，例如 `https://github.com/yxue301603/dsh-project-notes`。这些独立仓库保留为兼容入口；统一导航以总仓库为准。两个来源提供同一插件，任选一个安装即可。

## 已装快捷指令，如何换成整套

1. 在快捷指令设置中导出重要指令作备份。
2. 在 DSH 插件管理器卸载独立的 `dsh-quick-prompts`。如果也装了其他独立插件，一并卸载准备由总包提供的重复功能。
3. 安装并启用 `dsh-everyday-plugins`，按提示重新加载。
4. 打开快捷指令，确认之前的内容仍在。不要清除 DSH 的浏览器站点数据。

独立版与总包使用相同的数据键，快捷指令仍使用 `dsh.quick-prompts.v1`；其他日常插件沿用各自的 `dsh.everyday.*` 键。在同一个 DSH 浏览器来源中，切换包形式不会主动迁移、清空或重置这些记录。

这不等于跨来源同步。如果更换端口、协议、浏览器配置或设备后形成不同的浏览器来源，旧数据可能不可见。快捷指令可通过 JSON 导出/导入；便笺可导出 Markdown，重要草稿或收藏可先复制保留。保留哪些内容、容量上限及失败恢复方式，见对应插件 README。

从整套切回独立安装时顺序相同：先卸载总包，再装需要的独立插件，避免重复。

## Web 命令行

如果你使用 DSH Web CLI，可在该 Web 环境下执行：

```sh
dsh plugin --profile web add github:yxue301603/dsh-everyday-plugins
```

只装项目便笺的示例：

```sh
dsh plugin --profile web add 'https://github.com/yxue301603/dsh-everyday-plugins#path:/packages/dsh-project-notes'
```

按需安装时，将 `packages/` 后的插件目录名换成表格中对应名称即可。桌面版请使用**桌面应用自己的插件管理器**，不要把 Web profile 的安装成功当成桌面版已经安装成功。不同 profile 的包配置可能相互独立。

如果下载受网络影响，可以从 GitHub 获取已经构建的插件源码目录后，在「添加插件」中填写该目录的本地绝对路径。整套请选择根目录，单插件请选择包含相应 `package.json`、`cordis.patch.yml` 和 `lib/client.js` 的独立目录。不要只复制 `src/`。

## 升级

先查看 DSH 插件管理器是否提供升级功能；若当前宿主不支持，保存草稿和重要本地内容后，卸载旧包，再从相同 GitHub 地址安装新版并按提示重载。不要清除站点数据。

更换插件代码不会主动删除同一来源下的本地资料，但浏览器清理、来源变化或人工重置仍会影响数据。升级时避免让独立版与整套版同时运行。

## 装好后先试这几步

1. 打开「快捷指令」，插入一条指令，确认只是出现在草稿而没有发送。
2. 在输入框写一小段文字，停顿一秒，打开「草稿历史」查看；它不会自动覆盖原草稿。
3. 打开「项目便笺」记一条内容、添加待办，再关闭重开，检查保存状态。
4. 有回答后点击下方 `☆`；选中消息文字可打开「选中追问」。
5. 有交付或文件改动时打开「本轮文件」。没有记录时显示空列表属于正常情况。
6. 「任务提醒」默认只记录站内提醒。需要系统通知时，再明确点击「开启系统通知」并接受宿主权限提示。

DSH 必须保持运行和连接才能接收实时提醒。系统通知默认静音，前台时抑制；宿主未提供明确结束原因时只显示「已结束，请查看结果」。插件不会发送外部推送，也不会读取历史后补发大量旧提醒。

## 常见情况

| 现象 | 检查方式 |
| --- | --- |
| GitHub 下载失败 | 检查该仓库地址能否正常访问；切换 npm 镜像不能解决 GitHub 下载链路问题 |
| 安装后没有看到入口 | 确认插件已启用、安装在当前使用的 DSH/profile，并按提示重载；窄窗口可悬停工具区图标查看名称 |
| 入口出现两份或同一提醒重复 | 检查是否同时装了整套和对应独立版，保留其中一种 |
| 目录搜不到很早的提问 | 目录只覆盖已加载问题，请点击「加载更早消息」 |
| 文件列表没有某个终端生成文件 | 终端生成但没有交付或改动记录的文件不保证被识别；列表不是文件系统全盘扫描 |
| 没有系统通知 | 先确认明确开启、权限允许、DSH 仍在运行和连接；默认前台抑制，宿主也可能限制通知 |
| 更换来源后本地数据不见了 | 各浏览器来源隔离；回原来源查看，或使用事先导出的资料恢复 |
| 提示本地数据损坏或无法保存 | 不要先清除站点数据；复制或导出还能看到的重要文本，保留原数据后再处理存储问题 |

## English quick guide

Use DeepSeek Harness **0.2.1-rc.2 or a subsequent 0.2.x release**. Web and Desktop are supported targets; compatibility for untested versions is not promised. Prebuilt clients are included. No user build step or API key is needed.

Choose **one** installation style:

- Collection: paste `https://github.com/yxue301603/dsh-everyday-plugins` into **Plugins → Add plugin**.
- Individual tools: paste a `https://github.com/yxue301603/dsh-everyday-plugins#path:/packages/plugin-name` URL from the table above. Each package works without the collection. Same-name standalone repositories remain compatibility sources.

Install, enable and reload when the host requests it. Never run the collection alongside duplicate standalone tools. On Desktop use the desktop application's own plugin manager; the Web CLI profile does not install into your Desktop profile.

For Web CLI, use `dsh plugin --profile web add github:yxue301603/dsh-everyday-plugins` for the suite. For one tool, use the full subdirectory URL from the table as a single quoted argument. GitHub must be reachable; an npm mirror does not proxy GitHub. A downloaded, prebuilt package directory can also be added using its absolute local path.

To switch from standalone Quick prompts, export important prompts, uninstall the standalone copy, install the collection, then reload. The original `dsh.quick-prompts.v1` key is reused on the same DSH browser origin. Other tools also retain their own keys. Preserve site data. Different devices, profiles with different browser storage, or origins do not synchronize automatically.

For updates, use the host's upgrade action when available. Otherwise back up important text, uninstall the old package and install the same GitHub source again. Do not clear site data.

The tools never send messages or call models automatically. Local records stay on the current browser origin; native file and history actions talk to the connected DSH host. System notifications are off until you explicitly enable them and grant permission. They require a running, connected client, are silent by default, and are normally suppressed in the foreground. Missing end reasons produce “Ended; review result” rather than an assumed success.

For exact storage limits and feature boundaries, open the relevant standalone README. Test status belongs in [verification notes](VERIFICATION.md), not in installation assumptions.
