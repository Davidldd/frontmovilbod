import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import { createRouter, createWebHistory } from "vue-router"
import routes from "./router/index"

// Importar Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.min.css"

import "./style.css"

// Función para cargar Bootstrap JS de forma asíncrona
const loadBootstrap = async () => {
  try {
    const bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js")
    window.bootstrap = bootstrap.default || bootstrap
    console.log("✅ Bootstrap JS cargado correctamente")
    return true
  } catch (error) {
    console.warn("⚠️ Error cargando Bootstrap JS:", error)
    return false
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const pinia = createPinia()

// Crear la app
const app = createApp(App)

// Cargar Bootstrap antes de montar la app
loadBootstrap().then(() => {
  app.use(router).use(pinia).mount("#app")
})
