<script setup>
import { ref, computed } from 'vue';
import DashboardLayout from '../../components/DashboardLayout.vue';

// Mock data
const categories = ref([
  { id: 1, name: 'Electrónicos' },
  { id: 2, name: 'Accesorios' },
  { id: 3, name: 'Repuestos' }
])

const reasons = ref([
  { id: 1, name: 'Venta' },
  { id: 2, name: 'Devolución' },
  { id: 3, name: 'Daño' },
  { id: 4, name: 'Obsolescencia' }
])

const products = ref([
  { id: 1, name: 'Producto 1', category: 1, stock: 100 },
  { id: 2, name: 'Producto 2', category: 2, stock: 50 },
  { id: 3, name: 'Producto 3', category: 3, stock: 75 }
])

const outputs = ref([
  {
    id: 1,
    date: '2024-02-20',
    product: 'Producto 1',
    quantity: 10,
    reason: 'Venta',
    responsible: 'Juan Pérez',
    status: 'Completado'
  },
  // Add more mock outputs as needed
])

// Filters
const filters = ref({
  search: '',
  category: '',
  reason: ''
})

// Pagination
const itemsPerPage = 10
const currentPage = ref(1)

// New output form
const newOutput = ref({
  date: '',
  reason: '',
  products: [{ id: '', quantity: 1, availableStock: 0 }],
  responsible: '',
  notes: ''
})

const isSubmitting = ref(false)

// Computed properties
const filteredOutputs = computed(() => {
  let filtered = outputs.value

  if (filters.value.search) {
    filtered = filtered.filter(output =>
      output.product.toLowerCase().includes(filters.value.search.toLowerCase())
    )
  }

  if (filters.value.reason) {
    filtered = filtered.filter(output => output.reason === filters.value.reason)
  }

  return filtered
})

const totalOutputs = computed(() => filteredOutputs.value.length)
const totalPages = computed(() => Math.ceil(totalOutputs.value / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, totalOutputs.value))

// Methods
const resetFilters = () => {
  filters.value = {
    search: '',
    category: '',
    reason: ''
  }
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'Completado': 'badge bg-success',
    'Pendiente': 'badge bg-warning',
    'Cancelado': 'badge bg-danger'
  }
  return classes[status] || 'badge bg-secondary'
}

const getStockBadgeClass = (stock) => {
  if (stock > 50) return 'bg-success'
  if (stock > 20) return 'bg-warning'
  return 'bg-danger'
}

const openNewOutputModal = () => {
  const modal = new bootstrap.Modal(document.getElementById('newOutputModal'))
  modal.show()
}

const updateAvailableStock = (index) => {
  const product = newOutput.value.products[index]
  const selectedProduct = products.value.find(p => p.id === product.id)
  if (selectedProduct) {
    product.availableStock = selectedProduct.stock
    product.quantity = Math.min(product.quantity, product.availableStock)
  }
}

const addProduct = () => {
  newOutput.value.products.push({ id: '', quantity: 1, availableStock: 0 })
}

const removeProduct = (index) => {
  newOutput.value.products.splice(index, 1)
}

const submitOutput = async () => {
  isSubmitting.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Output submitted:', newOutput.value)
    // Reset form and close modal
    newOutput.value = {
      date: '',
      reason: '',
      products: [{ id: '', quantity: 1, availableStock: 0 }],
      responsible: '',
      notes: ''
    }
    bootstrap.Modal.getInstance(document.getElementById('newOutputModal')).hide()
  } catch (error) {
    console.error('Error submitting output:', error)
  } finally {
    isSubmitting.value = false
  }
}

const viewDetails = (output) => {
  console.log('View details:', output)
}

const printOutput = (output) => {
  console.log('Print output:', output)
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
        <h1 class="h3">Salida de Productos</h1>
        <button class="btn btn-primary" @click="openNewOutputModal">
          <i class="bi bi-box-arrow-right me-2"></i>Nueva Salida
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
                <select class="form-select" id="categoryFilter" v-model="filters.category">
                  <option value="">Todas las categorías</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
                <label for="categoryFilter">Categoría</label>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="form-floating">
                <select class="form-select" id="reasonFilter" v-model="filters.reason">
                  <option value="">Todos los motivos</option>
                  <option v-for="reason in reasons" :key="reason.id" :value="reason.id">
                    {{ reason.name }}
                  </option>
                </select>
                <label for="reasonFilter">Motivo</label>
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

      <!-- Recent Outputs Table -->
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <h5 class="card-title mb-4">Salidas Recientes</h5>
          
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Motivo</th>
                  <th>Responsable</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="output in filteredOutputs" :key="output.id">
                  <td>{{ output.date }}</td>
                  <td>{{ output.product }}</td>
                  <td>{{ output.quantity }}</td>
                  <td>{{ output.reason }}</td>
                  <td>{{ output.responsible }}</td>
                  <td>
                    <span :class="getStatusBadgeClass(output.status)">
                      {{ output.status }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group">
                      <button class="btn btn-sm btn-outline-primary" @click="viewDetails(output)">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-secondary" @click="printOutput(output)">
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
              Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ totalOutputs }} salidas
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

    <!-- New Output Modal -->
    <div class="modal fade" id="newOutputModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Nueva Salida de Productos</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitOutput">
              <!-- Basic Information -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Fecha</label>
                  <input type="date" class="form-control" v-model="newOutput.date" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Motivo de Salida</label>
                  <select class="form-select" v-model="newOutput.reason" required>
                    <option value="">Seleccionar motivo</option>
                    <option v-for="reason in reasons" :key="reason.id" :value="reason.id">
                      {{ reason.name }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Products Table -->
              <div class="table-responsive mb-3">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Stock Disponible</th>
                      <th>Cantidad</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(product, index) in newOutput.products" :key="index">
                      <td>
                        <select class="form-select" v-model="product.id" @change="updateAvailableStock(index)" required>
                          <option value="">Seleccionar producto</option>
                          <option v-for="p in products" :key="p.id" :value="p.id">
                            {{ p.name }}
                          </option>
                        </select>
                      </td>
                      <td>
                        <span class="badge" :class="getStockBadgeClass(product.availableStock)">
                          {{ product.availableStock || 0 }}
                        </span>
                      </td>
                      <td>
                        <input 
                          type="number" 
                          class="form-control" 
                          v-model="product.quantity" 
                          min="1" 
                          :max="product.availableStock"
                          required
                        >
                      </td>
                      <td>
                        <button type="button" class="btn btn-sm btn-danger" @click="removeProduct(index)">
                          <i class="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="4">
                        <button type="button" class="btn btn-sm btn-secondary" @click="addProduct">
                          <i class="bi bi-plus-lg me-2"></i>Agregar Producto
                        </button>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <!-- Additional Information -->
              <div class="mb-3">
                <label class="form-label">Responsable</label>
                <input type="text" class="form-control" v-model="newOutput.responsible" required>
              </div>

              <div class="mb-3">
                <label class="form-label">Notas</label>
                <textarea class="form-control" v-model="newOutput.notes" rows="3"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              Registrar Salida
            </button>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
