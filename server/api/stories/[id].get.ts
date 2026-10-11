/**
 * GET /api/stories/:id
 * 公开故事详情（仅 approved + public）；私密 / 待审 / 不存在统一 404，不泄露存在性。
 */
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const story = id ? getPublicStory(id) : null
  if (!story) {
    throw createError({ statusCode: 404, statusMessage: '故事不存在或未公开' })
  }
  return story
})
