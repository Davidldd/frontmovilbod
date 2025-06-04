<script setup>
import { ref, computed } from 'vue';
import DashboardLayout from '../../components/DashboardLayout.vue';

// Mock data
const categories = ref([
  { id: 1, name: 'Electrónicos' },
  { id: 2, name: 'Accesorios' },
  { id: 3, name: 'Repuestos' }
])

const suppliers = ref([
  { id: 1, name: 'Proveedor A' },
  { id: 2, name: 'Proveedor B' },
  { id: 3, name: 'Proveedor C' }
])

const products = ref([
  { id: 1, name: 'Producto 1', category: 1 },
  { id: 2, name: 'Producto 2', category: 2 },
  { id: 3, name: 'Producto 3', category: 3 }
])

const entries = ref([
  {
    id: 1,
    date: '2024-02-20',
    product: 'Producto 1',
    quantity: 100,
    supplier: 'Proveedor A',
    invoice: 'FAC-001',
    status: 'Completado'
  },
  // Add more mock entries as needed
])

// Filters
const filters = ref({
  search: '',
  category: '',
  supplier: ''
})

// Pagination
const itemsPerPage = 10
const currentPage = ref(1)

// New entry form
const newEntry = ref({
  supplier: '',
  invoice: '',
  invoiceDate: '',
  products: [{ id: '', quantity: 1, price: 0 }],
  notes: ''
})

const isSubmitting = ref(false)

// Computed properties
const filteredEntries = computed(() => {
  let filtered = entries.value

  if (filters.value.search) {
    filtered = filtered.filter(entry =>
      entry.product.toLowerCase().includes(filters.value.search.toLowerCase())
    )
  }

  if (filters.value.supplier) {
    filtered = filtered.filter(entry => entry.supplier === filters.value.supplier)
  }

  return filtered
})

const totalEntries = computed(() => filteredEntries.value.length)
const totalPages = computed(() => Math.ceil(totalEntries.value / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, totalEntries.value))

// Methods
const resetFilters = () => {
  filters.value = {
    search: '',
    category: '',
    supplier: ''
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

const openNewEntryModal = () => {
  const modal = new bootstrap.Modal(document.getElementById('newEntryModal'))
  modal.show()
}

const addProduct = () => {
  newEntry.value.products.push({ id: '', quantity: 1, price: 0 })
}

const removeProduct = (index) => {
  newEntry.value.products.splice(index, 1)
}

const calculateSubtotal = (product) => {
  return (product.quantity * product.price).toFixed(2)
}

const calculateTotal = () => {
  const subtotal = newEntry.value.products.reduce((sum, product) => {
    return sum + (product.quantity * product.price)
  }, 0)
  
  const tax = subtotal * 0.19
  const total = subtotal + tax
  
  return {
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2)
  }
}

const submitEntry = async () => {
  isSubmitting.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Entry submitted:', newEntry.value)
    // Reset form and close modal
    newEntry.value = {
      supplier: '',
      invoice: '',
      invoiceDate: '',
      products: [{ id: '', quantity: 1, price: 0 }],
      notes: ''
    }
    bootstrap.Modal.getInstance(document.getElementById('newEntryModal')).hide()
  } catch (error) {
    console.error('Error submitting entry:', error)
  } finally {
    isSubmitting.value = false
  }
}

const viewDetails = (entry) => {
  console.log('View details:', entry)
}

const printEntry = (entry) => {
  console.log('Print entry:', entry)
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
        <h1 class="h3">Ingreso de Productos</h1>
        <button class="btn btn-primary" @click="openNewEntryModal">
          <i class="bi bi-plus-lg me-2"></i>Nuevo Ingreso
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
                <select class="form-select" id="supplierFilter" v-model="filters.supplier">
                  <option value="">Todos los proveedores</option>
                  <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                    {{ supplier.name }}
                  </option>
                </select>
                <label for="supplierFilter">Proveedor</label>
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

      <!-- Recent Entries Table -->
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <h5 class="card-title mb-4">Entradas Recientes</h5>
          
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Proveedor</th>
                  <th>No. Factura</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="entry in filteredEntries" :key="entry.id">
                  <td>{{ entry.date }}</td>
                  <td>{{ entry.product }}</td>
                  <td>{{ entry.quantity }}</td>
                  <td>{{ entry.supplier }}</td>
                  <td>{{ entry.invoice }}</td>
                  <td>
                    <span :class="getStatusBadgeClass(entry.status)">
                      {{ entry.status }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group">
                      <button class="btn btn-sm btn-outline-primary" @click="viewDetails(entry)">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-secondary" @click="printEntry(entry)">
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
              Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ totalEntries }} entradas
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

    <!-- New Entry Modal -->
    <div class="modal fade" id="newEntryModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Nuevo Ingreso de Productos</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitEntry">
              <!-- Supplier Selection -->
              <div class="mb-3">
                <label class="form-label">Proveedor</label>
                <select class="form-select" v-model="newEntry.supplier" required>
                  <option value="">Seleccionar proveedor</option>
                  <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                    {{ supplier.name }}
                  </option>
                </select>
              </div>

              <!-- Invoice Information -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">No. Factura</label>
                  <input type="text" class="form-control" v-model="newEntry.invoice" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Fecha de Factura</label>
                  <input type="date" class="form-control" v-model="newEntry.invoiceDate" required>
                </div>
              </div>

              <!-- Products Table -->
              <div class="table-responsive mb-3">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio Unitario</th>
                      <th>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(product, index) in newEntry.products" :key="index">
                      <td>
                        <select class="form-select" v-model="product.id" required>
                          <option value="">Seleccionar producto</option>
                          <option v-for="p in products" :key="p.id" :value="p.id">
                            {{ p.name }}
                          </option>
                        </select>
                      </td>
                      <td>
                        <input type="number" class="form-control" v-model="product.quantity" min="1" required>
                      </td>
                      <td>
                        <input type="number" class="form-control" v-model="product.price" min="0" step="0.01" required>
                      </td>
                      <td>
                        {{ calculateSubtotal(product) }}
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
                      <td colspan="5">
                        <button type="button" class="btn btn-sm btn-secondary" @click="addProduct">
                          <i class="bi bi-plus-lg me-2"></i>Agregar Producto
                        </button>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <!-- Totals -->
              <div class="row justify-content-end">
                <div class="col-md-4">
                  <table class="table table-sm">
                    <tbody>
                      <tr>
                        <th>Subtotal:</th>
                        <td class="text-end">${{ calculateTotal().subtotal }}</td>
                      </tr>
                      <tr>
                        <th>IVA (19%):</th>
                        <td class="text-end">${{ calculateTotal().tax }}</td>
                      </tr>
                      <tr>
                        <th>Total:</th>
                        <td class="text-end">${{ calculateTotal().total }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Notes -->
              <div class="mb-3">
                <label class="form-label">Notas</label>
                <textarea class="form-control" v-model="newEntry.notes" rows="3"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              Guardar Entrada
            </button>
          </div>
        </div>
      </div>
    </div>
</template>

