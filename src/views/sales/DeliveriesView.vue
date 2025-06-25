<template>
  <DashboardLayout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-0">Despachos</h1>
          <p class="text-muted">Gestiona los despachos y entregas de productos</p>
        </div>
        <router-link to="/sales/delivery/new" class="btn btn-primary">
          <i class="bi bi-plus-lg me-2"></i>Nuevo Despacho
        </router-link>
      </div>

      <!-- Filtros -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <label class="form-label">Buscar</label>
              <input 
                type="text" 
                class="form-control" 
                placeholder="Número de despacho, orden..."
                v-model="searchTerm"
              >
            </div>
            <div class="col-md-2">
              <label class="form-label">Estado</label>
              <select class="form-select" v-model="selectedStatus">
                <option value="">Todos</option>
                <option value="pending">Pendiente</option>
                <option value="in_transit">En Tránsito</option>
                <option value="delivered">Entregado</option>
                <option value="returned">Devuelto</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Transportador</label>
              <select class="form-select" v-model="selectedCarrier">
                <option value="">Todos</option>
                <option value="Servientrega">Servientrega</option>
                <option value="Coordinadora">Coordinadora</option>
                <option value="TCC">TCC</option>
                <option value="Propio">Transporte Propio</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Fecha Desde</label>
              <input type="date" class="form-control" v-model="dateFrom">
            </div>
            <div class="col-md-2">
              <label class="form-label">Fecha Hasta</label>
              <input type="date" class="form-control" v-model="dateTo">
            </div>
            <div class="col-md-1 d-flex align-items-end">
              <button class="btn btn-outline-secondary" @click="clearFilters">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h6 class="card-title">Total Despachos</h6>
                  <h3 class="mb-0">{{ filteredDeliveries.length }}</h3>
                </div>
                <i class="bi bi-truck fs-1 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h6 class="card-title">En Tránsito</h6>
                  <h3 class="mb-0">{{ getDeliveriesByStatus('in_transit').length }}</h3>
                </div>
                <i class="bi bi-clock fs-1 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h6 class="card-title">Entregados</h6>
                  <h3 class="mb-0">{{ getDeliveriesByStatus('delivered').length }}</h3>
                </div>
                <i class="bi bi-check-circle fs-1 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-danger text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h6 class="card-title">Pendientes</h6>
                  <h3 class="mb-0">{{ getDeliveriesByStatus('pending').length }}</h3>
                </div>
                <i class="bi bi-exclamation-triangle fs-1 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de Despachos -->
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="mb-0">Lista de Despachos</h5>
          <div class="btn-group">
            <button class="btn btn-outline-secondary btn-sm" @click="exportData">
              <i class="bi bi-download me-1"></i>Exportar
            </button>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Número</th>
                  <th>Orden</th>
                  <th>Cliente</th>
                  <th>Destino</th>
                  <th>Transportador</th>
                  <th>Fecha Envío</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="delivery in paginatedDeliveries" :key="delivery.id">
                  <td>
                    <strong>{{ delivery.number }}</strong>
                    <br>
                    <small class="text-muted">{{ delivery.tracking_number }}</small>
                  </td>
                  <td>
                    <strong>{{ delivery.order_number }}</strong>
                    <br>
                    <small class="text-muted">{{ delivery.order_reference }}</small>
                  </td>
                  <td>
                    <div>
                      <strong>{{ delivery.customer.name }}</strong>
                      <br>
                      <small class="text-muted">{{ delivery.customer.phone }}</small>
                    </div>
                  </td>
                  <td>
                    <div>{{ delivery.delivery_address.city }}</div>
                    <small class="text-muted">{{ delivery.delivery_address.address }}</small>
                  </td>
                  <td>{{ delivery.carrier }}</td>
                  <td>
                    <div>{{ formatDate(delivery.ship_date) }}</div>
                    <small class="text-muted">Est: {{ formatDate(delivery.estimated_delivery) }}</small>
                  </td>
                  <td>
                    <span :class="getStatusBadgeClass(delivery.status)">
                      {{ getStatusText(delivery.status) }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group">
                      <button 
                        class="btn btn-sm btn-outline-primary"
                        @click="viewDelivery(delivery)"
                        title="Ver detalles"
                      >
                        <i class="bi bi-eye"></i>
                      </button>
                      <button 
                        class="btn btn-sm btn-outline-info"
                        @click="trackDelivery(delivery)"
                        title="Rastrear"
                        v-if="delivery.tracking_number"
                      >
                        <i class="bi bi-geo-alt"></i>
                      </button>
                      <router-link 
                        :to="`/sales/delivery/${delivery.id}/edit`"
                        class="btn btn-sm btn-outline-secondary"
                        title="Editar"
                        v-if="delivery.status === 'pending'"
                      >
                        <i class="bi bi-pencil"></i>
                      </router-link>
                      <button 
                        class="btn btn-sm btn-outline-success"
                        @click="markAsDelivered(delivery)"
                        title="Marcar como entregado"
                        v-if="delivery.status === 'in_transit'"
                      >
                        <i class="bi bi-check-lg"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="card-footer">
          <nav>
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="currentPage = 1">Primera</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="currentPage--">Anterior</button>
              </li>
              <li 
                class="page-item" 
                v-for="page in visiblePages" 
                :key="page"
                :class="{ active: page === currentPage }"
              >
                <button class="page-link" @click="currentPage = page">{{ page }}</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="currentPage++">Siguiente</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="currentPage = totalPages">Última</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <!-- Modal de Detalles -->
      <div class="modal fade" id="deliveryDetailsModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Detalles del Despacho</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body" v-if="selectedDelivery">
              <div class="row">
                <div class="col-md-6">
                  <h6>Información del Despacho</h6>
                  <p><strong>Número:</strong> {{ selectedDelivery.number }}</p>
                  <p><strong>Orden:</strong> {{ selectedDelivery.order_number }}</p>
                  <p><strong>Tracking:</strong> {{ selectedDelivery.tracking_number }}</p>
                  <p><strong>Transportador:</strong> {{ selectedDelivery.carrier }}</p>
                  <p><strong>Fecha Envío:</strong> {{ formatDate(selectedDelivery.ship_date) }}</p>
                  <p><strong>Entrega Estimada:</strong> {{ formatDate(selectedDelivery.estimated_delivery) }}</p>
                </div>
                <div class="col-md-6">
                  <h6>Cliente y Destino</h6>
                  <p><strong>Cliente:</strong> {{ selectedDelivery.customer?.name }}</p>
                  <p><strong>Teléfono:</strong> {{ selectedDelivery.customer?.phone }}</p>
                  <p><strong>Dirección:</strong> {{ selectedDelivery.delivery_address?.address }}</p>
                  <p><strong>Ciudad:</strong> {{ selectedDelivery.delivery_address?.city }}</p>
                  <p><strong>Estado:</strong> 
                    <span :class="getStatusBadgeClass(selectedDelivery.status)">
                      {{ getStatusText(selectedDelivery.status) }}
                    </span>
                  </p>
                </div>
              </div>
              
              <hr>
              
              <h6>Items del Despacho</h6>
              <div class="table-responsive">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Peso (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in selectedDelivery.items" :key="item.id">
                      <td>{{ item.product_name }}</td>
                      <td>{{ item.quantity }}</td>
                      <td>{{ item.weight || 0 }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div v-if="selectedDelivery.notes" class="mt-3">
                <h6>Observaciones</h6>
                <p>{{ selectedDelivery.notes }}</p>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de Rastreo -->
      <div class="modal fade" id="trackingModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Rastreo de Envío</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body" v-if="trackingDelivery">
              <div class="text-center mb-3">
                <h6>{{ trackingDelivery.tracking_number }}</h6>
                <span :class="getStatusBadgeClass(trackingDelivery.status)">
                  {{ getStatusText(trackingDelivery.status) }}
                </span>
              </div>
              
              <div class="timeline">
                <div class="timeline-item" v-for="event in trackingEvents" :key="event.id">
                  <div class="timeline-marker" :class="event.completed ? 'bg-success' : 'bg-secondary'">
                    <i :class="event.icon"></i>
                  </div>
                  <div class="timeline-content">
                    <h6 class="mb-1">{{ event.title }}</h6>
                    <p class="text-muted mb-1">{{ event.description }}</p>
                    <small class="text-muted">{{ event.date }}</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from '../../components/DashboardLayout.vue'


export default {
  name: 'DeliveriesView',
  components: {
    DashboardLayout
  },
  data() {
    return {
      searchTerm: '',
      selectedStatus: '',
      selectedCarrier: '',
      dateFrom: '',
      dateTo: '',
      currentPage: 1,
      itemsPerPage: 10,
      selectedDelivery: null,
      trackingDelivery: null,
      deliveries: [
        {
          id: 1,
          number: 'DEL-2024-001',
          order_number: 'ORD-2024-001',
          order_reference: 'Pedido Enero',
          tracking_number: 'TRK123456789',
          customer: {
            name: 'Empresa ABC S.A.',
            phone: '+57 300 123 4567'
          },
          delivery_address: {
            address: 'Calle 123 #45-67',
            city: 'Bogotá'
          },
          carrier: 'Servientrega',
          ship_date: '2024-01-16',
          estimated_delivery: '2024-01-18',
          actual_delivery: null,
          status: 'in_transit',
          notes: 'Entrega en horario de oficina',
          items: [
            { id: 1, product_name: 'Producto A', quantity: 10, weight: 5.5 },
            { id: 2, product_name: 'Producto B', quantity: 5, weight: 3.2 }
          ]
        },
        {
          id: 2,
          number: 'DEL-2024-002',
          order_number: 'ORD-2024-002',
          order_reference: 'Pedido Urgente',
          tracking_number: 'TRK987654321',
          customer: {
            name: 'Comercial XYZ Ltda.',
            phone: '+57 301 987 6543'
          },
          delivery_address: {
            address: 'Carrera 45 #12-34',
            city: 'Medellín'
          },
          carrier: 'Coordinadora',
          ship_date: '2024-01-17',
          estimated_delivery: '2024-01-19',
          actual_delivery: '2024-01-19',
          status: 'delivered',
          notes: '',
          items: [
            { id: 3, product_name: 'Producto C', quantity: 15, weight: 12.0 }
          ]
        },
        {
          id: 3,
          number: 'DEL-2024-003',
          order_number: 'ORD-2024-003',
          order_reference: 'Pedido Mensual',
          tracking_number: '',
          customer: {
            name: 'Distribuidora 123',
            phone: '+57 302 456 7890'
          },
          delivery_address: {
            address: 'Avenida 80 #25-15',
            city: 'Cali'
          },
          carrier: 'Propio',
          ship_date: '2024-01-20',
          estimated_delivery: '2024-01-22',
          actual_delivery: null,
          status: 'pending',
          notes: 'Coordinar con cliente antes de la entrega',
          items: [
            { id: 4, product_name: 'Producto D', quantity: 8, weight: 4.8 },
            { id: 5, product_name: 'Producto E', quantity: 6, weight: 3.6 }
          ]
        }
      ],
      trackingEvents: []
    }
  },
  computed: {
    filteredDeliveries() {
      let filtered = this.deliveries

      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase()
        filtered = filtered.filter(delivery => 
          delivery.number.toLowerCase().includes(term) ||
          delivery.order_number.toLowerCase().includes(term) ||
          delivery.tracking_number.toLowerCase().includes(term) ||
          delivery.customer.name.toLowerCase().includes(term)
        )
      }

      if (this.selectedStatus) {
        filtered = filtered.filter(delivery => delivery.status === this.selectedStatus)
      }

      if (this.selectedCarrier) {
        filtered = filtered.filter(delivery => delivery.carrier === this.selectedCarrier)
      }

      if (this.dateFrom) {
        filtered = filtered.filter(delivery => delivery.ship_date >= this.dateFrom)
      }

      if (this.dateTo) {
        filtered = filtered.filter(delivery => delivery.ship_date <= this.dateTo)
      }

      return filtered
    },
    paginatedDeliveries() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredDeliveries.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredDeliveries.length / this.itemsPerPage)
    },
    visiblePages() {
      const pages = []
      const start = Math.max(1, this.currentPage - 2)
      const end = Math.min(this.totalPages, this.currentPage + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return ''
      return new Date(date).toLocaleDateString('es-CO')
    },
    getStatusBadgeClass(status) {
      const classes = {
        pending: 'badge bg-warning',
        in_transit: 'badge bg-info',
        delivered: 'badge bg-success',
        returned: 'badge bg-danger'
      }
      return classes[status] || 'badge bg-secondary'
    },
    getStatusText(status) {
      const texts = {
        pending: 'Pendiente',
        in_transit: 'En Tránsito',
        delivered: 'Entregado',
        returned: 'Devuelto'
      }
      return texts[status] || status
    },
    getDeliveriesByStatus(status) {
      return this.filteredDeliveries.filter(delivery => delivery.status === status)
    },
    clearFilters() {
      this.searchTerm = ''
      this.selectedStatus = ''
      this.selectedCarrier = ''
      this.dateFrom = ''
      this.dateTo = ''
      this.currentPage = 1
    },
    viewDelivery(delivery) {
      this.selectedDelivery = delivery
      const modal = new Modal(document.getElementById('deliveryDetailsModal'))
      modal.show()
    },
    trackDelivery(delivery) {
      this.trackingDelivery = delivery
      this.generateTrackingEvents(delivery)
      const modal = new Modal(document.getElementById('trackingModal'))
      modal.show()
    },
    generateTrackingEvents(delivery) {
      // Simular eventos de rastreo
      this.trackingEvents = [
        {
          id: 1,
          title: 'Orden Creada',
          description: 'La orden ha sido creada y está lista para despacho',
          date: '2024-01-15 10:00',
          icon: 'bi bi-cart-check',
          completed: true
        },
        {
          id: 2,
          title: 'En Preparación',
          description: 'Los productos están siendo preparados para el envío',
          date: '2024-01-16 08:30',
          icon: 'bi bi-box-seam',
          completed: true
        },
        {
          id: 3,
          title: 'Despachado',
          description: 'El paquete ha sido entregado al transportador',
          date: '2024-01-16 14:00',
          icon: 'bi bi-truck',
          completed: delivery.status !== 'pending'
        },
        {
          id: 4,
          title: 'En Tránsito',
          description: 'El paquete está en camino al destino',
          date: '2024-01-17 09:15',
          icon: 'bi bi-geo-alt',
          completed: ['in_transit', 'delivered'].includes(delivery.status)
        },
        {
          id: 5,
          title: 'Entregado',
          description: 'El paquete ha sido entregado exitosamente',
          date: delivery.actual_delivery ? `${delivery.actual_delivery} 16:30` : '',
          icon: 'bi bi-check-circle',
          completed: delivery.status === 'delivered'
        }
      ]
    },
    markAsDelivered(delivery) {
      if (confirm(`¿Confirmar entrega del despacho ${delivery.number}?`)) {
        delivery.status = 'delivered'
        delivery.actual_delivery = new Date().toISOString().split('T')[0]
        alert('Despacho marcado como entregado')
      }
    },
    exportData() {
      alert('Funcionalidad de exportación en desarrollo')
    }
  }
}
</script>

<style scoped>
.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline-item {
  position: relative;
  margin-bottom: 20px;
}

.timeline-marker {
  position: absolute;
  left: -35px;
  top: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
}

.timeline-content {
  padding-left: 15px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: -20px;
  top: 15px;
  bottom: -15px;
  width: 2px;
  background-color: #dee2e6;
}
</style>
