<template>
  <DashboardLayout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3">Gestión de Leads</h1>
        <div class="btn-group">
          <button class="btn btn-outline-primary" @click="exportLeads">
            <i class="bi bi-download me-2"></i>Exportar
          </button>
          <button class="btn btn-primary" @click="openNewLeadModal">
            <i class="bi bi-person-plus me-2"></i>Nuevo Lead
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="stats-card bg-primary">
            <div class="stats-content">
              <h3>{{ leadStats.total }}</h3>
              <p>Total Leads</p>
            </div>
            <div class="stats-icon">
              <i class="bi bi-people"></i>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="stats-card bg-success">
            <div class="stats-content">
              <h3>{{ leadStats.qualified }}</h3>
              <p>Calificados</p>
            </div>
            <div class="stats-icon">
              <i class="bi bi-check-circle"></i>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="stats-card bg-warning">
            <div class="stats-content">
              <h3>{{ leadStats.contacted }}</h3>
              <p>Contactados</p>
            </div>
            <div class="stats-icon">
              <i class="bi bi-telephone"></i>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="stats-card bg-info">
            <div class="stats-content">
              <h3>{{ leadStats.converted }}</h3>
              <p>Convertidos</p>
            </div>
            <div class="stats-icon">
              <i class="bi bi-arrow-up-circle"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-12 col-md-3">
              <div class="form-floating">
                <input
                  type="text"
                  class="form-control"
                  id="searchLead"
                  placeholder="Buscar lead"
                  v-model="filters.search"
                >
                <label for="searchLead">
                  <i class="bi bi-search me-2"></i>Buscar lead
                </label>
              </div>
            </div>
            <div class="col-12 col-md-2">
              <div class="form-floating">
                <select class="form-select" id="statusFilter" v-model="filters.status">
                  <option value="">Todos</option>
                  <option value="new">Nuevo</option>
                  <option value="contacted">Contactado</option>
                  <option value="qualified">Calificado</option>
                  <option value="converted">Convertido</option>
                  <option value="lost">Perdido</option>
                </select>
                <label for="statusFilter">Estado</label>
              </div>
            </div>
            <div class="col-12 col-md-2">
              <div class="form-floating">
                <select class="form-select" id="sourceFilter" v-model="filters.source">
                  <option value="">Todas las fuentes</option>
                  <option v-for="source in leadSources" :key="source" :value="source">
                    {{ source }}
                  </option>
                </select>
                <label for="sourceFilter">Fuente</label>
              </div>
            </div>
            <div class="col-12 col-md-2">
              <div class="form-floating">
                <select class="form-select" id="scoreFilter" v-model="filters.score">
                  <option value="">Todas las puntuaciones</option>
                  <option value="hot">Caliente (80-100)</option>
                  <option value="warm">Tibio (50-79)</option>
                  <option value="cold">Frío (0-49)</option>
                </select>
                <label for="scoreFilter">Puntuación</label>
              </div>
            </div>
            <div class="col-12 col-md-2">
              <div class="form-floating">
                <select class="form-select" id="assignedFilter" v-model="filters.assigned">
                  <option value="">Todos los asignados</option>
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.name }}
                  </option>
                </select>
                <label for="assignedFilter">Asignado a</label>
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

      <!-- Leads Table -->
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Empresa</th>
                  <th>Fuente</th>
                  <th>Puntuación</th>
                  <th>Estado</th>
                  <th>Asignado a</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="lead in paginatedLeads" :key="lead.id">
                  <td>
                    <div class="d-flex align-items-center">
                      <img :src="lead.avatar" class="lead-avatar-img me-3" :alt="lead.name">
                      <div>
                        <h6 class="mb-0">{{ lead.name }}</h6>
                        <small class="text-muted">{{ lead.email }}</small>
                      </div>
                    </div>
                  </td>
                  <td>{{ lead.company }}</td>
                  <td>
                    <span class="badge bg-light text-dark">{{ lead.source }}</span>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="score-bar me-2">
                        <div class="score-fill" :style="{ width: lead.score + '%' }" :class="getScoreClass(lead.score)"></div>
                      </div>
                      <span class="score-text">{{ lead.score }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge" :class="getStatusBadgeClass(lead.status)">
                      {{ getStatusText(lead.status) }}
                    </span>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <img :src="getUserAvatar(lead.assignedTo)" class="user-avatar me-2" :alt="getUserName(lead.assignedTo)">
                      <span>{{ getUserName(lead.assignedTo) }}</span>
                    </div>
                  </td>
                  <td>{{ lead.createdAt }}</td>
                  <td>
                    <div class="btn-group">
                      <button class="btn btn-sm btn-outline-primary" @click="viewLead(lead)">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-success" @click="convertLead(lead)" v-if="lead.status === 'qualified'">
                        <i class="bi bi-arrow-up-circle"></i>
                      </button>
                      <div class="dropdown">
                        <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                          <i class="bi bi-three-dots"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="#" @click="editLead(lead)">
                            <i class="bi bi-pencil me-2"></i>Editar
                          </a></li>
                          <li><a class="dropdown-item" href="#" @click="contactLead(lead)">
                            <i class="bi bi-telephone me-2"></i>Contactar
                          </a></li>
                          <li><a class="dropdown-item" href="#" @click="qualifyLead(lead)">
                            <i class="bi bi-check-circle me-2"></i>Calificar
                          </a></li>
                          <li><hr class="dropdown-divider"></li>
                          <li><a class="dropdown-item text-danger" href="#" @click="deleteLead(lead)">
                            <i class="bi bi-trash me-2"></i>Eliminar
                          </a></li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <nav class="d-flex justify-content-between align-items-center mt-4">
            <p class="text-muted mb-0">
              Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ totalLeads }} leads
            </p>
            <ul class="pagination mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="prevPage">Anterior</button>
              </li>
              <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
                <button class="page-link" @click="goToPage(page)">{{ page }}</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="nextPage">Siguiente</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <!-- New Lead Modal -->
    <div class="modal fade" id="newLeadModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingLead ? 'Editar Lead' : 'Nuevo Lead' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveLead">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Nombre</label>
                  <input type="text" class="form-control" v-model="leadForm.name" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" v-model="leadForm.email" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Teléfono</label>
                  <input type="tel" class="form-control" v-model="leadForm.phone">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Empresa</label>
                  <input type="text" class="form-control" v-model="leadForm.company">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Fuente</label>
                  <select class="form-select" v-model="leadForm.source">
                    <option v-for="source in leadSources" :key="source" :value="source">
                      {{ source }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Asignar a</label>
                  <select class="form-select" v-model="leadForm.assignedTo">
                    <option value="">Sin asignar</option>
                    <option v-for="user in users" :key="user.id" :value="user.id">
                      {{ user.name }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Puntuación (0-100)</label>
                  <input type="number" class="form-control" v-model="leadForm.score" min="0" max="100">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Estado</label>
                  <select class="form-select" v-model="leadForm.status">
                    <option value="new">Nuevo</option>
                    <option value="contacted">Contactado</option>
                    <option value="qualified">Calificado</option>
                    <option value="converted">Convertido</option>
                    <option value="lost">Perdido</option>
                  </select>
                </div>
                <div class="col-12">
                  <label class="form-label">Notas</label>
                  <textarea class="form-control" v-model="leadForm.notes" rows="3"></textarea>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting" @click="saveLead">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              {{ editingLead ? 'Guardar Cambios' : 'Crear Lead' }}
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

// Mock data
const leadSources = ref([
  'Sitio Web',
  'Redes Sociales',
  'Email Marketing',
  'Referido',
  'Evento',
  'Llamada Fría',
  'Publicidad Online'
])

// Generate user avatar function
const generateUserAvatar = (name) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const colors = [
    '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', 
    '#EF4444', '#06B6D4', '#84CC16', '#F97316',
    '#EC4899', '#6366F1'
  ]
  const colorIndex = name.length % colors.length
  const bgColor = colors[colorIndex]
  
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="${bgColor}"/>
      <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="600">${initials}</text>
    </svg>
  `)}`
}

// Generate lead avatar function
const generateLeadAvatar = (name) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c',
    '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
    '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3'
  ]
  const colorIndex = name.length % colors.length
  const bgColor = colors[colorIndex]
  
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad${name.replace(/\s/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${bgColor}dd;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="20" fill="url(#grad${name.replace(/\s/g, '')})"/>
      <text x="20" y="25" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="600">${initials}</text>
    </svg>
  `)}`
}

const users = ref([
  { id: 1, name: 'Juan Pérez', avatar: generateUserAvatar('Juan Pérez') },
  { id: 2, name: 'María García', avatar: generateUserAvatar('María García') },
  { id: 3, name: 'Carlos López', avatar: generateUserAvatar('Carlos López') }
])

const leads = ref([
  {
    id: 1,
    name: 'Ana Rodríguez',
    email: 'ana.rodriguez@email.com',
    phone: '+1 234 567 8901',
    company: 'Innovate Corp',
    source: 'Sitio Web',
    score: 85,
    status: 'qualified',
    assignedTo: 1,
    createdAt: '2024-02-20',
    notes: 'Interesada en soluciones de automatización',
    avatar: generateLeadAvatar('Ana Rodríguez')
  },
  {
    id: 2,
    name: 'Roberto Silva',
    email: 'roberto.silva@email.com',
    phone: '+1 234 567 8902',
    company: 'Tech Solutions',
    source: 'Redes Sociales',
    score: 65,
    status: 'contacted',
    assignedTo: 2,
    createdAt: '2024-02-19',
    notes: 'Requiere más información sobre precios',
    avatar: generateLeadAvatar('Roberto Silva')
  },
  {
    id: 3,
    name: 'Laura Martínez',
    email: 'laura.martinez@email.com',
    phone: '+1 234 567 8903',
    company: 'StartUp Inc',
    source: 'Email Marketing',
    score: 45,
    status: 'new',
    assignedTo: 3,
    createdAt: '2024-02-18',
    notes: 'Lead nuevo desde campaña de email',
    avatar: generateLeadAvatar('Laura Martínez')
  },
  {
    id: 4,
    name: 'Diego Fernández',
    email: 'diego.fernandez@email.com',
    phone: '+1 234 567 8904',
    company: 'Global Industries',
    source: 'Referido',
    score: 92,
    status: 'qualified',
    assignedTo: 1,
    createdAt: '2024-02-17',
    notes: 'Cliente potencial de alto valor',
    avatar: generateLeadAvatar('Diego Fernández')
  },
  {
    id: 5,
    name: 'Carmen Ruiz',
    email: 'carmen.ruiz@email.com',
    phone: '+1 234 567 8905',
    company: 'Digital Marketing Co',
    source: 'Evento',
    score: 73,
    status: 'contacted',
    assignedTo: 2,
    createdAt: '2024-02-16',
    notes: 'Conocida en evento de marketing digital',
    avatar: generateLeadAvatar('Carmen Ruiz')
  }
])

const leadStats = computed(() => {
  return {
    total: leads.value.length,
    qualified: leads.value.filter(l => l.status === 'qualified').length,
    contacted: leads.value.filter(l => l.status === 'contacted').length,
    converted: leads.value.filter(l => l.status === 'converted').length
  }
})

// Filters
const filters = ref({
  search: '',
  status: '',
  source: '',
  score: '',
  assigned: ''
})

// Pagination
const itemsPerPage = 10
const currentPage = ref(1)

// Form state
const leadForm = ref({
  name: '',
  email: '',
  phone: '',
  company: '',
  source: 'Sitio Web',
  score: 50,
  status: 'new',
  assignedTo: '',
  notes: ''
})

const isSubmitting = ref(false)
const editingLead = ref(null)

// Computed properties
const filteredLeads = computed(() => {
  let filtered = leads.value

  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    filtered = filtered.filter(lead =>
      lead.name.toLowerCase().includes(searchTerm) ||
      lead.email.toLowerCase().includes(searchTerm) ||
      lead.company.toLowerCase().includes(searchTerm)
    )
  }

  if (filters.value.status) {
    filtered = filtered.filter(lead => lead.status === filters.value.status)
  }

  if (filters.value.source) {
    filtered = filtered.filter(lead => lead.source === filters.value.source)
  }

  if (filters.value.score) {
    filtered = filtered.filter(lead => {
      if (filters.value.score === 'hot') return lead.score >= 80
      if (filters.value.score === 'warm') return lead.score >= 50 && lead.score < 80
      if (filters.value.score === 'cold') return lead.score < 50
      return true
    })
  }

  if (filters.value.assigned) {
    filtered = filtered.filter(lead => lead.assignedTo === filters.value.assigned)
  }

  return filtered
})

