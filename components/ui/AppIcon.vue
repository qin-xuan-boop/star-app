<script setup lang="ts">
/**
 * 功能线性图标集（统一 24 网格、圆角线帽、currentColor）
 * name：search / heart / heart-fill / bookmark / bookmark-fill /
 *       share / flag / comment / x / menu / alert / check / back / edit / plus
 * heart-fill / bookmark-fill 为实心版本
 */
const props = withDefaults(
  defineProps<{ name: string; size?: number | string; strokeWidth?: number }>(),
  { size: 17, strokeWidth: 1.8 }
)

const isFilled = computed(() => props.name.endsWith('-fill'))
const sizeStr = computed(() => (typeof props.size === 'number' ? `${props.size}` : props.size))
</script>

<template>
  <svg
    :width="sizeStr"
    :height="sizeStr"
    viewBox="0 0 24 24"
    :fill="isFilled ? 'currentColor' : 'none'"
    stroke="currentColor"
    :stroke-width="isFilled ? 1.5 : strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <!-- 搜索 -->
    <template v-if="name === 'search'">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.3-4.3" />
    </template>

    <!-- 心（描边 / 实心） -->
    <template v-else-if="name === 'heart' || name === 'heart-fill'">
      <path
        d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"
      />
    </template>

    <!-- 书签（描边 / 实心） -->
    <template v-else-if="name === 'bookmark' || name === 'bookmark-fill'">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </template>

    <!-- 分享 -->
    <template v-else-if="name === 'share'">
      <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
      <path d="M16 6l-4-4-4 4" />
      <path d="M12 2v14" />
    </template>

    <!-- 举报旗帜 -->
    <template v-else-if="name === 'flag'">
      <path d="M4 15V4a1 1 0 0 1 1-1h12l-3 4 3 4H5" />
      <path d="M4 22v-7" />
    </template>

    <!-- 评论气泡 -->
    <template v-else-if="name === 'comment'">
      <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.3 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.7a8.2 8.2 0 0 1-1-4A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z" />
    </template>

    <!-- 关闭 -->
    <template v-else-if="name === 'x'">
      <path d="M18 6L6 18M6 6l12 12" :stroke-width="strokeWidth + 0.2" />
    </template>

    <!-- 菜单 -->
    <template v-else-if="name === 'menu'">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </template>

    <!-- 警示 -->
    <template v-else-if="name === 'alert'">
      <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h13a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    </template>

    <!-- 勾选 -->
    <template v-else-if="name === 'check'">
      <path d="M20 6 9 17l-5-5" :stroke-width="strokeWidth + 0.4" />
    </template>

    <!-- 返回 -->
    <template v-else-if="name === 'back'">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </template>

    <!-- 编辑（铅笔） -->
    <template v-else-if="name === 'edit'">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </template>

    <!-- 加号 -->
    <template v-else-if="name === 'plus'">
      <path d="M12 5v14M5 12h14" :stroke-width="strokeWidth + 0.2" />
    </template>
  </svg>
</template>
