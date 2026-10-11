// 全局弹窗 Modal（由 <AppModal /> 渲染；body 为纯文本数组，安全渲染）
export interface ModalAction {
  label: string
  primary?: boolean
  onClick?: () => void
}
export interface ModalState {
  open: boolean
  title: string
  paragraphs: string[]
  actions: ModalAction[]
}

const initialState = (): ModalState => ({
  open: false,
  title: '',
  paragraphs: [],
  actions: []
})

export const useModal = () => {
  const modal = useState<ModalState>('app-modal', initialState)

  function openModal(opts: { title?: string; body?: string | string[]; actions?: ModalAction[] }) {
    modal.value = {
      open: true,
      title: opts.title || '提示',
      paragraphs: Array.isArray(opts.body) ? opts.body : opts.body ? [opts.body] : [],
      actions: opts.actions?.length ? opts.actions : [{ label: '我知道了', primary: true }]
    }
  }

  function closeModal() {
    modal.value.open = false
  }

  return { modal, openModal, closeModal }
}
