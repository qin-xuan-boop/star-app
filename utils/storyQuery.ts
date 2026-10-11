import type { SortKey, Story } from '~/types/story'

// 热度分：共鸣 + 评论权重（本地演示口径；正式版由后端排序）
export function storyScore(s: Story): number {
  return (s.likes || 0) + (s.comments ? s.comments.length * 1.5 : 0)
}

/**
 * 排序故事列表
 * - latest：最新优先
 * - hot：热度 > 0，按热度排序
 * - recommended（默认）：本机互动多的优先，其次按时间倒序
 */
export function sortStories(list: Story[], sort: SortKey | string): Story[] {
  const arr = list.slice()
  if (sort === 'latest') {
    arr.sort((a, b) => b.createdAt - a.createdAt)
  } else if (sort === 'hot') {
    arr.sort((a, b) => storyScore(b) - storyScore(a) || b.createdAt - a.createdAt)
    return arr.filter((s) => storyScore(s) > 0)
  } else {
    arr.sort((a, b) => {
      const sa = storyScore(a)
      const sb = storyScore(b)
      if (sb !== sa) return sb - sa
      return b.createdAt - a.createdAt
    })
  }
  return arr
}

// 关键词搜索：标题 / 正文 / 分类 / 标签
export function matchKeyword(s: Story, kw: string): boolean {
  const k = kw.toLowerCase()
  return (
    s.title.toLowerCase().includes(k) ||
    s.content.toLowerCase().includes(k) ||
    s.category.toLowerCase().includes(k) ||
    s.tags.some((t) => t.toLowerCase().includes(k))
  )
}

// 相关推荐权重：同分类 +2，共享标签每个 +1
export function relatedWeight(s: Story, current: Story): number {
  let weight = 0
  if (s.category === current.category) weight += 2
  s.tags.forEach((t) => {
    if (current.tags.includes(t)) weight += 1
  })
  return weight
}
