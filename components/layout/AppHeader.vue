<script setup lang="ts">
// 全站页头：品牌、主导航、搜索、投稿入口、移动端抽屉
const route = useRoute()
const open = ref(false)
const keyword = ref('')

const navLinks = [
  { to: '/discover', label: '发现故事' },
  { to: '/discover#categories', label: '全部分类' },
  { to: '/discover#tags', label: '热门标签' },
  { to: '/about', label: '关于星辰' }
]

function doSearch() {
  const q = keyword.value.trim()
  navigateTo({ path: '/discover', query: q ? { q } : {} })
}

// 路由变化后自动收起移动端菜单
watch(
  () => route.fullPath,
  () => {
    open.value = false
  }
)
</script>

<template>
  <header class="site-header">
    <div class="container nav-inner">
      <NuxtLink class="brand" to="/">
        <span class="brand-star"><StarIcon :size="22" /></span>
        <span class="brand-name"><b>STAR</b> 星辰</span>
      </NuxtLink>

      <nav class="main-nav" aria-label="主导航">
        <NuxtLink v-for="l in navLinks" :key="l.to" :to="l.to">{{ l.label }}</NuxtLink>
      </nav>

      <div class="nav-actions">
        <div class="nav-search" role="search">
          <AppIcon name="search" :size="16" />
          <input
            v-model="keyword"
            type="search"
            placeholder="搜索故事、关键词……"
            aria-label="搜索故事"
            @keydown.enter="doSearch"
          />
        </div>
        <BaseButton to="/write" variant="primary" size="sm">写下故事</BaseButton>
        <button
          class="icon-btn nav-toggle"
          type="button"
          aria-label="打开菜单"
          :aria-expanded="open"
          @click="open = !open"
        >
          <AppIcon :name="open ? 'x' : 'menu'" :size="22" />
        </button>
      </div>
    </div>

    <!-- 移动端抽屉 -->
    <div v-show="open" class="mobile-panel">
      <div class="nav-search" role="search">
        <AppIcon name="search" :size="16" />
        <input
          v-model="keyword"
          type="search"
          placeholder="搜索故事、关键词……"
          aria-label="搜索故事"
          @keydown.enter="doSearch"
        />
      </div>
      <nav class="mobile-nav" aria-label="移动端导航">
        <NuxtLink to="/discover">发现故事</NuxtLink>
        <NuxtLink to="/discover#categories">全部分类</NuxtLink>
        <NuxtLink to="/discover#tags">热门标签</NuxtLink>
        <NuxtLink to="/about">关于星辰</NuxtLink>
        <NuxtLink to="/write">写下故事</NuxtLink>
      </nav>
    </div>
  </header>
</template>
