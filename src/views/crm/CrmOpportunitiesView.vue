<template>
  <DashboardLayout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3">Gestión de Oportunidades</h1>
        <div class="btn-group">
          <button class="btn btn-outline-secondary" @click="toggleView">
            <i class="bi" :class="viewMode === 'kanban' ? 'bi-list' : 'bi-kanban'"></i>
            {{ viewMode === 'kanban' ? 'Vista Lista' : 'Vista Kanban' }}
          </button>
          <button class="btn btn-outline-primary" @click="exportOpportunities">
            <i class="bi bi-download me-2"></i>Exportar
          </button>
          <button class="btn btn-primary" @click="openNewOpportunityModal">
            <i class="bi bi-plus-lg me-2"></i>Nueva Oportunidad
          </button>
        </div>
      </div>

      <!-- Pipeline Stats -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="pipeline-stat">
            <div class="stat-icon bg-primary">
              <i class="bi bi-bullseye"></i>
            </div>
            <div class="stat-content">
              <h4>{{ pipelineStats.total }}</h4>
              <p>Total Oportunidades</p>
              <small class="text-success">+12% este mes</small>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="pipeline-stat">
            <div class="stat-icon bg-success">
              <i class="bi bi-currency-dollar"></i>
            </div>
            <div class="stat-content">
              <h4>${{ pipelineStats.totalValue.toLocaleString() }}</h4>
              <p>Valor Total</p>
              <small class="text-success">+8% este mes</small>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="pipeline-stat">
            <div class="stat-icon bg-warning">
              <i class="bi bi-clock"></i>
            </div>
            <div class="stat-content">
              <h4>{{ pipelineStats.avgDays }}</h4>
              <p>Días Promedio</p>
              <small class="text-danger">+2 días</small>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="pipeline-stat">
            <div class="stat-icon bg-info">
              <i class="bi bi-percent"></i>
            </div>
            <div class="stat-content">
              <h4>{{ pipelineStats.winRate }}%</h4>
              <p>Tasa de Conversión</p>
              <small class="text-success">+5% este mes</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-12 col-md-3">
              <div class="form-floating">
                <input
                  type="text"
                  class="form-control"
                  id="searchOpportunity"
                  placeholder="Buscar oportunidad"
                  v-model="filters.search"
                >
                <label for="searchOpportunity">
                  <i class="bi bi-search me-2"></i>Buscar oportunidad
                </label>
              </div>
            </div>
            <div class="col-12 col-md-2">
              <div class="form-floating">
                <select class="form-select" id="stageFilter" v-model="filters.stage">
                  <option value="">Todas las etapas</option>
                  <option v-for="stage in pipelineStages" :key="stage.id" :value="stage.id">
                    {{ stage.name }}
                  </option>
                </select>
                <label for="stageFilter">Etapa</label>
              </div>
            </div>
            <div class="col-12 col-md-2">
              <div class="form-floating">
                <select class="form-select" id="ownerFilter" v-model="filters.owner">
                  <option value="">Todos los propietarios</option>
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.name }}
                  </option>
                </select>
                <label for="ownerFilter">Propietario</label>
              </div>
            </div>
            <div class="col-12 col-md-2">
              <div class="form-floating">
                <select class="form-select" id="valueFilter" v-model="filters.value">
                  <option value="">Todos los valores</option>
                  <option value="small">Pequeño (&lt; $10K)</option>
                  <option value="medium">Mediano ($10K - $50K)</option>
                  <option value="large">Grande (&gt; $50K)</option>
                </select>
                <label for="valueFilter">Valor</label>
              </div>
            </div>
            <div class="col-12 col-md-2">
              <div class="form-floating">
                <input type="date" class="form-control" id="dateFilter" v-model="filters.closeDate">
                <label for="dateFilter">Fecha Cierre</label>
              </div>
            </div>
            <div class="col-12 col-md-1">
              <button class="btn btn-secondary w-100 h-100" @click="resetFilters">
                <i class="bi bi-x-circle"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Kanban View -->
      <div v-if="viewMode === 'kanban'" class="kanban-board">
        <div class="kanban-columns">
          <div v-for="stage in pipelineStages" :key="stage.id" class="kanban-column">
            <div class="column-header">
              <h6>{{ stage.name }}</h6>
              <span class="opportunity-count">{{ getOpportunitiesByStage(stage.id).length }}</span>
            </div>
            <div class="column-content">
              <div 
                v-for="opportunity in getOpportunitiesByStage(stage.id)" 
                :key="opportunity.id" 
                class="opportunity-card"
                @click="viewOpportunity(opportunity)"
              >
                <div class="opportunity-header">
                  <h6>{{ opportunity.title }}</h6>
                  <div class="opportunity-value">${{ opportunity.value.toLocaleString() }}</div>
                </div>
                <p class="opportunity-company">{{ opportunity.company }}</p>
                <div class="opportunity-meta">
                  <div class="probability">
                    <i class="bi bi-percent"></i>
                    {{ opportunity.probability }}%
                  </div>
                  <div class="close-date">
                    <i class="bi bi-calendar"></i>
                    {{ opportunity.closeDate }}
                  </div>
                </div>
                <div class="opportunity-footer">
                  <img :src="getUserAvatar(opportunity.ownerId)" class="owner-avatar" :alt="getUserName(opportunity.ownerId)">
                  <span class="owner-name">{{ getUserName(opportunity.ownerId) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table View -->
      <div v-else class="card border-0 shadow-sm">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Oportunidad</th>
                  <th>Empresa</th>
                  <th>Etapa</th>
                  <th>Valor</th>
                  <th>Probabilidad</th>
                  <th>Fecha Cierre</th>
                  <th>Propietario</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="opportunity in filteredOpportunities" :key="opportunity.id">
                  <td>
                    <div>
                      <h6 class="mb-0">{{ opportunity.title }}</h6>
                      <small class="text-muted">{{ opportunity.description }}</small>
                    </div>
                  </td>
                  <td>{{ opportunity.company }}</td>
                  <td>
                    <span class="badge" :class="getStageColor(opportunity.stageId)">
                      {{ getStageName(opportunity.stageId) }}
                    </span>
                  </td>
                  <td>
                    <strong>${{ opportunity.value.toLocaleString() }}</strong>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="probability-bar me-2">
                        <div class="probability-fill" :style="{ width: opportunity.probability + '%' }"></div>
                      </div>
                      <span>{{ opportunity.probability }}%</span>
                    </div>
                  </td>
                  <td>{{ opportunity.closeDate }}</td>
                  <td>
                    <div class="d-flex align-items-center">
                      <img :src="getUserAvatar(opportunity.ownerId)" class="user-avatar me-2" :alt="getUserName(opportunity.ownerId)">
                      <span>{{ getUserName(opportunity.ownerId) }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="btn-group">
                      <button class="btn btn-sm btn-outline-primary" @click="viewOpportunity(opportunity)">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-secondary" @click="editOpportunity(opportunity)">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <div class="dropdown">
                        <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                          <i class="bi bi-three-dots"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="#" @click="moveToNextStage(opportunity)">
                            <i class="bi bi-arrow-right me-2"></i>Avanzar Etapa
                          </a></li>
                          <li><a class="dropdown-item" href="#" @click="scheduleActivity(opportunity)">
                            <i class="bi bi-calendar-plus me-2"></i>Programar Actividad
                          </a></li>
                          <li><hr class="dropdown-divider"></li>
                          <li><a class="dropdown-item text-success" href="#" @click="markAsWon(opportunity)">
                            <i class="bi bi-check-circle me-2"></i>Marcar como Ganada
                          </a></li>
                          <li><a class="dropdown-item text-danger" href="#" @click="markAsLost(opportunity)">
                            <i class="bi bi-x-circle me-2"></i>Marcar como Perdida
                          </a></li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- New Opportunity Modal -->
    <div class="modal fade" id="newOpportunityModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingOpportunity ? 'Editar Oportunidad' : 'Nueva Oportunidad' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveOpportunity">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Título</label>
                  <input type="text" class="form-control" v-model="opportunityForm.title" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Empresa</label>
                  <input type="text" class="form-control" v-model="opportunityForm.company" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Valor ($)</label>
                  <input type="number" class="form-control" v-model="opportunityForm.value" min="0" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Probabilidad (%)</label>
                  <input type="number" class="form-control" v-model="opportunityForm.probability" min="0" max="100" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Etapa</label>
                  <select class="form-select" v-model="opportunityForm.stageId" required>
                    <option v-for="stage in pipelineStages" :key="stage.id" :value="stage.id">
                      {{ stage.name }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Fecha de Cierre</label>
                  <input type="date" class="form-control" v-model="opportunityForm.closeDate" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Propietario</label>
                  <select class="form-select" v-model="opportunityForm.ownerId" required>
                    <option v-for="user in users" :key="user.id" :value="user.id">
                      {{ user.name }}
                    </option>
                  </select>
                </div>
                <div class="col-12">
                  <label class="form-label">Descripción</label>
                  <textarea class="form-control" v-model="opportunityForm.description" rows="3"></textarea>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting" @click="saveOpportunity">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              {{ editingOpportunity ? 'Guardar Cambios' : 'Crear Oportunidad' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import DashboardLayout from '../../components/DashboardLayout.vue'


// Generate user avatar function
const generateUserAvatar = (name) => {
  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', 
    '#43e97b', '#fa709a', '#ffecd2', '#a8edea', '#d299c2'
  ]
  
  const initials = name.split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase()
  
  const colorIndex = name.length % colors.length
  const color = colors[colorIndex]
  
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="16" fill="${color}"/>
      <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="600">${initials}</text>
    </svg>
  `)}`
}

// Mock data
const users = ref([
  { id: 1, name: 'Juan Pérez', avatar: generateUserAvatar('Juan Pérez') },
  { id: 2, name: 'María García', avatar: generateUserAvatar('María García') },
  { id: 3, name: 'Carlos López', avatar: generateUserAvatar('Carlos López') }
])

const pipelineStages = ref([
  { id: 1, name: 'Prospecto', color: 'bg-secondary' },
  { id: 2, name: 'Calificado', color: 'bg-info' },
  { id: 3, name: 'Propuesta', color: 'bg-warning' },
  { id: 4, name: 'Negociación', color: 'bg-primary' },
  { id: 5, name: 'Cerrado Ganado', color: 'bg-success' },
  { id: 6, name: 'Cerrado Perdido', color: 'bg-danger' }
])

const opportunities = ref([
  {
    id: 1,
    title: 'Sistema ERP Completo',
    company: 'TechCorp Solutions',
    value: 85000,
    probability: 75,
    stageId: 4,
    closeDate: '2024-03-15',
    ownerId: 1,
    description: 'Implementación completa de sistema ERP para empresa de tecnología',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    title: 'Consultoría Digital',
    company: 'Manufacturing Plus',
    value: 45000,
    probability: 60,
    stageId: 3,
    closeDate: '2024-03-20',
    ownerId: 2,
    description: 'Consultoría para transformación digital de procesos manufactureros',
    createdAt: '2024-01-20'
  },
  {
    id: 3,
    title: 'Software Personalizado',
    company: 'HealthCare Innovations',
    value: 25000,
    probability: 40,
    stageId: 2,
    closeDate: '2024-04-10',
    ownerId: 3,
    description: 'Desarrollo de software personalizado para gestión hospitalaria',
    createdAt: '2024-02-01'
  },
  {
    id: 4,
    title: 'Migración a la Nube',
    company: 'StartUp Inc',
    value: 15000,
    probability: 30,
    stageId: 1,
    closeDate: '2024-04-30',
    ownerId: 1,
    description: 'Migración de infraestructura local a servicios en la nube',
    createdAt: '2024-02-10'
  }
])

const viewMode = ref('kanban')

const pipelineStats = computed(() => {
  const total = opportunities.value.length
  const totalValue = opportunities.value.reduce((sum, opp) => sum + opp.value, 0)
  const avgDays = 45 // Mock calculation
  const winRate = 65 // Mock calculation
  
  return { total, totalValue, avgDays, winRate }
})

// Filters
const filters = ref({
  search: '',
  stage: '',
  owner: '',
  value: '',
  closeDate: ''
})

// Form state
const opportunityForm = ref({
  title: '',
  company: '',
  value: 0,
  probability: 50,
  stageId: 1,
  closeDate: '',
  ownerId: '',
  description: ''
})

const isSubmitting = ref(false)
const editingOpportunity = ref(null)

// Computed properties
const filteredOpportunities = computed(() => {
  let filtered = opportunities.value

  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    filtered = filtered.filter(opp =>
      opp.title.toLowerCase().includes(searchTerm) ||
      opp.company.toLowerCase().includes(searchTerm)
    )
  }

  if (filters.value.stage) {
    filtered = filtered.filter(opp => opp.stageId === filters.value.stage)
  }

  if (filters.value.owner) {
    filtered = filtered.filter(opp => opp.ownerId === filters.value.owner)
  }

  if (filters.value.value) {
    filtered = filtered.filter(opp => {
      if (filters.value.value === 'small') return opp.value < 10000
      if (filters.value.value === 'medium') return opp.value >= 10000 && opp.value <= 50000
      if (filters.value.value === 'large') return opp.value > 50000
      return true
    })
  }

  if (filters.value.closeDate) {
    filtered = filtered.filter(opp => opp.closeDate === filters.value.closeDate)
  }

  return filtered
})

// Methods
const toggleView = () => {
  viewMode.value = viewMode.value === 'kanban' ? 'table' : 'kanban'
}

const resetFilters = () => {
  filters.value = {
    search: '',
    stage: '',
    owner: '',
    value: '',
    closeDate: ''
  }
}

const getOpportunitiesByStage = (stageId) => {
  return filteredOpportunities.value.filter(opp => opp.stageId === stageId)
}

const getStageName = (stageId) => {
  const stage = pipelineStages.value.find(s => s.id === stageId)
  return stage ? stage.name : 'Sin etapa'
}

const getStageColor = (stageId) => {
  const stage = pipelineStages.value.find(s => s.id === stageId)
  return stage ? stage.color : 'bg-secondary'
}

const getUserName = (userId) => {
  const user = users.value.find(u => u.id === userId)
  return user ? user.name : 'Sin asignar'
}

const getUserAvatar = (userId) => {
  const user = users.value.find(u => u.id === userId)
  return user ? user.avatar : 'https://via.placeholder.com/32'
}

const openNewOpportunityModal = () => {
  editingOpportunity.value = null
  opportunityForm.value = {
    title: '',
    company: '',
    value: 0,
    probability: 50,
    stageId: 1,
    closeDate: '',
    ownerId: '',
    description: ''
  }
  const modal = new bootstrap.Modal(document.getElementById('newOpportunityModal'))
  modal.show()
}

const editOpportunity = (opportunity) => {
  editingOpportunity.value = opportunity
  opportunityForm.value = { ...opportunity }
  const modal = new bootstrap.Modal(document.getElementById('newOpportunityModal'))
  modal.show()
}

const saveOpportunity = async () => {
  isSubmitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (editingOpportunity.value) {
      const index = opportunities.value.findIndex(o => o.id === editingOpportunity.value.id)
      opportunities.value[index] = { ...editingOpportunity.value, ...opportunityForm.value }
    } else {
      opportunities.value.push({
        id: opportunities.value.length + 1,
        ...opportunityForm.value,
        createdAt: new Date().toISOString().split('T')[0]
      })
    }
    
    bootstrap.Modal.getInstance(document.getElementById('newOpportunityModal')).hide()
  } catch (error) {
    console.error('Error saving opportunity:', error)
  } finally {
    isSubmitting.value = false
  }
}

const viewOpportunity = (opportunity) => {
  console.log('View opportunity:', opportunity)
}

const moveToNextStage = (opportunity) => {
  if (opportunity.stageId < 4) {
    opportunity.stageId += 1
  }
}

const markAsWon = (opportunity) => {
  opportunity.stageId = 5 // Cerrado Ganado
}

const markAsLost = (opportunity) => {
  opportunity.stageId = 6 // Cerrado Perdido
}

const scheduleActivity = (opportunity) => {
  console.log('Schedule activity for:', opportunity)
}

const exportOpportunities = () => {
  console.log('Exporting opportunities...')
}
</script>

<style scoped>
.pipeline-stat {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
}

.pipeline-stat:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.stat-content h4 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
}

