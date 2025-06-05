<script setup>
import { ref, computed } from 'vue';
import DashboardLayout from '../../components/DashboardLayout.vue';

// Mock data
const alerts = ref([
  {
    id: 1,
    type: 'low_stock',
    priority: 'high',
    product: 'Laptop HP Pavilion',
    code: 'PROD002',
    location: 'Almacén Principal',
    currentStock: 2,
    minStock: 5,
    message: 'Stock por debajo del mínimo establecido',
    createdAt: '2024-02-20 14:30',
    status: 'active'
  },
  {
    id: 2,
    type: 'out_of_stock',
    priority: 'critical',
    product: 'Teclado Mecánico',
    code: 'PROD003',
    location: 'Tienda Centro',
    currentStock: 0,
    minStock: 5,
    message: 'Producto sin stock disponible',
    createdAt: '2024-02-20 13:15',
    status: 'active'
  },
  {
    id: 3,
    type: 'expiry_warning',
    priority: 'medium',
    product: 'Batería Laptop',
    code: 'PROD015',
    location: 'Almacén Principal',
    currentStock: 15,
    expiryDate: '2024-03-15',
    message: 'Producto próximo a vencer en 30 días',
    createdAt: '2024-02-19 10:00',
    status: 'active'
  },
  {
    id: 4,
    type: 'excess_stock',
    priority: 'low',
    product: 'Cable USB',
    code: 'PROD020',
    location: 'Almacén Principal',
    currentStock: 200,
    maxStock: 100,
    message: 'Stock excede el máximo recomendado',
    createdAt: '2024-02-18 16:45',
    status: 'resolved'
  }
])

const alertTypes = ref([
  { id: 'low_stock', name: 'Stock Bajo', icon: 'bi-exclamation-triangle', color: 'warning' },
  { id: 'out_of_stock', name: 'Sin Stock', icon: 'bi-x-circle', color: 'danger' },
  { id: 'expiry_warning', name: 'Próximo a Vencer', icon: 'bi-clock', color: 'info' },
  { id: 'excess_stock', name: 'Exceso de Stock', icon: 'bi-arrow-up-circle', color: 'secondary' }
])

// Filters
const filters = ref({
  search: '',
  type: '',
  priority: '',
  status: 'active'
})

// Pagination
const itemsPerPage = 15
const currentPage = ref(1)

