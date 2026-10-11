// 全局轻提示 Toast（由 <ToastHost /> 渲染）
export type ToastType = '' | 'success' | 'error'
export interface ToastItem {
  id: number
  message: string
  type: ToastType
}

let toastSeed = 0

export const useToast = () => {
  const toasts = useState<ToastItem[]>('toasts', () => [])

  function remove(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function toast(message: string, type: ToastType = '') {
    const id = ++toastSeed
    toasts.value = [...toasts.value, { id, message, type }]
    setTimeout(() => remove(id), 2200)
  }

  return { toasts, toast, removeToast: remove }
}
