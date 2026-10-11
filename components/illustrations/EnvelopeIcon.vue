<script setup lang="ts">
// 圆润信封（浅奶白填充 + 暖色描边）
withDefaults(defineProps<{ size?: number | string }>(), { size: 64 })
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <rect x="3" y="6" width="18" height="13" rx="2.6" fill="#FFFDF9" stroke="currentColor" stroke-width="1.6" />
    <path d="M4.2 8.4l7.1 5.2a1.2 1.2 0 0 0 1.4 0l7.1-5.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>
