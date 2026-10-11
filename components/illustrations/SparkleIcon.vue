<script setup lang="ts">
// 小四芒闪光（点缀用）
withDefaults(defineProps<{ size?: number | string }>(), { size: 18 })
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      d="M12 2.8c.35 3.3 1.9 4.85 5.2 5.2-3.3.35-4.85 1.9-5.2 5.2-.35-3.3-1.9-4.85-5.2-5.2 3.3-.35 4.85-1.9 5.2-5.2z"
    />
    <circle cx="18.6" cy="18.2" r="1.5" />
    <circle cx="5.4" cy="17" r="1.1" />
  </svg>
</template>
