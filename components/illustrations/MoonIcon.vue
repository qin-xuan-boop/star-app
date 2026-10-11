<script setup lang="ts">
// 柔和弯月
withDefaults(defineProps<{ size?: number | string }>(), { size: 64 })
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
      d="M20.2 13.6A8.2 8.2 0 1 1 10.4 3.8a6.6 6.6 0 0 0 9.8 9.8z"
    />
  </svg>
</template>
