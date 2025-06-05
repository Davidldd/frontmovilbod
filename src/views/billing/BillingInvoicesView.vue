<template>
  <DashboardLayout>
    <div class="container-fluid">
      <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Gestión de Facturas</h1>
        <router-link to="/billing/invoices/new" class="btn btn-primary btn-icon-split">
          <span class="icon text-white-50"><i class="bi bi-plus-circle"></i></span>
          <span class="text">Nueva Factura</span>
        </router-link>
      </div>

      <div class="card shadow mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Listado de Facturas</h6>
        </div>
        <div class="card-body">
          <!-- Filtros -->
          <div class="row mb-3">
            <div class="col-md-3">
              <input type="text" class="form-control" placeholder="Buscar por # Factura o Cliente..." v-model="filters.searchTerm">
            </div>
            <div class="col-md-2">
              <select class="form-select" v-model="filters.status">
                <option value="">Todos los Estados</option>
                <option value="pending">Pendiente</option>
                <option value="paid">Pagada</option>
                <option value="overdue">Vencida</option>
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
              <button class="btn btn-secondary me-2" @click="applyFilters">Aplicar Filtros</button>
              <button class="btn btn-outline-secondary" @click="resetFilters">Limpiar</button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-bordered table-hover" id="dataTable" width="100%" cellspacing="0">
              <thead>
                <tr>
                  <th># Factura</th>
                  <th>Cliente</th>
                  <th>Fecha Emisión</th>
                  <th>Fecha Vencimiento</th>
                  <th>Total (COP)</th>
                  <th>Saldo (COP)</th>
                  <th>Estado DIAN</th>
                  <th>Estado Pago</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="invoice in filteredInvoices" :key="invoice.id">
                  <td>{{ invoice.resolutionPrefix }}{{ invoice.number }}</td>
                  <td>{{ invoice.client.name }} <br><small class="text-muted">{{ invoice.client.nit }}</small></td>
                  <td>{{ formatDate(invoice.emissionDate) }}</td>
                  <td>{{ formatDate(invoice.dueDate) }}</td>
                  <td class="text-end">{{ formatCurrency(invoice.total) }}</td>
                  <td class="text-end">{{ formatCurrency(invoice.balance) }}</td>
                  <td><span :class="getDianStatusClass(invoice.dianStatus)">{{ getDianStatusText(invoice.dianStatus) }}</span></td>
                  <td><span :class="getPaymentStatusClass(invoice.paymentStatus)">{{ getPaymentStatusText(invoice.paymentStatus) }}</span></td>
                  <td>
                    <router-link :to="`/billing/invoices/${invoice.id}`" class="btn btn-sm btn-info me-1" title="Ver Detalle">
                      <i class="bi bi-eye"></i>
                    </router-link>
                    <button class="btn btn-sm btn-warning me-1" title="Registrar Pago" @click="openPaymentModal(invoice)" :disabled="invoice.paymentStatus === 'paid' || invoice.paymentStatus === 'annulled'">
                      <i class="bi bi-credit-card"></i>
                    </button>
                     <button class="btn btn-sm btn-danger me-1" title="Anular Factura" @click="annulInvoice(invoice)" :disabled="invoice.paymentStatus === 'annulled' || invoice.dianStatus === 'annulled'">
                      <i class="bi bi-x-circle"></i>
                    </button>
                    <div class="dropdown d-inline-block">
                        <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" @click.prevent="downloadPdf(invoice.id)"><i class="bi bi-file-earmark-pdf me-2"></i>Descargar PDF</a></li>
                            <li><a class="dropdown-item" href="#" @click.prevent="downloadXml(invoice.id)"><i class="bi bi-filetype-xml me-2"></i>Descargar XML</a></li>
                            <li><router-link :to="`/billing/credit-note/new?invoiceId=${invoice.id}`" class="dropdown-item"><i class="bi bi-file-earmark-minus me-2"></i>Crear Nota Crédito</router-link></li>
                             <li><a class="dropdown-item" href="#" @click.prevent="sendByEmail(invoice.id)"><i class="bi bi-envelope me-2"></i>Enviar por Email</a></li>
                        </ul>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredInvoices.length === 0">
                    <td colspan="9" class="text-center">No se encontraron facturas con los filtros aplicados.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Paginación (Placeholder) -->
          <nav aria-label="Page navigation">
            <ul class="pagination justify-content-end">
              <li class="page-item disabled"><a class="page-link" href="#">Anterior</a></li>
              <li class="page-item active"><a class="page-link" href="#">1</a></li>
              <li class="page-item"><a class="page-link" href="#">2</a></li>
              <li class="page-item"><a class="page-link" href="#">Siguiente</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    <!-- Payment Modal -->
    <div class="modal fade" id="paymentModal" tabindex="-1" aria-labelledby="paymentModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="paymentModalLabel">Registrar Pago para Factura {{ selectedInvoiceForPayment?.resolutionPrefix }}{{ selectedInvoiceForPayment?.number }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="submitPayment">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="paymentDate" class="form-label">Fecha del Pago</label>
                                <input type="date" class="form-control" id="paymentDate" v-model="paymentData.date" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="paymentAmount" class="form-label">Monto del Pago (COP)</label>
                                <input type="number" class="form-control" id="paymentAmount" v-model="paymentData.amount" :max="selectedInvoiceForPayment?.balance" required>
                                <div class="form-text">Saldo pendiente: {{ formatCurrency(selectedInvoiceForPayment?.balance || 0) }}</div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="paymentMethod" class="form-label">Medio de Pago</label>
                            <select class="form-select" id="paymentMethod" v-model="paymentData.method" required>
                                <option value="">Seleccione...</option>
                                <option value="cash">Efectivo</option>
                                <option value="transfer">Transferencia Bancaria</option>
                                <option value="credit_card">Tarjeta de Crédito</option>
                                <option value="debit_card">Tarjeta Débito</option>
                                <option value="pse">PSE</option>
                                <option value="other">Otro</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="paymentReference" class="form-label">Referencia (Opcional)</label>
                            <input type="text" class="form-control" id="paymentReference" v-model="paymentData.reference">
                        </div>
                         <div class="mb-3">
                            <label for="paymentNotes" class="form-label">Notas (Opcional)</label>
                            <textarea class="form-control" id="paymentNotes" rows="3" v-model="paymentData.notes"></textarea>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Registrar Pago</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import DashboardLayout from '../../components/DashboardLayout.vue';
