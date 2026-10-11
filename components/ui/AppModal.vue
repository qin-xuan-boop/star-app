<script setup lang="ts">
// 全局弹窗容器（由 useModal().openModal 触发；正文为纯文本，安全渲染）
import type { ModalAction } from '~/composables/useModal'

const { modal, closeModal } = useModal()

function handle(a: ModalAction) {
  if (a.onClick) a.onClick()
  else closeModal()
}
</script>

<template>
  <Teleport to="body">
    <div
      class="modal-mask"
      :class="{ open: modal.open }"
      role="dialog"
      aria-modal="true"
      @click.self="closeModal"
    >
      <div class="modal">
        <h3>{{ modal.title }}</h3>
        <div class="modal-body">
          <p v-for="(p, i) in modal.paragraphs" :key="i">{{ p }}</p>
        </div>
        <div class="modal-actions">
          <button
            v-for="(a, i) in modal.actions"
            :key="i"
            type="button"
            class="btn btn-sm"
            :class="a.primary ? 'btn-primary' : 'btn-ghost'"
            @click="handle(a)"
          >
            {{ a.label }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
