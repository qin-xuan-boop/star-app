<script setup lang="ts">
// 圆润五瓣小花（颜色跟随 currentColor，花心奶白）
withDefaults(defineProps<{ size?: number | string }>(), { size: 24 })
const petals = [0, 72, 144, 216, 288]
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" aria-hidden="true">
    <g fill="currentColor">
      <ellipse
        v-for="(deg, i) in petals"
        :key="i"
        cx="12"
        cy="7.4"
        rx="3.1"
        ry="4.5"
        :transform="`rotate(${deg} 12 12)`"
      />
    </g>
    <circle cx="12" cy="12" r="2.4" fill="#FFFDF9" />
  </svg>
</template>
