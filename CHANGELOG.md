# Changelog

## 0.1.2 — 2026-10-29

- 修复长对话滚动及输入卡顿：目录关闭时不订阅、提取整段聊天；阅读位置仅在用户停滚后进行少量命中检测，避免每个问题各扫描一次整页。
- 选文操作共用被动监听，光标移动和空闲滚动不触发重复选区处理；提醒只消费实时增量，不遍历完整事件历史。
- 草稿仅订阅文本变化，停顿后在有界空闲期落盘，清空、切换、关页和卸载仍保留最后文本；未改变存储键和容量上限。
- 本地数据未变化时复用已验证快照，跳过重复写入和通知；独立插件共用一份相同样式，正确计数卸载。
- 适配新版 DSH 的原生引用与 `sending` 状态：含引用时禁用整段替换，确认前再次检查当前输入框；普通插入保留引用与原生撤销。
- 新增长对话性能比较及回归检查；具体宿主版本、范围与结果见 [验证说明](docs/VERIFICATION.md) 和 [性能说明](docs/PERFORMANCE.md)。

Fixes long-chat scrolling and typing stalls by removing closed-panel history work and quadratic DOM scans. Selection and task monitoring avoid idle/full-history work; draft persistence is deferred to bounded idle time without losing clear/switch/unload protection. Identical CSS and unchanged storage documents are reused. Native quote chips and the new sending state are protected during draft recovery. The suite and seven newer tools are 0.1.2; Quick prompts remains 0.1.3.

## 0.1.1 — 2026-10-24

- 宽输入框显示「目录、草稿、收藏、文件、提醒、便笺、选文」短名称；窄输入框保留图标。显示方式跟随实际输入区宽度，适应分栏。
- 回答收藏支持主动导出全部 JSON 或 Markdown，搜索或标签筛选不会遗漏备份条目。空库或存储故障时禁用导出；本版不含导入。
- 首页以草稿恢复、回答复用、长对话定位三个场景展示；新增八功能图库、中英上手与统一反馈入口。
- 社区目录截图元数据、按功能搜索标签及预构建 Release 包；演示素材不进入运行安装包。
- 快捷指令的运行版本仍为 **0.1.3**；其余七个插件和整套包为 **0.1.1**。没有改变本地存储键或自动发送行为。

Wide composers now show readable tool labels; narrow panes keep compact icons. Answer library can export all saved entries as JSON or Markdown, independent of active filters. The release also adds clearer demos, installation guidance, shared issue forms, discovery metadata and prebuilt archives with SHA256 checksums. Demo media is excluded from runtime packages. Quick prompts remains at 0.1.3; the suite and seven newer tools are 0.1.1. No storage keys have changed.

## 0.1.0 — 2026-10-21

Initial collection of eight native tools: Quick prompts, Chat outline, Draft history, Answer library, Turn files, Task alerts, Project notes and Selection actions. Published the collection and standalone sources, verified light/dark and narrow layouts, and retained the original Quick prompts 0.1.3 storage format.
