# Chat outline

> An individual tool from [DSH Everyday](https://github.com/yxue301603/dsh-everyday-plugins) · [All demos](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/docs/GALLERY.md) · [Shared issue tracker](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose)

**Lost an earlier question in a long chat? Search your questions and jump back to context.**

![对话目录 / Conversation outline](https://raw.githubusercontent.com/yxue301603/dsh-everyday-plugins/main/docs/media/dsh-conversation-outline-dark.png)

Actual plugin components, isolated test host, synthetic content.

A native DeepSeek Harness plugin for finding your questions in long conversations.

- Lists human questions and follow-ups, excluding system injections and tool output.
- Searches full loaded questions, with space-separated keywords matched together.
- Returns to a question using native turn navigation when available.
- Loads earlier messages only when requested and shows the loaded search scope.
- Remembers the last question you read on this device; resume explicitly without interrupting your current reading.
- Supports light/dark themes and Chinese/English interfaces.

## Install

Requires **DSH 0.2.1-rc.2 or a newer 0.2.x version**. In Plugins → Add plugin, enter:

```text
https://github.com/yxue301603/dsh-everyday-plugins#path:/packages/dsh-conversation-outline
```

Enable and reload as requested by DSH. Open **Chat outline** from the composer toolbar (`☷` in narrow windows).

CLI users: `dsh plugin --profile web add github:yxue301603/dsh-conversation-outline`. Desktop users should use the desktop plugin manager.

For collection installation, migration and upgrades, see the [installation guide](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/docs/INSTALLATION.md#english-quick-guide).

## Privacy and limits

Reads the current session's public Chat snapshot. No disk scanning, network requests, model calls, or automatic messages. Local reading records contain session IDs, message identities, and timestamps, capped at 100 sessions; question text is not copied into storage.

Search covers loaded history. Load earlier messages to search further. Navigation uses native turn controls and stable `data-chat-*` identities; switch back to Chat if another view is active. Reading recovery returns to the last question rather than an exact pixel offset.

[中文](README.md) · MIT

## Feedback and releases

Use the [shared issue tracker](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose) and select this tool. [Pinned downloads and checksums](https://github.com/yxue301603/dsh-everyday-plugins/releases/tag/v0.1.1) · [Contributing](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/CONTRIBUTING.md). The same-name standalone repository remains a compatibility source.
