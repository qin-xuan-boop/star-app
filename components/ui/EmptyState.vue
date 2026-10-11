<script setup lang="ts">
/**
 * 品牌化空状态：治愈插画 + 文案 + 操作
 * scene 决定插画与默认文案；value 用于替换文案中的 {v}
 * 默认按钮可被 #actions 插槽覆盖（如「清除筛选」「切换到最新」）
 */
const props = defineProps<{
  scene?: 'default' | 'category' | 'tag' | 'search' | 'hot' | 'bookmarks' | 'noRelated' | 'missing'
  value?: string
}>()

interface Copy {
  illu: 'envelope' | 'cloudStar' | 'bookmark' | 'search'
  title: string
  desc: string
  cta?: string
  to?: string
}

const COPIES: Record<string, Copy> = {
  default: {
    illu: 'envelope',
    title: '第一颗星，等你来点亮。',
    desc: '这里还没有公开的故事。写下你的经历，让星辰收下它。',
    cta: '写下我的故事',
    to: '/write'
  },
  category: {
    illu: 'envelope',
    title: '这个分类，还在等第一个故事。',
    desc: '「{v}」分类下暂时没有公开的故事。也许你的经历，正好适合放在这里。',
    cta: '写下这个分类的故事',
    to: '/write'
  },
  tag: {
    illu: 'envelope',
    title: '这枚标签，还没有对应的故事。',
    desc: '带有「{v}」标签的故事暂时是空的。如果你也有过这样的时刻，不妨讲出来。',
    cta: '写下我的故事',
    to: '/write'
  },
  search: {
    illu: 'search',
    title: '没有找到相关的故事。',
    desc: '没有找到与「{v}」相关的故事。换个关键词试试，或者清除筛选条件。'
  },
  hot: {
    illu: 'cloudStar',
    title: '热门故事，等真实的共鸣把它点亮。',
    desc: '这里不会用虚构数字制造热闹。当故事收获真实的喜欢与回应，它会出现在这里。'
  },
  bookmarks: {
    illu: 'bookmark',
    title: '还没有收藏的故事。',
    desc: '遇到想反复读的故事，点击收藏，它会安静地待在这里等你回来。',
    cta: '去发现故事',
    to: '/discover'
  },
  noRelated: {
    illu: 'cloudStar',
    title: '暂时没有相关的故事。',
    desc: '等更多故事到来，这里会推荐相似的经历。',
    cta: '去发现故事',
    to: '/discover'
  },
  missing: {
    illu: 'cloudStar',
    title: '故事不存在，或已被作者撤回。',
    desc: '你访问的故事可能已经删除，或者链接并不完整。',
    cta: '返回发现故事',
    to: '/discover'
  }
}

const copy = computed<Copy>(() => COPIES[props.scene || 'default'] || COPIES.default)
const desc = computed(() => copy.value.desc.replace('{v}', props.value || ''))
</script>

<template>
  <div class="empty-state">
    <div class="empty-illustration">
      <EmptyIllustration :type="copy.illu" />
    </div>
    <h3>{{ copy.title }}</h3>
    <p>{{ desc }}</p>
    <div class="empty-actions">
      <slot name="actions">
        <BaseButton v-if="copy.cta && copy.to" :to="copy.to" variant="pink">
          {{ copy.cta }}
        </BaseButton>
        <BaseButton to="/discover" variant="ghost">浏览发现页</BaseButton>
      </slot>
    </div>
  </div>
</template>
