<script setup lang="ts">
import type { Story } from '~/types/story'

// 相关推荐列表（权重计算在页面 / 数据层完成，这里只负责渲染）
defineProps<{ stories: Story[] }>()
</script>

<template>
  <div class="related-list">
    <NuxtLink
      v-for="s in stories"
      :key="s.id"
      :to="`/story/${s.id}`"
      class="related-item"
    >
      <p class="rel-cat">{{ s.source === 'editorial' ? '星辰故事集' : s.category }}</p>
      <h4>{{ s.title }}</h4>
      <p>{{ makeExcerpt(s.content) }}</p>
    </NuxtLink>
  </div>
</template>
