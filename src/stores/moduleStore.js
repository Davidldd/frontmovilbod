import { defineStore } from "pinia"

export const useModuleStore = defineStore("modules", {
  state: () => ({
    modules: {
      crm: {
        id: "crm",
        name: "CRM",
        icon: "bi-people",
        active: true,
        description: "Gestión de relaciones con clientes",
      },
      inventory: {
        id: "inventory",
        name: "Inventarios",
        icon: "bi-boxes",
        active: true,
        description: "Control de stock y productos",
      },
      billing: {
        id: "billing",
        name: "Facturación",
        icon: "bi-receipt",
        active: true,
        description: "Gestión de facturas y pagos",
      },
      accounting: {
        id: "accounting",
        name: "Contabilidad",
        icon: "bi-calculator",
        active: true,
        description: "Plan de cuentas y estados financieros",
      },
      purchases: {
        id: "purchases",
        name: "Compras",
        icon: "bi-cart-plus",
        active: true,
        description: "Órdenes de compra y proveedores",
      },
      sales: {
        id: "sales",
        name: "Ventas",
        icon: "bi-graph-up",
        active: true,
        description: "Órdenes de venta y cotizaciones",
      },
      reports: {
        id: "reports",
        name: "Reportes",
        icon: "bi-file-earmark-bar-graph",
        active: true,
        description: "Informes y análisis",
      },
    },
  }),

  getters: {
    activeModules: (state) => {
      return Object.values(state.modules).filter((module) => module.active)
    },

    isModuleActive: (state) => (moduleId) => {
      return state.modules[moduleId]?.active || false
    },

    getModule: (state) => (moduleId) => {
      return state.modules[moduleId]
    },
  },

  actions: {
    toggleModule(moduleId) {
      if (this.modules[moduleId]) {
        this.modules[moduleId].active = !this.modules[moduleId].active
      }
    },

    activateModule(moduleId) {
      if (this.modules[moduleId]) {
        this.modules[moduleId].active = true
      }
    },

    deactivateModule(moduleId) {
      if (this.modules[moduleId]) {
        this.modules[moduleId].active = false
      }
    },

    updateModuleConfig(config) {
      Object.keys(config).forEach((moduleId) => {
        if (this.modules[moduleId]) {
          this.modules[moduleId].active = config[moduleId]
        }
      })
    },
  },
})
