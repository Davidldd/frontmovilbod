<template>
    <DashboardLayout>
      <div class="container-fluid">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h3 mb-0">Reportes Financieros</h1>
            <p class="text-muted">Estados financieros y análisis contable</p>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-primary" @click="exportReport">
              <i class="bi bi-download"></i>
              Exportar
            </button>
            <button class="btn btn-primary" @click="generateReport">
              <i class="bi bi-arrow-clockwise"></i>
              Actualizar
            </button>
          </div>
        </div>
  
        <!-- Filtros -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row">
              <div class="col-md-3">
                <label class="form-label">Período</label>
                <select class="form-select" v-model="filters.period">
                  <option value="month">Este Mes</option>
                  <option value="quarter">Trimestre</option>
                  <option value="year">Año Fiscal</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>
              <div class="col-md-3" v-if="filters.period === 'custom'">
                <label class="form-label">Fecha Inicio</label>
                <input type="date" class="form-control" v-model="filters.startDate">
              </div>
              <div class="col-md-3" v-if="filters.period === 'custom'">
                <label class="form-label">Fecha Fin</label>
                <input type="date" class="form-control" v-model="filters.endDate">
              </div>
              <div class="col-md-3">
                <label class="form-label">Centro de Costo</label>
                <select class="form-select" v-model="filters.costCenter">
                  <option value="">Todos</option>
                  <option value="1">Ventas</option>
                  <option value="2">Administración</option>
                  <option value="3">Producción</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Moneda</label>
                <select class="form-select" v-model="filters.currency">
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="COP">COP</option>
                </select>
              </div>
            </div>
          </div>
        </div>
  
        <!-- KPIs Financieros -->
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card bg-success text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6 class="card-title">Ingresos</h6>
                    <h3 class="mb-0">${{ formatCurrency(financialKPIs.revenue) }}</h3>
                    <small class="opacity-75">
                      <i class="bi bi-arrow-up"></i> +15.3% vs período anterior
                    </small>
                  </div>
                  <i class="bi bi-arrow-up-circle fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-danger text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6 class="card-title">Gastos</h6>
                    <h3 class="mb-0">${{ formatCurrency(financialKPIs.expenses) }}</h3>
                    <small class="opacity-75">
                      <i class="bi bi-arrow-up"></i> +8.7% vs período anterior
                    </small>
                  </div>
                  <i class="bi bi-arrow-down-circle fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-primary text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6 class="card-title">Utilidad Neta</h6>
                    <h3 class="mb-0">${{ formatCurrency(financialKPIs.netProfit) }}</h3>
                    <small class="opacity-75">
                      <i class="bi bi-arrow-up"></i> +22.1% vs período anterior
                    </small>
                  </div>
                  <i class="bi bi-graph-up fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-info text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6 class="card-title">Margen</h6>
                    <h3 class="mb-0">{{ financialKPIs.margin }}%</h3>
                    <small class="opacity-75">
                      <i class="bi bi-arrow-up"></i> +2.3% vs período anterior
                    </small>
                  </div>
                  <i class="bi bi-percent fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Gráficos Financieros -->
        <div class="row mb-4">
          <div class="col-lg-8">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0">Flujo de Caja</h5>
              </div>
              <div class="card-body">
                <canvas id="cashFlowChart" height="300"></canvas>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0">Distribución de Gastos</h5>
              </div>
              <div class="card-body">
                <canvas id="expensesChart" height="300"></canvas>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Estados Financieros -->
        <div class="row mb-4">
          <div class="col-lg-6">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0">Estado de Resultados</h5>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-sm">
                    <tbody>
                      <tr class="table-success">
                        <td><strong>INGRESOS</strong></td>
                        <td class="text-end"><strong>${{ formatCurrency(incomeStatement.revenue) }}</strong></td>
                      </tr>
                      <tr>
                        <td class="ps-3">Ventas</td>
                        <td class="text-end">${{ formatCurrency(incomeStatement.sales) }}</td>
                      </tr>
                      <tr>
                        <td class="ps-3">Otros Ingresos</td>
                        <td class="text-end">${{ formatCurrency(incomeStatement.otherIncome) }}</td>
                      </tr>
                      <tr class="table-danger">
                        <td><strong>GASTOS</strong></td>
                        <td class="text-end"><strong>${{ formatCurrency(incomeStatement.expenses) }}</strong></td>
                      </tr>
                      <tr>
                        <td class="ps-3">Costo de Ventas</td>
                        <td class="text-end">${{ formatCurrency(incomeStatement.cogs) }}</td>
                      </tr>
                      <tr>
                        <td class="ps-3">Gastos Operacionales</td>
                        <td class="text-end">${{ formatCurrency(incomeStatement.operatingExpenses) }}</td>
                      </tr>
                      <tr>
                        <td class="ps-3">Gastos Financieros</td>
                        <td class="text-end">${{ formatCurrency(incomeStatement.financialExpenses) }}</td>
                      </tr>
                      <tr class="table-primary">
                        <td><strong>UTILIDAD NETA</strong></td>
                        <td class="text-end"><strong>${{ formatCurrency(incomeStatement.netProfit) }}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0">Balance General</h5>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-sm">
                    <tbody>
                      <tr class="table-info">
                        <td><strong>ACTIVOS</strong></td>
                        <td class="text-end"><strong>${{ formatCurrency(balanceSheet.totalAssets) }}</strong></td>
                      </tr>
                      <tr>
                        <td class="ps-3">Activos Corrientes</td>
                        <td class="text-end">${{ formatCurrency(balanceSheet.currentAssets) }}</td>
                      </tr>
                      <tr>
                        <td class="ps-3">Activos Fijos</td>
                        <td class="text-end">${{ formatCurrency(balanceSheet.fixedAssets) }}</td>
                      </tr>
                      <tr class="table-warning">
                        <td><strong>PASIVOS</strong></td>
                        <td class="text-end"><strong>${{ formatCurrency(balanceSheet.totalLiabilities) }}</strong></td>
                      </tr>
                      <tr>
                        <td class="ps-3">Pasivos Corrientes</td>
                        <td class="text-end">${{ formatCurrency(balanceSheet.currentLiabilities) }}</td>
                      </tr>
                      <tr>
                        <td class="ps-3">Pasivos a Largo Plazo</td>
                        <td class="text-end">${{ formatCurrency(balanceSheet.longTermLiabilities) }}</td>
                      </tr>
                      <tr class="table-success">
                        <td><strong>PATRIMONIO</strong></td>
                        <td class="text-end"><strong>${{ formatCurrency(balanceSheet.equity) }}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Ratios Financieros -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0">Ratios Financieros</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-3">
                    <div class="text-center p-3 border rounded">
                      <h4 class="text-primary">{{ financialRatios.liquidityRatio }}</h4>
                      <p class="mb-0">Ratio de Liquidez</p>
                      <small class="text-muted">Activo Corriente / Pasivo Corriente</small>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="text-center p-3 border rounded">
                      <h4 class="text-success">{{ financialRatios.profitabilityRatio }}%</h4>
                      <p class="mb-0">Rentabilidad</p>
                      <small class="text-muted">Utilidad Neta / Ingresos</small>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="text-center p-3 border rounded">
                      <h4 class="text-info">{{ financialRatios.debtRatio }}%</h4>
                      <p class="mb-0">Endeudamiento</p>
                      <small class="text-muted">Pasivos / Activos</small>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="text-center p-3 border rounded">
                      <h4 class="text-warning">{{ financialRatios.roeRatio }}%</h4>
                      <p class="mb-0">ROE</p>
                      <small class="text-muted">Utilidad Neta / Patrimonio</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Movimientos Contables Recientes -->
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">Movimientos Contables Recientes</h5>
            <div class="d-flex gap-2">
              <input type="text" class="form-control form-control-sm" placeholder="Buscar..." v-model="searchTerm">
              <button class="btn btn-sm btn-outline-primary">
                <i class="bi bi-funnel"></i>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Comprobante</th>
                    <th>Descripción</th>
                    <th>Cuenta</th>
                    <th>Débito</th>
                    <th>Crédito</th>
                    <th>Centro Costo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="entry in filteredEntries" :key="entry.id">
                    <td>{{ formatDate(entry.date) }}</td>
                    <td>{{ entry.voucherNumber }}</td>
                    <td>{{ entry.description }}</td>
                    <td>{{ entry.account }}</td>
                    <td class="text-end">{{ entry.debit ? '$' + formatCurrency(entry.debit) : '-' }}</td>
                    <td class="text-end">{{ entry.credit ? '$' + formatCurrency(entry.credit) : '-' }}</td>
                    <td>{{ entry.costCenter }}</td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" @click="viewEntry(entry)">
                          <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-outline-success" @click="printEntry(entry)">
                          <i class="bi bi-printer"></i>
                        </button>
                      </div>
                    </td>
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
  import { ref, computed, onMounted } from 'vue'
  import DashboardLayout from '../../components/DashboardLayout.vue'
  
  const filters = ref({
    period: 'month',
    startDate: '',
    endDate: '',
    costCenter: '',
    currency: 'USD'
  })
  
  const searchTerm = ref('')
  
  const financialKPIs = ref({
    revenue: 185000,
    expenses: 125000,
    netProfit: 60000,
    margin: 32.4
  })
  
  const incomeStatement = ref({
    revenue: 185000,
    sales: 175000,
    otherIncome: 10000,
    expenses: 125000,
    cogs: 85000,
    operatingExpenses: 30000,
    financialExpenses: 10000,
    netProfit: 60000
  })
  
  const balanceSheet = ref({
    totalAssets: 450000,
    currentAssets: 180000,
    fixedAssets: 270000,
    totalLiabilities: 200000,
    currentLiabilities: 80000,
    longTermLiabilities: 120000,
    equity: 250000
  })
  
  const financialRatios = ref({
    liquidityRatio: 2.25,
    profitabilityRatio: 32.4,
    debtRatio: 44.4,
    roeRatio: 24.0
  })
  
  const accountingEntries = ref([
    {
      id: 1,
      date: new Date('2024-01-15'),
      voucherNumber: 'COMP-001',
      description: 'Venta de productos',
      account: '4105 - Ingresos por Ventas',
      debit: null,
      credit: 5000,
      costCenter: 'Ventas'
    },
    {
      id: 2,
      date: new Date('2024-01-15'),
      voucherNumber: 'COMP-001',
      description: 'Venta de productos',
      account: '1105 - Caja',
      debit: 5000,
      credit: null,
      costCenter: 'Ventas'
    },
    {
      id: 3,
      date: new Date('2024-01-14'),
      voucherNumber: 'COMP-002',
      description: 'Pago de servicios públicos',
      account: '5135 - Servicios Públicos',
      debit: 350,
      credit: null,
      costCenter: 'Administración'
    },
    {
      id: 4,
      date: new Date('2024-01-14'),
      voucherNumber: 'COMP-002',
      description: 'Pago de servicios públicos',
      account: '1105 - Caja',
      debit: null,
      credit: 350,
      costCenter: 'Administración'
    }
  ])
  
  const filteredEntries = computed(() => {
    if (!searchTerm.value) return accountingEntries.value
    
    return accountingEntries.value.filter(entry => 
      entry.voucherNumber.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      entry.account.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  })
  
  const formatCurrency = (amount) => {
    if (amount == null || isNaN(amount)) return '0.00'
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }
  
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }
  
  const generateReport = () => {
    console.log('Generando reporte con filtros:', filters.value)
  }
  
  const exportReport = () => {
    console.log('Exportando reporte financiero')
  }
  
  const viewEntry = (entry) => {
    console.log('Ver comprobante:', entry)
  }
  
  const printEntry = (entry) => {
    console.log('Imprimir comprobante:', entry)
  }
  
  onMounted(() => {
    // Inicializar gráficos aquí
  })
  </script>
  