<template>
    <DashboardLayout>
      <div class="container-fluid">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h3 mb-0">Órdenes de Venta</h1>
            <p class="text-muted">Gestiona las órdenes de venta de tu empresa</p>
          </div>
          <router-link to="/sales/orders/create" class="btn btn-primary">
            <i class="bi bi-plus-lg me-2"></i>Nueva Orden
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
                  placeholder="Número de orden, cliente..."
                  v-model="searchTerm"
                >
              </div>
              <div class="col-md-2">
                <label class="form-label">Estado</label>
                <select class="form-select" v-model="selectedStatus">
                  <option value="">Todos</option>
                  <option value="draft">Borrador</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="in_progress">En Proceso</option>
                  <option value="delivered">Entregada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label">Cliente</label>
                <select class="form-select" v-model="selectedCustomer">
                  <option value="">Todos</option>
                  <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                    {{ customer.name }}
                  </option>
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
                    <h6 class="card-title">Total Órdenes</h6>
                    <h3 class="mb-0">{{ filteredOrders.length }}</h3>
                  </div>
                  <i class="bi bi-cart-check fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-success text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6 class="card-title">Confirmadas</h6>
                    <h3 class="mb-0">{{ getOrdersByStatus('confirmed').length }}</h3>
                  </div>
                  <i class="bi bi-check-circle fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-warning text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6 class="card-title">En Proceso</h6>
                    <h3 class="mb-0">{{ getOrdersByStatus('in_progress').length }}</h3>
                  </div>
                  <i class="bi bi-clock fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-info text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6 class="card-title">Valor Total</h6>
                    <h3 class="mb-0">{{ formatCurrency(totalOrdersValue) }}</h3>
                  </div>
                  <i class="bi bi-currency-dollar fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Tabla de Órdenes -->
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Lista de Órdenes</h5>
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
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Total</th>
                    <th>Vendedor</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in paginatedOrders" :key="order.id">
                    <td>
                      <strong>{{ order.number }}</strong>
                      <br>
                      <small class="text-muted">{{ order.reference }}</small>
                    </td>
                    <td>
                      <div>
                        <strong>{{ order.customer.name }}</strong>
                        <br>
                        <small class="text-muted">{{ order.customer.email }}</small>
                      </div>
                    </td>
                    <td>
                      <div>{{ formatDate(order.date) }}</div>
                      <small class="text-muted">Entrega: {{ formatDate(order.delivery_date) }}</small>
                    </td>
                    <td>
                      <span :class="getStatusBadgeClass(order.status)">
                        {{ getStatusText(order.status) }}
                      </span>
                    </td>
                    <td>
                      <strong>{{ formatCurrency(order.total) }}</strong>
                      <br>
                      <small class="text-muted">{{ order.items.length }} items</small>
                    </td>
                    <td>{{ order.salesperson }}</td>
                    <td>
                      <div class="btn-group">
                        <button 
                          class="btn btn-sm btn-outline-primary"
                          @click="viewOrder(order)"
                          title="Ver detalles"
                        >
                          <i class="bi bi-eye"></i>
                        </button>
                        <router-link 
                          :to="`/sales/orders/edit/${order.id}`"
                          class="btn btn-sm btn-outline-secondary"
                          title="Editar"
                        >
                          <i class="bi bi-pencil"></i>
                        </router-link>
                        <button 
                          class="btn btn-sm btn-outline-success"
                          @click="createDelivery(order)"
                          title="Crear despacho"
                          v-if="order.status === 'confirmed'"
                        >
                          <i class="bi bi-truck"></i>
                        </button>
                        <button 
                          class="btn btn-sm btn-outline-danger"
                          @click="cancelOrder(order)"
                          title="Cancelar"
                          v-if="['draft', 'confirmed'].includes(order.status)"
                        >
                          <i class="bi bi-x-lg"></i>
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
        <div class="modal fade" id="orderDetailsModal" tabindex="-1">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Detalles de la Orden</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body" v-if="selectedOrder">
                <div class="row">
                  <div class="col-md-6">
                    <h6>Información General</h6>
                    <p><strong>Número:</strong> {{ selectedOrder.number }}</p>
                    <p><strong>Referencia:</strong> {{ selectedOrder.reference }}</p>
                    <p><strong>Cliente:</strong> {{ selectedOrder.customer?.name }}</p>
                    <p><strong>Fecha:</strong> {{ formatDate(selectedOrder.date) }}</p>
                    <p><strong>Entrega:</strong> {{ formatDate(selectedOrder.delivery_date) }}</p>
                  </div>
                  <div class="col-md-6">
                    <h6>Estado y Totales</h6>
                    <p><strong>Estado:</strong> 
                      <span :class="getStatusBadgeClass(selectedOrder.status)">
                        {{ getStatusText(selectedOrder.status) }}
                      </span>
                    </p>
                    <p><strong>Vendedor:</strong> {{ selectedOrder.salesperson }}</p>
                    <p><strong>Subtotal:</strong> {{ formatCurrency(selectedOrder.subtotal || 0) }}</p>
                    <p><strong>IVA:</strong> {{ formatCurrency(selectedOrder.tax || 0) }}</p>
                    <p><strong>Total:</strong> {{ formatCurrency(selectedOrder.total || 0) }}</p>
                  </div>
                </div>
                
                <hr>
                
                <h6>Items de la Orden</h6>
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in selectedOrder.items" :key="item.id">
                        <td>{{ item.product_name }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>{{ formatCurrency(item.price || 0) }}</td>
                        <td>{{ formatCurrency((item.quantity || 0) * (item.price || 0)) }}</td>
                      </tr>
                    </tbody>
                  </table>
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
    name: 'SalesOrdersView',
    components: {
      DashboardLayout
    },
    data() {
      return {
        searchTerm: '',
        selectedStatus: '',
        selectedCustomer: '',
        dateFrom: '',
        dateTo: '',
        currentPage: 1,
        itemsPerPage: 10,
        selectedOrder: null,
        orders: [
          {
            id: 1,
            number: 'ORD-2024-001',
            reference: 'Pedido Enero',
            customer: {
              id: 1,
              name: 'Empresa ABC S.A.',
              email: 'contacto@abc.com'
            },
            date: '2024-01-15',
            delivery_date: '2024-01-25',
            status: 'confirmed',
            salesperson: 'Juan Pérez',
            subtotal: 850000,
            tax: 161500,
            total: 1011500,
            items: [
              { id: 1, product_name: 'Producto A', quantity: 10, price: 50000 },
              { id: 2, product_name: 'Producto B', quantity: 5, price: 70000 }
            ]
          },
          {
            id: 2,
            number: 'ORD-2024-002',
            reference: 'Pedido Urgente',
            customer: {
              id: 2,
              name: 'Comercial XYZ Ltda.',
              email: 'ventas@xyz.com'
            },
            date: '2024-01-16',
            delivery_date: '2024-01-20',
            status: 'in_progress',
            salesperson: 'María García',
            subtotal: 1200000,
            tax: 228000,
            total: 1428000,
            items: [
              { id: 3, product_name: 'Producto C', quantity: 15, price: 80000 }
            ]
          },
          {
            id: 3,
            number: 'ORD-2024-003',
            reference: 'Pedido Mensual',
            customer: {
              id: 3,
              name: 'Distribuidora 123',
              email: 'pedidos@dist123.com'
            },
            date: '2024-01-17',
            delivery_date: '2024-01-30',
            status: 'draft',
            salesperson: 'Carlos López',
            subtotal: 650000,
            tax: 123500,
            total: 773500,
            items: [
              { id: 4, product_name: 'Producto D', quantity: 8, price: 45000 },
              { id: 5, product_name: 'Producto E', quantity: 6, price: 55000 }
            ]
          }
        ],
        customers: [
          { id: 1, name: 'Empresa ABC S.A.' },
          { id: 2, name: 'Comercial XYZ Ltda.' },
          { id: 3, name: 'Distribuidora 123' }
        ]
      }
    },
    computed: {
      filteredOrders() {
        let filtered = this.orders
  
        if (this.searchTerm) {
          const term = this.searchTerm.toLowerCase()
          filtered = filtered.filter(order => 
            order.number.toLowerCase().includes(term) ||
            order.reference.toLowerCase().includes(term) ||
            order.customer.name.toLowerCase().includes(term)
          )
        }
  
        if (this.selectedStatus) {
          filtered = filtered.filter(order => order.status === this.selectedStatus)
        }
  
        if (this.selectedCustomer) {
          filtered = filtered.filter(order => order.customer.id == this.selectedCustomer)
        }
  
        if (this.dateFrom) {
          filtered = filtered.filter(order => order.date >= this.dateFrom)
        }
  
        if (this.dateTo) {
          filtered = filtered.filter(order => order.date <= this.dateTo)
        }
  
        return filtered
      },
      paginatedOrders() {
        const start = (this.currentPage - 1) * this.itemsPerPage
        const end = start + this.itemsPerPage
        return this.filteredOrders.slice(start, end)
      },
      totalPages() {
        return Math.ceil(this.filteredOrders.length / this.itemsPerPage)
      },
      visiblePages() {
        const pages = []
        const start = Math.max(1, this.currentPage - 2)
        const end = Math.min(this.totalPages, this.currentPage + 2)
        
        for (let i = start; i <= end; i++) {
          pages.push(i)
        }
        
        return pages
      },
      totalOrdersValue() {
        return this.filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0)
      }
    },
    methods: {
      formatCurrency(amount) {
        if (amount == null || amount === undefined) return '$0'
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0
        }).format(amount)
      },
      formatDate(date) {
        if (!date) return ''
        return new Date(date).toLocaleDateString('es-CO')
      },
      getStatusBadgeClass(status) {
        const classes = {
          draft: 'badge bg-secondary',
          confirmed: 'badge bg-success',
          in_progress: 'badge bg-warning',
          delivered: 'badge bg-info',
          cancelled: 'badge bg-danger'
        }
        return classes[status] || 'badge bg-secondary'
      },
      getStatusText(status) {
        const texts = {
          draft: 'Borrador',
          confirmed: 'Confirmada',
          in_progress: 'En Proceso',
          delivered: 'Entregada',
          cancelled: 'Cancelada'
        }
        return texts[status] || status
      },
      getOrdersByStatus(status) {
        return this.filteredOrders.filter(order => order.status === status)
      },
      clearFilters() {
        this.searchTerm = ''
        this.selectedStatus = ''
        this.selectedCustomer = ''
        this.dateFrom = ''
        this.dateTo = ''
        this.currentPage = 1
      },
      viewOrder(order) {
        this.selectedOrder = order
        const modal = new Modal(document.getElementById('orderDetailsModal'))
        modal.show()
      },
      createDelivery(order) {
        this.$router.push(`/sales/deliveries/create?order=${order.id}`)
      },
      cancelOrder(order) {
        if (confirm(`¿Estás seguro de cancelar la orden ${order.number}?`)) {
          order.status = 'cancelled'
          alert('Orden cancelada exitosamente')
        }
      },
      exportData() {
        alert('Funcionalidad de exportación en desarrollo')
      }
    }
  }
  </script>
  