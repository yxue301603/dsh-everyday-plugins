# Turn files

> An individual tool from [DSH Everyday](https://github.com/yxue301603/dsh-everyday-plugins) · [All demos](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/docs/GALLERY.md) · [Shared issue tracker](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose)

**Where are the files after a task? Find delivered and recorded changed files by turn and preview them.**

![本轮文件 / Turn files](https://raw.githubusercontent.com/yxue301603/dsh-everyday-plugins/main/docs/media/dsh-turn-files-dark.png)

Actual plugin components, isolated test host, synthetic content.

Find delivered files and successful file changes in one place, grouped by conversation turn.

Open **Turn files** beside the composer. Search filenames, paths or descriptions; filter deliverables, recorded changes or tool writes; copy individual or all matching paths; preview files in DSH's native sidebar. Native deliverables and change records can be revealed in the desktop file manager when the host supports it. Missing files and unsupported actions show explicit errors.

Uses native `deliverables/presented` and `workspace/changes` events plus successful `write`, `edit` and `str_replace_editor` calls. Reads, failed writes and arbitrary prose paths are excluded. Files created solely through terminal commands may be absent unless presented or recorded as changed. Only loaded conversation history is shown; use **Load earlier turns** for older records.

Supports English/Chinese and dark/light themes. No shell commands, model calls or external network transmission. File-manager actions use official event coordinates and host-side permission checks rather than executing model-provided paths.

## Install

In DSH, open **Plugins → Add plugin** and paste:

```text
https://github.com/yxue301603/dsh-everyday-plugins#path:/packages/dsh-turn-files
```

Enable the plugin and reload as requested. Prebuilt files are included; no build step is required. Requires **DSH 0.2.1-rc.2 or a compatible 0.2.x version**. See the [collection installation guide](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/docs/INSTALLATION.md#english-quick-guide) for migration and upgrades.

## Feedback and releases

Use the [shared issue tracker](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose) and select this tool. [Pinned downloads and checksums](https://github.com/yxue301603/dsh-everyday-plugins/releases/tag/v0.1.1) · [Contributing](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/CONTRIBUTING.md). The same-name standalone repository remains a compatibility source.
