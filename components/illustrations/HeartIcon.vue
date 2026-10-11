<script setup lang="ts">
// 圆润小心心：描边 / 实心；beat 时播放一次心跳动画
withDefaults(
  defineProps<{ variant?: 'outline' | 'filled'; size?: number | string; beat?: boolean }>(),
  { variant: 'outline', size: 20, beat: false }
)
</script>

<template>
  <svg
    :class="['heart-svg', { 'heart-beat': beat }]"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="variant === 'filled' ? 'currentColor' : 'none'"
    stroke="currentColor"
    :stroke-width="variant === 'filled' ? 1.4 : 1.9"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path
      d="M12 20.6s-8.4-5.3-8.4-11.3C3.6 6.4 5.7 4.4 8.1 4.4c1.6 0 3.1.9 3.9 2.2.8-1.3 2.3-2.2 3.9-2.2 2.4 0 4.5 2 4.5 4.9 0 6-8.4 11.3-8.4 11.3z"
    />
  </svg>
</template>

<style scoped>
.heart-svg {
  display: inline-block;
}
</style>
