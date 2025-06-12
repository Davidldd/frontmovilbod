<template>
  <div class="dashboard-layout" :class="{ 'sidebar-collapsed': themeStore.sidebarCollapsed, 'dark-theme': themeStore.isDark }">
    <!-- Mobile Overlay -->
    <div 
      v-if="showMobileMenu" 
      class="mobile-overlay" 
      @click="closeMobileMenu"
    ></div>

    <!-- Sidebar -->
    <nav class="sidebar" :class="{ 'collapsed': themeStore.sidebarCollapsed, 'mobile-open': showMobileMenu }">
      <div class="sidebar-header">
        <div class="brand">
          <div class="brand-logo">
            <i class="bi bi-minecart-loaded"></i>
          </div>
          <div class="brand-info">
            <span class="brand-text">MovilBod</span>
            <span class="brand-subtitle">ERP System</span>
          </div>
        </div>
        <button 
          class="mobile-close d-lg-none" 
          @click="closeMobileMenu"
          aria-label="Cerrar menú"
        >
          <i class="bi bi-x"></i>
        </button>
      </div>

      <div class="sidebar-content">
        <!-- Dashboard -->
        <div class="nav-section">
          <router-link to="/dashboard" class="nav-item single-item" :class="{ active: $route.path === '/dashboard' }" @click="closeMobileMenu">
            <div class="nav-icon">
              <i class="bi bi-house-door"></i>
            </div>
            <span class="nav-text">Dashboard</span>
          </router-link>
        </div>

        <!-- Dynamic Modules with Dropdowns -->
        <div v-for="module in activeModules" :key="module.id" class="nav-section">
          <div class="nav-module" :class="{ 'expanded': expandedModules[module.id] }">
            <button 
              class="nav-module-toggle" 
              @click="toggleModule(module.id)"
              :aria-expanded="expandedModules[module.id]"
            >
              <div class="nav-icon">
                <i :class="getModuleIcon(module.id)"></i>
              </div>
              <span class="nav-text">{{ module.name }}</span>
              <div class="nav-arrow">
                <i class="bi bi-chevron-down"></i>
              </div>
            </button>
            
            <div 
              class="nav-submenu" 
              v-show="(expandedModules[module.id] && !themeStore.sidebarCollapsed) || (!themeStore.sidebarCollapsed && isModuleActive(module.id))"
            >
              <!-- CRM Module -->
              <template v-if="module.id === 'crm'">
                <router-link to="/crm/dashboard" class="nav-subitem" :class="{ active: $route.path.startsWith('/crm/dashboard') }" @click="closeMobileMenu">
                  <i class="bi bi-graph-up-arrow"></i>
                  <span>Dashboard</span>
                </router-link>
                <router-link to="/crm/contacts" class="nav-subitem" :class="{ active: $route.path.startsWith('/crm/contacts') }" @click="closeMobileMenu">
                  <i class="bi bi-people"></i>
                  <span>Contactos</span>
                </router-link>
                <router-link to="/crm/companies" class="nav-subitem" :class="{ active: $route.path.startsWith('/crm/companies') }" @click="closeMobileMenu">
                  <i class="bi bi-building"></i>
                  <span>Empresas</span>
                </router-link>
                <router-link to="/crm/leads" class="nav-subitem" :class="{ active: $route.path.startsWith('/crm/leads') }" @click="closeMobileMenu">
                  <i class="bi bi-person-plus"></i>
                  <span>Leads</span>
                </router-link>
                <router-link to="/crm/opportunities" class="nav-subitem" :class="{ active: $route.path.startsWith('/crm/opportunities') }" @click="closeMobileMenu">
                  <i class="bi bi-bullseye"></i>
                  <span>Oportunidades</span>
                </router-link>
                <router-link to="/crm/tasks" class="nav-subitem" :class="{ active: $route.path.startsWith('/crm/tasks') }" @click="closeMobileMenu">
                  <i class="bi bi-list-task"></i>
                  <span>Tareas</span>
                </router-link>
              </template>

              <!-- Inventory Module -->
              <template v-if="module.id === 'inventory'">
                <router-link to="/inventory/dashboard" class="nav-subitem" :class="{ active: $route.path.startsWith('/inventory/dashboard') }" @click="closeMobileMenu">
                  <i class="bi bi-graph-up-arrow"></i>
                  <span>Dashboard</span>
                </router-link>
                <router-link to="/inventory/stock" class="nav-subitem" :class="{ active: $route.path.startsWith('/inventory/stock') }" @click="closeMobileMenu">
                  <i class="bi bi-boxes"></i>
                  <span>Stock</span>
                </router-link>
                <router-link to="/catalog/products" class="nav-subitem" :class="{ active: $route.path.startsWith('/catalog/products') }" @click="closeMobileMenu">
                  <i class="bi bi-box-seam"></i>
                  <span>Productos</span>
                </router-link>
                <router-link to="/catalog/categories" class="nav-subitem" :class="{ active: $route.path.startsWith('/catalog/categories') }" @click="closeMobileMenu">
                  <i class="bi bi-tags"></i>
                  <span>Categorías</span>
                </router-link>
                <router-link to="/inventory/locations" class="nav-subitem" :class="{ active: $route.path.startsWith('/inventory/locations') }" @click="closeMobileMenu">
                  <i class="bi bi-geo-alt"></i>
                  <span>Ubicaciones</span>
                </router-link>
                <router-link to="/inventory/input" class="nav-subitem" :class="{ active: $route.path.startsWith('/inventory/input') }" @click="closeMobileMenu">
                  <i class="bi bi-box-arrow-in-down"></i>
                  <span>Entradas</span>
                </router-link>
                <router-link to="/inventory/output" class="nav-subitem" :class="{ active: $route.path.startsWith('/inventory/output') }" @click="closeMobileMenu">
                  <i class="bi bi-box-arrow-up"></i>
                  <span>Salidas</span>
                </router-link>
                <router-link to="/inventory/transfer" class="nav-subitem" :class="{ active: $route.path.startsWith('/inventory/transfer') }" @click="closeMobileMenu">
                  <i class="bi bi-arrow-left-right"></i>
                  <span>Transferencias</span>
                </router-link>
                <router-link to="/inventory/adjustment" class="nav-subitem" :class="{ active: $route.path.startsWith('/inventory/adjustment') }" @click="closeMobileMenu">
                  <i class="bi bi-pencil-square"></i>
                  <span>Ajustes</span>
                </router-link>
                <router-link to="/inventory/alerts" class="nav-subitem" :class="{ active: $route.path.startsWith('/inventory/alerts') }" @click="closeMobileMenu">
                  <i class="bi bi-exclamation-triangle"></i>
                  <span>Alertas</span>
                </router-link>
              </template>

              <!-- Billing Module -->
              <template v-if="module.id === 'billing'">
                <router-link to="/billing/dashboard" class="nav-subitem" :class="{ active: $route.path.startsWith('/billing/dashboard') }" @click="closeMobileMenu">
                  <i class="bi bi-graph-up-arrow"></i>
                  <span>Dashboard</span>
                </router-link>
                <router-link to="/billing/invoices" class="nav-subitem" :class="{ active: $route.path.startsWith('/billing/invoices') }" @click="closeMobileMenu">
                  <i class="bi bi-receipt"></i>
                  <span>Facturas</span>
                </router-link>
                <router-link to="/billing/credit-notes" class="nav-subitem" :class="{ active: $route.path.startsWith('/billing/credit-notes') }" @click="closeMobileMenu">
                  <i class="bi bi-file-earmark-minus"></i>
                  <span>Notas Crédito</span>
                </router-link>
                <router-link to="/billing/payments" class="nav-subitem" :class="{ active: $route.path.startsWith('/billing/payments') }" @click="closeMobileMenu">
                  <i class="bi bi-credit-card"></i>
                  <span>Pagos</span>
                </router-link>
              </template>

              <!-- Accounting Module -->
              <template v-if="module.id === 'accounting'">
                <router-link to="/accounting/dashboard" class="nav-subitem" :class="{ active: $route.path.startsWith('/accounting/dashboard') }" @click="closeMobileMenu">
                  <i class="bi bi-graph-up-arrow"></i>
                  <span>Dashboard</span>
                </router-link>
                <router-link to="/accounting/chart-of-accounts" class="nav-subitem" :class="{ active: $route.path.startsWith('/accounting/chart-of-accounts') || $route.path.startsWith('/accounting/account') }" @click="closeMobileMenu">
                  <i class="bi bi-list-columns-reverse"></i>
                  <span>Plan de Cuentas</span>
                </router-link>
                <router-link to="/accounting/journal-entries" class="nav-subitem" :class="{ active: $route.path.startsWith('/accounting/journal-entries') || $route.path.startsWith('/accounting/journal-entry') }" @click="closeMobileMenu">
                  <i class="bi bi-journal-text"></i>
                  <span>Comprobantes</span>
                </router-link>
                <router-link to="/accounting/cost-centers" class="nav-subitem" :class="{ active: $route.path.startsWith('/accounting/cost-centers') }" @click="closeMobileMenu">
                  <i class="bi bi-diagram-3"></i>
                  <span>Centros de Costo</span>
                </router-link>
                <router-link to="/accounting/reports/trial-balance" class="nav-subitem" :class="{ active: $route.path.startsWith('/accounting/reports/trial-balance') }" @click="closeMobileMenu">
                  <i class="bi bi-file-spreadsheet"></i>
                  <span>Balance de Prueba</span>
                </router-link>
              </template>

              <!-- Purchases Module -->
              <template v-if="module.id === 'purchases'">
                <router-link to="/purchases/dashboard" class="nav-subitem" :class="{ active: $route.path.startsWith('/purchases/dashboard') }" @click="closeMobileMenu">
                  <i class="bi bi-graph-up-arrow"></i>
                  <span>Dashboard</span>
                </router-link>
                <router-link to="/purchases/suppliers" class="nav-subitem" :class="{ active: $route.path.startsWith('/purchases/suppliers') || $route.path.startsWith('/purchases/supplier/') }" @click="closeMobileMenu">
                  <i class="bi bi-truck"></i>
                  <span>Proveedores</span>
                </router-link>
                <router-link to="/purchases/orders" class="nav-subitem" :class="{ active: $route.path.startsWith('/purchases/orders') || $route.path.startsWith('/purchases/order/') }" @click="closeMobileMenu">
                  <i class="bi bi-file-earmark-text"></i>
                  <span>Órdenes de Compra</span>
                </router-link>
                <router-link to="/purchases/receipts" class="nav-subitem" :class="{ active: $route.path.startsWith('/purchases/receipts') }" @click="closeMobileMenu">
                  <i class="bi bi-box-arrow-in-down"></i>
                  <span>Recepciones</span>
                </router-link>
                <router-link to="/purchases/supplier-invoices" class="nav-subitem" :class="{ active: $route.path.startsWith('/purchases/supplier-invoices') }" @click="closeMobileMenu">
                  <i class="bi bi-receipt-cutoff"></i>
                  <span>Facturas Proveedor</span>
                </router-link>
              </template>

              <!-- Sales Module -->
              <template v-if="module.id === 'sales'">
                <router-link to="/sales/dashboard" class="nav-subitem" :class="{ active: $route.path.startsWith('/sales/dashboard') }" @click="closeMobileMenu">
                  <i class="bi bi-graph-up-arrow"></i>
                  <span>Dashboard</span>
                </router-link>
                <router-link to="/sales/customers" class="nav-subitem" :class="{ active: $route.path.startsWith('/sales/customers') || $route.path.startsWith('/sales/customer/') }" @click="closeMobileMenu">
                  <i class="bi bi-people"></i>
                  <span>Clientes</span>
                </router-link>
                <router-link to="/sales/quotations" class="nav-subitem" :class="{ active: $route.path.startsWith('/sales/quotations') || $route.path.startsWith('/sales/quotation/') }" @click="closeMobileMenu">
                  <i class="bi bi-file-text"></i>
                  <span>Cotizaciones</span>
                </router-link>
                <router-link to="/sales/orders" class="nav-subitem" :class="{ active: $route.path.startsWith('/sales/orders') || $route.path.startsWith('/sales/order/') }" @click="closeMobileMenu">
                  <i class="bi bi-cart-check"></i>
                  <span>Órdenes de Venta</span>
                </router-link>
                <router-link to="/sales/deliveries" class="nav-subitem" :class="{ active: $route.path.startsWith('/sales/deliveries') || $route.path.startsWith('/sales/delivery/') }" @click="closeMobileMenu">
                  <i class="bi bi-truck"></i>
                  <span>Despachos</span>
                </router-link>
              </template>

              <!-- Reports Module -->
              <template v-if="module.id === 'reports'">
                <router-link to="/reports/dashboard" class="nav-subitem" :class="{ active: $route.path.startsWith('/reports/dashboard') }" @click="closeMobileMenu">
                  <i class="bi bi-graph-up-arrow"></i>
                  <span>Dashboard</span>
                </router-link>
                <router-link to="/reports/sales" class="nav-subitem" :class="{ active: $route.path.startsWith('/reports/sales') }" @click="closeMobileMenu">
                  <i class="bi bi-bar-chart"></i>
                  <span>Reportes de Ventas</span>
                </router-link>
                <router-link to="/reports/inventory" class="nav-subitem" :class="{ active: $route.path.startsWith('/reports/inventory') }" @click="closeMobileMenu">
                  <i class="bi bi-boxes"></i>
                  <span>Reportes de Inventario</span>
                </router-link>
                <router-link to="/reports/financial" class="nav-subitem" :class="{ active: $route.path.startsWith('/reports/financial') }" @click="closeMobileMenu">
                  <i class="bi bi-graph-up"></i>
                  <span>Reportes Financieros</span>
                </router-link>
                <router-link to="/reports/custom" class="nav-subitem" :class="{ active: $route.path.startsWith('/reports/custom') }" @click="closeMobileMenu">
                  <i class="bi bi-file-earmark-bar-graph"></i>
                  <span>Reportes Personalizados</span>
                </router-link>
                <router-link to="/reports/builder" class="nav-subitem" :class="{ active: $route.path.startsWith('/reports/builder') }" @click="closeMobileMenu">
                  <i class="bi bi-tools"></i>
                  <span>Constructor de Reportes</span>
                </router-link>
              </template>
            </div>
          </div>
        </div>

        <!-- Configuration (Root only) -->
        <div v-if="authStore.isRoot" class="nav-section">
          <div class="nav-divider"></div>
          <router-link to="/config/modules" class="nav-item single-item" :class="{ active: $route.path.startsWith('/config/modules') }" @click="closeMobileMenu">
            <div class="nav-icon">
              <i class="bi bi-gear"></i>
            </div>
            <span class="nav-text">Configuración</span>
          </router-link>
        </div>
      </div>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <div class="user-info-sidebar" v-if="!themeStore.sidebarCollapsed">
          <div class="user-avatar-small">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%236B46C1'/%3E%3Ctext x='16' y='20' text-anchor='middle' fill='white' font-family='Arial' font-size='12'%3EU%3C/text%3E%3C/svg%3E" alt="Usuario">
          </div>
          <div class="user-details">
            <div class="user-name-small">{{ authStore.userName }}</div>
            <div class="user-role-small">{{ authStore.role }}</div>
          </div>
        </div>
        <button 
          class="sidebar-collapse-btn" 
          @click="themeStore.toggleSidebar()"
          :title="themeStore.sidebarCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'"
        >
          <i class="bi" :class="themeStore.sidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="main-wrapper">
      <!-- Top Bar -->
      <header class="topbar">
        <div class="topbar-left">
          <button class="btn btn-link sidebar-toggle d-lg-none" @click="toggleMobileMenu" aria-label="Abrir menú">
            <i class="bi bi-list"></i>
          </button>
          
          <!-- Breadcrumb -->
          <nav class="breadcrumb-nav d-none d-md-block">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <router-link to="/dashboard">
                  <i class="bi bi-house-door me-1"></i>Dashboard
                </router-link>
              </li>
              <li class="breadcrumb-item active" v-if="currentBreadcrumb">{{ currentBreadcrumb }}</li>
            </ol>
          </nav>
          
          <div class="search-box d-none d-lg-block">
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-search"></i>
              </span>
              <input 
                type="text" 
                class="form-control" 
                placeholder="Búsqueda global..."
                v-model="searchQuery"
                @keyup.enter="performSearch"
              >
            </div>
          </div>
        </div>

        <div class="topbar-right">
          <!-- Quick Actions -->
          <div class="quick-actions d-none d-xl-flex">
            <button class="btn btn-sm btn-outline-primary me-2" title="Nueva Factura">
              <i class="bi bi-plus-circle me-1"></i>Factura
            </button>
            <button class="btn btn-sm btn-outline-secondary" title="Nuevo Producto">
              <i class="bi bi-plus-circle me-1"></i>Producto
            </button>
          </div>

          <!-- Search Mobile -->
          <button class="btn btn-link topbar-btn d-lg-none" @click="toggleMobileSearch" title="Buscar">
            <i class="bi bi-search"></i>
          </button>

          <!-- Theme Toggle -->
          <button class="btn btn-link topbar-btn" @click="themeStore.toggleTheme()" title="Cambiar tema">
            <i class="bi" :class="themeStore.isDark ? 'bi-sun' : 'bi-moon'"></i>
          </button>

          <!-- Notifications -->
          <div class="dropdown">
            <button class="btn btn-link topbar-btn position-relative" data-bs-toggle="dropdown" aria-expanded="false" title="Notificaciones">
              <i class="bi bi-bell"></i>
              <span v-if="notifications.length > 0" class="notification-badge">
                {{ notifications.length > 9 ? '9+' : notifications.length }}
              </span>
            </button>
            <div class="dropdown-menu dropdown-menu-end notification-dropdown">
              <div class="dropdown-header d-flex justify-content-between align-items-center">
                <h6 class="mb-0">Notificaciones</h6>
                <button class="btn btn-sm btn-link text-primary p-0" v-if="notifications.length > 0">
                  Marcar como leídas
                </button>
              </div>
              <div class="notification-list">
                <div v-for="notification in notifications.slice(0, 5)" :key="notification.id" class="notification-item">
                  <div class="notification-icon" :class="getNotificationClass(notification.type)">
                    <i :class="getNotificationIcon(notification.type)"></i>
                  </div>
                  <div class="notification-content">
                    <div class="notification-title">{{ notification.title }}</div>
                    <div class="notification-text">{{ notification.message }}</div>
                    <div class="notification-time">{{ notification.time }}</div>
                  </div>
                </div>
                <div v-if="notifications.length === 0" class="dropdown-item text-center text-muted py-4">
                  <i class="bi bi-bell-slash fs-1 mb-2 d-block"></i>
                  No hay notificaciones nuevas.
                </div>
              </div>
              <div v-if="notifications.length > 0" class="dropdown-divider"></div>
              <a v-if="notifications.length > 0" class="dropdown-item text-center text-primary fw-medium" href="#">
                Ver todas las notificaciones
              </a>
            </div>
          </div>

          <!-- User Menu -->
          <div class="dropdown">
            <button class="btn btn-link user-menu-btn" data-bs-toggle="dropdown" aria-expanded="false">
              <div class="user-avatar">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%236B46C1'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-family='Arial' font-size='14'%3EU%3C/text%3E%3C/svg%3E" alt="Usuario">
                <div class="user-status"></div>
              </div>
              <div class="user-info d-none d-sm-block">
                <div class="user-name">{{ authStore.userName }}</div>
                <div class="user-role">{{ authStore.role }}</div>
              </div>
              <i class="bi bi-chevron-down d-none d-sm-inline"></i>
            </button>
            <div class="dropdown-menu dropdown-menu-end user-dropdown">
              <div class="dropdown-header">
                <div class="user-profile-header">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%236B46C1'/%3E%3Ctext x='24' y='30' text-anchor='middle' fill='white' font-family='Arial' font-size='16'%3EU%3C/text%3E%3C/svg%3E" class="user-avatar-large" alt="Usuario">
                  <div class="user-profile-info">
                    <div class="user-name-large">{{ authStore.userName }}</div>
                    <div class="user-email">usuario@movilbod.com</div>
                    <div class="user-role-badge">
                      <span class="badge bg-primary">{{ authStore.role }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <router-link to="/profile" class="dropdown-item" @click="closeMobileMenu">
                <i class="bi bi-person me-2"></i>Mi Perfil
              </router-link>
              <router-link to="/profile" class="dropdown-item" @click="closeMobileMenu">
                <i class="bi bi-gear me-2"></i>Configuración
              </router-link>
              <a class="dropdown-item" href="#" @click.prevent="showHelp">
                <i class="bi bi-question-circle me-2"></i>Ayuda
              </a>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item text-danger" @click="logout">
                <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Mobile Search -->
      <div v-if="showMobileSearch" class="mobile-search d-lg-none">
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>
          <input 
            type="text" 
            class="form-control" 
            placeholder="Búsqueda global..."
            v-model="searchQuery"
            @keyup.enter="performSearch"
            ref="mobileSearchInput"
          >
          <button class="btn btn-outline-secondary" @click="closeMobileSearch">
            <i class="bi bi-x"></i>
          </button>
        </div>
      </div>

      <!-- Page Content -->
      <main class="main-content">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useModuleStore } from '../stores/moduleStore'
