<script setup lang="ts">
import { HOME_CATEGORIES } from '~/data/categories'
import { TAGS } from '~/data/tags'

useHead({ title: '把没说出口的话，说给星辰听' })

const { publicStories } = useStories()

// 首页 Feed：推荐 / 最新 / 热门
const sort = ref('recommended')
const sortTabs = [
  { key: 'recommended', label: '推荐' },
  { key: 'latest', label: '最新' },
  { key: 'hot', label: '热门' }
]
const stories = computed(() => sortStories(publicStories(), sort.value))
</script>

<template>
  <div>
    <!-- ========== Hero ========== -->
    <section class="hero">
      <HeroDecor />
      <div class="container">
        <div class="hero-inner">
          <span class="hero-badge"><span class="dot"></span>星辰收信处</span>
          <h1>把没说出口的话，<br />说给星辰听。</h1>
          <p>
            这里收藏每一段认真经历过的感情，也欢迎你把自己的故事讲出来。有些故事不必有结局，但每一段经历，都值得被认真听见。
          </p>
          <div class="hero-actions">
            <BaseButton to="/discover" variant="pink">发现故事</BaseButton>
            <BaseButton to="/write" variant="light">写下我的故事</BaseButton>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== 故事 Feed ========== -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <h2 class="section-title">
              <span class="title-mark"><StarIcon :size="18" /></span>
              故事正在抵达
            </h2>
            <p class="section-sub">推荐、最新与热门，均来自真实保存的内容，不制造虚构的热闹。</p>
          </div>
          <NuxtLink class="section-more" to="/discover">进入发现页 →</NuxtLink>
        </div>

        <Tabs v-model="sort" :tabs="sortTabs" />

        <div style="margin-top: 24px">
          <EmptyState v-if="stories.length === 0 && sort === 'hot'" scene="hot" />
          <EmptyState v-else-if="stories.length === 0" scene="default" />
          <template v-else>
            <div class="story-list">
              <StoryCard v-for="s in stories" :key="s.id" :story="s" />
            </div>
            <p class="tab-note">列表按本机保存的内容演示；正式版将由后端提供推荐与排序。</p>
          </template>
        </div>
      </div>
    </section>

    <!-- ========== 分类入口 ========== -->
    <section class="section section-warm">
      <div class="container">
        <div class="section-head">
          <div>
            <h2 class="section-title">
              <span class="title-mark"><HeartIcon variant="filled" :size="18" /></span>
              按情感分类浏览
            </h2>
            <p class="section-sub">从暗恋到重逢，找到和你此刻心境相近的故事。</p>
          </div>
          <NuxtLink class="section-more" to="/discover#categories">全部分类 →</NuxtLink>
        </div>
        <div class="category-grid">
          <NuxtLink
            v-for="cat in HOME_CATEGORIES"
            :key="cat"
            :to="`/discover?cat=${encodeURIComponent(cat)}`"
            class="category-card"
          >
            <span class="cat-icon">{{ cat.charAt(0) }}</span>
            <span class="cat-name">{{ cat }}</span>
            <span class="cat-hint">查看相关故事</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ========== 热门标签 ========== -->
    <section class="section section-lilac">
      <div class="container">
        <div class="section-head">
          <div>
            <h2 class="section-title">
              <span class="title-mark"><SparkleIcon :size="18" /></span>
              热门标签
            </h2>
            <p class="section-sub">标签描述故事里的具体情境，点击即可筛选。</p>
          </div>
          <NuxtLink class="section-more" to="/discover#tags">全部标签 →</NuxtLink>
        </div>
        <div class="tag-cloud">
          <NuxtLink
            v-for="t in TAGS"
            :key="t"
            :to="`/discover?tag=${encodeURIComponent(t)}`"
            class="cloud-tag"
          >
            {{ t }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
