<template>
  <DashboardLayout>
    <div class="container-fluid">
      <h1 class="h3 mb-4 text-gray-800">Dashboard Contable</h1>

      <!-- Resumen Contable -->
      <div class="row">
        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-primary shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Efectivo y Equivalentes</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">$40,000</div>
                </div>
                <div class="col-auto">
                  <i class="bi bi-cash-stack fs-2 text-gray-300"></i>
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
                  <div class="text-xs font-weight-bold text-success text-uppercase mb-1">Cuentas por Cobrar</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">$215,000</div>
                </div>
                <div class="col-auto">
                  <i class="bi bi-person-check fs-2 text-gray-300"></i>
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
                  <div class="text-xs font-weight-bold text-info text-uppercase mb-1">Cuentas por Pagar</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">$80,500</div>
                </div>
                <div class="col-auto">
                  <i class="bi bi-credit-card-2-front fs-2 text-gray-300"></i>
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
                  <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">Patrimonio Neto</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">$500,000</div>
                </div>
                <div class="col-auto">
                  <i class="bi bi-bank fs-2 text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="row">
        <div class="col-xl-8 col-lg-7">
          <div class="card shadow mb-4">
            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 class="m-0 font-weight-bold text-primary">Evolución Ingresos vs Gastos (Últimos 6 Meses)</h6>
            </div>
            <div class="card-body">
              <div class="chart-area">
                <canvas ref="incomeExpenseChart"></canvas>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-4 col-lg-5">
          <div class="card shadow mb-4">
            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 class="m-0 font-weight-bold text-primary">Composición Financiera</h6>
            </div>
            <div class="card-body">
              <div class="chart-pie pt-4 pb-2">
                <canvas ref="financialCompositionChart"></canvas>
              </div>
              <div class="mt-4 text-center small">
                <span class="mr-2"><i class="bi bi-circle-fill text-primary"></i> Activos</span>
                <span class="mr-2"><i class="bi bi-circle-fill text-success"></i> Pasivos</span>
                <span class="mr-2"><i class="bi bi-circle-fill text-info"></i> Patrimonio</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Accesos Directos y Últimos Comprobantes -->
      <div class="row">
        <div class="col-lg-6 mb-4">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">Accesos Directos</h6>
            </div>
            <div class="card-body">
              <router-link to="/accounting/journal-entry/new" class="btn btn-primary btn-icon-split mb-2 me-2">
                <span class="icon text-white-50"><i class="bi bi-journal-plus"></i></span>
                <span class="text">Nuevo Comprobante</span>
              </router-link>
              <router-link to="/accounting/chart-of-accounts" class="btn btn-info btn-icon-split mb-2 me-2">
                <span class="icon text-white-50"><i class="bi bi-list-columns-reverse"></i></span>
                <span class="text">Plan de Cuentas</span>
              </router-link>
              <router-link to="/accounting/reports/trial-balance" class="btn btn-success btn-icon-split mb-2 me-2">
                <span class="icon text-white-50"><i class="bi bi-file-spreadsheet"></i></span>
                <span class="text">Balance de Prueba</span>
              </router-link>
            </div>
          </div>
        </div>
        <div class="col-lg-6 mb-4">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">Últimos Comprobantes Registrados</h6>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Número</th>
                      <th>Fecha</th>
                      <th>Concepto</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="entry in recentEntries" :key="entry.id">
                      <td>{{ entry.number }}</td>
                      <td>{{ formatDate(entry.date) }}</td>
                      <td>{{ entry.concept }}</td>
                      <td>${{ formatCurrency(entry.total) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <router-link to="/accounting/journal-entries" class="btn btn-sm btn-outline-primary mt-2">Ver Todos</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import DashboardLayout from '../../components/DashboardLayout.vue';
import Chart from 'chart.js/auto';

const incomeExpenseChart = ref(null);
const financialCompositionChart = ref(null);

const recentEntries = ref([
  { id: 1, number: 'CE-00123', date: '2024-05-28', concept: 'Pago nómina quincena', total: 15000000 },
  { id: 2, number: 'CI-0088', date: '2024-05-27', concept: 'Abono cliente XYZ SAS', total: 5200000 },
  { id: 3, number: 'CD-0150', date: '2024-05-26', concept: 'Compra papelería oficina', total: 350000 },
]);

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-CO', options);
};

const formatCurrency = (value) => {
  return value.toLocaleString('es-CO');
};

onMounted(async () => {
  await nextTick(); // Ensure DOM is ready

  // Income vs Expense Chart
  if (incomeExpenseChart.value) {
    new Chart(incomeExpenseChart.value.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May'],
        datasets: [{
          label: 'Ingresos',
          data: [50000, 55000, 62000, 58000, 65000, 70000],
          borderColor: 'rgba(78, 115, 223, 1)',
          backgroundColor: 'rgba(78, 115, 223, 0.1)',
          tension: 0.3,
          fill: true,
        }, {
          label: 'Gastos',
          data: [30000, 32000, 28000, 35000, 33000, 38000],
          borderColor: 'rgba(231, 74, 59, 1)',
          backgroundColor: 'rgba(231, 74, 59, 0.1)',
          tension: 0.3,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Financial Composition Chart
  if (financialCompositionChart.value) {
    new Chart(financialCompositionChart.value.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Activos', 'Pasivos', 'Patrimonio'],
        datasets: [{
          data: [55, 30, 15],
          backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
          hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
          hoverBorderColor: "rgba(234, 236, 244, 1)",
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        cutout: '80%',
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
});
</script>

<style scoped>
.chart-area, .chart-pie {
  position: relative;
  height: 320px; /* Adjust as needed */
}
.card-body .table-responsive {
  max-height: 250px; /* Limit height for recent entries table */
}
.fs-2 { font-size: 2rem; }
</style>
