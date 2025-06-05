<template>
  <DashboardLayout>
    <div class="container-fluid">
      <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Gestión de Pagos y Recibos de Caja</h1>
        <!-- Podríamos tener un botón para "Nuevo Recibo de Caja Independiente" si aplica -->
      </div>

      <div class="card shadow mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Listado de Pagos Registrados</h6>
        </div>
        <div class="card-body">
          <!-- Filtros -->
          <div class="row mb-3">
            <div class="col-md-3">
              <input type="text" class="form-control" placeholder="Buscar por # Factura, Cliente o Referencia..." v-model="filters.searchTerm">
            </div>
            <div class="col-md-2">
              <select class="form-select" v-model="filters.paymentMethod">
                <option value="">Todos los Medios</option>
                <option value="cash">Efectivo</option>
                <option value="transfer">Transferencia</option>
                <option value="credit_card">Tarjeta Crédito</option>
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
                  <th># Recibo</th>
                  <th>Fecha Pago</th>
                  <th>Cliente</th>
                  <th>Factura(s) Afectada(s)</th>
                  <th>Monto (COP)</th>
                  <th>Medio de Pago</th>
                  <th>Referencia</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="payment in filteredPayments" :key="payment.id">
                  <td>RC-{{ payment.id }}</td>
                  <td>{{ formatDate(payment.date) }}</td>
                  <td>{{ payment.clientName }}</td>
                  <td>
                    <span v-for="(inv, idx) in payment.affectedInvoices" :key="idx" class="badge bg-light text-dark me-1">
                      {{ inv.prefix }}{{ inv.number }}
                    </span>
                  </td>
                  <td class="text-end">{{ formatCurrency(payment.amount) }}</td>
                  <td>{{ getPaymentMethodText(payment.method) }}</td>
                  <td>{{ payment.reference || '-' }}</td>
                  <td>
                    <button class="btn btn-sm btn-info me-1" title="Ver Detalle Pago" @click="viewPaymentDetails(payment)">
                      <i class="bi bi-eye"></i>
                    </button>
                    <!-- Anular un pago podría ser complejo, usualmente se hace una nota o ajuste contable -->
                  </td>
                </tr>
                <tr v-if="filteredPayments.length === 0">
                    <td colspan="8" class="text-center">No se encontraron pagos.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Paginación -->
        </div>
      </div>
    </div>
    <!-- Payment Details Modal (Placeholder) -->
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import DashboardLayout from '../../components/DashboardLayout.vue';

const payments = ref([
  { id: 101, date: '2024-05-21', clientName: 'Empresa ABC SAS', affectedInvoices: [{prefix: 'FE', number:'00123'}], amount: 1500000, method: 'transfer', reference: 'TRN-567890' },
  { id: 102, date: '2024-05-23', clientName: 'Cliente Ejemplo NIT', affectedInvoices: [{prefix: 'FE', number:'00124'}], amount: 500000, method: 'cash', reference: '' },
  { id: 103, date: '2024-05-29', clientName: 'Constructora XYZ Ltda', affectedInvoices: [{prefix: 'FE', number:'00126'}], amount: 3750000, method: 'credit_card', reference: 'Auth-12345' },
]);

const filters = ref({
  searchTerm: '',
  paymentMethod: '',
  startDate: '',
  endDate: '',
});

const filteredPayments = computed(() => {
  return payments.value.filter(payment => {
    const searchTermMatch = filters.value.searchTerm ? 
      (payment.clientName.toLowerCase().includes(filters.value.searchTerm.toLowerCase()) || 
       payment.affectedInvoices.some(inv => (inv.prefix+inv.number).includes(filters.value.searchTerm)) ||
       (payment.reference && payment.reference.toLowerCase().includes(filters.value.searchTerm.toLowerCase())))
      : true;
    const methodMatch = filters.value.paymentMethod ? payment.method === filters.value.paymentMethod : true;
    const dateMatch = (filters.value.startDate ? new Date(payment.date) >= new Date(filters.value.startDate) : true) &&
                      (filters.value.endDate ? new Date(payment.date) <= new Date(filters.value.endDate) : true);
    return searchTermMatch && methodMatch && dateMatch;
  });
});

const applyFilters = () => console.log("Filtros Pagos aplicados:", filters.value);
const resetFilters = () => {
  filters.value = { searchTerm: '', paymentMethod: '', startDate: '', endDate: '' };
};

const formatCurrency = (value) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });

const getPaymentMethodText = (method) => ({
  cash: 'Efectivo',
  transfer: 'Transferencia',
  credit_card: 'Tarjeta Crédito',
  debit_card: 'Tarjeta Débito',
  pse: 'PSE',
  other: 'Otro',
}[method] || 'Desconocido');

const viewPaymentDetails = (payment) => {
  // Aquí se podría abrir un modal con más detalles del pago
  alert(`Viendo detalles del pago RC-${payment.id} por ${formatCurrency(payment.amount)}`);
};

</script>
<style scoped>
.text-end { text-align: right !important; }
</style>
