<template>
  <div class="dashboard-layout" :class="{ 'sidebar-collapsed': themeStore.sidebarCollapsed, 'dark-theme': themeStore.isDark }">
    <!-- Sidebar -->
    <nav class="sidebar" :class="{ 'collapsed': themeStore.sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="brand">
          <i class="bi bi-minecart-loaded brand-icon"></i>
          <span class="brand-text">MovilBod</span>
        </div>
      </div>

      <div class="sidebar-content">
        <!-- Dashboard -->
        <div class="nav-section">
          <router-link to="/dashboard" class="nav-item" :class="{ active: $route.path === '/dashboard' }">
            <i class="bi bi-speedometer2"></i>
            <span>Dashboard</span>
          </router-link>
        </div>

        <!-- Dynamic Modules -->
        <div v-for="module in activeModules" :key="module.id" class="nav-section">
          <div class="nav-header">
            <span>{{ module.name }}</span>
          </div>
          
          <!-- CRM Module -->
          <template v-if="module.id === 'crm'">
            <router-link to="/crm/dashboard" class="nav-item" :class="{ active: $route.path.startsWith('/crm/dashboard') }">
              <i class="bi bi-graph-down"></i>
              <span>Dashboard CRM</span>
            </router-link>
            <router-link to="/crm/contacts" class="nav-item" :class="{ active: $route.path.startsWith('/crm/contacts') }">
              <i class="bi bi-people"></i>
              <span>Contactos</span>
            </router-link>
            <router-link to="/crm/companies" class="nav-item" :class="{ active: $route.path.startsWith('/crm/companies') }">
              <i class="bi bi-building"></i>
              <span>Empresas</span>
            </router-link>
            <router-link to="/crm/leads" class="nav-item" :class="{ active: $route.path.startsWith('/crm/leads') }">
              <i class="bi bi-person-plus"></i>
              <span>Leads</span>
            </router-link>
            <router-link to="/crm/opportunities" class="nav-item" :class="{ active: $route.path.startsWith('/crm/opportunities') }">
              <i class="bi bi-bullseye"></i>
              <span>Oportunidades</span>
            </router-link>
            <router-link to="/crm/tasks" class="nav-item" :class="{ active: $route.path.startsWith('/crm/tasks') }">
              <i class="bi bi-list-task"></i>
              <span>Tareas</span>
            </router-link>
          </template>

          <!-- Inventory Module -->
          <template v-if="module.id === 'inventory'">
            <router-link to="/inventory/dashboard" class="nav-item" :class="{ active: $route.path.startsWith('/inventory/dashboard') }">
              <i class="bi bi-graph-down"></i>
              <span>Dashboard</span>
            </router-link>
            <router-link to="/inventory/stock" class="nav-item" :class="{ active: $route.path.startsWith('/inventory/stock') }">
              <i class="bi bi-boxes"></i>
              <span>Stock</span>
            </router-link>
            <router-link to="/catalog/products" class="nav-item" :class="{ active: $route.path.startsWith('/catalog/products') }">
              <i class="bi bi-box-seam"></i>
              <span>Productos</span>
            </router-link>
            <router-link to="/catalog/categories" class="nav-item" :class="{ active: $route.path.startsWith('/catalog/categories') }">
              <i class="bi bi-tags"></i>
              <span>Categorías</span>
            </router-link>
            <router-link to="/inventory/locations" class="nav-item" :class="{ active: $route.path.startsWith('/inventory/locations') }">
              <i class="bi bi-geo-alt"></i>
              <span>Ubicaciones</span>
            </router-link>
            <router-link to="/inventory/input" class="nav-item" :class="{ active: $route.path.startsWith('/inventory/input') }">
              <i class="bi bi-box-arrow-in-down"></i>
              <span>Entradas</span>
            </router-link>
            <router-link to="/inventory/output" class="nav-item" :class="{ active: $route.path.startsWith('/inventory/output') }">
              <i class="bi bi-box-arrow-up"></i>
              <span>Salidas</span>
            </router-link>
            <router-link to="/inventory/transfer" class="nav-item" :class="{ active: $route.path.startsWith('/inventory/transfer') }">
              <i class="bi bi-arrow-left-right"></i>
              <span>Transferencias</span>
            </router-link>
            <router-link to="/inventory/adjustment" class="nav-item" :class="{ active: $route.path.startsWith('/inventory/adjustment') }">
              <i class="bi bi-pencil-square"></i>
              <span>Ajustes</span>
            </router-link>
            <router-link to="/inventory/alerts" class="nav-item" :class="{ active: $route.path.startsWith('/inventory/alerts') }">
              <i class="bi bi-exclamation-triangle"></i>
              <span>Alertas</span>
            </router-link>
          </template>

          <!-- Billing Module -->
          <template v-if="module.id === 'billing'">
            <router-link to="/billing/dashboard" class="nav-item" :class="{ active: $route.path.startsWith('/billing/dashboard') }">
              <i class="bi bi-graph-down"></i>
              <span>Dashboard</span>
            </router-link>
            <router-link to="/billing/invoices" class="nav-item" :class="{ active: $route.path.startsWith('/billing/invoices') }">
              <i class="bi bi-receipt"></i>
              <span>Facturas</span>
            </router-link>
            <router-link to="/billing/credit-notes" class="nav-item" :class="{ active: $route.path.startsWith('/billing/credit-notes') }">
              <i class="bi bi-file-earmark-minus"></i>
              <span>Notas Crédito</span>
            </router-link>
            <router-link to="/billing/payments" class="nav-item" :class="{ active: $route.path.startsWith('/billing/payments') }">
              <i class="bi bi-credit-card"></i>
              <span>Pagos</span>
            </router-link>
          </template>

          <!-- Accounting Module -->
          <template v-if="module.id === 'accounting'">
            <router-link to="/accounting/dashboard" class="nav-item" :class="{ active: $route.path.startsWith('/accounting/dashboard') }">
              <i class="bi bi-calculator"></i>
              <span>Dashboard Contable</span>
            </router-link>
            <router-link to="/accounting/chart-of-accounts" class="nav-item" :class="{ active: $route.path.startsWith('/accounting/chart-of-accounts') || $route.path.startsWith('/accounting/account') }">
              <i class="bi bi-list-columns-reverse"></i>
              <span>Plan de Cuentas</span>
            </router-link>
            <router-link to="/accounting/journal-entries" class="nav-item" :class="{ active: $route.path.startsWith('/accounting/journal-entries') || $route.path.startsWith('/accounting/journal-entry') }">
              <i class="bi bi-journal-text"></i>
              <span>Comprobantes</span>
            </router-link>
            <router-link to="/accounting/cost-centers" class="nav-item" :class="{ active: $route.path.startsWith('/accounting/cost-centers') }">
              <i class="bi bi-diagram-3"></i>
              <span>Centros de Costo</span>
            </router-link>
            <div class="nav-item-group"> 
                <a class="nav-item dropdown-toggle" @click="toggleAccountingReports = !toggleAccountingReports" :aria-expanded="toggleAccountingReports.toString()">
                    <i class="bi bi-file-earmark-bar-graph"></i>
                    <span>Reportes</span>
                </a>
                <div v-show="toggleAccountingReports" class="sub-menu">
                    <router-link to="/accounting/reports/trial-balance" class="nav-item sub-item" :class="{ active: $route.path.startsWith('/accounting/reports/trial-balance') }">
                        <i class="bi bi-file-spreadsheet"></i> Balance de Prueba
                    </router-link>
                </div>
            </div>
          </template>

          <!-- Purchases Module -->
          <template v-if="module.id === 'purchases'">
            <router-link to="/purchases/dashboard" class="nav-item" :class="{ active: $route.path.startsWith('/purchases/dashboard') }">
              <i class="bi bi-cart4"></i>
              <span>Dashboard Compras</span>
            </router-link>
            <router-link to="/purchases/suppliers" class="nav-item" :class="{ active: $route.path.startsWith('/purchases/suppliers') || $route.path.startsWith('/purchases/supplier/') }">
              <i class="bi bi-truck"></i>
              <span>Proveedores</span>
            </router-link>
            <router-link to="/purchases/orders" class="nav-item" :class="{ active: $route.path.startsWith('/purchases/orders') || $route.path.startsWith('/purchases/order/') }">
              <i class="bi bi-file-earmark-text"></i>
              <span>Órdenes de Compra</span>
            </router-link>
            <router-link to="/purchases/receipts" class="nav-item" :class="{ active: $route.path.startsWith('/purchases/receipts') }">
              <i class="bi bi-box-arrow-in-down"></i>
              <span>Recepciones</span>
            </router-link>
            <router-link to="/purchases/supplier-invoices" class="nav-item" :class="{ active: $route.path.startsWith('/purchases/supplier-invoices') }">
              <i class="bi bi-receipt-cutoff"></i>
              <span>Facturas Proveedor</span>
            </router-link>
          </template>

          <!-- Sales Module -->
          <template v-if="module.id === 'sales'">
            <router-link to="/sales/dashboard" class="nav-item" :class="{ active: $route.path.startsWith('/sales/dashboard') }">
              <i class="bi bi-graph-down"></i>
              <span>Dashboard</span>
            </router-link>
            <router-link to="/sales/orders" class="nav-item" :class="{ active: $route.path.startsWith('/sales/orders') }">
              <i class="bi bi-cart-check"></i>
              <span>Órdenes</span>
            </router-link>
            <router-link to="/sales/quotes" class="nav-item" :class="{ active: $route.path.startsWith('/sales/quotes') }">
              <i class="bi bi-file-text"></i>
              <span>Cotizaciones</span>
            </router-link>
          </template>

          <!-- Reports Module (General) -->
          <template v-if="module.id === 'reports'">
            <router-link to="/reports/dashboard" class="nav-item" :class="{ active: $route.path.startsWith('/reports/dashboard') }">
              <i class="bi bi-graph-down"></i>
              <span>Dashboard</span>
            </router-link>
            <router-link to="/reports/sales" class="nav-item" :class="{ active: $route.path.startsWith('/reports/sales') }">
              <i class="bi bi-bar-chart"></i>
              <span>Ventas</span>
            </router-link>
            <router-link to="/reports/inventory" class="nav-item" :class="{ active: $route.path.startsWith('/reports/inventory') }">
              <i class="bi bi-boxes"></i>
              <span>Inventario</span>
            </router-link>
            <router-link to="/reports/financial" class="nav-item" :class="{ active: $route.path.startsWith('/reports/financial') }">
              <i class="bi bi-graph-up"></i>
              <span>Financieros</span>
            </router-link>
          </template>
        </div>

        <!-- Configuration (Root only) -->
        <div v-if="authStore.isRoot" class="nav-section">
          <div class="nav-header">
            <span>Configuración</span>
          </div>
          <router-link to="/config/modules" class="nav-item" :class="{ active: $route.path.startsWith('/config/modules') }">
            <i class="bi bi-gear"></i>
            <span>Módulos</span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="main-wrapper">
      <!-- Top Bar -->
      <header class="topbar">
        <div class="topbar-left">
          <button class="btn btn-link sidebar-toggle" @click="themeStore.toggleSidebar()">
            <i class="bi bi-list"></i>
          </button>
          
          <div class="search-box">
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
          <!-- Theme Toggle -->
          <button class="btn btn-link" @click="themeStore.toggleTheme()" title="Cambiar tema">
            <i class="bi" :class="themeStore.isDark ? 'bi-sun' : 'bi-moon'"></i>
          </button>

          <!-- Notifications -->
          <div class="dropdown">
            <button class="btn btn-link position-relative" data-bs-toggle="dropdown">
              <i class="bi bi-bell"></i>
              <span v-if="notifications.length > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {{ notifications.length }}
                <span class="visually-hidden">notificaciones no leídas</span>
              </span>
            </button>
            <div class="dropdown-menu dropdown-menu-end notification-dropdown">
              <h6 class="dropdown-header">Notificaciones</h6>
              <div class="notification-list">
                <div v-for="notification in notifications" :key="notification.id" class="notification-item">
                  <div class="notification-content">
                    <div class="notification-title">{{ notification.title }}</div>
                    <div class="notification-text">{{ notification.message }}</div>
                    <div class="notification-time">{{ notification.time }}</div>
                  </div>
                </div>
                <div v-if="notifications.length === 0" class="dropdown-item text-center text-muted">
                  No hay notificaciones nuevas.
                </div>
              </div>
              <div v-if="notifications.length > 0" class="dropdown-divider"></div>
              <a v-if="notifications.length > 0" class="dropdown-item text-center" href="#">Ver todas las notificaciones</a>
            </div>
          </div>

          <!-- User Menu -->
          <div class="dropdown">
            <button class="btn btn-link user-menu" data-bs-toggle="dropdown">
              <img src="https://via.placeholder.com/32" class="user-avatar" alt="Usuario">
              <span class="user-name">{{ authStore.userName }}</span>
              <i class="bi bi-chevron-down"></i>
            </button>
            <div class="dropdown-menu dropdown-menu-end">
              <div class="dropdown-header">
                <div class="user-info">
                  <div class="user-name">{{ authStore.userName }}</div>
                  <div class="user-role">{{ authStore.role }}</div>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <router-link to="/profile" class="dropdown-item">
                <i class="bi bi-person me-2"></i>Perfil
              </router-link>
              <a class="dropdown-item" href="#">
                <i class="bi bi-gear me-2"></i>Configuración
              </a>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item" @click="logout">
                <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="main-content">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useModuleStore } from '../stores/moduleStore'
