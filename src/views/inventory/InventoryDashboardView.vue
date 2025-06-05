<script setup>
import { ref, computed } from 'vue';
import DashboardLayout from '../../components/DashboardLayout.vue';

// Mock data
const stats = ref({
  totalProducts: 1250,
  totalValue: 125000,
  lowStockItems: 15,
  outOfStockItems: 3,
  totalLocations: 4,
  pendingTransfers: 8
})

const recentMovements = ref([
  {
    id: 1,
    type: 'entrada',
    product: 'Laptop Dell XPS 13',
    quantity: 10,
    location: 'Almacén Principal',
    date: '2024-02-20 14:30',
    user: 'Juan Pérez'
  },
  {
    id: 2,
    type: 'salida',
    product: 'Mouse Logitech',
    quantity: 5,
    location: 'Tienda Centro',
    date: '2024-02-20 13:15',
    user: 'María García'
  },
  {
    id: 3,
    type: 'transferencia',
    product: 'Teclado Mecánico',
    quantity: 3,
    location: 'Almacén Principal → Tienda Norte',
    date: '2024-02-20 12:00',
    user: 'Carlos López'
  }
])

const lowStockProducts = ref([
  {
    id: 1,
    name: 'Laptop HP Pavilion',
    currentStock: 2,
    minStock: 5,
    location: 'Almacén Principal',
    lastMovement: '2024-02-18'
  },
  {
    id: 2,
    name: 'Monitor Samsung 24"',
    currentStock: 1,
    minStock: 3,
    location: 'Tienda Centro',
    lastMovement: '2024-02-19'
  }
])

const topProducts = ref([
  {
    id: 1,
    name: 'Laptop Dell XPS 13',
    movements: 45,
    value: 25000,
    trend: 'up'
  },
  {
    id: 2,
    name: 'Mouse Logitech MX',
    movements: 32,
    value: 8500,
    trend: 'up'
  },
  {
    id: 3,
    name: 'Teclado Mecánico',
    movements: 28,
    value: 12000,
    trend: 'down'
  }
])

const stockByLocation = ref([
  {
    location: 'Almacén Principal',
    products: 450,
    value: 75000,
    percentage: 60
  },
  {
    location: 'Tienda Centro',
    products: 320,
    value: 30000,
    percentage: 24
  },
  {
    location: 'Tienda Norte',
    products: 280,
    value: 15000,
    percentage: 12
  },
  {
    location: 'Almacén Secundario',
    products: 200,
    value: 5000,
    percentage: 4
  }
])

// Methods
const getMovementTypeClass = (type) => {
  const classes = {
    'entrada': 'badge bg-success',
    'salida': 'badge bg-danger',
    'transferencia': 'badge bg-info',
    'ajuste': 'badge bg-warning'
  }
  return classes[type] || 'badge bg-secondary'
}

const getMovementIcon = (type) => {
  const icons = {
    'entrada': 'bi-box-arrow-in-down',
    'salida': 'bi-box-arrow-up',
    'transferencia': 'bi-arrow-left-right',
    'ajuste': 'bi-pencil-square'
  }
  return icons[type] || 'bi-box'
}

const getStockLevelClass = (current, min) => {
  const percentage = (current / min) * 100
  if (percentage <= 50) return 'text-danger'
  if (percentage <= 100) return 'text-warning'
  return 'text-success'
}

