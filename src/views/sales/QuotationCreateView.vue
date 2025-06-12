<template>
    <DashboardLayout>
      <template #header>
        <div class="d-flex justify-content-between align-items-center">
          <h1 class="h3 mb-0">{{ isEditing ? 'Editar Cotización' : 'Nueva Cotización' }}</h1>
          <div>
            <router-link to="/sales/quotations" class="btn btn-outline-secondary me-2">
              <i class="bi bi-x-lg me-1"></i> Cancelar
            </router-link>
            <button type="button" class="btn btn-outline-primary me-2" @click="saveDraft">
              <i class="bi bi-file-earmark me-1"></i> Guardar borrador
            </button>
            <button type="button" class="btn btn-primary" @click="saveQuotation">
              <i class="bi bi-check-lg me-1"></i> Guardar y enviar
            </button>
          </div>
        </div>
      </template>
  
      <div class="row g-4">
        <div class="col-lg-8">
          <!-- Información del cliente -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white">
              <h5 class="mb-0">Información del cliente</h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="customer" class="form-label">Cliente <span class="text-danger">*</span></label>
                  <CustomerSelector 
                    v-model="quotation.customerId" 
                    @customer-selected="onCustomerSelected"
                    :class="{ 'is-invalid': errors.customerId }"
                  />
                  <div class="invalid-feedback" v-if="errors.customerId">{{ errors.customerId }}</div>
                </div>
                <div class="col-md-6">
                  <label for="contactPerson" class="form-label">Persona de contacto</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="contactPerson" 
                    v-model="quotation.contactPerson"
                  >
                </div>
                <div class="col-md-6">
                  <label for="customerEmail" class="form-label">Email</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="customerEmail" 
                    v-model="quotation.customerEmail"
                  >
                </div>
                <div class="col-md-6">
                  <label for="customerPhone" class="form-label">Teléfono</label>
                  <input 
                    type="tel" 
                    class="form-control" 
                    id="customerPhone" 
                    v-model="quotation.customerPhone"
                  >
                </div>
                <div class="col-12">
                  <label for="customerAddress" class="form-label">Dirección</label>
                  <textarea 
                    class="form-control" 
                    id="customerAddress" 
                    rows="2" 
                    v-model="quotation.customerAddress"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Detalles de la cotización -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white">
              <h5 class="mb-0">Detalles de la cotización</h5>
            </div>
            <div class="card-body">
              <div class="row g-3 mb-4">
                <div class="col-md-4">
                  <label for="number" class="form-label">Número de cotización</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="number" 
                    v-model="quotation.number" 
                    readonly
                  >
                </div>
                <div class="col-md-4">
                  <label for="date" class="form-label">Fecha <span class="text-danger">*</span></label>
                  <input 
                    type="date" 
                    class="form-control" 
                    id="date" 
                    v-model="quotation.date" 
                    :class="{ 'is-invalid': errors.date }"
                    required
                  >
                  <div class="invalid-feedback" v-if="errors.date">{{ errors.date }}</div>
                </div>
                <div class="col-md-4">
                  <label for="expirationDate" class="form-label">Fecha de vencimiento <span class="text-danger">*</span></label>
                  <input 
                    type="date" 
                    class="form-control" 
                    id="expirationDate" 
                    v-model="quotation.expirationDate" 
                    :class="{ 'is-invalid': errors.expirationDate }"
                    required
                  >
                  <div class="invalid-feedback" v-if="errors.expirationDate">{{ errors.expirationDate }}</div>
                </div>
                <div class="col-md-6">
                  <label for="reference" class="form-label">Referencia</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="reference" 
                    v-model="quotation.reference"
                    placeholder="Ej: Equipos de oficina"
                  >
                </div>
                <div class="col-md-6">
                  <label for="paymentTerms" class="form-label">Condiciones de pago</label>
                  <select class="form-select" id="paymentTerms" v-model="quotation.paymentTerms">
                    <option value="immediate">Pago inmediato</option>
                    <option value="15days">15 días</option>
                    <option value="30days">30 días</option>
                    <option value="60days">60 días</option>
                  </select>
                </div>
              </div>
  
              <!-- Productos -->
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="mb-0">Productos</h6>
                <button type="button" class="btn btn-sm btn-outline-primary" @click="addItem">
                  <i class="bi bi-plus-lg me-1"></i> Agregar producto
                </button>
              </div>
  
              <div class="table-responsive">
                <table class="table table-bordered">
                  <thead class="table-light">
                    <tr>
                      <th style="width: 25%">Producto</th>
                      <th style="width: 30%">Descripción</th>
                      <th style="width: 10%">Cantidad</th>
                      <th style="width: 15%">Precio unitario</th>
                      <th style="width: 15%">Total</th>
                      <th style="width: 5%"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in quotation.items" :key="index">
                      <td>
                        <input 
                          type="text" 
                          class="form-control form-control-sm" 
                          v-model="item.product" 
                          placeholder="Nombre del producto"
                          @blur="calculateItemTotal(index)"
                        >
                      </td>
                      <td>
                        <input 
                          type="text" 
                          class="form-control form-control-sm" 
                          v-model="item.description" 
                          placeholder="Descripción del producto"
                        >
                      </td>
                      <td>
                        <input 
                          type="number" 
                          class="form-control form-control-sm" 
                          v-model.number="item.quantity" 
                          min="1" 
                          @input="calculateItemTotal(index)"
                        >
                      </td>
                      <td>
                        <input 
                          type="number" 
                          class="form-control form-control-sm" 
                          v-model.number="item.unitPrice" 
                          min="0" 
                          step="0.01"
                          @input="calculateItemTotal(index)"
                        >
                      </td>
                      <td>
                        <input 
                          type="text" 
                          class="form-control form-control-sm" 
                          :value="formatCurrency(item.total)" 
                          readonly
                        >
                      </td>
                      <td>
                        <button 
                          type="button" 
                          class="btn btn-sm btn-outline-danger" 
                          @click="removeItem(index)"
                          :disabled="quotation.items.length === 1"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                    <tr v-if="quotation.items.length === 0">
                      <td colspan="6" class="text-center py-3">
                        <span class="text-muted">No hay productos agregados</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
  
              <!-- Totales -->
              <div class="row justify-content-end mt-4">
                <div class="col-md-4">
                  <table class="table table-sm">
                    <tbody>
                      <tr>
                        <td class="border-0"><strong>Subtotal:</strong></td>
                        <td class="border-0 text-end"><strong>{{ formatCurrency(quotation.subtotal) }}</strong></td>
                      </tr>
                      <tr>
                        <td class="border-0">
                          <div class="d-flex align-items-center">
                            <span class="me-2">IVA:</span>
                            <input 
                              type="number" 
                              class="form-control form-control-sm" 
                              style="width: 80px;" 
                              v-model.number="quotation.taxRate" 
                              min="0" 
                              max="100" 
                              step="0.1"
                              @input="calculateTotals"
                            >
                            <span class="ms-1">%</span>
                          </div>
                        </td>
                        <td class="border-0 text-end"><strong>{{ formatCurrency(quotation.tax) }}</strong></td>
                      </tr>
                      <tr class="table-primary">
                        <td><strong>Total:</strong></td>
                        <td class="text-end"><strong>{{ formatCurrency(quotation.total) }}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
  
              <!-- Notas -->
              <div class="mt-4">
                <label for="notes" class="form-label">Notas y condiciones</label>
                <textarea 
                  class="form-control" 
                  id="notes" 
                  rows="3" 
                  v-model="quotation.notes"
                  placeholder="Términos y condiciones, notas adicionales..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>
  
        <div class="col-lg-4">
          <!-- Resumen -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white">
              <h5 class="mb-0">Resumen</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label">Estado</label>
                <div>
                  <span :class="getStatusBadgeClass(quotation.status)">
                    {{ getStatusLabel(quotation.status) }}
                  </span>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Total de productos</label>
                <p class="mb-0">{{ quotation.items.length }} productos</p>
              </div>
              <div class="mb-3">
                <label class="form-label">Cantidad total</label>
                <p class="mb-0">{{ totalQuantity }} unidades</p>
              </div>
              <div class="mb-3">
                <label class="form-label">Valor total</label>
                <p class="mb-0 fs-5 fw-bold text-primary">{{ formatCurrency(quotation.total) }}</p>
              </div>
              <div class="mb-3">
                <label class="form-label">Días para vencimiento</label>
                <p class="mb-0" :class="getDaysToExpirationClass()">
                  {{ daysToExpiration }} días
                </p>
              </div>
            </div>
          </div>
  
          <!-- Acciones rápidas -->
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white">
              <h5 class="mb-0">Acciones rápidas</h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <button type="button" class="btn btn-outline-primary btn-sm" @click="previewQuotation">
                  <i class="bi bi-eye me-1"></i> Vista previa
                </button>
                <button type="button" class="btn btn-outline-secondary btn-sm" @click="duplicateQuotation">
                  <i class="bi bi-files me-1"></i> Duplicar cotización
                </button>
                <button type="button" class="btn btn-outline-info btn-sm" @click="loadTemplate">
                  <i class="bi bi-file-earmark-text me-1"></i> Cargar plantilla
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  </template>
  
  <script>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import DashboardLayout from '../../components/DashboardLayout.vue';
  import CustomerSelector from '../../components/sales/CustomerSelector.vue';
  
  export default {
    name: 'QuotationCreateView',
    components: {
      DashboardLayout,
      CustomerSelector
    },
    setup() {
      const route = useRoute();
      const router = useRouter();
      const quotationId = computed(() => route.params.id);
      const isEditing = computed(() => !!quotationId.value);
  
      const quotation = reactive({
        id: null,
        number: '',
        reference: '',
        date: new Date().toISOString().split('T')[0],
        expirationDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        customerId: null,
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerAddress: '',
        contactPerson: '',
        paymentTerms: '30days',
        status: 'draft',
        items: [
          {
            product: '',
            description: '',
            quantity: 1,
            unitPrice: 0,
            total: 0
          }
        ],
        subtotal: 0,
        taxRate: 19,
        tax: 0,
        total: 0,
        notes: ''
      });
  
      const errors = reactive({
        customerId: '',
        date: '',
        expirationDate: ''
      });
  
      const totalQuantity = computed(() => {
        return quotation.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      });
  
      const daysToExpiration = computed(() => {
        const today = new Date();
        const expDate = new Date(quotation.expirationDate);
        const diffTime = expDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      });
  
      const generateQuotationNumber = () => {
        const year = new Date().getFullYear();
        const number = Math.floor(Math.random() * 9999) + 1;
        return `COT-${year}-${String(number).padStart(4, '0')}`;
      };
  
      const onCustomerSelected = (customer) => {
        if (customer) {
          quotation.customerName = customer.name;
          quotation.customerEmail = customer.email;
          quotation.customerPhone = customer.phone;
          quotation.customerAddress = customer.address;
          quotation.contactPerson = customer.contactName;
        }
      };
  
      const addItem = () => {
        quotation.items.push({
          product: '',
          description: '',
          quantity: 1,
          unitPrice: 0,
          total: 0
        });
      };
  
      const removeItem = (index) => {
        if (quotation.items.length > 1) {
          quotation.items.splice(index, 1);
          calculateTotals();
        }
      };
  
      const calculateItemTotal = (index) => {
        const item = quotation.items[index];
        item.total = (item.quantity || 0) * (item.unitPrice || 0);
        calculateTotals();
      };
  
      const calculateTotals = () => {
        quotation.subtotal = quotation.items.reduce((sum, item) => sum + (item.total || 0), 0);
        quotation.tax = quotation.subtotal * (quotation.taxRate / 100);
        quotation.total = quotation.subtotal + quotation.tax;
      };
  
      const validateForm = () => {
        let isValid = true;
        
        // Resetear errores
        Object.keys(errors).forEach(key => {
          errors[key] = '';
        });
        
        if (!quotation.customerId) {
          errors.customerId = 'Debe seleccionar un cliente';
          isValid = false;
        }
        
        if (!quotation.date) {
          errors.date = 'La fecha es obligatoria';
          isValid = false;
        }
        
        if (!quotation.expirationDate) {
          errors.expirationDate = 'La fecha de vencimiento es obligatoria';
          isValid = false;
        } else if (new Date(quotation.expirationDate) <= new Date(quotation.date)) {
          errors.expirationDate = 'La fecha de vencimiento debe ser posterior a la fecha de cotización';
          isValid = false;
        }
        
        return isValid;
      };
  
      const saveDraft = () => {
        quotation.status = 'draft';
        saveQuotation(false);
      };
  
      const saveQuotation = (sendEmail = true) => {
        if (!validateForm()) {
          alert('Por favor, complete todos los campos obligatorios correctamente.');
          return;
        }
        
        if (quotation.items.length === 0 || quotation.items.every(item => !item.product)) {
          alert('Debe agregar al menos un producto a la cotización.');
          return;
        }
        
        // Generar número si es nueva cotización
        if (!quotation.number) {
          quotation.number = generateQuotationNumber();
        }
        
        if (sendEmail) {
          quotation.status = 'sent';
        }
        
        // Aquí iría la lógica para guardar la cotización
        console.log('Cotización guardada:', quotation);
        
        if (sendEmail) {
          alert(`Cotización ${quotation.number} guardada y enviada por email`);
        } else {
          alert(`Cotización ${quotation.number} guardada como borrador`);
        }
        
        // Redirigir a la lista de cotizaciones
        router.push('/sales/quotations');
      };
  
      const previewQuotation = () => {
        // Aquí se abriría una vista previa de la cotización
        alert('Abriendo vista previa de la cotización...');
      };
  
      const duplicateQuotation = () => {
        // Crear una copia de la cotización actual
        const newQuotation = { ...quotation };
        newQuotation.id = null;
        newQuotation.number = generateQuotationNumber();
        newQuotation.date = new Date().toISOString().split('T')[0];
        newQuotation.expirationDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        newQuotation.status = 'draft';
        
        alert('Cotización duplicada. Los datos se han copiado.');
      };
  
      const loadTemplate = () => {
        // Aquí se cargaría una plantilla predefinida
        alert('Funcionalidad de plantillas en desarrollo...');
      };
  
      const formatCurrency = (value) => {
        if (value === undefined || value === null) return '$0';
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
      };
  
      const getStatusLabel = (status) => {
        const labels = {
          draft: 'Borrador',
          sent: 'Enviada',
          approved: 'Aprobada',
          rejected: 'Rechazada',
          expired: 'Vencida'
        };
        return labels[status] || status;
      };
  
      const getStatusBadgeClass = (status) => {
        switch (status) {
          case 'draft': return 'badge bg-secondary';
          case 'sent': return 'badge bg-primary';
          case 'approved': return 'badge bg-success';
          case 'rejected': return 'badge bg-danger';
          case 'expired': return 'badge bg-warning text-dark';
          default: return 'badge bg-secondary';
        }
      };
  
      const getDaysToExpirationClass = () => {
        const days = daysToExpiration.value;
        if (days < 0) return 'text-danger';
        if (days <= 3) return 'text-warning';
        return 'text-success';
      };
  
      onMounted(() => {
        if (!quotation.number) {
          quotation.number = generateQuotationNumber();
        }
        
        if (isEditing.value) {
          // Aquí se cargarían los datos de la cotización existente
          console.log('Cargando cotización para editar:', quotationId.value);
        }
      });
  
      return {
        quotation,
        errors,
        isEditing,
        totalQuantity,
        daysToExpiration,
        onCustomerSelected,
        addItem,
        removeItem,
        calculateItemTotal,
        calculateTotals,
        saveDraft,
        saveQuotation,
        previewQuotation,
        duplicateQuotation,
        loadTemplate,
        formatCurrency,
        getStatusLabel,
        getStatusBadgeClass,
        getDaysToExpirationClass
      };
    }
  };
  </script>
  