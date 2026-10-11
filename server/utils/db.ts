/**
 * 数据访问层（SQLite · better-sqlite3）
 * ------------------------------------------------------------
 * 全项目唯一的 SQL 集中地：
 * - 数据库文件：项目根目录 .data/star.sqlite（已 gitignore，备份 = 拷贝此文件）；
 * - WAL 模式 + 外键约束开启；
 * - 首次启动自动建表，stories 为空时自动把 data/createdStories.ts 的创作内容
 *   灌库（source='editorial'、status='approved'），可安全重复启动（幂等）；
 * - 将来换 MySQL/PostgreSQL 时只改本文件，API 层与页面层不动。
 */
import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { createdStories } from '~/data/createdStories'
import type { Comment, Story } from '~/types/story'

const DATA_DIR = join(process.cwd(), '.data')
const DB_PATH = join(DATA_DIR, 'star.sqlite')

mkdirSync(DATA_DIR, { recursive: true })

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

/* ---------------- Schema ---------------- */
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  nickname      TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'user',      -- user | admin
  created_at    INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS stories (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  content       TEXT NOT NULL,
  category      TEXT NOT NULL,
  tags          TEXT NOT NULL DEFAULT '[]',        -- JSON string[]
  author_name   TEXT NOT NULL,
  author_id     TEXT REFERENCES users(id),
  source        TEXT NOT NULL DEFAULT 'user',      -- editorial | user
  visibility    TEXT NOT NULL DEFAULT 'public',    -- public | private
  status        TEXT NOT NULL DEFAULT 'pending',   -- pending | approved | rejected | withdrawn
  likes         INTEGER NOT NULL DEFAULT 0,
  views         INTEGER NOT NULL DEFAULT 0,
  reject_reason TEXT,
  created_at    INTEGER NOT NULL,
  updated_at    INTEGER
);
CREATE INDEX IF NOT EXISTS idx_stories_status   ON stories(status, visibility);
CREATE INDEX IF NOT EXISTS idx_stories_category ON stories(category);
CREATE INDEX IF NOT EXISTS idx_stories_created  ON stories(created_at DESC);

CREATE TABLE IF NOT EXISTS comments (
  id          TEXT PRIMARY KEY,
  story_id    TEXT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_id   TEXT REFERENCES users(id),
  content     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'visible',     -- visible | hidden
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_comments_story ON comments(story_id, status);

CREATE TABLE IF NOT EXISTS likes (
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  story_id   TEXT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, story_id)
);

CREATE TABLE IF NOT EXISTS bookmarks (
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  story_id   TEXT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, story_id)
);

