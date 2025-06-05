<template>
  <DashboardLayout>
    <div class="container-fluid">
      <h1 class="h3 mb-4 text-gray-800">{{ isEditing ? 'Editar Comprobante Contable' : 'Nuevo Comprobante Contable' }}</h1>

      <div class="card shadow mb-4">
        <div class="card-body">
          <form @submit.prevent="saveJournalEntry">
            <!-- Encabezado del Comprobante -->
            <div class="row border-bottom pb-3 mb-3">
              <div class="col-md-3 mb-3">
                <label for="entryType" class="form-label">Tipo de Comprobante <span class="text-danger">*</span></label>
                <select class="form-select" id="entryType" v-model="entry.type" required>
                  <option value="CD">Comprobante de Diario</option>
                  <option value="CI">Comprobante de Ingreso</option>
                  <option value="CE">Comprobante de Egreso</option>
                  <option value="NC">Nota de Contabilidad</option>
                  <option value="CA">Comprobante de Apertura</option>
                  <option value="CC">Comprobante de Cierre</option>
                </select>
              </div>
              <div class="col-md-3 mb-3">
                <label for="entryNumber" class="form-label">Número <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="entryNumber" v-model="entry.number" required :placeholder="suggestedNumber">
              </div>
              <div class="col-md-3 mb-3">
                <label for="entryDate" class="form-label">Fecha <span class="text-danger">*</span></label>
                <input type="date" class="form-control" id="entryDate" v-model="entry.date" required>
              </div>
              <div class="col-md-3 mb-3">
                <label for="entryStatus" class="form-label">Estado</label>
                <input type="text" class="form-control" id="entryStatus" :value="entry.status" readonly>
              </div>
              <div class="col-md-12 mb-3">
                <label for="entryConcept" class="form-label">Concepto General <span class="text-danger">*</span></label>
                <textarea class="form-control" id="entryConcept" v-model="entry.concept" rows="2" required></textarea>
              </div>
            </div>

            <!-- Detalle de Movimientos (Asientos) -->
            <h5 class="mb-3">Movimientos Contables</h5>
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th style="width: 25%;">Cuenta Contable <span class="text-danger">*</span></th>
                    <th style="width: 20%;">Tercero</th>
                    <th style="width: 20%;">Centro de Costo</th>
                    <th>Concepto Movimiento</th>
                    <th style="width: 120px;">Débito <span class="text-danger">*</span></th>
                    <th style="width: 120px;">Crédito <span class="text-danger">*</span></th>
                    <th style="width: 50px;"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in entry.items" :key="index">
                    <td>
                      <AccountSelector v-model="item.accountId" @account-selected="val => handleAccountSelected(val, index)" />
                      <small v-if="item.accountName" class="d-block text-muted">{{ item.accountCode }} - {{ item.accountName }}</small>
                    </td>
                    <td>
                      <input type="text" class="form-control form-control-sm" v-model="item.thirdParty" :disabled="!item.requiresThirdParty" placeholder="NIT/Cédula">
                    </td>
                    <td>
                       <select class="form-select form-select-sm" v-model="item.costCenterId" :disabled="!item.requiresCostCenter">
                            <option :value="null">-- N/A --</option>
                            <option v-for="cc in costCenters" :key="cc.id" :value="cc.id">{{ cc.name }}</option>
                        </select>
                    </td>
                    <td><input type="text" class="form-control form-control-sm" v-model="item.concept"></td>
                    <td><input type="number" class="form-control form-control-sm text-end" v-model.number="item.debit" @input="calculateTotals" min="0" step="any"></td>
                    <td><input type="number" class="form-control form-control-sm text-end" v-model.number="item.credit" @input="calculateTotals" min="0" step="any"></td>
                    <td>
                      <button type="button" class="btn btn-danger btn-sm" @click="removeItem(index)" :disabled="entry.items.length <= 1">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="4" class="text-end fw-bold">Totales:</td>
                    <td class="text-end fw-bold">{{ formatCurrency(totalDebits) }}</td>
                    <td class="text-end fw-bold">{{ formatCurrency(totalCredits) }}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colspan="4" class="text-end fw-bold">Diferencia:</td>
                    <td colspan="2" :class="['text-end fw-bold', difference === 0 ? 'text-success' : 'text-danger']">
                      {{ formatCurrency(difference) }}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <button type="button" class="btn btn-outline-primary btn-sm mt-2" @click="addItem">
              <i class="bi bi-plus-circle"></i> Agregar Movimiento
            </button>

            <div class="mt-4">
              <button type="submit" class="btn btn-primary me-2" :disabled="difference !== 0 || entry.status === 'Anulado'">
                <i class="bi bi-save"></i> {{ isEditing ? 'Actualizar Comprobante' : 'Guardar Comprobante' }}
              </button>
              <button type="button" class="btn btn-success me-2" @click="saveAndPost" :disabled="difference !== 0 || entry.status === 'Anulado'">
                <i class="bi bi-check-circle"></i> Guardar y Contabilizar
              </button>
              <router-link to="/accounting/journal-entries" class="btn btn-secondary">
                <i class="bi bi-x-circle"></i> Cancelar
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DashboardLayout from '../../components/DashboardLayout.vue';
import AccountSelector from '../../components/accounting/AccountSelector.vue'; // Asegúrate que la ruta sea correcta

