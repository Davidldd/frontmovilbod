<script setup>
import { ref, computed } from 'vue';
import DashboardLayout from '../../components/DashboardLayout.vue';
// Mock data
const adjustmentTypes = ref([
  { id: 1, name: 'Conteo Físico' },
  { id: 2, name: 'Pérdida' },
  { id: 3, name: 'Daño' },
  { id: 4, name: 'Corrección' }
])

const locations = ref([
  { id: 1, name: 'Almacén Principal' },
  { id: 2, name: 'Almacén Secundario' },
  { id: 3, name: 'Tienda Centro' }
])

const products = ref([
  { 
    id: 1, 
    name: 'Producto 1',
    stock: {
      1: 100,
      2: 50,
      3: 30
    },
    lastUpdated: '2024-02-20 10:30'
  },
  // Add more products
])

const adjustments = ref([
  {
    id: 1,
    date: '2024-02-20',
    reference: 'ADJ-001',
    type: 'Conteo Físico',
    product: 'Producto 1',
    previousQuantity: 100,
    newQuantity: 95,
    difference: -5,
    status: 'Aprobado'
  },
  // Add more adjustments
])

// Filters
const filters = ref({
  search: '',
  type: '',
  location: ''
})

// Pagination
const itemsPerPage = 10
const currentPage = ref(1)

// New adjustment form
const newAdjustment = ref({
  type: '',
  location: '',
  product: '',
  method: 'absolute',
  quantity: 0,
  reason: ''
})

const isSubmitting = ref(false)
const currentStock = ref(0)
const lastUpdated = ref('')

// Computed properties
const filteredAdjustments = computed(() => {
  let filtered = adjustments.value

  if (filters.value.search) {
    filtered = filtered.filter(adjustment =>
      adjustment.product.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      adjustment.reference.toLowerCase().includes(filters.value.search.toLowerCase())
    )
  }

  if (filters.value.type) {
    filtered = filtered.filter(adjustment => 
      adjustment.type === adjustmentTypes.value.find(t => t.id === filters.value.type)?.name
    )
  }

  return filtered
})

const showPreview = computed(() => {
  return newAdjustment.value.product && 
         newAdjustment.value.quantity !== 0 && 
         currentStock.value !== null
})

const calculateFinalStock = computed(() => {
  if (newAdjustment.value.method === 'absolute') {
    return newAdjustment.value.quantity
  } else {
    return currentStock.value + Number(newAdjustment.value.quantity)
  }
})

const isValidAdjustment = computed(() => {
  return (
    newAdjustment.value.type &&
    newAdjustment.value.location &&
    newAdjustment.value.product &&
    newAdjustment.value.reason &&
    calculateFinalStock.value >= 0
  )
})

const totalAdjustments = computed(() => filteredAdjustments.value.length)
const totalPages = computed(() => Math.ceil(totalAdjustments.value / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, totalAdjustments.value))

// Methods
const resetFilters = () => {
  filters.value = {
    search: '',
    type: '',
    location: ''
  }
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'Aprobado': 'badge bg-success',
    'Pendiente': 'badge bg-warning',
    'Rechazado': 'badge bg-danger'
  }
  return classes[status] || 'badge bg-secondary'
}

const getTypeBadgeClass = (type) => {
  const classes = {
    'Conteo Físico': 'badge bg-primary',
    'Pérdida': 'badge bg-danger',
    'Daño': 'badge bg-warning',
    'Corrección': 'badge bg-info'
  }
  return classes[type] || 'badge bg-secondary'
}

const getDifferenceBadgeClass = (difference) => {
  if (difference > 0) return 'badge bg-success'
  if (difference < 0) return 'badge bg-danger'
  return 'badge bg-secondary'
}

const openNewAdjustmentModal = () => {
  const modal = new bootstrap.Modal(document.getElementById('newAdjustmentModal'))
  modal.show()
}

