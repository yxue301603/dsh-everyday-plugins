# 回答收藏与摘录

> [DSH Everyday 日常工具箱](https://github.com/yxue301603/dsh-everyday-plugins) 的独立插件 · [全部演示](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/docs/GALLERY.md) · [统一反馈](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose)

**把值得复用的命令、解释和摘录留下来；加标签，随时搜索和备份。**

![回答收藏 / Answer library](https://raw.githubusercontent.com/yxue301603/dsh-everyday-plugins/main/docs/media/dsh-answer-library-dark.png)

实际插件组件，隔离测试宿主，合成内容。

为 DeepSeek Harness 添加一个本地个人资料库：收藏好用的回答、命令和片段，再次需要时快速找到并插入草稿。

## 日常使用

- 点击回答下方的 `☆` 收藏全文；先选中此回答中的文字再点 `☆`，只收藏所选内容。
- 从输入框旁的「回答收藏」打开资料库，也可展开「从当前会话收藏」选择已加载的回答。
- 按内容、标题、标签搜索，编辑标题和摘录，使用逗号添加多个标签。
- 复制内容，或安全插入当前草稿。插件不会自动发送，也不会覆盖打开面板后变化的草稿。
- 「原会话」返回收藏的来源会话，并尝试定位原生消息所在位置；原文未加载或界面发生变化时，可在原会话中查找。删除收藏前需要在面板内确认。

收藏保存在当前浏览器或桌面客户端的本地存储，不会同步到其他设备。最多 1,000 条，单条最多 200,000 个字符，总量受浏览器存储限制。清理应用数据会清除收藏。没有 API Key 或模型调用，不向外部服务上传收藏；加载来源消息使用当前 DSH 宿主的原生历史接口。

支持中文、英文以及 DSH 深色和浅色主题。使用原生回答事件和回答动作扩展点，不扫描页面文字。选文通过原生消息身份核对来源，避免把另一条回答的选区记到当前回答名下。

## 安装

在 DSH 的「插件 → 添加插件」中粘贴：

```text
https://github.com/yxue301603/dsh-everyday-plugins#path:/packages/dsh-answer-library
```

安装并启用后，按 DSH 提示重新加载。仓库已包含预构建文件，无需自行编译。需要 **DSH 0.2.1-rc.2 或兼容的 0.2.x 版本**。迁移、整套安装与升级说明见[工具箱安装指南](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/docs/INSTALLATION.md)。

## 反馈与版本

安装或使用问题请到[工具箱统一反馈](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose)，选择本插件名称。[固定版本下载与校验](https://github.com/yxue301603/dsh-everyday-plugins/releases/tag/v0.1.1) · [贡献指南](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/CONTRIBUTING.md)。同名独立仓库仍是兼容安装来源。

0.1.1 支持「导出全部 JSON / Markdown」，备份完整资料库，不受当前搜索或标签筛选影响。空库、存储故障时禁用导出；文件只由你主动下载，本版暂不支持导入。
