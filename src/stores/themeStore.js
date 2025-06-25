import { defineStore } from "pinia"

export const useThemeStore = defineStore("theme", {
  state: () => ({
    isDark: false,
    sidebarCollapsed: false,
  }),

  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      this.applyTheme()
    },

    applyTheme() {
      const root = document.documentElement
      const body = document.body

      if (this.isDark) {
        body.classList.add("dark-theme")
        root.setAttribute("data-bs-theme", "dark")

        // Paleta MovilBod Dark (ajustada para mejor contraste)
        // Usaremos los colores base de style.css y los adaptaremos o usaremos variantes más claras si es necesario
        // --primary-color: #6b46c1; (Púrpura MovilBod)
        // --secondary-color: #0bc5ea; (Cyan MovilBod)
        // --accent-color: #9ae6b4; (Verde Menta MovilBod)

        // Fondos principales
        root.style.setProperty("--bs-body-bg", "#1a202c") // Un gris azulado oscuro (de style.css --gray-800)
        root.style.setProperty("--main-content-bg", "#171923") // Más oscuro (de style.css --gray-900)

        // Fondos de componentes (cards, dropdowns, etc.)
        root.style.setProperty("--card-bg", "#2d3748") // Gris medio oscuro (de style.css --gray-700)
        root.style.setProperty("--dropdown-bg", "#2d3748")
        root.style.setProperty("--topbar-bg", "#1a202c") // Mismo que body-bg o un poco más claro

        // Colores de texto
        root.style.setProperty("--bs-body-color", "#e2e8f0") // Gris muy claro (de style.css --gray-200)
        root.style.setProperty("--text-color", "#f7fafc") // Casi blanco (de style.css --gray-50)
        root.style.setProperty("--text-muted", "#a0aec0") // Gris claro (de style.css --gray-400)
        root.style.setProperty("--bs-heading-color", "#f7fafc")

        // Bordes
        root.style.setProperty("--bs-border-color", "#4a5568") // Gris oscuro para bordes (de style.css --gray-600)
        root.style.setProperty("--bs-border-color-translucent", "rgba(247, 250, 252, 0.15)")

        // Adaptación de colores de Bootstrap y personalizados
        // El data-bs-theme="dark" ya ajusta muchos colores de Bootstrap.
        // Sobrescribimos selectivamente si es necesario para la paleta MovilBod.

        // Primario MovilBod (Púrpura) - hacerlo un poco más brillante para dark mode si es necesario
        // root.style.setProperty("--bs-primary", "#8b5cf6"); // --primary-light de style.css
        // root.style.setProperty("--bs-primary-rgb", "139, 92, 246");
        // Por ahora, dejaremos que data-bs-theme="dark" maneje el primario, pero es una opción.

        // Grises de Bootstrap (adaptados de la paleta de style.css)
        root.style.setProperty("--bs-gray-100", "#f7fafc") // Lightest gray
        root.style.setProperty("--bs-gray-200", "#edf2f7")
        root.style.setProperty("--bs-gray-300", "#e2e8f0")
        root.style.setProperty("--bs-gray-400", "#cbd5e0")
        root.style.setProperty("--bs-gray-500", "#a0aec0") // Mid gray
        root.style.setProperty("--bs-gray-600", "#718096")
        root.style.setProperty("--bs-gray-700", "#4a5568")
        root.style.setProperty("--bs-gray-800", "#2d3748")
        root.style.setProperty("--bs-gray-900", "#1a202c") // Darkest gray
      } else {
        body.classList.remove("dark-theme")
        root.setAttribute("data-bs-theme", "light")

        // Remover los estilos inline para volver a los defaults de Bootstrap/CSS
        const propertiesToRemove = [
          "--bs-body-bg",
          "--main-content-bg",
          "--card-bg",
          "--dropdown-bg",
          "--topbar-bg",
          "--bs-body-color",
          "--text-color",
          "--text-muted",
          "--bs-heading-color",
          "--bs-border-color",
          "--bs-border-color-translucent",
          "--bs-primary",
          "--bs-primary-rgb",
          "--bs-gray-100",
          "--bs-gray-200",
          "--bs-gray-300",
          "--bs-gray-400",
          "--bs-gray-500",
          "--bs-gray-600",
          "--bs-gray-700",
          "--bs-gray-800",
          "--bs-gray-900",
        ]
        propertiesToRemove.forEach((prop) => root.style.removeProperty(prop))
      }
    },

    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    setSidebarCollapsed(collapsed) {
      this.sidebarCollapsed = collapsed
    },

    initializeTheme() {
      // Aplicar tema inicial basado en preferencia del sistema o guardado
      // Por ahora, forzamos light o el estado actual
      this.applyTheme()
    },
  },
})
