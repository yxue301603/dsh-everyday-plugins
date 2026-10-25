# 项目便笺 · Project Notes

> [DSH Everyday 日常工具箱](https://github.com/yxue301603/dsh-everyday-plugins) 的独立插件 · [全部演示](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/docs/GALLERY.md) · [统一反馈](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose)

**需求、报错、下一步：留在当前项目的便笺和小待办里。**

![项目便笺 / Project notes](https://raw.githubusercontent.com/yxue301603/dsh-everyday-plugins/main/docs/media/dsh-project-notes-dark.png)

实际插件组件，隔离测试宿主，合成内容。

给每个工作区一张随手写的便笺和一份轻量待办。记需求、报错、临时想法；需要讨论时，一键把文字放进 DSH 输入框。

## 安装与使用

在 DSH「插件 → 添加插件」中填写以下 GitHub 仓库地址（也可使用本地插件目录），启用后按宿主提示重新加载。需要 DeepSeek Harness **0.2.1-rc.2 或更新的 0.2.x**。

```text
https://github.com/yxue301603/dsh-everyday-plugins#path:/packages/dsh-project-notes
```

整套安装、迁移和升级步骤见[工具箱安装指南](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/docs/INSTALLATION.md)。

输入框旁点击「项目便笺」，顶端显示当前工作区路径。同一路径下的会话共享记录；不同工作区相互隔离。没有工作区时使用「通用便笺」。Windows 路径大小写和结尾斜杠会归一化。

- **便笺**：直接编辑，自动保存在本机；支持复制、插入整篇或选中文字。插入保留原光标选区文字，不自动发送。
- **待办**：回车添加、勾选完成、编辑内容；按未完成/已完成/全部筛选，显示完成进度。删除后可撤销最近一条。
- **带入对话**：单条待办可插入当前草稿，再由你确认发送。文字使用官方输入接口，保留原有附件和引用。
- **导出**：将当前便笺和待办导出为 Markdown，未保存的编辑也会包含在导出中。
- 清空当前便笺、批量清理已完成和删除旧工作区记录都需要再次确认。

## 数据与边界

只在当前 DSH 来源的浏览器本地存储保存文字及勾选状态；不调用模型、不读取密钥、不扫描项目文件、不向外发送数据。工作区路径仅用于分组。便笺不会因重命名项目或移动目录自动搬迁；可先导出，再在新工作区粘贴内容。

每个项目便笺最多 48,000 个字符、150 条待办，每条 2,000 个字符；最多 60 个工作区、总计约 800,000 个字符。达到上限时提示整理旧内容，不自动删除你的便笺。文字跨浏览器、DSH 来源和机器不会自动同步。

存储失败时显示错误并保留当前便笺的内存文本，可重试、复制或导出；退出 DSH 会丢失尚未保存的内存编辑。损坏数据不会静默重置。清除 DSH 站点数据会移除插件数据。界面支持中文、英文、深色与浅色主题。

See [English documentation](README.en.md).

## 反馈与版本

安装或使用问题请到[工具箱统一反馈](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose)，选择本插件名称。[固定版本下载与校验](https://github.com/yxue301603/dsh-everyday-plugins/releases/tag/v0.1.1) · [贡献指南](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/CONTRIBUTING.md)。同名独立仓库仍是兼容安装来源。