import { useAuthStore } from '../stores/authStore'
import { useThemeStore } from '../stores/themeStore'

const router = useRouter()
const route = useRoute() 
const moduleStore = useModuleStore()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const searchQuery = ref('')
const showMobileMenu = ref(false)
const showMobileSearch = ref(false)
const mobileSearchInput = ref(null)
const expandedModules = ref({})

const activeModules = computed(() => moduleStore.activeModules)

const currentBreadcrumb = computed(() => {
  const path = route.path
  if (path.includes('/crm/')) return 'CRM'
  if (path.includes('/inventory/')) return 'Inventario'
  if (path.includes('/billing/')) return 'Facturación'
  if (path.includes('/accounting/')) return 'Contabilidad'
  if (path.includes('/purchases/')) return 'Compras'
  if (path.includes('/sales/')) return 'Ventas'
  if (path.includes('/reports/')) return 'Reportes'
  if (path.includes('/config/')) return 'Configuración'
  return null
})

const notifications = ref([
  {
    id: 1,
    type: 'success',
    title: 'Reporte Generado',
    message: 'El reporte de ventas mensual ha sido generado exitosamente.',
    time: 'Hace 5 min'
  },
  {
    id: 2,
    type: 'info',
    title: 'Orden Despachada',
    message: 'La orden #OV-0025 ha sido despachada exitosamente.',
    time: 'Hace 1 hora'
  },
  {
    id: 3,
    type: 'warning',
    title: 'Stock Bajo',
    message: 'El producto "Laptop Dell" tiene stock bajo (5 unidades).',
    time: 'Hace 2 horas'
  }
])

