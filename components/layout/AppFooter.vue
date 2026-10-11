<script setup lang="ts">
// 全站页脚
const columns = [
  {
    title: '了解星辰',
    links: [
      { to: '/about#about', label: '关于我们' },
      { to: '/about#notice', label: '投稿须知' },
      { to: '/about#report', label: '内容举报' }
    ]
  },
  {
    title: '规则与条款',
    links: [
      { to: '/about#privacy', label: '隐私政策' },
      { to: '/about#terms', label: '用户协议' },
      { to: '/about#withdraw', label: '撤稿与删除' }
    ]
  },
  {
    title: '联系',
    links: [
      { to: '/about#contact', label: '联系方式' },
      { to: '/write', label: '写下我的故事' },
      { to: '/discover', label: '发现故事' }
    ]
  }
]
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-inner">
        <div class="footer-brand">
          <NuxtLink class="brand" to="/">
            <span class="brand-star"><StarIcon :size="20" /></span>
            <span class="brand-name">STAR 星辰</span>
          </NuxtLink>
          <p>星辰收信处，收藏每一段认真经历过的感情。把没说出口的话，说给星辰听。</p>
        </div>

        <div v-for="col in columns" :key="col.title" class="footer-col">
          <h4>{{ col.title }}</h4>
          <NuxtLink v-for="l in col.links" :key="l.to" :to="l.to">{{ l.label }}</NuxtLink>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© 2026 STAR 星辰 · 星辰收信处</span>
        <span>当前为本地开发版本：尚未部署上线，无备案信息</span>
      </div>
    </div>
  </footer>
</template>