import { Modal } from 'bootstrap'; // Import Bootstrap's Modal

const invoices = ref([
  { id: 1, resolutionPrefix: 'FE', number: '00123', client: { name: 'Empresa ABC SAS', nit: '900.123.456-1' }, emissionDate: '2024-05-20', dueDate: '2024-06-19', total: 1500000, balance: 0, dianStatus: 'accepted', paymentStatus: 'paid' },
  { id: 2, resolutionPrefix: 'FE', number: '00124', client: { name: 'Cliente Ejemplo NIT', nit: '800.789.123-5' }, emissionDate: '2024-05-22', dueDate: '2024-06-21', total: 850000, balance: 850000, dianStatus: 'accepted', paymentStatus: 'pending' },
  { id: 3, resolutionPrefix: 'FE', number: '00125', client: { name: 'Otro Cliente S.A.S', nit: '901.234.567-8' }, emissionDate: '2024-04-15', dueDate: '2024-05-15', total: 2300000, balance: 2300000, dianStatus: 'accepted', paymentStatus: 'overdue' },
  { id: 4, resolutionPrefix: 'FE', number: '00126', client: { name: 'Constructora XYZ Ltda', nit: '830.567.890-2' }, emissionDate: '2024-05-28', dueDate: '2024-06-27', total: 5750000, balance: 2000000, dianStatus: 'pending_validation', paymentStatus: 'partially_paid' },
  { id: 5, resolutionPrefix: 'FE', number: '00120', client: { name: 'Servicios Digitales Co', nit: '900.000.001-0' }, emissionDate: '2024-03-10', dueDate: '2024-04-09', total: 750000, balance: 0, dianStatus: 'annulled', paymentStatus: 'annulled' },
]);

const filters = ref({
  searchTerm: '',
  status: '',
  startDate: '',
  endDate: '',
});

const selectedInvoiceForPayment = ref(null);
const paymentData = ref({
    date: new Date().toISOString().slice(0,10),
    amount: 0,
    method: '',
    reference: '',
    notes: ''
});
let paymentModalInstance = null;

onMounted(() => {
    if (document.getElementById('paymentModal')) {
        paymentModalInstance = new Modal(document.getElementById('paymentModal'));
    }
});

const filteredInvoices = computed(() => {
  return invoices.value.filter(invoice => {
    const searchTermMatch = filters.value.searchTerm ? 
      (invoice.number.includes(filters.value.searchTerm) || invoice.client.name.toLowerCase().includes(filters.value.searchTerm.toLowerCase()) || invoice.client.nit.includes(filters.value.searchTerm)) : true;
    const statusMatch = filters.value.status ? invoice.paymentStatus === filters.value.status : true;
    const startDateMatch = filters.value.startDate ? new Date(invoice.emissionDate) >= new Date(filters.value.startDate) : true;
    const endDateMatch = filters.value.endDate ? new Date(invoice.emissionDate) <= new Date(filters.value.endDate) : true;
    return searchTermMatch && statusMatch && startDateMatch && endDateMatch;
  });
});

const applyFilters = () => {
  // La computada filteredInvoices se actualiza automáticamente
  console.log("Filtros aplicados:", filters.value);
};

