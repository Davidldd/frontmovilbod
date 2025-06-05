<template>
  <DashboardLayout>
    <div class="container-fluid">
      <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Notas Crédito</h1>
        <router-link to="/billing/credit-note/new" class="btn btn-primary btn-icon-split">
          <span class="icon text-white-50"><i class="bi bi-file-earmark-minus"></i></span>
          <span class="text">Nueva Nota Crédito</span>
        </router-link>
      </div>

      <div class="card shadow mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Listado de Notas Crédito</h6>
        </div>
        <div class="card-body">
          <!-- Filtros (similares a los de facturas) -->
          <div class="row mb-3">
            <div class="col-md-3">
              <input type="text" class="form-control" placeholder="Buscar por # Nota o Cliente..." v-model="filters.searchTerm">
            </div>
            <div class="col-md-2">
              <select class="form-select" v-model="filters.status">
                <option value="">Todos los Estados</option>
                <option value="applied">Aplicada</option>
                <option value="pending">Pendiente</option>
                <option value="annulled">Anulada</option>
              </select>
            </div>
            <div class="col-md-2">
              <input type="date" class="form-control" v-model="filters.startDate">
            </div>
            <div class="col-md-2">
              <input type="date" class="form-control" v-model="filters.endDate">
            </div>
            <div class="col-md-3">
              <button class="btn btn-secondary me-2" @click="applyFilters">Aplicar</button>
              <button class="btn btn-outline-secondary" @click="resetFilters">Limpiar</button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-bordered table-hover" width="100%" cellspacing="0">
              <thead>
                <tr>
                  <th># Nota Crédito</th>
                  <th>Factura Afectada</th>
                  <th>Cliente</th>
                  <th>Fecha Emisión</th>
                  <th>Total (COP)</th>
                  <th>Estado DIAN</th>
                  <th>Estado Aplicación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cnote in filteredCreditNotes" :key="cnote.id">
                  <td>{{ cnote.prefix }}{{ cnote.number }}</td>
                  <td>{{ cnote.affectedInvoicePrefix }}{{ cnote.affectedInvoiceNumber }}</td>
                  <td>{{ cnote.clientName }}</td>
                  <td>{{ formatDate(cnote.emissionDate) }}</td>
                  <td class="text-end">{{ formatCurrency(cnote.total) }}</td>
                  <td><span :class="getDianStatusClass(cnote.dianStatus)">{{ getDianStatusText(cnote.dianStatus) }}</span></td>
                  <td><span :class="getApplicationStatusClass(cnote.applicationStatus)">{{ getApplicationStatusText(cnote.applicationStatus) }}</span></td>
                  <td>
                    <router-link :to="`/billing/credit-note/${cnote.id}`" class="btn btn-sm btn-info me-1" title="Ver Detalle">
                      <i class="bi bi-eye"></i>
                    </router-link>
                     <button class="btn btn-sm btn-danger me-1" title="Anular Nota Crédito" @click="annulCreditNote(cnote)" :disabled="cnote.dianStatus === 'annulled' || cnote.applicationStatus === 'annulled'">
                      <i class="bi bi-x-circle"></i>
                    </button>
                    <div class="dropdown d-inline-block">
                        <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" @click.prevent="downloadPdf(cnote.id)"><i class="bi bi-file-earmark-pdf me-2"></i>Descargar PDF</a></li>
                            <li><a class="dropdown-item" href="#" @click.prevent="downloadXml(cnote.id)"><i class="bi bi-filetype-xml me-2"></i>Descargar XML</a></li>
                        </ul>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredCreditNotes.length === 0">
                    <td colspan="8" class="text-center">No se encontraron notas crédito.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Paginación -->
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import DashboardLayout from '../../components/DashboardLayout.vue';

