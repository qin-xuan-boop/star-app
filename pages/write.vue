<script setup lang="ts">
import type { Story, Visibility } from '~/types/story'
import { SELECTABLE_CATEGORIES } from '~/data/categories'
import { TAGS } from '~/data/tags'

useHead({ title: '写下你的故事' })

const route = useRoute()
const { createStory } = useStories()
const { toast } = useToast()

// 从发现页带分类跳入：/write?cat=xx
const presetCat =
  typeof route.query.cat === 'string' && SELECTABLE_CATEGORIES.includes(route.query.cat as any)
    ? (route.query.cat as string)
    : ''

const form = reactive({
  title: '',
  content: '',
  category: presetCat,
  author: '',
  visibility: 'public' as Visibility
})
const pickedTags = ref<string[]>([])
const errors = reactive({ title: '', content: '', category: '' })
const saving = ref(false)
const submitted = ref(false)
const savedStory = ref<Story | null>(null)

function toggleTag(t: string) {
  const idx = pickedTags.value.indexOf(t)
  if (idx === -1) {
    if (pickedTags.value.length >= 5) {
      toast('每篇故事最多选择 5 个标签', 'error')
      return
    }
    pickedTags.value = [...pickedTags.value, t]
  } else {
    pickedTags.value = pickedTags.value.filter((x) => x !== t)
  }
}

function clearError(field: 'title' | 'content' | 'category') {
  errors[field] = ''
}

function validate(): boolean {
  errors.title = ''
  errors.content = ''
  errors.category = ''
  let ok = true
  if (form.title.trim().length < 2) {
    errors.title = '标题至少需要 2 个字'
    ok = false
  } else if (form.title.trim().length > 40) {
    errors.title = '标题不能超过 40 个字'
    ok = false
  }
  if (form.content.trim().length < 20) {
    errors.content = '正文至少需要 20 个字，慢慢写，不着急'
    ok = false
  } else if (form.content.trim().length > 10000) {
    errors.content = '正文请控制在 10000 字以内'
    ok = false
  }
  if (!form.category) {
    errors.category = '请选择一个最贴近的分类'
    ok = false
  }
  return ok
}

