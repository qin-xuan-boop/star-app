import { devStories } from '~/data/devStories'
import { randomAuthorName, uid } from '~/utils/id'
import type { Comment, Story, StoryInput } from '~/types/story'

/**
 * 故事数据服务层（P1：创作故事已接入后端数据库）
 * ------------------------------------------------------------------
 * 数据来源：
 * - 创作故事（星辰故事集）：SSR 期间由 plugins/stories.ts 从 SQLite 经
 *   /api/stories 载入 useState('editorialStories')，随 hydration 同步到客户端；
 * - localStorage 中的本机投稿 / 收藏 / 互动仅在客户端、app 挂载后载入；
 *   （P2/P3 将迁移为登录态 + 服务端持久化）
 * - ?demo=1 的测试数据只存在于客户端内存，绝不落盘，刷新即还原。
 */

const KEYS = {
  stories: 'star.stories.v2',
  bookmarks: 'star.bookmarks.v2',
  interactions: 'star.interactions.v2'
}

/** 创作故事（非本机投稿）的本机互动状态：点赞 + 评论 */
interface Interaction {
  liked?: boolean
  likes?: number
  comments?: Comment[]
}

function readList<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch (err) {
    console.warn('[STAR] 读取本地数据失败：', err)
    return []
  }
}

function readMap<T>(key: string): Record<string, T> {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as Record<string, T>) : {}
  } catch (err) {
    console.warn('[STAR] 读取本地数据失败：', err)
    return {}
  }
}

function write(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (err) {
    console.warn('[STAR] 写入本地数据失败：', err)
    return false
  }
}

