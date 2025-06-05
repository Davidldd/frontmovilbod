<template>
  <DashboardLayout>
    <div class="container-fluid m-md-5 pd-5">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3">Categorías</h1>
        <button class="btn btn-primary" @click="openNewCategoryModal">
          <i class="bi bi-plus-lg me-2"></i>Nueva Categoría
        </button>
      </div>

      <div class="row">
        <!-- Categories List -->
        <div class="col-12 col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <!-- Search -->
              <div class="mb-4">
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-search"></i>
                  </span>
                  <input
                      type="text"
                      class="form-control"
                      placeholder="Buscar categoría..."
                      v-model="searchTerm"
                  >
                </div>
              </div>

              <!-- Categories Table -->
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                  <tr>
                    <th style="width: 50px;"></th>
                    <th>Nombre</th>
                    <th>Productos</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="category in filteredCategories" :key="category.id">
                    <td>
                      <div
                          class="category-icon"
                          :style="{ backgroundColor: category.color + '20' }"
                      >
                        <i class="bi" :class="category.icon" :style="{ color: category.color }"></i>
                      </div>
                    </td>
                    <td>
                      <strong>{{ category.name }}</strong>
                      <small class="text-muted d-block">{{ category.description }}</small>
                    </td>
                    <td>
                      <span class="badge bg-primary">{{ category.productCount }}</span>
                    </td>
                    <td>
                        <span
                            class="badge"
                            :class="category.isActive ? 'bg-success' : 'bg-danger'"
                        >
                          {{ category.isActive ? 'Activa' : 'Inactiva' }}
                        </span>
                    </td>
                    <td>
                      <div class="btn-group">
                        <button
                            class="btn btn-sm btn-outline-primary"
                            @click="editCategory(category)"
                        >
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button
                            class="btn btn-sm btn-outline-danger"
                            @click="deleteCategory(category)"
                            :disabled="category.productCount > 0"
                        >
                          <i class="bi bi-trash"></i>
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
                  Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ totalCategories }} categorías
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

        <!-- Statistics -->
        <div class="col-12 col-lg-4">
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body">
              <h5 class="card-title">Estadísticas</h5>
              <div class="row g-3">
                <div class="col-6">
                  <div class="p-3 bg-primary bg-opacity-10 rounded">
                    <h6 class="mb-1">Total Categorías</h6>
                    <h3 class="mb-0 text-primary">{{ statistics.totalCategories }}</h3>
                  </div>
                </div>
                <div class="col-6">
                  <div class="p-3 bg-success bg-opacity-10 rounded">
                    <h6 class="mb-1">Categorías Activas</h6>
                    <h3 class="mb-0 text-success">{{ statistics.activeCategories }}</h3>
                  </div>
                </div>
                <div class="col-6">
                  <div class="p-3 bg-warning bg-opacity-10 rounded">
                    <h6 class="mb-1">Productos</h6>
                    <h3 class="mb-0 text-warning">{{ statistics.totalProducts }}</h3>
                  </div>
                </div>
                <div class="col-6">
                  <div class="p-3 bg-info bg-opacity-10 rounded">
                    <h6 class="mb-1">Promedio</h6>
                    <h3 class="mb-0 text-info">{{ statistics.averageProducts }}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Category Distribution -->
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Distribución de Productos</h5>
              <div class="mb-4">
                <canvas ref="chartRef" height="200"></canvas>
              </div>
              <div class="list-group list-group-flush">
                <div
                    v-for="category in topCategories"
                    :key="category.id"
                    class="list-group-item d-flex justify-content-between align-items-center px-0"
                >
                  <div class="d-flex align-items-center">
                    <div
                        class="category-icon me-2"
                        :style="{ backgroundColor: category.color + '20' }"
                    >
                      <i class="bi" :class="category.icon" :style="{ color: category.color }"></i>
                    </div>
                    <span>{{ category.name }}</span>
                  </div>
                  <span class="badge bg-primary rounded-pill">{{ category.productCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New/Edit Category Modal -->
    <div class="modal fade" id="categoryModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingCategory ? 'Editar Categoría' : 'Nueva Categoría' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveCategory">
              <!-- Name -->
              <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="categoryForm.name"
                    :class="{'is-invalid': validationErrors.name}"
                    placeholder="Ingrese el nombre de la categoría"
                >
                <div class="invalid-feedback">{{ validationErrors.name }}</div>
              </div>

              <!-- Description -->
              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea
                    class="form-control"
                    v-model="categoryForm.description"
                    rows="3"
                    placeholder="Describa la categoría"
                ></textarea>
              </div>

              <!-- Icon and Color -->
              <div class="row mb-3">
                <div class="col">
                  <label class="form-label">Ícono</label>
                  <select class="form-select" v-model="categoryForm.icon">
                    <option value="bi-laptop">💻 Laptop</option>
                    <option value="bi-phone">📱 Teléfono</option>
                    <option value="bi-headphones">🎧 Audífonos</option>
                    <option value="bi-camera">📷 Cámara</option>
                    <option value="bi-printer">🖨️ Impresora</option>
                  </select>
                </div>
                <div class="col">
                  <label class="form-label">Color</label>
                  <input
                      type="color"
                      class="form-control form-control-color w-100"
                      v-model="categoryForm.color"
                  >
                </div>
              </div>

              <!-- Status -->
              <div class="form-check form-switch mb-3">
                <input
                    class="form-check-input"
                    type="checkbox"
                    id="categoryStatus"
                    v-model="categoryForm.isActive"
                >
                <label class="form-check-label" for="categoryStatus">
                  Categoría Activa
                </label>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button
                type="submit"
                class="btn btn-primary"
                :disabled="isSubmitting"
                @click="saveCategory"
            >
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              {{ editingCategory ? 'Guardar Cambios' : 'Crear Categoría' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Chart } from 'chart.js/auto'
import DashboardLayout from '../../components/DashboardLayout.vue'

// Chart reference
const chartRef = ref(null)
let chart = null

// Mock data
const categories = ref([
  {
    id: 1,
    name: 'Electrónicos',
    description: 'Productos electrónicos y gadgets',
    icon: 'bi-laptop',
    color: '#0d6efd',
    productCount: 25,
    isActive: true
  },
  {
    id: 2,
    name: 'Accesorios',
    description: 'Accesorios para dispositivos',
    icon: 'bi-headphones',
    color: '#20c997',
    productCount: 15,
    isActive: true
  },
  {
    id: 3,
    name: 'Repuestos',
    description: 'Repuestos y componentes',
    icon: 'bi-tools',
    color: '#fd7e14',
    productCount: 10,
    isActive: true
  }
])

// Statistics
const statistics = computed(() => {
  const total = categories.value.length
  const active = categories.value.filter(c => c.isActive).length
  const products = categories.value.reduce((sum, c) => sum + c.productCount, 0)
  return {
    totalCategories: total,
    activeCategories: active,
    totalProducts: products,
    averageProducts: Math.round(products / total)
  }
})

// Top categories for the list
const topCategories = computed(() => {
  return [...categories.value]
      .sort((a, b) => b.productCount - a.productCount)
      .slice(0, 5)
})

// Form state
const searchTerm = ref('')
const currentPage = ref(1)
const itemsPerPage = 5
const isSubmitting = ref(false)
const editingCategory = ref(null)
const validationErrors = ref({})

const categoryForm = ref({
  name: '',
  description: '',
  icon: 'bi-laptop',
  color: '#0d6efd',
  isActive: true
})

// Computed properties
const filteredCategories = computed(() => {
  if (!searchTerm.value) return categories.value

  const term = searchTerm.value.toLowerCase()
  return categories.value.filter(category =>
      category.name.toLowerCase().includes(term) ||
      category.description.toLowerCase().includes(term)
  )
})

const totalCategories = computed(() => filteredCategories.value.length)
const totalPages = computed(() => Math.ceil(totalCategories.value / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, totalCategories.value))

// Methods
const initChart = () => {
  const ctx = chartRef.value.getContext('2d')

  if (chart) {
    chart.destroy()
  }

  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: categories.value.map(c => c.name),
      datasets: [{
        data: categories.value.map(c => c.productCount),
        backgroundColor: categories.value.map(c => c.color),
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      }
    }
  })
}

const openNewCategoryModal = () => {
  editingCategory.value = null
  categoryForm.value = {
    name: '',
    description: '',
    icon: 'bi-laptop',
    color: '#0d6efd',
    isActive: true
  }
  validationErrors.value = {}
  const modal = new bootstrap.Modal(document.getElementById('categoryModal'))
  modal.show()
}

const editCategory = (category) => {
  editingCategory.value = category
  categoryForm.value = { ...category }
  const modal = new bootstrap.Modal(document.getElementById('categoryModal'))
  modal.show()
}

const validateForm = () => {
  const errors = {}

  if (!categoryForm.value.name.trim()) {
    errors.name = 'El nombre es requerido'
  }

  validationErrors.value = errors
  return Object.keys(errors).length === 0
}

const saveCategory = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (editingCategory.value) {
      const index = categories.value.findIndex(c => c.id === editingCategory.value.id)
      categories.value[index] = { ...editingCategory.value, ...categoryForm.value }
    } else {
      categories.value.push({
        id: categories.value.length + 1,
        ...categoryForm.value,
        productCount: 0
      })
    }

    bootstrap.Modal.getInstance(document.getElementById('categoryModal')).hide()
    initChart()
  } catch (error) {
    console.error('Error saving category:', error)
  } finally {
    isSubmitting.value = false
  }
}

const deleteCategory = async (category) => {
  if (category.productCount > 0) {
    alert('No se puede eliminar una categoría que contiene productos')
    return
  }

  if (confirm('¿Está seguro de eliminar esta categoría?')) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      categories.value = categories.value.filter(c => c.id !== category.id)
      initChart()
    } catch (error) {
      console.error('Error deleting category:', error)
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

onMounted(() => {
  initChart()
})
</script>

<style scoped>
.category-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>