import { useAuthStore } from '../stores/authStore'
import { useThemeStore } from '../stores/themeStore'

const router = useRouter()
const currentRoute = useRoute() 
const moduleStore = useModuleStore()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const searchQuery = ref('')
const toggleAccountingReports = ref(false) 

const activeModules = computed(() => moduleStore.activeModules)

const notifications = ref([
  {
    id: 1,
    title: 'OC #PO-0012 Aprobada',
    message: 'La orden de compra para "Insumos de Oficina" ha sido aprobada.',
    time: 'Hace 15 minutos'
  },
  {
    id: 2,
    title: 'Recepción Pendiente',
    message: 'La OC #PO-0010 tiene una recepción de mercancía pendiente.',
    time: 'Hace 2 horas'
  }
])

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/search', 
      query: { q: searchQuery.value }
    })
  }
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.nav-item-group .dropdown-toggle::after { 
    display: inline-block;
    margin-left: .255em;
    vertical-align: .255em;
    content: "";
    border-top: .3em solid;
    border-right: .3em solid transparent;
    border-bottom: 0;
    border-left: .3em solid transparent;
    transition: transform .2s ease-in-out;
}

.nav-item-group .dropdown-toggle[aria-expanded="true"]::after {
    transform: rotate(180deg);
}

.sidebar.collapsed .nav-item-group .dropdown-toggle::after {
    display: none;
}

