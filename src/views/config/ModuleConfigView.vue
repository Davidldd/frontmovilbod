<template>
  <DashboardLayout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="config-header mb-4">
        <h1 class="h3 mb-0">Configuración de Módulos</h1>
        <p class="text-muted">Activa o desactiva los módulos del sistema según las necesidades de tu empresa</p>
      </div>

      <!-- Alert for Root Access -->
      <div class="alert alert-info mb-4">
        <i class="bi bi-shield-check me-2"></i>
        <strong>Acceso de Administrador:</strong> Solo los usuarios con rol "Root" pueden modificar la configuración de módulos.
      </div>

      <!-- Module Configuration Cards -->
      <div class="row g-4">
        <div v-for="module in allModules" :key="module.id" class="col-12 col-md-6 col-lg-4">
          <div class="module-config-card" :class="{ 'active': module.active, 'inactive': !module.active }">
            <div class="module-header">
              <div class="module-icon" :class="module.active ? 'text-success' : 'text-muted'">
                <i class="bi" :class="module.icon"></i>
              </div>
              <div class="module-toggle">
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="`module-${module.id}`"
                    v-model="module.active"
                    @change="toggleModule(module.id)"
                  >
                  <label class="form-check-label" :for="`module-${module.id}`">
                    {{ module.active ? 'Activo' : 'Inactivo' }}
                  </label>
                </div>
              </div>
            </div>

            <div class="module-content">
              <h5 class="module-title">{{ module.name }}</h5>
              <p class="module-description">{{ module.description }}</p>
              
              <div class="module-features">
                <h6>Características:</h6>
                <ul>
                  <li v-for="feature in getModuleFeatures(module.id)" :key="feature">
                    {{ feature }}
                  </li>
                </ul>
              </div>

              <div class="module-stats" v-if="module.active">
                <div class="row g-2">
                  <div class="col-6">
                    <div class="stat-item">
                      <span class="stat-value">{{ getModuleStats(module.id).users }}</span>
                      <span class="stat-label">Usuarios</span>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="stat-item">
                      <span class="stat-value">{{ getModuleStats(module.id).records }}</span>
                      <span class="stat-label">Registros</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="module-footer" v-if="module.active">
              <button class="btn btn-sm btn-outline-primary" @click="configureModule(module.id)">
                <i class="bi bi-gear me-1"></i>Configurar
              </button>
              <button class="btn btn-sm btn-outline-info" @click="viewModuleDashboard(module.id)">
                <i class="bi bi-graph-up me-1"></i>Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Configuration Summary -->
      <div class="row mt-5">
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Resumen de Configuración</h5>
              <div class="row g-4">
                <div class="col-md-3">
                  <div class="summary-stat">
                    <div class="summary-icon bg-success">
                      <i class="bi bi-check-circle"></i>
                    </div>
                    <div class="summary-content">
                      <h4>{{ activeModulesCount }}</h4>
                      <p>Módulos Activos</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="summary-stat">
                    <div class="summary-icon bg-danger">
                      <i class="bi bi-x-circle"></i>
                    </div>
                    <div class="summary-content">
                      <h4>{{ inactiveModulesCount }}</h4>
                      <p>Módulos Inactivos</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="summary-stat">
                    <div class="summary-icon bg-info">
                      <i class="bi bi-people"></i>
                    </div>
                    <div class="summary-content">
                      <h4>{{ totalUsers }}</h4>
                      <p>Usuarios Totales</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="summary-stat">
                    <div class="summary-icon bg-warning">
                      <i class="bi bi-database"></i>
                    </div>
                    <div class="summary-content">
                      <h4>{{ totalRecords }}</h4>
                      <p>Registros Totales</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="d-flex justify-content-end gap-2 mt-4">
        <button class="btn btn-outline-secondary" @click="resetToDefaults">
          <i class="bi bi-arrow-clockwise me-2"></i>Restablecer por Defecto
        </button>
        <button class="btn btn-success" @click="saveConfiguration" :disabled="isSaving">
          <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="bi bi-check-lg me-2"></i>
          Guardar Configuración
        </button>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '../../components/DashboardLayout.vue'
import { useModuleStore } from '../../stores/moduleStore'

const router = useRouter()
const moduleStore = useModuleStore()

const isSaving = ref(false)

const allModules = computed(() => Object.values(moduleStore.modules))

const activeModulesCount = computed(() => 
  allModules.value.filter(module => module.active).length
)

const inactiveModulesCount = computed(() => 
  allModules.value.filter(module => !module.active).length
)

