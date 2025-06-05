<template>
  <DashboardLayout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3">{{ isEditing ? 'Editar Producto' : 'Nuevo Producto' }}</h1>
        <router-link to="/catalog/products" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left me-2"></i>Volver al Catálogo
        </router-link>
      </div>

      <!-- Product Form -->
      <div class="row">
        <div class="col-12 col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <form @submit.prevent="saveProduct">
                <!-- Basic Information -->
                <h5 class="card-title mb-4">Información Básica</h5>
                <div class="row g-3 mb-4">
                  <div class="col-md-6">
                    <label class="form-label">Código SKU</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="bi bi-upc-scan"></i>
                      </span>
                      <input
                          type="text"
                          class="form-control"
                          v-model="productForm.sku"
                          :class="{'is-invalid': validationErrors.sku}"
                          placeholder="Ejemplo: PRD-001"
                      >
                      <div class="invalid-feedback">{{ validationErrors.sku }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Código de Barras</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="bi bi-upc"></i>
                      </span>
                      <input
                          type="text"
                          class="form-control"
                          v-model="productForm.barcode"
                          placeholder="Ejemplo: 7501234567890"
                      >
                    </div>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Nombre del Producto</label>
                    <input
                        type="text"
                        class="form-control"
                        v-model="productForm.name"
                        :class="{'is-invalid': validationErrors.name}"
                        placeholder="Ingrese el nombre del producto"
                    >
                    <div class="invalid-feedback">{{ validationErrors.name }}</div>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Descripción</label>
                    <textarea
                        class="form-control"
                        v-model="productForm.description"
                        rows="3"
                        placeholder="Describa las características del producto"
                    ></textarea>
                  </div>
                </div>

                <!-- Categories and Tags -->
                <h5 class="card-title mb-4">Categorización</h5>
                <div class="row g-3 mb-4">
                  <div class="col-md-6">
                    <label class="form-label">Categoría</label>
                    <select
                        class="form-select"
                        v-model="productForm.category"
                        :class="{'is-invalid': validationErrors.category}"
                    >
                      <option value="">Seleccionar categoría</option>
                      <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                      </option>
                    </select>
                    <div class="invalid-feedback">{{ validationErrors.category }}</div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Marca</label>
                    <select class="form-select" v-model="productForm.brand">
                      <option value="">Seleccionar marca</option>
                      <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                        {{ brand.name }}
                      </option>
                    </select>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Etiquetas</label>
                    <input
                        type="text"
                        class="form-control"
                        v-model="productForm.tags"
                        placeholder="Separar etiquetas por comas"
                    >
                    <small class="text-muted">Ejemplo: electrónico, portátil, profesional</small>
                  </div>
                </div>

                <!-- Pricing and Stock -->
                <h5 class="card-title mb-4">Precios e Inventario</h5>
                <div class="row g-3 mb-4">
                  <div class="col-md-6">
                    <label class="form-label">Precio de Compra</label>
                    <div class="input-group">
                      <span class="input-group-text">$</span>
                      <input
                          type="number"
                          class="form-control"
                          v-model="productForm.costPrice"
                          step="0.01"
                          min="0"
                          :class="{'is-invalid': validationErrors.costPrice}"
                      >
                      <div class="invalid-feedback">{{ validationErrors.costPrice }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Precio de Venta</label>
                    <div class="input-group">
                      <span class="input-group-text">$</span>
                      <input
                          type="number"
                          class="form-control"
                          v-model="productForm.salePrice"
                          step="0.01"
                          min="0"
                          :class="{'is-invalid': validationErrors.salePrice}"
                      >
                      <div class="invalid-feedback">{{ validationErrors.salePrice }}</div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Stock Mínimo</label>
                    <input
                        type="number"
                        class="form-control"
                        v-model="productForm.minStock"
                        min="0"
                    >
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Stock Máximo</label>
                    <input
                        type="number"
                        class="form-control"
                        v-model="productForm.maxStock"
                        min="0"
                    >
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Unidad de Medida</label>
                    <select class="form-select" v-model="productForm.unit">
                      <option value="piece">Pieza</option>
                      <option value="kg">Kilogramo</option>
                      <option value="liter">Litro</option>
                      <option value="meter">Metro</option>
                    </select>
                  </div>
                </div>

                <!-- Additional Information -->
                <h5 class="card-title mb-4">Información Adicional</h5>
                <div class="row g-3 mb-4">
                  <div class="col-md-6">
                    <label class="form-label">Peso (kg)</label>
                    <input
                        type="number"
                        class="form-control"
                        v-model="productForm.weight"
                        step="0.01"
                        min="0"
                    >
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Dimensiones (cm)</label>
                    <div class="input-group">
                      <input
                          type="number"
                          class="form-control"
                          v-model="productForm.length"
                          placeholder="Largo"
                          min="0"
                      >
                      <input
                          type="number"
                          class="form-control"
                          v-model="productForm.width"
                          placeholder="Ancho"
                          min="0"
                      >
                      <input
                          type="number"
                          class="form-control"
                          v-model="productForm.height"
                          placeholder="Alto"
                          min="0"
                      >
                    </div>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Notas Internas</label>
                    <textarea
                        class="form-control"
                        v-model="productForm.notes"
                        rows="3"
                        placeholder="Información adicional para uso interno"
                    ></textarea>
                  </div>
                </div>

                <!-- Submit Buttons -->
                <div class="d-flex justify-content-end gap-2">
                  <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="resetForm"
                  >
                    Restablecer
                  </button>
                  <button
                      type="submit"
                      class="btn btn-primary"
                      :disabled="isSubmitting"
                  >
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isEditing ? 'Guardar Cambios' : 'Crear Producto' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Side Panel -->
        <div class="col-12 col-lg-4">
          <!-- Product Image -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body">
              <h5 class="card-title mb-4">Imagen del Producto</h5>
              <div class="text-center mb-3">
                <img
                    :src="productForm.image || 'https://via.placeholder.com/300'"
                    class="img-fluid rounded"
                    alt="Product Image"
                    style="max-height: 200px; object-fit: contain;"
                >
              </div>
              <div class="d-grid">
                <button type="button" class="btn btn-outline-primary">
                  <i class="bi bi-upload me-2"></i>Subir Imagen
                </button>
              </div>
            </div>
          </div>

          <!-- Product Status -->
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h5 class="card-title mb-4">Estado del Producto</h5>
              <div class="form-check form-switch mb-3">
                <input
                    class="form-check-input"
                    type="checkbox"
                    id="activeStatus"
                    v-model="productForm.isActive"
                >
                <label class="form-check-label" for="activeStatus">
                  Producto Activo
                </label>
              </div>
              <div class="form-check form-switch mb-3">
                <input
                    class="form-check-input"
                    type="checkbox"
                    id="featuredStatus"
                    v-model="productForm.isFeatured"
                >
                <label class="form-check-label" for="featuredStatus">
                  Producto Destacado
                </label>
              </div>
              <hr>
              <small class="text-muted d-block mb-2">
                Creado: {{ productForm.createdAt || 'No disponible' }}
              </small>
              <small class="text-muted d-block">
                Última actualización: {{ productForm.updatedAt || 'No disponible' }}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DashboardLayout from '../../components/DashboardLayout.vue'

const router = useRouter()
const route = useRoute()

// Mock data
const categories = ref([
  { id: 1, name: 'Electrónicos' },
  { id: 2, name: 'Accesorios' },
  { id: 3, name: 'Repuestos' }
])

const brands = ref([
  { id: 1, name: 'Dell' },
  { id: 2, name: 'HP' },
  { id: 3, name: 'Lenovo' }
])

// Form state
const productForm = ref({
  sku: '',
  barcode: '',
  name: '',
  description: '',
  category: '',
  brand: '',
  tags: '',
  costPrice: 0,
  salePrice: 0,
  minStock: 0,
  maxStock: 0,
  unit: 'piece',
  weight: 0,
  length: 0,
  width: 0,
  height: 0,
  notes: '',
  image: '',
  isActive: true,
  isFeatured: false
})

const isSubmitting = ref(false)
const validationErrors = ref({})
const isEditing = computed(() => !!route.query.id)

// Methods
const validateForm = () => {
  const errors = {}

  if (!productForm.value.sku) {
    errors.sku = 'El SKU es requerido'
  }

  if (!productForm.value.name) {
    errors.name = 'El nombre es requerido'
  }

  if (!productForm.value.category) {
    errors.category = 'La categoría es requerida'
  }

  if (productForm.value.costPrice <= 0) {
    errors.costPrice = 'El precio de compra debe ser mayor a 0'
  }

  if (productForm.value.salePrice <= 0) {
    errors.salePrice = 'El precio de venta debe ser mayor a 0'
  }

  validationErrors.value = errors
  return Object.keys(errors).length === 0
}

const saveProduct = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Product saved:', productForm.value)
    router.push('/catalog/products')
  } catch (error) {
    console.error('Error saving product:', error)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  if (confirm('¿Está seguro de restablecer el formulario? Se perderán los cambios no guardados.')) {
    productForm.value = {
      sku: '',
      barcode: '',
      name: '',
      description: '',
      category: '',
      brand: '',
      tags: '',
      costPrice: 0,
      salePrice: 0,
      minStock: 0,
      maxStock: 0,
      unit: 'piece',
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
      notes: '',
      image: '',
      isActive: true,
      isFeatured: false
    }
    validationErrors.value = {}
  }
}

onMounted(async () => {
  if (isEditing.value) {
    try {
      // Simulate API call to get product details
      await new Promise(resolve => setTimeout(resolve, 500))
      // In a real app, you would fetch the product details here
      productForm.value = {
        sku: 'PRD-001',
        name: 'Laptop Dell XPS',
        // ... populate other fields
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    }
  }
})
</script>