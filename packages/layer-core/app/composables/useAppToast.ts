interface ToastOptions {
  description?: string
  icon?: string
  title: string
}

export function useAppToast () {
  const toast = useToast()

  const showSuccessToast = (options: ToastOptions) => {
    toast.add({
      color: 'success',
      description: options.description,
      icon: options.icon ?? 'i-lucide-info',
      title: options.title,
    })
  }

  const showWarnToast = (options: ToastOptions) => {
    toast.add({
      color: 'warning',
      description: options.description,
      icon: options.icon ?? 'i-lucide-info',
      title: options.title,
    })
  }

  const showInfoToast = (options: ToastOptions) => {
    toast.add({
      color: 'secondary',
      description: options.description,
      icon: options.icon ?? 'i-lucide-info',
      title: options.title,
    })
  }

  const showErrorToast = (title: string, error?: any, description?: string, icon?: string) => {
    const toastDescription = description ?? error?.statusMessage ?? error?.message

    toast.add({
      color: 'error',
      description: toastDescription,
      duration: 5000,
      icon: icon ?? 'i-lucide-circle-alert',
      title,
    })
  }

  return {
    showErrorToast,
    showInfoToast,
    showSuccessToast,
    showWarnToast,
  }
}