const creditNotes = ref([
  { id: 1, prefix: 'NC', number: '0010', affectedInvoicePrefix: 'FE', affectedInvoiceNumber: '00120', clientName: 'Servicios Digitales Co', emissionDate: '2024-03-15', total: 750000, dianStatus: 'accepted', applicationStatus: 'applied' },
  { id: 2, prefix: 'NC', number: '0011', affectedInvoicePrefix: 'FE', affectedInvoiceNumber: '00123', clientName: 'Empresa ABC SAS', emissionDate: '2024-05-25', total: 250000, dianStatus: 'pending_validation', applicationStatus: 'pending' },
]);

const filters = ref({
  searchTerm: '',
  status: '',
  startDate: '',
  endDate: '',
});

const filteredCreditNotes = computed(() => {
  return creditNotes.value.filter(cnote => {
    const searchTermMatch = filters.value.searchTerm ? 
      (cnote.number.includes(filters.value.searchTerm) || cnote.clientName.toLowerCase().includes(filters.value.searchTerm.toLowerCase()) || cnote.affectedInvoiceNumber.includes(filters.value.searchTerm)) 
      : true;
    const statusMatch = filters.value.status ? cnote.applicationStatus === filters.value.status : true;
    // Fechas (simplificado, se puede mejorar)
    const dateMatch = (filters.value.startDate ? new Date(cnote.emissionDate) >= new Date(filters.value.startDate) : true) &&
                      (filters.value.endDate ? new Date(cnote.emissionDate) <= new Date(filters.value.endDate) : true);
    return searchTermMatch && statusMatch && dateMatch;
  });
});

const applyFilters = () => console.log("Filtros NC aplicados:", filters.value);
const resetFilters = () => {
  filters.value = { searchTerm: '', status: '', startDate: '', endDate: '' };
};

const formatCurrency = (value) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });

const getDianStatusClass = (status) => ({
  accepted: 'badge bg-success-soft text-success',
  pending_validation: 'badge bg-info-soft text-info',
  rejected: 'badge bg-danger-soft text-danger',
  annulled: 'badge bg-secondary-soft text-secondary',
}[status] || 'badge bg-light text-dark');

const getDianStatusText = (status) => ({
  accepted: 'Aceptada DIAN',
  pending_validation: 'Pendiente Validación',
  rejected: 'Rechazada DIAN',
  annulled: 'Anulada DIAN',
}[status] || 'Desconocido');

const getApplicationStatusClass = (status) => ({
  applied: 'badge bg-success-soft text-success',
  pending: 'badge bg-warning-soft text-warning',
  annulled: 'badge bg-secondary-soft text-secondary',
}[status] || 'badge bg-light text-dark');

const getApplicationStatusText = (status) => ({
  applied: 'Aplicada',
  pending: 'Pendiente Aplicación',
  annulled: 'Anulada',
}[status] || 'Desconocido');

const annulCreditNote = (cnote) => {
    if (confirm(`¿Está seguro de que desea anular la Nota Crédito ${cnote.prefix}${cnote.number}?`)) {
        console.log("Anulando Nota Crédito:", cnote.id);
        const cnoteIndex = creditNotes.value.findIndex(n => n.id === cnote.id);
        if (cnoteIndex !== -1) {
            creditNotes.value[cnoteIndex].dianStatus = 'annulled';
            creditNotes.value[cnoteIndex].applicationStatus = 'annulled';
        }
        alert('Nota Crédito anulada exitosamente!');
    }
};

const downloadPdf = (id) => alert(`Descargando PDF para Nota Crédito ${id}`);
const downloadXml = (id) => alert(`Descargando XML para Nota Crédito ${id}`);

</script>
<style scoped>
.bg-success-soft { background-color: rgba(28, 200, 138, 0.1); }
.bg-warning-soft { background-color: rgba(246, 194, 62, 0.1); }
.bg-danger-soft { background-color: rgba(231, 74, 59, 0.1); }
.bg-info-soft { background-color: rgba(54, 185, 204, 0.1); }
.bg-secondary-soft { background-color: rgba(134, 142, 150, 0.1); }
.text-end { text-align: right !important; }
</style>
