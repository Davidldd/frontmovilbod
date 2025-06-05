<template>
  <DashboardLayout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3">Gestión de Empresas</h1>
        <div class="btn-group">
          <button class="btn btn-outline-primary" @click="exportCompanies">
            <i class="bi bi-download me-2"></i>Exportar
          </button>
          <button class="btn btn-primary" @click="openNewCompanyModal">
            <i class="bi bi-building-add me-2"></i>Nueva Empresa
          </button>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-12 col-md-4">
              <div class="form-floating">
                <input
                  type="text"
                  class="form-control"
                  id="searchCompany"
                  placeholder="Buscar empresa"
                  v-model="filters.search"
                >
                <label for="searchCompany">
                  <i class="bi bi-search me-2"></i>Buscar empresa
                </label>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="form-floating">
                <select class="form-select" id="industryFilter" v-model="filters.industry">
                  <option value="">Todas las industrias</option>
                  <option v-for="industry in industries" :key="industry" :value="industry">
                    {{ industry }}
                  </option>
                </select>
                <label for="industryFilter">Industria</label>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="form-floating">
                <select class="form-select" id="sizeFilter" v-model="filters.size">
                  <option value="">Todos los tamaños</option>
                  <option value="small">Pequeña (1-50)</option>
                  <option value="medium">Mediana (51-250)</option>
                  <option value="large">Grande (250+)</option>
                </select>
                <label for="sizeFilter">Tamaño</label>
              </div>
            </div>
            <div class="col-12 col-md-2">
              <button class="btn btn-secondary w-100 h-100" @click="resetFilters">
                <i class="bi bi-x-circle me-2"></i>Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Companies Grid -->
      <div class="row g-4">
        <div v-for="company in paginatedCompanies" :key="company.id" class="col-12 col-md-6 col-lg-4">
          <div class="company-card">
            <div class="company-header">
              <div class="company-logo">
                <img :src="company.logo" :alt="company.name" class="logo-img">
              </div>
              <div class="company-actions">
                <div class="dropdown">
                  <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                    <i class="bi bi-three-dots"></i>
                  </button>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#" @click="viewCompany(company)">
                      <i class="bi bi-eye me-2"></i>Ver Detalles
                    </a></li>
                    <li><a class="dropdown-item" href="#" @click="editCompany(company)">
                      <i class="bi bi-pencil me-2"></i>Editar
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" @click="deleteCompany(company)">
                      <i class="bi bi-trash me-2"></i>Eliminar
                    </a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="company-content">
              <h5 class="company-name">{{ company.name }}</h5>
              <p class="company-industry">{{ company.industry }}</p>
              <p class="company-description">{{ company.description }}</p>

              <div class="company-stats">
                <div class="stat-item">
                  <i class="bi bi-people text-primary"></i>
                  <span>{{ company.contactsCount }} contactos</span>
                </div>
                <div class="stat-item">
                  <i class="bi bi-bullseye text-success"></i>
                  <span>{{ company.opportunitiesCount }} oportunidades</span>
                </div>
                <div class="stat-item">
                  <i class="bi bi-currency-dollar text-warning"></i>
                  <span>${{ company.revenue.toLocaleString() }}</span>
                </div>
              </div>

              <div class="company-contact">
                <div class="contact-item">
                  <i class="bi bi-envelope"></i>
                  <a :href="`mailto:${company.email}`">{{ company.email }}</a>
                </div>
                <div class="contact-item">
                  <i class="bi bi-telephone"></i>
                  <a :href="`tel:${company.phone}`">{{ company.phone }}</a>
                </div>
                <div class="contact-item">
                  <i class="bi bi-geo-alt"></i>
                  <span>{{ company.location }}</span>
                </div>
              </div>
            </div>

            <div class="company-footer">
              <span class="company-size" :class="getSizeClass(company.size)">
                {{ getSizeText(company.size) }}
              </span>
              <span class="company-date">{{ company.createdAt }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <nav class="d-flex justify-content-between align-items-center mt-4">
        <p class="text-muted mb-0">
          Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ totalCompanies }} empresas
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

    <!-- New Company Modal -->
    <div class="modal fade" id="newCompanyModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingCompany ? 'Editar Empresa' : 'Nueva Empresa' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveCompany">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Nombre de la Empresa</label>
                  <input type="text" class="form-control" v-model="companyForm.name" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Industria</label>
                  <select class="form-select" v-model="companyForm.industry" required>
                    <option value="">Seleccionar industria</option>
                    <option v-for="industry in industries" :key="industry" :value="industry">
                      {{ industry }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" v-model="companyForm.email" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Teléfono</label>
                  <input type="tel" class="form-control" v-model="companyForm.phone">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Tamaño de la Empresa</label>
                  <select class="form-select" v-model="companyForm.size">
                    <option value="small">Pequeña (1-50)</option>
                    <option value="medium">Mediana (51-250)</option>
                    <option value="large">Grande (250+)</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Ingresos Anuales</label>
                  <input type="number" class="form-control" v-model="companyForm.revenue" min="0">
                </div>
                <div class="col-12">
                  <label class="form-label">Dirección</label>
                  <input type="text" class="form-control" v-model="companyForm.location">
                </div>
                <div class="col-12">
                  <label class="form-label">Descripción</label>
                  <textarea class="form-control" v-model="companyForm.description" rows="3"></textarea>
                </div>
                <div class="col-12">
                  <label class="form-label">Sitio Web</label>
                  <input type="url" class="form-control" v-model="companyForm.website">
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting" @click="saveCompany">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              {{ editingCompany ? 'Guardar Cambios' : 'Crear Empresa' }}
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
const industries = ref([
  'Tecnología',
  'Manufactura',
  'Servicios Financieros',
  'Salud',
  'Educación',
  'Retail',
  'Construcción',
  'Agricultura'
])

const companies = ref([
  {
    id: 1,
    name: 'TechCorp Solutions',
    industry: 'Tecnología',
    email: 'info@techcorp.com',
    phone: '+1 234 567 8901',
    location: 'San Francisco, CA',
    size: 'large',
    revenue: 5000000,
    description: 'Empresa líder en soluciones tecnológicas empresariales',
    website: 'https://techcorp.com',
    logo: 'https://via.placeholder.com/60',
    contactsCount: 15,
    opportunitiesCount: 8,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Manufacturing Plus',
    industry: 'Manufactura',
    email: 'contact@mfgplus.com',
    phone: '+1 234 567 8902',
    location: 'Detroit, MI',
    size: 'medium',
    revenue: 2500000,
    description: 'Especialistas en manufactura de componentes industriales',
    website: 'https://mfgplus.com',
    logo: 'https://via.placeholder.com/60',
    contactsCount: 8,
    opportunitiesCount: 3,
    createdAt: '2024-01-20'
  },
  {
    id: 3,
    name: 'HealthCare Innovations',
    industry: 'Salud',
    email: 'info@healthinno.com',
    phone: '+1 234 567 8903',
    location: 'Boston, MA',
    size: 'small',
    revenue: 800000,
    description: 'Innovaciones en tecnología médica y dispositivos',
    website: 'https://healthinno.com',
    logo: 'https://via.placeholder.com/60',
    contactsCount: 5,
    opportunitiesCount: 2,
    createdAt: '2024-02-01'
  }
])

// Filters
const filters = ref({
  search: '',
  industry: '',
  size: ''
})

// Pagination
const itemsPerPage = 9
const currentPage = ref(1)

// Form state
const companyForm = ref({
  name: '',
  industry: '',
  email: '',
  phone: '',
  location: '',
  size: 'medium',
  revenue: 0,
  description: '',
  website: ''
})

const isSubmitting = ref(false)
const editingCompany = ref(null)

// Computed properties
const filteredCompanies = computed(() => {
  let filtered = companies.value

  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    filtered = filtered.filter(company =>
      company.name.toLowerCase().includes(searchTerm) ||
      company.industry.toLowerCase().includes(searchTerm) ||
      company.location.toLowerCase().includes(searchTerm)
    )
  }

  if (filters.value.industry) {
    filtered = filtered.filter(company => company.industry === filters.value.industry)
  }

  if (filters.value.size) {
    filtered = filtered.filter(company => company.size === filters.value.size)
  }

  return filtered
})

