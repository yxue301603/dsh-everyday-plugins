# DSH Everyday Toolkit

**Keep useful actions close, and keep your attention on the work.**

Eight native DeepSeek Harness plugins for common prompts, long conversations, draft recovery, useful answers, files, reminders and project notes. Install the collection or choose individual tools.

[中文](README.md) · [Installation and updates](docs/INSTALLATION.md) · [Development plan](docs/PLAN.md) · MIT

## Pick what helps

| Plugin and standalone repository | Everyday use | Where to open it |
| --- | --- | --- |
| [Quick prompts](https://github.com/yxue301603/dsh-quick-prompts) | Insert reusable instructions; customize, pin, categorize, fill template variables and find recent prompts | Quick prompts beside the composer, or pinned prompt buttons |
| [Conversation outline](https://github.com/yxue301603/dsh-conversation-outline) | Search your earlier questions, return to context and resume reading | Chat outline beside the composer |
| [Draft history](https://github.com/yxue301603/dsh-draft-history) | Preview and recover earlier drafts after an accidental clear or unwanted edit | Draft history beside the composer |
| [Answer library](https://github.com/yxue301603/dsh-answer-library) | Save answers and excerpts, add tags, search, copy or insert them later | `☆` below an answer, or Answer library beside the composer |
| [Turn files](https://github.com/yxue301603/dsh-turn-files) | Find delivered and recorded changed files by turn; copy paths, preview or reveal them | Turn files beside the composer |
| [Task alerts](https://github.com/yxue301603/dsh-task-alerts) | Review completion, attention and failure notices; optionally enable background notifications | Task alerts beside the composer and its unread badge |
| [Project notes](https://github.com/yxue301603/dsh-project-notes) | Keep requirements, errors, ideas and a small checklist for each workspace | Project notes beside the composer |
| [Selection actions](https://github.com/yxue301603/dsh-selection-actions) | Quote a passage and prepare a follow-up question, translation or explanation | Ask about selection beside selected message text, or the composer toolbar |

Toolbar entries become compact icons in narrow windows; hover for their names. All tools include Chinese, English and light/dark theme styles.

## Two installation options

### Install the collection

In DSH, open **Plugins → Add plugin** and paste:

```text
https://github.com/yxue301603/dsh-everyday-plugins
```

Install, enable and reload when DSH requests it. This package contains all eight tools.

### Install individual tools

Open a standalone repository from the table and paste its GitHub URL into the same Add plugin field. Each tool works independently and does not require the collection package.

**Do not install both the collection and the same individual tools.** Duplicate copies can add duplicate controls and listeners. If you already use standalone `dsh-quick-prompts`, uninstall it before switching to the collection. Existing prompts use the same storage key and remain readable on the same DSH origin when site data is preserved.

The compatibility baseline is **DeepSeek Harness 0.2.1-rc.2 and subsequent 0.2.x versions**, for Web and Desktop. Untested versions are not promised to work. Prebuilt clients are included; users do not need Node.js or a build step.

GitHub must be reachable. Selecting an npm mirror in DSH does not proxy GitHub downloads. See the [installation guide](docs/INSTALLATION.md) for individual URLs, CLI instructions, migration and updates.

## You decide what gets sent

Plugins use native DSH interfaces, never send messages automatically and never call a model on their own. No API key is needed. Translation and explanation actions prepare a request in your draft; you review and send it. Normal insertion preserves existing text, and native revision guards reject stale edits. Replacing a whole draft requires separate confirmation.

Prompts, saved answers, draft history, notes and alert records live in browser-local storage for the current DSH origin. Selection quotations stay in window memory. There is no external sync or push server. File lists, loading older history and navigation use the connected DSH host's native interfaces, so those actions may communicate with that host.

System notifications are off until explicitly enabled and permission is granted. They are silent by default and suppressed while DSH is in the foreground unless you choose otherwise. They show the conversation title, not answer text.

## Practical limits

- **Outline search covers loaded questions.** Load earlier messages manually when needed; the plugin does not fetch a whole conversation automatically.
- **Draft history stores plain text.** Attachment files and reference-chip semantics are not backed up. Size and age limits apply, and a forced crash can lose the final typing interval. Entering a conversation does not automatically replace its composer draft.
- **Libraries and notes are local records.** Different machines and DSH origins do not synchronize. Clearing site data removes records. Storage errors are visible; copy or export unsaved notes before quitting.
- **The file list depends on recorded sources.** It includes native deliverables, change summaries and supported successful file writes. Files created only by terminal commands without delivery or change records may be absent. Preview depends on host capabilities; revealing a folder also needs a host desktop.
- **Alerts need a running, connected client.** Only new live changes are observed. No historical backlog is replayed. Without an explicit end reason, an alert says “Ended; review result” instead of assuming success. Attention notices depend on current host interaction state. Quitting DSH stops notifications.
- **Selections come from one rendered message.** Mixed selections across several messages are unsupported. The source can become unavailable after unloading, while an already captured quotation remains usable.

See each standalone README for exact limits. Verification progress belongs in [verification notes](docs/VERIFICATION.md); unfinished work is tracked in the [development plan](docs/PLAN.md).

## Source layout

`packages/` contains one source directory per plugin, synchronized to a same-name standalone GitHub repository. The root package combines all eight prebuilt clients. Each standalone package includes its own bundle and shared code and does not depend on the collection directory.

For development, use `npm ci`, `npm run build` and `npm test`. Browser and real DSH validation are described separately in the verification notes. Normal installation requires no build tools.