const getTrendIcon = (trend) => {
  return trend === 'up' ? 'bi-trending-up text-success' : 'bi-trending-down text-danger'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(value)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <DashboardLayout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-1">Dashboard de Inventarios</h1>
          <p class="text-muted mb-0">Resumen general del estado del inventario</p>
        </div>
        <div class="d-flex gap-2">
          <router-link to="/inventory/input" class="btn btn-success">
            <i class="bi bi-box-arrow-in-down me-2"></i>Nueva Entrada
          </router-link>
          <router-link to="/inventory/output" class="btn btn-danger">
            <i class="bi bi-box-arrow-up me-2"></i>Nueva Salida
          </router-link>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row g-4 mb-4">
        <div class="col-xl-3 col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="bg-primary bg-opacity-10 rounded-3 p-3">
                    <i class="bi bi-box-seam text-primary fs-4"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <div class="text-muted small">Total Productos</div>
                  <div class="fs-4 fw-bold">{{ stats.totalProducts.toLocaleString() }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="bg-success bg-opacity-10 rounded-3 p-3">
                    <i class="bi bi-currency-dollar text-success fs-4"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <div class="text-muted small">Valor Total</div>
                  <div class="fs-4 fw-bold">{{ formatCurrency(stats.totalValue) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="bg-warning bg-opacity-10 rounded-3 p-3">
                    <i class="bi bi-exclamation-triangle text-warning fs-4"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <div class="text-muted small">Stock Bajo</div>
                  <div class="fs-4 fw-bold text-warning">{{ stats.lowStockItems }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="bg-danger bg-opacity-10 rounded-3 p-3">
                    <i class="bi bi-x-circle text-danger fs-4"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <div class="text-muted small">Sin Stock</div>
                  <div class="fs-4 fw-bold text-danger">{{ stats.outOfStockItems }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <!-- Recent Movements -->
        <div class="col-xl-8">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-transparent border-0 pb-0">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">Movimientos Recientes</h5>
                <router-link to="/inventory/movements" class="btn btn-sm btn-outline-primary">
                  Ver todos
                </router-link>
              </div>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Ubicación</th>
                      <th>Fecha</th>
                      <th>Usuario</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="movement in recentMovements" :key="movement.id">
                      <td>
                        <span :class="getMovementTypeClass(movement.type)">
                          <i :class="getMovementIcon(movement.type)" class="me-1"></i>
                          {{ movement.type }}
                        </span>
                      </td>
                      <td>{{ movement.product }}</td>
                      <td>{{ movement.quantity }}</td>
                      <td>{{ movement.location }}</td>
                      <td>{{ formatDate(movement.date) }}</td>
                      <td>{{ movement.user }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Stock by Location -->
        <div class="col-xl-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-transparent border-0 pb-0">
              <h5 class="card-title mb-0">Stock por Ubicación</h5>
            </div>
            <div class="card-body">
              <div class="space-y-4">
                <div v-for="location in stockByLocation" :key="location.location" class="mb-4">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <div class="fw-medium">{{ location.location }}</div>
                      <div class="text-muted small">{{ location.products }} productos</div>
                    </div>
                    <div class="text-end">
                      <div class="fw-bold">{{ formatCurrency(location.value) }}</div>
                      <div class="text-muted small">{{ location.percentage }}%</div>
                    </div>
                  </div>
                  <div class="progress" style="height: 6px;">
                    <div 
                      class="progress-bar bg-primary" 
                      :style="{ width: location.percentage + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Low Stock Alert -->
        <div class="col-xl-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-transparent border-0 pb-0">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">Alertas de Stock Bajo</h5>
                <router-link to="/inventory/alerts" class="btn btn-sm btn-outline-warning">
                  Ver todas
                </router-link>
              </div>
            </div>
            <div class="card-body">
              <div class="space-y-3">
                <div v-for="product in lowStockProducts" :key="product.id" class="d-flex align-items-center p-3 bg-light rounded">
                  <div class="flex-shrink-0">
                    <div class="bg-warning bg-opacity-10 rounded-circle p-2">
                      <i class="bi bi-exclamation-triangle text-warning"></i>
                    </div>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <div class="fw-medium">{{ product.name }}</div>
                    <div class="text-muted small">{{ product.location }}</div>
                  </div>
                  <div class="text-end">
                    <div :class="getStockLevelClass(product.currentStock, product.minStock)">
                      {{ product.currentStock }}/{{ product.minStock }}
                    </div>
                    <div class="text-muted small">{{ product.lastMovement }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Products -->
        <div class="col-xl-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-transparent border-0 pb-0">
              <h5 class="card-title mb-0">Productos Más Activos</h5>
            </div>
            <div class="card-body">
              <div class="space-y-3">
                <div v-for="(product, index) in topProducts" :key="product.id" class="d-flex align-items-center p-3 bg-light rounded">
                  <div class="flex-shrink-0">
                    <div class="bg-primary bg-opacity-10 rounded-circle p-2 text-center" style="width: 40px; height: 40px; line-height: 24px;">
                      <span class="fw-bold text-primary">{{ index + 1 }}</span>
                    </div>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <div class="fw-medium">{{ product.name }}</div>
                    <div class="text-muted small">{{ product.movements }} movimientos</div>
                  </div>
                  <div class="text-end">
                    <div class="fw-bold">{{ formatCurrency(product.value) }}</div>
                    <div>
                      <i :class="getTrendIcon(product.trend)"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="row g-4 mt-2">
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent border-0 pb-0">
              <h5 class="card-title mb-0">Acciones Rápidas</h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-3">
                  <router-link to="/catalog/products/new" class="btn btn-outline-primary w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3">
                    <i class="bi bi-plus-circle fs-2 mb-2"></i>
                    <span>Nuevo Producto</span>
                  </router-link>
                </div>
                <div class="col-md-3">
                  <router-link to="/inventory/transfer" class="btn btn-outline-info w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3">
                    <i class="bi bi-arrow-left-right fs-2 mb-2"></i>
                    <span>Transferencia</span>
                  </router-link>
                </div>
                <div class="col-md-3">
                  <router-link to="/inventory/adjustment" class="btn btn-outline-warning w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3">
                    <i class="bi bi-pencil-square fs-2 mb-2"></i>
                    <span>Ajuste de Stock</span>
                  </router-link>
                </div>
                <div class="col-md-3">
                  <router-link to="/inventory/reports" class="btn btn-outline-secondary w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3">
                    <i class="bi bi-file-earmark-bar-graph fs-2 mb-2"></i>
                    <span>Reportes</span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
