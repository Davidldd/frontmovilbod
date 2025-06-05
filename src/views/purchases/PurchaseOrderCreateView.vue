<template>
  <DashboardLayout>
    <div class="purchase-order-create-view">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">{{ isEditing ? 'Editar' : 'Nueva' }} Orden de Compra</h2>
          <p class="text-muted mb-0">{{ isEditing ? 'Modificar orden de compra' : 'Crear nueva orden de compra' }}</p>
        </div>
        <button class="btn btn-outline-secondary" @click="$router.go(-1)">
          <i class="fas fa-arrow-left"></i> Volver
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="savePurchaseOrder">
        <div class="row">
          <!-- Main Content -->
          <div class="col-md-8">
            <!-- Header Information -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="card-title mb-0">Información General</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group mb-3">
                      <label class="form-label">Proveedor *</label>
                      <SupplierSelector 
                        v-model="order.supplierId"
                        @supplier-selected="onSupplierSelected"
                        :required="true"
                      />
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-group mb-3">
                      <label class="form-label">Número OC</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="order.number"
                        placeholder="Auto-generado"
                        readonly
                      >
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-group mb-3">
                      <label class="form-label">Estado</label>
                      <select class="form-select" v-model="order.status" disabled>
                        <option value="Borrador">Borrador</option>
                        <option value="Enviada">Enviada</option>
                        <option value="Aprobada">Aprobada</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-3">
                    <div class="form-group mb-3">
                      <label class="form-label">Fecha Emisión *</label>
                      <input 
                        type="date" 
                        class="form-control" 
                        v-model="order.issueDate"
                        required
                      >
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-group mb-3">
                      <label class="form-label">Fecha Entrega Requerida *</label>
                      <input 
                        type="date" 
                        class="form-control" 
                        v-model="order.deliveryDate"
                        required
                      >
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-group mb-3">
                      <label class="form-label">Condiciones de Pago</label>
                      <select class="form-select" v-model="order.paymentTerms">
                        <option value="Contado">Contado</option>
                        <option value="15 días">15 días</option>
                        <option value="30 días">30 días</option>
                        <option value="45 días">45 días</option>
                        <option value="60 días">60 días</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-group mb-3">
                      <label class="form-label">Moneda</label>
                      <select class="form-select" v-model="order.currency">
                        <option value="COP">Peso Colombiano (COP)</option>
                        <option value="USD">Dólar Americano (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12">
                    <div class="form-group mb-3">
                      <label class="form-label">Dirección de Envío</label>
                      <textarea 
                        class="form-control" 
                        rows="2" 
                        v-model="order.deliveryAddress"
                        placeholder="Dirección donde se debe entregar la mercancía"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Items -->
            <div class="card mb-4">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">Items de la Orden</h5>
                <button type="button" class="btn btn-sm btn-primary" @click="addItem">
                  <i class="fas fa-plus"></i> Agregar Item
                </button>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th style="width: 25%">Código/Referencia</th>
                        <th style="width: 30%">Descripción</th>
                        <th style="width: 10%">Cantidad</th>
                        <th style="width: 10%">Unidad</th>
                        <th style="width: 12%">Costo Unit.</th>
                        <th style="width: 8%">IVA %</th>
                        <th style="width: 12%">Subtotal</th>
                        <th style="width: 5%">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in order.items" :key="index">
                        <td>
                          <input 
                            type="text" 
                            class="form-control form-control-sm" 
                            v-model="item.code"
                            placeholder="Código"
                          >
                        </td>
                        <td>
                          <input 
                            type="text" 
                            class="form-control form-control-sm" 
                            v-model="item.description"
                            placeholder="Descripción del producto/servicio"
                            required
                          >
                        </td>
                        <td>
                          <input 
                            type="number" 
                            class="form-control form-control-sm" 
                            v-model="item.quantity"
                            min="1"
                            step="0.01"
                            @input="calculateItemSubtotal(index)"
                            required
                          >
                        </td>
                        <td>
                          <select class="form-select form-select-sm" v-model="item.unit">
                            <option value="UND">UND</option>
                            <option value="KG">KG</option>
                            <option value="LT">LT</option>
                            <option value="MT">MT</option>
                            <option value="M2">M2</option>
                            <option value="M3">M3</option>
                          </select>
                        </td>
                        <td>
                          <input 
                            type="number" 
                            class="form-control form-control-sm" 
                            v-model="item.unitCost"
                            min="0"
                            step="0.01"
                            @input="calculateItemSubtotal(index)"
                            required
                          >
                        </td>
                        <td>
                          <select class="form-select form-select-sm" v-model="item.taxRate" @change="calculateItemSubtotal(index)">
                            <option value="0">0%</option>
                            <option value="5">5%</option>
                            <option value="19">19%</option>
                          </select>
                        </td>
                        <td>
                          <input 
                            type="text" 
                            class="form-control form-control-sm" 
                            :value="formatNumber(item.subtotal)"
                            readonly
                          >
                        </td>
                        <td>
                          <button 
                            type="button" 
                            class="btn btn-sm btn-outline-danger" 
                            @click="removeItem(index)"
                          >
                            <i class="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="text-muted small mt-2" v-if="order.items.length === 0">
                  No hay items agregados. Haga clic en "Agregar Item" para comenzar.
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-md-4">
            <!-- Totals -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="card-title mb-0">Totales</h5>
              </div>
              <div class="card-body">
                <div class="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>${{ formatNumber(totals.subtotal) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Descuento:</span>
                  <div class="input-group input-group-sm" style="width: 120px;">
                    <input 
                      type="number" 
                      class="form-control" 
                      v-model="order.discount"
                      min="0"
                      step="0.01"
                      @input="calculateTotals"
                    >
                    <span class="input-group-text">%</span>
                  </div>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>IVA:</span>
                  <span>${{ formatNumber(totals.tax) }}</span>
                </div>
                <hr>
                <div class="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong>${{ formatNumber(totals.total) }}</strong>
                </div>
              </div>
            </div>

            <!-- Supplier Info -->
            <div class="card mb-4" v-if="selectedSupplier">
              <div class="card-header">
                <h5 class="card-title mb-0">Información del Proveedor</h5>
              </div>
              <div class="card-body">
                <p class="mb-1"><strong>{{ selectedSupplier.businessName }}</strong></p>
                <p class="mb-1 text-muted">{{ selectedSupplier.nit }}</p>
                <p class="mb-1">{{ selectedSupplier.contactPerson }}</p>
                <p class="mb-1">{{ selectedSupplier.phone }}</p>
                <p class="mb-0">{{ selectedSupplier.email }}</p>
              </div>
            </div>

            <!-- Notes -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="card-title mb-0">Notas y Términos</h5>
              </div>
              <div class="card-body">
                <div class="form-group mb-3">
                  <label class="form-label">Observaciones</label>
                  <textarea 
                    class="form-control" 
                    rows="3" 
                    v-model="order.notes"
                    placeholder="Observaciones adicionales..."
                  ></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Términos y Condiciones</label>
                  <textarea 
                    class="form-control" 
                    rows="3" 
                    v-model="order.terms"
                    placeholder="Términos especiales..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-outline-secondary" @click="$router.go(-1)">
            Cancelar
          </button>
          <button type="submit" class="btn btn-outline-primary" @click="order.status = 'Borrador'">
            <i class="fas fa-save"></i> Guardar Borrador
          </button>
          <button type="submit" class="btn btn-primary" @click="order.status = 'Enviada'">
            <i class="fas fa-paper-plane"></i> Guardar y Enviar
          </button>
        </div>
      </form>
    </div>
  </DashboardLayout>
</template>

<script>
import SupplierSelector from '../../components/purchases/SupplierSelector.vue'
import DashboardLayout from '../../components/DashboardLayout.vue'

export default {
  name: 'PurchaseOrderCreateView',
  components: {
    SupplierSelector,
    DashboardLayout
  },
  data() {
    return {
      order: {
        number: '',
        supplierId: null,
        status: 'Borrador',
        issueDate: new Date().toISOString().split('T')[0],
        deliveryDate: '',
        paymentTerms: '30 días',
        currency: 'COP',
        deliveryAddress: '',
        discount: 0,
        notes: '',
        terms: '',
        items: []
      },
      selectedSupplier: null,
      totals: {
        subtotal: 0,
        tax: 0,
        total: 0
      }
    }
  },
  computed: {
    isEditing() {
      return this.$route.params.id !== undefined
    }
  },
  mounted() {
    this.generateOrderNumber()
    if (this.isEditing) {
      this.loadPurchaseOrder()
    }
    
    // Check if supplier is pre-selected from query params
    const supplierId = this.$route.query.supplier
    if (supplierId) {
      this.order.supplierId = parseInt(supplierId)
      this.loadSupplierInfo(this.order.supplierId)
    }
  },
  methods: {
    generateOrderNumber() {
      const year = new Date().getFullYear()
      const sequence = String(Math.floor(Math.random() * 1000) + 1).padStart(3, '0')
      this.order.number = `OC-${year}-${sequence}`
    },
    loadPurchaseOrder() {
      // Simular carga de datos de la orden
      const orderId = this.$route.params.id
      console.log('Cargando orden:', orderId)
      
      // Datos de ejemplo
      this.order = {
        number: 'OC-2024-001',
        supplierId: 1,
        status: 'Borrador',
        issueDate: '2024-01-15',
        deliveryDate: '2024-01-25',
        paymentTerms: '30 días',
        currency: 'COP',
        deliveryAddress: 'Bodega Principal - Calle 123 #45-67',
        discount: 0,
        notes: 'Entrega en horario de oficina',
        terms: 'Garantía de 6 meses',
        items: [
          {
            code: 'PROD001',
            description: 'Producto de ejemplo 1',
            quantity: 10,
            unit: 'UND',
            unitCost: 50000,
            taxRate: 19,
            subtotal: 500000
          }
        ]
      }
      
      this.loadSupplierInfo(this.order.supplierId)
      this.calculateTotals()
    },
    loadSupplierInfo(supplierId) {
      // Simular carga de información del proveedor
      const suppliers = {
        1: {
          businessName: 'Proveedor ABC S.A.S.',
          nit: '900123456-1',
          contactPerson: 'Juan Pérez',
          phone: '(601) 234-5678',
          email: 'contacto@abc.com'
        },
        2: {
          businessName: 'Distribuidora XYZ Ltda.',
          nit: '800987654-2',
          contactPerson: 'María García',
          phone: '(602) 987-6543',
          email: 'ventas@xyz.com'
        }
      }
      
      this.selectedSupplier = suppliers[supplierId] || null
    },
    onSupplierSelected(supplier) {
      this.selectedSupplier = supplier
      this.loadSupplierInfo(supplier.id)
    },
    addItem() {
      this.order.items.push({
        code: '',
        description: '',
        quantity: 1,
        unit: 'UND',
        unitCost: 0,
        taxRate: 19,
        subtotal: 0
      })
    },
    removeItem(index) {
      this.order.items.splice(index, 1)
      this.calculateTotals()
    },
    calculateItemSubtotal(index) {
      const item = this.order.items[index]
      const quantity = parseFloat(item.quantity) || 0
      const unitCost = parseFloat(item.unitCost) || 0
      item.subtotal = quantity * unitCost
      this.calculateTotals()
    },
    calculateTotals() {
      this.totals.subtotal = this.order.items.reduce((sum, item) => sum + (item.subtotal || 0), 0)
      
      // Apply discount
      const discountAmount = this.totals.subtotal * (this.order.discount / 100)
      const subtotalAfterDiscount = this.totals.subtotal - discountAmount
      
      // Calculate tax
      this.totals.tax = this.order.items.reduce((sum, item) => {
        const itemSubtotal = (item.subtotal || 0) * (1 - this.order.discount / 100)
        const taxRate = parseFloat(item.taxRate) || 0
        return sum + (itemSubtotal * taxRate / 100)
      }, 0)
      
      this.totals.total = subtotalAfterDiscount + this.totals.tax
    },
    formatNumber(number) {
      return number.toLocaleString()
    },
    savePurchaseOrder() {
      // Validaciones básicas
      if (!this.order.supplierId) {
        alert('Por favor seleccione un proveedor')
        return
      }
      
      if (this.order.items.length === 0) {
        alert('Por favor agregue al menos un item')
        return
      }
      
      // Validar que todos los items tengan descripción y cantidad
      const invalidItems = this.order.items.some(item => !item.description || !item.quantity || item.quantity <= 0)
      if (invalidItems) {
        alert('Por favor complete todos los campos de los items')
        return
      }
      
      // Simular guardado
      console.log('Guardando orden de compra:', this.order)
      
      // Mostrar mensaje de éxito
      const action = this.order.status === 'Enviada' ? 'enviada' : 'guardada'
      alert(`Orden de compra ${action} exitosamente`)
      
      // Redirigir a la lista de órdenes
      this.$router.push('/purchases/orders')
    }
  },
  watch: {
    'order.discount'() {
      this.calculateTotals()
    }
  }
}
</script>
