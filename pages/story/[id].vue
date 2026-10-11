<script setup lang="ts">
import type { Story } from '~/types/story'
import { EDITORIAL_NOTE } from '~/data/brand'

const route = useRoute()
const {
  localReady,
  getStoryById,
  publicStories,
  toggleLike,
  isBookmarked,
  toggleBookmark,
  addComment,
  removeComment
} = useStories()
const { toast } = useToast()
const { openModal } = useModal()

const id = computed(() => route.params.id as string)
const story = computed<Story | null>(() => getStoryById(id.value))

// 页面标题 / 描述随故事更新（SSR 即可输出，利于 SEO）
useHead(
  computed(() =>
    story.value
      ? {
          title: story.value.title,
          meta: [{ name: 'description', content: makeExcerpt(story.value.content, 120) }]
        }
      : { title: '故事不存在' }
  )
)

const bookmarked = computed(() => (story.value ? isBookmarked(story.value.id) : false))
const beating = ref(false)

function onLike() {
  if (!story.value) return
  const r = toggleLike(story.value.id)
  if (!r) return
  beating.value = true
  setTimeout(() => (beating.value = false), 500)
  toast(r.liked ? '已送出共鸣（本机演示）' : '已收回共鸣', r.liked ? 'success' : '')
}

function onBookmark() {
  if (!story.value) return
  const b = toggleBookmark(story.value.id)
  toast(b ? '已加入收藏（本机演示）' : '已取消收藏', b ? 'success' : '')
}

async function onShare() {
  if (!story.value) return
  const url = window.location.href
  if (navigator.share) {
    try {
      await navigator.share({ title: story.value.title, text: '在 STAR 星辰读到一个故事', url })
    } catch {
      /* 用户取消，不处理 */
    }
  } else {
    try {
      await navigator.clipboard.writeText(url)
      toast('故事链接已复制，可粘贴分享', 'success')
    } catch {
      window.prompt('复制下面的链接进行分享：', url)
    }
  }
}

function onReport() {
  openModal({
    title: '举报这篇故事',
    body: [
      '举报功能需要后端与审核流程支持，当前版本暂未接入。',
      '正式版上线时，举报将直达内容审核团队，并对举报内容与处理结果保密。在此之前，如遇紧急问题，请通过「关于星辰」页面预留的联系方式反馈。'
    ],
    actions: [{ label: '我知道了', primary: true }]
  })
}

// 评论（本地演示）
const commentText = ref('')
const commentName = ref('')
function submitComment() {
  if (!story.value) return
  const content = commentText.value.trim()
  if (content.length < 2) return toast('回应至少写两个字吧', 'error')
  if (content.length > 500) return toast('回应请控制在 500 字以内', 'error')
  addComment(story.value.id, { authorName: commentName.value, content })
  commentText.value = ''
  toast('回应已保存在本机（演示）', 'success')
}

// 相关推荐：同分类优先，其次共享标签；最多 3 篇
const related = computed<Story[]>(() => {
  if (!story.value) return []
  return publicStories()
    .filter((s) => s.id !== story.value!.id)
    .map((s) => ({ s, w: relatedWeight(s, story.value!) }))
    .filter((x) => x.w > 0)
    .sort((a, b) => b.w - a.w || b.s.createdAt - a.s.createdAt)
    .slice(0, 3)
    .map((x) => x.s)
})
</script>

