<template>
    <DashboardLayout>
      <div class="container-fluid">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h3 mb-0">Reportes de Inventario</h1>
            <p class="text-muted">Análisis de stock, movimientos y valorización</p>
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
                <label class="form-label">Almacén</label>
                <select class="form-select" v-model="filters.warehouse">
                  <option value="">Todos</option>
                  <option value="1">Almacén Principal</option>
                  <option value="2">Almacén Secundario</option>
                  <option value="3">Almacén Norte</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Categoría</label>
                <select class="form-select" v-model="filters.category">
                  <option value="">Todas</option>
                  <option value="1">Electrónicos</option>
                  <option value="2">Ropa</option>
                  <option value="3">Hogar</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Estado</label>
                <select class="form-select" v-model="filters.status">
                  <option value="">Todos</option>
                  <option value="active">Activo</option>
                  <option value="low">Stock Bajo</option>
                  <option value="out">Sin Stock</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Período</label>
                <select class="form-select" v-model="filters.period">
                  <option value="month">Este Mes</option>
                  <option value="quarter">Trimestre</option>
                  <option value="year">Año</option>
                </select>
              </div>
            </div>
          </div>
        </div>
  
        <!-- KPIs de Inventario -->
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card bg-primary text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6 class="card-title">Valor Total</h6>
                    <h3 class="mb-0">${{ formatCurrency(inventoryKPIs.totalValue) }}</h3>
                    <small class="opacity-75">
                      <i class="bi bi-arrow-up"></i> +5.2% vs mes anterior
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
                    <h6 class="card-title">Productos Activos</h6>
                    <h3 class="mb-0">{{ inventoryKPIs.activeProducts }}</h3>
                    <small class="opacity-75">
                      <i class="bi bi-arrow-up"></i> +12 nuevos productos
                    </small>
                  </div>
                  <i class="bi bi-box-seam fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-warning text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6 class="card-title">Stock Bajo</h6>
                    <h3 class="mb-0">{{ inventoryKPIs.lowStock }}</h3>
                    <small class="opacity-75">
                      <i class="bi bi-exclamation-triangle"></i> Requiere atención
                    </small>
                  </div>
                  <i class="bi bi-exclamation-triangle fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-danger text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6 class="card-title">Sin Stock</h6>
                    <h3 class="mb-0">{{ inventoryKPIs.outOfStock }}</h3>
                    <small class="opacity-75">
                      <i class="bi bi-x-circle"></i> Productos agotados
                    </small>
                  </div>
                  <i class="bi bi-x-circle fs-1 opacity-50"></i>
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
                <h5 class="card-title mb-0">Movimientos de Inventario</h5>
              </div>
              <div class="card-body">
                <canvas id="movementsChart" height="300"></canvas>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0">Distribución por Categoría</h5>
              </div>
              <div class="card-body">
                <canvas id="categoryDistributionChart" height="300"></canvas>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Alertas y Top Productos -->
        <div class="row mb-4">
          <div class="col-lg-6">
            <div class="card">
              <div class="card-header bg-warning text-dark">
                <h5 class="card-title mb-0">
                  <i class="bi bi-exclamation-triangle"></i>
                  Alertas de Stock
                </h5>
              </div>
              <div class="card-body">
                <div class="list-group list-group-flush">
                  <div class="list-group-item d-flex justify-content-between align-items-center" 
                       v-for="alert in stockAlerts" :key="alert.id">
                    <div>
                      <strong>{{ alert.product }}</strong>
                      <br>
                      <small class="text-muted">{{ alert.warehouse }}</small>
                    </div>
                    <div class="text-end">
                      <span class="badge bg-warning">{{ alert.currentStock }}</span>
                      <br>
                      <small class="text-muted">Min: {{ alert.minStock }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0">Productos Más Valiosos</h5>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Stock</th>
                        <th>Valor Unit.</th>
                        <th>Valor Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="product in topValueProducts" :key="product.id">
                        <td>{{ product.name }}</td>
                        <td>{{ product.stock }}</td>
                        <td>${{ formatCurrency(product.unitValue) }}</td>
                        <td>${{ formatCurrency(product.totalValue) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Detalle de Inventario -->
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">Detalle de Inventario</h5>
            <div class="d-flex gap-2">
              <input type="text" class="form-control form-control-sm" placeholder="Buscar producto..." v-model="searchTerm">
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
                    <th>Código</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Almacén</th>
                    <th>Stock Actual</th>
                    <th>Stock Mínimo</th>
                    <th>Valor Unitario</th>
                    <th>Valor Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in filteredInventory" :key="item.id">
                    <td>{{ item.code }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.category }}</td>
                    <td>{{ item.warehouse }}</td>
                    <td>{{ item.currentStock }}</td>
                    <td>{{ item.minStock }}</td>
                    <td>${{ formatCurrency(item.unitValue) }}</td>
                    <td>${{ formatCurrency(item.totalValue) }}</td>
                    <td>
                      <span class="badge" :class="getStockStatusClass(item)">
                        {{ getStockStatus(item) }}
                      </span>
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" @click="viewMovements(item)">
                          <i class="bi bi-clock-history"></i>
                        </button>
                        <button class="btn btn-outline-success" @click="adjustStock(item)">
                          <i class="bi bi-plus-minus"></i>
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
    warehouse: '',
    category: '',
    status: '',
    period: 'month'
  })
  
  const searchTerm = ref('')
  
  const inventoryKPIs = ref({
    totalValue: 485000,
    activeProducts: 1250,
    lowStock: 23,
    outOfStock: 8
  })
  
  const stockAlerts = ref([
    { id: 1, product: 'Laptop Dell XPS', warehouse: 'Almacén Principal', currentStock: 5, minStock: 10 },
    { id: 2, product: 'Mouse Logitech', warehouse: 'Almacén Norte', currentStock: 8, minStock: 15 },
    { id: 3, product: 'Teclado Mecánico', warehouse: 'Almacén Principal', currentStock: 3, minStock: 12 },
    { id: 4, product: 'Monitor 24"', warehouse: 'Almacén Secundario', currentStock: 2, minStock: 8 }
  ])
  
  const topValueProducts = ref([
    { id: 1, name: 'Laptop Gaming', stock: 15, unitValue: 1200, totalValue: 18000 },
    { id: 2, name: 'iPhone 15 Pro', stock: 25, unitValue: 999, totalValue: 24975 },
    { id: 3, name: 'MacBook Pro', stock: 8, unitValue: 2500, totalValue: 20000 },
    { id: 4, name: 'iPad Air', stock: 20, unitValue: 599, totalValue: 11980 },
    { id: 5, name: 'Samsung Galaxy', stock: 30, unitValue: 799, totalValue: 23970 }
  ])
  
  const inventory = ref([
    {
      id: 1,
      code: 'PROD-001',
      name: 'Laptop Dell XPS',
      category: 'Electrónicos',
      warehouse: 'Almacén Principal',
      currentStock: 5,
      minStock: 10,
      unitValue: 1200,
      totalValue: 6000
    },
    {
      id: 2,
      code: 'PROD-002',
      name: 'Mouse Logitech',
      category: 'Accesorios',
      warehouse: 'Almacén Norte',
      currentStock: 8,
      minStock: 15,
      unitValue: 25,
      totalValue: 200
    },
    {
      id: 3,
      code: 'PROD-003',
      name: 'Teclado Mecánico',
      category: 'Accesorios',
      warehouse: 'Almacén Principal',
      currentStock: 3,
      minStock: 12,
      unitValue: 85,
      totalValue: 255
    }
  ])
  
  const filteredInventory = computed(() => {
    if (!searchTerm.value) return inventory.value
    
    return inventory.value.filter(item => 
      item.code.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  })
  
  const formatCurrency = (amount) => {
    if (amount == null || isNaN(amount)) return '0.00'
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }
  
  const getStockStatus = (item) => {
    if (item.currentStock === 0) return 'Sin Stock'
    if (item.currentStock <= item.minStock) return 'Stock Bajo'
    return 'Normal'
  }
  
  const getStockStatusClass = (item) => {
    if (item.currentStock === 0) return 'bg-danger'
    if (item.currentStock <= item.minStock) return 'bg-warning'
    return 'bg-success'
  }
  
  const generateReport = () => {
    console.log('Generando reporte con filtros:', filters.value)
  }
  
  const exportReport = () => {
    console.log('Exportando reporte de inventario')
  }
  
  const viewMovements = (item) => {
    console.log('Ver movimientos de:', item)
  }
  
  const adjustStock = (item) => {
    console.log('Ajustar stock de:', item)
  }
  
  onMounted(() => {
    // Inicializar gráficos aquí
  })
  </script>
  