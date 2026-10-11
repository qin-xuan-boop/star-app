<script setup lang="ts">
// 品牌圆角四角星：描边 / 实心
withDefaults(
  defineProps<{ variant?: 'outline' | 'filled'; size?: number | string }>(),
  { variant: 'filled', size: 20 }
)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="variant === 'filled' ? 'currentColor' : 'none'"
    stroke="currentColor"
    :stroke-width="variant === 'filled' ? 0 : 1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path
      d="M12 2.6c.3 0 .5.2.6.5l2 6.2 6.2 2c.3.1.5.4.5.7s-.2.6-.5.7l-6.2 2-2 6.2c-.1.3-.4.5-.7.5s-.6-.2-.7-.5l-2-6.2-6.2-2c-.3-.1-.5-.4-.5-.7s.2-.6.5-.7l6.2-2 2-6.2c.1-.3.4-.5.7-.5z"
    />
  </svg>
</template>
