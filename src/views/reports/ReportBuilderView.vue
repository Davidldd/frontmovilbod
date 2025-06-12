<template>
    <DashboardLayout>
      <div class="container-fluid">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h3 mb-0">Constructor de Reportes</h1>
            <p class="text-muted">Crea reportes personalizados de forma visual</p>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-secondary" @click="previewReport">
              <i class="bi bi-eye"></i>
              Vista Previa
            </button>
            <button class="btn btn-outline-primary" @click="saveAsDraft">
              <i class="bi bi-file-earmark"></i>
              Guardar Borrador
            </button>
            <button class="btn btn-primary" @click="saveReport">
              <i class="bi bi-check-lg"></i>
              Guardar Reporte
            </button>
          </div>
        </div>
  
        <div class="row">
          <!-- Panel de Configuración -->
          <div class="col-lg-4">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0">Configuración del Reporte</h5>
              </div>
              <div class="card-body">
                <!-- Información Básica -->
                <div class="mb-4">
                  <h6 class="fw-bold">Información Básica</h6>
                  <div class="mb-3">
                    <label class="form-label">Nombre del Reporte</label>
                    <input type="text" class="form-control" v-model="reportConfig.name" 
                           placeholder="Ej: Ventas por Región">
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Descripción</label>
                    <textarea class="form-control" rows="3" v-model="reportConfig.description"
                              placeholder="Describe el propósito del reporte"></textarea>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Categoría</label>
                    <select class="form-select" v-model="reportConfig.category">
                      <option value="sales">Ventas</option>
                      <option value="inventory">Inventario</option>
                      <option value="financial">Financiero</option>
                      <option value="crm">CRM</option>
                    </select>
                  </div>
                </div>
  
                <!-- Fuente de Datos -->
                <div class="mb-4">
                  <h6 class="fw-bold">Fuente de Datos</h6>
                  <div class="mb-3">
                    <label class="form-label">Tabla Principal</label>
                    <select class="form-select" v-model="reportConfig.mainTable" @change="loadTableFields">
                      <option value="">Seleccionar tabla...</option>
                      <option value="sales">Ventas</option>
                      <option value="products">Productos</option>
                      <option value="customers">Clientes</option>
                      <option value="inventory">Inventario</option>
                      <option value="accounting">Contabilidad</option>
                    </select>
                  </div>
                  <div class="mb-3" v-if="availableFields.length > 0">
                    <label class="form-label">Campos Disponibles</label>
                    <div class="border rounded p-2" style="max-height: 200px; overflow-y: auto;">
                      <div class="form-check" v-for="field in availableFields" :key="field.name">
                        <input class="form-check-input" type="checkbox" 
                               :value="field" v-model="reportConfig.selectedFields">
                        <label class="form-check-label">
                          {{ field.label }}
                          <small class="text-muted">({{ field.type }})</small>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
  
                <!-- Filtros -->
                <div class="mb-4">
                  <h6 class="fw-bold d-flex justify-content-between align-items-center">
                    Filtros
                    <button class="btn btn-sm btn-outline-primary" @click="addFilter">
                      <i class="bi bi-plus"></i>
                    </button>
                  </h6>
                  <div class="mb-2" v-for="(filter, index) in reportConfig.filters" :key="index">
                    <div class="card card-body p-2">
                      <div class="row g-2">
                        <div class="col-4">
                          <select class="form-select form-select-sm" v-model="filter.field">
                            <option value="">Campo...</option>
                            <option v-for="field in availableFields" :key="field.name" :value="field.name">
                              {{ field.label }}
                            </option>
                          </select>
                        </div>
                        <div class="col-3">
                          <select class="form-select form-select-sm" v-model="filter.operator">
                            <option value="equals">Igual</option>
                            <option value="not_equals">Diferente</option>
                            <option value="greater">Mayor</option>
                            <option value="less">Menor</option>
                            <option value="contains">Contiene</option>
                          </select>
                        </div>
                        <div class="col-4">
                          <input type="text" class="form-control form-control-sm" 
                                 v-model="filter.value" placeholder="Valor...">
                        </div>
                        <div class="col-1">
                          <button class="btn btn-sm btn-outline-danger" @click="removeFilter(index)">
                            <i class="bi bi-x"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
  
                <!-- Agrupación y Ordenamiento -->
                <div class="mb-4">
                  <h6 class="fw-bold">Agrupación y Ordenamiento</h6>
                  <div class="mb-3">
                    <label class="form-label">Agrupar por</label>
                    <select class="form-select" v-model="reportConfig.groupBy">
                      <option value="">Sin agrupación</option>
                      <option v-for="field in availableFields" :key="field.name" :value="field.name">
                        {{ field.label }}
                      </option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Ordenar por</label>
                    <div class="row g-2">
                      <div class="col-8">
                        <select class="form-select" v-model="reportConfig.orderBy">
                          <option value="">Sin ordenamiento</option>
                          <option v-for="field in availableFields" :key="field.name" :value="field.name">
                            {{ field.label }}
                          </option>
                        </select>
                      </div>
                      <div class="col-4">
                        <select class="form-select" v-model="reportConfig.orderDirection">
                          <option value="asc">ASC</option>
                          <option value="desc">DESC</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
  
                <!-- Formato de Salida -->
                <div class="mb-4">
                  <h6 class="fw-bold">Formato de Salida</h6>
                  <div class="mb-3">
                    <label class="form-label">Tipo de Visualización</label>
                    <select class="form-select" v-model="reportConfig.visualizationType">
                      <option value="table">Tabla</option>
                      <option value="chart">Gráfico</option>
                      <option value="both">Tabla y Gráfico</option>
                    </select>
                  </div>
                  <div class="mb-3" v-if="reportConfig.visualizationType !== 'table'">
                    <label class="form-label">Tipo de Gráfico</label>
                    <select class="form-select" v-model="reportConfig.chartType">
                      <option value="bar">Barras</option>
                      <option value="line">Líneas</option>
                      <option value="pie">Circular</option>
                      <option value="doughnut">Dona</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Vista Previa -->
          <div class="col-lg-8">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0">Vista Previa del Reporte</h5>
              </div>
              <div class="card-body">
                <div v-if="!reportConfig.name" class="text-center text-muted py-5">
                  <i class="bi bi-file-earmark-text display-1"></i>
                  <h4>Configura tu reporte</h4>
                  <p>Completa la configuración en el panel izquierdo para ver la vista previa</p>
                </div>
                
                <div v-else>
                  <!-- Información del Reporte -->
                  <div class="mb-4">
                    <h4>{{ reportConfig.name }}</h4>
                    <p class="text-muted">{{ reportConfig.description }}</p>
                    <span class="badge bg-primary">{{ getCategoryName(reportConfig.category) }}</span>
                  </div>
  
                  <!-- Campos Seleccionados -->
                  <div class="mb-4" v-if="reportConfig.selectedFields.length > 0">
                    <h6>Campos Incluidos:</h6>
                    <div class="d-flex flex-wrap gap-2">
                      <span class="badge bg-light text-dark border" 
                            v-for="field in reportConfig.selectedFields" :key="field.name">
                        {{ field.label }}
                      </span>
                    </div>
                  </div>
  
                  <!-- Filtros Aplicados -->
                  <div class="mb-4" v-if="reportConfig.filters.length > 0">
                    <h6>Filtros Aplicados:</h6>
                    <div class="list-group list-group-flush">
                      <div class="list-group-item px-0" v-for="filter in reportConfig.filters" :key="filter.field">
                        <small>
                          <strong>{{ getFieldLabel(filter.field) }}</strong> 
                          {{ getOperatorLabel(filter.operator) }} 
                          <em>{{ filter.value }}</em>
                        </small>
                      </div>
                    </div>
                  </div>
  
                  <!-- Vista Previa de Datos -->
                  <div class="mb-4">
                    <h6>Vista Previa de Datos:</h6>
                    <div class="table-responsive">
                      <table class="table table-sm table-bordered">
                        <thead class="table-light">
                          <tr>
                            <th v-for="field in reportConfig.selectedFields" :key="field.name">
                              {{ field.label }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="row in previewData" :key="row.id">
                            <td v-for="field in reportConfig.selectedFields" :key="field.name">
                              {{ row[field.name] }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <small class="text-muted">Mostrando datos de ejemplo</small>
                  </div>
  
                  <!-- Vista Previa de Gráfico -->
                  <div v-if="reportConfig.visualizationType !== 'table'">
                    <h6>Vista Previa de Gráfico:</h6>
                    <div class="border rounded p-3 text-center bg-light">
                      <i class="bi bi-bar-chart display-4 text-muted"></i>
                      <p class="text-muted mt-2">
                        Gráfico de {{ getChartTypeName(reportConfig.chartType) }}
                        <br>
                        <small>Se generará al ejecutar el reporte</small>
                      </p>
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
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import DashboardLayout from '../../components/DashboardLayout.vue'
  
  const reportConfig = ref({
    name: '',
    description: '',
    category: 'sales',
    mainTable: '',
    selectedFields: [],
    filters: [],
    groupBy: '',
    orderBy: '',
    orderDirection: 'asc',
    visualizationType: 'table',
    chartType: 'bar'
  })
  
  const availableFields = ref([])
  
  const previewData = ref([
    { id: 1, name: 'Producto A', sales: 1500, date: '2024-01-15' },
    { id: 2, name: 'Producto B', sales: 1200, date: '2024-01-14' },
    { id: 3, name: 'Producto C', sales: 980, date: '2024-01-13' }
  ])
  
  const tableFields = {
    sales: [
      { name: 'id', label: 'ID', type: 'number' },
      { name: 'order_number', label: 'Número de Orden', type: 'text' },
      { name: 'customer_name', label: 'Cliente', type: 'text' },
      { name: 'total_amount', label: 'Monto Total', type: 'currency' },
      { name: 'sale_date', label: 'Fecha de Venta', type: 'date' },
      { name: 'status', label: 'Estado', type: 'text' }
    ],
    products: [
      { name: 'id', label: 'ID', type: 'number' },
      { name: 'name', label: 'Nombre', type: 'text' },
      { name: 'category', label: 'Categoría', type: 'text' },
      { name: 'price', label: 'Precio', type: 'currency' },
      { name: 'stock', label: 'Stock', type: 'number' }
    ],
    customers: [
      { name: 'id', label: 'ID', type: 'number' },
      { name: 'name', label: 'Nombre', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Teléfono', type: 'text' },
      { name: 'city', label: 'Ciudad', type: 'text' }
    ]
  }
  
  const loadTableFields = () => {
    if (reportConfig.value.mainTable && tableFields[reportConfig.value.mainTable]) {
      availableFields.value = tableFields[reportConfig.value.mainTable]
      reportConfig.value.selectedFields = []
    }
  }
  
  const addFilter = () => {
    reportConfig.value.filters.push({
      field: '',
      operator: 'equals',
      value: ''
    })
  }
  
  const removeFilter = (index) => {
    reportConfig.value.filters.splice(index, 1)
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
  
  const getFieldLabel = (fieldName) => {
    const field = availableFields.value.find(f => f.name === fieldName)
    return field ? field.label : fieldName
  }
  
  const getOperatorLabel = (operator) => {
    const labels = {
      'equals': 'es igual a',
      'not_equals': 'es diferente de',
      'greater': 'es mayor que',
      'less': 'es menor que',
      'contains': 'contiene'
    }
    return labels[operator] || operator
  }
  
  const getChartTypeName = (chartType) => {
    const names = {
      'bar': 'Barras',
      'line': 'Líneas',
      'pie': 'Circular',
      'doughnut': 'Dona'
    }
    return names[chartType] || chartType
  }
  
  const previewReport = () => {
    console.log('Vista previa del reporte:', reportConfig.value)
  }
  
  const saveAsDraft = () => {
    console.log('Guardando como borrador:', reportConfig.value)
  }
  
  const saveReport = () => {
    if (!reportConfig.value.name) {
      alert('Por favor ingresa un nombre para el reporte')
      return
    }
    
    if (reportConfig.value.selectedFields.length === 0) {
      alert('Por favor selecciona al menos un campo')
      return
    }
    
    console.log('Guardando reporte:', reportConfig.value)
    // Aquí iría la lógica para guardar el reporte
  }
  
  onMounted(() => {
    // Inicialización si es necesaria
  })
  </script>
  