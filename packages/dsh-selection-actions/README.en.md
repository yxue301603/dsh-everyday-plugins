# Selection actions

> An individual tool from [DSH Everyday](https://github.com/yxue301603/dsh-everyday-plugins) · [All demos](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/docs/GALLERY.md) · [Shared issue tracker](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose)

**Select a passage and prepare a quoted follow-up, translation or explanation.**

![选文操作 / Selection actions](https://raw.githubusercontent.com/yxue301603/dsh-everyday-plugins/main/docs/media/dsh-selection-actions-dark.png)

Actual plugin components, isolated test host, synthetic content.

A native DeepSeek Harness plugin to ask, translate, or explain selected conversation text.

- Select text in an answer or question to reveal a floating action; a composer toolbar entry is also available.
- Keeps the quotation stable while you edit. A new selection is adopted only when requested.
- Supports an editable follow-up question, translation target language, and an explanation template.
- Returns to the original selection while its rendered source remains available, with a clear stale-source notice otherwise.
- Uses DSH's undoable, revision-guarded draft insertion. Never sends automatically or silently overwrites a changed draft.
- Supports dark/light themes and Chinese/English interfaces.

## Install

Requires **DSH 0.2.1-rc.2 or a newer 0.2.x version**. In Plugins → Add plugin, enter:

```text
https://github.com/yxue301603/dsh-everyday-plugins#path:/packages/dsh-selection-actions
```

Enable and reload as requested. Select text, open **Selection actions** (`↗` in narrow windows), and insert your request into the draft. Review and send it yourself.

CLI: `dsh plugin --profile web add github:yxue301603/dsh-selection-actions`. Desktop users should use the desktop plugin manager.

For collection installation, migration and upgrades, see the [installation guide](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/docs/INSTALLATION.md#english-quick-guide).

## Privacy and limits

No clipboard reads, network requests, or automatic model calls. Quotations stay temporarily in window memory and disappear on reload or exit. A selection may contain up to 12,000 characters inside one visible message. Editor fields, plugin panels, tool output, and selections crossing multiple messages are excluded.

Re-rendering can invalidate the original range; captured quotation text remains available. Translation and explanation are draft templates that only reach the current DSH model when you send them.

[中文](README.md) · MIT

## Feedback and releases

Use the [shared issue tracker](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose) and select this tool. [Pinned downloads and checksums](https://github.com/yxue301603/dsh-everyday-plugins/releases/tag/v0.1.1) · [Contributing](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/CONTRIBUTING.md). The same-name standalone repository remains a compatibility source.
