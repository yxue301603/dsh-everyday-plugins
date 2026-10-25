# 对话目录与快速定位

> [DSH Everyday 日常工具箱](https://github.com/yxue301603/dsh-everyday-plugins) 的独立插件 · [全部演示](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/docs/GALLERY.md) · [统一反馈](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose)

**长对话里找不到之前的问题？搜索自己的提问，点一下回到上下文。**

![对话目录 / Conversation outline](https://raw.githubusercontent.com/yxue301603/dsh-everyday-plugins/main/docs/media/dsh-conversation-outline-dark.png)

实际插件组件，隔离测试宿主，合成内容。

DeepSeek Harness 原生插件。在长对话里按问题找回上下文，而不用反复滚动。

- 只列出用户提问与补充提问，排除工具输出和系统注入。
- 搜索标题式预览和完整提问文字；多个关键词以空格分隔，可同时匹配。
- 点击问题跳回对应轮次，优先触发 DSH 原生轮次导航。
- 手动加载更早消息，明确显示搜索覆盖的已加载范围。
- 记住本机最近阅读的问题，点击“继续上次阅读”恢复；不会自动打断当前阅读位置。
- 支持深色、浅色主题和中英文界面。

## 安装与使用

需要 **DeepSeek Harness 0.2.1-rc.2 或更新的 0.2.x 版本**。

在 DSH 的“插件 → 添加插件”中填写：

```text
https://github.com/yxue301603/dsh-everyday-plugins#path:/packages/dsh-conversation-outline
```

安装并启用后，按 DSH 提示重载。在会话输入框左侧工具栏选择“对话目录”（窄窗口中显示 `☷` 图标），搜索或点击某条提问。

命令行用户也可运行 `dsh plugin --profile web add github:yxue301603/dsh-conversation-outline`。桌面版请使用其自身的插件管理器。

整套安装、迁移和升级步骤见[工具箱安装指南](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/docs/INSTALLATION.md)。

## 数据与边界

插件从 DSH 的公开会话与 Chat 快照读取当前会话的已加载提问，不扫描磁盘或其他会话、不访问网络、不调用模型、不发送消息。阅读记录只保存当前设备上的会话 ID、消息定位信息和时间，最多保留 100 个会话，不复制提问正文。卸载插件不会删除 DSH 原会话。

搜索不包含尚未加载的历史；使用“加载更早消息”可扩大搜索范围。定位依赖 DSH 原生轮次按钮和稳定的 `data-chat-*` 身份标识；如果当前切到“轨迹”等其他视图，请先回到“对话”。阅读恢复定位到最近阅读的问题，不保存页面的精确像素位置。

[English](README.en.md) · MIT

## 反馈与版本

安装或使用问题请到[工具箱统一反馈](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose)，选择本插件名称。[固定版本下载与校验](https://github.com/yxue301603/dsh-everyday-plugins/releases/tag/v0.1.1) · [贡献指南](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/CONTRIBUTING.md)。同名独立仓库仍是兼容安装来源。
