<script setup lang="ts">
/**
 * 搜索框（v-model，内部 280ms 防抖）
 * 圆形胶囊外观，带搜索图标与一键清除
 */
const props = defineProps<{ modelValue: string; placeholder?: string; ariaLabel?: string }>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'clear'): void
}>()

const inner = ref(props.modelValue)
watch(
  () => props.modelValue,
  (v) => {
    inner.value = v
  }
)

let timer: ReturnType<typeof setTimeout> | null = null
function onInput(e: Event) {
  inner.value = (e.target as HTMLInputElement).value
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    emit('update:modelValue', inner.value.trim())
  }, 280)
}

function clear() {
  inner.value = ''
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<template>
  <div class="search-bar" :class="{ 'has-text': !!inner }">
    <AppIcon name="search" :size="18" />
    <input
      type="search"
      :value="inner"
      :placeholder="placeholder || '搜索故事、关键词……'"
      :aria-label="ariaLabel || '搜索故事'"
      @input="onInput"
    />
    <button type="button" class="search-clear" aria-label="清除关键词" @click="clear">
      <AppIcon name="x" :size="15" :stroke-width="2" />
    </button>
  </div>
</template>
