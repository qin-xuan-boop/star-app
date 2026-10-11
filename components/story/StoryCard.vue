<script setup lang="ts">
import type { Story } from '~/types/story'

// 故事卡片：整卡可点（标题链接以 stretched-link 覆盖整卡），标签独立可点，
// 不嵌套交互元素，规避 <a> 内嵌 <a> / <button> 的非法结构。
const props = defineProps<{ story: Story }>()
const excerpt = computed(() => makeExcerpt(props.story.content))
</script>

<template>
  <article class="story-card">
    <span v-if="story._dev" class="dev-flag card-dev">测试数据</span>

    <div class="story-card-top">
      <span :class="story.source === 'editorial' ? 'editorial-chip' : 'cat-chip'">
        {{ story.source === 'editorial' ? '星辰故事集' : story.category }}
      </span>
      <span class="meta-sep">·</span>
      <span>{{ story.authorName }}</span>
      <span class="meta-sep">·</span>
      <span>{{ formatTime(story.createdAt) }}</span>
    </div>

    <h3>
      <NuxtLink :to="`/story/${story.id}`" class="card-link">{{ story.title }}</NuxtLink>
    </h3>

    <p class="story-excerpt">{{ excerpt }}</p>

    <div class="story-card-bottom">
      <span class="tag-row">
        <TagChip
          v-for="t in story.tags.slice(0, 3)"
          :key="t"
          :text="t"
          :to="`/discover?tag=${encodeURIComponent(t)}`"
        />
      </span>
      <span class="card-stats">
        <span class="stat" :class="{ 'heart-on': story.liked }">
          <AppIcon :name="story.liked ? 'heart-fill' : 'heart'" :size="16" />
          {{ story.likes || 0 }}
        </span>
        <span class="stat">
          <AppIcon name="comment" :size="15" />
          {{ story.comments ? story.comments.length : 0 }}
        </span>
      </span>
    </div>
  </article>
</template>

<style scoped>
/* 标题链接铺满整卡，实现整卡点击 */
.card-link {
  color: inherit;
}
.card-link::after {
  content: '';
  position: absolute;
  inset: 0;
}
.story-card:hover .card-link {
  color: var(--brand);
}
/* 标签浮于整卡链接之上，可单独点击 */
.tag-row :deep(.mini-tag) {
  position: relative;
  z-index: 1;
}
.card-dev {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
}
</style>
