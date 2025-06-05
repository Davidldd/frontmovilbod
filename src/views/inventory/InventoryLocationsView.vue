<script setup>
import { ref, computed } from 'vue';
import DashboardLayout from '../../components/DashboardLayout.vue';

// Mock data
const locations = ref([
  {
    id: 1,
    name: 'Almacén Principal',
    code: 'ALM001',
    type: 'warehouse',
    address: 'Calle 123 #45-67, Bogotá',
    manager: 'Juan Pérez',
    phone: '+57 300 123 4567',
    email: 'almacen.principal@movilbod.com',
    capacity: 1000,
    currentOccupancy: 750,
    productCount: 450,
    totalValue: 75000000,
    status: 'active',
    zones: [
      { id: 1, name: 'Zona A', capacity: 300, occupied: 250 },
      { id: 2, name: 'Zona B', capacity: 400, occupied: 300 },
      { id: 3, name: 'Zona C', capacity: 300, occupied: 200 }
    ]
  },
  {
    id: 2,
    name: 'Tienda Centro',
    code: 'TDA001',
    type: 'store',
    address: 'Carrera 7 #32-16, Bogotá',
    manager: 'María García',
    phone: '+57 300 987 6543',
    email: 'tienda.centro@movilbod.com',
    capacity: 200,
    currentOccupancy: 160,
    productCount: 320,
    totalValue: 30000000,
    status: 'active',
    zones: [
      { id: 4, name: 'Exhibición', capacity: 100, occupied: 80 },
      { id: 5, name: 'Bodega', capacity: 100, occupied: 80 }
    ]
  },
  {
    id: 3,
    name: 'Almacén Secundario',
    code: 'ALM002',
    type: 'warehouse',
    address: 'Zona Industrial, Soacha',
    manager: 'Carlos López',
    phone: '+57 300 555 1234',
    email: 'almacen.secundario@movilbod.com',
    capacity: 500,
    currentOccupancy: 200,
    productCount: 200,
    totalValue: 5000000,
    status: 'maintenance',
    zones: [
      { id: 6, name: 'Zona Principal', capacity: 500, occupied: 200 }
    ]
  }
])

// Filters
const filters = ref({
  search: '',
  type: '',
  status: ''
})

// New location form
const newLocation = ref({
  name: '',
  code: '',
  type: 'warehouse',
  address: '',
  manager: '',
  phone: '',
  email: '',
  capacity: 0,
  zones: [{ name: '', capacity: 0 }]
})

const isSubmitting = ref(false)
const showLocationModal = ref(false)
const editingLocation = ref(null)

// Computed properties
const filteredLocations = computed(() => {
  let filtered = locations.value

  if (filters.value.search) {
    filtered = filtered.filter(location =>
      location.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      location.code.toLowerCase().includes(filters.value.search.toLowerCase())
    )
  }

  if (filters.value.type) {
    filtered = filtered.filter(location => location.type === filters.value.type)
  }

  if (filters.value.status) {
    filtered = filtered.filter(location => location.status === filters.value.status)
  }

  return filtered
})

const totalStats = computed(() => {
  const total = locations.value.length
  const active = locations.value.filter(l => l.status === 'active').length
  const totalCapacity = locations.value.reduce((sum, l) => sum + l.capacity, 0)
  const totalOccupancy = locations.value.reduce((sum, l) => sum + l.currentOccupancy, 0)
  const totalValue = locations.value.reduce((sum, l) => sum + l.totalValue, 0)

  return { total, active, totalCapacity, totalOccupancy, totalValue }
})

// Methods
const resetFilters = () => {
  filters.value = {
    search: '',
    type: '',
    status: ''
  }
}

const getTypeIcon = (type) => {
  const icons = {
    'warehouse': 'bi-building',
    'store': 'bi-shop',
    'office': 'bi-building-gear'
  }
  return icons[type] || 'bi-geo-alt'
}

const getTypeName = (type) => {
  const names = {
    'warehouse': 'Almacén',
    'store': 'Tienda',
    'office': 'Oficina'
  }
  return names[type] || type
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'active': 'badge bg-success',
    'inactive': 'badge bg-secondary',
    'maintenance': 'badge bg-warning'
  }
  return classes[status] || 'badge bg-secondary'
}

const getStatusText = (status) => {
  const texts = {
    'active': 'Activo',
    'inactive': 'Inactivo',
    'maintenance': 'Mantenimiento'
  }
  return texts[status] || status
}

const getOccupancyPercentage = (current, capacity) => {
  if (capacity === 0) return 0
  return Math.min((current / capacity) * 100, 100)
}

const getOccupancyClass = (current, capacity) => {
  const percentage = getOccupancyPercentage(current, capacity)
  if (percentage >= 90) return 'bg-danger'
  if (percentage >= 75) return 'bg-warning'
  return 'bg-success'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(value)
}

