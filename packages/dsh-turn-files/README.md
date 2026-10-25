# 本轮生成文件列表

> [DSH Everyday 日常工具箱](https://github.com/yxue301603/dsh-everyday-plugins) 的独立插件 · [全部演示](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/docs/GALLERY.md) · [统一反馈](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose)

**AI 做完后去哪找文件？按轮次看交付和已记录的改动，直接预览。**

![本轮文件 / Turn files](https://raw.githubusercontent.com/yxue301603/dsh-everyday-plugins/main/docs/media/dsh-turn-files-dark.png)

实际插件组件，隔离测试宿主，合成内容。

把 DeepSeek Harness 中真实交付的文件与成功的文件改动按轮次集中列出，让你更快找到刚生成的文档、图片和代码。

从输入框旁的「本轮文件」打开。支持文件名、路径、说明搜索，按交付文件、改动清单、工具写入筛选，逐个复制或批量复制路径。在 DSH 右侧原生面板中预览文件。对于有原生授权记录的交付文件和改动文件，桌面宿主提供「打开所在目录」。文件已移动、删除或宿主不支持时会明确报错。

数据来自原生 `deliverables/presented`、`workspace/changes` 事件和成功的 `write`、`edit`、`str_replace_editor` 调用。读取操作、失败写入和回答里随意提到的路径不会混入。终端命令创建但未交付、也未进入改动清单的文件无法自动识别。只显示当前已加载历史，可通过「加载更早轮次」扩展。

支持中英文、深浅主题。插件不执行 Shell 命令，也不会把模型返回的路径当作系统命令执行。打开所在目录通过 DSH 官方接口使用事件坐标，由宿主再次验证文件权限。无模型调用、无外部网络传输。

## 安装

在 DSH 的「插件 → 添加插件」中粘贴：

```text
https://github.com/yxue301603/dsh-everyday-plugins#path:/packages/dsh-turn-files
```

安装并启用后，按 DSH 提示重新加载。仓库已包含预构建文件，无需自行编译。需要 **DSH 0.2.1-rc.2 或兼容的 0.2.x 版本**。迁移、整套安装与升级说明见[工具箱安装指南](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/docs/INSTALLATION.md)。

## 反馈与版本

安装或使用问题请到[工具箱统一反馈](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose)，选择本插件名称。[固定版本下载与校验](https://github.com/yxue301603/dsh-everyday-plugins/releases/tag/v0.1.1) · [贡献指南](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/CONTRIBUTING.md)。同名独立仓库仍是兼容安装来源。
