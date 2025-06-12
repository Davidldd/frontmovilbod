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
            <li class="breadcrumb-item active" aria-current="page">Movimientos</li>
          </ol>
        </nav>
  
        <!-- Rest of the existing content remains the same -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>Movimientos de Inventario</h2>
          </div>
          <div>
            <!-- Add Movement Button -->
            <button class="btn btn-primary">
              <i class="fas fa-plus me-2"></i>
              Agregar Movimiento
            </button>
          </div>
        </div>
  
        <!-- Statistics Cards -->
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Total Entradas</h5>
                <p class="card-text">150</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Total Salidas</h5>
                <p class="card-text">75</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Ajustes</h5>
                <p class="card-text">10</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Transferencias</h5>
                <p class="card-text">5</p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Filters -->
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">Filtros</h5>
            <div class="row">
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="productFilter" class="form-label">Producto</label>
                  <select class="form-select" id="productFilter">
                    <option selected>Todos</option>
                    <option value="1">Producto A</option>
                    <option value="2">Producto B</option>
                    <option value="3">Producto C</option>
                  </select>
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="typeFilter" class="form-label">Tipo de Movimiento</label>
                  <select class="form-select" id="typeFilter">
                    <option selected>Todos</option>
                    <option value="1">Entrada</option>
                    <option value="2">Salida</option>
                    <option value="3">Ajuste</option>
                    <option value="4">Transferencia</option>
                  </select>
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="dateFilter" class="form-label">Rango de Fechas</label>
                  <input type="date" class="form-control" id="dateFilter">
                </div>
              </div>
            </div>
            <button class="btn btn-primary">Aplicar Filtros</button>
          </div>
        </div>
  
        <!-- Movements Table -->
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Lista de Movimientos</h5>
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Producto A</td>
                    <td>Entrada</td>
                    <td>50</td>
                    <td>2024-01-20</td>
                    <td>
                      <button class="btn btn-sm btn-info"><i class="fas fa-eye"></i></button>
                      <button class="btn btn-sm btn-warning"><i class="fas fa-edit"></i></button>
                      <button class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button>
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Producto B</td>
                    <td>Salida</td>
                    <td>25</td>
                    <td>2024-01-21</td>
                    <td>
                      <button class="btn btn-sm btn-info"><i class="fas fa-eye"></i></button>
                      <button class="btn btn-sm btn-warning"><i class="fas fa-edit"></i></button>
                      <button class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button>
                    </td>
                  </tr>
                  <!-- More rows here -->
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
  
  
  // Generate user avatar function
  const generateUserAvatar = (name) => {
    if (!name) return ''
    
    const initials = name.split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
    
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b',
      '#fa709a', '#ffecd2', '#a8edea', '#d299c2', '#89f7fe'
    ]
    
    const colorIndex = name.length % colors.length
    const color = colors[colorIndex]
    
    const svg = `
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="${color}"/>
        <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="600">
          ${initials}
        </text>
      </svg>
    `
    
    return `data:image/svg+xml;base64,${btoa(svg)}`
  }
  
  // Reactive data
  const showFilters = ref(false)
  const currentPage = ref(1)
  const itemsPerPage = ref(20)
  
  const filters = ref({
    type: '',
    product: '',
    dateFrom: '',
    dateTo: ''
  })
  
  const stats = ref({
    todayEntries: 15,
    todayExits: 8,
    transfers: 3,
    adjustments: 2
  })
  
  const movements = ref([
    {
      id: 1,
      date: new Date('2024-01-15T10:30:00'),
      type: 'entrada',
      product: { name: 'Laptop Dell Inspiron', sku: 'LAP-001', unit: 'unidades' },
      quantity: 10,
      location: { name: 'Almacén Principal', code: 'ALM-001' },
      user: { name: 'Juan Pérez' },
      reference: 'PO-2024-001'
    },
    {
      id: 2,
      date: new Date('2024-01-15T11:15:00'),
      type: 'salida',
      product: { name: 'Mouse Inalámbrico', sku: 'MOU-001', unit: 'unidades' },
      quantity: -5,
      location: { name: 'Almacén Principal', code: 'ALM-001' },
      user: { name: 'María García' },
      reference: 'SO-2024-001'
    },
    {
      id: 3,
      date: new Date('2024-01-15T14:20:00'),
      type: 'transferencia',
      product: { name: 'Teclado Mecánico', sku: 'KEY-001', unit: 'unidades' },
      quantity: 3,
      location: { name: 'Almacén Secundario', code: 'ALM-002' },
      user: { name: 'Carlos López' },
      reference: 'TR-2024-001'
    },
    {
      id: 4,
      date: new Date('2024-01-15T15:45:00'),
      type: 'ajuste',
      product: { name: 'Monitor 24"', sku: 'MON-001', unit: 'unidades' },
      quantity: -2,
      location: { name: 'Almacén Principal', code: 'ALM-001' },
      user: { name: 'Ana Rodríguez' },
      reference: 'ADJ-2024-001'
    },
    {
      id: 5,
      date: new Date('2024-01-14T16:30:00'),
      type: 'entrada',
      product: { name: 'Impresora Láser', sku: 'PRI-001', unit: 'unidades' },
      quantity: 5,
      location: { name: 'Almacén Principal', code: 'ALM-001' },
      user: { name: 'Luis Martínez' },
      reference: 'PO-2024-002'
    }
  ])
  
  // Computed properties
  const filteredMovements = computed(() => {
    let filtered = movements.value
  
    if (filters.value.type) {
      filtered = filtered.filter(m => m.type === filters.value.type)
    }
  
    if (filters.value.product) {
      filtered = filtered.filter(m => 
        m.product.name.toLowerCase().includes(filters.value.product.toLowerCase()) ||
        m.product.sku.toLowerCase().includes(filters.value.product.toLowerCase())
      )
    }
  
    if (filters.value.dateFrom) {
      const fromDate = new Date(filters.value.dateFrom)
      filtered = filtered.filter(m => new Date(m.date) >= fromDate)
    }
  
    if (filters.value.dateTo) {
      const toDate = new Date(filters.value.dateTo)
      toDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter(m => new Date(m.date) <= toDate)
    }
  
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
  })
  
  const paginatedMovements = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredMovements.value.slice(start, end)
  })
  
  const totalPages = computed(() => {
    return Math.ceil(filteredMovements.value.length / itemsPerPage.value)
  })
  
  // Methods
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const getMovementTypeClass = (type) => {
    const classes = {
      entrada: 'bg-success',
      salida: 'bg-danger',
      transferencia: 'bg-info',
      ajuste: 'bg-warning'
    }
    return classes[type] || 'bg-secondary'
  }
  
  const getMovementTypeIcon = (type) => {
    const icons = {
      entrada: 'bi bi-arrow-up-circle',
      salida: 'bi bi-arrow-down-circle',
      transferencia: 'bi bi-arrow-left-right',
      ajuste: 'bi bi-gear'
    }
    return icons[type] || 'bi bi-circle'
  }
  
  const getMovementTypeName = (type) => {
    const names = {
      entrada: 'Entrada',
      salida: 'Salida',
      transferencia: 'Transferencia',
      ajuste: 'Ajuste'
    }
    return names[type] || type
  }
  
  const applyFilters = () => {
    currentPage.value = 1
  }
  
  const clearFilters = () => {
    filters.value = {
      type: '',
      product: '',
      dateFrom: '',
      dateTo: ''
    }
    currentPage.value = 1
  }
  
  const exportMovements = () => {
    // TODO: Implement export functionality
    console.log('Exporting movements...')
  }
  
  const viewMovementDetails = (movement) => {
    // TODO: Implement view details functionality
    console.log('Viewing movement details:', movement)
  }
  
  const revertMovement = (movement) => {
    // TODO: Implement revert functionality
    console.log('Reverting movement:', movement)
  }
  
  onMounted(() => {
    // Initialize component
  })
  </script>
  