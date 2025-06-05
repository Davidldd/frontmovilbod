<template>
  <DashboardLayout>
    <div class="container-fluid">
      <h1 class="h3 mb-4 text-gray-800">Reporte - Balance de Prueba</h1>

      <div class="card shadow mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Filtros del Reporte</h6>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-3 mb-3">
              <label for="reportStartDate" class="form-label">Fecha Desde</label>
              <input type="date" class="form-control" id="reportStartDate" v-model="filters.startDate">
            </div>
            <div class="col-md-3 mb-3">
              <label for="reportEndDate" class="form-label">Fecha Hasta</label>
              <input type="date" class="form-control" id="reportEndDate" v-model="filters.endDate">
            </div>
            <div class="col-md-3 mb-3">
              <label for="accountLevel" class="form-label">Nivel de Cuenta</label>
              <select class="form-select" id="accountLevel" v-model="filters.accountLevel">
                <option value="1">Clase (1 dígito)</option>
                <option value="2">Grupo (2 dígitos)</option>
                <option value="3">Cuenta (4 dígitos)</option>
                <option value="4">Subcuenta (6 dígitos)</option>
                <option value="5">Auxiliar (8+ dígitos)</option>
                <option value="0">Todos los niveles</option>
              </select>
            </div>
            <div class="col-md-3 mb-3 d-flex align-items-end">
              <button class="btn btn-info w-100" @click="generateReport">
                <i class="bi bi-funnel"></i> Generar Reporte
              </button>
            </div>
          </div>
           <div class="row mt-2">
            <div class="col-md-3">
                <button class="btn btn-success w-100" @click="exportToExcel" :disabled="reportData.length === 0">
                    <i class="bi bi-file-earmark-excel"></i> Exportar a Excel
                </button>
            </div>
             <div class="col-md-3">
                <button class="btn btn-danger w-100" @click="exportToPDF" :disabled="reportData.length === 0">
                    <i class="bi bi-file-earmark-pdf"></i> Exportar a PDF
                </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow mb-4" v-if="reportGenerated">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Resultados del Balance de Prueba</h6>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-sm table-bordered table-striped" width="100%" cellspacing="0">
              <thead class="table-dark">
                <tr>
                  <th>Código Cuenta</th>
                  <th>Nombre Cuenta</th>
                  <th class="text-end">Saldo Anterior</th>
                  <th class="text-end">Mov. Débito</th>
                  <th class="text-end">Mov. Crédito</th>
                  <th class="text-end">Nuevo Saldo</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in reportData" :key="item.accountCode" :style="{ 'font-weight': item.level <= 2 ? 'bold' : 'normal', 'padding-left': item.level * 10 + 'px' }">
                  <td>
                     <span :style="{ 'margin-left': item.level * 10 + 'px' }">{{ item.accountCode }}</span>
                  </td>
                  <td>{{ item.accountName }}</td>
                  <td class="text-end">{{ formatCurrency(item.previousBalance) }}</td>
                  <td class="text-end">{{ formatCurrency(item.debitMovements) }}</td>
                  <td class="text-end">{{ formatCurrency(item.creditMovements) }}</td>
                  <td class="text-end">{{ formatCurrency(item.newBalance) }}</td>
                </tr>
                <tr v-if="reportData.length === 0">
                    <td colspan="6" class="text-center fst-italic">No hay datos para mostrar con los filtros seleccionados.</td>
                </tr>
              </tbody>
               <tfoot class="table-group-divider">
                <tr class="fw-bold table-secondary">
                    <td colspan="2" class="text-end">TOTALES:</td>
                    <td class="text-end">{{ formatCurrency(totals.previousBalance) }}</td>
                    <td class="text-end">{{ formatCurrency(totals.debitMovements) }}</td>
                    <td class="text-end">{{ formatCurrency(totals.creditMovements) }}</td>
                    <td class="text-end">{{ formatCurrency(totals.newBalance) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import DashboardLayout from '../../components/DashboardLayout.vue';

const filters = ref({
  startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10), // Primer día del mes actual
  endDate: new Date().toISOString().slice(0,10), // Hoy
  accountLevel: '0', // Todos los niveles
});

const reportGenerated = ref(false);
const reportData = ref([]);

const formatCurrency = (value) => {
  if (typeof value !== 'number') return '0.00';
  return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 });
};