const resetFilters = () => {
  filters.value = {
    searchTerm: '',
    status: '',
    startDate: '',
    endDate: '',
  };
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-CO', options);
};

const getDianStatusClass = (status) => {
  const classes = {
    accepted: 'badge bg-success-soft text-success',
    pending_validation: 'badge bg-info-soft text-info',
    rejected: 'badge bg-danger-soft text-danger',
    annulled: 'badge bg-secondary-soft text-secondary',
  };
  return classes[status] || 'badge bg-light text-dark';
};

const getDianStatusText = (status) => {
  const texts = {
    accepted: 'Aceptada DIAN',
    pending_validation: 'Pendiente Validación',
    rejected: 'Rechazada DIAN',
    annulled: 'Anulada DIAN',
  };
  return texts[status] || 'Desconocido';
};

const getPaymentStatusClass = (status) => {
  const classes = {
    paid: 'badge bg-success-soft text-success',
    pending: 'badge bg-warning-soft text-warning',
    overdue: 'badge bg-danger-soft text-danger',
    partially_paid: 'badge bg-primary-soft text-primary',
    annulled: 'badge bg-secondary-soft text-secondary',
  };
  return classes[status] || 'badge bg-light text-dark';
};

const getPaymentStatusText = (status) => {
  const texts = {
    paid: 'Pagada',
    pending: 'Pendiente',
    overdue: 'Vencida',
    partially_paid: 'Parcialmente Pagada',
    annulled: 'Anulada'
  };
  return texts[status] || 'Desconocido';
};

const openPaymentModal = (invoice) => {
    selectedInvoiceForPayment.value = invoice;
    paymentData.value = {
        date: new Date().toISOString().slice(0,10),
        amount: invoice.balance,
        method: '',
        reference: '',
        notes: ''
    };
    if (paymentModalInstance) {
        paymentModalInstance.show();
    }
};

const submitPayment = () => {
    console.log("Pago registrado:", paymentData.value, "para factura:", selectedInvoiceForPayment.value.id);
    // Aquí iría la lógica para enviar el pago al backend
    // Actualizar el estado de la factura localmente (simulación)
    const invoiceIndex = invoices.value.findIndex(inv => inv.id === selectedInvoiceForPayment.value.id);
    if (invoiceIndex !== -1) {
        invoices.value[invoiceIndex].balance -= paymentData.value.amount;
        if (invoices.value[invoiceIndex].balance <= 0) {
            invoices.value[invoiceIndex].paymentStatus = 'paid';
            invoices.value[invoiceIndex].balance = 0;
        } else {
            invoices.value[invoiceIndex].paymentStatus = 'partially_paid';
        }
    }
    if (paymentModalInstance) {
        paymentModalInstance.hide();
    }
    // Mostrar notificación de éxito (placeholder)
    alert('Pago registrado exitosamente!');
};

const annulInvoice = (invoice) => {
    if (confirm(`¿Está seguro de que desea anular la factura ${invoice.resolutionPrefix}${invoice.number}? Esta acción no se puede deshacer.`)) {
        console.log("Anulando factura:", invoice.id);
        // Aquí iría la lógica para anular la factura en el backend
        // Actualizar el estado de la factura localmente (simulación)
        const invoiceIndex = invoices.value.findIndex(inv => inv.id === invoice.id);
        if (invoiceIndex !== -1) {
            invoices.value[invoiceIndex].dianStatus = 'annulled';
            invoices.value[invoiceIndex].paymentStatus = 'annulled';
            invoices.value[invoiceIndex].balance = 0;
        }
        // Mostrar notificación de éxito (placeholder)
        alert('Factura anulada exitosamente!');
    }
};

const downloadPdf = (invoiceId) => alert(`Descargando PDF para factura ${invoiceId}`);
const downloadXml = (invoiceId) => alert(`Descargando XML para factura ${invoiceId}`);
const sendByEmail = (invoiceId) => alert(`Enviando por email factura ${invoiceId}`);

</script>

<style scoped>
.bg-success-soft { background-color: rgba(28, 200, 138, 0.1); }
.bg-warning-soft { background-color: rgba(246, 194, 62, 0.1); }
.bg-danger-soft { background-color: rgba(231, 74, 59, 0.1); }
.bg-info-soft { background-color: rgba(54, 185, 204, 0.1); }
.bg-primary-soft { background-color: rgba(78, 115, 223, 0.1); }
.bg-secondary-soft { background-color: rgba(134, 142, 150, 0.1); }

.table-hover tbody tr:hover {
  background-color: #f8f9fc;
}
.btn-icon-split .icon {
    padding: .375rem .75rem;
}
.btn-icon-split .text {
    padding: .375rem .75rem;
}
.text-end { text-align: right !important; }
</style>
