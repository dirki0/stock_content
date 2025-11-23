import LoadingModal from '../components/LoadingModal.vue'

export function useLoadingModal () {
  const overlay = useOverlay()

  const loadingModal = overlay.create(LoadingModal)

  const openLoadingModal = async ({ description, title }: { description?: string, title: string }) => {
    return loadingModal.open({
      description,
      title,
    })
  }

  const closeLoadingModal = async () => {
    return loadingModal.close()
  }

  return {
    closeLoadingModal,
    openLoadingModal,
  }
}
