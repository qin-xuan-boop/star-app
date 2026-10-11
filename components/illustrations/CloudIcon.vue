<script setup lang="ts">
// 圆润云朵
withDefaults(defineProps<{ size?: number | string }>(), { size: 96 })
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
      d="M7.2 18.2h9.6a4.4 4.4 0 0 0 .8-8.76 5.7 5.7 0 0 0-10.96-1.1A4.2 4.2 0 0 0 7.2 18.2z"
    />
  </svg>
</template>
