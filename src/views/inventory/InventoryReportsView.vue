<template>
    <DashboardLayout>
      <!-- Move all the existing content inside DashboardLayout -->
      <div class="container-fluid">
        <nav aria-label="breadcrumb" class="mb-4">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link to="/dashboard" class="text-decoration-none">Dashboard</router-link>
            </li>
            <li class="breadcrumb-item">
              <router-link to="/inventory/dashboard" class="text-decoration-none">Inventario</router-link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">Reportes</li>
          </ol>
        </nav>
  
        <!-- Rest of the existing content remains the same -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>Reportes de Inventario</h2>
          </div>
          <div>
            <!-- Add Report Button -->
            <button class="btn btn-primary">
              <i class="fa fa-plus"></i> Generar Reporte
            </button>
          </div>
        </div>
  
        <!-- Quick Stats -->
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Productos en Stock</h5>
                <p class="card-text">150</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Valor Total del Inventario</h5>
                <p class="card-text">$50,000</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Productos por Agotarse</h5>
                <p class="card-text">20</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Último Reporte Generado</h5>
                <p class="card-text">Ayer</p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Reports Categories -->
        <div class="row mb-4">
          <div class="col-md-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Reporte de Ventas</h5>
                <p class="card-text">Genera un reporte detallado de las ventas.</p>
                <button class="btn btn-secondary">Generar</button>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Reporte de Inventario Actual</h5>
                <p class="card-text">Muestra el estado actual del inventario.</p>
                <button class="btn btn-secondary">Generar</button>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Reporte de Productos por Agotarse</h5>
                <p class="card-text">Lista de productos con stock bajo.</p>
                <button class="btn btn-secondary">Generar</button>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Recent Reports -->
        <div class="card">
          <div class="card-header">
            Reportes Recientes
          </div>
          <div class="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Reporte de Ventas Mensual</td>
                  <td>2024-01-30</td>
                  <td>Ventas</td>
                  <td>
                    <button class="btn btn-sm btn-info">Ver</button>
                    <button class="btn btn-sm btn-danger">Eliminar</button>
                  </td>
                </tr>
                <tr>
                  <td>Reporte de Inventario Semanal</td>
                  <td>2024-02-05</td>
                  <td>Inventario</td>
                  <td>
                    <button class="btn btn-sm btn-info">Ver</button>
                    <button class="btn btn-sm btn-danger">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import DashboardLayout from '../../components/DashboardLayout.vue'


  // Reactive data
  const stats = ref({
    totalProducts: 1247,
    totalValue: 2456789,
    lowStock: 23,
    zeroStock: 5,
    turnoverRate: 4.2,
    slowMoving: 18
  })
  
  const recentReports = ref([
    {
      id: 1,
      name: 'Stock Actual - Enero 2024',
      date: new Date('2024-01-15T10:30:00'),
      type: 'stock-current'
    },
    {
      id: 2,
      name: 'Análisis ABC - Q4 2023',
      date: new Date('2024-01-10T14:20:00'),
      type: 'abc-analysis'
    },
    {
      id: 3,
      name: 'Movimientos Detallados - Diciembre',
      date: new Date('2024-01-05T09:15:00'),
      type: 'movements-detailed'
    }
  ])
  
  // Methods
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const generateReport = (type) => {
    // TODO: Implement report generation
    console.log('Generating report:', type)
    
    // Simulate report generation
    const reportName = getReportName(type)
    alert(`Generando reporte: ${reportName}`)
  }
  
  const getReportName = (type) => {
    const names = {
      'stock-current': 'Stock Actual',
      'stock-low': 'Stock Bajo',
      'stock-zero': 'Stock Cero',
      'stock-valuation': 'Valoración de Inventario',
      'movements-summary': 'Resumen de Movimientos',
      'movements-detailed': 'Movimientos Detallados',
      'transfers': 'Transferencias',
      'adjustments': 'Ajustes de Inventario',
      'abc-analysis': 'Análisis ABC',
      'turnover-analysis': 'Rotación de Inventario',
      'slow-moving': 'Productos de Lento Movimiento',
      'forecast': 'Pronóstico de Demanda'
    }
    return names[type] || type
  }
  
  const generateCustomReport = () => {
    // TODO: Implement custom report builder
    console.log('Opening custom report builder...')
  }
  
  const scheduleReport = () => {
    // TODO: Implement report scheduling
    console.log('Opening report scheduler...')
  }
  
  const downloadReport = (report) => {
    // TODO: Implement report download
    console.log('Downloading report:', report)
  }
  
  const viewReport = (report) => {
    // TODO: Implement report viewer
    console.log('Viewing report:', report)
  }
  
  onMounted(() => {
    // Initialize component
  })
  </script>
  