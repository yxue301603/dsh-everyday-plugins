# 选中文字快捷操作

> [DSH Everyday 日常工具箱](https://github.com/yxue301603/dsh-everyday-plugins) 的独立插件 · [全部演示](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/docs/GALLERY.md) · [统一反馈](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose)

**选中回答里的一句话，带着引用继续追问、翻译或解释。**

![选文操作 / Selection actions](https://raw.githubusercontent.com/yxue301603/dsh-everyday-plugins/main/docs/media/dsh-selection-actions-dark.png)

实际插件组件，隔离测试宿主，合成内容。

DeepSeek Harness 原生插件。选中回答里的一句话，带着引用继续追问、翻译或解释。

- 在回答或用户提问中选中文字，会显示“选中追问”浮动入口；输入框工具栏也可打开。
- 引用在编辑时保持不变；有新选区时，可明确选择“使用新选区”。
- 追问支持自定义问题，翻译可指定目标语言，解释会请求概念、前提与例子。
- “定位原文”回到来源并恢复文字选区；原文因切换视图或历史加载而失效时，会给出提示。
- 只通过 DSH 官方可撤销插入接口填入草稿，不自动发送；草稿已变化时中止，避免覆盖。
- 深色、浅色主题和中英文界面均支持。

## 安装与使用

需要 **DeepSeek Harness 0.2.1-rc.2 或更新的 0.2.x 版本**。在“插件 → 添加插件”中填写：

```text
https://github.com/yxue301603/dsh-everyday-plugins#path:/packages/dsh-selection-actions
```

安装、启用并按提示重载。选中当前对话的一段文字，点击“选中追问”，填写问题后选择“填入草稿”。确认草稿后自行发送。窄窗口中工具栏入口显示为 `↗`。

命令行：`dsh plugin --profile web add github:yxue301603/dsh-selection-actions`。桌面版使用桌面版自身的插件管理器。

整套安装、迁移和升级步骤见[工具箱安装指南](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/docs/INSTALLATION.md)。

## 数据与边界

不读取剪贴板，不发网络请求，不自动调用模型。引用只暂存在当前窗口内存，刷新或退出后清除；单次最多 12,000 字。只接受同一条已显示消息内的选区，排除输入框、插件面板和工具输出，不支持跨多条消息的混合选区。

源消息重新渲染后，原选区可能无法定位；已经捕获的引用仍可使用。翻译和解释是填入草稿的请求模板，必须由你发送后才会交给当前 DSH 模型处理。

[English](README.en.md) · MIT

## 反馈与版本

安装或使用问题请到[工具箱统一反馈](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose)，选择本插件名称。[固定版本下载与校验](https://github.com/yxue301603/dsh-everyday-plugins/releases/tag/v0.1.1) · [贡献指南](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/CONTRIBUTING.md)。同名独立仓库仍是兼容安装来源。
