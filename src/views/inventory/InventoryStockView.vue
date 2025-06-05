<script setup>
import { ref, computed } from 'vue';
import DashboardLayout from '../../components/DashboardLayout.vue';

// Mock data
const locations = ref([
  { id: 1, name: 'Almacén Principal' },
  { id: 2, name: 'Almacén Secundario' },
  { id: 3, name: 'Tienda Centro' },
  { id: 4, name: 'Tienda Norte' }
])

const categories = ref([
  { id: 1, name: 'Electrónicos' },
  { id: 2, name: 'Accesorios' },
  { id: 3, name: 'Repuestos' }
])

const stockItems = ref([
  {
    id: 1,
    code: 'PROD001',
    name: 'Laptop Dell XPS 13',
    category: 'Electrónicos',
    location: 'Almacén Principal',
    currentStock: 25,
    minStock: 5,
    maxStock: 50,
    unitCost: 2500000,
    totalValue: 62500000,
    lastMovement: '2024-02-20',
    status: 'normal'
  },
  {
    id: 2,
    code: 'PROD002',
    name: 'Mouse Logitech MX',
    category: 'Accesorios',
    location: 'Tienda Centro',
    currentStock: 3,
    minStock: 10,
    maxStock: 30,
    unitCost: 150000,
    totalValue: 450000,
    lastMovement: '2024-02-19',
    status: 'low'
  },
  {
    id: 3,
    code: 'PROD003',
    name: 'Teclado Mecánico',
    category: 'Accesorios',
    location: 'Almacén Principal',
    currentStock: 0,
    minStock: 5,
    maxStock: 20,
    unitCost: 300000,
    totalValue: 0,
    lastMovement: '2024-02-18',
    status: 'out'
  }
])

// Filters
const filters = ref({
  search: '',
  location: '',
  category: '',
  status: ''
})

// View mode
const viewMode = ref('table') // 'table' or 'cards'

// Pagination
const itemsPerPage = 20
const currentPage = ref(1)

// Computed properties
const filteredItems = computed(() => {
  let filtered = stockItems.value

  if (filters.value.search) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      item.code.toLowerCase().includes(filters.value.search.toLowerCase())
    )
  }

  if (filters.value.location) {
    filtered = filtered.filter(item => item.location === filters.value.location)
  }

  if (filters.value.category) {
    filtered = filtered.filter(item => item.category === filters.value.category)
  }

  if (filters.value.status) {
    filtered = filtered.filter(item => item.status === filters.value.status)
  }

  return filtered
})

const totalItems = computed(() => filteredItems.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, totalItems.value))
const paginatedItems = computed(() => filteredItems.value.slice(startIndex.value, endIndex.value))

const stockSummary = computed(() => {
  const total = filteredItems.value.length
  const normal = filteredItems.value.filter(item => item.status === 'normal').length
  const low = filteredItems.value.filter(item => item.status === 'low').length
  const out = filteredItems.value.filter(item => item.status === 'out').length
  const totalValue = filteredItems.value.reduce((sum, item) => sum + item.totalValue, 0)

  return { total, normal, low, out, totalValue }
})

// Methods
const resetFilters = () => {
  filters.value = {
    search: '',
    location: '',
    category: '',
    status: ''
  }
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'normal': 'badge bg-success',
    'low': 'badge bg-warning',
    'out': 'badge bg-danger',
    'excess': 'badge bg-info'
  }
  return classes[status] || 'badge bg-secondary'
}

const getStatusText = (status) => {
  const texts = {
    'normal': 'Normal',
    'low': 'Stock Bajo',
    'out': 'Sin Stock',
    'excess': 'Exceso'
  }
  return texts[status] || 'Desconocido'
}

const getStockPercentage = (current, min, max) => {
  if (max === 0) return 0
  return Math.min((current / max) * 100, 100)
}

