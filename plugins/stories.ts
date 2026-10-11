import type { Story } from '~/types/story'

/**
 * 创作故事（星辰故事集）首屏数据载入
 * ------------------------------------------------------------
 * SSR 期间从服务端接口取回全部公开故事写入 useState，
 * 随 hydration payload 带到客户端，保证：
 * - 首屏 HTML 含完整故事内容（SEO 与独立 URL 不变）；
 * - 客户端 hydration 数据一致，不出现 mismatch；
 * - useStories 组合式函数与全部页面保持同步接口，零改动。
 */
export default defineNuxtPlugin(async () => {
  const editorial = useState<Story[]>('editorialStories', () => [])
  if (import.meta.server) {
    try {
      const res = await $fetch<{ stories: Story[] }>('/api/stories', { query: { all: '1' } })
      editorial.value = res.stories
    } catch (err) {
      console.error('[STAR] 创作故事首屏载入失败：', err)
      editorial.value = []
    }
  }
})
