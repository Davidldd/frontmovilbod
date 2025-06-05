<template>
  <DashboardLayout>
    <div class="purchase-orders-view">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Órdenes de Compra</h2>
          <p class="text-muted mb-0">Gestión de órdenes de compra</p>
        </div>
        <button class="btn btn-primary" @click="$router.push('/purchases/orders/create')">
          <i class="fas fa-plus"></i> Nueva Orden de Compra
        </button>
      </div>

      <!-- Filters -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row">
            <div class="col-md-3">
              <div class="form-group">
                <label class="form-label">Buscar</label>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Número OC, proveedor..."
                  v-model="filters.search"
                >
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label class="form-label">Estado</label>
                <select class="form-select" v-model="filters.status">
                  <option value="">Todos</option>
                  <option value="Borrador">Borrador</option>
                  <option value="Enviada">Enviada</option>
                  <option value="Aprobada">Aprobada</option>
                  <option value="Recibida Parcial">Recibida Parcial</option>
                  <option value="Recibida">Recibida</option>
                  <option value="Cerrada">Cerrada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label class="form-label">Desde</label>
                <input type="date" class="form-control" v-model="filters.dateFrom">
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label class="form-label">Hasta</label>
                <input type="date" class="form-control" v-model="filters.dateTo">
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label class="form-label">Proveedor</label>
                <select class="form-select" v-model="filters.supplier">
                  <option value="">Todos</option>
                  <option value="1">Proveedor ABC S.A.S.</option>
                  <option value="2">Distribuidora XYZ Ltda.</option>
                  <option value="3">Suministros DEF S.A.</option>
                </select>
              </div>
            </div>
            <div class="col-md-1">
              <div class="form-group">
                <label class="form-label">&nbsp;</label>
                <button class="btn btn-outline-secondary w-100" @click="clearFilters">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Purchase Orders Table -->
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Número OC</th>
                  <th>Proveedor</th>
                  <th>Fecha Emisión</th>
                  <th>Fecha Entrega</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in filteredOrders" :key="order.id">
                  <td>
                    <strong>{{ order.number }}</strong>
                  </td>
                  <td>{{ order.supplier }}</td>
                  <td>{{ formatDate(order.issueDate) }}</td>
                  <td>{{ formatDate(order.deliveryDate) }}</td>
                  <td>${{ formatNumber(order.total) }}</td>
                  <td>
                    <span :class="getStatusBadgeClass(order.status)">
                      {{ order.status }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-primary" @click="viewOrder(order.id)">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        class="btn btn-outline-success" 
                        @click="receiveOrder(order.id)"
                        v-if="['Enviada', 'Aprobada'].includes(order.status)"
                      >
                        <i class="fas fa-truck"></i>
                      </button>
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                          <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="#" @click="editOrder(order.id)" v-if="order.status === 'Borrador'">
                            <i class="fas fa-edit"></i> Editar
                          </a></li>
                          <li><a class="dropdown-item" href="#" @click="sendOrder(order.id)" v-if="order.status === 'Borrador'">
                            <i class="fas fa-paper-plane"></i> Enviar a Proveedor
                          </a></li>
                          <li><a class="dropdown-item" href="#" @click="approveOrder(order.id)" v-if="order.status === 'Enviada'">
                            <i class="fas fa-check"></i> Aprobar
                          </a></li>
                          <li><a class="dropdown-item" href="#" @click="registerInvoice(order.id)" v-if="['Recibida Parcial', 'Recibida'].includes(order.status)">
                            <i class="fas fa-file-invoice"></i> Registrar Factura
                          </a></li>
                          <li><hr class="dropdown-divider"></li>
                          <li><a class="dropdown-item" href="#" @click="duplicateOrder(order.id)">
                            <i class="fas fa-copy"></i> Duplicar
                          </a></li>
                          <li><a class="dropdown-item" href="#" @click="printOrder(order.id)">
                            <i class="fas fa-print"></i> Imprimir
                          </a></li>
                          <li><hr class="dropdown-divider"></li>
                          <li><a class="dropdown-item text-danger" href="#" @click="cancelOrder(order.id)" v-if="!['Cerrada', 'Cancelada'].includes(order.status)">
                            <i class="fas fa-ban"></i> Cancelar
                          </a></li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <nav class="mt-4">
            <ul class="pagination justify-content-center">
              <li class="page-item disabled">
                <span class="page-link">Anterior</span>
              </li>
              <li class="page-item active">
                <span class="page-link">1</span>
              </li>
              <li class="page-item">
                <a class="page-link" href="#">2</a>
              </li>
              <li class="page-item">
                <a class="page-link" href="#">3</a>
              </li>
              <li class="page-item">
                <a class="page-link" href="#">Siguiente</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <!-- Receive Order Modal -->
      <div class="modal fade" id="receiveOrderModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Registrar Recepción de Mercancía</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveReceipt">
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Número de Recepción</label>
                    <input type="text" class="form-control" v-model="receipt.number" readonly>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Fecha de Recepción</label>
                    <input type="date" class="form-control" v-model="receipt.date" required>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Observaciones</label>
                  <textarea class="form-control" rows="3" v-model="receipt.notes"></textarea>
                </div>
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad Ordenada</th>
                        <th>Cantidad Recibida</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in receipt.items" :key="item.id">
                        <td>{{ item.product }}</td>
                        <td>{{ item.orderedQty }}</td>
                        <td>
                          <input 
                            type="number" 
                            class="form-control" 
                            v-model="item.receivedQty"
                            :max="item.orderedQty"
                            min="0"
                          >
                        </td>
                        <td>
                          <span :class="item.receivedQty == item.orderedQty ? 'badge bg-success' : 'badge bg-warning'">
                            {{ item.receivedQty == item.orderedQty ? 'Completo' : 'Parcial' }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="saveReceipt">Guardar Recepción</button>
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
  name: 'PurchaseOrdersView',
  components: {
    DashboardLayout
  },
  data() {
    return {
      filters: {
        search: '',
        status: '',
        dateFrom: '',
        dateTo: '',
        supplier: ''
      },
      receipt: {
        number: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        items: []
      },
      orders: [
        {
          id: 1,
          number: 'OC-2024-001',
          supplier: 'Proveedor ABC S.A.S.',
          issueDate: '2024-01-15',
          deliveryDate: '2024-01-25',
          total: 1250000,
          status: 'Enviada'
        },
        {
          id: 2,
          number: 'OC-2024-002',
          supplier: 'Distribuidora XYZ Ltda.',
          issueDate: '2024-01-14',
          deliveryDate: '2024-01-24',
          total: 850000,
          status: 'Aprobada'
        },
        {
          id: 3,
          number: 'OC-2024-003',
          supplier: 'Suministros DEF S.A.',
          issueDate: '2024-01-13',
          deliveryDate: '2024-01-23',
          total: 2100000,
          status: 'Recibida Parcial'
        },
        {
          id: 4,
          number: 'OC-2024-004',
          supplier: 'Proveedor ABC S.A.S.',
          issueDate: '2024-01-12',
          deliveryDate: '2024-01-22',
          total: 750000,
          status: 'Borrador'
        },
        {
          id: 5,
          number: 'OC-2024-005',
          supplier: 'Distribuidora XYZ Ltda.',
          issueDate: '2024-01-11',
          deliveryDate: '2024-01-21',
          total: 1800000,
          status: 'Cerrada'
        }
      ]
    }
  },
  computed: {
    filteredOrders() {
      return this.orders.filter(order => {
        const matchesSearch = !this.filters.search || 
          order.number.toLowerCase().includes(this.filters.search.toLowerCase()) ||
          order.supplier.toLowerCase().includes(this.filters.search.toLowerCase())
        
        const matchesStatus = !this.filters.status || order.status === this.filters.status
        const matchesSupplier = !this.filters.supplier || order.supplier.includes(this.filters.supplier)
        
        let matchesDate = true
        if (this.filters.dateFrom) {
          matchesDate = matchesDate && order.issueDate >= this.filters.dateFrom
        }
        if (this.filters.dateTo) {
          matchesDate = matchesDate && order.issueDate <= this.filters.dateTo
        }
        
        return matchesSearch && matchesStatus && matchesSupplier && matchesDate
      })
    }
  },
  methods: {
    clearFilters() {
      this.filters = {
        search: '',
        status: '',
        dateFrom: '',
        dateTo: '',
        supplier: ''
      }
    },
    formatNumber(number) {
      return number.toLocaleString()
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('es-CO')
    },
    getStatusBadgeClass(status) {
      const classes = {
        'Borrador': 'badge bg-secondary',
        'Enviada': 'badge bg-warning',
        'Aprobada': 'badge bg-info',
        'Recibida Parcial': 'badge bg-primary',
        'Recibida': 'badge bg-success',
        'Cerrada': 'badge bg-dark',
        'Cancelada': 'badge bg-danger'
      }
      return classes[status] || 'badge bg-secondary'
    },
    viewOrder(id) {
      this.$router.push(`/purchases/orders/${id}`)
    },
    editOrder(id) {
      this.$router.push(`/purchases/orders/${id}/edit`)
    },
    receiveOrder(id) {
      // Preparar datos para el modal de recepción
      this.receipt.number = `REC-${Date.now()}`
      this.receipt.items = [
        { id: 1, product: 'Producto A', orderedQty: 10, receivedQty: 10 },
        { id: 2, product: 'Producto B', orderedQty: 5, receivedQty: 0 }
      ]
      
      // Mostrar modal
      const modal = new bootstrap.Modal(document.getElementById('receiveOrderModal'))
      modal.show()
    },
    saveReceipt() {
      console.log('Guardando recepción:', this.receipt)
      alert('Recepción registrada exitosamente')
      
      // Cerrar modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('receiveOrderModal'))
      modal.hide()
    },
    sendOrder(id) {
      const order = this.orders.find(o => o.id === id)
      if (order) {
        order.status = 'Enviada'
        alert('Orden enviada al proveedor')
      }
    },
    approveOrder(id) {
      const order = this.orders.find(o => o.id === id)
      if (order) {
        order.status = 'Aprobada'
        alert('Orden aprobada')
      }
    },
    registerInvoice(id) {
      this.$router.push(`/purchases/invoices/create?order=${id}`)
    },
    duplicateOrder(id) {
      this.$router.push(`/purchases/orders/create?duplicate=${id}`)
    },
    printOrder(id) {
      console.log('Imprimir orden:', id)
      alert('Función de impresión no implementada')
    },
    cancelOrder(id) {
      if (confirm('¿Está seguro de cancelar esta orden de compra?')) {
        const order = this.orders.find(o => o.id === id)
        if (order) {
          order.status = 'Cancelada'
          alert('Orden cancelada')
        }
      }
    }
  }
}
</script>
