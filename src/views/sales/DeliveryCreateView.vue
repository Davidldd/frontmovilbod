<template>
    <DashboardLayout>
      <div class="container-fluid">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h3 mb-0">{{ isEditing ? 'Editar' : 'Nuevo' }} Despacho</h1>
            <p class="text-muted">{{ isEditing ? 'Modifica los datos del despacho' : 'Crea un nuevo despacho' }}</p>
          </div>
          <div>
            <router-link to="/sales/deliveries" class="btn btn-outline-secondary me-2">
              <i class="bi bi-arrow-left me-2"></i>Volver
            </router-link>
            <button class="btn btn-primary" @click="saveDelivery" :disabled="!isFormValid">
              <i class="bi bi-check-lg me-2"></i>{{ isEditing ? 'Actualizar' : 'Crear' }} Despacho
            </button>
          </div>
        </div>
  
        <form @submit.prevent="saveDelivery">
          <div class="row">
            <!-- Información General -->
            <div class="col-md-8">
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Información del Despacho</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Número de Despacho *</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="delivery.number"
                        :readonly="isEditing"
                        required
                      >
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Orden de Venta *</label>
                      <select 
                        class="form-select" 
                        v-model="delivery.order_id"
                        @change="onOrderSelected"
                        :disabled="isEditing"
                        required
                      >
                        <option value="">Seleccionar orden</option>
                        <option v-for="order in availableOrders" :key="order.id" :value="order.id">
                          {{ order.number }} - {{ order.customer.name }}
                        </option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Transportador *</label>
                      <select class="form-select" v-model="delivery.carrier" required>
                        <option value="">Seleccionar transportador</option>
                        <option value="Servientrega">Servientrega</option>
                        <option value="Coordinadora">Coordinadora</option>
                        <option value="TCC">TCC</option>
                        <option value="Interrapidisimo">Interrapidísimo</option>
                        <option value="Propio">Transporte Propio</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Número de Guía</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="delivery.tracking_number"
                        placeholder="Número de seguimiento"
                      >
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Fecha de Envío *</label>
                      <input 
                        type="date" 
                        class="form-control" 
                        v-model="delivery.ship_date"
                        required
                      >
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Fecha Estimada de Entrega *</label>
                      <input 
                        type="date" 
                        class="form-control" 
                        v-model="delivery.estimated_delivery"
                        :min="delivery.ship_date"
                        required
                      >
                    </div>
                    <div class="col-12">
                      <label class="form-label">Observaciones</label>
                      <textarea 
                        class="form-control" 
                        rows="3"
                        v-model="delivery.notes"
                        placeholder="Instrucciones especiales de entrega..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Dirección de Entrega -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Dirección de Entrega</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Contacto *</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="delivery.delivery_contact"
                        required
                      >
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Teléfono *</label>
                      <input 
                        type="tel" 
                        class="form-control" 
                        v-model="delivery.delivery_phone"
                        required
                      >
                    </div>
                    <div class="col-md-8">
                      <label class="form-label">Dirección *</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="delivery.delivery_address"
                        required
                      >
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Ciudad *</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="delivery.delivery_city"
                        required
                      >
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Departamento</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="delivery.delivery_state"
                      >
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Código Postal</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="delivery.delivery_postal_code"
                      >
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Items del Despacho -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Items del Despacho</h5>
                </div>
                <div class="card-body">
                  <div class="table-responsive" v-if="delivery.items.length > 0">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Cantidad Pedida</th>
                          <th>Cantidad a Despachar</th>
                          <th>Peso (kg)</th>
                          <th>Dimensiones</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in delivery.items" :key="index">
                          <td>
                            <strong>{{ item.product_name }}</strong>
                            <br>
                            <small class="text-muted">{{ item.product_code }}</small>
                          </td>
                          <td>{{ item.ordered_quantity }}</td>
                          <td>
                            <input 
                              type="number" 
                              class="form-control" 
                              v-model.number="item.delivery_quantity"
                              :max="item.ordered_quantity"
                              min="0"
                              required
                            >
                          </td>
                          <td>
                            <input 
                              type="number" 
                              class="form-control" 
                              v-model.number="item.weight"
                              min="0"
                              step="0.1"
                              placeholder="0.0"
                            >
                          </td>
                          <td>
                            <input 
                              type="text" 
                              class="form-control" 
                              v-model="item.dimensions"
                              placeholder="L x A x H"
                            >
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div v-else class="text-center py-4 text-muted">
                    <i class="bi bi-box fs-1"></i>
                    <p class="mt-2">Selecciona una orden para ver los items</p>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Panel Lateral -->
            <div class="col-md-4">
              <!-- Estado -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Estado del Despacho</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Estado</label>
                    <select class="form-select" v-model="delivery.status">
                      <option value="pending">Pendiente</option>
                      <option value="in_transit">En Tránsito</option>
                      <option value="delivered">Entregado</option>
                      <option value="returned">Devuelto</option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Prioridad</label>
                    <select class="form-select" v-model="delivery.priority">
                      <option value="low">Baja</option>
                      <option value="normal">Normal</option>
                      <option value="high">Alta</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>
                </div>
              </div>
  
              <!-- Información de la Orden -->
              <div class="card mb-4" v-if="selectedOrder">
                <div class="card-header">
                  <h5 class="mb-0">Información de la Orden</h5>
                </div>
                <div class="card-body">
                  <p class="mb-1"><strong>Número:</strong> {{ selectedOrder.number }}</p>
                  <p class="mb-1"><strong>Cliente:</strong> {{ selectedOrder.customer?.name }}</p>
                  <p class="mb-1"><strong>Fecha:</strong> {{ formatDate(selectedOrder.date) }}</p>
                  <p class="mb-1"><strong>Total:</strong> {{ formatCurrency(selectedOrder.total || 0) }}</p>
                  <p class="mb-0"><strong>Items:</strong> {{ selectedOrder.items?.length || 0 }}</p>
                </div>
              </div>
  
              <!-- Resumen de Peso y Dimensiones -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Resumen del Envío</h5>
                </div>
                <div class="card-body">
                  <div class="d-flex justify-content-between mb-2">
                    <span>Total Items:</span>
                    <strong>{{ totalItems }}</strong>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span>Peso Total:</span>
                    <strong>{{ totalWeight.toFixed(1) }} kg</strong>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span>Paquetes:</span>
                    <strong>{{ delivery.packages || 1 }}</strong>
                  </div>
                  <hr>
                  <div class="mb-3">
                    <label class="form-label">Número de Paquetes</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      v-model.number="delivery.packages"
                      min="1"
                    >
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Valor Declarado</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      v-model.number="delivery.declared_value"
                      min="0"
                      step="1000"
                    >
                  </div>
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
  
  export default {
    name: 'DeliveryCreateView',
    components: {
      DashboardLayout
    },
    data() {
      return {
        isEditing: false,
        delivery: {
          number: '',
          order_id: '',
          carrier: '',
          tracking_number: '',
          ship_date: new Date().toISOString().split('T')[0],
          estimated_delivery: '',
          status: 'pending',
          priority: 'normal',
          delivery_contact: '',
          delivery_phone: '',
          delivery_address: '',
          delivery_city: '',
          delivery_state: '',
          delivery_postal_code: '',
          notes: '',
          packages: 1,
          declared_value: 0,
          items: []
        },
        selectedOrder: null,
        availableOrders: [
          {
            id: 1,
            number: 'ORD-2024-001',
            customer: { name: 'Empresa ABC S.A.' },
            date: '2024-01-15',
            total: 1011500,
            items: [
              { 
                id: 1, 
                product_name: 'Producto A', 
                product_code: 'PROD-A001',
                ordered_quantity: 10,
                delivery_quantity: 10,
                weight: 0.5,
                dimensions: ''
              },
              { 
                id: 2, 
                product_name: 'Producto B', 
                product_code: 'PROD-B001',
                ordered_quantity: 5,
                delivery_quantity: 5,
                weight: 0.8,
                dimensions: ''
              }
            ]
          },
          {
            id: 2,
            number: 'ORD-2024-002',
            customer: { name: 'Comercial XYZ Ltda.' },
            date: '2024-01-16',
            total: 1428000,
            items: [
              { 
                id: 3, 
                product_name: 'Producto C', 
                product_code: 'PROD-C001',
                ordered_quantity: 15,
                delivery_quantity: 15,
                weight: 1.2,
                dimensions: ''
              }
            ]
          }
        ]
      }
    },
    computed: {
      isFormValid() {
        return this.delivery.number && 
               this.delivery.order_id && 
               this.delivery.carrier && 
               this.delivery.ship_date && 
               this.delivery.estimated_delivery &&
               this.delivery.delivery_contact &&
               this.delivery.delivery_phone &&
               this.delivery.delivery_address &&
               this.delivery.delivery_city &&
               this.delivery.items.length > 0
      },
      totalItems() {
        return this.delivery.items.reduce((sum, item) => sum + (item.delivery_quantity || 0), 0)
      },
      totalWeight() {
        return this.delivery.items.reduce((sum, item) => sum + ((item.weight || 0) * (item.delivery_quantity || 0)), 0)
      }
    },
    mounted() {
      this.generateDeliveryNumber()
      
      // Si hay un ID en la ruta, cargar el despacho para editar
      if (this.$route.params.id) {
        this.isEditing = true
        this.loadDelivery(this.$route.params.id)
      }
      
      // Si viene de una orden específica (query parameter)
      if (this.$route.query.order) {
        this.delivery.order_id = parseInt(this.$route.query.order)
        this.onOrderSelected()
      }
    },
    methods: {
      generateDeliveryNumber() {
        if (!this.isEditing) {
          const date = new Date()
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
          this.delivery.number = `DEL-${year}${month}${day}-${random}`
        }
      },
      loadDelivery(id) {
        // Simular carga de despacho existente
        const mockDelivery = {
          id: id,
          number: 'DEL-2024-001',
          order_id: 1,
          carrier: 'Servientrega',
          tracking_number: 'TRK123456789',
          ship_date: '2024-01-16',
          estimated_delivery: '2024-01-18',
          status: 'in_transit',
          priority: 'normal',
          delivery_contact: 'Juan Pérez',
          delivery_phone: '+57 300 123 4567',
          delivery_address: 'Calle 123 #45-67',
          delivery_city: 'Bogotá',
          delivery_state: 'Cundinamarca',
          delivery_postal_code: '110111',
          notes: 'Entrega en horario de oficina',
          packages: 1,
          declared_value: 1000000,
          items: [
            { 
              id: 1, 
              product_name: 'Producto A', 
              product_code: 'PROD-A001',
              ordered_quantity: 10,
              delivery_quantity: 10,
              weight: 0.5,
              dimensions: '20x15x10'
            }
          ]
        }
        
        this.delivery = { ...mockDelivery }
        this.onOrderSelected()
      },
      onOrderSelected() {
        const order = this.availableOrders.find(o => o.id == this.delivery.order_id)
        if (order) {
          this.selectedOrder = order
          
          // Si no es edición, copiar items de la orden
          if (!this.isEditing) {
            this.delivery.items = order.items.map(item => ({
              ...item,
              delivery_quantity: item.ordered_quantity,
              weight: item.weight || 0,
              dimensions: item.dimensions || ''
            }))
            
            // Copiar información del cliente si está disponible
            if (order.customer) {
              this.delivery.delivery_contact = order.customer.name
              // Aquí podrías cargar más datos del cliente desde una API
            }
          }
        }
      },
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
      saveDelivery() {
        if (!this.isFormValid) {
          alert('Por favor completa todos los campos requeridos')
          return
        }
  
        // Validar que al menos un item tenga cantidad > 0
        const hasItemsToDeliver = this.delivery.items.some(item => (item.delivery_quantity || 0) > 0)
        if (!hasItemsToDeliver) {
          alert('Debe especificar al menos un item para despachar')
          return
        }
  
        // Simular guardado
        console.log('Guardando despacho:', this.delivery)
        
        if (this.isEditing) {
          alert('Despacho actualizado exitosamente')
        } else {
          alert('Despacho creado exitosamente')
        }
        
        this.$router.push('/sales/deliveries')
      }
    }
  }
  </script>
  