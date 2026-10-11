<script setup lang="ts">
// 应用根组件：全局布局骨架（页头 / 页脚 / 轻提示 / 弹窗）
// 页面主体由 <NuxtPage /> 按文件路由渲染
// 开发测试模式：?demo=1 进入后，本次 SPA 会话内保持显示横幅（不落盘，刷新还原）
const { isDemo } = useStories()
</script>

<template>
  <div class="app-shell" :class="{ 'demo-mode': isDemo }">
    <!-- 开发测试模式横幅（仅 ?demo=1） -->
    <div v-if="isDemo" class="dev-banner">
      开发测试模式：以下含虚构测试数据，仅用于检查排版；正式模式不显示
    </div>

    <AppHeader />

    <main class="app-main">
      <NuxtPage />
    </main>

    <AppFooter />

    <!-- 全局轻提示与弹窗（由 useToast / useModal 驱动） -->
    <ToastHost />
    <AppModal />
  </div>
</template>
