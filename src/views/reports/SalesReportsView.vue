<template>
    <DashboardLayout>
      <div class="container-fluid">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h3 mb-0">Reportes de Ventas</h1>
            <p class="text-muted">Análisis detallado de ventas y rendimiento comercial</p>
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
                  <option value="today">Hoy</option>
                  <option value="week">Esta Semana</option>
                  <option value="month">Este Mes</option>
                  <option value="quarter">Este Trimestre</option>
                  <option value="year">Este Año</option>
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
                <label class="form-label">Vendedor</label>
                <select class="form-select" v-model="filters.salesperson">
                  <option value="">Todos</option>
                  <option value="1">Juan Pérez</option>
                  <option value="2">María García</option>
                  <option value="3">Carlos López</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Cliente</label>
                <select class="form-select" v-model="filters.customer">
                  <option value="">Todos</option>
                  <option value="1">Empresa ABC</option>
                  <option value="2">Corporación XYZ</option>
                  <option value="3">Comercial 123</option>
                </select>
              </div>
            </div>
          </div>
        </div>
  
        <!-- KPIs de Ventas -->
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card bg-primary text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6 class="card-title">Ventas Totales</h6>
                    <h3 class="mb-0">${{ formatCurrency(salesKPIs.totalSales) }}</h3>
                    <small class="opacity-75">
                      <i class="bi bi-arrow-up"></i> +12.5% vs período anterior
                    </small>
                  </div>
                  <i class="bi bi-currency-dollar fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-success text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6 class="card-title">Órdenes</h6>
                    <h3 class="mb-0">{{ salesKPIs.totalOrders }}</h3>
                    <small class="opacity-75">
                      <i class="bi bi-arrow-up"></i> +8.3% vs período anterior
                    </small>
                  </div>
                  <i class="bi bi-cart-check fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-warning text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6 class="card-title">Ticket Promedio</h6>
                    <h3 class="mb-0">${{ formatCurrency(salesKPIs.averageTicket) }}</h3>
                    <small class="opacity-75">
                      <i class="bi bi-arrow-up"></i> +3.7% vs período anterior
                    </small>
                  </div>
                  <i class="bi bi-receipt fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-info text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6 class="card-title">Conversión</h6>
                    <h3 class="mb-0">{{ salesKPIs.conversionRate }}%</h3>
                    <small class="opacity-75">
                      <i class="bi bi-arrow-down"></i> -1.2% vs período anterior
                    </small>
                  </div>
                  <i class="bi bi-graph-up fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Gráficos -->
        <div class="row mb-4">
          <div class="col-lg-8">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0">Tendencia de Ventas</h5>
              </div>
              <div class="card-body">
                <canvas id="salesTrendChart" height="300"></canvas>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0">Ventas por Categoría</h5>
              </div>
              <div class="card-body">
                <canvas id="categoryChart" height="300"></canvas>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Top Productos y Clientes -->
        <div class="row mb-4">
          <div class="col-lg-6">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0">Top Productos</h5>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Ventas</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="product in topProducts" :key="product.id">
                        <td>{{ product.name }}</td>
                        <td>{{ product.quantity }}</td>
                        <td>${{ formatCurrency(product.sales) }}</td>
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
                <h5 class="card-title mb-0">Top Clientes</h5>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>Órdenes</th>
                        <th>Ventas</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="customer in topCustomers" :key="customer.id">
                        <td>{{ customer.name }}</td>
                        <td>{{ customer.orders }}</td>
                        <td>${{ formatCurrency(customer.sales) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Detalle de Ventas -->
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">Detalle de Ventas</h5>
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
                    <th>Orden</th>
                    <th>Cliente</th>
                    <th>Vendedor</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="sale in filteredSales" :key="sale.id">
                    <td>{{ formatDate(sale.date) }}</td>
                    <td>{{ sale.orderNumber }}</td>
                    <td>{{ sale.customer }}</td>
                    <td>{{ sale.salesperson }}</td>
                    <td>{{ sale.itemCount }} items</td>
                    <td>${{ formatCurrency(sale.total) }}</td>
                    <td>
                      <span class="badge" :class="getStatusBadgeClass(sale.status)">
                        {{ sale.status }}
                      </span>
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" @click="viewSale(sale)">
                          <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-outline-success" @click="printSale(sale)">
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
    salesperson: '',
    customer: ''
  })
  
  const searchTerm = ref('')
  
  const salesKPIs = ref({
    totalSales: 125000,
    totalOrders: 156,
    averageTicket: 801.28,
    conversionRate: 23.5
  })
  
  const topProducts = ref([
    { id: 1, name: 'Producto A', quantity: 45, sales: 15000 },
    { id: 2, name: 'Producto B', quantity: 38, sales: 12500 },
    { id: 3, name: 'Producto C', quantity: 32, sales: 9800 },
    { id: 4, name: 'Producto D', quantity: 28, sales: 8200 },
    { id: 5, name: 'Producto E', quantity: 25, sales: 7500 }
  ])
  
  const topCustomers = ref([
    { id: 1, name: 'Empresa ABC', orders: 12, sales: 25000 },
    { id: 2, name: 'Corporación XYZ', orders: 8, sales: 18500 },
    { id: 3, name: 'Comercial 123', orders: 15, sales: 16200 },
    { id: 4, name: 'Industrias DEF', orders: 6, sales: 14800 },
    { id: 5, name: 'Grupo GHI', orders: 9, sales: 12300 }
  ])
  
  const sales = ref([
    {
      id: 1,
      date: new Date('2024-01-15'),
      orderNumber: 'ORD-001',
      customer: 'Empresa ABC',
      salesperson: 'Juan Pérez',
      itemCount: 5,
      total: 1250.00,
      status: 'Completada'
    },
    {
      id: 2,
      date: new Date('2024-01-14'),
      orderNumber: 'ORD-002',
      customer: 'Corporación XYZ',
      salesperson: 'María García',
      itemCount: 3,
      total: 850.00,
      status: 'Pendiente'
    },
    {
      id: 3,
      date: new Date('2024-01-13'),
      orderNumber: 'ORD-003',
      customer: 'Comercial 123',
      salesperson: 'Carlos López',
      itemCount: 8,
      total: 2100.00,
      status: 'Completada'
    }
  ])
  
  const filteredSales = computed(() => {
    if (!searchTerm.value) return sales.value
    
    return sales.value.filter(sale => 
      sale.orderNumber.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      sale.customer.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      sale.salesperson.toLowerCase().includes(searchTerm.value.toLowerCase())
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
  
  const getStatusBadgeClass = (status) => {
    const classes = {
      'Completada': 'bg-success',
      'Pendiente': 'bg-warning',
      'Cancelada': 'bg-danger'
    }
    return classes[status] || 'bg-secondary'
  }
  
  const generateReport = () => {
    console.log('Generando reporte con filtros:', filters.value)
  }
  
  const exportReport = () => {
    console.log('Exportando reporte de ventas')
  }
  
  const viewSale = (sale) => {
    console.log('Ver venta:', sale)
  }
  
  const printSale = (sale) => {
    console.log('Imprimir venta:', sale)
  }
  
  onMounted(() => {
    // Inicializar gráficos aquí
  })
  </script>
  