// 生成故事摘要：取正文前 90 个字符（按纯文本，不解析 HTML）
export function makeExcerpt(content: string, len = 90): string {
  const text = content.replace(/\s+/g, ' ').trim()
  return text.length > len ? `${text.slice(0, len)}…` : text
}