.stat-content p {
  margin: 0;
  color: #718096;
  font-size: 0.875rem;
}

.stat-content small {
  font-size: 0.75rem;
  font-weight: 600;
}

.kanban-board {
  overflow-x: auto;
  padding-bottom: 1rem;
}

.kanban-columns {
  display: flex;
  gap: 1.5rem;
  min-width: max-content;
}

.kanban-column {
  min-width: 300px;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.column-header h6 {
  margin: 0;
  color: #2d3748;
  font-weight: 600;
}

.opportunity-count {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.column-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 400px;
}

.opportunity-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
}

.opportunity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.opportunity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.opportunity-header h6 {
  margin: 0;
  font-size: 0.875rem;
  color: #2d3748;
  font-weight: 600;
}

.opportunity-value {
  font-weight: 700;
  color: #667eea;
  font-size: 0.875rem;
}

.opportunity-company {
  margin: 0;
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 0.75rem;
}

.opportunity-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.probability,
.close-date {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #a0aec0;
}

.opportunity-footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.owner-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.owner-name {
  font-size: 0.75rem;
  color: #4a5568;
  font-weight: 500;
}

.probability-bar {
  width: 60px;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.probability-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.table th {
  font-weight: 600;
  color: #4a5568;
  border-bottom: 2px solid #e2e8f0;
}

.table td {
  vertical-align: middle;
  border-bottom: 1px solid #f7fafc;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

@media (max-width: 768px) {
  .kanban-columns {
    flex-direction: column;
  }
  
  .kanban-column {
    min-width: auto;
  }
  
  .pipeline-stat {
    flex-direction: column;
    text-align: center;
  }
}
</style>