async function submit() {
  if (!validate()) {
    await nextTick()
    const el = document.querySelector('.form-group.has-error')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }
  saving.value = true
  // 让保存中的加载状态短暂可见（当前无真实网络请求）
  await new Promise((r) => setTimeout(r, 500))
  const res = createStory({
    title: form.title,
    content: form.content,
    category: form.category,
    tags: pickedTags.value,
    authorName: form.author,
    visibility: form.visibility
  })
  saving.value = false
  if (!res.ok) {
    toast('本地保存失败，请检查浏览器存储空间', 'error')
    return
  }
  savedStory.value = res.story
  submitted.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function resetForm() {
  form.title = ''
  form.content = ''
  form.category = presetCat
  form.author = ''
  form.visibility = 'public'
  pickedTags.value = []
  errors.title = errors.content = errors.category = ''
  submitted.value = false
  savedStory.value = null
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="write-layout">
    <div class="write-head">
      <h1>写下你的故事</h1>
      <p>无论结局如何，你的经历都值得被认真对待。</p>
    </div>

    <div class="form-card">
      <!-- 投稿成功反馈 -->
      <div v-if="submitted && savedStory" class="success-panel">
        <div class="success-icon"><AppIcon name="check" :size="38" :stroke-width="2.4" /></div>
        <h2>{{ savedStory.visibility === 'private' ? '已在本机私密保存' : '已在本机保存' }}</h2>
        <p>
          这是前端体验版本，<template v-if="savedStory.visibility === 'private'">故事设为「仅自己可见」，</template>其他人暂时看不到你的投稿。
        </p>
        <span class="local-badge">数据仅保存在当前浏览器（localStorage），不是线上发布</span>
        <div class="success-actions">
          <BaseButton
            v-if="savedStory.visibility !== 'private'"
            :to="`/story/${savedStory.id}`"
            variant="pink"
          >
            查看这篇故事
          </BaseButton>
          <BaseButton variant="ghost" @click="resetForm">再写一篇</BaseButton>
          <BaseButton to="/" variant="ghost">返回首页</BaseButton>
        </div>
      </div>

      <!-- 投稿表单 -->
      <form v-else novalidate @submit.prevent="submit">
        <div class="form-group" :class="{ 'has-error': !!errors.title }">
          <label for="input-title">
            故事标题<span class="required">*</span>
            <span class="field-hint">2—40 字，不必刻意，写你想到的第一句就好</span>
          </label>
          <input
            id="input-title"
            v-model="form.title"
            class="form-control"
            type="text"
            maxlength="40"
            placeholder="例如：那句没说出口的再见"
            @input="clearError('title')"
          />
          <div v-if="errors.title" class="field-error">
            <AppIcon name="alert" :size="15" /><span>{{ errors.title }}</span>
          </div>
          <div class="word-count">{{ form.title.length }} / 40</div>
        </div>

        <div class="form-group" :class="{ 'has-error': !!errors.content }">
          <label for="input-content">
            故事正文<span class="required">*</span>
            <span class="field-hint">至少 20 字，慢慢写，没有人催你</span>
          </label>
          <textarea
            id="input-content"
            v-model="form.content"
            class="form-control"
            rows="12"
            placeholder="从你记得的那个细节开始吧。那天的天气、他说过的话、你当时的心情……都可以写下来。"
            @input="clearError('content')"
          ></textarea>
          <div v-if="errors.content" class="field-error">
            <AppIcon name="alert" :size="15" /><span>{{ errors.content }}</span>
          </div>
          <div class="word-count">{{ form.content.length }} 字</div>
        </div>

        <div class="form-group" :class="{ 'has-error': !!errors.category }">
          <label for="input-category">主要分类<span class="required">*</span></label>
          <select
            id="input-category"
            v-model="form.category"
            class="form-control"
            @change="clearError('category')"
          >
            <option value="">请选择一个主要分类</option>
            <option v-for="c in SELECTABLE_CATEGORIES" :key="c" :value="c">{{ c }}</option>
          </select>
          <div v-if="errors.category" class="field-error">
            <AppIcon name="alert" :size="15" /><span>{{ errors.category }}</span>
          </div>
        </div>

        <div class="form-group">
          <label>
            相关标签
            <span class="field-hint">最多选择 5 个，点击即可选中 / 取消</span>
          </label>
          <div class="tag-picker">
            <TagChip
              v-for="t in TAGS"
              :key="t"
              :text="t"
              :active="pickedTags.includes(t)"
              @click="toggleTag(t)"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="input-author">
            匿名昵称
            <span class="field-hint">选填；留空将自动生成，如「星辰旅人·2841」</span>
          </label>
          <input
            id="input-author"
            v-model="form.author"
            class="form-control"
            type="text"
            maxlength="16"
            placeholder="故事在前台展示时使用的名字"
          />
        </div>

        <!-- 公开设置 -->
        <div class="privacy-box">
          <label class="radio-row">
            <input v-model="form.visibility" type="radio" name="visibility" value="public" />
            <span>
              <b>公开展示</b>
              <span class="radio-desc">正式版中，故事通过审核后会出现在公开列表，可能被搜索引擎收录。</span>
            </span>
          </label>
          <label class="radio-row">
            <input v-model="form.visibility" type="radio" name="visibility" value="private" />
            <span>
              <b>仅自己可见</b>
              <span class="radio-desc">不进入任何公开列表。注意：真正的访问权限必须由后端控制，当前版本仅做本地演示。</span>
            </span>
          </label>
        </div>

        <!-- 隐私与内容提醒 -->
        <div class="privacy-notes">
          <b>投稿前，请花十秒看一眼：</b><br />
          1. 请不要上传未经他人许可的聊天记录、个人信息或照片；<br />
          2. 「匿名昵称」只是前台展示形式，不代表技术上完全不可追踪，正式隐私规则以后端与隐私政策为准；<br />
          3. 正式版的公开投稿会先经过审核，你可以随时申请撤稿；<br />
          4. 含有攻击、歧视、违法或骚扰内容的故事，不允许发布。
        </div>

        <button class="btn btn-pink btn-block" type="submit" :disabled="saving">
          {{ saving ? '正在保存…' : '把故事交给星辰' }}
        </button>
      </form>
    </div>
  </div>
</template>
