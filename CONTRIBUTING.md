# 参与贡献 / Contributing

欢迎修复问题、改进说明、翻译或分享真实使用中的不顺手之处。没有代码也可以参与。中文和 English 均可。

Bug reports, documentation fixes, translations and workflow suggestions are welcome. You do not need to write code to help. Chinese and English are both welcome.

## 从一个具体问题开始 / Start with a concrete problem

八个插件的新反馈统一放在[工具箱 Issues](https://github.com/yxue301603/dsh-everyday-plugins/issues)。先搜索是否已有相同问题；已有报告可以直接补充复现条件。独立仓库原有 Issues 保留，不需要重复提交。反馈需要哪些信息见[反馈指南](docs/FEEDBACK.md)。

Use the [collection issue tracker](https://github.com/yxue301603/dsh-everyday-plugins/issues) for new reports about any of the eight plugins. Search first and add reproduction details to an existing issue when relevant. Existing standalone-repository issues remain valid; do not duplicate them. See the [feedback guide](docs/FEEDBACK.md).

较大的新功能、存储格式或安装方式调整，建议先开一个使用建议，说明场景与预期结果，减少实现方向不一致带来的返工。小修复和文档修正可以直接提交 PR。不要求先索取许可，也不承诺固定响应时间。

For larger features or storage/installation changes, discussing the workflow first can avoid wasted effort. Small fixes and documentation corrections can go straight to a pull request. Prior permission is not required, and there is no guaranteed response time.

## 本地开发 / Local development

使用 Node.js 24，在仓库根目录执行：

Use Node.js 24 and run from the repository root:

```sh
npm ci
npm run build
npm test
```

- 新插件源文件位于 `packages/<plugin>/src/`；共用代码修改根目录 `shared/`，构建时会复制到对应插件。请勿手改生成的 `lib/client.js` 或子包的共享代码副本。
- 总包与独立包都要能安装，预构建文件随源码提交。若修改既有快捷指令，注意其独立构建与兼容入口，确认相关构建产物同步。
- 不提交 `node_modules/`、`.cache/`、工作机报告、个人会话或凭据。用合成内容复现。

- Edit plugin sources in `packages/<plugin>/src/` and common sources in root `shared/`. The build copies shared code into packages; avoid hand-editing generated bundles or copied shared files.
- Keep collection and individual installation working. Commit updated prebuilt files when code changes. Quick prompts has its own build and compatibility source; ensure its relevant generated files stay synchronized.
- Do not commit dependencies, caches, machine-specific reports, personal conversations or credentials. Use synthetic reproduction data.

界面或交互修改可运行后台浏览器检查：

For UI or interaction changes, run the headless browser checks:

```sh
npx playwright install chromium
npm run test:browser
```

只跑与改动相关的验证即可，并在 PR 中写明结果；纯文档修改通常检查文字和链接即可。真实 DSH 检查的环境与边界见[验证说明](docs/VERIFICATION.md)。不要为了测试改动正在使用的个人 DSH、清空存储或重启桌面。

Run checks appropriate to the change and report actual results. Documentation-only edits normally need a text/link review. See [verification notes](docs/VERIFICATION.md) before running native DSH checks. Do not test by modifying personal DSH profiles, clearing their storage or restarting someone's active desktop.

## 提交前关注 / Review before submitting

- 说明触发问题的操作和修改后的结果，避免只列实现细节。
- 深色和浅色主题都能看清文字；相关中英文文案完整，窄窗口入口可用。
- 保留已有草稿，插入只走原生接口，不自动发送。数据读取或保存失败应明确提示。
- 修改原生接口依赖、存储格式或权限时写明兼容与迁移影响。

- Describe the trigger and resulting behavior, not just implementation details.
- Check readable text in light/dark themes, relevant Chinese/English copy and narrow-window access.
- Preserve existing drafts, use native insertion and never send automatically. Make read/write failures visible.
- Explain compatibility and migration effects for changed native APIs, storage formats or permissions.

提交即表示你有权贡献这些内容，并同意以本项目 [MIT 许可](LICENSE)发布。不需要签署额外贡献协议。

By submitting, you confirm that you have the right to contribute the material and agree to release it under this project's [MIT license](LICENSE). No additional contributor agreement is required.