// Auto-expand active module
watch(() => route.path, (newPath) => {
  activeModules.value.forEach(module => {
    if (newPath.includes(`/${module.id}/`)) {
      expandedModules.value[module.id] = true
    }
  })
}, { immediate: true })

// Check if module is active based on current route
const isModuleActive = (moduleId) => {
  return route.path.includes(`/${moduleId}/`)
}

const getModuleIcon = (moduleId) => {
  const icons = {
    crm: 'bi bi-people-fill',
    inventory: 'bi bi-boxes',
    billing: 'bi bi-receipt',
    accounting: 'bi bi-calculator',
    purchases: 'bi bi-cart4',
    sales: 'bi bi-graph-up',
    reports: 'bi bi-bar-chart-fill'
  }
  return icons[moduleId] || 'bi bi-circle'
}

const getNotificationClass = (type) => {
  const classes = {
    success: 'notification-success',
    warning: 'notification-warning',
    error: 'notification-error',
    info: 'notification-info'
  }
  return classes[type] || 'notification-info'
}

const getNotificationIcon = (type) => {
  const icons = {
    success: 'bi bi-check-circle',
    warning: 'bi bi-exclamation-triangle',
    error: 'bi bi-x-circle',
    info: 'bi bi-info-circle'
  }
  return icons[type] || 'bi bi-info-circle'
}

