<script setup lang="ts">
// 胶囊式分段选择；v-model 绑定当前 tab 的 key
defineProps<{
  tabs: { key: string; label: string }[]
  modelValue: string
}>()
defineEmits<{ (e: 'update:modelValue', value: string): void }>()
</script>

<template>
  <div class="tabs" role="tablist" aria-label="分段切换">
    <button
      v-for="t in tabs"
      :key="t.key"
      type="button"
      role="tab"
      class="tab-btn"
      :class="{ active: modelValue === t.key }"
      :aria-selected="modelValue === t.key"
      @click="$emit('update:modelValue', t.key)"
    >
      {{ t.label }}
    </button>
  </div>
</template>