.sub-menu {
  padding-left: 1.5rem; 
  background-color: rgba(0,0,0,0.1); 
}

.sub-item {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 0.9em; 
}

.sub-item i {
  font-size: 1rem; 
  margin-right: 0.5rem;
}

.sub-item.active {
  background-color: rgba(255, 255, 255, 0.25); 
  border-right: none; 
  border-left: 3px solid #ffd700; 
}

.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--bs-body-bg); 
}

.sidebar {
  width: 280px; 
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
  color: white;
  transition: all 0.3s ease;
  position: fixed; 
  height: 100vh;
  z-index: 1000;
  overflow-y: auto; 
}

.sidebar.collapsed {
  width: 70px; 
}

.sidebar.collapsed .nav-header,
.sidebar.collapsed .nav-item span,
.sidebar.collapsed .sub-menu { 
    display: none;
}

.sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); 
  display: flex;
  align-items: center;
  justify-content: center; 
}

.sidebar.collapsed .sidebar-header {
  padding: 1.5rem 0.5rem; 
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem; 
}

.brand-icon {
  font-size: 1.5rem; 
  color: #ffd700; 
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 600; 
  white-space: nowrap; 
}

.sidebar-content {
  padding: 1rem 0;
}

.nav-section {
  margin-bottom: 1rem; 
}

