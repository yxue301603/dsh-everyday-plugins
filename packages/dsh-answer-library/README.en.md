# Answer library

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
https://github.com/yxue301603/dsh-answer-library
```

Enable the plugin and reload as requested. Prebuilt files are included; no build step is required. Requires **DSH 0.2.1-rc.2 or a compatible 0.2.x version**. See the [collection installation guide](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/docs/INSTALLATION.md#english-quick-guide) for migration and upgrades.
