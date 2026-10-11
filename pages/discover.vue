<script setup lang="ts">
import type { Story } from '~/types/story'
import { CATEGORIES } from '~/data/categories'
import { TAGS } from '~/data/tags'

useHead({
  title: '发现故事',
  meta: [
    {
      name: 'description',
      content:
        '在 STAR 星辰发现页按推荐、最新、热门浏览情感故事，可按情感分类、标签筛选，或搜索故事标题与正文中的关键词。'
    }
  ]
})

const route = useRoute()
const router = useRouter()
const { publicStories, getStoryById, bookmarkIds } = useStories()

// 状态从 URL 初始化（首页分类 / 标签 / 搜索入口可直接跳入）
const VALID_SORTS = ['recommended', 'latest', 'hot', 'bookmarks']
const initialSort = () => {
  const s = route.query.sort as string
  return VALID_SORTS.includes(s) ? s : 'recommended'
}
const sort = ref(initialSort())
const cat = ref((route.query.cat as string) || '')
const tag = ref((route.query.tag as string) || '')
const q = ref((route.query.q as string) || '')

const sortTabs = [
  { key: 'recommended', label: '推荐' },
  { key: 'latest', label: '最新' },
  { key: 'hot', label: '热门' },
  { key: 'bookmarks', label: '我的收藏' }
]

// 状态变化同步到 URL（替换历史，不产生多余记录）
function syncUrl() {
  const query: Record<string, string> = {}
  if (sort.value !== 'recommended') query.sort = sort.value
  if (cat.value) query.cat = cat.value
  if (tag.value) query.tag = tag.value
  if (q.value) query.q = q.value
  router.replace({ path: '/discover', query })
}
watch([sort, cat, tag, q], syncUrl)

function catValue(c: string) {
  return c === '全部故事' ? '' : c
}
function toggleTag(t: string) {
  tag.value = tag.value === t ? '' : t
}

// 当前筛选条件 chips
const chips = computed(() => {
  const list: { type: 'cat' | 'tag' | 'q'; label: string }[] = []
  if (cat.value) list.push({ type: 'cat', label: `分类：${cat.value}` })
  if (tag.value) list.push({ type: 'tag', label: `标签：${tag.value}` })
  if (q.value) list.push({ type: 'q', label: `搜索：${q.value}` })
  return list
})

function removeFilter(type: 'cat' | 'tag' | 'q') {
  if (type === 'cat') cat.value = ''
  if (type === 'tag') tag.value = ''
  if (type === 'q') q.value = ''
}
function clearAll() {
  cat.value = ''
  tag.value = ''
  q.value = ''
}

// 取数：收藏走本机收藏 id；其余走公开列表 + 排序 + 筛选 + 关键词
const stories = computed<Story[]>(() => {
  if (sort.value === 'bookmarks') {
    return bookmarkIds.value
      .map((id) => getStoryById(id))
      .filter((s): s is Story => !!s)
  }
  let list = sortStories(publicStories(), sort.value)
  if (cat.value) list = list.filter((s) => s.category === cat.value)
  if (tag.value) list = list.filter((s) => s.tags.includes(tag.value))
  if (q.value) list = list.filter((s) => matchKeyword(s, q.value))
  return list
})

const resultCountText = computed(() =>
  sort.value === 'bookmarks'
    ? `共收藏 ${stories.value.length} 篇故事`
    : `找到 ${stories.value.length} 篇故事`
)

// 空状态场景
const emptyScene = computed(() => {
  if (sort.value === 'hot') return 'hot'
  if (sort.value === 'bookmarks') return 'bookmarks'
  if (q.value) return 'search'
  if (tag.value) return 'tag'
  if (cat.value) return 'category'
  return 'default'
})
const emptyValue = computed(() => q.value || tag.value || cat.value)
</script>

<template>
  <div>
    <!-- 页头与搜索 -->
    <section class="page-hero">
      <div class="container">
        <nav class="breadcrumb" aria-label="面包屑">
          <NuxtLink to="/">首页</NuxtLink><span>/</span><span>发现故事</span>
        </nav>
        <h1>发现故事</h1>
        <p class="page-desc">认真讲述的经历，值得被认真读到。用分类、标签或关键词，找到与你相似的故事。</p>
        <SearchBar v-model="q" placeholder="搜索故事、情感或关键词……" />
      </div>
    </section>

    <div class="container discover-layout">
      <!-- 筛选侧栏 -->
      <aside class="filter-sidebar" aria-label="筛选条件">
        <div class="filter-card" id="categories">
          <h3>情感分类</h3>
          <div class="filter-options">
            <label
              v-for="c in CATEGORIES"
              :key="c"
              :class="{ checked: cat === catValue(c) }"
            >
              <input
                type="radio"
                name="filter-cat"
                :value="catValue(c)"
                :checked="cat === catValue(c)"
                @change="cat = ($event.target as HTMLInputElement).value"
              />
              {{ c }}
            </label>
          </div>
        </div>

        <div class="filter-card" id="tags">
          <h3>故事标签</h3>
          <div class="filter-tagbox">
            <TagChip
              v-for="t in TAGS"
              :key="t"
              :text="t"
              :active="tag === t"
              @click="toggleTag(t)"
            />
          </div>
        </div>
      </aside>

      <!-- 列表 -->
      <div>
        <div class="discover-tabs">
          <Tabs v-model="sort" :tabs="sortTabs" />
        </div>

        <div class="filter-status">
          <template v-if="chips.length">
            <span>当前筛选：</span>
            <span v-for="c in chips" :key="c.type" class="filter-chip">
              {{ c.label }}
              <button type="button" :aria-label="`移除${c.label}`" @click="removeFilter(c.type)">
                <AppIcon name="x" :size="13" :stroke-width="2" />
              </button>
            </span>
            <button type="button" class="clear-all" @click="clearAll">清除全部筛选</button>
          </template>
        </div>

        <p class="result-count">{{ resultCountText }}</p>

        <div>
          <!-- 搜索无结果：提供清除筛选 -->
          <EmptyState
            v-if="stories.length === 0 && emptyScene === 'search'"
            scene="search"
            :value="emptyValue"
          >
            <template #actions>
              <BaseButton variant="pink" @click="clearAll">清除筛选</BaseButton>
              <BaseButton to="/write" variant="ghost">写下我的故事</BaseButton>
            </template>
          </EmptyState>

          <!-- 热门为空：切换到最新 -->
          <EmptyState
            v-else-if="stories.length === 0 && emptyScene === 'hot'"
            scene="hot"
          >
            <template #actions>
              <BaseButton variant="pink" @click="sort = 'latest'">看看最新故事</BaseButton>
              <BaseButton to="/write" variant="ghost">写下我的故事</BaseButton>
            </template>
          </EmptyState>

          <EmptyState
            v-else-if="stories.length === 0"
            :scene="emptyScene as any"
            :value="emptyValue"
          />

          <div v-else class="story-list">
            <StoryCard v-for="s in stories" :key="s.id" :story="s" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
