// 本地演示用的唯一 id（后端接入后由服务端生成）
export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

// 投稿时未填昵称的兜底生成
export function randomAuthorName(): string {
  return '星辰旅人·' + Math.floor(1000 + Math.random() * 9000)
}
