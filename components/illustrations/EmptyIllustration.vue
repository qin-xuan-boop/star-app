<script setup lang="ts">
/**
 * 空状态场景插画（圆润、暖色、轻漂浮）
 * type：
 *  - envelope   信封里飞出小心心（默认 / 分类 / 标签）
 *  - cloudStar  云朵托着星星（热门 / 相关 / 不存在）
 *  - bookmark   书签与心（我的收藏）
 *  - search     放大镜与星光（搜索无结果）
 */
withDefaults(defineProps<{ type?: 'envelope' | 'cloudStar' | 'bookmark' | 'search' }>(), {
  type: 'envelope'
})
</script>

<template>
  <div class="empty-illu" :class="`is-${type}`">
    <span class="illu-disc"></span>

    <!-- 信封飞出小心心 -->
    <template v-if="type === 'envelope'">
      <EnvelopeIcon :size="64" class="i-env" />
      <HeartIcon variant="filled" :size="24" class="i-h1" />
      <HeartIcon variant="filled" :size="15" class="i-h2" />
      <SparkleIcon :size="17" class="i-sp1" />
      <StarIcon :size="13" class="i-st1" />
    </template>

    <!-- 云朵托着星星 -->
    <template v-else-if="type === 'cloudStar'">
      <CloudIcon :size="86" class="i-cloud" />
      <StarIcon variant="filled" :size="30" class="i-star" />
      <HeartIcon variant="filled" :size="15" class="i-h1" />
      <SparkleIcon :size="15" class="i-sp1" />
    </template>

    <!-- 书签与心 -->
    <template v-else-if="type === 'bookmark'">
      <AppIcon name="bookmark-fill" :size="60" class="i-bm" />
      <HeartIcon variant="filled" :size="20" class="i-bm-heart" />
      <SparkleIcon :size="16" class="i-sp1" />
      <StarIcon :size="12" class="i-st1" />
    </template>

    <!-- 放大镜与星光 -->
    <template v-else>
      <AppIcon name="search" :size="58" :stroke-width="2" class="i-search" />
      <HeartIcon variant="filled" :size="15" class="i-h1" />
      <SparkleIcon :size="17" class="i-sp1" />
      <StarIcon :size="13" class="i-st1" />
    </template>
  </div>
</template>

<style scoped>
.empty-illu {
  position: relative;
  width: 100%;
  height: 100%;
}
.illu-disc {
  position: absolute;
  inset: 8%;
  border-radius: 50%;
  border: 1px solid var(--border);
}
.is-envelope .illu-disc {
  background: radial-gradient(circle at 50% 42%, var(--pink-soft-2), var(--pink-soft));
}
.is-cloudStar .illu-disc {
  background: radial-gradient(circle at 50% 42%, #fff, var(--lilac-soft));
}
.is-bookmark .illu-disc {
  background: radial-gradient(circle at 50% 42%, var(--gold-soft), #fbf3e2);
}
.is-search .illu-disc {
  background: radial-gradient(circle at 50% 42%, var(--apricot-soft), #f6e7d8);
}

/* 通用：元素居中与漂浮 */
.i-env,
.i-cloud,
.i-bm,
.i-search,
.i-star {
  position: absolute;
  left: 50%;
  top: 54%;
  transform: translate(-50%, -50%);
}
.i-env {
  color: var(--apricot-deep);
  animation: floaty 6s ease-in-out infinite;
}
.i-cloud {
  top: 62%;
  color: #ffffff;
  filter: drop-shadow(0 6px 12px rgba(149, 132, 190, 0.35));
}
.i-star {
  top: 34%;
  color: var(--gold);
  animation: floaty 5s ease-in-out infinite;
}
.i-bm {
  color: var(--brand);
  animation: floaty 6s ease-in-out infinite;
}
.i-bm-heart {
  position: absolute;
  left: 50%;
  top: 47%;
  transform: translate(-50%, -50%);
  color: var(--pink);
}
.i-search {
  color: var(--brand);
  animation: floaty 6s ease-in-out infinite;
}

.i-h1 {
  position: absolute;
  left: 64%;
  top: 20%;
  color: var(--pink);
  animation: floaty 4.5s ease-in-out infinite;
}
.is-cloudStar .i-h1 {
  left: 30%;
  top: 30%;
}
.is-search .i-h1 {
  left: 27%;
  top: 26%;
}
.i-h2 {
  position: absolute;
  left: 27%;
  top: 30%;
  color: var(--pink);
  opacity: 0.8;
  animation: floaty 5.5s ease-in-out infinite reverse;
}
.i-sp1 {
  position: absolute;
  right: 24%;
  bottom: 24%;
  color: var(--gold);
  animation: twinkle 3s ease-in-out infinite;
}
.is-bookmark .i-sp1 {
  right: 22%;
  top: 24%;
  bottom: auto;
}
.is-search .i-sp1 {
  right: 24%;
  top: 22%;
  bottom: auto;
}
.i-st1 {
  position: absolute;
  left: 22%;
  bottom: 26%;
  color: var(--lilac);
  animation: twinkle 3.6s ease-in-out infinite;
}
.is-envelope .i-st1 {
  left: 26%;
  top: 22%;
  bottom: auto;
}
</style>
