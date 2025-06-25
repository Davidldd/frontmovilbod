import { nextTick } from "vue"

export function useBootstrapModal() {
  const showModal = async (modalId) => {
    try {
      await nextTick()
      const modalElement = document.getElementById(modalId)

      if (!modalElement) {
        console.warn(`Modal element with id "${modalId}" not found`)
        return null
      }

      // Verificar si Bootstrap está disponible
      if (!window.bootstrap || !window.bootstrap.Modal) {
        console.warn("Bootstrap Modal not available")
        return null
      }

      const modal = new window.bootstrap.Modal(modalElement)
      modal.show()
      return modal
    } catch (error) {
      console.error(`Error showing modal ${modalId}:`, error)
      return null
    }
  }

  const hideModal = async (modalId) => {
    try {
      const modalElement = document.getElementById(modalId)

      if (!modalElement) {
        console.warn(`Modal element with id "${modalId}" not found`)
        return
      }

      if (!window.bootstrap || !window.bootstrap.Modal) {
        console.warn("Bootstrap Modal not available")
        return
      }

      const modal = window.bootstrap.Modal.getInstance(modalElement)
      if (modal) {
        modal.hide()
      }
    } catch (error) {
      console.error(`Error hiding modal ${modalId}:`, error)
    }
  }

  const getModalInstance = (modalId) => {
    try {
      const modalElement = document.getElementById(modalId)

      if (!modalElement || !window.bootstrap || !window.bootstrap.Modal) {
        return null
      }

      return window.bootstrap.Modal.getInstance(modalElement)
    } catch (error) {
      console.error(`Error getting modal instance ${modalId}:`, error)
      return null
    }
  }

  return {
    showModal,
    hideModal,
    getModalInstance,
  }
}