const generateReport = () => {
  // Simulación de generación de reporte
  // En una app real, esto haría una llamada a la API con los filtros
  console.log('Generando reporte con filtros:', filters.value);
  reportData.value = [
    { accountCode: '1', accountName: 'ACTIVO', level: 0, previousBalance: 100000000, debitMovements: 50000000, creditMovements: 20000000, newBalance: 130000000 },
    { accountCode: '11', accountName: 'DISPONIBLE', level: 1, previousBalance: 20000000, debitMovements: 15000000, creditMovements: 5000000, newBalance: 30000000 },
    { accountCode: '1105', accountName: 'CAJA', level: 2, previousBalance: 5000000, debitMovements: 2000000, creditMovements: 1000000, newBalance: 6000000 },
    { accountCode: '110505', accountName: 'Caja General', level: 3, previousBalance: 5000000, debitMovements: 2000000, creditMovements: 1000000, newBalance: 6000000 },
    { accountCode: '1110', accountName: 'BANCOS', level: 2, previousBalance: 15000000, debitMovements: 13000000, creditMovements: 4000000, newBalance: 24000000 },
    { accountCode: '4', accountName: 'INGRESOS', level: 0, previousBalance: 0, debitMovements: 1000000, creditMovements: 80000000, newBalance: -79000000 }, // Ingresos son naturaleza crédito
    { accountCode: '41', accountName: 'OPERACIONALES', level: 1, previousBalance: 0, debitMovements: 1000000, creditMovements: 80000000, newBalance: -79000000 },
    { accountCode: '4135', accountName: 'Comercio al por mayor y menor', level: 2, previousBalance: 0, debitMovements: 1000000, creditMovements: 80000000, newBalance: -79000000 },
    { accountCode: '5', accountName: 'GASTOS', level: 0, previousBalance: 0, debitMovements: 40000000, creditMovements: 500000, newBalance: 39500000 },
    { accountCode: '51', accountName: 'OPERACIONALES DE ADMON', level: 1, previousBalance: 0, debitMovements: 40000000, creditMovements: 500000, newBalance: 39500000 },
    { accountCode: '5105', accountName: 'Gastos de Personal', level: 2, previousBalance: 0, debitMovements: 25000000, creditMovements: 0, newBalance: 25000000 },
  ];
  // Filtrar por nivel de cuenta si es necesario (simplificado)
  if (filters.value.accountLevel !== '0') {
      const maxLevel = parseInt(filters.value.accountLevel);
      reportData.value = reportData.value.filter(item => item.level < maxLevel); // Nivel 0 es Clase, 1 es Grupo, etc.
  }

  reportGenerated.value = true;
};

const totals = computed(() => {
    return reportData.value.reduce((acc, item) => {
        // Solo sumar las cuentas de nivel más bajo o las que permiten movimientos para evitar duplicar
        // Esta lógica de totalización debe ser más robusta en un sistema real, considerando la naturaleza de las cuentas.
        // Aquí, para simplificar, sumaremos solo las cuentas de nivel 0 (Clases) para el total general.
        if (item.level === 0) { 
            acc.previousBalance += item.previousBalance;
            acc.debitMovements += item.debitMovements;
            acc.creditMovements += item.creditMovements;
            acc.newBalance += item.newBalance;
        }
        return acc;
    }, { previousBalance: 0, debitMovements: 0, creditMovements: 0, newBalance: 0 });
});

const exportToExcel = () => {
    alert("Exportar a Excel (simulado)");
    // Aquí iría la lógica para generar y descargar un archivo Excel (ej. usando SheetJS/xlsx)
};
const exportToPDF = () => {
    alert("Exportar a PDF (simulado)");
    // Aquí iría la lógica para generar y descargar un archivo PDF (ej. usando jsPDF o pdfmake)
};

</script>

<style scoped>
.table-sm th, .table-sm td {
    padding: 0.4rem;
    font-size: 0.85rem;
}
.table-dark th {
    color: #fff;
    background-color: #343a40; /* Bootstrap dark */
    border-color: #454d55;
}
</style>
