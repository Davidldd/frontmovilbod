<template>
    <DashboardLayout>
      <template #header>
        <div class="d-flex justify-content-between align-items-center">
          <h1 class="h3 mb-0">Dashboard de Ventas</h1>
          <div>
            <button class="btn btn-sm btn-outline-secondary me-2">
              <i class="bi bi-calendar3"></i> Filtrar por fecha
            </button>
            <button class="btn btn-sm btn-outline-primary">
              <i class="bi bi-download"></i> Exportar datos
            </button>
          </div>
        </div>
      </template>
  
      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="text-muted mb-1">Ventas del mes</h6>
                  <h3 class="mb-0">{{ formatCurrency(salesData.monthlySales) }}</h3>
                </div>
                <div class="bg-primary bg-opacity-10 p-2 rounded">
                  <i class="bi bi-graph-up text-primary fs-4"></i>
                </div>
              </div>
              <div class="mt-3">
                <span :class="salesData.monthlyGrowth >= 0 ? 'text-success' : 'text-danger'">
                  <i :class="salesData.monthlyGrowth >= 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
                  {{ Math.abs(salesData.monthlyGrowth) }}%
                </span>
                <span class="text-muted ms-1">vs mes anterior</span>
              </div>
            </div>
          </div>
        </div>
  
        <div class="col-md-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="text-muted mb-1">Cotizaciones</h6>
                  <h3 class="mb-0">{{ salesData.quotations }}</h3>
                </div>
                <div class="bg-success bg-opacity-10 p-2 rounded">
                  <i class="bi bi-file-earmark-text text-success fs-4"></i>
                </div>
              </div>
              <div class="mt-3">
                <span class="text-muted">Tasa de conversión:</span>
                <span class="ms-1">{{ salesData.conversionRate }}%</span>
              </div>
            </div>
          </div>
        </div>
  
        <div class="col-md-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="text-muted mb-1">Órdenes pendientes</h6>
                  <h3 class="mb-0">{{ salesData.pendingOrders }}</h3>
                </div>
                <div class="bg-warning bg-opacity-10 p-2 rounded">
                  <i class="bi bi-clock-history text-warning fs-4"></i>
                </div>
              </div>
              <div class="mt-3">
                <span class="text-muted">Valor total:</span>
                <span class="ms-1">{{ formatCurrency(salesData.pendingOrdersValue) }}</span>
              </div>
            </div>
          </div>
        </div>
  
        <div class="col-md-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="text-muted mb-1">Ticket promedio</h6>
                  <h3 class="mb-0">{{ formatCurrency(salesData.averageTicket) }}</h3>
                </div>
                <div class="bg-info bg-opacity-10 p-2 rounded">
                  <i class="bi bi-receipt text-info fs-4"></i>
                </div>
              </div>
              <div class="mt-3">
                <span :class="salesData.ticketGrowth >= 0 ? 'text-success' : 'text-danger'">
                  <i :class="salesData.ticketGrowth >= 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
                  {{ Math.abs(salesData.ticketGrowth) }}%
                </span>
                <span class="text-muted ms-1">vs mes anterior</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div class="row g-3 mb-4">
        <div class="col-md-8">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Tendencia de ventas</h5>
                <div class="btn-group btn-group-sm">
                  <button type="button" class="btn btn-outline-secondary" :class="{ active: chartPeriod === 'week' }" @click="chartPeriod = 'week'">Semana</button>
                  <button type="button" class="btn btn-outline-secondary" :class="{ active: chartPeriod === 'month' }" @click="chartPeriod = 'month'">Mes</button>
                  <button type="button" class="btn btn-outline-secondary" :class="{ active: chartPeriod === 'quarter' }" @click="chartPeriod = 'quarter'">Trimestre</button>
                  <button type="button" class="btn btn-outline-secondary" :class="{ active: chartPeriod === 'year' }" @click="chartPeriod = 'year'">Año</button>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="chart-container" style="position: relative; height:300px;">
                <!-- Aquí iría el gráfico real con Chart.js o similar -->
                <div class="placeholder-chart d-flex align-items-center justify-content-center h-100 bg-light rounded">
                  <div class="text-center">
                    <i class="bi bi-bar-chart-line fs-1 text-secondary"></i>
                    <p class="mt-2 mb-0 text-muted">Gráfico de tendencia de ventas por {{ chartPeriodLabel }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div class="col-md-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-0">
              <h5 class="mb-0">Ventas por categoría</h5>
            </div>
            <div class="card-body">
              <div class="chart-container" style="position: relative; height:300px;">
                <!-- Aquí iría el gráfico real con Chart.js o similar -->
                <div class="placeholder-chart d-flex align-items-center justify-content-center h-100 bg-light rounded">
                  <div class="text-center">
                    <i class="bi bi-pie-chart fs-1 text-secondary"></i>
                    <p class="mt-2 mb-0 text-muted">Gráfico de ventas por categoría</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div class="row g-3">
        <div class="col-md-6">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Últimas ventas</h5>
                <a href="#" class="btn btn-sm btn-link text-decoration-none">Ver todas</a>
              </div>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th scope="col">#Orden</th>
                      <th scope="col">Cliente</th>
                      <th scope="col">Fecha</th>
                      <th scope="col">Monto</th>
                      <th scope="col">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="order in recentOrders" :key="order.id" class="align-middle">
                      <td>{{ order.number }}</td>
                      <td>{{ order.customer }}</td>
                      <td>{{ formatDate(order.date) }}</td>
                      <td>{{ formatCurrency(order.amount) }}</td>
                      <td>
                        <span :class="getStatusBadgeClass(order.status)">
                          {{ order.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
  
        <div class="col-md-6">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Mejores clientes</h5>
                <a href="#" class="btn btn-sm btn-link text-decoration-none">Ver todos</a>
              </div>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th scope="col">Cliente</th>
                      <th scope="col">Compras</th>
                      <th scope="col">Última compra</th>
                      <th scope="col">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="customer in topCustomers" :key="customer.id" class="align-middle">
                      <td>{{ customer.name }}</td>
                      <td>{{ customer.purchases }}</td>
                      <td>{{ formatDate(customer.lastPurchase) }}</td>
                      <td>{{ formatCurrency(customer.total) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import DashboardLayout from '../../components/DashboardLayout.vue';
  
  export default {
    name: 'SalesDashboardView',
    components: {
      DashboardLayout
    },
    setup() {
      const chartPeriod = ref('month');
      
      const chartPeriodLabel = computed(() => {
        switch (chartPeriod.value) {
          case 'week': return 'semana';
          case 'month': return 'mes';
          case 'quarter': return 'trimestre';
          case 'year': return 'año';
          default: return 'mes';
        }
      });
  
      // Datos de ejemplo para el dashboard
      const salesData = {
        monthlySales: 125000,
        monthlyGrowth: 12.5,
        quotations: 48,
        conversionRate: 65,
        pendingOrders: 15,
        pendingOrdersValue: 45000,
        averageTicket: 2500,
        ticketGrowth: -3.2
      };
  
      const recentOrders = [
        { id: 1, number: 'SO-2023-0125', customer: 'Empresa ABC', date: '2023-06-10', amount: 5200, status: 'Completada' },
        { id: 2, number: 'SO-2023-0124', customer: 'Distribuidora XYZ', date: '2023-06-09', amount: 3450, status: 'En proceso' },
        { id: 3, number: 'SO-2023-0123', customer: 'Comercial 123', date: '2023-06-08', amount: 1200, status: 'Completada' },
        { id: 4, number: 'SO-2023-0122', customer: 'Tienda Online', date: '2023-06-07', amount: 4800, status: 'Pendiente' },
        { id: 5, number: 'SO-2023-0121', customer: 'Mayorista Central', date: '2023-06-06', amount: 2300, status: 'Completada' }
      ];
  
      const topCustomers = [
        { id: 1, name: 'Empresa ABC', purchases: 12, lastPurchase: '2023-06-10', total: 58000 },
        { id: 2, name: 'Distribuidora XYZ', purchases: 8, lastPurchase: '2023-06-09', total: 42000 },
        { id: 3, name: 'Comercial 123', purchases: 15, lastPurchase: '2023-06-08', total: 35000 },
        { id: 4, name: 'Tienda Online', purchases: 6, lastPurchase: '2023-06-07', total: 28000 },
        { id: 5, name: 'Mayorista Central', purchases: 10, lastPurchase: '2023-06-06', total: 22000 }
      ];
  
      const formatCurrency = (value) => {
        if (value === undefined || value === null) return '$0';
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
      };
  
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-CL').format(date);
      };
  
      const getStatusBadgeClass = (status) => {
        switch (status) {
          case 'Completada': return 'badge bg-success';
          case 'En proceso': return 'badge bg-primary';
          case 'Pendiente': return 'badge bg-warning text-dark';
          case 'Cancelada': return 'badge bg-danger';
          default: return 'badge bg-secondary';
        }
      };
  
      return {
        chartPeriod,
        chartPeriodLabel,
        salesData,
        recentOrders,
        topCustomers,
        formatCurrency,
        formatDate,
        getStatusBadgeClass
      };
    }
  };
  </script>
  
  <style scoped>
  .placeholder-chart {
    border: 1px dashed #dee2e6;
  }
  </style>
  