import { defineStore } from "pinia"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isAuthenticated: false,
    role: null,
  }),

  getters: {
    isRoot: (state) => state.role === "root",
    isAdmin: (state) => state.role === "admin" || state.role === "root",
    userName: (state) => state.user?.name || "Usuario",
  },

  actions: {
    login(userData) {
      this.user = userData
      this.isAuthenticated = true
      this.role = userData.role || "user"
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      this.role = null
    },

    setRole(role) {
      this.role = role
    },
  },
})
