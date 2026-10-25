export const owner = 'yxue301603';
export const collection = 'dsh-everyday-plugins';
export const plugins = [
  { name: 'dsh-quick-prompts', keywords: ["prompts","shortcuts"], title: '常用指令快捷面板', en: 'Quick prompts', description: '置顶、搜索和插入常用指令。', existing: true, version: '0.1.3' },
  { name: 'dsh-conversation-outline', keywords: ["chat-history","navigation"], title: '对话目录', en: 'Conversation outline', description: '搜索用户提问，跳转原文并保存阅读位置。', icon: '≡' },
  { name: 'dsh-draft-history', keywords: ["draft-recovery","autosave"], title: '草稿历史', en: 'Draft history', description: '自动记录会话草稿、预览历史和安全恢复。', icon: '↶' },
  { name: 'dsh-answer-library', keywords: ["bookmarks","markdown","local-backup"], title: '回答收藏', en: 'Answer library', description: '保存回答与摘录，按标签检索，复制或插入草稿。', icon: '☆' },
  { name: 'dsh-turn-files', keywords: ["files","artifacts"], title: '本轮文件', en: 'Turn files', description: '按轮次查看生成或修改的文件，复制路径并预览。', icon: '▱' },
  { name: 'dsh-task-alerts', keywords: ["notifications","task-status"], title: '任务提醒', en: 'Task alerts', description: '区分完成、待确认与失败，后台提醒并返回会话。', icon: '♧' },
  { name: 'dsh-project-notes', keywords: ["notes","todo","workspace"], title: '项目便笺', en: 'Project notes', description: '工作区便笺、轻量待办、自动保存与草稿插入。', icon: '▤' },
  { name: 'dsh-selection-actions', keywords: ["text-selection","quotations"], title: '选文操作', en: 'Selection actions', description: '选中回答后引用追问、解释或翻译，预览后填入草稿。', icon: '⌁' },
];