const totalCompanies = computed(() => filteredCompanies.value.length)
const totalPages = computed(() => Math.ceil(totalCompanies.value / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, totalCompanies.value))

const paginatedCompanies = computed(() => {
  return filteredCompanies.value.slice(startIndex.value, endIndex.value)
})

// Methods
const resetFilters = () => {
  filters.value = {
    search: '',
    industry: '',
    size: ''
  }
}

const getSizeClass = (size) => {
  const classes = {
    'small': 'badge bg-info',
    'medium': 'badge bg-warning',
    'large': 'badge bg-success'
  }
  return classes[size] || 'badge bg-secondary'
}

const getSizeText = (size) => {
  const texts = {
    'small': 'Pequeña',
    'medium': 'Mediana',
    'large': 'Grande'
  }
  return texts[size] || size
}

const openNewCompanyModal = () => {
  editingCompany.value = null
  companyForm.value = {
    name: '',
    industry: '',
    email: '',
    phone: '',
    location: '',
    size: 'medium',
    revenue: 0,
    description: '',
    website: ''
  }
  const modal = new bootstrap.Modal(document.getElementById('newCompanyModal'))
  modal.show()
}

const editCompany = (company) => {
  editingCompany.value = company
  companyForm.value = { ...company }
  const modal = new bootstrap.Modal(document.getElementById('newCompanyModal'))
  modal.show()
}

const saveCompany = async () => {
  isSubmitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (editingCompany.value) {
      const index = companies.value.findIndex(c => c.id === editingCompany.value.id)
      companies.value[index] = { ...editingCompany.value, ...companyForm.value }
    } else {
      companies.value.push({
        id: companies.value.length + 1,
        ...companyForm.value,
        logo: 'https://via.placeholder.com/60',
        contactsCount: 0,
        opportunitiesCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      })
    }
    
    bootstrap.Modal.getInstance(document.getElementById('newCompanyModal')).hide()
  } catch (error) {
    console.error('Error saving company:', error)
  } finally {
    isSubmitting.value = false
  }
}

const viewCompany = (company) => {
  console.log('View company:', company)
}

const deleteCompany = async (company) => {
  if (confirm('¿Está seguro de eliminar esta empresa?')) {
    companies.value = companies.value.filter(c => c.id !== company.id)
  }
}

const exportCompanies = () => {
  console.log('Exporting companies...')
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
.company-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.company-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.company-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.company-logo {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.company-content {
  padding: 1.5rem;
  flex: 1;
}

.company-name {
  margin-bottom: 0.5rem;
  color: #2d3748;
  font-weight: 600;
}

.company-industry {
  color: #667eea;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.company-description {
  color: #718096;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.company-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4a5568;
}

.stat-item i {
  font-size: 1rem;
}

.company-contact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #718096;
}

.contact-item i {
  color: #a0aec0;
  width: 16px;
}

.contact-item a {
  color: #667eea;
  text-decoration: none;
}

.contact-item a:hover {
  text-decoration: underline;
}

.company-footer {
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.company-size {
  font-size: 0.75rem;
}

.company-date {
  font-size: 0.75rem;
  color: #a0aec0;
}

@media (max-width: 768px) {
  .company-stats {
    flex-direction: column;
  }
  
  .company-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
