<template>
  <DashboardLayout>
    <template #header>
      <div class="d-flex justify-content-between align-items-center">
        <h1 class="h3 mb-0">Clientes</h1>
        <div>
          <router-link to="/sales/customers/new" class="btn btn-primary">
            <i class="bi bi-plus-lg me-1"></i> Nuevo Cliente
          </router-link>
        </div>
      </div>
    </template>

    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white py-3">
        <div class="row g-3 align-items-center">
          <div class="col-md-3">
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0">
                <i class="bi bi-search text-muted"></i>
              </span>
              <input 
                type="text" 
                class="form-control border-start-0" 
                placeholder="Buscar clientes..." 
                v-model="searchTerm"
              >
            </div>
          </div>
          <div class="col-md-2">
            <select class="form-select" v-model="filterCategory">
              <option value="">Todas las categorías</option>
              <option value="A">Categoría A</option>
              <option value="B">Categoría B</option>
              <option value="C">Categoría C</option>
            </select>
          </div>
          <div class="col-md-2">
            <select class="form-select" v-model="filterStatus">
              <option value="">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
          <div class="col-md-auto ms-auto">
            <div class="btn-group">
              <button type="button" class="btn btn-outline-secondary">
                <i class="bi bi-funnel"></i>
              </button>
              <button type="button" class="btn btn-outline-secondary">
                <i class="bi bi-download"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" v-model="selectAll" @change="toggleSelectAll">
                  </div>
                </th>
                <th scope="col">Nombre</th>
                <th scope="col">Contacto</th>
                <th scope="col">Categoría</th>
                <th scope="col">Ventas</th>
                <th scope="col">Última compra</th>
                <th scope="col">Estado</th>
                <th scope="col" class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="customer in filteredCustomers" :key="customer.id" class="align-middle">
                <td>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" v-model="selectedCustomers" :value="customer.id">
                  </div>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar-circle bg-light text-secondary me-2">
                      {{ getInitials(customer.name) }}
                    </div>
                    <div>
                      <div class="fw-medium">{{ customer.name }}</div>
                      <div class="small text-muted">{{ customer.email }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div>{{ customer.contactName }}</div>
                  <div class="small text-muted">{{ customer.phone }}</div>
                </td>
                <td>
                  <span :class="getCategoryBadgeClass(customer.category)">
                    {{ customer.category }}
                  </span>
                </td>
                <td>{{ formatCurrency(customer.totalSales) }}</td>
                <td>{{ formatDate(customer.lastPurchase) }}</td>
                <td>
                  <span :class="getStatusBadgeClass(customer.status)">
                    {{ customer.status === 'active' ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td>
                  <div class="d-flex justify-content-end">
                    <button class="btn btn-sm btn-outline-secondary me-1" @click="viewCustomer(customer)">
                      <i class="bi bi-eye"></i>
                    </button>
                    <router-link :to="`/sales/customers/edit/${customer.id}`" class="btn btn-sm btn-outline-primary me-1">
                      <i class="bi bi-pencil"></i>
                    </router-link>
                    <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(customer)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredCustomers.length === 0">
                <td colspan="8" class="text-center py-4">
                  <div class="text-muted">
                    <i class="bi bi-search fs-4 d-block mb-2"></i>
                    No se encontraron clientes con los filtros seleccionados
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card-footer bg-white border-0 py-3">
        <div class="row align-items-center">
          <div class="col">
            <span class="text-muted">Mostrando {{ filteredCustomers.length }} de {{ customers.length }} clientes</span>
          </div>
          <div class="col-auto">
            <nav aria-label="Page navigation">
              <ul class="pagination pagination-sm mb-0">
                <li class="page-item disabled">
                  <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Anterior</a>
                </li>
                <li class="page-item active"><a class="page-link" href="#">1</a></li>
                <li class="page-item"><a class="page-link" href="#">2</a></li>
                <li class="page-item"><a class="page-link" href="#">3</a></li>
                <li class="page-item">
                  <a class="page-link" href="#">Siguiente</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">Confirmar eliminación</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="customerToDelete">
            <p>¿Está seguro que desea eliminar al cliente <strong>{{ customerToDelete.name }}</strong>?</p>
            <p class="text-danger mb-0">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-danger" @click="deleteCustomer">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalles del cliente -->
    <div class="modal fade" id="viewModal" tabindex="-1" aria-labelledby="viewModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="viewModalLabel">Detalles del cliente</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedCustomer">
            <div class="row mb-4">
              <div class="col-md-6">
                <h6 class="text-muted mb-3">Información general</h6>
                <p class="mb-1"><strong>Nombre:</strong> {{ selectedCustomer.name }}</p>
                <p class="mb-1"><strong>RUT:</strong> {{ selectedCustomer.taxId }}</p>
                <p class="mb-1"><strong>Categoría:</strong> {{ selectedCustomer.category }}</p>
                <p class="mb-1"><strong>Estado:</strong> {{ selectedCustomer.status === 'active' ? 'Activo' : 'Inactivo' }}</p>
                <p class="mb-1"><strong>Fecha de registro:</strong> {{ formatDate(selectedCustomer.createdAt) }}</p>
              </div>
              <div class="col-md-6">
                <h6 class="text-muted mb-3">Contacto</h6>
                <p class="mb-1"><strong>Persona de contacto:</strong> {{ selectedCustomer.contactName }}</p>
                <p class="mb-1"><strong>Email:</strong> {{ selectedCustomer.email }}</p>
                <p class="mb-1"><strong>Teléfono:</strong> {{ selectedCustomer.phone }}</p>
                <p class="mb-1"><strong>Dirección:</strong> {{ selectedCustomer.address }}</p>
                <p class="mb-1"><strong>Ciudad:</strong> {{ selectedCustomer.city }}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <h6 class="text-muted mb-3">Historial de compras</h6>
                <div class="table-responsive">
                  <table class="table table-sm table-bordered">
                    <thead class="table-light">
                      <tr>
                        <th>Orden</th>
                        <th>Fecha</th>
                        <th>Productos</th>
                        <th>Total</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(order, index) in selectedCustomer.orders" :key="index">
                        <td>{{ order.number }}</td>
                        <td>{{ formatDate(order.date) }}</td>
                        <td>{{ order.items }}</td>
                        <td>{{ formatCurrency(order.total) }}</td>
                        <td>
                          <span :class="getOrderStatusBadgeClass(order.status)">
                            {{ order.status }}
                          </span>
                        </td>
                      </tr>
                      <tr v-if="!selectedCustomer.orders || selectedCustomer.orders.length === 0">
                        <td colspan="5" class="text-center py-3">
                          <span class="text-muted">No hay compras registradas</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <router-link :to="`/sales/customers/edit/${selectedCustomer?.id}`" class="btn btn-primary">
              Editar cliente
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import DashboardLayout from '../../components/DashboardLayout.vue'
import { useBootstrapModal } from '../../composables/useBootstrapModal'

const searchTerm = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const selectedCustomers = ref([])
const selectAll = ref(false)
const customerToDelete = ref(null)
const selectedCustomer = ref(null)

const { showModal, hideModal } = useBootstrapModal()

// Datos de ejemplo
const customers = ref([
  {
    id: 1,
    name: 'Empresa ABC',
    taxId: '76.123.456-7',
    email: 'contacto@empresaabc.cl',
    contactName: 'Juan Pérez',
    phone: '+56 9 1234 5678',
    address: 'Av. Principal 123',
    city: 'Santiago',
    category: 'A',
    totalSales: 12500000,
    lastPurchase: '2023-06-10',
    status: 'active',
    createdAt: '2022-01-15',
    orders: [
      { number: 'SO-2023-0125', date: '2023-06-10', items: 5, total: 1250000, status: 'Completada' },
      { number: 'SO-2023-0110', date: '2023-05-25', items: 3, total: 780000, status: 'Completada' },
      { number: 'SO-2023-0095', date: '2023-05-12', items: 7, total: 1560000, status: 'Completada' }
    ]
  },
  {
    id: 2,
    name: 'Distribuidora XYZ',
    taxId: '77.987.654-3',
    email: 'ventas@distribuidoraxyz.cl',
    contactName: 'María González',
    phone: '+56 9 8765 4321',
    address: 'Calle Comercial 456',
    city: 'Concepción',
    category: 'A',
    totalSales: 9800000,
    lastPurchase: '2023-06-08',
    status: 'active',
    createdAt: '2022-02-20',
    orders: [
      { number: 'SO-2023-0123', date: '2023-06-08', items: 4, total: 950000, status: 'Completada' },
      { number: 'SO-2023-0105', date: '2023-05-20', items: 6, total: 1320000, status: 'Completada' }
    ]
  },
  {
    id: 3,
    name: 'Comercial 123',
    taxId: '78.456.789-0',
    email: 'info@comercial123.cl',
    contactName: 'Pedro Soto',
    phone: '+56 9 2345 6789',
    address: 'Pasaje Industrial 789',
    city: 'Valparaíso',
    category: 'B',
    totalSales: 5600000,
    lastPurchase: '2023-06-05',
    status: 'active',
    createdAt: '2022-03-10',
    orders: [
      { number: 'SO-2023-0120', date: '2023-06-05', items: 3, total: 680000, status: 'Completada' },
      { number: 'SO-2023-0098', date: '2023-05-15', items: 2, total: 450000, status: 'Completada' }
    ]
  },
  {
    id: 4,
    name: 'Tienda Online',
    taxId: '79.321.654-9',
    email: 'contacto@tiendaonline.cl',
    contactName: 'Ana Muñoz',
    phone: '+56 9 3456 7890',
    address: 'Av. Digital 234',
    city: 'Santiago',
    category: 'C',
    totalSales: 3200000,
    lastPurchase: '2023-05-28',
    status: 'inactive',
    createdAt: '2022-04-05',
    orders: [
      { number: 'SO-2023-0115', date: '2023-05-28', items: 2, total: 320000, status: 'Completada' }
    ]
  },
  {
    id: 5,
    name: 'Mayorista Central',
    taxId: '80.789.123-5',
    email: 'ventas@mayoristacentral.cl',
    contactName: 'Roberto Díaz',
    phone: '+56 9 4567 8901',
    address: 'Calle Mayor 567',
    city: 'Temuco',
    category: 'B',
    totalSales: 7800000,
    lastPurchase: '2023-06-02',
    status: 'active',
    createdAt: '2022-05-12',
    orders: [
      { number: 'SO-2023-0118', date: '2023-06-02', items: 8, total: 1680000, status: 'Completada' },
      { number: 'SO-2023-0100', date: '2023-05-18', items: 5, total: 1050000, status: 'Completada' }
    ]
  }
])

const filteredCustomers = computed(() => {
  return customers.value.filter(customer => {
    const matchesSearch = searchTerm.value === '' || 
      customer.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      customer.contactName.toLowerCase().includes(searchTerm.value.toLowerCase())
    
    const matchesCategory = filterCategory.value === '' || customer.category === filterCategory.value
    const matchesStatus = filterStatus.value === '' || customer.status === filterStatus.value
    
    return matchesSearch && matchesCategory && matchesStatus
  })
})

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedCustomers.value = filteredCustomers.value.map(customer => customer.id)
  } else {
    selectedCustomers.value = []
  }
}

const confirmDelete = (customer) => {
  customerToDelete.value = customer
  showModal('deleteModal')
}

const deleteCustomer = () => {
  if (customerToDelete.value) {
    customers.value = customers.value.filter(c => c.id !== customerToDelete.value.id)
    selectedCustomers.value = selectedCustomers.value.filter(id => id !== customerToDelete.value.id)
    hideModal('deleteModal')
    customerToDelete.value = null
  }
}

const viewCustomer = (customer) => {
  selectedCustomer.value = customer
  showModal('viewModal')
}

const formatCurrency = (value) => {
  if (value === undefined || value === null) return '$0'
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-CL').format(date)
}

const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const getCategoryBadgeClass = (category) => {
  switch (category) {
    case 'A': return 'badge bg-success'
    case 'B': return 'badge bg-primary'
    case 'C': return 'badge bg-info'
    default: return 'badge bg-secondary'
  }
}

const getStatusBadgeClass = (status) => {
  return status === 'active' ? 'badge bg-success' : 'badge bg-danger'
}

const getOrderStatusBadgeClass = (status) => {
  switch (status) {
    case 'Completada': return 'badge bg-success'
    case 'En proceso': return 'badge bg-primary'
    case 'Pendiente': return 'badge bg-warning text-dark'
    case 'Cancelada': return 'badge bg-danger'
    default: return 'badge bg-secondary'
  }
}
</script>

<style scoped>
.avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}
</style>