const toggleModule = (moduleId) => {
  if (themeStore.sidebarCollapsed) {
    themeStore.toggleSidebar()
  }
  expandedModules.value[moduleId] = !expandedModules.value[moduleId]
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const toggleMobileSearch = async () => {
  showMobileSearch.value = !showMobileSearch.value
  if (showMobileSearch.value) {
    await nextTick()
    mobileSearchInput.value?.focus()
  }
}

const closeMobileSearch = () => {
  showMobileSearch.value = false
  searchQuery.value = ''
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/search', 
      query: { q: searchQuery.value }
    })
    closeMobileSearch()
  }
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const showHelp = () => {
  // Aquí se podría abrir un modal de ayuda o redirigir a documentación
  console.log('Mostrar ayuda')
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--background-color);
}

/* Mobile Overlay */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;
  backdrop-filter: blur(4px);
}

/* Sidebar */
.sidebar {
  width: 280px;
  background: linear-gradient(180deg, var(--primary-color) 0%, #553c9a 100%);
  color: white;
  transition: var(--transition-normal);
  position: fixed;
  height: 100vh;
  z-index: 1000;
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
}

.sidebar.collapsed {
  width: 70px;
}

/* Sidebar Header */
.sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-logo {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.brand-logo i {
  font-size: 1.5rem;
  color: var(--warning-color);
}

.brand-info {
  display: flex;
  flex-direction: column;
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
}

.brand-subtitle {
  font-size: 0.75rem;
  opacity: 0.7;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar.collapsed .brand-info {
  display: none;
}

.mobile-close {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 1.25rem;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  transition: var(--transition-fast);
}

.mobile-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Sidebar Content */
.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.nav-section {
  margin-bottom: 0.5rem;
}

/* Single Navigation Items */
.nav-item.single-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: var(--transition-fast);
  gap: 0.75rem;
  margin: 0 0.5rem;
  border-radius: var(--border-radius);
  position: relative;
}

.sidebar.collapsed .nav-item.single-item {
  justify-content: center;
  margin: 0 0.25rem;
}

.nav-item.single-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-decoration: none;
  transform: translateX(4px);
}

.nav-item.single-item.active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.nav-item.single-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: var(--warning-color);
  border-radius: 0 2px 2px 0;
}