const openNewLocationModal = () => {
  editingLocation.value = null
  newLocation.value = {
    name: '',
    code: '',
    type: 'warehouse',
    address: '',
    manager: '',
    phone: '',
    email: '',
    capacity: 0,
    zones: [{ name: '', capacity: 0 }]
  }
  showLocationModal.value = true
}

const editLocation = (location) => {
  editingLocation.value = location
  newLocation.value = { ...location }
  showLocationModal.value = true
}

const addZone = () => {
  newLocation.value.zones.push({ name: '', capacity: 0 })
}

const removeZone = (index) => {
  newLocation.value.zones.splice(index, 1)
  if (newLocation.value.zones.length === 0) {
    addZone()
  }
}

const submitLocation = async () => {
  isSubmitting.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Location submitted:', newLocation.value)
    showLocationModal.value = false
  } catch (error) {
    console.error('Error submitting location:', error)
  } finally {
    isSubmitting.value = false
  }
}

const viewDetails = (location) => {
  console.log('View details:', location)
}

const viewStock = (location) => {
  console.log('View stock:', location)
}

const generateReport = (location) => {
  console.log('Generate report:', location)
}
</script>

<template>
  <DashboardLayout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-1">Ubicaciones de Inventario</h1>
          <p class="text-muted mb-0">Gestión de almacenes, tiendas y ubicaciones</p>
        </div>
        <button class="btn btn-primary" @click="openNewLocationModal">
          <i class="bi bi-plus-lg me-2"></i>Nueva Ubicación
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="row g-4 mb-4">
        <div class="col-xl-3 col-md-6">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="bg-primary bg-opacity-10 rounded-3 p-3">
                    <i class="bi bi-geo-alt text-primary fs-4"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <div class="text-muted small">Total Ubicaciones</div>
                  <div class="fs-4 fw-bold">{{ totalStats.total }}</div>
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
                  <div class="text-muted small">Ubicaciones Activas</div>
                  <div class="fs-4 fw-bold text-success">{{ totalStats.active }}</div>
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
                    <i class="bi bi-boxes text-info fs-4"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <div class="text-muted small">Capacidad Total</div>
                  <div class="fs-4 fw-bold">{{ totalStats.totalCapacity.toLocaleString() }}</div>
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
                    <i class="bi bi-currency-dollar text-warning fs-4"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <div class="text-muted small">Valor Total</div>
                  <div class="fs-4 fw-bold">{{ formatCurrency(totalStats.totalValue) }}</div>
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
            <div class="col-md-4">
              <div class="form-floating">
                <input
                  type="text"
                  class="form-control"
                  id="searchLocation"
                  placeholder="Buscar ubicación"
                  v-model="filters.search"
                >
                <label for="searchLocation">
                  <i class="bi bi-search me-2"></i>Buscar ubicación
                </label>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-floating">
                <select class="form-select" id="typeFilter" v-model="filters.type">
                  <option value="">Todos los tipos</option>
                  <option value="warehouse">Almacén</option>
                  <option value="store">Tienda</option>
                  <option value="office">Oficina</option>
                </select>
                <label for="typeFilter">Tipo</label>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-floating">
                <select class="form-select" id="statusFilter" v-model="filters.status">
                  <option value="">Todos los estados</option>
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="maintenance">Mantenimiento</option>
                </select>
                <label for="statusFilter">Estado</label>
              </div>
            </div>
            <div class="col-md-2">
              <button class="btn btn-secondary w-100 h-100" @click="resetFilters">
                <i class="bi bi-x-circle me-2"></i>Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Locations Grid -->
      <div class="row g-4">
        <div v-for="location in filteredLocations" :key="location.id" class="col-xl-6 col-lg-12">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <!-- Header -->
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="d-flex align-items-center">
                  <div class="bg-primary bg-opacity-10 rounded-3 p-2 me-3">
                    <i :class="getTypeIcon(location.type)" class="text-primary fs-5"></i>
                  </div>
                  <div>
                    <h5 class="card-title mb-1">{{ location.name }}</h5>
                    <div class="text-muted small">
                      <code>{{ location.code }}</code> • {{ getTypeName(location.type) }}
                    </div>
                  </div>
                </div>
                <span :class="getStatusBadgeClass(location.status)">
                  {{ getStatusText(location.status) }}
                </span>
              </div>

              <!-- Info -->
              <div class="row g-3 mb-3">
                <div class="col-6">
                  <div class="text-muted small">Responsable</div>
                  <div class="fw-medium">{{ location.manager }}</div>
                </div>
                <div class="col-6">
                  <div class="text-muted small">Productos</div>
                  <div class="fw-medium">{{ location.productCount }}</div>
                </div>
                <div class="col-12">
                  <div class="text-muted small">Dirección</div>
                  <div class="fw-medium">{{ location.address }}</div>
                </div>
              </div>

              <!-- Occupancy -->
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="text-muted small">Ocupación</span>
                  <span class="fw-bold">
                    {{ location.currentOccupancy }}/{{ location.capacity }}
                    ({{ Math.round(getOccupancyPercentage(location.currentOccupancy, location.capacity)) }}%)
                  </span>
                </div>
                <div class="progress" style="height: 8px;">
                  <div 
                    class="progress-bar"
                    :class="getOccupancyClass(location.currentOccupancy, location.capacity)"
                    :style="{ width: getOccupancyPercentage(location.currentOccupancy, location.capacity) + '%' }"
                  ></div>
                </div>
              </div>

              <!-- Zones -->
              <div class="mb-3">
                <div class="text-muted small mb-2">Zonas ({{ location.zones.length }})</div>
                <div class="row g-2">
                  <div v-for="zone in location.zones" :key="zone.id" class="col-6">
                    <div class="bg-light rounded p-2">
                      <div class="fw-medium small">{{ zone.name }}</div>
                      <div class="text-muted small">
                        {{ zone.occupied }}/{{ zone.capacity }}
                      </div>
                      <div class="progress mt-1" style="height: 4px;">
                        <div 
                          class="progress-bar bg-info"
                          :style="{ width: getOccupancyPercentage(zone.occupied, zone.capacity) + '%' }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Value -->
              <div class="mb-3">
                <div class="text-muted small">Valor Total del Inventario</div>
                <div class="fs-5 fw-bold text-success">{{ formatCurrency(location.totalValue) }}</div>
              </div>

              <!-- Actions -->
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-primary" @click="viewDetails(location)">
                  <i class="bi bi-eye me-1"></i>Detalles
                </button>
                <button class="btn btn-sm btn-outline-info" @click="viewStock(location)">
                  <i class="bi bi-boxes me-1"></i>Stock
                </button>
                <button class="btn btn-sm btn-outline-secondary" @click="editLocation(location)">
                  <i class="bi bi-pencil me-1"></i>Editar
                </button>
                <button class="btn btn-sm btn-outline-success" @click="generateReport(location)">
                  <i class="bi bi-file-earmark-bar-graph me-1"></i>Reporte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New/Edit Location Modal -->
    <div class="modal fade" :class="{ show: showLocationModal }" :style="{ display: showLocationModal ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editingLocation ? 'Editar Ubicación' : 'Nueva Ubicación' }}
            </h5>
            <button type="button" class="btn-close" @click="showLocationModal = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitLocation">
              <!-- Basic Information -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Nombre</label>
                  <input type="text" class="form-control" v-model="newLocation.name" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Código</label>
                  <input type="text" class="form-control" v-model="newLocation.code" required>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Tipo</label>
                  <select class="form-select" v-model="newLocation.type" required>
                    <option value="warehouse">Almacén</option>
                    <option value="store">Tienda</option>
                    <option value="office">Oficina</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Capacidad Total</label>
                  <input type="number" class="form-control" v-model="newLocation.capacity" min="0" required>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Dirección</label>
                <textarea class="form-control" v-model="newLocation.address" rows="2" required></textarea>
              </div>

              <!-- Contact Information -->
              <div class="row mb-3">
                <div class="col-md-4">
                  <label class="form-label">Responsable</label>
                  <input type="text" class="form-control" v-model="newLocation.manager" required>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Teléfono</label>
                  <input type="tel" class="form-control" v-model="newLocation.phone">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" v-model="newLocation.email">
                </div>
              </div>

              <!-- Zones -->
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <label class="form-label mb-0">Zonas</label>
                  <button type="button" class="btn btn-sm btn-outline-primary" @click="addZone">
                    <i class="bi bi-plus-lg me-1"></i>Agregar Zona
                  </button>
                </div>
                <div class="space-y-2">
                  <div v-for="(zone, index) in newLocation.zones" :key="index" class="row g-2 mb-2">
                    <div class="col-md-6">
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="zone.name" 
                        placeholder="Nombre de la zona"
                        required
                      >
                    </div>
                    <div class="col-md-4">
                      <input 
                        type="number" 
                        class="form-control" 
                        v-model="zone.capacity" 
                        placeholder="Capacidad"
                        min="0"
                        required
                      >
                    </div>
                    <div class="col-md-2">
                      <button 
                        type="button" 
                        class="btn btn-outline-danger w-100"
                        @click="removeZone(index)"
                        :disabled="newLocation.zones.length === 1"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showLocationModal = false">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting" @click="submitLocation">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              {{ editingLocation ? 'Actualizar' : 'Crear' }} Ubicación
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showLocationModal" class="modal-backdrop fade show"></div>
  </DashboardLayout>
</template>
