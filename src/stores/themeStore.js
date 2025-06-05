import { defineStore } from "pinia"

export const useThemeStore = defineStore("theme", {
  state: () => ({
    isDark: false,
    sidebarCollapsed: false,
  }),

  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      document.documentElement.setAttribute("data-bs-theme", this.isDark ? "dark" : "light")
    },

    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    setSidebarCollapsed(collapsed) {
      this.sidebarCollapsed = collapsed
    },
  },
})
