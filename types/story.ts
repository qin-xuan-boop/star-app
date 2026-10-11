// 故事与评论的数据模型（前后端共用的字段约定）
// 后端接入后，接口返回结构应与本文件保持一致；页面只依赖数据服务层，不直接请求。

export type StorySource = 'editorial' | 'user' // editorial=星辰故事集（编辑创作）；user=真实/本地投稿
export type Visibility = 'public' | 'private'

export interface Comment {
  id: string
  authorName: string
  content: string
  createdAt: number
}

export interface Story {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  authorName: string
  createdAt: number
  visibility: Visibility
  likes: number
  liked: boolean
  comments: Comment[]
  /** 内容来源轨道：创作内容 vs 用户投稿，用于分轨与标注 */
  source: StorySource
  /** 开发测试数据标记（仅 ?demo=1 的内存数据，不落盘） */
  _dev?: boolean
}

/** 创建故事时的入参（用户投稿表单） */
export interface StoryInput {
  title: string
  content: string
  category: string
  tags: string[]
  authorName: string
  visibility: Visibility
}

export type SortKey = 'recommended' | 'latest' | 'hot' | 'bookmarks'
