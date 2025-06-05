<script setup>
import { ref, onMounted } from 'vue'
import { Line, Doughnut, Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js'
import DashboardLayout from "../components/DashboardLayout.vue";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement)

const isLoading = ref(true)
const showWelcome = ref(true)

// Chart Data
const lineChartData = {
  labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
  datasets: [
    {
      label: 'Movimiento de Inventario',
      data: [65, 59, 80, 81, 56, 55],
      fill: false,
      borderColor: '#0d6efd',
      tension: 0.1
    }
  ]
}

const doughnutChartData = {
  labels: ['En Stock', 'Bajo Stock', 'Sin Stock'],
  datasets: [
    {
      data: [300, 50, 100],
      backgroundColor: ['#198754', '#ffc107', '#dc3545']
    }
  ]
}

const barChartData = {
  labels: ['Producto A', 'Producto B', 'Producto C', 'Producto D', 'Producto E'],
  datasets: [
    {
      label: 'Productos más vendidos',
      data: [120, 90, 85, 70, 65],
      backgroundColor: '#0d6efd'
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

// Mock inventory data
const inventoryStats = ref({
  totalProducts: 450,
  lowStock: 50,
  outOfStock: 100,
  recentMovements: 25
})

// Mock recent activities
const recentActivities = ref([
  { id: 1, type: 'entrada', product: 'Laptop Dell XPS', quantity: 10, date: '2024-02-20' },
  { id: 2, type: 'salida', product: 'Monitor LG 27"', quantity: 5, date: '2024-02-19' },
  { id: 3, type: 'ajuste', product: 'Teclado Mecánico', quantity: 3, date: '2024-02-18' },
  { id: 4, type: 'entrada', product: 'Mouse Inalámbrico', quantity: 15, date: '2024-02-17' }
])

onMounted(async () => {

  // Simulate data loading
  await new Promise(resolve => setTimeout(resolve, 1500))
  isLoading.value = false

  // Show welcome alert for 5 seconds
  setTimeout(() => {
    showWelcome.value = false
  }, 5000)
})
</script>

<template>
  <DashboardLayout>
  <div class="min-vh-100 bg-light mt-5 pd-5">
    <!-- Loading Spinner -->
    <div v-if="isLoading" class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white">
      <div class="text-center">
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-3 text-primary">Cargando Dashboard...</p>
      </div>
    </div>

    <!-- Welcome Alert -->
    <div v-if="showWelcome" class="alert alert-success alert-dismissible fade show m-3" role="alert">
      <i class="bi bi-check-circle-fill me-2"></i>
      <strong>¡Bienvenido al Dashboard!</strong> Has iniciado sesión correctamente.
      <button type="button" class="btn-close" @click="showWelcome = false"></button>
    </div>

    <!-- Dashboard Content -->
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3">Dashboard de Inventario</h1>
        <div class="btn-group">
          <button class="btn btn-outline-primary">
            <i class="bi bi-download me-2"></i>Exportar
          </button>
          <button class="btn btn-primary">
            <i class="bi bi-plus-lg me-2"></i>Nuevo Producto
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-md-6 col-lg-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-muted mb-2">Total Productos</h6>
                  <h3 class="mb-0">{{ inventoryStats.totalProducts }}</h3>
                </div>
                <div class="bg-primary bg-opacity-10 p-3 rounded">
                  <i class="bi bi-box-seam text-primary fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 col-lg-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-muted mb-2">Bajo Stock</h6>
                  <h3 class="mb-0">{{ inventoryStats.lowStock }}</h3>
                </div>
                <div class="bg-warning bg-opacity-10 p-3 rounded">
                  <i class="bi bi-exclamation-triangle text-warning fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 col-lg-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-muted mb-2">Sin Stock</h6>
                  <h3 class="mb-0">{{ inventoryStats.outOfStock }}</h3>
                </div>
                <div class="bg-danger bg-opacity-10 p-3 rounded">
                  <i class="bi bi-x-circle text-danger fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 col-lg-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-muted mb-2">Movimientos Recientes</h6>
                  <h3 class="mb-0">{{ inventoryStats.recentMovements }}</h3>
                </div>
                <div class="bg-success bg-opacity-10 p-3 rounded">
                  <i class="bi bi-arrow-left-right text-success fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Movimiento de Inventario</h5>
              <div style="height: 300px">
                <Line :data="lineChartData" :options="chartOptions" />
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Estado del Inventario</h5>
              <div style="height: 300px">
                <Doughnut :data="doughnutChartData" :options="chartOptions" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Row -->
      <div class="row g-3">
        <div class="col-12 col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Productos más vendidos</h5>
              <div style="height: 300px">
                <Bar :data="barChartData" :options="chartOptions" />
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Actividad Reciente</h5>
              <div class="list-group list-group-flush">
                <div v-for="activity in recentActivities" :key="activity.id" class="list-group-item px-0">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 class="mb-1">{{ activity.product }}</h6>
                      <small class="text-muted">
                        <i class="bi" :class="{
                          'bi-arrow-down-circle text-success': activity.type === 'entrada',
                          'bi-arrow-up-circle text-danger': activity.type === 'salida',
                          'bi-arrow-repeat text-warning': activity.type === 'ajuste'
                        }"></i>
                        {{ activity.type.charAt(0).toUpperCase() + activity.type.slice(1) }} -
                        Cantidad: {{ activity.quantity }}
                      </small>
                    </div>
                    <small class="text-muted">{{ activity.date }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    </DashboardLayout>
</template>