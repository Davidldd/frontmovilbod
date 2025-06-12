<template>
  <DashboardLayout>
    <div class="supplier-invoices-view">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Facturas de Proveedor</h2>
          <p class="text-muted mb-0">Gestión de facturas recibidas de proveedores</p>
        </div>
        <button class="btn btn-primary" @click="showRegisterInvoiceModal">
          <i class="bi bi-plus"></i> Registrar Factura
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
                  placeholder="Número factura, proveedor..."
                  v-model="filters.search"
                >
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label class="form-label">Estado de Pago</label>
                <select class="form-select" v-model="filters.paymentStatus">
                  <option value="">Todos</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Pagada">Pagada</option>
                  <option value="Vencida">Vencida</option>
                  <option value="Parcial">Parcial</option>
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
                  <i class="bi bi-x"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Invoices Table -->
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Número Factura</th>
                  <th>Orden de Compra</th>
                  <th>Proveedor</th>
                  <th>Fecha Factura</th>
                  <th>Fecha Vencimiento</th>
                  <th>Total</th>
                  <th>Saldo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="invoice in filteredInvoices" :key="invoice.id">
                  <td>
                    <strong>{{ invoice.number }}</strong>
                  </td>
                  <td>{{ invoice.purchaseOrder }}</td>
                  <td>{{ invoice.supplier }}</td>
                  <td>{{ formatDate(invoice.invoiceDate) }}</td>
                  <td>{{ formatDate(invoice.dueDate) }}</td>
                  <td>${{ formatNumber(invoice.total) }}</td>
                  <td>${{ formatNumber(invoice.balance) }}</td>
                  <td>
                    <span :class="getPaymentStatusBadgeClass(invoice.paymentStatus)">
                      {{ invoice.paymentStatus }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-primary" @click="viewInvoice(invoice.id)" title="Ver">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button 
                        class="btn btn-outline-success" 
                        @click="registerPayment(invoice.id)"
                        v-if="invoice.balance > 0"
                        title="Registrar Pago"
                      >
                        <i class="bi bi-currency-dollar"></i>
                      </button>
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                          <i class="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="#" @click="editInvoice(invoice.id)">
                            <i class="bi bi-pencil"></i> Editar
                          </a></li>
                          <li><a class="dropdown-item" href="#" @click="printInvoice(invoice.id)">
                            <i class="bi bi-printer"></i> Imprimir
                          </a></li>
                          <li><a class="dropdown-item" href="#" @click="generateAccountingEntry(invoice.id)">
                            <i class="bi bi-calculator"></i> Generar Asiento Contable
                          </a></li>
                          <li><hr class="dropdown-divider"></li>
                          <li><a class="dropdown-item text-danger" href="#" @click="cancelInvoice(invoice.id)">
                            <i class="bi bi-x-circle"></i> Anular
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

      <!-- Register Invoice Modal -->
      <div class="modal fade" id="registerInvoiceModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Registrar Factura de Proveedor</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveInvoice">
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Número de Factura *</label>
                    <input type="text" class="form-control" v-model="newInvoice.number" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Orden de Compra</label>
                    <select class="form-select" v-model="newInvoice.purchaseOrderId">
                      <option value="">Seleccionar OC...</option>
                      <option value="1">OC-2024-001</option>
                      <option value="2">OC-2024-002</option>
                      <option value="3">OC-2024-003</option>
                    </select>
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Proveedor *</label>
                    <select class="form-select" v-model="newInvoice.supplierId" required>
                      <option value="">Seleccionar proveedor...</option>
                      <option value="1">Proveedor ABC S.A.S.</option>
                      <option value="2">Distribuidora XYZ Ltda.</option>
                      <option value="3">Suministros DEF S.A.</option>
                    </select>
                  </div>
                  <div class="col-md-3">
                    <label class="form-label">Fecha Factura *</label>
                    <input type="date" class="form-control" v-model="newInvoice.invoiceDate" required>
                  </div>
                  <div class="col-md-3">
                    <label class="form-label">Fecha Vencimiento *</label>
                    <input type="date" class="form-control" v-model="newInvoice.dueDate" required>
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col-md-4">
                    <label class="form-label">Subtotal *</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      v-model="newInvoice.subtotal"
                      @input="calculateTotal"
                      required
                    >
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">IVA</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      v-model="newInvoice.tax"
                      @input="calculateTotal"
                    >
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Total</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      v-model="newInvoice.total"
                      readonly
                    >
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Observaciones</label>
                  <textarea class="form-control" rows="3" v-model="newInvoice.notes"></textarea>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="saveInvoice">Guardar Factura</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Modal -->
      <div class="modal fade" id="paymentModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Registrar Pago</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="savePayment">
                <div class="mb-3">
                  <label class="form-label">Factura</label>
                  <input type="text" class="form-control" :value="selectedInvoice?.number" readonly>
                </div>
                <div class="mb-3">
                  <label class="form-label">Saldo Pendiente</label>
                  <input type="text" class="form-control" :value="selectedInvoice ? formatCurrency(selectedInvoice.balance) : '$0'" readonly>
                </div>
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Monto a Pagar *</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      v-model="payment.amount"
                      :max="selectedInvoice?.balance"
                      required
                    >
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Fecha de Pago *</label>
                    <input type="date" class="form-control" v-model="payment.date" required>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Método de Pago *</label>
                  <select class="form-select" v-model="payment.method" required>
                    <option value="">Seleccionar...</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia">Transferencia Bancaria</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Tarjeta">Tarjeta de Crédito</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Referencia</label>
                  <input type="text" class="form-control" v-model="payment.reference" placeholder="Número de transacción, cheque, etc.">
                </div>
                <div class="mb-3">
                  <label class="form-label">Observaciones</label>
                  <textarea class="form-control" rows="2" v-model="payment.notes"></textarea>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="savePayment">Registrar Pago</button>
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
  name: 'SupplierInvoicesView',
  components: {
    DashboardLayout
  },
  data() {
    return {
      filters: {
        search: '',
        paymentStatus: '',
        dateFrom: '',
        dateTo: '',
        supplier: ''
      },
      selectedInvoice: null,
      newInvoice: {
        number: '',
        purchaseOrderId: '',
        supplierId: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        subtotal: 0,
        tax: 0,
        total: 0,
        notes: ''
      },
      payment: {
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        method: '',
        reference: '',
        notes: ''
      },
      invoices: [
        {
          id: 1,
          number: 'FAC-PROV-001',
          purchaseOrder: 'OC-2024-001',
          supplier: 'Proveedor ABC S.A.S.',
          invoiceDate: '2024-01-16',
          dueDate: '2024-02-15',
          total: 1250000,
          balance: 1250000,
          paymentStatus: 'Pendiente'
        },
        {
          id: 2,
          number: 'FAC-PROV-002',
          purchaseOrder: 'OC-2024-002',
          supplier: 'Distribuidora XYZ Ltda.',
          invoiceDate: '2024-01-15',
          dueDate: '2024-02-14',
          total: 850000,
          balance: 0,
          paymentStatus: 'Pagada'
        },
        {
          id: 3,
          number: 'FAC-PROV-003',
          purchaseOrder: 'OC-2024-003',
          supplier: 'Suministros DEF S.A.',
          invoiceDate: '2024-01-10',
          dueDate: '2024-01-25',
          total: 2100000,
          balance: 2100000,
          paymentStatus: 'Vencida'
        },
        {
          id: 4,
          number: 'FAC-PROV-004',
          purchaseOrder: 'OC-2024-004',
          supplier: 'Proveedor ABC S.A.S.',
          invoiceDate: '2024-01-12',
          dueDate: '2024-02-11',
          total: 750000,
          balance: 375000,
          paymentStatus: 'Parcial'
        }
      ]
    }
  },
  computed: {
    filteredInvoices() {
      return this.invoices.filter(invoice => {
        const matchesSearch = !this.filters.search || 
          invoice.number.toLowerCase().includes(this.filters.search.toLowerCase()) ||
          invoice.supplier.toLowerCase().includes(this.filters.search.toLowerCase())
        
        const matchesStatus = !this.filters.paymentStatus || invoice.paymentStatus === this.filters.paymentStatus
        const matchesSupplier = !this.filters.supplier || invoice.supplier.includes(this.filters.supplier)
        
        let matchesDate = true
        if (this.filters.dateFrom) {
          matchesDate = matchesDate && invoice.invoiceDate >= this.filters.dateFrom
        }
        if (this.filters.dateTo) {
          matchesDate = matchesDate && invoice.invoiceDate <= this.filters.dateTo
        }
        
        return matchesSearch && matchesStatus && matchesSupplier && matchesDate
      })
    }
  },
  methods: {
    clearFilters() {
      this.filters = {
        search: '',
        paymentStatus: '',
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
    formatCurrency(amount) {
      if (amount === undefined || amount === null) {
        return '$0'
      }
      return '$' + amount.toLocaleString()
    },
    getPaymentStatusBadgeClass(status) {
      const classes = {
        'Pendiente': 'badge bg-warning',
        'Pagada': 'badge bg-success',
        'Vencida': 'badge bg-danger',
        'Parcial': 'badge bg-info'
      }
      return classes[status] || 'badge bg-secondary'
    },
    showRegisterInvoiceModal() {
      this.newInvoice = {
        number: '',
        purchaseOrderId: '',
        supplierId: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        subtotal: 0,
        tax: 0,
        total: 0,
        notes: ''
      }
      
      // Usar Bootstrap 5 API
      const modalElement = document.getElementById('registerInvoiceModal')
      if (modalElement) {
        const modal = new window.bootstrap.Modal(modalElement)
        modal.show()
      }
    },
    calculateTotal() {
      const subtotal = parseFloat(this.newInvoice.subtotal) || 0
      const tax = parseFloat(this.newInvoice.tax) || 0
      this.newInvoice.total = subtotal + tax
    },
    saveInvoice() {
      // Validaciones básicas
      if (!this.newInvoice.number || !this.newInvoice.supplierId) {
        alert('Por favor complete los campos obligatorios')
        return
      }

      // Simular guardado
      const newId = Math.max(...this.invoices.map(i => i.id)) + 1
      this.invoices.push({
        id: newId,
        number: this.newInvoice.number,
        purchaseOrder: this.newInvoice.purchaseOrderId ? `OC-2024-${this.newInvoice.purchaseOrderId.padStart(3, '0')}` : 'N/A',
        supplier: this.getSupplierName(this.newInvoice.supplierId),
        invoiceDate: this.newInvoice.invoiceDate,
        dueDate: this.newInvoice.dueDate,
        total: this.newInvoice.total,
        balance: this.newInvoice.total,
        paymentStatus: 'Pendiente'
      })

      alert('Factura registrada exitosamente')
      
      // Cerrar modal
      const modalElement = document.getElementById('registerInvoiceModal')
      if (modalElement) {
        const modal = window.bootstrap.Modal.getInstance(modalElement)
        if (modal) {
          modal.hide()
        }
      }
    },
    getSupplierName(supplierId) {
      const suppliers = {
        '1': 'Proveedor ABC S.A.S.',
        '2': 'Distribuidora XYZ Ltda.',
        '3': 'Suministros DEF S.A.'
      }
      return suppliers[supplierId] || 'Proveedor Desconocido'
    },
    viewInvoice(id) {
      this.$router.push(`/purchases/invoice/${id}`)
    },
    editInvoice(id) {
      this.$router.push(`/purchases/invoice/${id}/edit`)
    },
    registerPayment(id) {
      this.selectedInvoice = this.invoices.find(i => i.id === id)
      if (!this.selectedInvoice) {
        alert('Factura no encontrada')
        return
      }
      
      this.payment = {
        amount: this.selectedInvoice.balance,
        date: new Date().toISOString().split('T')[0],
        method: '',
        reference: '',
        notes: ''
      }
      
      const modalElement = document.getElementById('paymentModal')
      if (modalElement) {
        const modal = new window.bootstrap.Modal(modalElement)
        modal.show()
      }
    },
    savePayment() {
      // Validaciones
      if (!this.payment.amount || !this.payment.method) {
        alert('Por favor complete los campos obligatorios')
        return
      }

      if (this.payment.amount > this.selectedInvoice.balance) {
        alert('El monto no puede ser mayor al saldo pendiente')
        return
      }

      // Actualizar saldo de la factura
      this.selectedInvoice.balance -= this.payment.amount
      
      // Actualizar estado de pago
      if (this.selectedInvoice.balance === 0) {
        this.selectedInvoice.paymentStatus = 'Pagada'
      } else {
        this.selectedInvoice.paymentStatus = 'Parcial'
      }

      alert('Pago registrado exitosamente')
      
      // Cerrar modal
      const modalElement = document.getElementById('paymentModal')
      if (modalElement) {
        const modal = window.bootstrap.Modal.getInstance(modalElement)
        if (modal) {
          modal.hide()
        }
      }
    },
    printInvoice(id) {
      console.log('Imprimir factura:', id)
      alert('Función de impresión no implementada')
    },
    generateAccountingEntry(id) {
      console.log('Generar asiento contable para factura:', id)
      alert('Función de asiento contable no implementada')
    },
    cancelInvoice(id) {
      if (confirm('¿Está seguro de anular esta factura?')) {
        const invoice = this.invoices.find(i => i.id === id)
        if (invoice) {
          invoice.paymentStatus = 'Anulada'
          alert('Factura anulada')
        }
      }
    }
  }
}
</script>
