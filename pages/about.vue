<script setup lang="ts">
useHead({
  title: '关于星辰',
  meta: [
    {
      name: 'description',
      content:
        '关于 STAR 星辰（星辰收信处）：一个年轻人的情感故事社区。本页包含投稿须知、隐私政策、用户协议、举报与撤稿说明的当前版本。'
    }
  ]
})

const toc = [
  { id: 'about', label: '关于我们' },
  { id: 'notice', label: '投稿须知' },
  { id: 'privacy', label: '隐私政策' },
  { id: 'terms', label: '用户协议' },
  { id: 'report', label: '内容举报' },
  { id: 'withdraw', label: '撤稿与删除' },
  { id: 'contact', label: '联系方式' }
]
const activeId = ref('about')

function onScroll() {
  let current = 'about'
  for (const item of toc) {
    const el = document.getElementById(item.id)
    if (el && el.offsetTop <= window.scrollY + 120) current = item.id
  }
  activeId.value = current
}
function jump(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  activeId.value = id
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="container about-layout">
    <!-- 左侧目录 -->
    <nav class="about-toc" aria-label="本页目录">
      <a
        v-for="item in toc"
        :key="item.id"
        :href="`#${item.id}`"
        :class="{ active: activeId === item.id }"
        @click.prevent="jump(item.id)"
      >
        {{ item.label }}
      </a>
    </nav>

    <!-- 右侧内容 -->
    <div class="about-content">
      <section id="about" class="about-section">
        <h2>关于我们</h2>
        <p>
          STAR 星辰（空间名称：星辰收信处）是一个面向年轻人的情感故事社区。我们相信，每一段认真经历过的感情——无论是暗恋、告白、双向奔赴，还是遗憾、错过、分手与重逢——都值得被认真听见。
        </p>
        <p>
          你可以在这里匿名写下真实经历，阅读他人的故事，找到相似的心境，留下善意的回应。这里不是 AI 陪聊、恋爱匹配或心理咨询，社区最重要的资产，是真实的经历与真诚的共鸣。
        </p>
        <p>
          当前网站处于<b>前端开发阶段</b>，尚未部署上线，没有运营主体备案信息。本页所有政策条款均为草案，将在正式运营前依据实际主体、部署方式与适用法规完善。
        </p>
      </section>

      <section id="notice" class="about-section">
        <span class="draft-note">草案 · 以后续正式版本为准</span>
        <h2>投稿须知</h2>
        <ul>
          <li>投稿应为你本人的真实经历，请勿搬运、抄袭或虚构故事冒充真实投稿；</li>
          <li>请勿发布未经他人许可的聊天记录、照片、姓名、学校、单位等可识别个人信息；</li>
          <li>正式版中，公开发布的投稿会先经过审核，审核通过后才会出现在公开列表；</li>
          <li>请根据内容真实选择分类与标签，不要为了曝光堆砌不相关的标签；</li>
          <li>含有违法、攻击、歧视、骚扰、色情或引流广告内容的投稿，不予发布；</li>
          <li>当前版本中，投稿仅保存在你自己浏览器的 localStorage 中，其他用户无法看到。</li>
        </ul>
      </section>

      <section id="privacy" class="about-section">
        <span class="draft-note">草案 · 不构成法律意见，正式版前需核实</span>
        <h2>隐私政策</h2>
        <h3>我们如何理解「匿名」</h3>
        <p>
          匿名昵称是前台展示形式，指其他用户看不到你的真实身份标识；但它不等于技术上完全不可追踪。正式版会在你投稿前，以通俗方式说明实际收集的信息范围。
        </p>
        <h3>故事的公开范围</h3>
        <p>
          正式版将区分四种状态：待审核、公开、仅自己可见、已撤回 / 已删除。未经审核的内容不会进入公开列表；「仅自己可见」内容由后端权限控制保护，而不是仅靠页面前端隐藏。
        </p>
        <h3>搜索引擎收录</h3>
        <p>
          只有审核通过、公开展示且你授权收录的故事，才可能出现在 Sitemap 中并被搜索引擎获取。「noindex」标签不是权限控制手段，不能替代访问控制。
        </p>
        <h3>当前版本</h3>
        <p>当前版本不收集、不上传任何数据到服务器；所有内容仅保存在你的浏览器本地，清除浏览器数据后将无法找回。</p>
      </section>

      <section id="terms" class="about-section">
        <span class="draft-note">草案 · 待运营主体确定后完善</span>
        <h2>用户协议</h2>
        <ul>
          <li>你应对自己发布内容的真实性与合法性负责，并确认拥有相应的发布与授权；</li>
          <li>你授予社区在投稿时所约定范围内展示、整理故事内容的权利；约定范围外不使用；</li>
          <li>禁止利用社区从事违法违规、侵犯他人权益、垃圾营销或破坏社区氛围的行为；</li>
          <li>对于违反规则的内容与账号，正式版将依据审核流程进行隐藏、删除或限制处理；</li>
          <li>社区在开发阶段免费提供，未来如调整服务方式，将提前在显著位置告知。</li>
        </ul>
      </section>

      <section id="report" class="about-section">
        <span class="draft-note">流程待后端接入后启用</span>
        <h2>内容举报</h2>
        <p>
          如果你在故事或评论中发现违法违规、侵犯隐私、人身攻击或垃圾信息，可以通过详情页的「举报」入口提交。正式版的举报将直达内容审核团队，处理进度与结果会按规则反馈，并对举报信息保密。
        </p>
        <p>当前版本尚未接入举报通道（点击举报按钮会看到相应提示），请勿误以为举报已经发出。</p>
      </section>

      <section id="withdraw" class="about-section">
        <span class="draft-note">草案</span>
        <h2>撤稿与删除</h2>
        <ul>
          <li>你可以随时申请撤回或删除自己的故事；正式版将提供自助撤稿入口与处理时限说明；</li>
          <li>故事删除后，将从公开列表与后续 Sitemap 中移除；已被他人分享或搜索引擎缓存的内容，其移除需要相应平台处理时间；</li>
          <li>当前版本中，你可以直接清除浏览器数据来删除本机保存的故事。</li>
        </ul>
      </section>

      <section id="contact" class="about-section">
        <span class="draft-note">正式渠道确定前不展示虚构联系方式</span>
        <h2>联系方式</h2>
        <p>
          运营主体、联系邮箱与反馈渠道将在正式上线前于本页公布。在此之前，本页不会填写虚构的公司名称、地址、备案号或联系方式。
        </p>
      </section>
    </div>
  </div>
</template>
