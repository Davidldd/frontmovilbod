<template>
  <DashboardLayout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3">Catálogo de Productos</h1>
        <div class="btn-group">
          <button class="btn btn-outline-primary" @click="exportProducts">
            <i class="bi bi-download me-2"></i>Exportar
          </button>
          <router-link to="/catalog/products/new" class="btn btn-primary">
            <i class="bi bi-plus-lg me-2"></i>Nuevo Producto
          </router-link>
        </div>
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
                <select class="form-select" id="statusFilter" v-model="filters.status">
                  <option value="">Todos los estados</option>
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
                <label for="statusFilter">Estado</label>
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

      <!-- Products Grid -->
      <div class="row g-4">
        <div v-for="product in filteredProducts" :key="product.id" class="col-12 col-md-6 col-lg-4">
          <div class="card h-100 border-0 shadow-sm">
            <div class="position-relative">
              <img :src="product.image" class="card-img-top" :alt="product.name" style="height: 200px; object-fit: cover;">
              <span
                  class="position-absolute top-0 end-0 m-2 badge"
                  :class="product.status === 'active' ? 'bg-success' : 'bg-danger'"
              >
                {{ product.status === 'active' ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
            <div class="card-body">
              <h5 class="card-title mb-1">{{ product.name }}</h5>
              <p class="text-muted small mb-2">
                <i class="bi bi-tag me-1"></i>{{ getCategoryName(product.category) }}
              </p>
              <p class="card-text small mb-3">{{ product.description }}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="mb-0 small">
                    <i class="bi bi-box-seam me-1"></i>Stock:
                    <span :class="getStockClass(product.stock)">{{ product.stock }}</span>
                  </p>
                  <p class="mb-0 small">
                    <i class="bi bi-currency-dollar me-1"></i>Precio: {{ product.price }}
                  </p>
                </div>
                <div class="btn-group">
                  <button class="btn btn-sm btn-outline-primary" @click="editProduct(product)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                      class="btn btn-sm"
                      :class="product.status === 'active' ? 'btn-outline-danger' : 'btn-outline-success'"
                      @click="toggleStatus(product)"
                  >
                    <i class="bi" :class="product.status === 'active' ? 'bi-x-lg' : 'bi-check-lg'"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="card-footer bg-transparent border-0">
              <div class="progress" style="height: 5px;">
                <div
                    class="progress-bar"
                    :class="getStockProgressClass(product.stock)"
                    :style="{ width: getStockPercentage(product.stock) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <nav class="d-flex justify-content-between align-items-center mt-4">
        <p class="text-muted mb-0">
          Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ totalProducts }} productos
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
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '../../components/DashboardLayout.vue'

const router = useRouter()

// Mock data
const categories = ref([
  { id: 1, name: 'Electrónicos' },
  { id: 2, name: 'Accesorios' },
  { id: 3, name: 'Repuestos' }
])

const products = ref([
  {
    id: 1,
    name: 'Laptop Dell XPS',
    description: 'Laptop de alta gama para profesionales',
    category: 1,
    price: 1299.99,
    stock: 15,
    status: 'active',
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 2,
    name: 'Mouse Inalámbrico',
    description: 'Mouse ergonómico con tecnología bluetooth',
    category: 2,
    price: 29.99,
    stock: 50,
    status: 'active',
    image: 'https://images.pexels.com/photos/5082576/pexels-photo-5082576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  // Add more products as needed
])

// Filters
const filters = ref({
  search: '',
  category: '',
  status: ''
})

// Pagination
const itemsPerPage = 9
const currentPage = ref(1)

// Computed properties
const filteredProducts = computed(() => {
  let filtered = products.value

  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    )
  }

  if (filters.value.category) {
    filtered = filtered.filter(product => product.category === filters.value.category)
  }

  if (filters.value.status) {
    filtered = filtered.filter(product => product.status === filters.value.status)
  }

  return filtered
})

const totalProducts = computed(() => filteredProducts.value.length)
const totalPages = computed(() => Math.ceil(totalProducts.value / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, totalProducts.value))
const paginatedProducts = computed(() =>
    filteredProducts.value.slice(startIndex.value, endIndex.value)
)

// Methods
const resetFilters = () => {
  filters.value = {
    search: '',
    category: '',
    status: ''
  }
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : 'Sin categoría'
}

const getStockClass = (stock) => {
  if (stock > 50) return 'text-success'
  if (stock > 20) return 'text-warning'
  return 'text-danger'
}

const getStockProgressClass = (stock) => {
  if (stock > 50) return 'bg-success'
  if (stock > 20) return 'bg-warning'
  return 'bg-danger'
}

const getStockPercentage = (stock) => {
  const maxStock = 100 // You might want to make this dynamic based on your needs
  return Math.min((stock / maxStock) * 100, 100)
}

const editProduct = (product) => {
  router.push({
    path: '/catalog/products/new',
    query: { id: product.id }
  })
}

const toggleStatus = async (product) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    product.status = product.status === 'active' ? 'inactive' : 'active'
  } catch (error) {
    console.error('Error toggling status:', error)
  }
}

const exportProducts = () => {
  // Implement export functionality
  console.log('Exporting products...')
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