const getStockBarClass = (current, min, max) => {
  const percentage = (current / max) * 100
  if (current === 0) return 'bg-danger'
  if (current <= min) return 'bg-warning'
  if (percentage > 80) return 'bg-info'
  return 'bg-success'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(value)
}

const exportToExcel = () => {
  console.log('Exportar a Excel')
}

const printReport = () => {
  console.log('Imprimir reporte')
}

const viewDetails = (item) => {
  console.log('Ver detalles:', item)
}

const adjustStock = (item) => {
  console.log('Ajustar stock:', item)
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
          <h1 class="h3 mb-1">Stock de Inventario</h1>
          <p class="text-muted mb-0">Consulta y gestión de existencias</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-success" @click="exportToExcel">
            <i class="bi bi-file-earmark-excel me-2"></i>Exportar
          </button>
          <button class="btn btn-outline-secondary" @click="printReport">
            <i class="bi bi-printer me-2"></i>Imprimir
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="row g-4 mb-4">
        <div class="col-xl-3 col-md-6">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="bg-primary bg-opacity-10 rounded-3 p-3">
                    <i class="bi bi-box-seam text-primary fs-4"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <div class="text-muted small">Total Productos</div>
                  <div class="fs-4 fw-bold">{{ stockSummary.total }}</div>
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
                  <div class="bg-success bg-opacity-10 rounded-3 p-3">
                    <i class="bi bi-check-circle text-success fs-4"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <div class="text-muted small">Stock Normal</div>
                  <div class="fs-4 fw-bold text-success">{{ stockSummary.normal }}</div>
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
                  <div class="text-muted small">Stock Bajo</div>
                  <div class="fs-4 fw-bold text-warning">{{ stockSummary.low }}</div>
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
                    <i class="bi bi-x-circle text-danger fs-4"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <div class="text-muted small">Sin Stock</div>
                  <div class="fs-4 fw-bold text-danger">{{ stockSummary.out }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and View Controls -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3 align-items-end">
            <div class="col-md-3">
              <div class="form-floating">
                <input
                  type="text"
                  class="form-control"
                  id="searchProduct"
                  placeholder="Buscar producto"
                  v-model="filters.search"
                >
                <label for="searchProduct">
                  <i class="bi bi-search me-2"></i>Buscar producto
                </label>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-floating">
                <select class="form-select" id="locationFilter" v-model="filters.location">
                  <option value="">Todas</option>
                  <option v-for="location in locations" :key="location.id" :value="location.name">
                    {{ location.name }}
                  </option>
                </select>
                <label for="locationFilter">Ubicación</label>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-floating">
                <select class="form-select" id="categoryFilter" v-model="filters.category">
                  <option value="">Todas</option>
                  <option v-for="category in categories" :key="category.id" :value="category.name">
                    {{ category.name }}
                  </option>
                </select>
                <label for="categoryFilter">Categoría</label>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-floating">
                <select class="form-select" id="statusFilter" v-model="filters.status">
                  <option value="">Todos</option>
                  <option value="normal">Normal</option>
                  <option value="low">Stock Bajo</option>
                  <option value="out">Sin Stock</option>
                </select>
                <label for="statusFilter">Estado</label>
              </div>
            </div>
            <div class="col-md-2">
              <button class="btn btn-secondary w-100" @click="resetFilters">
                <i class="bi bi-x-circle me-2"></i>Limpiar
              </button>
            </div>
            <div class="col-md-1">
              <div class="btn-group w-100">
                <button 
                  class="btn btn-outline-secondary"
                  :class="{ active: viewMode === 'table' }"
                  @click="viewMode = 'table'"
                >
                  <i class="bi bi-table"></i>
                </button>
                <button 
                  class="btn btn-outline-secondary"
                  :class="{ active: viewMode === 'cards' }"
                  @click="viewMode = 'cards'"
                >
                  <i class="bi bi-grid-3x3-gap"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stock Table View -->
      <div v-if="viewMode === 'table'" class="card border-0 shadow-sm">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Ubicación</th>
                  <th>Stock Actual</th>
                  <th>Stock Mín/Máx</th>
                  <th>Nivel de Stock</th>
                  <th>Valor Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in paginatedItems" :key="item.id">
                  <td>
                    <code>{{ item.code }}</code>
                  </td>
                  <td>
                    <div class="fw-medium">{{ item.name }}</div>
                    <div class="text-muted small">Último mov: {{ item.lastMovement }}</div>
                  </td>
                  <td>{{ item.category }}</td>
                  <td>{{ item.location }}</td>
                  <td>
                    <span class="fw-bold">{{ item.currentStock }}</span>
                  </td>
                  <td>
                    <span class="text-muted">{{ item.minStock }} / {{ item.maxStock }}</span>
                  </td>
                  <td>
                    <div class="progress" style="height: 8px; width: 100px;">
                      <div 
                        class="progress-bar"
                        :class="getStockBarClass(item.currentStock, item.minStock, item.maxStock)"
                        :style="{ width: getStockPercentage(item.currentStock, item.minStock, item.maxStock) + '%' }"
                      ></div>
                    </div>
                    <small class="text-muted">{{ Math.round(getStockPercentage(item.currentStock, item.minStock, item.maxStock)) }}%</small>
                  </td>
                  <td>{{ formatCurrency(item.totalValue) }}</td>
                  <td>
                    <span :class="getStatusBadgeClass(item.status)">
                      {{ getStatusText(item.status) }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group">
                      <button class="btn btn-sm btn-outline-primary" @click="viewDetails(item)">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-warning" @click="adjustStock(item)">
                        <i class="bi bi-pencil-square"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <nav class="d-flex justify-content-between align-items-center mt-4">
            <p class="text-muted mb-0">
              Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ totalItems }} productos
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

      <!-- Stock Cards View -->
      <div v-if="viewMode === 'cards'" class="row g-4">
        <div v-for="item in paginatedItems" :key="item.id" class="col-xl-4 col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 class="card-title mb-1">{{ item.name }}</h6>
                  <code class="text-muted">{{ item.code }}</code>
                </div>
                <span :class="getStatusBadgeClass(item.status)">
                  {{ getStatusText(item.status) }}
                </span>
              </div>

              <div class="row g-3 mb-3">
                <div class="col-6">
                  <div class="text-muted small">Stock Actual</div>
                  <div class="fs-5 fw-bold">{{ item.currentStock }}</div>
                </div>
                <div class="col-6">
                  <div class="text-muted small">Valor Total</div>
                  <div class="fs-6 fw-bold">{{ formatCurrency(item.totalValue) }}</div>
                </div>
              </div>

              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="text-muted small">Nivel de Stock</span>
                  <span class="text-muted small">{{ Math.round(getStockPercentage(item.currentStock, item.minStock, item.maxStock)) }}%</span>
                </div>
                <div class="progress" style="height: 8px;">
                  <div 
                    class="progress-bar"
                    :class="getStockBarClass(item.currentStock, item.minStock, item.maxStock)"
                    :style="{ width: getStockPercentage(item.currentStock, item.minStock, item.maxStock) + '%' }"
                  ></div>
                </div>
                <div class="d-flex justify-content-between mt-1">
                  <span class="text-muted small">Mín: {{ item.minStock }}</span>
                  <span class="text-muted small">Máx: {{ item.maxStock }}</span>
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <div class="text-muted small">{{ item.location }}</div>
                  <div class="text-muted small">{{ item.category }}</div>
                </div>
                <div class="btn-group">
                  <button class="btn btn-sm btn-outline-primary" @click="viewDetails(item)">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-warning" @click="adjustStock(item)">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination for Cards -->
        <div class="col-12">
          <nav class="d-flex justify-content-between align-items-center">
            <p class="text-muted mb-0">
              Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ totalItems }} productos
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
