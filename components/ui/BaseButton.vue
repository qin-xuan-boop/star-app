<script setup lang="ts">
/**
 * 统一按钮
 * variant：primary（淡紫）/ pink（治愈粉）/ ghost（描边）/ light（深底上的浅色）
 * 传 to 渲染为 NuxtLink，href 渲染外链 <a>，否则渲染 <button>
 */
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'pink' | 'ghost' | 'light'
    size?: 'sm' | 'md'
    block?: boolean
    to?: string
    href?: string
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    block: false,
    type: 'button',
    disabled: false
  }
)

const cls = computed(() => ({
  btn: true,
  [`btn-${props.variant}`]: true,
  'btn-sm': props.size === 'sm',
  'btn-block': props.block
}))
</script>

<template>
  <NuxtLink v-if="props.to" :to="props.to" :class="cls">
    <slot />
  </NuxtLink>
  <a v-else-if="props.href" :href="props.href" :class="cls">
    <slot />
  </a>
  <button v-else :type="props.type" :disabled="props.disabled" :class="cls">
    <slot />
  </button>
</template>
