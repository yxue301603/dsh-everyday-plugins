export const MAX_QUOTE = 12000;
export function quoteDraft(text, action, question, language = '中文', english = false) {
  const quote = String(text ?? '').trim();
  if (!quote || quote.length > MAX_QUOTE) throw new Error('quote-size');
  const instruction = action === 'translate'
    ? (english ? `Translate the quoted text into ${language || 'English'}, preserving meaning and formatting.` : `请将以下引用内容翻译为${language || '中文'}，保留原意与排版。`)
    : action === 'explain'
      ? (english ? 'Explain the quoted text clearly, including any relevant assumptions and examples.' : '请解释以下引用内容，说明关键概念、适用前提，并给出容易理解的例子。')
      : String(question ?? '').trim();
  if (!instruction) throw new Error('question-empty');
  return `${instruction}\n\n${english ? 'Quoted source (reference material):' : '引用原文（供参考）：'}\n${quote.split(/\r?\n/).map(line => `> ${line}`).join('\n')}`;
}

export function cleanSelection(text) {
  return String(text ?? '').replace(/\u0000/g, '').trim();
}
