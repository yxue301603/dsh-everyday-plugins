# DSH Everyday

**Recover a lost draft. Keep a useful answer. Find your place in a long chat.**

Eight native [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) plugins. Install one tool or the full collection. English / 中文 · Light & dark · Local records · MIT.

[中文](README.md) · [All eight tools and screenshots](docs/GALLERY.md) · [Install and update](docs/INSTALLATION.md#english-quick-guide) · [Download a fixed release](https://github.com/yxue301603/dsh-everyday-plugins/releases/tag/v0.1.2) · [Report an issue](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose)

[![Checks](https://github.com/yxue301603/dsh-everyday-plugins/actions/workflows/checks.yml/badge.svg)](https://github.com/yxue301603/dsh-everyday-plugins/actions/workflows/checks.yml)
[![MIT](https://img.shields.io/badge/license-MIT-315fbe)](LICENSE)
[![DSH tested](https://img.shields.io/badge/DSH%20tested-0.2.2--alpha.2-315fbe)](docs/VERIFICATION.md)

## See the everyday workflow

![Recovering a draft, tagging saved answers, and finding an earlier question](https://raw.githubusercontent.com/yxue301603/dsh-everyday-plugins/main/docs/media/everyday-demo-dark.gif)

A 13-second walkthrough with actual plugin components, an isolated contract host and synthetic content. [Static version and gallery](docs/GALLERY.md) · [Capture details](docs/media/README.md).

This release fixes long-chat scrolling and typing stalls. [Performance evidence and reproduction](docs/PERFORMANCE.md).

## Install

In DSH, open **Plugins → Add plugin**, paste the address, install and enable, then reload when prompted:

```text
https://github.com/yxue301603/dsh-everyday-plugins
```

Prebuilt clients are included: **no user build step or extra API key**. Tested with DSH **0.2.1-rc.3, rc.4 and 0.2.2-alpha.2**. Alpha.2 is a preview release; see the exact scope in [verification notes](docs/VERIFICATION.md).

Already have standalone Quick prompts? Keep it and add other tools individually. **Install each feature once**: choose the collection or non-overlapping individual packages. See the [installation guide](docs/INSTALLATION.md#english-quick-guide) for subdirectory URLs, pinned releases, Desktop/Web profiles and upgrades.

Draft history on its own:

```text
https://github.com/yxue301603/dsh-everyday-plugins#path:/packages/dsh-draft-history
```

## Start with three useful moments

| Situation | Tool | Try this first |
| --- | --- | --- |
| You accidentally cleared a requirement you were writing | **Draft history** | Type a short draft, pause for a second, clear it, then preview and insert its earlier version |
| An answer contains a command or explanation worth keeping | **Answer library** | Click ☆, edit its title and tags, then search or reuse it; export all entries as JSON or Markdown |
| You cannot find an earlier question in a long conversation | **Chat outline** | Search your own questions and return to their context; load older messages explicitly when needed |

## Eight tools, eight everyday jobs

| Plugin directory | What it helps with | Where to open it |
| --- | --- | --- |
| [Quick prompts](packages/dsh-quick-prompts) | Pinned instructions, project scopes, search, variables and recent use | Quick prompts or pinned buttons |
| [Chat outline](packages/dsh-conversation-outline) | Search questions, jump back and resume reading | Outline |
| [Draft history](packages/dsh-draft-history) | Autosaved plain-text history, previews and recovery | Drafts |
| [Answer library](packages/dsh-answer-library) | Saved excerpts, tags, reuse and whole-library backups | ☆ below an answer / Saved |
| [Turn files](packages/dsh-turn-files) | Delivered and recorded changed files by turn; preview, paths, reveal | Files |
| [Task alerts](packages/dsh-task-alerts) | Completion, attention, failure and unread notices | Alerts and its unread badge |
| [Project notes](packages/dsh-project-notes) | Workspace notes, small checklist and Markdown export | Notes |
| [Selection actions](packages/dsh-selection-actions) | Quote a passage and prepare a follow-up, translation or explanation | Ask about selection / Quote |

Wide composers show short tool names. Narrow or split panes use compact icons with full hover labels. This follows the composer's width in either language.

## You decide what gets sent

Insertion preserves the current draft and uses native revision guards. **Plugins never send a message or call a model automatically**. Translation and explanation prepare a request for you to review and send.

Draft history, answers, notes, prompts and alert records stay in browser-local storage for the current DSH origin. There is no external sync server or telemetry. History and file operations use your connected DSH host. System notifications are off until you opt in and grant permission; they show the conversation title.

Practical limits: draft history is plain text, outline search covers loaded questions, file lists depend on recorded native sources, and alerts need a connected client. Different browser origins do not sync automatically. Answer library exports backups but does not import them in this release. See each tool README and the [installation guide](docs/INSTALLATION.md).

## Help improve the everyday experience

If this is useful, **Star the [collection](https://github.com/yxue301603/dsh-everyday-plugins)** to find it again and follow releases. If something gets in your way, [open a feedback form](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose) and tell us what you were trying to do.

Small fixes, translations and compatibility reports are welcome: [Contributing](CONTRIBUTING.md) · [Changelog](CHANGELOG.md) · [Verification](docs/VERIFICATION.md).

```sh
npm ci
npm run check
npm run pack
```

All eight tools are maintained under `packages/`. Same-name standalone repositories remain compatibility sources; feedback is centralized here. Normal installation does not require these development commands.
