import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import  'bootstrap-icons/font/bootstrap-icons.min.css'
import routes from './router/index'

const router = createRouter({
    history: createWebHistory(),
    routes
})


createApp(App).use(router).mount('#app')
