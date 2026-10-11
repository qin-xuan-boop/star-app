<script setup lang="ts">
/**
 * 标签胶囊
 * - 传 to：渲染为 NuxtLink（如卡片 / 详情页跳筛选）
 * - 不传 to：渲染为 button（筛选器里点击切换），监听 @click
 */
defineProps<{ text: string; active?: boolean; to?: string }>()
defineEmits<{ (e: 'click'): void }>()
</script>

<template>
  <NuxtLink v-if="to" :to="to" class="mini-tag" :class="{ checked: active }">
    {{ text }}
  </NuxtLink>
  <button v-else type="button" class="mini-tag" :class="{ checked: active }" @click="$emit('click')">
    {{ text }}
  </button>
</template>