/* Module Navigation */
.nav-module {
  margin: 0 0.5rem 0.25rem;
  border-radius: var(--border-radius);
  overflow: hidden;
}

.nav-module-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  text-align: left;
  transition: var(--transition-fast);
  gap: 0.75rem;
  border-radius: var(--border-radius);
}

.sidebar.collapsed .nav-module-toggle {
  justify-content: center;
}

.nav-module-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-module.expanded .nav-module-toggle {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-icon {
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-icon i {
  font-size: 1.1rem;
}

.nav-text {
  flex: 1;
  font-weight: 500;
}

.sidebar.collapsed .nav-text {
  display: none;
}

.nav-arrow {
  transition: var(--transition-fast);
}

.nav-module.expanded .nav-arrow {
  transform: rotate(180deg);
}

.sidebar.collapsed .nav-arrow {
  display: none;
}

/* Submenu */
.nav-submenu {
  background: rgba(0, 0, 0, 0.1);
  padding: 0.25rem 0;
  margin-top: 0.25rem;
  border-radius: var(--border-radius);
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.nav-module.expanded .nav-submenu {
  max-height: 500px;
}

.sidebar.collapsed .nav-submenu {
  display: none !important;
}

.nav-subitem {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: var(--transition-fast);
  gap: 0.5rem;
  font-size: 0.9rem;
  border-radius: var(--border-radius);
  margin: 0 0.5rem;
}

.nav-subitem:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-decoration: none;
  transform: translateX(4px);
}

.nav-subitem.active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-weight: 500;
}

.nav-subitem i {
  font-size: 0.9rem;
  width: 16px;
  text-align: center;
}

/* Navigation Divider */
.nav-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 1rem 1.5rem;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.user-info-sidebar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.user-avatar-small {
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-full);
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.user-avatar-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name-small {
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role-small {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: capitalize;
}

.sidebar-collapse-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-fast);
}