const updateProductDetails = () => {
  const product = products.value.find(p => p.id === newAdjustment.value.product)
  if (product && newAdjustment.value.location) {
    currentStock.value = product.stock[newAdjustment.value.location] || 0
    lastUpdated.value = product.lastUpdated
  } else {
    currentStock.value = 0
    lastUpdated.value = ''
  }
}

const submitAdjustment = async () => {
  isSubmitting.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Adjustment submitted:', {
      ...newAdjustment.value,
      finalStock: calculateFinalStock.value
    })
    // Reset form and close modal
    newAdjustment.value = {
      type: '',
      location: '',
      product: '',
      method: 'absolute',
      quantity: 0,
      reason: ''
    }
    currentStock.value = 0
    lastUpdated.value = ''
    bootstrap.Modal.getInstance(document.getElementById('newAdjustmentModal')).hide()
  } catch (error) {
    console.error('Error submitting adjustment:', error)
  } finally {
    isSubmitting.value = false
  }
}

const viewDetails = (adjustment) => {
  console.log('View details:', adjustment)
}

const printAdjustment = (adjustment) => {
  console.log('Print adjustment:', adjustment)
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
  <DashboardLayout />
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3">Ajuste de Inventario</h1>
        <button class="btn btn-primary" @click="openNewAdjustmentModal">
          <i class="bi bi-pencil-square me-2"></i>Nuevo Ajuste
        </button>
      </div>

      <!-- Search and Filters -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-12 col-md-4">
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
            <div class="col-12 col-md-3">
              <div class="form-floating">
                <select class="form-select" id="typeFilter" v-model="filters.type">
                  <option value="">Todos los tipos</option>
                  <option v-for="type in adjustmentTypes" :key="type.id" :value="type.id">
                    {{ type.name }}
                  </option>
                </select>
                <label for="typeFilter">Tipo de Ajuste</label>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="form-floating">
                <select class="form-select" id="locationFilter" v-model="filters.location">
                  <option value="">Todas las ubicaciones</option>
                  <option v-for="location in locations" :key="location.id" :value="location.id">
                    {{ location.name }}
                  </option>
                </select>
                <label for="locationFilter">Ubicación</label>
              </div>
            </div>
            <div class="col-12 col-md-2">
              <button class="btn btn-secondary w-100 h-100" @click="resetFilters">
                <i class="bi bi-x-circle me-2"></i>Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Adjustments Table -->
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <h5 class="card-title mb-4">Ajustes Recientes</h5>
          
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Referencia</th>
                  <th>Tipo</th>
                  <th>Producto</th>
                  <th>Cantidad Anterior</th>
                  <th>Cantidad Nueva</th>
                  <th>Diferencia</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="adjustment in filteredAdjustments" :key="adjustment.id">
                  <td>{{ adjustment.date }}</td>
                  <td>{{ adjustment.reference }}</td>
                  <td>
                    <span :class="getTypeBadgeClass(adjustment.type)">
                      {{ adjustment.type }}
                    </span>
                  </td>
                  <td>{{ adjustment.product }}</td>
                  <td>{{ adjustment.previousQuantity }}</td>
                  <td>{{ adjustment.newQuantity }}</td>
                  <td>
                    <span :class="getDifferenceBadgeClass(adjustment.difference)">
                      {{ adjustment.difference > 0 ? '+' : '' }}{{ adjustment.difference }}
                    </span>
                  </td>
                  <td>
                    <span :class="getStatusBadgeClass(adjustment.status)">
                      {{ adjustment.status }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group">
                      <button class="btn btn-sm btn-outline-primary" @click="viewDetails(adjustment)">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-secondary" @click="printAdjustment(adjustment)">
                        <i class="bi bi-printer"></i>
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
              Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ totalAdjustments }} ajustes
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

    <!-- New Adjustment Modal -->
    <div class="modal fade" id="newAdjustmentModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Nuevo Ajuste de Inventario</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitAdjustment">
              <!-- Basic Information -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Tipo de Ajuste</label>
                  <select class="form-select" v-model="newAdjustment.type" required>
                    <option value="">Seleccionar tipo</option>
                    <option v-for="type in adjustmentTypes" :key="type.id" :value="type.id">
                      {{ type.name }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Ubicación</label>
                  <select class="form-select" v-model="newAdjustment.location" required>
                    <option value="">Seleccionar ubicación</option>
                    <option v-for="location in locations" :key="location.id" :value="location.id">
                      {{ location.name }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Product Selection -->
              <div class="mb-3">
                <label class="form-label">Producto</label>
                <select 
                  class="form-select" 
                  v-model="newAdjustment.product"
                  @change="updateProductDetails"
                  required
                >
                  <option value="">Seleccionar producto</option>
                  <option v-for="product in products" :key="product.id" :value="product.id">
                    {{ product.name }}
                  </option>
                </select>
              </div>

              <!-- Current Stock Information -->
              <div class="alert alert-info mb-3" v-if="newAdjustment.product">
                <div class="d-flex align-items-center">
                  <i class="bi bi-info-circle-fill me-2"></i>
                  <div>
                    <strong>Stock Actual:</strong> {{ currentStock }}
                    <br>
                    <small class="text-muted">Última actualización: {{ lastUpdated }}</small>
                  </div>
                </div>
              </div>

              <!-- Quantity Adjustment -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Tipo de Cambio</label>
                  <div class="btn-group w-100">
                    <input
                      type="radio"
                      class="btn-check"
                      name="adjustmentMethod"
                      id="absolute"
                      value="absolute"
                      v-model="newAdjustment.method"
                    >
                    <label class="btn btn-outline-primary" for="absolute">
                      Cantidad Absoluta
                    </label>

                    <input
                      type="radio"
                      class="btn-check"
                      name="adjustmentMethod"
                      id="relative"
                      value="relative"
                      v-model="newAdjustment.method"
                    >
                    <label class="btn btn-outline-primary" for="relative">
                      Ajuste Relativo
                    </label>
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">
                    {{ newAdjustment.method === 'absolute' ? 'Nueva Cantidad' : 'Ajuste (+/-)' }}
                  </label>
                  <input
                    type="number"
                    class="form-control"
                    v-model="newAdjustment.quantity"
                    :min="newAdjustment.method === 'absolute' ? 0 : null"
                    required
                  >
                </div>
              </div>

              <!-- Preview -->
              <div class="alert alert-warning mb-3" v-if="showPreview">
                <div class="d-flex align-items-center">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>
                    <strong>Vista Previa del Ajuste:</strong>
                    <br>
                    Stock Actual: {{ currentStock }}
                    <br>
                    {{ newAdjustment.method === 'absolute' ? 'Nueva Cantidad' : 'Ajuste' }}: 
                    {{ newAdjustment.method === 'absolute' ? newAdjustment.quantity : (newAdjustment.quantity > 0 ? '+' : '') + newAdjustment.quantity }}
                    <br>
                    Stock Final: {{ calculateFinalStock }}
                  </div>
                </div>
              </div>

              <!-- Reason -->
              <div class="mb-3">
                <label class="form-label">Motivo del Ajuste</label>
                <textarea 
                  class="form-control" 
                  v-model="newAdjustment.reason" 
                  rows="3"
                  placeholder="Explique el motivo del ajuste..."
                  required
                ></textarea>
              </div>

              <!-- Evidence Upload -->
              <div class="mb-3">
                <label class="form-label">Evidencia (Opcional)</label>
                <input type="file" class="form-control" accept="image/*,.pdf">
                <small class="text-muted">
                  Puede adjuntar imágenes o documentos PDF que justifiquen el ajuste
                </small>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="isSubmitting || !isValidAdjustment"
            >
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              Realizar Ajuste
            </button>
          </div>
        </div>
      </div>
    </div>
  
</template>

