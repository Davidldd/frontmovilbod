<template>
  <DashboardLayout>
    <div class="container-fluid">
      <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Comprobantes Contables</h1>
        <router-link to="/accounting/journal-entry/new" class="btn btn-primary btn-icon-split">
          <span class="icon text-white-50"><i class="bi bi-journal-plus"></i></span>
          <span class="text">Nuevo Comprobante</span>
        </router-link>
      </div>

      <div class="card shadow mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Listado de Comprobantes</h6>
        </div>
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-md-3">
              <input type="text" class="form-control" placeholder="Buscar por número o concepto..." v-model="filters.searchTerm">
            </div>
            <div class="col-md-3">
              <select class="form-select" v-model="filters.type">
                <option value="">Todos los Tipos</option>
                <option value="CI">Comprobante de Ingreso</option>
                <option value="CE">Comprobante de Egreso</option>
                <option value="CD">Comprobante de Diario</option>
                <option value="NC">Nota de Contabilidad</option>
              </select>
            </div>
            <div class="col-md-2">
              <input type="date" class="form-control" v-model="filters.startDate">
            </div>
            <div class="col-md-2">
              <input type="date" class="form-control" v-model="filters.endDate">
            </div>
            <div class="col-md-2">
              <button class="btn btn-info w-100" @click="applyFilters">Filtrar</button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-hover table-bordered" width="100%" cellspacing="0">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Número</th>
                  <th>Fecha</th>
                  <th>Concepto</th>
                  <th class="text-end">Débitos</th>
                  <th class="text-end">Créditos</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="entry in filteredEntries" :key="entry.id">
                  <td><span class="badge bg-secondary">{{ entry.type }}</span></td>
                  <td>{{ entry.number }}</td>
                  <td>{{ formatDate(entry.date) }}</td>
                  <td>{{ entry.concept }}</td>
                  <td class="text-end">{{ formatCurrency(entry.totalDebits) }}</td>
                  <td class="text-end">{{ formatCurrency(entry.totalCredits) }}</td>
                  <td>
                    <span :class="entry.status === 'Anulado' ? 'badge bg-danger' : 'badge bg-success'">
                      {{ entry.status }}
                    </span>
                  </td>
                  <td>
                    <router-link :to="`/accounting/journal-entry/${entry.id}/edit`" class="btn btn-sm btn-info me-1" title="Ver/Editar">
                      <i class="bi bi-pencil-square"></i>
                    </router-link>
                    <button class="btn btn-sm btn-warning me-1" @click="printEntry(entry.id)" title="Imprimir">
                      <i class="bi bi-printer"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" @click="voidEntry(entry.id)" title="Anular" :disabled="entry.status === 'Anulado'">
                      <i class="bi bi-journal-x"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredEntries.length === 0">
                    <td colspan="8" class="text-center">No se encontraron comprobantes con los filtros aplicados.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Paginación (Placeholder) -->
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import DashboardLayout from '../../components/DashboardLayout.vue';

const filters = ref({
  searchTerm: '',
  type: '',
  startDate: '',
  endDate: '',
});

const allEntries = ref([
  { id: 1, type: 'CE', number: 'CE-00123', date: '2024-05-28', concept: 'Pago nómina quincena Mayo/2024', totalDebits: 15000000, totalCredits: 15000000, status: 'Activo' },
  { id: 2, type: 'CI', number: 'CI-0088', date: '2024-05-27', concept: 'Abono Factura FV-1020 cliente XYZ SAS', totalDebits: 5200000, totalCredits: 5200000, status: 'Activo' },
  { id: 3, type: 'CD', number: 'CD-0150', date: '2024-05-26', concept: 'Compra papelería para la oficina según factura P-501', totalDebits: 350000, totalCredits: 350000, status: 'Activo' },
  { id: 4, type: 'CE', number: 'CE-00122', date: '2024-04-30', concept: 'Pago servicios públicos Abril/2024', totalDebits: 1250000, totalCredits: 1250000, status: 'Anulado' },
]);

const filteredEntries = computed(() => {
  let tempEntries = [...allEntries.value];
  if (filters.value.searchTerm) {
    const term = filters.value.searchTerm.toLowerCase();
    tempEntries = tempEntries.filter(e => e.number.toLowerCase().includes(term) || e.concept.toLowerCase().includes(term));
  }
  if (filters.value.type) {
    tempEntries = tempEntries.filter(e => e.type === filters.value.type);
  }
  if (filters.value.startDate) {
    tempEntries = tempEntries.filter(e => new Date(e.date) >= new Date(filters.value.startDate));
  }
  if (filters.value.endDate) {
    tempEntries = tempEntries.filter(e => new Date(e.date) <= new Date(filters.value.endDate));
  }
  return tempEntries;
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('es-CO', options);
};

const formatCurrency = (value) => {
  return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
};

const printEntry = (entryId) => {
  alert(`Imprimir comprobante ${entryId} (simulado)`);
};

const voidEntry = (entryId) => {
  if (confirm('¿Está seguro de que desea anular este comprobante? Se generará un comprobante de anulación.')) {
    const entry = allEntries.value.find(e => e.id === entryId);
    if (entry) {
      entry.status = 'Anulado';
      // Lógica para generar comprobante de anulación (simulado)
      alert(`Comprobante ${entry.number} anulado. Se generó comprobante de anulación (simulado).`);
    }
  }
};
</script>
