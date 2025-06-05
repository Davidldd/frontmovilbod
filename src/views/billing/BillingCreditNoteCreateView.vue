<template>
  <DashboardLayout>
    <div class="container-fluid">
      <h1 class="h3 mb-4 text-gray-800">{{ isEditMode ? 'Editar Nota Crédito' : 'Crear Nueva Nota Crédito' }}</h1>

      <form @submit.prevent="saveCreditNote">
        <div class="card shadow mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Información General y Factura Afectada</h6>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="affectedInvoice" class="form-label">Buscar Factura Afectada (# Factura)</label>
                  <div class="input-group">
                    <input type="text" class="form-control" id="affectedInvoice" v-model="affectedInvoiceSearch" @input="searchAffectedInvoices" :disabled="isEditMode && creditNote.dianStatus !== 'draft'">
                     <button class="btn btn-outline-secondary" type="button" @click="clearAffectedInvoice" v-if="creditNote.affectedInvoice.id" :disabled="isEditMode && creditNote.dianStatus !== 'draft'"><i class="bi bi-x-lg"></i></button>
                  </div>
                   <ul v-if="searchedAffectedInvoices.length && affectedInvoiceSearch" class="list-group position-absolute w-100" style="z-index: 1000;">
                    <li v-for="inv in searchedAffectedInvoices" :key="inv.id" 
                        class="list-group-item list-group-item-action" 
                        @click="selectAffectedInvoice(inv)">
                      {{ inv.resolutionPrefix }}{{ inv.number }} - {{ inv.client.name }} ({{ formatCurrency(inv.total) }})
                    </li>
                  </ul>
                </div>
                <div v-if="creditNote.affectedInvoice.id">
                  <p><strong>Factura:</strong> {{ creditNote.affectedInvoice.resolutionPrefix }}{{ creditNote.affectedInvoice.number }}</p>
                  <p><strong>Cliente:</strong> {{ creditNote.affectedInvoice.client.name }} ({{ creditNote.affectedInvoice.client.nit }})</p>
                  <p><strong>Fecha Factura:</strong> {{ formatDate(creditNote.affectedInvoice.emissionDate) }}</p>
                  <p><strong>Total Factura:</strong> {{ formatCurrency(creditNote.affectedInvoice.total) }}</p>
                </div>
                <div v-else class="alert alert-info">Seleccione la factura que afecta esta nota crédito.</div>
              </div>
              <div class="col-md-6">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="cnResolution" class="form-label">Resolución Nota Crédito</label>
                        <select class="form-select" id="cnResolution" v-model="creditNote.resolutionId" required :disabled="isEditMode && creditNote.dianStatus !== 'draft'">
                            <option value="" disabled>Seleccione...</option>
                            <option v-for="res in ncResolutions" :key="res.id" :value="res.id">
                                {{ res.prefix }} ({{ res.numberFrom }} - {{ res.numberTo }})
                            </option>
                        </select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="cnNumber" class="form-label">Número Nota Crédito</label>
                        <input type="text" class="form-control" id="cnNumber" v-model="creditNote.number" readonly>
                        <small class="form-text text-muted" v-if="selectedCnResolution">Siguiente: {{ selectedCnResolution?.nextNumber }}</small>
                    </div>
                </div>
                <div class="mb-3">
                  <label for="cnEmissionDate" class="form-label">Fecha de Emisión Nota Crédito</label>
                  <input type="date" class="form-control" id="cnEmissionDate" v-model="creditNote.emissionDate" required :disabled="isEditMode && creditNote.dianStatus !== 'draft'">
                </div>
                <div class="mb-3">
                    <label for="reason" class="form-label">Motivo de la Nota Crédito (Código DIAN)</label>
                    <select class="form-select" id="reason" v-model="creditNote.reasonCode" required :disabled="isEditMode && creditNote.dianStatus !== 'draft'">
                        <option value="1">Devolución de parte de los bienes; no aceptación de partes del servicio</option>
                        <option value="2">Anulación de factura electrónica</option>
                        <option value="3">Rebaja o descuento parcial o total</option>
                        <option value="4">Ajuste de precio</option>
                        <option value="5">Otros</option>
                    </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Items de la Nota Crédito -->
        <div class="card shadow mb-4">
          <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary">Items a Afectar</h6>
             <div class="form-check">
                <input class="form-check-input" type="checkbox" v-model="isTotalAnnulment" id="totalAnnulmentCheck" :disabled="!creditNote.affectedInvoice.id || (isEditMode && creditNote.dianStatus !== 'draft')">
                <label class="form-check-label" for="totalAnnulmentCheck">
                    Anulación Total de Factura
                </label>
            </div>
            <button type="button" class="btn btn-success btn-sm" @click="addItemToCreditNote" :disabled="!creditNote.affectedInvoice.id || isTotalAnnulment || (isEditMode && creditNote.dianStatus !== 'draft')">
              <i class="bi bi-plus-circle me-1"></i> Agregar Item
            </button>
          </div>
          <div class="card-body">
            <div v-if="!creditNote.affectedInvoice.id" class="alert alert-warning">Seleccione una factura para ver/agregar items.</div>
            <div class="table-responsive" v-else>
              <table class="table">
                <thead>
                  <tr>
                    <th style="width: 30%;">Descripción (Item Factura)</th>
                    <th style="width: 10%;">Cant. Fact.</th>
                    <th style="width: 10%;">Cant. a Devolver</th>
                    <th style="width: 15%;">Precio Unit. (COP)</th>
                    <th style="width: 15%;">IVA (%)</th>
                    <th style="width: 15%;">Subtotal NC (COP)</th>
                    <th style="width: 5%;">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in creditNote.items" :key="item.originalItemId || index">
                    <td>
                      {{ item.description }}
                      <small v-if="item.originalItemId" class="d-block text-muted">Ref: {{ item.originalItemId }}</small>
                    </td>
                    <td>{{ item.originalQuantity }}</td>
                    <td><input type="number" class="form-control form-control-sm" v-model.number="item.quantity" :max="item.originalQuantity" min="0" step="any" @input="calculateCreditNoteTotals" required :disabled="isTotalAnnulment || (isEditMode && creditNote.dianStatus !== 'draft')"></td>
                    <td>{{ formatCurrency(item.unitPrice) }}</td>
                    <td>{{ (item.taxRate * 100).toFixed(0) }}%</td>
                    <td>{{ formatCurrency(item.subtotal) }}</td>
                    <td>
                      <button type="button" class="btn btn-danger btn-sm" @click="removeItemFromCreditNote(index)" :disabled="isTotalAnnulment || (isEditMode && creditNote.dianStatus !== 'draft')">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="creditNote.items.length === 0 && creditNote.affectedInvoice.id">
                        <td colspan="7" class="text-center fst-italic">Agregue items o seleccione anulación total.</td>
                    </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <!-- Totales y Notas -->
         <div class="row">
            <div class="col-md-7">
                <div class="card shadow mb-4">
                    <div class="card-header py-3">
                        <h6 class="m-0 font-weight-bold text-primary">Notas Adicionales (Nota Crédito)</h6>
                    </div>
                    <div class="card-body">
                        <textarea class="form-control" rows="4" v-model="creditNote.notes" placeholder="Observaciones sobre la nota crédito..." :disabled="isEditMode && creditNote.dianStatus !== 'draft'"></textarea>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="card shadow mb-4">
                  <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Totales Nota Crédito</h6>
                  </div>
                  <div class="card-body">
                    <table class="table">
                      <tbody>
                        <tr>
                          <td>Subtotal Bruto NC:</td>
                          <td class="text-end">{{ formatCurrency(cnTotals.grossSubtotal) }}</td>
                        </tr>
                        <tr>
                          <td>IVA Total NC:</td>
                          <td class="text-end">{{ formatCurrency(cnTotals.totalTax) }}</td>
                        </tr>
                        <tr class="fw-bold">
                          <td>TOTAL NOTA CRÉDITO:</td>
                          <td class="text-end h5">{{ formatCurrency(cnTotals.grandTotal) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
            </div>
        </div>

        <div class="text-end mb-4">
          <router-link to="/billing/credit-notes" class="btn btn-secondary me-2">Cancelar</router-link>
          <button type="submit" class="btn btn-primary" :disabled="creditNote.items.length === 0 || !creditNote.affectedInvoice.id || (isEditMode && creditNote.dianStatus !== 'draft')">
            <i class="bi bi-save me-1"></i> {{ isEditMode ? 'Actualizar Nota Crédito' : 'Guardar Nota Crédito' }}
          </button>
           <button v-if="!isEditMode || creditNote.dianStatus === 'draft'" type="button" class="btn btn-info ms-2" @click="saveAndSendCnToDian" :disabled="creditNote.items.length === 0 || !creditNote.affectedInvoice.id">
            <i class="bi bi-send me-1"></i> Guardar y Enviar a DIAN (Simulado)
          </button>
        </div>
      </form>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DashboardLayout from '../../components/DashboardLayout.vue';

const route = useRoute();
const router = useRouter();
const isEditMode = computed(() => !!route.params.id);

const creditNote = reactive({
  id: null,
  resolutionId: '',
  number: '',
  affectedInvoice: { id: null, number: '', resolutionPrefix: '', client: {}, items: [], total: 0, emissionDate: '' },
  emissionDate: new Date().toISOString().slice(0,10),
  reasonCode: '1', // Código DIAN para motivo
  items: [], // Items de la nota crédito
  notes: '',
  dianStatus: 'draft',
});

const affectedInvoiceSearch = ref('');
const searchedAffectedInvoices = ref([]);
// Simulación de facturas existentes que pueden ser afectadas
const existingInvoices = ref([
  { id: 'inv1', resolutionPrefix: 'FE', number: '00123', client: { id: 1, name: 'Empresa ABC SAS', nit: '900.123.456-1' }, emissionDate: '2024-05-20', total: 1500000, items: [{id: 'itemA', description: 'Servicio Consultoría', quantity: 10, unitPrice: 126050.42, taxRate: 0.19}, {id: 'itemB', description: 'Licencia Software', quantity: 1, unitPrice: 201680.67, taxRate: 0.19}] },
  { id: 'inv2', resolutionPrefix: 'FE', number: '00124', client: { id: 2, name: 'Cliente Ejemplo NIT', nit: '800.789.123-5' }, emissionDate: '2024-05-22', total: 850000, items: [{id: 'itemC', description: 'Producto X', quantity: 5, unitPrice: 142857.14, taxRate: 0.19}] },
]);

const ncResolutions = ref([ // Resoluciones para Notas Crédito
  { id: 'resNC1', prefix: 'NC', numberFrom: 1, numberTo: 5000, nextNumber: 12, active: true },
]);
const selectedCnResolution = computed(() => ncResolutions.value.find(r => r.id === creditNote.resolutionId));

watch(() => creditNote.resolutionId, (newVal) => {
    if (newVal && selectedCnResolution.value && (!isEditMode.value || creditNote.dianStatus === 'draft')) {
        creditNote.number = String(selectedCnResolution.value.nextNumber).padStart(3, '0');
    }
});

const isTotalAnnulment = ref(false);
watch(isTotalAnnulment, (isAnnul) => {
    if (isAnnul && creditNote.affectedInvoice.id) {
        creditNote.items = creditNote.affectedInvoice.items.map(item => ({
            originalItemId: item.id,
            description: item.description,
            originalQuantity: item.quantity,
            quantity: item.quantity, // Cantidad a devolver es la total
            unitPrice: item.unitPrice,
            taxRate: item.taxRate,
            subtotal: (item.quantity * item.unitPrice)
        }));
        creditNote.reasonCode = '2'; // Anulación de factura electrónica
    } else if (!isAnnul && creditNote.affectedInvoice.id) {
        // Si se desmarca, limpiar items o permitir selección manual
        // creditNote.items = []; // Opcional: limpiar items
        creditNote.reasonCode = '1'; // Devolución parcial por defecto
    }
    calculateCreditNoteTotals();
});

const searchAffectedInvoices = () => {
  if (affectedInvoiceSearch.value.length < 2) {
    searchedAffectedInvoices.value = [];
    return;
  }
  searchedAffectedInvoices.value = existingInvoices.value.filter(inv => 
    (inv.resolutionPrefix + inv.number).includes(affectedInvoiceSearch.value) || 
    inv.client.name.toLowerCase().includes(affectedInvoiceSearch.value.toLowerCase())
  ).filter(inv => inv.dianStatus !== 'annulled'); // No afectar facturas ya anuladas
};

const selectAffectedInvoice = (invoice) => {
  creditNote.affectedInvoice = { ...invoice };
  affectedInvoiceSearch.value = '';
  searchedAffectedInvoices.value = [];
  // Si se selecciona una factura y estaba marcado anulación total, recalcular
  if (isTotalAnnulment.value) {
      isTotalAnnulment.value = false; // Desmarcar para forzar recalculo si es necesario
      isTotalAnnulment.value = true; // Volver a marcar para que se ejecute el watch
  } else {
      creditNote.items = []; // Limpiar items si no es anulación total
  }
};

const clearAffectedInvoice = () => {
    creditNote.affectedInvoice = { id: null, number: '', resolutionPrefix: '', client: {}, items: [], total: 0, emissionDate: '' };
    creditNote.items = [];
    isTotalAnnulment.value = false;
    calculateCreditNoteTotals();
};

const addItemToCreditNote = () => {
  // Idealmente, aquí se mostraría un modal para seleccionar items de la factura afectada
  // Por simplicidad, agregamos un item genérico que el usuario debe completar
  if (creditNote.affectedInvoice.items && creditNote.affectedInvoice.items.length > 0) {
      const firstInvoiceItem = creditNote.affectedInvoice.items[0]; // Tomar como ejemplo
       creditNote.items.push({
        originalItemId: firstInvoiceItem.id, // Referencia al item original
        description: firstInvoiceItem.description,
        originalQuantity: firstInvoiceItem.quantity,
        quantity: 1, // Cantidad a devolver por defecto
        unitPrice: firstInvoiceItem.unitPrice,
        taxRate: firstInvoiceItem.taxRate,
        subtotal: 0
      });
  } else {
       creditNote.items.push({ description: '', originalQuantity: 0, quantity: 1, unitPrice: 0, taxRate: 0.19, subtotal: 0 });
  }
  calculateCreditNoteTotals();
};

const removeItemFromCreditNote = (index) => {
  creditNote.items.splice(index, 1);
  calculateCreditNoteTotals();
};

const calculateCreditNoteTotals = () => {
  creditNote.items.forEach(item => {
    item.subtotal = (item.quantity || 0) * (item.unitPrice || 0);
  });
};

const cnTotals = computed(() => {
  const grossSubtotal = creditNote.items.reduce((sum, item) => sum + item.subtotal, 0);
  const totalTax = creditNote.items.reduce((sum, item) => sum + (item.subtotal * (item.taxRate || 0)), 0);
  const grandTotal = grossSubtotal + totalTax;
  return { grossSubtotal, totalTax, grandTotal };
});

const formatCurrency = (value) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' }) : '-';

const saveCreditNote = (sendToDian = false) => {
  if (!creditNote.affectedInvoice.id) {
      alert("Por favor, seleccione la factura afectada.");
      return;
  }
  if (creditNote.items.length === 0) {
      alert("Por favor, agregue items a la nota crédito o marque anulación total.");
      return;
  }
   if (!creditNote.resolutionId) {
      alert("Por favor, seleccione una resolución para la nota crédito.");
      return;
  }

  const dataToSave = {
    ...creditNote,
    totals: cnTotals.value,
    cufe: sendToDian ? `SIMULATED_CUFE_NC_${Date.now()}` : null,
    dianStatus: sendToDian ? 'pending_validation' : creditNote.dianStatus,
  };

  if (isEditMode.value) {
    console.log('Actualizando Nota Crédito:', dataToSave);
  } else {
    dataToSave.id = Date.now(); // Simular ID
    console.log('Guardando Nueva Nota Crédito:', dataToSave);
    const resIdx = ncResolutions.value.findIndex(r => r.id === creditNote.resolutionId);
    if (resIdx > -1) ncResolutions.value[resIdx].nextNumber++;
  }
  
  alert(`Nota Crédito ${isEditMode.value ? 'actualizada' : 'guardada'} ${sendToDian ? 'y enviada a DIAN (simulado)' : ''} exitosamente!`);
  router.push('/billing/credit-notes');
};

const saveAndSendCnToDian = () => {
    saveCreditNote(true);
}

onMounted(() => {
  const invoiceIdFromQuery = route.query.invoiceId;
  if (invoiceIdFromQuery) {
      const foundInvoice = existingInvoices.value.find(inv => inv.id === invoiceIdFromQuery);
      if (foundInvoice) {
          selectAffectedInvoice(foundInvoice);
      }
  }

  if (isEditMode.value) {
    // Cargar datos de la nota crédito para edición (simulado)
    // const fetchedCreditNote = findCreditNoteInMockData(route.params.id);
    // if (fetchedCreditNote) Object.assign(creditNote, fetchedCreditNote);
  } else {
      const defaultResolution = ncResolutions.value.find(r => r.active);
      if (defaultResolution) {
          creditNote.resolutionId = defaultResolution.id;
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
.text-end { text-align: right !important; }
.h5 { font-size: 1.25rem; }
</style>
