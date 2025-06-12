<template>
    <DashboardLayout>
      <div class="container-fluid">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h3 mb-0">{{ isEditing ? 'Editar' : 'Nueva' }} Orden de Venta</h1>
            <p class="text-muted">{{ isEditing ? 'Modifica los datos de la orden' : 'Crea una nueva orden de venta' }}</p>
          </div>
          <div>
            <router-link to="/sales/orders" class="btn btn-outline-secondary me-2">
              <i class="bi bi-arrow-left me-2"></i>Volver
            </router-link>
            <button class="btn btn-primary" @click="saveOrder" :disabled="!isFormValid">
              <i class="bi bi-check-lg me-2"></i>{{ isEditing ? 'Actualizar' : 'Crear' }} Orden
            </button>
          </div>
        </div>
  
        <form @submit.prevent="saveOrder">
          <div class="row">
            <!-- Información General -->
            <div class="col-md-8">
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Información General</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Número de Orden *</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="order.number"
                        :readonly="isEditing"
                        required
                      >
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Referencia</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="order.reference"
                        placeholder="Referencia interna"
                      >
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Cliente *</label>
                      <CustomerSelector 
                        v-model="order.customer_id"
                        @customer-selected="onCustomerSelected"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Vendedor *</label>
                      <select class="form-select" v-model="order.salesperson" required>
                        <option value="">Seleccionar vendedor</option>
                        <option value="Juan Pérez">Juan Pérez</option>
                        <option value="María García">María García</option>
                        <option value="Carlos López">Carlos López</option>
                        <option value="Ana Rodríguez">Ana Rodríguez</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Fecha de Orden *</label>
                      <input 
                        type="date" 
                        class="form-control" 
                        v-model="order.date"
                        required
                      >
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Fecha de Entrega *</label>
                      <input 
                        type="date" 
                        class="form-control" 
                        v-model="order.delivery_date"
                        :min="order.date"
                        required
                      >
                    </div>
                    <div class="col-12">
                      <label class="form-label">Observaciones</label>
                      <textarea 
                        class="form-control" 
                        rows="3"
                        v-model="order.notes"
                        placeholder="Observaciones adicionales..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Items de la Orden -->
              <div class="card mb-4">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h5 class="mb-0">Items de la Orden</h5>
                  <button type="button" class="btn btn-sm btn-primary" @click="addItem">
                    <i class="bi bi-plus-lg me-1"></i>Agregar Item
                  </button>
                </div>
                <div class="card-body">
                  <div class="table-responsive">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Descripción</th>
                          <th>Cantidad</th>
                          <th>Precio</th>
                          <th>Total</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in order.items" :key="index">
                          <td>
                            <select 
                              class="form-select" 
                              v-model="item.product_id"
                              @change="onProductSelected(item, index)"
                              required
                            >
                              <option value="">Seleccionar producto</option>
                              <option v-for="product in products" :key="product.id" :value="product.id">
                                {{ product.name }}
                              </option>
                            </select>
                          </td>
                          <td>
                            <input 
                              type="text" 
                              class="form-control" 
                              v-model="item.description"
                              placeholder="Descripción adicional"
                            >
                          </td>
                          <td>
                            <input 
                              type="number" 
                              class="form-control" 
                              v-model.number="item.quantity"
                              @input="calculateItemTotal(item)"
                              min="1"
                              required
                            >
                          </td>
                          <td>
                            <input 
                              type="number" 
                              class="form-control" 
                              v-model.number="item.price"
                              @input="calculateItemTotal(item)"
                              min="0"
                              step="0.01"
                              required
                            >
                          </td>
                          <td>
                            <strong>{{ formatCurrency(item.total || 0) }}</strong>
                          </td>
                          <td>
                            <button 
                              type="button" 
                              class="btn btn-sm btn-outline-danger"
                              @click="removeItem(index)"
                            >
                              <i class="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div v-if="order.items.length === 0" class="text-center py-4 text-muted">
                    <i class="bi bi-cart-x fs-1"></i>
                    <p class="mt-2">No hay items en la orden</p>
                    <button type="button" class="btn btn-primary" @click="addItem">
                      Agregar primer item
                    </button>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Resumen y Totales -->
            <div class="col-md-4">
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Estado</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Estado de la Orden</label>
                    <select class="form-select" v-model="order.status">
                      <option value="draft">Borrador</option>
                      <option value="confirmed">Confirmada</option>
                      <option value="in_progress">En Proceso</option>
                      <option value="delivered">Entregada</option>
                      <option value="cancelled">Cancelada</option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Prioridad</label>
                    <select class="form-select" v-model="order.priority">
                      <option value="low">Baja</option>
                      <option value="normal">Normal</option>
                      <option value="high">Alta</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>
                </div>
              </div>
  
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Totales</h5>
                </div>
                <div class="card-body">
                  <div class="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <strong>{{ formatCurrency(order.subtotal || 0) }}</strong>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span>Descuento:</span>
                    <div class="input-group input-group-sm">
                      <input 
                        type="number" 
                        class="form-control" 
                        v-model.number="order.discount_percentage"
                        @input="calculateTotals"
                        min="0" 
                        max="100"
                        step="0.01"
                      >
                      <span class="input-group-text">%</span>
                    </div>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span>Descuento:</span>
                    <strong class="text-danger">-{{ formatCurrency(order.discount || 0) }}</strong>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span>IVA (19%):</span>
                    <strong>{{ formatCurrency(order.tax || 0) }}</strong>
                  </div>
                  <hr>
                  <div class="d-flex justify-content-between">
                    <span class="h5">Total:</span>
                    <strong class="h5 text-primary">{{ formatCurrency(order.total || 0) }}</strong>
                  </div>
                </div>
              </div>
  
              <!-- Información del Cliente -->
              <div class="card" v-if="selectedCustomer">
                <div class="card-header">
                  <h5 class="mb-0">Información del Cliente</h5>
                </div>
                <div class="card-body">
                  <p class="mb-1"><strong>{{ selectedCustomer.name }}</strong></p>
                  <p class="mb-1 text-muted">{{ selectedCustomer.email }}</p>
                  <p class="mb-1 text-muted">{{ selectedCustomer.phone }}</p>
                  <p class="mb-0 text-muted">{{ selectedCustomer.address }}</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  </template>
  
  <script>
  import DashboardLayout from '../../components/DashboardLayout.vue'
  import CustomerSelector from '../../components/sales/CustomerSelector.vue'
  
  export default {
    name: 'SalesOrderCreateView',
    components: {
      DashboardLayout,
      CustomerSelector
    },
    data() {
      return {
        isEditing: false,
        order: {
          number: '',
          reference: '',
          customer_id: '',
          salesperson: '',
          date: new Date().toISOString().split('T')[0],
          delivery_date: '',
          status: 'draft',
          priority: 'normal',
          notes: '',
          items: [],
          subtotal: 0,
          discount_percentage: 0,
          discount: 0,
          tax: 0,
          total: 0
        },
        selectedCustomer: null,
        products: [
          { id: 1, name: 'Producto A', price: 50000 },
          { id: 2, name: 'Producto B', price: 70000 },
          { id: 3, name: 'Producto C', price: 80000 },
          { id: 4, name: 'Producto D', price: 45000 },
          { id: 5, name: 'Producto E', price: 55000 }
        ]
      }
    },
    computed: {
      isFormValid() {
        return this.order.number && 
               this.order.customer_id && 
               this.order.salesperson && 
               this.order.date && 
               this.order.delivery_date &&
               this.order.items.length > 0 &&
               this.order.items.every(item => item.product_id && item.quantity && item.price)
      }
    },
    mounted() {
      this.generateOrderNumber()
      
      // Si hay un ID en la ruta, cargar la orden para editar
      if (this.$route.params.id) {
        this.isEditing = true
        this.loadOrder(this.$route.params.id)
      }
    },
    methods: {
      generateOrderNumber() {
        if (!this.isEditing) {
          const date = new Date()
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
          this.order.number = `ORD-${year}${month}${day}-${random}`
        }
      },
      loadOrder(id) {
        // Simular carga de orden existente
        const mockOrder = {
          id: id,
          number: 'ORD-2024-001',
          reference: 'Pedido Enero',
          customer_id: 1,
          salesperson: 'Juan Pérez',
          date: '2024-01-15',
          delivery_date: '2024-01-25',
          status: 'confirmed',
          priority: 'normal',
          notes: 'Pedido urgente',
          items: [
            { 
              product_id: 1, 
              product_name: 'Producto A',
              description: '',
              quantity: 10, 
              price: 50000,
              total: 500000
            }
          ],
          subtotal: 500000,
          discount_percentage: 0,
          discount: 0,
          tax: 95000,
          total: 595000
        }
        
        this.order = { ...mockOrder }
      },
      onCustomerSelected(customer) {
        this.selectedCustomer = customer
      },
      onProductSelected(item, index) {
        const product = this.products.find(p => p.id == item.product_id)
        if (product) {
          item.product_name = product.name
          item.price = product.price
          this.calculateItemTotal(item)
        }
      },
      addItem() {
        this.order.items.push({
          product_id: '',
          product_name: '',
          description: '',
          quantity: 1,
          price: 0,
          total: 0
        })
      },
      removeItem(index) {
        this.order.items.splice(index, 1)
        this.calculateTotals()
      },
      calculateItemTotal(item) {
        item.total = (item.quantity || 0) * (item.price || 0)
        this.calculateTotals()
      },
      calculateTotals() {
        // Calcular subtotal
        this.order.subtotal = this.order.items.reduce((sum, item) => sum + (item.total || 0), 0)
        
        // Calcular descuento
        this.order.discount = this.order.subtotal * (this.order.discount_percentage || 0) / 100
        
        // Calcular base gravable
        const taxableAmount = this.order.subtotal - this.order.discount
        
        // Calcular IVA (19%)
        this.order.tax = taxableAmount * 0.19
        
        // Calcular total
        this.order.total = taxableAmount + this.order.tax
      },
      formatCurrency(amount) {
        if (amount == null || amount === undefined) return '$0'
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0
        }).format(amount)
      },
      saveOrder() {
        if (!this.isFormValid) {
          alert('Por favor completa todos los campos requeridos')
          return
        }
  
        // Simular guardado
        console.log('Guardando orden:', this.order)
        
        if (this.isEditing) {
          alert('Orden actualizada exitosamente')
        } else {
          alert('Orden creada exitosamente')
        }
        
        this.$router.push('/sales/orders')
      }
    }
  }
  </script>
  