const paginatedLeads = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredLeads.value.slice(start, end)
})

const totalLeads = computed(() => filteredLeads.value.length)
const totalPages = computed(() => Math.ceil(totalLeads.value / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, totalLeads.value))

// Methods
const resetFilters = () => {
  filters.value = {
    search: '',
    status: '',
    source: '',
    score: '',
    assigned: ''
  }
}

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const getScoreClass = (score) => {
  if (score >= 80) return 'bg-success'
  if (score >= 50) return 'bg-warning'
  return 'bg-danger'
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'new': 'bg-primary',
    'contacted': 'bg-info',
    'qualified': 'bg-success',
    'converted': 'bg-success',
    'lost': 'bg-danger'
  }
  return classes[status] || 'bg-secondary'
}

const getStatusText = (status) => {
  const texts = {
    'new': 'Nuevo',
    'contacted': 'Contactado',
    'qualified': 'Calificado',
    'converted': 'Convertido',
    'lost': 'Perdido'
  }
  return texts[status] || status
}

const getUserName = (userId) => {
  const user = users.value.find(u => u.id === userId)
  return user ? user.name : 'Sin asignar'
}

const getUserAvatar = (userId) => {
  const user = users.value.find(u => u.id === userId)
  return user ? user.avatar : generateUserAvatar('Usuario')
}