.sidebar-collapse-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Main Wrapper */
.main-wrapper {
  flex: 1;
  margin-left: 280px;
  transition: var(--transition-normal);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.sidebar-collapsed .main-wrapper {
  margin-left: 70px;
}

/* Topbar */
.topbar {
  background: white;
  border-bottom: 1px solid var(--border-color);
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 999;
  box-shadow: var(--shadow-sm);
  min-height: 70px;
}

.topbar-left, .topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sidebar-toggle {
  border: none;
  background: none;
  font-size: 1.25rem;
  color: var(--gray-600);
  padding: 0.5rem;
  border-radius: var(--border-radius);
  transition: var(--transition-fast);
}

.sidebar-toggle:hover {
  color: var(--primary-color);
  background-color: var(--gray-50);
}

/* Breadcrumb */
.breadcrumb-nav {
  margin-left: 1rem;
}

.breadcrumb {
  background: none;
  padding: 0;
  margin: 0;
  font-size: 0.875rem;
}

.breadcrumb-item a {
  color: var(--gray-600);
  text-decoration: none;
}

.breadcrumb-item a:hover {
  color: var(--primary-color);
}

.breadcrumb-item.active {
  color: var(--text-color);
  font-weight: 500;
}

/* Search Box */
.search-box {
  width: 300px;
}

.search-box .form-control {
  border-radius: var(--border-radius-full);
  border: 1px solid var(--border-color);
  padding-left: 0;
  background: var(--gray-50);
}

.search-box .input-group-text {
  background: var(--gray-50);
  border-right: none;
  border-radius: var(--border-radius-full) 0 0 var(--border-radius-full);
  border: 1px solid var(--border-color);
  color: var(--gray-500);
}

.search-box .form-control:focus {
  box-shadow: 0 0 0 0.2rem rgba(107, 70, 193, 0.25);
  border-color: var(--primary-color);
  background: white;
}

/* Quick Actions */
.quick-actions {
  gap: 0.5rem;
}

/* Topbar Buttons */
.topbar-btn {
  border: none;
  background: none;
  color: var(--gray-600);
  padding: 0.5rem;
  border-radius: var(--border-radius-full);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-fast);
  position: relative;
}

