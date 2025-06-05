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

const products = ref([
  { 
    id: 1, 
    name: 'Producto 1',
    stock: {
      1: 100, // stock by location
      2: 50,
      3: 30,
      4: 20
    }
  },
  // Add more products with stock by location
])

const transfers = ref([
  {
    id: 1,
    date: '2024-02-20',
    reference: 'TRF-001',
    origin: 'Almacén Principal',
    destination: 'Tienda Centro',
    productCount: 3,
    status: 'Completado'
  },
  // Add more mock transfers
])

// Filters
const filters = ref({
  search: '',
  origin: '',
  destination: ''
})

// Pagination
const itemsPerPage = 10
const currentPage = ref(1)

// New transfer form
const newTransfer = ref({
  origin: '',
  destination: '',
  products: [{ id: '', quantity: 1, availableStock: 0 }],
  notes: ''
})

const isSubmitting = ref(false)

// Computed properties
const filteredTransfers = computed(() => {
  let filtered = transfers.value

  if (filters.value.search) {
    filtered = filtered.filter(transfer =>
      transfer.reference.toLowerCase().includes(filters.value.search.toLowerCase())
    )
  }

  if (filters.value.origin) {
    filtered = filtered.filter(transfer => 
      transfer.origin === locations.value.find(l => l.id === filters.value.origin)?.name
    )
  }

  if (filters.value.destination) {
    filtered = filtered.filter(transfer => 
      transfer.destination === locations.value.find(l => l.id === filters.value.destination)?.name
    )
  }

  return filtered
})

const availableDestinations = computed(() => {
  if (!newTransfer.value.origin) return []
  return locations.value.filter(location => location.id !== newTransfer.value.origin)
})

const availableProducts = computed(() => {
  if (!newTransfer.value.origin) return []
  return products.value.filter(product => product.stock[newTransfer.value.origin] > 0)
})

const isValidTransfer = computed(() => {
  return (
    newTransfer.value.origin &&
    newTransfer.value.destination &&
    newTransfer.value.products.every(p => p.id && p.quantity > 0 && p.quantity <= p.availableStock)
  )
})

const totalTransfers = computed(() => filteredTransfers.value.length)
const totalPages = computed(() => Math.ceil(totalTransfers.value / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, totalTransfers.value))