export const useStories = () => {
  const route = useRoute()

  // 创作故事（服务端 SQLite，SSR 载入）；本机投稿（含私密）；收藏 id；本机互动；是否已完成客户端载入
  const editorialStories = useState<Story[]>('editorialStories', () => [])
  const localStories = useState<Story[]>('localStories', () => [])
  const bookmarks = useState<string[]>('bookmarks', () => [])
  const interactions = useState<Record<string, Interaction>>('interactions', () => ({}))
  const localReady = useState<boolean>('localReady', () => false)
  // demo 测试数据的可变内存副本
  const devRuntime = useState<Story[]>('devRuntime', () => [])
  // demo 会话内存标志：从任意页面带 ?demo=1 进入即开启，仅存活于本次 SPA 会话，
  // 不写入 localStorage / sessionStorage；刷新或打开干净 URL 即回到正式模式，
  // 测试故事及其点赞 / 评论也始终只存在于内存。
  const demoFlag = useState<boolean>('demoFlag', () => false)

  const isDemo = computed(() => route.query.demo === '1' || demoFlag.value)

  /** 客户端启动时从 localStorage 载入（由 plugin 在 app:mounted 后调用） */
  function loadLocal() {
    if (localReady.value || !import.meta.client) return
    // 以 URL 为初始开关：本次会话内保持，便于在列表 / 详情间连续检查排版
    if (route.query.demo === '1') demoFlag.value = true
    localStories.value = readList<Story>(KEYS.stories)
    bookmarks.value = readList<string>(KEYS.bookmarks)
    interactions.value = readMap<Interaction>(KEYS.interactions)
    if (isDemo.value) {
      devRuntime.value = devStories.map((s) => ({ ...s, likes: 0, liked: false, comments: [] }))
    }
    localReady.value = true
  }

  /** 把本机互动（点赞 / 评论）合并到静态创作故事上 */
  function decorate(s: Story): Story {
    const it = interactions.value[s.id]
    if (!it) return s
    return {
      ...s,
      liked: it.liked ?? s.liked,
      likes: it.likes ?? s.likes,
      comments: it.comments ?? s.comments
    }
  }

  /** 全部故事（顺序：demo → 本机投稿 → 创作故事） */
  const allStories = computed<Story[]>(() => {
    const base: Story[] = editorialStories.value.map(decorate)
    if (import.meta.client && localReady.value) {
      base.unshift(...localStories.value)
      if (isDemo.value) base.unshift(...devRuntime.value)
    }
    return base
  })

  /** 公开故事（私密故事不进入任何公开列表） */
  function publicStories(): Story[] {
    return allStories.value.filter((s) => s.visibility !== 'private')
  }

  function getStoryById(id: string | string[] | undefined | null): Story | null {
    if (id == null) return null
    const key = Array.isArray(id) ? id[0] : id
    return allStories.value.find((s) => s.id === key) || null
  }

  /* ---------------- 投稿 ---------------- */
  function createStory(input: StoryInput): { ok: boolean; story: Story } {
    const story: Story = {
      id: uid('s'),
      title: input.title.trim(),
      content: input.content.trim(),
      category: input.category,
      tags: input.tags || [],
      authorName: input.authorName.trim() || randomAuthorName(),
      createdAt: Date.now(),
      visibility: input.visibility || 'public',
      likes: 0,
      liked: false,
      comments: [],
      source: 'user'
    }
    localStories.value = [story, ...localStories.value]
    const ok = write(KEYS.stories, localStories.value)
    return { ok, story }
  }

  function deleteStory(id: string) {
    localStories.value = localStories.value.filter((s) => s.id !== id)
    write(KEYS.stories, localStories.value)
    bookmarks.value = bookmarks.value.filter((bid) => bid !== id)
    write(KEYS.bookmarks, bookmarks.value)
  }

  /* ---------------- 共鸣（点赞） ---------------- */
  function toggleLike(id: string): { liked: boolean; likes: number } | null {
    // demo 测试故事：只改内存
    const dev = devRuntime.value.find((s) => s.id === id)
    if (dev) {
      dev.liked = !dev.liked
      dev.likes += dev.liked ? 1 : -1
      return { liked: dev.liked, likes: dev.likes }
    }
    // 本机投稿：改故事对象并落盘
    const mine = localStories.value.find((s) => s.id === id)
    if (mine) {
      mine.liked = !mine.liked
      mine.likes = (mine.likes || 0) + (mine.liked ? 1 : -1)
      write(KEYS.stories, localStories.value)
      return { liked: mine.liked, likes: mine.likes }
    }
    // 创作故事：改本机互动表并落盘
    const it = interactions.value[id] || {}
    const liked = !(it.liked ?? false)
    const baseLikes = editorialStories.value.find((s) => s.id === id)?.likes || 0
    const likes = liked ? baseLikes + 1 : baseLikes
    interactions.value = {
      ...interactions.value,
      [id]: { ...it, liked, likes }
    }
    write(KEYS.interactions, interactions.value)
    return { liked, likes }
  }

  /* ---------------- 收藏 ---------------- */
  function isBookmarked(id: string): boolean {
    return bookmarks.value.includes(id)
  }

  function toggleBookmark(id: string): boolean {
    const idx = bookmarks.value.indexOf(id)
    if (idx === -1) bookmarks.value = [...bookmarks.value, id]
    else bookmarks.value = bookmarks.value.filter((bid) => bid !== id)
    write(KEYS.bookmarks, bookmarks.value)
    return idx === -1 // true=最新为已收藏
  }

  /* ---------------- 评论（本地演示） ---------------- */
  function addComment(storyId: string, data: { authorName?: string; content: string }): Comment | null {
    const comment: Comment = {
      id: uid('c'),
      authorName: (data.authorName || '').trim() || '匿名星友',
      content: data.content.trim(),
      createdAt: Date.now()
    }
    const dev = devRuntime.value.find((s) => s.id === storyId)
    if (dev) {
      dev.comments = [...(dev.comments || []), comment]
      return comment
    }
    const mine = localStories.value.find((s) => s.id === storyId)
    if (mine) {
      mine.comments = [...(mine.comments || []), comment]
      write(KEYS.stories, localStories.value)
      return comment
    }
    if (editorialStories.value.some((s) => s.id === storyId)) {
      const it = interactions.value[storyId] || {}
      const next = { ...it, comments: [...(it.comments || []), comment] }
      interactions.value = { ...interactions.value, [storyId]: next }
      write(KEYS.interactions, interactions.value)
      return comment
    }
    return null
  }

  function removeComment(storyId: string, commentId: string) {
    const dev = devRuntime.value.find((s) => s.id === storyId)
    if (dev) {
      dev.comments = (dev.comments || []).filter((c) => c.id !== commentId)
      return
    }
    const mine = localStories.value.find((s) => s.id === storyId)
    if (mine) {
      mine.comments = (mine.comments || []).filter((c) => c.id !== commentId)
      write(KEYS.stories, localStories.value)
      return
    }
    const it = interactions.value[storyId]
    if (it?.comments) {
      const next = { ...it, comments: it.comments.filter((c) => c.id !== commentId) }
      interactions.value = { ...interactions.value, [storyId]: next }
      write(KEYS.interactions, interactions.value)
    }
  }

  return {
    localReady,
    isDemo,
    loadLocal,
    allStories,
    publicStories,
    getStoryById,
    createStory,
    deleteStory,
    toggleLike,
    isBookmarked,
    toggleBookmark,
    addComment,
    removeComment,
    bookmarkIds: bookmarks
  }
}
