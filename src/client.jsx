import * as prompts from '../packages/dsh-quick-prompts/src/client.jsx';
import * as outline from '../packages/dsh-conversation-outline/src/client.jsx';
import * as drafts from '../packages/dsh-draft-history/src/client.jsx';
import * as library from '../packages/dsh-answer-library/src/client.jsx';
import * as files from '../packages/dsh-turn-files/src/client.jsx';
import * as alerts from '../packages/dsh-task-alerts/src/client.jsx';
import * as notes from '../packages/dsh-project-notes/src/client.jsx';
import * as selection from '../packages/dsh-selection-actions/src/client.jsx';
export const name = 'dsh-everyday-plugins';
export const inject = ['slots', 'locale', 'sessions'];
export function apply(ctx) {
  for (const plugin of [prompts, outline, drafts, library, files, alerts, notes, selection]) plugin.apply(ctx);
}
