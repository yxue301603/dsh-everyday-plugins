# Draft History

> An individual tool from [DSH Everyday](https://github.com/yxue301603/dsh-everyday-plugins) · [All demos](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/docs/GALLERY.md) · [Shared issue tracker](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose)

**Accidentally cleared a draft? Preview an earlier version for this conversation before restoring it.**

![草稿历史 / Draft history](https://raw.githubusercontent.com/yxue301603/dsh-everyday-plugins/main/docs/media/dsh-draft-history-dark.png)

Actual plugin components, isolated test host, synthetic content.

A small safety net for the native DeepSeek Harness composer. Browse, search, copy and recover previous drafts without sending anything automatically.

## Install and use

In DSH, open **Plugins → Add plugin** and enter the following GitHub repository URL (or a local package directory). Enable it and reload when requested. Requires DSH **0.2.1-rc.2 or a newer 0.2.x version**. No browser extension or model access is needed.

```text
https://github.com/yxue301603/dsh-everyday-plugins#path:/packages/dsh-draft-history
```

For collection installation, migration and upgrades, see the [installation guide](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/docs/INSTALLATION.md#english-quick-guide).

Open **Draft history** beside the composer. A version is saved about 900 ms after typing pauses. The last nonempty text is also protected when clearing or leaving a conversation where possible. **Save current** creates an immediate checkpoint. DSH's own draft persistence stays in charge; entering a conversation never overwrites its draft automatically.

- Histories are separate for each conversation and support text search, copying and individual deletion.
- **Insert into draft** inserts at the native selection's end, preserving selected text, existing references and attachments.
- **Replace current text** requires confirmation, backs up current text and uses the native revision guard. It is disabled with attachments, references, an active submission or text beyond the history size limit.
- Pause recording without removing existing history. Manual saving still works while paused.
- Clearing conversation history leaves the composer unchanged and does not immediately record the same unedited text again.

## Storage and limits

Only plain text is kept in browser-local storage for the current DSH origin. No uploads, credentials, attachment bodies or model calls. Reference chips are recorded only as clipboard text and are not restored as references. Previously sent text may remain in editing history; review it before reusing it.

Up to 40 conversations, 12 versions per conversation, 48,000 characters per version and approximately 800,000 characters overall. The UI shows the last 30 days; later saves remove expired entries. Older versions are trimmed when needed. Oversized drafts are skipped rather than truncated. A forced crash may lose the final typing interval. Histories do not automatically synchronize across origins, browsers or machines.

Read and write failures are visible. Corrupt records are not silently overwritten. Clearing DSH site data removes history. Includes Chinese, English and light/dark theme support. Restoration uses official DSH composer actions only.

## Feedback and releases

Use the [shared issue tracker](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose) and select this tool. [Pinned downloads and checksums](https://github.com/yxue301603/dsh-everyday-plugins/releases/tag/v0.1.1) · [Contributing](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/CONTRIBUTING.md). The same-name standalone repository remains a compatibility source.
