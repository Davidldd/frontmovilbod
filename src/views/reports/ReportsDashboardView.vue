<template>
    <DashboardLayout>
      <div class="container-fluid">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h3 mb-0">Centro de Reportes</h1>
            <p class="text-muted">Análisis y reportes de toda la organización</p>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-primary">
              <i class="bi bi-download"></i>
              Exportar Todo
            </button>
            <button class="btn btn-primary" @click="$router.push('/reports/builder')">
              <i class="bi bi-plus-lg"></i>
              Nuevo Reporte
            </button>
          </div>
        </div>
  
        <!-- KPIs -->
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card bg-primary text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6 class="card-title">Reportes Generados</h6>
                    <h3 class="mb-0">{{ stats.totalReports }}</h3>
                  </div>
                  <i class="bi bi-file-earmark-text fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-success text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6 class="card-title">Reportes Activos</h6>
                    <h3 class="mb-0">{{ stats.activeReports }}</h3>
                  </div>
                  <i class="bi bi-graph-up fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-warning text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6 class="card-title">Programados</h6>
                    <h3 class="mb-0">{{ stats.scheduledReports }}</h3>
                  </div>
                  <i class="bi bi-clock fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-info text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6 class="card-title">Usuarios Activos</h6>
                    <h3 class="mb-0">{{ stats.activeUsers }}</h3>
                  </div>
                  <i class="bi bi-people fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Gráficos Principales -->
        <div class="row mb-4">
          <div class="col-lg-8">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0">Tendencia de Reportes Generados</h5>
              </div>
              <div class="card-body">
                <canvas id="reportsChart" height="300"></canvas>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0">Tipos de Reportes</h5>
              </div>
              <div class="card-body">
                <canvas id="typesChart" height="300"></canvas>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Accesos Rápidos -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0">Accesos Rápidos</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-3 mb-3" v-for="shortcut in shortcuts" :key="shortcut.id">
                    <div class="card border-0 bg-light h-100 shortcut-card" @click="$router.push(shortcut.route)">
                      <div class="card-body text-center">
                        <i :class="shortcut.icon" class="fs-1 text-primary mb-3"></i>
                        <h6 class="card-title">{{ shortcut.title }}</h6>
                        <p class="card-text text-muted small">{{ shortcut.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Reportes Recientes -->
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">Reportes Recientes</h5>
                <button class="btn btn-sm btn-outline-primary">Ver Todos</button>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Reporte</th>
                        <th>Tipo</th>
                        <th>Generado por</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="report in recentReports" :key="report.id">
                        <td>
                          <strong>{{ report.name }}</strong>
                          <br>
                          <small class="text-muted">{{ report.description }}</small>
                        </td>
                        <td>
                          <span class="badge" :class="getTypeBadgeClass(report.type)">
                            {{ report.type }}
                          </span>
                        </td>
                        <td>{{ report.createdBy }}</td>
                        <td>{{ formatDate(report.createdAt) }}</td>
                        <td>
                          <span class="badge" :class="getStatusBadgeClass(report.status)">
                            {{ report.status }}
                          </span>
                        </td>
                        <td>
                          <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" @click="viewReport(report)">
                              <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-outline-success" @click="downloadReport(report)">
                              <i class="bi bi-download"></i>
                            </button>
                            <button class="btn btn-outline-secondary" @click="shareReport(report)">
                              <i class="bi bi-share"></i>
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
        </div>
      </div>
    </DashboardLayout>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import DashboardLayout from '../../components/DashboardLayout.vue'
  
  const stats = ref({
    totalReports: 156,
    activeReports: 23,
    scheduledReports: 8,
    activeUsers: 45
  })
  
  const shortcuts = ref([
    {
      id: 1,
      title: 'Reportes de Ventas',
      description: 'Análisis de ventas y tendencias',
      icon: 'bi bi-graph-up-arrow',
      route: '/reports/sales'
    },
    {
      id: 2,
      title: 'Reportes de Inventario',
      description: 'Stock y movimientos',
      icon: 'bi bi-boxes',
      route: '/reports/inventory'
    },
    {
      id: 3,
      title: 'Reportes Financieros',
      description: 'Estados financieros',
      icon: 'bi bi-currency-dollar',
      route: '/reports/financial'
    },
    {
      id: 4,
      title: 'Constructor',
      description: 'Crear reportes personalizados',
      icon: 'bi bi-tools',
      route: '/reports/builder'
    }
  ])
  
  const recentReports = ref([
    {
      id: 1,
      name: 'Ventas Mensuales',
      description: 'Reporte de ventas del mes actual',
      type: 'Ventas',
      createdBy: 'Juan Pérez',
      createdAt: new Date('2024-01-15'),
      status: 'Completado'
    },
    {
      id: 2,
      name: 'Stock Bajo',
      description: 'Productos con stock mínimo',
      type: 'Inventario',
      createdBy: 'María García',
      createdAt: new Date('2024-01-14'),
      status: 'Procesando'
    },
    {
      id: 3,
      name: 'Balance General',
      description: 'Estado financiero mensual',
      type: 'Financiero',
      createdBy: 'Carlos López',
      createdAt: new Date('2024-01-13'),
      status: 'Completado'
    }
  ])
  
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  const getTypeBadgeClass = (type) => {
    const classes = {
      'Ventas': 'bg-success',
      'Inventario': 'bg-warning',
      'Financiero': 'bg-info',
      'CRM': 'bg-primary'
    }
    return classes[type] || 'bg-secondary'
  }
  
  const getStatusBadgeClass = (status) => {
    const classes = {
      'Completado': 'bg-success',
      'Procesando': 'bg-warning',
      'Error': 'bg-danger',
      'Pendiente': 'bg-secondary'
    }
    return classes[status] || 'bg-secondary'
  }
  
  const viewReport = (report) => {
    console.log('Ver reporte:', report)
  }
  
  const downloadReport = (report) => {
    console.log('Descargar reporte:', report)
  }
  
  const shareReport = (report) => {
    console.log('Compartir reporte:', report)
  }
  
  onMounted(() => {
    // Inicializar gráficos aquí si usas Chart.js
  })
  </script>
  
  <style scoped>
  .shortcut-card {
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .shortcut-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }
  </style>
  