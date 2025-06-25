import { ref, onMounted, nextTick } from "vue"

export function useBootstrap() {
  const isBootstrapLoaded = ref(false)
  const bootstrapError = ref(null)

  const waitForBootstrap = async (maxAttempts = 20, delay = 100) => {
    for (let i = 0; i < maxAttempts; i++) {
      if (typeof window !== "undefined" && window.bootstrap && window.bootstrap.Dropdown) {
        isBootstrapLoaded.value = true
        return true
      }
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
    return false
  }

  const initializeDropdowns = async () => {
    try {
      await nextTick()
      const success = await waitForBootstrap()

      if (success) {
        console.log("✅ Inicializando dropdowns...")

        // Inicializar todos los dropdowns
        const dropdownElements = document.querySelectorAll('[data-bs-toggle="dropdown"]')

        dropdownElements.forEach((element) => {
          try {
            // Verificar si ya tiene una instancia
            const existingInstance = window.bootstrap.Dropdown.getInstance(element)
            if (!existingInstance) {
              new window.bootstrap.Dropdown(element)
              console.log("✅ Dropdown inicializado:", element.id || element.className)
            }
          } catch (error) {
            console.warn("⚠️ Error inicializando dropdown:", error)
          }
        })

        return true
      } else {
        console.warn("⚠️ Bootstrap no disponible, usando fallback CSS")
        return false
      }
    } catch (error) {
      console.error("❌ Error inicializando dropdowns:", error)
      bootstrapError.value = error.message
      return false
    }
  }

  const showModal = (modalId) => {
    if (window.bootstrap && window.bootstrap.Modal) {
      const modalElement = document.getElementById(modalId)
      if (modalElement) {
        const modal = new window.bootstrap.Modal(modalElement)
        modal.show()
        return modal
      }
    }
    console.warn(`⚠️ No se pudo mostrar el modal: ${modalId}`)
    return null
  }

  const hideModal = (modalId) => {
    if (window.bootstrap && window.bootstrap.Modal) {
      const modalElement = document.getElementById(modalId)
      if (modalElement) {
        const modal = window.bootstrap.Modal.getInstance(modalElement)
        if (modal) {
          modal.hide()
          return true
        }
      }
    }
    return false
  }

  const toggleDropdown = (elementId) => {
    if (window.bootstrap && window.bootstrap.Dropdown) {
      const element = document.getElementById(elementId)
      if (element) {
        const dropdown = window.bootstrap.Dropdown.getInstance(element) || new window.bootstrap.Dropdown(element)
        dropdown.toggle()
        return true
      }
    }
    return false
  }

  const hideDropdown = (elementId) => {
    if (window.bootstrap && window.bootstrap.Dropdown) {
      const element = document.getElementById(elementId)
      if (element) {
        const dropdown = window.bootstrap.Dropdown.getInstance(element)
        if (dropdown) {
          dropdown.hide()
          return true
        }
      }
    }
    return false
  }

  onMounted(() => {
    // Esperar un poco más para asegurar que Bootstrap esté cargado
    setTimeout(() => {
      initializeDropdowns()
    }, 500)
  })

  return {
    isBootstrapLoaded,
    bootstrapError,
    initializeDropdowns,
    showModal,
    hideModal,
    toggleDropdown,
    hideDropdown,
    waitForBootstrap,
  }
}