// Computed properties
const filteredAlerts = computed(() => {
  let filtered = alerts.value

  if (filters.value.search) {
    filtered = filtered.filter(alert =>
      alert.product.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      alert.code.toLowerCase().includes(filters.value.search.toLowerCase())
    )
  }

  if (filters.value.type) {
    filtered = filtered.filter(alert => alert.type === filters.value.type)
  }

  if (filters.value.priority) {
    filtered = filtered.filter(alert => alert.priority === filters.value.priority)
  }

  if (filters.value.status) {
    filtered = filtered.filter(alert => alert.status === filters.value.status)
  }

  return filtered.sort((a, b) => {
    const priorityOrder = { critical: 3, high: 2, medium: 1, low: 0 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
})

const alertStats = computed(() => {
  const active = alerts.value.filter(a => a.status === 'active')
  const critical = active.filter(a => a.priority === 'critical').length
  const high = active.filter(a => a.priority === 'high').length
  const medium = active.filter(a => a.priority === 'medium').length
  const low = active.filter(a => a.priority === 'low').length

  return { total: active.length, critical, high, medium, low }
})

const totalAlerts = computed(() => filteredAlerts.value.length)
const totalPages = computed(() => Math.ceil(totalAlerts.value / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, totalAlerts.value))
const paginatedAlerts = computed(() => filteredAlerts.value.slice(startIndex.value, endIndex.value))

// Methods
const resetFilters = () => {
  filters.value = {
    search: '',
    type: '',
    priority: '',
    status: 'active'
  }
}

const getAlertTypeInfo = (type) => {
  return alertTypes.value.find(t => t.id === type) || { name: type, icon: 'bi-info-circle', color: 'secondary' }
}

const getPriorityBadgeClass = (priority) => {
  const classes = {
    'critical': 'badge bg-danger',
    'high': 'badge bg-warning',
    'medium': 'badge bg-info',
    'low': 'badge bg-secondary'
  }
  return classes[priority] || 'badge bg-secondary'
}

const getPriorityText = (priority) => {
  const texts = {
    'critical': 'Crítica',
    'high': 'Alta',
    'medium': 'Media',
    'low': 'Baja'
  }
  return texts[priority] || priority
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'active': 'badge bg-danger',
    'resolved': 'badge bg-success',
    'dismissed': 'badge bg-secondary'
  }
  return classes[status] || 'badge bg-secondary'
}

const getStatusText = (status) => {
  const texts = {
    'active': 'Activa',
    'resolved': 'Resuelta',
    'dismissed': 'Descartada'
  }
  return texts[status] || status
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

const resolveAlert = async (alert) => {
  if (confirm('¿Está seguro de marcar esta alerta como resuelta?')) {
    try {
      alert.status = 'resolved'
      console.log('Alert resolved:', alert)
    } catch (error) {
      console.error('Error resolving alert:', error)
    }
  }
}

const dismissAlert = async (alert) => {
  if (confirm('¿Está seguro de descartar esta alerta?')) {
    try {
      alert.status = 'dismissed'
      console.log('Alert dismissed:', alert)
    } catch (error) {
      console.error('Error dismissing alert:', error)
    }
  }
}

const viewProduct = (alert) => {
  console.log('View product:', alert.product)
}

const createPurchaseOrder = (alert) => {
  console.log('Create purchase order for:', alert.product)
}

const adjustStock = (alert) => {
  console.log('Adjust stock for:', alert.product)
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const goToPage = (page) => {
  currentPage.value = page
}
</script>

<template>
  <DashboardLayout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-1">Alertas de Inventario</h1>
          <p class="text-muted mb-0">Monitoreo y gestión de alertas del sistema</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-success">
            <i class="bi bi-check-all me-2"></i>Resolver Todas
          </button>
          <button class="btn btn-outline-secondary">
            <i class="bi bi-gear me-2"></i>Configurar Alertas
          </button>
        </div>
      </div>

      <!-- Alert Stats -->
      <div class="row g-4 mb-4">
        <div class="col-xl-3 col-md-6">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="bg-danger bg-opacity-10 rounded-3 p-3">
                    <i class="bi bi-exclamation-triangle text-danger fs-4"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <div class="text-muted small">Alertas Activas</div>
                  <div class="fs-4 fw-bold">{{ alertStats.total }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="bg-danger bg-opacity-10 rounded-3 p-3">
                    <i class="bi bi-exclamation-octagon text-danger fs-4"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <div class="text-muted small">Críticas</div>
                  <div class="fs-4 fw-bold text-danger">{{ alertStats.critical }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="bg-warning bg-opacity-10 rounded-3 p-3">
                    <i class="bi bi-exclamation-triangle text-warning fs-4"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <div class="text-muted small">Alta Prioridad</div>
                  <div class="fs-4 fw-bold text-warning">{{ alertStats.high }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="bg-info bg-opacity-10 rounded-3 p-3">
                    <i class="bi bi-info-circle text-info fs-4"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <div class="text-muted small">Media/Baja</div>
                  <div class="fs-4 fw-bold">{{ alertStats.medium + alertStats.low }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <div class="form-floating">
                <input
                  type="text"
                  class="form-control"
                  id="searchAlert"
                  placeholder="Buscar alerta"
                  v-model="filters.search"
                >
                <label for="searchAlert">
                  <i class="bi bi-search me-2"></i>Buscar producto
                </label>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-floating">
                <select class="form-select" id="typeFilter" v-model="filters.type">
                  <option value="">Todos los tipos</option>
                  <option v-for="type in alertTypes" :key="type.id" :value="type.id">
                    {{ type.name }}
                  </option>
                </select>
                <label for="typeFilter">Tipo</label>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-floating">
                <select class="form-select" id="priorityFilter" v-model="filters.priority">
                  <option value="">Todas las prioridades</option>
                  <option value="critical">Crítica</option>
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
                <label for="priorityFilter">Prioridad</label>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-floating">
                <select class="form-select" id="statusFilter" v-model="filters.status">
                  <option value="">Todos los estados</option>
                  <option value="active">Activas</option>
                  <option value="resolved">Resueltas</option>
                  <option value="dismissed">Descartadas</option>
                </select>
                <label for="statusFilter">Estado</label>
              </div>
            </div>
            <div class="col-md-3">
              <button class="btn btn-secondary w-100 h-100" @click="resetFilters">
                <i class="bi bi-x-circle me-2"></i>Limpiar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Alerts List -->
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <div class="space-y-3">
            <div v-for="alert in paginatedAlerts" :key="alert.id" class="alert-item p-3 border rounded">
              <div class="row align-items-center">
                <div class="col-md-1">
                  <div class="text-center">
                    <i 
                      :class="[getAlertTypeInfo(alert.type).icon, 'fs-3', `text-${getAlertTypeInfo(alert.type).color}`]"
                    ></i>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex align-items-center mb-2">
                    <h6 class="mb-0 me-3">{{ alert.product }}</h6>
                    <code class="me-3">{{ alert.code }}</code>
                    <span :class="getPriorityBadgeClass(alert.priority)">
                      {{ getPriorityText(alert.priority) }}
                    </span>
                  </div>
                  <p class="text-muted mb-1">{{ alert.message }}</p>
                  <div class="d-flex align-items-center text-muted small">
                    <i class="bi bi-geo-alt me-1"></i>
                    <span class="me-3">{{ alert.location }}</span>
                    <i class="bi bi-clock me-1"></i>
                    <span>{{ formatDate(alert.createdAt) }}</span>
                  </div>
                </div>
                <div class="col-md-2">
                  <div v-if="alert.type === 'low_stock' || alert.type === 'out_of_stock'">
                    <div class="text-muted small">Stock Actual</div>
                    <div class="fs-5 fw-bold" :class="alert.currentStock === 0 ? 'text-danger' : 'text-warning'">
                      {{ alert.currentStock }}
                    </div>
                    <div class="text-muted small">Mínimo: {{ alert.minStock }}</div>
                  </div>
                  <div v-else-if="alert.type === 'expiry_warning'">
                    <div class="text-muted small">Vence</div>
                    <div class="fw-bold text-info">{{ alert.expiryDate }}</div>
                  </div>
                  <div v-else-if="alert.type === 'excess_stock'">
                    <div class="text-muted small">Stock Actual</div>
                    <div class="fs-5 fw-bold text-secondary">{{ alert.currentStock }}</div>
                    <div class="text-muted small">Máximo: {{ alert.maxStock }}</div>
                  </div>
                </div>
                <div class="col-md-2">
                  <span :class="getStatusBadgeClass(alert.status)">
                    {{ getStatusText(alert.status) }}
                  </span>
                </div>
                <div class="col-md-1">
                  <div class="dropdown">
                    <button class="btn btn-sm btn-outline-secondary" data-bs-toggle="dropdown">
                      <i class="bi bi-three-dots-vertical"></i>
                    </button>
                    <div class="dropdown-menu">
                      <button class="dropdown-item" @click="viewProduct(alert)">
                        <i class="bi bi-eye me-2"></i>Ver Producto
                      </button>
                      <div class="dropdown-divider"></div>
                      <button 
                        v-if="alert.type === 'low_stock' || alert.type === 'out_of_stock'"
                        class="dropdown-item" 
                        @click="createPurchaseOrder(alert)"
                      >
                        <i class="bi bi-cart-plus me-2"></i>Crear Orden de Compra
                      </button>
                      <button class="dropdown-item" @click="adjustStock(alert)">
                        <i class="bi bi-pencil-square me-2"></i>Ajustar Stock
                      </button>
                      <div class="dropdown-divider"></div>
                      <button 
                        v-if="alert.status === 'active'"
                        class="dropdown-item text-success" 
                        @click="resolveAlert(alert)"
                      >
                        <i class="bi bi-check-circle me-2"></i>Marcar como Resuelta
                      </button>
                      <button 
                        v-if="alert.status === 'active'"
                        class="dropdown-item text-secondary" 
                        @click="dismissAlert(alert)"
                      >
                        <i class="bi bi-x-circle me-2"></i>Descartar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <nav class="d-flex justify-content-between align-items-center mt-4">
            <p class="text-muted mb-0">
              Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ totalAlerts }} alertas
            </p>
            <ul class="pagination mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="prevPage">Anterior</button>
              </li>
              <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
                <button class="page-link" @click="goToPage(page)">{{ page }}</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="nextPage">Siguiente</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.alert-item {
  transition: all 0.2s ease;
}

.alert-item:hover {
  background-color: #f8f9fa;
  border-color: #dee2e6 !important;
}
</style>
