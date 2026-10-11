// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 兼容日期：固定当前使用的 Nuxt 行为基线
  compatibilityDate: '2026-10-10',

  // 故事详情页需要服务端渲染（SEO + 独立 URL + 刷新可访问）
  ssr: true,
  devtools: { enabled: false },

  // 组件自动导入：components 下所有组件按文件名全局注册（不强制目录前缀）
  components: [{ path: '~/components', pathPrefix: false }],

  // 全局样式：先加载设计 Token，再加载基础样式与组件类
  css: ['~/assets/css/tokens.css', '~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      title: 'STAR 星辰 · 把没说出口的话，说给星辰听',
      titleTemplate: '%s · STAR 星辰',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'STAR 星辰（星辰收信处）是年轻人的情感故事社区：匿名分享暗恋、告白、遗憾、分手与重逢的真实经历，也认真倾听每一段没有说出口的话。'
        },
        // 原型 / 重构阶段暂不希望被收录；正式上线前移除
        { name: 'robots', content: 'noindex, nofollow' }
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
    }
  }
})
