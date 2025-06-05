<template>
  <DashboardLayout>
    <div class="container-fluid">
      <h1 class="h3 mb-4 text-gray-800">{{ isEditMode ? 'Editar Factura' : 'Crear Nueva Factura' }}</h1>

      <form @submit.prevent="saveInvoice">
        <div class="card shadow mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Información del Cliente y Factura</h6>
          </div>
          <div class="card-body">
            <div class="row">
              <!-- Datos del Cliente -->
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="clientSearch" class="form-label">Buscar Cliente (NIT o Nombre)</label>
                  <div class="input-group">
                    <input type="text" class="form-control" id="clientSearch" v-model="clientSearchTerm" @input="searchClients">
                    <button class="btn btn-outline-secondary" type="button" @click="showNewClientModal = true"><i class="bi bi-plus-lg"></i> Nuevo</button>
                  </div>
                  <ul v-if="searchedClients.length && clientSearchTerm" class="list-group position-absolute w-100" style="z-index: 1000;">
                    <li v-for="client in searchedClients" :key="client.id" 
                        class="list-group-item list-group-item-action" 
                        @click="selectClient(client)">
                      {{ client.name }} ({{ client.nit }})
                    </li>
                  </ul>
                </div>
                <div v-if="invoice.client.id">
                  <p><strong>Cliente:</strong> {{ invoice.client.name }}</p>
                  <p><strong>NIT/Cédula:</strong> {{ invoice.client.nit }}</p>
                  <p><strong>Dirección:</strong> {{ invoice.client.address }}</p>
                  <p><strong>Email:</strong> {{ invoice.client.email }}</p>
                </div>
                 <div v-else class="alert alert-info">Seleccione o cree un cliente.</div>
              </div>

              <!-- Datos de la Factura -->
              <div class="col-md-6">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="invoiceResolution" class="form-label">Resolución de Facturación</label>
                    <select class="form-select" id="invoiceResolution" v-model="invoice.resolutionId" required :disabled="isEditMode && invoice.dianStatus !== 'draft'">
                      <option value="" disabled>Seleccione...</option>
                      <option v-for="res in resolutions" :key="res.id" :value="res.id">
                        {{ res.prefix }} ({{ res.numberFrom }} - {{ res.numberTo }}) - {{ res.name }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="invoiceNumber" class="form-label">Número de Factura</label>
                    <input type="text" class="form-control" id="invoiceNumber" v-model="invoice.number" readonly>
                     <small class="form-text text-muted" v-if="selectedResolution">Siguiente disponible: {{ selectedResolution?.nextNumber }}</small>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="emissionDate" class="form-label">Fecha de Emisión</label>
                    <input type="date" class="form-control" id="emissionDate" v-model="invoice.emissionDate" required :disabled="isEditMode && invoice.dianStatus !== 'draft'">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="dueDate" class="form-label">Fecha de Vencimiento</label>
                    <input type="date" class="form-control" id="dueDate" v-model="invoice.dueDate" required :disabled="isEditMode && invoice.dianStatus !== 'draft'">
                  </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="paymentMethod" class="form-label">Forma de Pago</label>
                        <select class="form-select" id="paymentMethod" v-model="invoice.paymentForm" required :disabled="isEditMode && invoice.dianStatus !== 'draft'">
                            <option value="contado">Contado</option>
                            <option value="credito">Crédito</option>
                        </select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="paymentMeans" class="form-label">Medio de Pago</label>
                        <select class="form-select" id="paymentMeans" v-model="invoice.paymentMeans" required :disabled="isEditMode && invoice.dianStatus !== 'draft'">
                            <option value="10">Efectivo</option>
                            <option value="42">Transferencia bancaria</option>
                            <option value="48">Tarjeta de Crédito</option>
                            <option value="49">Tarjeta Débito</option>
                            <!-- Más opciones según catálogo DIAN -->
                        </select>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Items de la Factura -->
        <div class="card shadow mb-4">
          <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary">Productos / Servicios</h6>
            <button type="button" class="btn btn-success btn-sm" @click="addItem" :disabled="isEditMode && invoice.dianStatus !== 'draft'">
              <i class="bi bi-plus-circle me-1"></i> Agregar Item
            </button>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th style="width: 30%;">Descripción</th>
                    <th style="width: 10%;">Cantidad</th>
                    <th style="width: 15%;">Precio Unit. (COP)</th>
                    <th style="width: 15%;">IVA (%)</th>
                    <th style="width: 15%;">Subtotal (COP)</th>
                    <th style="width: 10%;">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in invoice.items" :key="index">
                    <td>
                      <input type="text" class="form-control form-control-sm" v-model="item.description" placeholder="Producto/Servicio" required :disabled="isEditMode && invoice.dianStatus !== 'draft'">
                      <!-- Podría ser un buscador de productos/servicios del catálogo -->
                    </td>
                    <td><input type="number" class="form-control form-control-sm" v-model.number="item.quantity" min="0.01" step="any" @input="calculateTotals" required :disabled="isEditMode && invoice.dianStatus !== 'draft'"></td>
                    <td><input type="number" class="form-control form-control-sm" v-model.number="item.unitPrice" min="0" step="any" @input="calculateTotals" required :disabled="isEditMode && invoice.dianStatus !== 'draft'"></td>
                    <td>
                      <select class="form-select form-select-sm" v-model.number="item.taxRate" @change="calculateTotals" :disabled="isEditMode && invoice.dianStatus !== 'draft'">
                        <option value="0">0%</option>
                        <option value="0.05">5%</option>
                        <option value="0.19">19%</option>
                        <!-- Más tasas si es necesario -->
                      </select>
                    </td>
                    <td>{{ formatCurrency(item.subtotal) }}</td>
                    <td>
                      <button type="button" class="btn btn-danger btn-sm" @click="removeItem(index)" :disabled="isEditMode && invoice.dianStatus !== 'draft'">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                   <tr v-if="invoice.items.length === 0">
                        <td colspan="6" class="text-center fst-italic">Agregue productos o servicios a la factura.</td>
                    </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <!-- Totales y Retenciones -->
        <div class="row">
            <div class="col-md-7">
                <div class="card shadow mb-4">
                    <div class="card-header py-3">
                        <h6 class="m-0 font-weight-bold text-primary">Notas Adicionales</h6>
                    </div>
                    <div class="card-body">
                        <textarea class="form-control" rows="4" v-model="invoice.notes" placeholder="Información adicional, términos y condiciones..." :disabled="isEditMode && invoice.dianStatus !== 'draft'"></textarea>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="card shadow mb-4">
                  <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Totales</h6>
                  </div>
                  <div class="card-body">
                    <table class="table">
                      <tbody>
                        <tr>
                          <td>Subtotal Bruto:</td>
                          <td class="text-end">{{ formatCurrency(totals.grossSubtotal) }}</td>
                        </tr>
                        <tr>
                          <td>Descuento Global (-):</td>
                           <td class="text-end">
                                <div class="input-group input-group-sm">
                                    <input type="number" class="form-control form-control-sm text-end" v-model.number="invoice.globalDiscount" min="0" @input="calculateTotals" :disabled="isEditMode && invoice.dianStatus !== 'draft'">
                                    <span class="input-group-text">COP</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                          <td>Subtotal Neto:</td>
                          <td class="text-end">{{ formatCurrency(totals.netSubtotal) }}</td>
                        </tr>
                        <tr>
                          <td>IVA Total:</td>
                          <td class="text-end">{{ formatCurrency(totals.totalTax) }}</td>
                        </tr>
                        <!-- Aquí irían las retenciones (ReteIVA, ReteICA, ReteFuente) -->
                        <tr class="fw-bold">
                          <td>TOTAL FACTURA:</td>
                          <td class="text-end h5">{{ formatCurrency(totals.grandTotal) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
            </div>
        </div>


        <div class="text-end mb-4">
          <router-link to="/billing/invoices" class="btn btn-secondary me-2">Cancelar</router-link>
          <button type="submit" class="btn btn-primary" :disabled="invoice.items.length === 0 || !invoice.client.id || (isEditMode && invoice.dianStatus !== 'draft')">
            <i class="bi bi-save me-1"></i> {{ isEditMode ? 'Actualizar Factura' : 'Guardar Factura' }}
          </button>
           <button v-if="!isEditMode || invoice.dianStatus === 'draft'" type="button" class="btn btn-info ms-2" @click="saveAndSendToDian" :disabled="invoice.items.length === 0 || !invoice.client.id">
            <i class="bi bi-send me-1"></i> Guardar y Enviar a DIAN (Simulado)
          </button>
        </div>
      </form>
    </div>

    <!-- New Client Modal -->
    <div class="modal fade" :class="{ 'show d-block': showNewClientModal }" tabindex="-1" @click.self="showNewClientModal = false">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Crear Nuevo Cliente</h5>
                    <button type="button" class="btn-close" @click="showNewClientModal = false"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="createNewClient">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Tipo de Identificación*</label>
                                <select class="form-select" v-model="newClient.identificationType" required>
                                    <option value="NIT">NIT</option>
                                    <option value="CC">Cédula de Ciudadanía</option>
                                    <option value="CE">Cédula de Extranjería</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Número de Identificación*</label>
                                <input type="text" class="form-control" v-model="newClient.nit" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Nombre o Razón Social*</label>
                            <input type="text" class="form-control" v-model="newClient.name" required>
                        </div>
                         <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Dirección*</label>
                                <input type="text" class="form-control" v-model="newClient.address" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Ciudad*</label>
                                <input type="text" class="form-control" v-model="newClient.city" required>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Email*</label>
                                <input type="email" class="form-control" v-model="newClient.email" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Teléfono</label>
                                <input type="tel" class="form-control" v-model="newClient.phone">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="showNewClientModal = false">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Guardar Cliente</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
     <div v-if="showNewClientModal" class="modal-backdrop fade show"></div>

  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DashboardLayout from '../../components/DashboardLayout.vue';

const route = useRoute();
const router = useRouter();
const isEditMode = computed(() => !!route.params.id);

const invoice = reactive({
  id: null,
  resolutionId: '',
  number: '', // Se autogenerará o cargará
  client: { id: null, name: '', nit: '', address: '', email: '' },
  emissionDate: new Date().toISOString().slice(0,10),
  dueDate: '',
  paymentForm: 'contado', // 'contado', 'credito'
  paymentMeans: '10', // Código DIAN para medio de pago
  items: [],
  globalDiscount: 0,
  notes: '',
  dianStatus: 'draft', // draft, pending_validation, accepted, rejected, annulled
  // Otros campos necesarios para la factura colombiana
});

const clientSearchTerm = ref('');
const searchedClients = ref([]);
const allClients = ref([ // Simulación de base de datos de clientes
  { id: 1, name: 'Empresa ABC SAS', nit: '900.123.456-1', address: 'Calle Falsa 123', email: 'contacto@empresaabc.com', city: 'Bogotá D.C.' },
  { id: 2, name: 'Cliente Ejemplo NIT', nit: '800.789.123-5', address: 'Av. Siempre Viva 742', email: 'cliente@ejemplo.com', city: 'Medellín' },
]);

const resolutions = ref([ // Simulación de resoluciones de facturación
  { id: 'res1', name: 'Fact. Electrónica Venta', prefix: 'FE', numberFrom: 1, numberTo: 10000, nextNumber: 127, active: true },
  { id: 'res2', name: 'Contingencia Facturador', prefix: 'FC', numberFrom: 1, numberTo: 500, nextNumber: 12, active: true },
]);
const selectedResolution = computed(() => resolutions.value.find(r => r.id === invoice.resolutionId));

watch(() => invoice.resolutionId, (newVal) => {
    if (newVal && selectedResolution.value && (!isEditMode.value || invoice.dianStatus === 'draft')) {
        invoice.number = String(selectedResolution.value.nextNumber).padStart(selectedResolution.value.prefix === 'FE' ? 5 : 3, '0'); // Ajustar padding según prefijo
    }
});

const showNewClientModal = ref(false);
const newClient = reactive({
    identificationType: 'NIT',
    nit: '',
    name: '',
    address: '',
    city: '',
    email: '',
    phone: ''
});

const searchClients = () => {
  if (clientSearchTerm.value.length < 2) {
    searchedClients.value = [];
    return;
  }
  searchedClients.value = allClients.value.filter(c => 
    c.name.toLowerCase().includes(clientSearchTerm.value.toLowerCase()) || 
    c.nit.includes(clientSearchTerm.value)
  );
};

const selectClient = (client) => {
  invoice.client = { ...client };
  clientSearchTerm.value = '';
  searchedClients.value = [];
};

const createNewClient = () => {
    // Simulación de creación de cliente
    const createdClient = { ...newClient, id: Date.now() }; // ID temporal
    allClients.value.push(createdClient);
    selectClient(createdClient);
    showNewClientModal.value = false;
    // Resetear formulario de nuevo cliente
    Object.assign(newClient, { identificationType: 'NIT', nit: '', name: '', address: '', city: '', email: '', phone: '' });
    alert('Cliente creado y seleccionado!');
};

const addItem = () => {
  invoice.items.push({ description: '', quantity: 1, unitPrice: 0, taxRate: 0.19, subtotal: 0 });
  calculateTotals();
};

const removeItem = (index) => {
  invoice.items.splice(index, 1);
  calculateTotals();
};

const calculateTotals = () => {
  invoice.items.forEach(item => {
    item.subtotal = (item.quantity || 0) * (item.unitPrice || 0);
  });
};

const totals = computed(() => {
  const grossSubtotal = invoice.items.reduce((sum, item) => sum + item.subtotal, 0);
  const discount = invoice.globalDiscount || 0;
  const netSubtotal = grossSubtotal - discount;
  const totalTax = invoice.items.reduce((sum, item) => sum + (item.subtotal * (item.taxRate || 0)), 0);
  // Aquí se calcularían retenciones si las hubiera
  const grandTotal = netSubtotal + totalTax;
  return { grossSubtotal, netSubtotal, totalTax, grandTotal };
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
};

const saveInvoice = (sendToDian = false) => {
  if (!invoice.client.id) {
      alert("Por favor, seleccione un cliente.");
      return;
  }
  if (invoice.items.length === 0) {
      alert("Por favor, agregue al menos un item a la factura.");
      return;
  }
  if (!invoice.resolutionId) {
      alert("Por favor, seleccione una resolución de facturación.");
      return;
  }

  // Simulación de guardado
  const dataToSave = {
    ...invoice,
    totals: totals.value,
    cufe: sendToDian ? `SIMULATED_CUFE_${Date.now()}` : null, // Simular CUFE si se envía a DIAN
    dianStatus: sendToDian ? 'pending_validation' : invoice.dianStatus, // Cambiar estado si se envía
  };

  if (isEditMode.value) {
    console.log('Actualizando factura:', dataToSave);
    // Lógica para actualizar en backend
  } else {
    dataToSave.id = Date.now(); // Simular ID
    console.log('Guardando nueva factura:', dataToSave);
    // Lógica para crear en backend
    // Actualizar el nextNumber de la resolución (simulado)
    const resIdx = resolutions.value.findIndex(r => r.id === invoice.resolutionId);
    if (resIdx > -1) resolutions.value[resIdx].nextNumber++;
  }
  
  alert(`Factura ${isEditMode.value ? 'actualizada' : 'guardada'} ${sendToDian ? 'y enviada a DIAN (simulado)' : ''} exitosamente!`);
  router.push('/billing/invoices');
};

const saveAndSendToDian = () => {
    saveInvoice(true);
}

onMounted(() => {
  if (isEditMode.value) {
    // Simular carga de datos de factura para edición
    const existingInvoiceId = route.params.id;
    // const fetchedInvoice = findInvoiceInMockData(existingInvoiceId); // Deberías tener una función para esto
    // if (fetchedInvoice) Object.assign(invoice, fetchedInvoice);
    // Por ahora, un ejemplo:
    if (existingInvoiceId === '1') { // Suponiendo que el ID 1 es la factura de Empresa ABC SAS
        Object.assign(invoice, {
            id: 1, resolutionId: 'res1', number: '00123', 
            client: { id: 1, name: 'Empresa ABC SAS', nit: '900.123.456-1', address: 'Calle Falsa 123', email: 'contacto@empresaabc.com' },
            emissionDate: '2024-05-20', dueDate: '2024-06-19', paymentForm: 'credito', paymentMeans: '42',
            items: [
                { description: 'Servicio de Consultoría', quantity: 10, unitPrice: 126050.42, taxRate: 0.19, subtotal: 1260504.20 },
                { description: 'Licencia Software XYZ', quantity: 1, unitPrice: 201680.67, taxRate: 0.19, subtotal: 201680.67 }
            ],
            globalDiscount: 0,
            notes: 'Pago a 30 días.',
            dianStatus: 'accepted', // Si ya fue aceptada, no se debería poder editar mucho
        });
        calculateTotals();
    }
  } else {
      // Si es nueva, y hay una resolución por defecto o la primera activa
      const defaultResolution = resolutions.value.find(r => r.active);
      if (defaultResolution) {
          invoice.resolutionId = defaultResolution.id;
      }
  }
});

</script>

<style scoped>
.position-absolute {
  top: 100%;
  left: 0;
  right: 0;
}
.list-group-item-action:hover {
  background-color: #f8f9fa;
}
.modal.show {
  background-color: rgba(0,0,0,0.5);
}
.text-end { text-align: right !important; }
.h5 { font-size: 1.25rem; }
</style>