.topbar-btn:hover {
  background-color: var(--gray-50);
  color: var(--primary-color);
  transform: translateY(-1px);
}

/* Notification Badge */
.notification-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--danger-color);
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: var(--border-radius-full);
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* User Menu Button */
.user-menu-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: none;
  background: none;
  color: var(--text-color);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-full);
  transition: var(--transition-fast);
  border: 1px solid transparent;
}

.user-menu-btn:hover {
  background-color: var(--gray-50);
  border-color: var(--border-color);
  transform: translateY(-1px);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-full);
  overflow: hidden;
  position: relative;
  border: 2px solid var(--border-color);
  transition: var(--transition-fast);
}

.user-menu-btn:hover .user-avatar {
  border-color: var(--primary-color);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: var(--success-color);
  border: 2px solid white;
  border-radius: var(--border-radius-full);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.2;
  margin: 0;
}

.user-role {
  font-size: 0.75rem;
  color: var(--gray-500);
  text-transform: capitalize;
  line-height: 1.2;
}

/* Mobile Search */
.mobile-search {
  padding: 1rem 1.5rem;
  background: white;
  border-bottom: 1px solid var(--border-color);
  animation: slideDown 0.3s ease-out;
}

/* Dropdowns */
.notification-dropdown {
  width: 380px;
  max-height: 500px;
  border: none;
  box-shadow: var(--shadow-xl);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  padding: 1rem;
  border-bottom: 1px solid var(--gray-100);
  transition: var(--transition-fast);
  display: flex;
  gap: 0.75rem;
}

