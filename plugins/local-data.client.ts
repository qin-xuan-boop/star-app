/**
 * 客户端数据初始化
 * 在 app 挂载（hydration 完成）后再从 localStorage 载入本机数据，
 * 保证服务端首屏 HTML 与客户端首次渲染一致，避免 hydration mismatch。
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    useStories().loadLocal()
  })
})
