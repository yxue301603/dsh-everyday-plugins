# Answer library

> An individual tool from [DSH Everyday](https://github.com/yxue301603/dsh-everyday-plugins) · [All demos](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/docs/GALLERY.md) · [Shared issue tracker](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose)

**Keep useful commands, explanations and excerpts. Add tags, search, reuse, and back up the whole library.**

![回答收藏 / Answer library](https://raw.githubusercontent.com/yxue301603/dsh-everyday-plugins/main/docs/media/dsh-answer-library-dark.png)

Actual plugin components, isolated test host, synthetic content.

A local personal library for DeepSeek Harness. Keep useful answers, commands and excerpts, then find and reuse them later.

- Use `☆` under a native answer to save it. Select text within that answer first to save only the excerpt.
- Open **Answer library** next to the composer. The current conversation section offers loaded answers without scraping rendered text.
- Search titles, text and tags; edit saved text and add comma-separated tags.
- Copy an answer or insert it into your draft through DSH's revision-guarded composer API. Nothing is sent automatically. A changed draft is never silently overwritten.
- Return to the source conversation and try to locate its native message. If the source is unavailable or the view has changed, browse the original chat instead. Deleting an item requires an inline confirmation.

Supports English, Chinese, and native dark/light themes. No API key, model calls, telemetry or cloud sync. Native message identity keeps selected excerpts associated with the correct answer. Data lives in this browser/client's local storage and is removed when application data is cleared. Limit: 1,000 items, 200,000 characters per item, also subject to browser storage capacity. Loading a source message uses the connected DSH host's native history interface; saved answers are not uploaded to external services.

## Install

In DSH, open **Plugins → Add plugin** and paste:

```text
https://github.com/yxue301603/dsh-everyday-plugins#path:/packages/dsh-answer-library
```

Enable the plugin and reload as requested. Prebuilt files are included; no build step is required. Requires **DSH 0.2.1-rc.2 or a compatible 0.2.x version**. See the [collection installation guide](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/docs/INSTALLATION.md#english-quick-guide) for migration and upgrades.

## Feedback and releases

Use the [shared issue tracker](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose) and select this tool. [Pinned downloads and checksums](https://github.com/yxue301603/dsh-everyday-plugins/releases/tag/v0.1.1) · [Contributing](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/CONTRIBUTING.md). The same-name standalone repository remains a compatibility source.

Version 0.1.1 exports all entries as JSON or Markdown, independent of active search and tag filters. Export is disabled for empty or unreadable storage. Downloads are explicit; importing is not supported in this release.
