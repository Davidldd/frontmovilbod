<template>
  <DashboardLayout>
    <div class="container-fluid">
      <h1 class="h3 mb-4 text-gray-800">Dashboard de Facturación</h1>

      <!-- Resumen General -->
      <div class="row">
        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-primary shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Ventas del Mes (COP)</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ formatCurrency(summary.monthlySales) }}</div>
                </div>
                <div class="col-auto">
                  <i class="bi bi-calendar-check fs-2 text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-success shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-success text-uppercase mb-1">Cuentas por Cobrar (COP)</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ formatCurrency(summary.accountsReceivable) }}</div>
                </div>
                <div class="col-auto">
                  <i class="bi bi-currency-dollar fs-2 text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-info shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-info text-uppercase mb-1">Facturas Emitidas (Mes)</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ summary.invoicesIssued }}</div>
                </div>
                <div class="col-auto">
                  <i class="bi bi-file-earmark-text fs-2 text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-warning shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">Facturas Vencidas</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ summary.overdueInvoices }}</div>
                </div>
                <div class="col-auto">
                  <i class="bi bi-exclamation-triangle fs-2 text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="row">
        <div class="col-lg-7 mb-4">
          <div class="card shadow">
            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 class="m-0 font-weight-bold text-primary">Ventas por Mes (Últimos 6 meses)</h6>
            </div>
            <div class="card-body">
              <canvas id="salesChart"></canvas>
            </div>
          </div>
        </div>
        <div class="col-lg-5 mb-4">
          <div class="card shadow">
            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 class="m-0 font-weight-bold text-primary">Estado de Facturas</h6>
            </div>
            <div class="card-body">
               <canvas id="invoiceStatusChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Facturas Recientes -->
      <div class="card shadow mb-4">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 class="m-0 font-weight-bold text-primary">Facturas Recientes</h6>
          <router-link to="/billing/invoices/new" class="btn btn-primary btn-sm">
            <i class="bi bi-plus-circle me-1"></i> Nueva Factura
          </router-link>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th># Factura</th>
                  <th>Cliente</th>
                  <th>Fecha Emisión</th>
                  <th>Fecha Vencimiento</th>
                  <th>Total (COP)</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="invoice in recentInvoices" :key="invoice.id">
                  <td>{{ invoice.number }}</td>
                  <td>{{ invoice.clientName }}</td>
                  <td>{{ formatDate(invoice.emissionDate) }}</td>
                  <td>{{ formatDate(invoice.dueDate) }}</td>
                  <td>{{ formatCurrency(invoice.total) }}</td>
                  <td><span :class="getStatusClass(invoice.status)">{{ getStatusText(invoice.status) }}</span></td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary me-1" title="Ver Detalle">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" title="Descargar PDF">
                      <i class="bi bi-file-earmark-pdf"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="recentInvoices.length === 0">
                    <td colspan="7" class="text-center">No hay facturas recientes.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import DashboardLayout from '../../components/DashboardLayout.vue';
import Chart from 'chart.js/auto';

const summary = ref({
  monthlySales: 12580000,
  accountsReceivable: 4520000,
  invoicesIssued: 25,
  overdueInvoices: 3,
});

const recentInvoices = ref([
  { id: 1, number: 'FV-00123', clientName: 'Empresa ABC SAS', emissionDate: '2024-05-20', dueDate: '2024-06-19', total: 1500000, status: 'paid' },
  { id: 2, number: 'FV-00124', clientName: 'Cliente Ejemplo NIT 900.123.456-7', emissionDate: '2024-05-22', dueDate: '2024-06-21', total: 850000, status: 'pending' },
  { id: 3, number: 'FV-00125', clientName: 'Otro Cliente S.A.S', emissionDate: '2024-04-15', dueDate: '2024-05-15', total: 2300000, status: 'overdue' },
]);

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-CO', options);
};

const getStatusClass = (status) => {
  if (status === 'paid') return 'badge bg-success-soft text-success';
  if (status === 'pending') return 'badge bg-warning-soft text-warning';
  if (status === 'overdue') return 'badge bg-danger-soft text-danger';
  if (status === 'annulled') return 'badge bg-secondary-soft text-secondary';
  return 'badge bg-light text-dark';
};

const getStatusText = (status) => {
  const statuses = {
    paid: 'Pagada',
    pending: 'Pendiente',
    overdue: 'Vencida',
    annulled: 'Anulada'
  };
  return statuses[status] || 'Desconocido';
};


onMounted(() => {
  // Sales Chart
  const salesCtx = document.getElementById('salesChart').getContext('2d');
  new Chart(salesCtx, {
    type: 'line',
    data: {
      labels: ['Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May'],
      datasets: [{
        label: 'Ventas',
        data: [8500000, 9200000, 7800000, 10500000, 11200000, summary.value.monthlySales],
        borderColor: '#4e73df',
        backgroundColor: 'rgba(78, 115, 223, 0.05)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatCurrency(value);
            }
          }
        }
      }
    }
  });

  // Invoice Status Chart
  const invoiceStatusCtx = document.getElementById('invoiceStatusChart').getContext('2d');
  new Chart(invoiceStatusCtx, {
    type: 'doughnut',
    data: {
      labels: ['Pagadas', 'Pendientes', 'Vencidas'],
      datasets: [{
        data: [18, 4, summary.value.overdueInvoices], // Example data
        backgroundColor: ['#1cc88a', '#f6c23e', '#e74a3b'],
        hoverBackgroundColor: ['#17a673', '#dda20a', '#c73021'],
        hoverBorderColor: "rgba(234, 236, 244, 1)",
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '80%',
    }
  });
});

</script>

<style scoped>
.card-body {
  flex-grow: 1;
}
.border-left-primary {
  border-left: .25rem solid #4e73df !important;
}
.border-left-success {
  border-left: .25rem solid #1cc88a !important;
}
.border-left-info {
  border-left: .25rem solid #36b9cc !important;
}
.border-left-warning {
  border-left: .25rem solid #f6c23e !important;
}
.text-gray-300 {
  color: #dddfeb !important;
}
.text-gray-800 {
  color: #5a5c69 !important;
}
.fs-2 { font-size: 1.75rem; }

.bg-success-soft { background-color: rgba(28, 200, 138, 0.1); }
.bg-warning-soft { background-color: rgba(246, 194, 62, 0.1); }
.bg-danger-soft { background-color: rgba(231, 74, 59, 0.1); }
.bg-secondary-soft { background-color: rgba(134, 142, 150, 0.1); }

.table-hover tbody tr:hover {
  background-color: #f8f9fc;
}
</style>
