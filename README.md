# DSH Everyday · 日常工具箱

**找回误清空的草稿，收藏值得复用的回答，快速定位长对话。**

8 个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 原生插件，按需装一个，也可以整套安装。中文 / English · 深浅主题 · 本地保存 · MIT。

[English](README.en.md) · [八个插件与截图](docs/GALLERY.md) · [安装与升级](docs/INSTALLATION.md) · [下载固定版本](https://github.com/yxue301603/dsh-everyday-plugins/releases/tag/v0.1.2) · [反馈](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose)

[![Checks](https://github.com/yxue301603/dsh-everyday-plugins/actions/workflows/checks.yml/badge.svg)](https://github.com/yxue301603/dsh-everyday-plugins/actions/workflows/checks.yml)
[![MIT](https://img.shields.io/badge/license-MIT-315fbe)](LICENSE)
[![DSH tested](https://img.shields.io/badge/DSH%20tested-0.2.2--alpha.2-315fbe)](docs/VERIFICATION.md)

## 先看它能帮你什么

![草稿找回、回答收藏、对话定位的实际插件演示](https://raw.githubusercontent.com/yxue301603/dsh-everyday-plugins/main/docs/media/everyday-demo-dark.gif)

13 秒演示：草稿历史 → 带标签的回答收藏 → 搜索提问。使用实际插件组件、隔离测试宿主和合成内容。[静态版与全部截图](docs/GALLERY.md) · [素材来源](docs/media/README.md)。

本版修复长对话滚动与输入卡顿；[性能复现与结果](docs/PERFORMANCE.md)。

## 安装

在 DSH 打开 **插件 → 添加插件**，粘贴下面的地址，安装、启用后按提示重载：

```text
https://github.com/yxue301603/dsh-everyday-plugins
```

仓库提供预构建客户端，**不用自行编译，也不需要额外的 API Key**。已验证 DSH **0.2.1-rc.3、rc.4、0.2.2-alpha.2**；alpha.2 是预览版，具体范围见[验证说明](docs/VERIFICATION.md)。

已经装了独立快捷指令？可以保留它，按需添加其他功能。**同一个功能只安装一份**，整套与重复的独立包二选一。完整子目录地址、固定版本、桌面/Web 区别和升级步骤见 [安装指南](docs/INSTALLATION.md)。

只装草稿历史的例子：

```text
https://github.com/yxue301603/dsh-everyday-plugins#path:/packages/dsh-draft-history
```

## 从三个日常场景开始

| 你遇到的事 | 打开哪个工具 | 第一次就能试的动作 |
| --- | --- | --- |
| 刚写的需求误清空了 | **草稿历史** | 写一段话，停顿约一秒，清空后打开历史，预览并插入 |
| 想留住好用的命令和解释 | **回答收藏** | 点回答下方 ☆，编辑标题和标签，再搜索或插回草稿；也能导出全部 JSON / Markdown |
| 长对话里找不到之前的问题 | **对话目录** | 搜索自己的提问，点结果返回上下文；需要时手动加载更早消息 |

## 八个小工具，各管一件常用的事

| 插件目录 | 日常用途 | 入口 |
| --- | --- | --- |
| [快捷指令](packages/dsh-quick-prompts) | 置顶常用话术，项目分类、搜索、模板变量与最近使用 | 输入框「快捷指令」或置顶按钮 |
| [对话目录](packages/dsh-conversation-outline) | 检索提问、跳转上下文、继续阅读 | 输入框「目录」 |
| [草稿历史](packages/dsh-draft-history) | 自动记录、预览恢复、误清空保护 | 输入框「草稿」 |
| [回答收藏](packages/dsh-answer-library) | 收藏摘录、标签搜索、复制复用、批量备份 | 回答下方 ☆ / 输入框「收藏」 |
| [本轮文件](packages/dsh-turn-files) | 按轮次找交付与改动文件，预览、复制路径、打开目录 | 输入框「文件」 |
| [任务提醒](packages/dsh-task-alerts) | 查看完成、待确认、失败与未读记录 | 输入框「提醒」及未读数 |
| [项目便笺](packages/dsh-project-notes) | 自动保存的项目笔记、小待办、Markdown 导出 | 输入框「便笺」 |
| [选文操作](packages/dsh-selection-actions) | 引用选中的一句话，准备追问、翻译或解释 | 选区旁「选中追问」 / 输入框「选文」 |

宽输入框显示短名称，窄窗口或分栏保留图标，悬停可看完整名称。中英界面都跟随实际输入区宽度。

## 你决定内容何时发送

插入动作保留已有草稿，并使用 DSH 原生修订校验。**插件不会自动发送消息或自行调用模型**；翻译、解释也先准备请求，由你检查后发送。

草稿、收藏、便笺、指令和提醒记录保存在当前 DSH 来源的本地浏览器存储；没有外部同步服务或遥测。历史加载、文件预览等使用你正在连接的 DSH 宿主。系统通知默认关闭，需要你主动开启并授权，只显示会话标题。

需要提前了解的边界：草稿历史保存纯文本；目录搜索已加载提问；文件列表依赖原生交付和改动记录；提醒需要客户端在线。更换浏览器来源不会自动同步资料。收藏可导出备份，本版暂不支持导入。详见各插件 README 和 [安装说明](docs/INSTALLATION.md)。

## 一起把日常体验做好

觉得有用，可以 **Star [总仓库](https://github.com/yxue301603/dsh-everyday-plugins)**，方便找回和关注版本更新。发现不好用的地方，直接 [选一个反馈表单](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose)，告诉我们你当时想完成什么。

欢迎小而具体的改进、翻译和兼容反馈：[贡献指南](CONTRIBUTING.md) · [版本记录](CHANGELOG.md) · [验证结果](docs/VERIFICATION.md)。

```sh
npm ci
npm run check
npm run pack
```

八个插件统一维护在 `packages/`；已有同名独立仓库保留兼容入口，反馈集中到总仓库。无需为了使用插件运行上面的开发命令。
