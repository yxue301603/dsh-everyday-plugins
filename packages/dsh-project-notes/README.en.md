# Project Notes

> An individual tool from [DSH Everyday](https://github.com/yxue301603/dsh-everyday-plugins) · [All demos](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/docs/GALLERY.md) · [Shared issue tracker](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose)

**Keep requirements, errors and next steps in notes and a small checklist for each workspace.**

![项目便笺 / Project notes](https://raw.githubusercontent.com/yxue301603/dsh-everyday-plugins/main/docs/media/dsh-project-notes-dark.png)

Actual plugin components, isolated test host, synthetic content.

A local notebook and a lightweight checklist for each DeepSeek Harness workspace. Capture requirements, errors and ideas, then insert the useful parts into a draft when you want to discuss them.

## Install and use

Open **Plugins → Add plugin** in DSH and enter the following GitHub repository URL (or a local package directory). Enable and reload when requested. Requires DSH **0.2.1-rc.2 or a newer 0.2.x version**.

```text
https://github.com/yxue301603/dsh-everyday-plugins#path:/packages/dsh-project-notes
```

For collection installation, migration and upgrades, see the [installation guide](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/docs/INSTALLATION.md#english-quick-guide).

Open **Project notes** beside the composer. The current workspace path appears at the top. Conversations in the same workspace share a notebook; different paths have separate notebooks. Without a workspace, a general notebook is used. Windows path case and trailing slashes are normalized.

- **Notes** autosave locally. Copy or insert the entire note or a selection. Insertion preserves the native selected text and never sends a message.
- **Tasks** support Enter to add, completion checkboxes, editing, open/done/all filters and progress. Undo the most recently deleted task.
- Insert one task into the draft using official composer actions, keeping existing attachments and references.
- Export the note and tasks to Markdown, including any unsaved note text.
- Clearing notebooks, removing completed tasks and deleting old workspace records require confirmation.

## Data and limits

Only text and completion state are stored in local browser storage for the current DSH origin. No model calls, uploads, credential reads or project-file scanning. Workspace paths only group records. Moving a project does not move its notebook automatically: export and paste into the new workspace if needed.

Up to 60 workspaces, 48,000 note characters per workspace, 150 tasks per workspace, 2,000 characters per task and approximately 800,000 characters overall. Limits produce an error rather than deleting old notes. Different browsers, origins and devices do not synchronize automatically.

If a write fails, the current note remains in memory and can be retried, copied or exported; quitting DSH loses unsaved in-memory edits. Corrupt local records are not silently reset. Clearing DSH site data removes plugin records. Includes Chinese, English and dark/light theme support.

## Feedback and releases

Use the [shared issue tracker](https://github.com/yxue301603/dsh-everyday-plugins/issues/new/choose) and select this tool. [Pinned downloads and checksums](https://github.com/yxue301603/dsh-everyday-plugins/releases/tag/v0.1.1) · [Contributing](https://github.com/yxue301603/dsh-everyday-plugins/blob/main/CONTRIBUTING.md). The same-name standalone repository remains a compatibility source.
