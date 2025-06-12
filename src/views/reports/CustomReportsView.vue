<template>
    <DashboardLayout>
      <div class="container-fluid">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h3 mb-0">Reportes Personalizados</h1>
            <p class="text-muted">Gestiona y ejecuta tus reportes personalizados</p>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-primary" @click="importReport">
              <i class="bi bi-upload"></i>
              Importar
            </button>
            <button class="btn btn-primary" @click="$router.push('/reports/builder')">
              <i class="bi bi-plus-lg"></i>
              Nuevo Reporte
            </button>
          </div>
        </div>
  
        <!-- Filtros -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row">
              <div class="col-md-3">
                <label class="form-label">Categoría</label>
                <select class="form-select" v-model="filters.category">
                  <option value="">Todas</option>
                  <option value="sales">Ventas</option>
                  <option value="inventory">Inventario</option>
                  <option value="financial">Financiero</option>
                  <option value="crm">CRM</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Estado</label>
                <select class="form-select" v-model="filters.status">
                  <option value="">Todos</option>
                  <option value="active">Activo</option>
                  <option value="draft">Borrador</option>
                  <option value="archived">Archivado</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Creado por</label>
                <select class="form-select" v-model="filters.createdBy">
                  <option value="">Todos</option>
                  <option value="1">Juan Pérez</option>
                  <option value="2">María García</option>
                  <option value="3">Carlos López</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Buscar</label>
                <input type="text" class="form-control" placeholder="Nombre del reporte..." v-model="searchTerm">
              </div>
            </div>
          </div>
        </div>
  
        <!-- Lista de Reportes -->
        <div class="row">
          <div class="col-md-4 mb-4" v-for="report in filteredReports" :key="report.id">
            <div class="card h-100">
              <div class="card-header d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                  <i :class="getCategoryIcon(report.category)" class="me-2"></i>
                  <span class="badge" :class="getCategoryBadgeClass(report.category)">
                    {{ getCategoryName(report.category) }}
                  </span>
                </div>
                <div class="dropdown">
                  <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" 
                          :data-bs-toggle="'dropdown'" :aria-expanded="false">
                    <i class="bi bi-three-dots"></i>
                  </button>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#" @click="runReport(report)">
                      <i class="bi bi-play"></i> Ejecutar
                    </a></li>
                    <li><a class="dropdown-item" href="#" @click="editReport(report)">
                      <i class="bi bi-pencil"></i> Editar
                    </a></li>
                    <li><a class="dropdown-item" href="#" @click="duplicateReport(report)">
                      <i class="bi bi-copy"></i> Duplicar
                    </a></li>
                    <li><a class="dropdown-item" href="#" @click="scheduleReport(report)">
                      <i class="bi bi-clock"></i> Programar
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" @click="deleteReport(report)">
                      <i class="bi bi-trash"></i> Eliminar
                    </a></li>
                  </ul>
                </div>
              </div>
              <div class="card-body">
                <h5 class="card-title">{{ report.name }}</h5>
                <p class="card-text text-muted">{{ report.description }}</p>
                
                <div class="mb-3">
                  <small class="text-muted">
                    <i class="bi bi-person"></i> {{ report.createdBy }}
                    <br>
                    <i class="bi bi-calendar"></i> {{ formatDate(report.createdAt) }}
                    <br>
                    <i class="bi bi-clock-history"></i> Última ejecución: {{ formatDate(report.lastRun) }}
                  </small>
                </div>
  
                <div class="d-flex justify-content-between align-items-center">
                  <span class="badge" :class="getStatusBadgeClass(report.status)">
                    {{ getStatusName(report.status) }}
                  </span>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-primary" @click="runReport(report)">
                      <i class="bi bi-play"></i>
                    </button>
                    <button class="btn btn-outline-primary" @click="viewResults(report)">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-secondary" @click="shareReport(report)">
                      <i class="bi bi-share"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="card-footer bg-transparent" v-if="report.schedule">
                <small class="text-muted">
                  <i class="bi bi-arrow-repeat"></i>
                  Programado: {{ report.schedule }}
                </small>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Modal de Programación -->
        <div class="modal fade" id="scheduleModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Programar Reporte</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <form>
                  <div class="mb-3">
                    <label class="form-label">Frecuencia</label>
                    <select class="form-select" v-model="scheduleForm.frequency">
                      <option value="daily">Diario</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensual</option>
                      <option value="quarterly">Trimestral</option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Hora de Ejecución</label>
                    <input type="time" class="form-control" v-model="scheduleForm.time">
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Destinatarios</label>
                    <textarea class="form-control" rows="3" 
                              placeholder="Ingresa los emails separados por comas"
                              v-model="scheduleForm.recipients"></textarea>
                  </div>
                  <div class="mb-3">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" v-model="scheduleForm.active">
                      <label class="form-check-label">
                        Activar programación
                      </label>
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" @click="saveSchedule">Guardar</button>
              </div>
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
    category: '',
    status: '',
    createdBy: '',
  })
  
  const searchTerm = ref('')
  const selectedReport = ref(null)
  
  const scheduleForm = ref({
    frequency: 'monthly',
    time: '09:00',
    recipients: '',
    active: true
  })
  
  const customReports = ref([
    {
      id: 1,
      name: 'Análisis de Ventas por Región',
      description: 'Reporte detallado de ventas segmentado por regiones geográficas',
      category: 'sales',
      status: 'active',
      createdBy: 'Juan Pérez',
      createdAt: new Date('2024-01-10'),
      lastRun: new Date('2024-01-15'),
      schedule: 'Mensual - 1er día a las 09:00'
    },
    {
      id: 2,
      name: 'Stock Crítico por Almacén',
      description: 'Productos con stock bajo el mínimo por ubicación',
      category: 'inventory',
      status: 'active',
      createdBy: 'María García',
      createdAt: new Date('2024-01-08'),
      lastRun: new Date('2024-01-14'),
      schedule: 'Semanal - Lunes a las 08:00'
    },
    {
      id: 3,
      name: 'Flujo de Caja Proyectado',
      description: 'Proyección de flujo de caja para los próximos 3 meses',
      category: 'financial',
      status: 'draft',
      createdBy: 'Carlos López',
      createdAt: new Date('2024-01-12'),
      lastRun: new Date('2024-01-13'),
      schedule: null
    },
    {
      id: 4,
      name: 'Seguimiento de Leads',
      description: 'Estado y conversión de leads por fuente',
      category: 'crm',
      status: 'active',
      createdBy: 'Ana Martínez',
      createdAt: new Date('2024-01-05'),
      lastRun: new Date('2024-01-15'),
      schedule: 'Diario a las 18:00'
    }
  ])
  
  const filteredReports = computed(() => {
    let filtered = customReports.value
  
    if (filters.value.category) {
      filtered = filtered.filter(report => report.category === filters.value.category)
    }
  
    if (filters.value.status) {
      filtered = filtered.filter(report => report.status === filters.value.status)
    }
  
    if (filters.value.createdBy) {
      filtered = filtered.filter(report => report.createdBy === filters.value.createdBy)
    }
  
    if (searchTerm.value) {
      filtered = filtered.filter(report => 
        report.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.value.toLowerCase())
      )
    }
  
    return filtered
  })
  
  const getCategoryIcon = (category) => {
    const icons = {
      'sales': 'bi bi-graph-up-arrow text-success',
      'inventory': 'bi bi-boxes text-warning',
      'financial': 'bi bi-currency-dollar text-info',
      'crm': 'bi bi-people text-primary'
    }
    return icons[category] || 'bi bi-file-earmark-text'
  }
  
  const getCategoryBadgeClass = (category) => {
    const classes = {
      'sales': 'bg-success',
      'inventory': 'bg-warning',
      'financial': 'bg-info',
      'crm': 'bg-primary'
    }
    return classes[category] || 'bg-secondary'
  }
  
  const getCategoryName = (category) => {
    const names = {
      'sales': 'Ventas',
      'inventory': 'Inventario',
      'financial': 'Financiero',
      'crm': 'CRM'
    }
    return names[category] || 'General'
  }
  
  const getStatusBadgeClass = (status) => {
    const classes = {
      'active': 'bg-success',
      'draft': 'bg-warning',
      'archived': 'bg-secondary'
    }
    return classes[status] || 'bg-secondary'
  }
  
  const getStatusName = (status) => {
    const names = {
      'active': 'Activo',
      'draft': 'Borrador',
      'archived': 'Archivado'
    }
    return names[status] || 'Desconocido'
  }
  
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  const runReport = (report) => {
    console.log('Ejecutando reporte:', report)
    // Aquí iría la lógica para ejecutar el reporte
  }
  
  const editReport = (report) => {
    console.log('Editando reporte:', report)
    // Redirigir al constructor con el ID del reporte
  }
  
  const duplicateReport = (report) => {
    console.log('Duplicando reporte:', report)
  }
  
  const scheduleReport = (report) => {
    selectedReport.value = report
    // Mostrar modal de programación
  }
  
  const deleteReport = (report) => {
    if (confirm('¿Estás seguro de que deseas eliminar este reporte?')) {
      const index = customReports.value.findIndex(r => r.id === report.id)
      if (index > -1) {
        customReports.value.splice(index, 1)
      }
    }
  }
  
  const viewResults = (report) => {
    console.log('Ver resultados de:', report)
  }
  
  const shareReport = (report) => {
    console.log('Compartir reporte:', report)
  }
  
  const importReport = () => {
    console.log('Importar reporte')
  }
  
  const saveSchedule = () => {
    console.log('Guardando programación:', scheduleForm.value)
    // Aquí iría la lógica para guardar la programación
  }
  
  onMounted(() => {
    // Inicialización si es necesaria
  })
  </script>
  