<template>
  <DashboardLayout>
    <div class="goods-receipts-view">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Recepciones de Mercancía</h2>
          <p class="text-muted mb-0">Gestión de recepciones de productos</p>
        </div>
        <button class="btn btn-primary" @click="$router.push('/purchases/orders')">
          <i class="fas fa-truck"></i> Ver Órdenes de Compra
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
                  placeholder="Número recepción, OC, proveedor..."
                  v-model="filters.search"
                >
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label class="form-label">Estado</label>
                <select class="form-select" v-model="filters.status">
                  <option value="">Todos</option>
                  <option value="Parcial">Parcial</option>
                  <option value="Total">Total</option>
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

      <!-- Receipts Table -->
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Número Recepción</th>
                  <th>Orden de Compra</th>
                  <th>Proveedor</th>
                  <th>Fecha Recepción</th>
                  <th>Items Recibidos</th>
                  <th>Estado</th>
                  <th>Recibido Por</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="receipt in filteredReceipts" :key="receipt.id">
                  <td>
                    <strong>{{ receipt.number }}</strong>
                  </td>
                  <td>{{ receipt.purchaseOrder }}</td>
                  <td>{{ receipt.supplier }}</td>
                  <td>{{ formatDate(receipt.receiptDate) }}</td>
                  <td>{{ receipt.itemsCount }} items</td>
                  <td>
                    <span :class="getStatusBadgeClass(receipt.status)">
                      {{ receipt.status }}
                    </span>
                  </td>
                  <td>{{ receipt.receivedBy }}</td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-primary" @click="viewReceipt(receipt.id)">
                        <i class="fas fa-eye"></i>
                      </button>
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                          <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="#" @click="printReceipt(receipt.id)">
                            <i class="fas fa-print"></i> Imprimir
                          </a></li>
                          <li><a class="dropdown-item" href="#" @click="updateInventory(receipt.id)" v-if="!receipt.inventoryUpdated">
                            <i class="fas fa-boxes"></i> Actualizar Inventario
                          </a></li>
                          <li><a class="dropdown-item" href="#" @click="createInvoice(receipt.id)">
                            <i class="fas fa-file-invoice"></i> Crear Factura Proveedor
                          </a></li>
                          <li><hr class="dropdown-divider"></li>
                          <li><a class="dropdown-item text-danger" href="#" @click="cancelReceipt(receipt.id)">
                            <i class="fas fa-ban"></i> Anular Recepción
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

      <!-- Receipt Detail Modal -->
      <div class="modal fade" id="receiptDetailModal" tabindex="-1">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Detalle de Recepción - {{ selectedReceipt?.number }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body" v-if="selectedReceipt">
              <div class="row mb-4">
                <div class="col-md-6">
                  <h6>Información General</h6>
                  <p><strong>Orden de Compra:</strong> {{ selectedReceipt.purchaseOrder }}</p>
                  <p><strong>Proveedor:</strong> {{ selectedReceipt.supplier }}</p>
                  <p><strong>Fecha de Recepción:</strong> {{ formatDate(selectedReceipt.receiptDate) }}</p>
                  <p><strong>Recibido Por:</strong> {{ selectedReceipt.receivedBy }}</p>
                </div>
                <div class="col-md-6">
                  <h6>Estado</h6>
                  <p>
                    <span :class="getStatusBadgeClass(selectedReceipt.status)">
                      {{ selectedReceipt.status }}
                    </span>
                  </p>
                  <p><strong>Observaciones:</strong></p>
                  <p class="text-muted">{{ selectedReceipt.notes || 'Sin observaciones' }}</p>
                </div>
              </div>
              
              <h6>Items Recibidos</h6>
              <div class="table-responsive">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Descripción</th>
                      <th>Cantidad Ordenada</th>
                      <th>Cantidad Recibida</th>
                      <th>Diferencia</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in selectedReceipt.items" :key="item.id">
                      <td>{{ item.code }}</td>
                      <td>{{ item.description }}</td>
                      <td>{{ item.orderedQty }}</td>
                      <td>{{ item.receivedQty }}</td>
                      <td>
                        <span :class="item.difference > 0 ? 'text-danger' : item.difference < 0 ? 'text-warning' : 'text-success'">
                          {{ item.difference }}
                        </span>
                      </td>
                      <td>
                        <span :class="item.receivedQty === item.orderedQty ? 'badge bg-success' : 'badge bg-warning'">
                          {{ item.receivedQty === item.orderedQty ? 'Completo' : 'Parcial' }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button type="button" class="btn btn-primary" @click="printReceipt(selectedReceipt?.id)">
                <i class="fas fa-print"></i> Imprimir
              </button>
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
  name: 'GoodsReceiptsView',
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
      selectedReceipt: null,
      receipts: [
        {
          id: 1,
          number: 'REC-2024-001',
          purchaseOrder: 'OC-2024-001',
          supplier: 'Proveedor ABC S.A.S.',
          receiptDate: '2024-01-16',
          itemsCount: 3,
          status: 'Total',
          receivedBy: 'Juan Almacenista',
          inventoryUpdated: true,
          notes: 'Recepción completa sin novedades',
          items: [
            {
              id: 1,
              code: 'PROD001',
              description: 'Producto A',
              orderedQty: 10,
              receivedQty: 10,
              difference: 0
            },
            {
              id: 2,
              code: 'PROD002',
              description: 'Producto B',
              orderedQty: 5,
              receivedQty: 5,
              difference: 0
            }
          ]
        },
        {
          id: 2,
          number: 'REC-2024-002',
          purchaseOrder: 'OC-2024-002',
          supplier: 'Distribuidora XYZ Ltda.',
          receiptDate: '2024-01-15',
          itemsCount: 2,
          status: 'Parcial',
          receivedBy: 'María Bodega',
          inventoryUpdated: false,
          notes: 'Faltaron 2 unidades del producto C',
          items: [
            {
              id: 1,
              code: 'PROD003',
              description: 'Producto C',
              orderedQty: 8,
              receivedQty: 6,
              difference: -2
            },
            {
              id: 2,
              code: 'PROD004',
              description: 'Producto D',
              orderedQty: 12,
              receivedQty: 12,
              difference: 0
            }
          ]
        },
        {
          id: 3,
          number: 'REC-2024-003',
          purchaseOrder: 'OC-2024-003',
          supplier: 'Suministros DEF S.A.',
          receiptDate: '2024-01-14',
          itemsCount: 4,
          status: 'Total',
          receivedBy: 'Carlos Supervisor',
          inventoryUpdated: true,
          notes: '',
          items: [
            {
              id: 1,
              code: 'SERV001',
              description: 'Servicio de Mantenimiento',
              orderedQty: 1,
              receivedQty: 1,
              difference: 0
            }
          ]
        }
      ]
    }
  },
  computed: {
    filteredReceipts() {
      return this.receipts.filter(receipt => {
        const matchesSearch = !this.filters.search || 
          receipt.number.toLowerCase().includes(this.filters.search.toLowerCase()) ||
          receipt.purchaseOrder.toLowerCase().includes(this.filters.search.toLowerCase()) ||
          receipt.supplier.toLowerCase().includes(this.filters.search.toLowerCase())
        
        const matchesStatus = !this.filters.status || receipt.status === this.filters.status
        const matchesSupplier = !this.filters.supplier || receipt.supplier.includes(this.filters.supplier)
        
        let matchesDate = true
        if (this.filters.dateFrom) {
          matchesDate = matchesDate && receipt.receiptDate >= this.filters.dateFrom
        }
        if (this.filters.dateTo) {
          matchesDate = matchesDate && receipt.receiptDate <= this.filters.dateTo
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
    formatDate(date) {
      return new Date(date).toLocaleDateString('es-CO')
    },
    getStatusBadgeClass(status) {
      const classes = {
        'Parcial': 'badge bg-warning',
        'Total': 'badge bg-success'
      }
      return classes[status] || 'badge bg-secondary'
    },
    viewReceipt(id) {
      this.selectedReceipt = this.receipts.find(r => r.id === id)
      const modal = new bootstrap.Modal(document.getElementById('receiptDetailModal'))
      modal.show()
    },
    printReceipt(id) {
      console.log('Imprimir recepción:', id)
      alert('Función de impresión no implementada')
    },
    updateInventory(id) {
      if (confirm('¿Está seguro de actualizar el inventario con esta recepción?')) {
        const receipt = this.receipts.find(r => r.id === id)
        if (receipt) {
          receipt.inventoryUpdated = true
          alert('Inventario actualizado exitosamente')
        }
      }
    },
    createInvoice(id) {
      this.$router.push(`/purchases/invoices/create?receipt=${id}`)
    },
    cancelReceipt(id) {
      if (confirm('¿Está seguro de anular esta recepción? Esta acción no se puede deshacer.')) {
        const receiptIndex = this.receipts.findIndex(r => r.id === id)
        if (receiptIndex !== -1) {
          this.receipts.splice(receiptIndex, 1)
          alert('Recepción anulada')
        }
      }
    }
  }
}
</script>