const route = useRoute();
const router = useRouter();
const isEditing = ref(false);
const entryId = ref(null);

const entry = ref({
  type: 'CD',
  number: '',
  date: new Date().toISOString().slice(0, 10),
  concept: '',
  status: 'Borrador',
  items: [{ accountId: null, accountCode: '', accountName: '', requiresThirdParty: false, requiresCostCenter: false, thirdParty: '', costCenterId: null, concept: '', debit: 0, credit: 0 }]
});

const suggestedNumber = ref(''); // Lógica para sugerir número (ej. CE-00124)
const totalDebits = ref(0);
const totalCredits = ref(0);

const costCenters = ref([ // Simulación, vendría de API/Store
    { id: 1, code: '001', name: 'Administración' },
    { id: 2, code: '002', name: 'Ventas Nacional' },
    { id: 3, code: '003', name: 'Producción A' },
]);

const difference = computed(() => totalDebits.value - totalCredits.value);

const calculateTotals = () => {
  totalDebits.value = entry.value.items.reduce((sum, item) => sum + (parseFloat(item.debit) || 0), 0);
  totalCredits.value = entry.value.items.reduce((sum, item) => sum + (parseFloat(item.credit) || 0), 0);
};

const handleAccountSelected = (selectedAccount, index) => {
    if (selectedAccount) {
        entry.value.items[index].accountId = selectedAccount.id;
        entry.value.items[index].accountCode = selectedAccount.code;
        entry.value.items[index].accountName = selectedAccount.name;
        entry.value.items[index].requiresThirdParty = selectedAccount.requiresThirdParty || false;
        entry.value.items[index].requiresCostCenter = selectedAccount.requiresCostCenter || false;
    } else {
        entry.value.items[index].accountId = null;
        entry.value.items[index].accountCode = '';
        entry.value.items[index].accountName = '';
        entry.value.items[index].requiresThirdParty = false;
        entry.value.items[index].requiresCostCenter = false;
    }
};


const addItem = () => {
  entry.value.items.push({ accountId: null, accountCode: '', accountName: '', requiresThirdParty: false, requiresCostCenter: false, thirdParty: '', costCenterId: null, concept: '', debit: 0, credit: 0 });
};

const removeItem = (index) => {
  if (entry.value.items.length > 1) {
    entry.value.items.splice(index, 1);
    calculateTotals();
  }
};

const formatCurrency = (value) => {
  return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 });
};

const saveJournalEntry = (post = false) => {
  if (difference.value !== 0) {
    alert('El comprobante está desbalanceado. Verifique los débitos y créditos.');
    return;
  }
  if (post) {
    entry.value.status = 'Contabilizado';
    console.log('Guardando y Contabilizando comprobante:', entry.value);
  } else {
    entry.value.status = 'Borrador';
    console.log('Guardando comprobante como borrador:', entry.value);
  }
  // Lógica de guardado (API/Store)
  router.push('/accounting/journal-entries');
};

const saveAndPost = () => {
  saveJournalEntry(true);
};

onMounted(() => {
  if (route.params.id) {
    isEditing.value = true;
    entryId.value = route.params.id;
    // Cargar datos del comprobante para edición (simulado)
    const existingEntry = { 
        id: 1, type: 'CE', number: 'CE-00123', date: '2024-05-28', concept: 'Pago nómina quincena Mayo/2024', status: 'Activo',
        items: [
            { accountId: 15, accountCode: '510506', accountName: 'Sueldos', requiresThirdParty: true, requiresCostCenter: true, thirdParty: '12345678', costCenterId: 1, concept: 'Nómina Mayo Q1', debit: 15000000, credit: 0 },
            { accountId: 5, accountCode: '1110', accountName: 'BANCOS', requiresThirdParty: false, requiresCostCenter: false, thirdParty: '', costCenterId: null, concept: 'Pago desde Bancolombia', debit: 0, credit: 15000000 }
        ]
    }; // Simulación
    if(existingEntry) {
        entry.value = JSON.parse(JSON.stringify(existingEntry)); // Deep copy
        calculateTotals();
    }
  } else {
    // Sugerir número para nuevo comprobante
    suggestedNumber.value = `${entry.value.type}-${String(Math.floor(Math.random() * 900) + 100).padStart(5, '0')}`;
    entry.value.number = suggestedNumber.value;
  }
});

watch(() => entry.value.items, calculateTotals, { deep: true });

</script>

<style scoped>
.table thead th {
  font-size: 0.85rem;
}
.form-control-sm, .form-select-sm {
    font-size: 0.8rem; /* Smaller inputs in table */
}
</style>