const totalUsers = computed(() => 
  allModules.value.reduce((sum, module) => 
    module.active ? sum + getModuleStats(module.id).users : sum, 0
  )
)

const totalRecords = computed(() => 
  allModules.value.reduce((sum, module) => 
    module.active ? sum + getModuleStats(module.id).records : sum, 0
  )
)

const moduleFeatures = {
  crm: [
    'Gestión de contactos y empresas',
    'Seguimiento de leads',
    'Pipeline de oportunidades',
    'Gestión de tareas'
  ],
  inventory: [
    'Control de stock',
    'Gestión de productos',
    'Movimientos de inventario',
    'Categorías y almacenes'
  ],
  billing: [
    'Creación de facturas',
    'Gestión de pagos',
    'Facturas recurrentes',
    'Estados de cuenta'
  ],
  accounting: [
    'Plan de cuentas',
    'Asientos contables',
    'Estados financieros',
    'Reportes contables'
  ],
  purchases: [
    'Órdenes de compra',
    'Gestión de proveedores',
    'Recepción de mercancía',
    'Control de costos'
  ],
  sales: [
    'Órdenes de venta',
    'Cotizaciones',
    'Gestión de devoluciones',
    'Análisis de ventas'
  ],
  reports: [
    'Reportes personalizables',
    'Análisis de datos',
    'Exportación de informes',
    'Dashboards interactivos'
  ]
}

const moduleStats = {
  crm: { users: 15, records: 1250 },
  inventory: { users: 8, records: 450 },
  billing: { users: 12, records: 890 },
  accounting: { users: 5, records: 2340 },
  purchases: { users: 6, records: 320 },
  sales: { users: 10, records: 780 },
  reports: { users: 20, records: 0 }
}

const getModuleFeatures = (moduleId) => {
  return moduleFeatures[moduleId] || []
}

const getModuleStats = (moduleId) => {
  return moduleStats[moduleId] || { users: 0, records: 0 }
}

const toggleModule = (moduleId) => {
  moduleStore.toggleModule(moduleId)
}

const configureModule = (moduleId) => {
  // Navigate to module-specific configuration
  router.push(`/config/modules/${moduleId}`)
}

const viewModuleDashboard = (moduleId) => {
  router.push(`/${moduleId}/dashboard`)
}

const resetToDefaults = () => {
  if (confirm('¿Está seguro de restablecer la configuración por defecto? Esto activará todos los módulos.')) {
    Object.keys(moduleStore.modules).forEach(moduleId => {
      moduleStore.activateModule(moduleId)
    })
  }
}

const saveConfiguration = async () => {
  isSaving.value = true
  try {
    // Simulate API call to save configuration
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Show success message
    const alert = document.createElement('div')
    alert.className = 'alert alert-success alert-dismissible fade show position-fixed'
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;'
    alert.innerHTML = `
      <i class="bi bi-check-circle-fill me-2"></i>
      <strong>Configuración guardada exitosamente</strong>
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `
    document.body.appendChild(alert)
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      if (alert.parentNode) {
        alert.parentNode.removeChild(alert)
      }
    }, 3000)
    
  } catch (error) {
    console.error('Error saving configuration:', error)
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.config-header {
  text-align: center;
  margin-bottom: 2rem;
}

.module-config-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.module-config-card.active {
  border-left: 4px solid #28a745;
}

.module-config-card.inactive {
  border-left: 4px solid #dc3545;
  opacity: 0.7;
}

.module-config-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.module-header {
  padding: 1.5rem;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.module-icon {
  font-size: 2rem;
}

.module-content {
  padding: 1.5rem;
  flex: 1;
}

.module-title {
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.module-description {
  color: #718096;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.module-features {
  margin-bottom: 1rem;
}

.module-features h6 {
  font-size: 0.875rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.module-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.module-features li {
  font-size: 0.8rem;
  color: #718096;
  padding: 0.25rem 0;
  position: relative;
  padding-left: 1rem;
}

.module-features li::before {
  content: '•';
  color: #667eea;
  position: absolute;
  left: 0;
}

.module-stats {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
}

.stat-label {
  font-size: 0.75rem;
  color: #718096;
}

.module-footer {
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 0.5rem;
}

.summary-stat {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.summary-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.summary-content h4 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
}

.summary-content p {
  margin: 0;
  font-size: 0.875rem;
  color: #718096;
}

.form-check-input:checked {
  background-color: #28a745;
  border-color: #28a745;
}

@media (max-width: 768px) {
  .module-footer {
    flex-direction: column;
  }
  
  .summary-stat {
    flex-direction: column;
    text-align: center;
  }
}
</style>