const openNewLeadModal = () => {
  editingLead.value = null
  leadForm.value = {
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'Sitio Web',
    score: 50,
    status: 'new',
    assignedTo: '',
    notes: ''
  }
  const modal = new bootstrap.Modal(document.getElementById('newLeadModal'))
  modal.show()
}

const editLead = (lead) => {
  editingLead.value = lead
  leadForm.value = { ...lead }
  const modal = new bootstrap.Modal(document.getElementById('newLeadModal'))
  modal.show()
}

const saveLead = async () => {
  isSubmitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (editingLead.value) {
      const index = leads.value.findIndex(l => l.id === editingLead.value.id)
      leads.value[index] = { ...editingLead.value, ...leadForm.value }
    } else {
      leads.value.push({
        id: leads.value.length + 1,
        ...leadForm.value,
        createdAt: new Date().toISOString().split('T')[0]
      })
    }
    
    bootstrap.Modal.getInstance(document.getElementById('newLeadModal')).hide()
  } catch (error) {
    console.error('Error saving lead:', error)
  } finally {
    isSubmitting.value = false
  }
}

const viewLead = (lead) => {
  console.log('View lead:', lead)
}

const convertLead = async (lead) => {
  if (confirm('¿Convertir este lead en cliente?')) {
    lead.status = 'converted'
  }
}

const contactLead = (lead) => {
  lead.status = 'contacted'
}

const qualifyLead = (lead) => {
  lead.status = 'qualified'
}

const deleteLead = async (lead) => {
  if (confirm('¿Está seguro de eliminar este lead?')) {
    leads.value = leads.value.filter(l => l.id !== lead.id)
  }
}

const exportLeads = () => {
  console.log('Exporting leads...')
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const goToPage = (page) => {
  currentPage.value = page
}
</script>

<style scoped>
.stats-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  transition: transform 0.2s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
}

.stats-content h3 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.stats-content p {
  margin: 0;
  opacity: 0.9;
}

.stats-icon {
  font-size: 2.5rem;
  opacity: 0.7;
}

.lead-avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e2e8f0;
}

.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e2e8f0;
}

.score-bar {
  width: 60px;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.score-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
}

/* Remove or comment out the old .lead-avatar class */
/*
.lead-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}
*/

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
  .stats-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .table-responsive {
    font-size: 0.875rem;
  }
}
</style>