CREATE TABLE IF NOT EXISTS reports (
  id          TEXT PRIMARY KEY,
  story_id    TEXT REFERENCES stories(id) ON DELETE CASCADE,
  comment_id  TEXT REFERENCES comments(id) ON DELETE CASCADE,
  reporter_id TEXT REFERENCES users(id),
  reason      TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'open',        -- open | resolved | dismissed
  created_at  INTEGER NOT NULL,
  handled_at  INTEGER,
  handled_by  TEXT REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS review_logs (
  id         TEXT PRIMARY KEY,
  story_id   TEXT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  action     TEXT NOT NULL,                        -- approve | reject | withdraw | delete
  admin_id   TEXT REFERENCES users(id),
  note       TEXT,
  created_at INTEGER NOT NULL
);
`)

/* ---------------- 行 ↔ 类型映射 ---------------- */
interface StoryRow {
  id: string
  title: string
  content: string
  category: string
  tags: string
  author_name: string
  author_id: string | null
  source: 'editorial' | 'user'
  visibility: 'public' | 'private'
  status: string
  likes: number
  views: number
  reject_reason: string | null
  created_at: number
  updated_at: number | null
}

interface CommentRow {
  id: string
  story_id: string
  author_name: string
  content: string
  status: string
  created_at: number
}

function rowToComment(r: CommentRow): Comment {
  return { id: r.id, authorName: r.author_name, content: r.content, createdAt: r.created_at }
}

function rowToStory(r: StoryRow, comments: Comment[]): Story {
  return {
    id: r.id,
    title: r.title,
    content: r.content,
    category: r.category,
    tags: JSON.parse(r.tags) as string[],
    authorName: r.author_name,
    createdAt: r.created_at,
    visibility: r.visibility,
    likes: r.likes,
    liked: false,
    comments,
    source: r.source
  }
}

const commentsOfStory = (storyId: string): Comment[] =>
  (db
    .prepare(`SELECT * FROM comments WHERE story_id = ? AND status = 'visible' ORDER BY created_at ASC`)
    .all(storyId) as CommentRow[]).map(rowToComment)

/* ---------------- Seed（幂等：仅在 stories 为空时执行） ---------------- */
function seedIfEmpty() {
  const { n } = db.prepare('SELECT COUNT(*) AS n FROM stories').get() as { n: number }
  if (n > 0 || createdStories.length === 0) return

  const insertStory = db.prepare(`
    INSERT INTO stories (id, title, content, category, tags, author_name, author_id,
                         source, visibility, status, likes, views, created_at, updated_at)
    VALUES (@id, @title, @content, @category, @tags, @author_name, NULL,
            @source, @visibility, 'approved', @likes, 0, @created_at, NULL)
  `)
  const insertComment = db.prepare(`
    INSERT INTO comments (id, story_id, author_name, author_id, content, status, created_at)
    VALUES (@id, @story_id, @author_name, NULL, @content, 'visible', @created_at)
  `)

  const run = db.transaction(() => {
    for (const s of createdStories) {
      insertStory.run({
        id: s.id,
        title: s.title,
        content: s.content,
        category: s.category,
        tags: JSON.stringify(s.tags || []),
        author_name: s.authorName,
        source: s.source,
        visibility: s.visibility,
        likes: s.likes || 0,
        created_at: s.createdAt
      })
      for (const c of s.comments || []) {
        insertComment.run({
          id: c.id,
          story_id: s.id,
          author_name: c.authorName,
          content: c.content,
          created_at: c.createdAt
        })
      }
    }
  })
  run()
  console.log(`[STAR] seed 完成：导入 ${createdStories.length} 篇创作故事`)
}
seedIfEmpty()

/* ---------------- 查询：故事 ---------------- */
export interface StoryListQuery {
  sort?: 'recommended' | 'latest' | 'hot'
  category?: string
  tag?: string
  q?: string
  page?: number
  pageSize?: number
}

export interface StoryListResult {
  stories: Story[]
  total: number
  page: number
  pageSize: number
}

/** 公开列表：仅 approved + public；sort/category/tag/q 全部下推到 SQL */
export function listPublicStories(query: StoryListQuery): StoryListResult {
  const where: string[] = [`status = 'approved'`, `visibility = 'public'`]
  const params: Record<string, unknown> = {}

  if (query.category) {
    where.push('category = @category')
    params.category = query.category
  }
  if (query.tag) {
    // tags 为 JSON 数组文本，按带引号的完整标签匹配，避免子串误命中
    where.push(`tags LIKE @tag ESCAPE '\\'`)
    params.tag = `%"${query.tag.replace(/[%_\\]/g, (m) => `\\${m}`)}"%`
  }
  if (query.q) {
    where.push('(title LIKE @q OR content LIKE @q)')
    params.q = `%${query.q.replace(/[%_\\]/g, (m) => `\\${m}`)}%`
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const orderSql =
    query.sort === 'hot'
      ? 'ORDER BY likes DESC, created_at DESC'
      : query.sort === 'recommended'
        ? 'ORDER BY (views + likes * 10) DESC, created_at DESC'
        : 'ORDER BY created_at DESC'

  const { total } = db
    .prepare(`SELECT COUNT(*) AS total FROM stories ${whereSql}`)
    .get(params) as { total: number }

  const page = Math.max(1, query.page ?? 1)
  const pageSize = Math.min(200, Math.max(1, query.pageSize ?? (total || 1)))
  const rows = db
    .prepare(`SELECT * FROM stories ${whereSql} ${orderSql} LIMIT @limit OFFSET @offset`)
    .all({ ...params, limit: pageSize, offset: (page - 1) * pageSize }) as StoryRow[]

  return {
    stories: rows.map((r) => rowToStory(r, commentsOfStory(r.id))),
    total,
    page,
    pageSize
  }
}

/** 公开详情：仅 approved + public；找不到一律返回 null（由 API 层转 404） */
export function getPublicStory(id: string): Story | null {
  const row = db
    .prepare(`SELECT * FROM stories WHERE id = ? AND status = 'approved' AND visibility = 'public'`)
    .get(id) as StoryRow | undefined
  if (!row) return null
  return rowToStory(row, commentsOfStory(row.id))
}

/** 健康检查用 */
export function dbPing(): boolean {
  try {
    db.prepare('SELECT 1').get()
    return true
  } catch {
    return false
  }
}