.notification-item:hover {
  background-color: var(--gray-50);
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-success {
  background: rgba(154, 230, 180, 0.2);
  color: #22543d;
}

.notification-warning {
  background: rgba(246, 224, 94, 0.2);
  color: #744210;
}

.notification-error {
  background: rgba(252, 129, 129, 0.2);
  color: #742a2a;
}

.notification-info {
  background: rgba(11, 197, 234, 0.2);
  color: var(--secondary-dark);
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-color);
  margin-bottom: 0.25rem;
}

.notification-text {
  font-size: 0.8rem;
  color: var(--gray-600);
  line-height: 1.4;
  margin-bottom: 0.25rem;
}

.notification-time {
  font-size: 0.75rem;
  color: var(--gray-500);
}

/* User Dropdown */
.user-dropdown {
  width: 280px;
  border: none;
  box-shadow: var(--shadow-xl);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.user-profile-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.user-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-full);
  border: 2px solid var(--border-color);
}

.user-profile-info {
  flex: 1;
  min-width: 0;
}

.user-name-large {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.125rem;
}

.user-email {
  font-size: 0.8rem;
  color: var(--gray-500);
  margin-bottom: 0.25rem;
}

.user-role-badge .badge {
  font-size: 0.7rem;
  padding: 0.125rem 0.5rem;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 1.5rem;
  background-color: var(--background-color);
  min-height: calc(100vh - 70px);
}

.dropdown-item {
  padding: 0.5rem 1rem;
  transition: var(--transition-fast);
  border-radius: var(--border-radius);
  margin: 0 0.25rem;
}

.dropdown-item:hover {
  background-color: var(--gray-50);
  color: var(--primary-color);
}

/* Dark Theme */
.dark-theme {
  background-color: var(--gray-900);
}

.dark-theme .topbar {
  background: var(--gray-800);
  border-bottom-color: var(--gray-700);
  color: var(--gray-100);
}

.dark-theme .search-box .form-control,
.dark-theme .search-box .input-group-text {
  background: var(--gray-700);
  border-color: var(--gray-600);
  color: white;
}

.dark-theme .main-content {
  background-color: var(--gray-900);
}

.dark-theme .sidebar-toggle,
.dark-theme .topbar-btn,
.dark-theme .user-menu-btn {
  color: var(--gray-300);
}

.dark-theme .topbar-btn:hover,
.dark-theme .user-menu-btn:hover {
  background-color: var(--gray-700);
  color: var(--primary-light);
}

.dark-theme .dropdown-menu {
  background-color: var(--gray-800);
  border-color: var(--gray-700);
}

.dark-theme .dropdown-item {
  color: var(--gray-300);
}

.dark-theme .dropdown-item:hover {
  background-color: var(--gray-700);
  color: var(--primary-light);
}

.dark-theme .notification-item {
  border-bottom-color: var(--gray-700);
}

.dark-theme .notification-title {
  color: var(--gray-100);
}

.dark-theme .mobile-search {
  background: var(--gray-800);
  border-bottom-color: var(--gray-700);
}

/* Responsive Design */
@media (max-width: 1399.98px) {
  .search-box {
    width: 250px;
  }
}

@media (max-width: 1199.98px) {
  .search-box {
    width: 200px;
  }
  
  .notification-dropdown {
    width: 320px;
  }
}

@media (max-width: 991.98px) {
  .main-wrapper {
    margin-left: 0;
  }
  
  .sidebar-collapsed .main-wrapper {
    margin-left: 0;
  }
  
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.mobile-open {
    transform: translateX(0);
  }
  
  .mobile-overlay {
    display: block;
  }
}

@media (max-width: 767.98px) {
  .topbar {
    padding: 0.5rem 1rem;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .topbar-left, .topbar-right {
    gap: 0.5rem;
  }
  
  .notification-dropdown {
    width: 300px;
  }
  
  .user-dropdown {
    width: 250px;
  }
}

@media (max-width: 575.98px) {
  .main-content {
    padding: 0.75rem;
  }
  
  .sidebar {
    width: 100%;
  }
  
  .notification-dropdown {
    width: 280px;
  }
  
  .user-dropdown {
    width: 220px;
  }
  
  .topbar {
    padding: 0.5rem 0.75rem;
  }
}

/* Scrollbar personalizado */
.sidebar-content::-webkit-scrollbar,
.notification-list::-webkit-scrollbar {
  width: 6px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius-full);
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Animaciones */
@keyframes slideDown {
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Focus states mejorados */
.nav-item:focus,
.nav-module-toggle:focus,
.nav-subitem:focus,
.topbar-btn:focus,
.user-menu-btn:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Mejoras de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
