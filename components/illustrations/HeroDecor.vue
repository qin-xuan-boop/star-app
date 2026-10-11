<script setup lang="ts">
// 首页 Hero 夜空装饰：星点、弯月、云朵、星轨（纯装饰，无图片依赖）
</script>

<template>
  <div class="hero-sky" aria-hidden="true">
    <span class="hero-orbit"></span>
    <span class="star-dot s1"></span>
    <span class="star-dot s2"></span>
    <span class="star-dot s3"></span>
    <span class="star-dot s4"></span>
    <span class="star-dot s5"></span>
    <span class="star-dot s6"></span>
    <MoonIcon class="hero-moon" :size="74" />
    <CloudIcon class="hero-cloud c1" :size="124" />
    <CloudIcon class="hero-cloud c2" :size="92" />
  </div>
</template>