<template>
  <div>
    <!-- ========== 故事正文 ========== -->
    <template v-if="story">
      <div class="container">
        <NuxtLink class="story-back" to="/discover">
          <AppIcon name="back" :size="15" /> 返回发现故事
        </NuxtLink>
      </div>

      <article class="story-article">
        <div>
          <span class="cat-chip">{{ story.category }}</span>
          <span v-if="story.source === 'editorial'" class="editorial-chip">星辰故事集</span>
          <span v-if="story._dev" class="dev-flag" style="margin-left: 8px">测试数据</span>
        </div>

        <h1>{{ story.title }}</h1>

        <div class="story-meta">
          <span class="author">
            <span class="author-avatar">{{ story.authorName.charAt(0) }}</span>
            {{ story.authorName }}
          </span>
          <span class="meta-sep">·</span>
          <span>{{ formatTime(story.createdAt) }}</span>
        </div>

        <div v-if="story.tags.length" class="tag-row story-tags">
          <TagChip
            v-for="t in story.tags"
            :key="t"
            :text="t"
            :to="`/discover?tag=${encodeURIComponent(t)}`"
          />
        </div>

        <!-- 创作内容显著标注 -->
        <div v-if="story.source === 'editorial'" class="editorial-note">
          <AppIcon name="alert" :size="17" />
          <span>{{ EDITORIAL_NOTE }}</span>
        </div>

        <!-- 正文：Vue 文本插值自动转义，配合 pre-wrap 保留换行，杜绝 XSS -->
        <div class="story-content">{{ story.content }}</div>

        <div class="story-sign">星辰收信处 · 已收录</div>

        <div class="action-bar">
          <button
            type="button"
            class="action-btn"
            :class="{ 'is-active': story.liked }"
            @click="onLike"
          >
            <AppIcon
              :name="story.liked ? 'heart-fill' : 'heart'"
              :size="17"
              :class="{ 'heart-beat': beating }"
            />
            <span>共鸣</span>
            <span v-if="story.likes" class="count">{{ story.likes }}</span>
          </button>

          <button
            type="button"
            class="action-btn is-gold"
            :class="{ 'is-active': bookmarked }"
            @click="onBookmark"
          >
            <AppIcon :name="bookmarked ? 'bookmark-fill' : 'bookmark'" :size="17" />
            <span>{{ bookmarked ? '已收藏' : '收藏' }}</span>
          </button>

          <button type="button" class="action-btn" @click="onShare">
            <AppIcon name="share" :size="17" />
            <span>分享</span>
          </button>
        </div>

        <div class="story-report">
          <button type="button" @click="onReport">
            <AppIcon name="flag" :size="14" /> 举报这篇故事
          </button>
        </div>
      </article>

      <!-- ========== 评论区 ========== -->
      <section class="comments-section">
        <h2><AppIcon name="comment" :size="20" /> 回应区</h2>
        <p class="section-sub">读完这个故事，你有什么想说的？请保持善意。</p>

        <div class="local-demo-tip">
          <AppIcon name="alert" :size="17" />
          <span>
            以下评论为<b>本地演示</b>：仅保存在你当前的浏览器中，不会公开发布，作者和其他用户都看不到。正式评论功能需后端接入并配合内容审核。
          </span>
        </div>

        <div class="comment-form">
          <textarea
            v-model="commentText"
            placeholder="读完这个故事，你有什么想说的？善意的回应，会让认真讲述的人感到温暖。"
          ></textarea>
          <div class="comment-form-foot">
            <input
              v-model="commentName"
              class="comment-name"
              maxlength="16"
              placeholder="你的昵称（选填）"
            />
            <BaseButton variant="primary" size="sm" @click="submitComment">留下回应</BaseButton>
          </div>
        </div>

        <div class="comment-list">
          <div v-if="!story.comments.length" class="empty-state" style="padding: 36px 24px">
            <p style="margin-bottom: 0">还没有回应。第一句善意，也许就来自你。</p>
          </div>
          <div v-for="c in story.comments" :key="c.id" class="comment-item">
            <span class="author-avatar">{{ c.authorName.charAt(0) }}</span>
            <div class="comment-body">
              <div class="comment-head">
                <b>{{ c.authorName }}</b>
                <span>{{ formatTime(c.createdAt) }}</span>
                <button type="button" class="comment-remove" @click="removeComment(story.id, c.id)">
                  删除（本机演示）
                </button>
              </div>
              <div class="comment-text">{{ c.content }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- ========== 相关推荐 ========== -->
      <section class="related-section">
        <h2>继续阅读</h2>
        <EmptyState v-if="!related.length" scene="noRelated" />
        <RelatedList v-else :stories="related" />
      </section>
    </template>

    <!-- 客户端尚未载入本机数据：先显示读取中，避免把本地故事误判为不存在 -->
    <div v-else-if="!localReady" class="container" style="padding: 96px 24px; text-align: center; color: var(--text-2)">
      正在读取故事…
    </div>

    <!-- 确实不存在 -->
    <div v-else class="container" style="padding-top: 32px; padding-bottom: 96px">
      <NuxtLink class="story-back" to="/discover">
        <AppIcon name="back" :size="15" /> 返回发现故事
      </NuxtLink>
      <EmptyState scene="missing" />
    </div>
  </div>
</template>
