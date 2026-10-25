# Task alerts

> An individual tool from [DSH Everyday](https://github.com/yxue301603/dsh-everyday-plugins) · [All demos](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/docs/GALLERY.md) · [Shared issue tracker](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose)

**Return to a clear list of conversations that finished, failed or need your attention.**

![任务提醒 / Task alerts](https://raw.githubusercontent.com/yxue301603/dsh-everyday-plugins/main/docs/media/dsh-task-alerts-dark.png)

Actual plugin components, isolated test host, synthetic content.

Keep completion, attention, failure and stop notices in one local DeepSeek Harness inbox.

- Open **Task alerts** next to the composer. Filter unread notices or statuses, and jump back to the source conversation.
- In-app recording is on by default. System notifications remain off until you explicitly enable them and grant permission.
- Notifications are silent and suppressed while DSH is focused in the foreground unless you opt in otherwise.
- Notification bodies contain only the conversation title, never answer text. Mark individual/all notices read, then clear read notices.

Only new live changes after plugin startup are observed. Old history is never replayed. Retained conversation events supply detailed completion/failure/stop reasons; native pending-interaction status provides attention notices. A running-state change without an explicit end reason is labeled **Ended; review result**, never assumed successful. Available detail depends on host capabilities. The plugin does not open other conversations just to monitor them. Notifications require the client to remain open and connected.

Stores up to 200 notices locally. English/Chinese and dark/light themes. No API key, model calls or external notification server.

**Needs attention** is emitted only for a live native pending interaction. A `blocked` turn has already ended after a pre-step rejection; it is labeled **Ended**, not treated as an approval request.

## Install

In DSH, open **Plugins → Add plugin** and paste:

```text
https://github.com/yxue301603/dsh-everyday-plugins#path:/packages/dsh-task-alerts
```

Enable the plugin and reload as requested. Prebuilt files are included; no build step is required. Requires **DSH 0.2.1-rc.2 or a compatible 0.2.x version**. See the [collection installation guide](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/docs/INSTALLATION.md#english-quick-guide) for migration and upgrades.

## Feedback and releases

Use the [shared issue tracker](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose) and select this tool. [Pinned downloads and checksums](https://github.com/yxue301603/dsh-everyday-plugins/releases/tag/v0.1.1) · [Contributing](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/CONTRIBUTING.md). The same-name standalone repository remains a compatibility source.