.nav-header {
  padding: 0.5rem 1rem;
  font-size: 0.75rem; 
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.7); 
  font-weight: 600;
}

.sidebar.collapsed .nav-header {
  display: none; 
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s ease;
  gap: 0.75rem; 
  white-space: nowrap; 
  cursor: pointer; 
}

.sidebar.collapsed .nav-item {
  justify-content: center; 
  padding: 0.75rem 0.5rem;
}

.sidebar.collapsed .nav-item span {
  display: none; 
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1); 
  color: white;
}

.nav-item.active {
  background-color: rgba(255, 255, 255, 0.2); 
  color: white;
  border-right: 3px solid #ffd700; 
}

.sidebar.collapsed .nav-item.active {
  border-right: none; 
  border-left: 3px solid #ffd700; 
}

.nav-item i {
  font-size: 1.1rem; 
  width: 20px; 
  text-align: center;
  flex-shrink: 0; 
}

.main-wrapper {
  flex: 1; 
  margin-left: 280px; 
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column; 
}

.sidebar-collapsed .main-wrapper {
  margin-left: 70px; 
}

.topbar {
  background: var(--bs-card-bg); 
  border-bottom: 1px solid var(--bs-border-color); 
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky; 
  top: 0;
  z-index: 999;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05); 
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
  color: var(--bs-secondary-color); 
}

