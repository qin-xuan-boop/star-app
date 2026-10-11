<script setup lang="ts">
// 全局轻提示容器（由 useToast().toast 触发）
const { toasts } = useToast()
</script>

<template>
  <div class="toast-host">
    <div
      v-for="t in toasts"
      :key="t.id"
      class="toast"
      :class="{ 'is-success': t.type === 'success', 'is-error': t.type === 'error' }"
    >
      <AppIcon :name="t.type === 'success' ? 'check' : 'alert'" :size="16" />
      <span>{{ t.message }}</span>
    </div>
  </div>
</template>