// Methods
const resetFilters = () => {
  filters.value = {
    search: '',
    origin: '',
    destination: ''
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

const openNewTransferModal = () => {
  const modal = new bootstrap.Modal(document.getElementById('newTransferModal'))
  modal.show()
}

const updateDestinationOptions = () => {
  newTransfer.value.destination = ''
  newTransfer.value.products = [{ id: '', quantity: 1, availableStock: 0 }]
}

const updateProductStock = (index) => {
  const product = newTransfer.value.products[index]
  const selectedProduct = products.value.find(p => p.id === product.id)
  if (selectedProduct) {
    product.availableStock = selectedProduct.stock[newTransfer.value.origin] || 0
    product.quantity = Math.min(product.quantity, product.availableStock)
  }
}

const addProduct = () => {
  newTransfer.value.products.push({ id: '', quantity: 1, availableStock: 0 })
}

const removeProduct = (index) => {
  newTransfer.value.products.splice(index, 1)
  if (newTransfer.value.products.length === 0) {
    addProduct()
  }
}

const submitTransfer = async () => {
  isSubmitting.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Transfer submitted:', newTransfer.value)
    // Reset form and close modal
    newTransfer.value = {
      origin: '',
      destination: '',
      products: [{ id: '', quantity: 1, availableStock: 0 }],
      notes: ''
    }
    bootstrap.Modal.getInstance(document.getElementById('newTransferModal')).hide()
  } catch (error) {
    console.error('Error submitting transfer:', error)
  } finally {
    isSubmitting.value = false
  }
}

const viewDetails = (transfer) => {
  console.log('View details:', transfer)
}

const printTransfer = (transfer) => {
  console.log('Print transfer:', transfer)
}

const confirmTransfer = async (transfer) => {
  if (confirm('¿Está seguro de confirmar esta transferencia?')) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      transfer.status = 'Completado'
      console.log('Transfer confirmed:', transfer)
    } catch (error) {
      console.error('Error confirming transfer:', error)
    }
  }
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
        <h1 class="h3">Transferencia de Productos</h1>
        <button class="btn btn-primary" @click="openNewTransferModal">
          <i class="bi bi-arrow-left-right me-2"></i>Nueva Transferencia
        </button>
      </div>

      <!-- Search and Filters -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-12 col-md-3">
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
                <select class="form-select" id="originFilter" v-model="filters.origin">
                  <option value="">Todas las ubicaciones</option>
                  <option v-for="location in locations" :key="location.id" :value="location.id">
                    {{ location.name }}
                  </option>
                </select>
                <label for="originFilter">Origen</label>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="form-floating">
                <select class="form-select" id="destinationFilter" v-model="filters.destination">
                  <option value="">Todas las ubicaciones</option>
                  <option v-for="location in locations" :key="location.id" :value="location.id">
                    {{ location.name }}
                  </option>
                </select>
                <label for="destinationFilter">Destino</label>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <button class="btn btn-secondary w-100 h-100" @click="resetFilters">
                <i class="bi bi-x-circle me-2"></i>Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transfers Table -->
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <h5 class="card-title mb-4">Transferencias Recientes</h5>
          
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Referencia</th>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Productos</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="transfer in filteredTransfers" :key="transfer.id">
                  <td>{{ transfer.date }}</td>
                  <td>{{ transfer.reference }}</td>
                  <td>{{ transfer.origin }}</td>
                  <td>{{ transfer.destination }}</td>
                  <td>{{ transfer.productCount }}</td>
                  <td>
                    <span :class="getStatusBadgeClass(transfer.status)">
                      {{ transfer.status }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group">
                      <button class="btn btn-sm btn-outline-primary" @click="viewDetails(transfer)">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-secondary" @click="printTransfer(transfer)">
                        <i class="bi bi-printer"></i>
                      </button>
                      <button 
                        v-if="transfer.status === 'Pendiente'"
                        class="btn btn-sm btn-outline-success" 
                        @click="confirmTransfer(transfer)"
                      >
                        <i class="bi bi-check-lg"></i>
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
              Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ totalTransfers }} transferencias
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

    <!-- New Transfer Modal -->
    <div class="modal fade" id="newTransferModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Nueva Transferencia de Productos</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitTransfer">
              <!-- Transfer Information -->
              <div class="row mb-4">
                <div class="col-md-6">
                  <label class="form-label">Ubicación de Origen</label>
                  <select 
                    class="form-select" 
                    v-model="newTransfer.origin"
                    @change="updateDestinationOptions"
                    required
                  >
                    <option value="">Seleccionar origen</option>
                    <option v-for="location in locations" :key="location.id" :value="location.id">
                      {{ location.name }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Ubicación de Destino</label>
                  <select 
                    class="form-select" 
                    v-model="newTransfer.destination"
                    :disabled="!newTransfer.origin"
                    required
                  >
                    <option value="">Seleccionar destino</option>
                    <option 
                      v-for="location in availableDestinations" 
                      :key="location.id" 
                      :value="location.id"
                    >
                      {{ location.name }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Products Table -->
              <div class="table-responsive mb-4">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Stock en Origen</th>
                      <th>Cantidad a Transferir</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(product, index) in newTransfer.products" :key="index">
                      <td>
                        <select 
                          class="form-select" 
                          v-model="product.id"
                          @change="updateProductStock(index)"
                          required
                        >
                          <option value="">Seleccionar producto</option>
                          <option 
                            v-for="p in availableProducts" 
                            :key="p.id" 
                            :value="p.id"
                          >
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
                          :max="product.availableStock"
                          min="1"
                          required
                        >
                      </td>
                      <td>
                        <button 
                          type="button" 
                          class="btn btn-sm btn-danger"
                          @click="removeProduct(index)"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="4">
                        <button 
                          type="button" 
                          class="btn btn-sm btn-secondary"
                          @click="addProduct"
                          :disabled="!newTransfer.origin"
                        >
                          <i class="bi bi-plus-lg me-2"></i>Agregar Producto
                        </button>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <!-- Additional Information -->
              <div class="mb-3">
                <label class="form-label">Notas</label>
                <textarea 
                  class="form-control" 
                  v-model="newTransfer.notes" 
                  rows="3"
                  placeholder="Agregar notas o comentarios sobre la transferencia..."
                ></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="isSubmitting || !isValidTransfer"
            >
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              Crear Transferencia
            </button>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

