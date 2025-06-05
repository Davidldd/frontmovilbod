<script setup>
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from "../components/DashboardLayout.vue"
import { useModuleStore } from '../stores/moduleStore'

const isLoading = ref(true)
const showWelcome = ref(true)

// Dashboard widgets data
const dashboardStats = ref({
  totalSales: 125000,
  totalOrders: 1250,
  totalCustomers: 850,
  totalProducts: 450
})

const recentActivities = ref([
  { id: 1, type: 'sale', description: 'Nueva venta por $1,250', time: 'Hace 5 min', icon: 'bi-cart-check', color: 'success' },
  { id: 2, type: 'inventory', description: 'Stock bajo en Laptop Dell', time: 'Hace 15 min', icon: 'bi-exclamation-triangle', color: 'warning' },
  { id: 3, type: 'customer', description: 'Nuevo cliente registrado', time: 'Hace 30 min', icon: 'bi-person-plus', color: 'info' },
  { id: 4, type: 'payment', description: 'Pago recibido - Factura #001', time: 'Hace 1 hora', icon: 'bi-credit-card', color: 'primary' }
])

const quickActions = ref([
  { title: 'Nueva Factura', icon: 'bi-receipt', route: '/billing/invoices/new', color: 'primary', module: 'billing' },
  { title: 'Agregar Producto', icon: 'bi-plus-circle', route: '/catalog/products/new', color: 'success', module: 'inventory' },
  { title: 'Nuevo Cliente', icon: 'bi-person-plus', route: '/crm/contacts/new', color: 'info', module: 'crm' },
  { title: 'Orden de Compra', icon: 'bi-cart-plus', route: '/purchases/orders/new', color: 'warning', module: 'purchases' }
])

const moduleStore = useModuleStore()

const activeModules = computed(() => moduleStore.activeModules)

const availableQuickActions = computed(() => {
  return quickActions.value.filter(action => 
    moduleStore.isModuleActive(action.module)
  )
})

onMounted(async () => {
  // Simulate data loading
  await new Promise(resolve => setTimeout(resolve, 1000))
  isLoading.value = false

  // Show welcome alert for 5 seconds
  setTimeout(() => {
    showWelcome.value = false
  }, 5000)
})
</script>

<template>
  <DashboardLayout>
    <div class="dashboard-container">
      <!-- Loading Spinner -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="text-center">
          <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3 text-primary">Cargando Dashboard...</p>
        </div>
      </div>

      <!-- Welcome Alert -->
      <div v-if="showWelcome && !isLoading" class="alert alert-success alert-dismissible fade show mb-4" role="alert">
        <i class="bi bi-check-circle-fill me-2"></i>
        <strong>¡Bienvenido a MovilBod ERP!</strong> Tu sistema de gestión empresarial está listo.
        <button type="button" class="btn-close" @click="showWelcome = false"></button>
      </div>

      <!-- Dashboard Header -->
      <div class="dashboard-header mb-4">
        <h1 class="h3 mb-0">Dashboard Principal</h1>
        <p class="text-muted">Resumen general de tu negocio</p>
      </div>

      <!-- Stats Cards -->
      <div class="row g-4 mb-4">
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="stats-card">
            <div class="stats-icon bg-primary">
              <i class="bi bi-currency-dollar"></i>
            </div>
            <div class="stats-content">
              <h3>${{ dashboardStats.totalSales.toLocaleString() }}</h3>
              <p>Ventas Totales</p>
              <span class="stats-change positive">+12.5%</span>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-lg-3">
          <div class="stats-card">
            <div class="stats-icon bg-success">
              <i class="bi bi-cart-check"></i>
            </div>
            <div class="stats-content">
              <h3>{{ dashboardStats.totalOrders.toLocaleString() }}</h3>
              <p>Órdenes</p>
              <span class="stats-change positive">+8.2%</span>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-lg-3">
          <div class="stats-card">
            <div class="stats-icon bg-info">
              <i class="bi bi-people"></i>
            </div>
            <div class="stats-content">
              <h3>{{ dashboardStats.totalCustomers.toLocaleString() }}</h3>
              <p>Clientes</p>
              <span class="stats-change positive">+15.3%</span>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-lg-3">
          <div class="stats-card">
            <div class="stats-icon bg-warning">
              <i class="bi bi-box-seam"></i>
            </div>
            <div class="stats-content">
              <h3>{{ dashboardStats.totalProducts.toLocaleString() }}</h3>
              <p>Productos</p>
              <span class="stats-change negative">-2.1%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="row g-4 mb-4">
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h5 class="card-title mb-4">Acciones Rápidas</h5>
              <div class="row g-3">
                <div v-for="action in availableQuickActions" :key="action.title" class="col-6 col-md-3">
                  <router-link :to="action.route" class="quick-action-card">
                    <div class="quick-action-icon" :class="`bg-${action.color}`">
                      <i class="bi" :class="action.icon"></i>
                    </div>
                    <span>{{ action.title }}</span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Row -->
      <div class="row g-4">
        <!-- Active Modules -->
        <div class="col-12 col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h5 class="card-title mb-4">Módulos Activos</h5>
              <div class="row g-3">
                <div v-for="module in activeModules" :key="module.id" class="col-6 col-md-4">
                  <div class="module-card">
                    <div class="module-icon">
                      <i class="bi" :class="module.icon"></i>
                    </div>
                    <div class="module-content">
                      <h6>{{ module.name }}</h6>
                      <p>{{ module.description }}</p>
                      <router-link :to="`/${module.id}/dashboard`" class="btn btn-sm btn-outline-primary">
                        Ver Dashboard
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activities -->
        <div class="col-12 col-lg-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h5 class="card-title mb-4">Actividad Reciente</h5>
              <div class="activity-list">
                <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
                  <div class="activity-icon" :class="`text-${activity.color}`">
                    <i class="bi" :class="activity.icon"></i>
                  </div>
                  <div class="activity-content">
                    <p class="activity-description">{{ activity.description }}</p>
                    <small class="activity-time">{{ activity.time }}</small>
                  </div>
                </div>
              </div>
              <div class="text-center mt-3">
                <button class="btn btn-outline-primary btn-sm">Ver Todas</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.dashboard-container {
  position: relative;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.stats-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
}

.stats-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.stats-content h3 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
}

.stats-content p {
  margin: 0;
  color: #718096;
  font-size: 0.875rem;
}

.stats-change {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
}

.stats-change.positive {
  background: #c6f6d5;
  color: #22543d;
}

.stats-change.negative {
  background: #fed7d7;
  color: #742a2a;
}

.quick-action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  text-decoration: none;
  color: #2d3748;
  transition: all 0.2s ease;
}

.quick-action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: #2d3748;
}

.quick-action-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.module-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.2s ease;
}

.module-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.module-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  margin: 0 auto 1rem;
}

.module-content h6 {
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.module-content p {
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 1rem;
}

.activity-list {
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f7fafc;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  background: #f7fafc;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-description {
  margin: 0;
  font-size: 0.875rem;
  color: #2d3748;
}

.activity-time {
  color: #718096;
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .stats-card {
    flex-direction: column;
    text-align: center;
  }
  
  .quick-action-card span {
    font-size: 0.875rem;
  }
}
</style>
