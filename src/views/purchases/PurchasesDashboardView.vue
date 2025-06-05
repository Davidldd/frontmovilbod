<template>
  <DashboardLayout>
    <div class="purchases-dashboard">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Dashboard de Compras</h2>
          <p class="text-muted mb-0">Gestión y seguimiento de compras</p>
        </div>
        <div>
          <button class="btn btn-primary me-2" @click="$router.push('/purchases/orders/create')">
            <i class="fas fa-plus"></i> Nueva Orden de Compra
          </button>
          <button class="btn btn-outline-primary" @click="$router.push('/purchases/suppliers')">
            <i class="fas fa-users"></i> Ver Proveedores
          </button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h6 class="card-title">OCs Pendientes</h6>
                  <h3 class="mb-0">{{ kpis.pendingOrders }}</h3>
                </div>
                <div class="align-self-center">
                  <i class="fas fa-file-invoice fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h6 class="card-title">Compras del Mes</h6>
                  <h3 class="mb-0">${{ formatNumber(kpis.monthlyPurchases) }}</h3>
                </div>
                <div class="align-self-center">
                  <i class="fas fa-shopping-cart fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-info text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h6 class="card-title">Proveedores Activos</h6>
                  <h3 class="mb-0">{{ kpis.activeSuppliers }}</h3>
                </div>
                <div class="align-self-center">
                  <i class="fas fa-users fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h6 class="card-title">Recepciones Pendientes</h6>
                  <h3 class="mb-0">{{ kpis.pendingReceipts }}</h3>
                </div>
                <div class="align-self-center">
                  <i class="fas fa-truck fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Compras por Estado de OC</h5>
            </div>
            <div class="card-body">
              <canvas ref="orderStatusChart" height="200"></canvas>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Valor de Compras por Mes</h5>
            </div>
            <div class="card-body">
              <canvas ref="monthlyPurchasesChart" height="200"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Purchase Orders -->
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="card-title mb-0">Órdenes de Compra Recientes</h5>
          <router-link to="/purchases/orders" class="btn btn-sm btn-outline-primary">
            Ver Todas
          </router-link>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Número OC</th>
                  <th>Proveedor</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in recentOrders" :key="order.id">
                  <td>{{ order.number }}</td>
                  <td>{{ order.supplier }}</td>
                  <td>{{ formatDate(order.date) }}</td>
                  <td>${{ formatNumber(order.total) }}</td>
                  <td>
                    <span :class="getStatusBadgeClass(order.status)">
                      {{ order.status }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-primary" @click="viewOrder(order.id)">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn btn-outline-success" @click="receiveOrder(order.id)" v-if="order.status === 'Enviada'">
                        <i class="fas fa-truck"></i>
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

<script>
import { Chart, registerables } from 'chart.js'
import DashboardLayout from '../../components/DashboardLayout.vue'

Chart.register(...registerables)

export default {
  name: 'PurchasesDashboardView',
  components: {
    DashboardLayout
  },
  data() {
    return {
      kpis: {
        pendingOrders: 12,
        monthlyPurchases: 2450000,
        activeSuppliers: 45,
        pendingReceipts: 8
      },
      recentOrders: [
        {
          id: 1,
          number: 'OC-2024-001',
          supplier: 'Proveedor ABC S.A.S.',
          date: '2024-01-15',
          total: 1250000,
          status: 'Enviada'
        },
        {
          id: 2,
          number: 'OC-2024-002',
          supplier: 'Distribuidora XYZ Ltda.',
          date: '2024-01-14',
          total: 850000,
          status: 'Aprobada'
        },
        {
          id: 3,
          number: 'OC-2024-003',
          supplier: 'Suministros DEF S.A.',
          date: '2024-01-13',
          total: 2100000,
          status: 'Recibida Parcial'
        }
      ]
    }
  },
  mounted() {
    this.initCharts()
  },
  methods: {
    initCharts() {
      this.createOrderStatusChart()
      this.createMonthlyPurchasesChart()
    },
    createOrderStatusChart() {
      const ctx = this.$refs.orderStatusChart.getContext('2d')
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Borrador', 'Enviada', 'Aprobada', 'Recibida', 'Cerrada'],
          datasets: [{
            data: [5, 12, 8, 15, 25],
            backgroundColor: [
              '#6c757d',
              '#ffc107',
              '#17a2b8',
              '#28a745',
              '#dc3545'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      })
    },
    createMonthlyPurchasesChart() {
      const ctx = this.$refs.monthlyPurchasesChart.getContext('2d')
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene'],
          datasets: [{
            label: 'Compras ($)',
            data: [1800000, 2100000, 1950000, 2300000, 2800000, 2450000],
            borderColor: '#007bff',
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            tension: 0.4
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
                  return '$' + value.toLocaleString()
                }
              }
            }
          }
        }
      })
    },
    formatNumber(number) {
      return number.toLocaleString()
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('es-CO')
    },
    getStatusBadgeClass(status) {
      const classes = {
        'Borrador': 'badge bg-secondary',
        'Enviada': 'badge bg-warning',
        'Aprobada': 'badge bg-info',
        'Recibida Parcial': 'badge bg-primary',
        'Recibida': 'badge bg-success',
        'Cerrada': 'badge bg-dark'
      }
      return classes[status] || 'badge bg-secondary'
    },
    viewOrder(id) {
      this.$router.push(`/purchases/orders/${id}`)
    },
    receiveOrder(id) {
      // Lógica para registrar recepción
      console.log('Registrar recepción para OC:', id)
    }
  }
}
</script>
