import type { StoryListQuery } from '~/server/utils/db'

/**
 * GET /api/stories
 * 公开故事列表（仅 approved + public）。
 * query: sort=recommended|latest|hot, category, tag, q, page, pageSize, all=1（取全部，供 SSR 首屏）
 */
export default defineEventHandler((event) => {
  const q = getQuery(event)

  const sortRaw = String(q.sort || 'latest')
  const sort = (['recommended', 'latest', 'hot'] as const).includes(sortRaw as never)
    ? (sortRaw as StoryListQuery['sort'])
    : 'latest'

  const toPosInt = (v: unknown): number | undefined => {
    const n = Number(v)
    return Number.isInteger(n) && n > 0 ? n : undefined
  }

  const all = q.all === '1'
  const query: StoryListQuery = {
    sort,
    category: q.category ? String(q.category).slice(0, 20) : undefined,
    tag: q.tag ? String(q.tag).slice(0, 30) : undefined,
    q: q.q ? String(q.q).slice(0, 100) : undefined,
    page: toPosInt(q.page) ?? 1,
    pageSize: all ? 200 : toPosInt(q.pageSize) ?? 20
  }

  return listPublicStories(query)
})
