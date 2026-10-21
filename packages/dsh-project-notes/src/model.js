export const LIMITS = Object.freeze({ workspaces: 60, note: 48000, tasks: 150, task: 2000, total: 800000 });
export const initial = { version: 1, projects: [] };
export function normalize(data) {
  if (!data || data.version !== 1 || !Array.isArray(data.projects) || data.projects.length > LIMITS.workspaces) throw new Error('Invalid project notes data / 便笺格式无效');
  let total = 0;
  const projects = data.projects.map(project => {
    if (!project || typeof project.workspace !== 'string' || typeof project.note !== 'string' || project.note.length > LIMITS.note || !Array.isArray(project.tasks) || project.tasks.length > LIMITS.tasks) throw new Error('Invalid project note / 项目便笺格式无效');
    total += project.note.length;
    const tasks = project.tasks.map(task => {
      if (!task || typeof task.id !== 'string' || typeof task.text !== 'string' || task.text.length > LIMITS.task || typeof task.done !== 'boolean') throw new Error('Invalid task / 待办格式无效');
      total += task.text.length;
      return { id: task.id, text: task.text, done: task.done, created: Number(task.created) || 0 };
    });
    return { workspace: project.workspace, note: project.note, tasks, updated: Number(project.updated) || 0 };
  });
  if (total > LIMITS.total) throw new Error('Notes storage limit reached; export or remove old notes / 便笺总量已达上限，请先导出或删除旧内容');
  return { version: 1, projects };
}
export function projectFor(data, workspace) {
  return data.projects.find(item => item.workspace === workspace) ?? { workspace, note: '', tasks: [], updated: 0 };
}
export function changeProject(data, workspace, updater, now = Date.now()) {
  const previous = projectFor(data, workspace);
  const updated = { ...updater(previous), workspace, updated: now };
  const others = data.projects.filter(item => item.workspace !== workspace);
  if (!data.projects.some(item => item.workspace === workspace) && others.length >= LIMITS.workspaces) throw new Error('At most 60 project notebooks; remove one first / 最多保存 60 个项目便笺，请先删除一个');
  return normalize({ ...data, projects: [updated, ...others] });
}
export function newTask(text, now = Date.now()) {
  const cleaned = text.trim();
  if (!cleaned || cleaned.length > LIMITS.task) throw new Error('A task needs 1–2,000 characters / 待办需要 1–2,000 个字符');
  return { id: `${now}-${Math.random().toString(36).slice(2, 10)}`, text: cleaned, done: false, created: now };
}
export function markdown(project, heading = 'Project notes') {
  return `# ${heading}\n\n${project.note}\n\n## Tasks\n\n${project.tasks.map(task => `- [${task.done ? 'x' : ' '}] ${task.text.replace(/\r?\n/g, ' ')}`).join('\n')}\n`;
}