.search-box {
  width: 300px; 
}

.search-box .form-control {
  border-radius: 25px; 
}

.search-box .input-group-text {
  background: transparent;
  border-right: none;
  border-radius: 25px 0 0 25px;
}

.search-box .form-control {
  border-left: none;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  background: none;
  color: var(--bs-body-color);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%; 
}

.user-name {
  font-weight: 500; 
}

.notification-dropdown {
  width: 320px; 
  max-height: 400px;
  overflow-y: auto;
}

.notification-list {
  max-height: 300px; 
  overflow-y: auto;
}

.notification-item {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--bs-border-color-translucent);
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-title {
  font-weight: 600;
  font-size: 0.875rem;
}

.notification-text {
  font-size: 0.8rem;
  color: var(--bs-secondary-color);
  margin-top: 0.25rem;
  white-space: normal;
}

.notification-time {
  font-size: 0.75rem;
  color: var(--bs-tertiary-color);
  margin-top: 0.25rem;
}

.main-content {
  flex: 1;
  padding: 1.5rem;
  background-color: var(--bs-body-bg); 
}

.user-info {
  padding: 0.5rem 0;
}

.user-role {
  font-size: 0.8rem;
  color: var(--bs-secondary-color);
  text-transform: capitalize;
}

.dark-theme .topbar {
  background: #2d3748; 
  border-bottom-color: #4a5568;
  color: #e2e8f0;
}

.dark-theme .search-box .form-control,
.dark-theme .search-box .input-group-text {
  background: #4a5568;
  border-color: #4a5568;
  color: white;
}

.dark-theme .search-box .form-control::placeholder {
  color: #a0aec0;
}

.dark-theme .main-content {
  background-color: #1a202c; 
}

.dark-theme .sidebar-toggle,
.dark-theme .user-menu,
.dark-theme .btn-link { 
  color: #e2e8f0;
}

.dark-theme .dropdown-menu {
  background-color: #2d3748;
  border-color: #4a5568;
}

.dark-theme .dropdown-item {
  color: #e2e8f0;
}

.dark-theme .dropdown-item:hover, .dark-theme .dropdown-item:focus {
  background-color: #4a5568;
}

.dark-theme .dropdown-header {
  color: #a0aec0;
}

.dark-theme .dropdown-divider {
  border-top-color: #4a5568;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%); 
    box-shadow: 0 0 15px rgba(0,0,0,0.2); 
  }
  
  .sidebar.show { 
    transform: translateX(0);
  }
  
  .main-wrapper {
    margin-left: 0; 
  }

  .sidebar-collapsed .main-wrapper {
    margin-left: 0; 
  }

  .search-box {
    width: auto; 
    max-width: 200px;
  }

  .topbar-left .search-box {
    display: none; 
  }
}
</style>
