# Turn files

Find delivered files and successful file changes in one place, grouped by conversation turn.

Open **Turn files** beside the composer. Search filenames, paths or descriptions; filter deliverables, recorded changes or tool writes; copy individual or all matching paths; preview files in DSH's native sidebar. Native deliverables and change records can be revealed in the desktop file manager when the host supports it. Missing files and unsupported actions show explicit errors.

Uses native `deliverables/presented` and `workspace/changes` events plus successful `write`, `edit` and `str_replace_editor` calls. Reads, failed writes and arbitrary prose paths are excluded. Files created solely through terminal commands may be absent unless presented or recorded as changed. Only loaded conversation history is shown; use **Load earlier turns** for older records.

Supports English/Chinese and dark/light themes. No shell commands, model calls or external network transmission. File-manager actions use official event coordinates and host-side permission checks rather than executing model-provided paths.

See the collection's release instructions for standalone installation. Requires DSH `0.2.1-rc.2` or compatible, with native deliverables and sidebar capabilities.
