import ConfirmationModal from '../components/ConfirmationModal.vue'

export function useConfirmationModal () {
  const overlay = useOverlay()
  const { t } = useI18n()

  const confirmationModal = overlay.create(ConfirmationModal)

  const openConfirmationModal = async ({ cancelLabel, confirmButtonColor, confirmLabel, description, title }: { cancelLabel?: string, confirmButtonColor?: 'error' | 'info' | 'neutral' | 'primary' | 'secondary' | 'success' | 'warning', confirmLabel?: string, description?: string, title: string }) => {
    return new Promise((resolve) => {
      confirmationModal.open({
        cancelLabel,
        confirmButtonColor,
        confirmLabel,
        description,
        onCancel: () => {
          resolve(false)
        },
        onConfirm: () => {
          resolve(true)
        },
        open: true,
        title,
      })
    })
  }

  const openDeleteConfirmationModal = async ({ description, title }: { description?: string, title: string }) => {
    return new Promise((resolve) => {
      confirmationModal.open({
        confirmButtonColor: 'error',
        confirmLabel: t('general.delete'),
        description,
        onCancel: () => {
          resolve(false)
        },
        onConfirm: () => {
          resolve(true)
        },
        open: true,
        title,
      })
    })
  }

  return {
    openConfirmationModal,
    openDeleteConfirmationModal,
  }
}
