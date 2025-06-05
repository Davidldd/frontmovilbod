<template>
  <DashboardLayout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3">Gestión de Contactos</h1>
        <div class="btn-group">
          <button class="btn btn-outline-primary" @click="exportContacts">
            <i class="bi bi-download me-2"></i>Exportar
          </button>
          <button class="btn btn-primary" @click="openNewContactModal">
            <i class="bi bi-person-plus me-2"></i>Nuevo Contacto
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
                  id="searchContact"
                  placeholder="Buscar contacto"
                  v-model="filters.search"
                >
                <label for="searchContact">
                  <i class="bi bi-search me-2"></i>Buscar contacto
                </label>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="form-floating">
                <select class="form-select" id="statusFilter" v-model="filters.status">
                  <option value="">Todos los estados</option>
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="prospect">Prospecto</option>
                </select>
                <label for="statusFilter">Estado</label>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="form-floating">
                <select class="form-select" id="companyFilter" v-model="filters.company">
                  <option value="">Todas las empresas</option>
                  <option v-for="company in companies" :key="company.id" :value="company.id">
                    {{ company.name }}
                  </option>
                </select>
                <label for="companyFilter">Empresa</label>
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

      <!-- Contacts Table -->
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Contacto</th>
                  <th>Empresa</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Estado</th>
                  <th>Última Actividad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="contact in filteredContacts" :key="contact.id">
                  <td>
                    <div class="d-flex align-items-center">
                      <img :src="contact.avatar" class="contact-avatar me-3" :alt="contact.name">
                      <div>
                        <h6 class="mb-0">{{ contact.name }}</h6>
                        <small class="text-muted">{{ contact.position }}</small>
                      </div>
                    </div>
                  </td>
                  <td>{{ getCompanyName(contact.companyId) }}</td>
                  <td>
                    <a :href="`mailto:${contact.email}`" class="text-decoration-none">
                      {{ contact.email }}
                    </a>
                  </td>
                  <td>
                    <a :href="`tel:${contact.phone}`" class="text-decoration-none">
                      {{ contact.phone }}
                    </a>
                  </td>
                  <td>
                    <span class="badge" :class="getStatusBadgeClass(contact.status)">
                      {{ getStatusText(contact.status) }}
                    </span>
                  </td>
                  <td>{{ contact.lastActivity }}</td>
                  <td>
                    <div class="btn-group">
                      <button class="btn btn-sm btn-outline-primary" @click="viewContact(contact)">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-secondary" @click="editContact(contact)">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <div class="dropdown">
                        <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                          <i class="bi bi-three-dots"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="#" @click="sendEmail(contact)">
                            <i class="bi bi-envelope me-2"></i>Enviar Email
                          </a></li>
                          <li><a class="dropdown-item" href="#" @click="scheduleCall(contact)">
                            <i class="bi bi-telephone me-2"></i>Programar Llamada
                          </a></li>
                          <li><hr class="dropdown-divider"></li>
                          <li><a class="dropdown-item text-danger" href="#" @click="deleteContact(contact)">
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
              Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ totalContacts }} contactos
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

    <!-- New Contact Modal -->
    <div class="modal fade" id="newContactModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingContact ? 'Editar Contacto' : 'Nuevo Contacto' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveContact">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Nombre</label>
                  <input type="text" class="form-control" v-model="contactForm.name" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Apellido</label>
                  <input type="text" class="form-control" v-model="contactForm.lastName" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" v-model="contactForm.email" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Teléfono</label>
                  <input type="tel" class="form-control" v-model="contactForm.phone">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Empresa</label>
                  <select class="form-select" v-model="contactForm.companyId">
                    <option value="">Seleccionar empresa</option>
                    <option v-for="company in companies" :key="company.id" :value="company.id">
                      {{ company.name }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Cargo</label>
                  <input type="text" class="form-control" v-model="contactForm.position">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Estado</label>
                  <select class="form-select" v-model="contactForm.status">
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="prospect">Prospecto</option>
                  </select>
                </div>
                <div class="col-12">
                  <label class="form-label">Notas</label>
                  <textarea class="form-control" v-model="contactForm.notes" rows="3"></textarea>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting" @click="saveContact">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              {{ editingContact ? 'Guardar Cambios' : 'Crear Contacto' }}
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
const companies = ref([
  { id: 1, name: 'ABC Corp' },
  { id: 2, name: 'XYZ Ltd' },
  { id: 3, name: 'DEF Inc' }
])

const contacts = ref([
  {
    id: 1,
    name: 'Juan Pérez',
    lastName: 'Pérez',
    email: 'juan.perez@abccorp.com',
    phone: '+1 234 567 8901',
    position: 'Gerente de Ventas',
    companyId: 1,
    status: 'active',
    lastActivity: '2024-02-20',
    avatar: 'https://via.placeholder.com/40',
    notes: ''
  },
  {
    id: 2,
    name: 'María García',
    lastName: 'García',
    email: 'maria.garcia@xyzltd.com',
    phone: '+1 234 567 8902',
    position: 'Directora de Marketing',
    companyId: 2,
    status: 'prospect',
    lastActivity: '2024-02-19',
    avatar: 'https://via.placeholder.com/40',
    notes: ''
  }
])

// Filters
const filters = ref({
  search: '',
  status: '',
  company: ''
})

// Pagination
const itemsPerPage = 10
const currentPage = ref(1)

// Form state
const contactForm = ref({
  name: '',
  lastName: '',
  email: '',
  phone: '',
  position: '',
  companyId: '',
  status: 'active',
  notes: ''
})

const isSubmitting = ref(false)
const editingContact = ref(null)

// Computed properties
const filteredContacts = computed(() => {
  let filtered = contacts.value

  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    filtered = filtered.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm)
    )
  }

  if (filters.value.status) {
    filtered = filtered.filter(contact => contact.status === filters.value.status)
  }

  if (filters.value.company) {
    filtered = filtered.filter(contact => contact.companyId === filters.value.company)
  }

  return filtered
})

const totalContacts = computed(() => filteredContacts.value.length)
const totalPages = computed(() => Math.ceil(totalContacts.value / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, totalContacts.value))

// Methods
const resetFilters = () => {
  filters.value = {
    search: '',
    status: '',
    company: ''
  }
}

const getCompanyName = (companyId) => {
  const company = companies.value.find(c => c.id === companyId)
  return company ? company.name : 'Sin empresa'
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'active': 'bg-success',
    'inactive': 'bg-danger',
    'prospect': 'bg-warning'
  }
  return classes[status] || 'bg-secondary'
}

const getStatusText = (status) => {
  const texts = {
    'active': 'Activo',
    'inactive': 'Inactivo',
    'prospect': 'Prospecto'
  }
  return texts[status] || status
}

const openNewContactModal = () => {
  editingContact.value = null
  contactForm.value = {
    name: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    companyId: '',
    status: 'active',
    notes: ''
  }
  const modal = new bootstrap.Modal(document.getElementById('newContactModal'))
  modal.show()
}

const editContact = (contact) => {
  editingContact.value = contact
  contactForm.value = { ...contact }
  const modal = new bootstrap.Modal(document.getElementById('newContactModal'))
  modal.show()
}

const saveContact = async () => {
  isSubmitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (editingContact.value) {
      const index = contacts.value.findIndex(c => c.id === editingContact.value.id)
      contacts.value[index] = { ...editingContact.value, ...contactForm.value }
    } else {
      contacts.value.push({
        id: contacts.value.length + 1,
        ...contactForm.value,
        avatar: 'https://via.placeholder.com/40',
        lastActivity: new Date().toISOString().split('T')[0]
      })
    }
    
    bootstrap.Modal.getInstance(document.getElementById('newContactModal')).hide()
  } catch (error) {
    console.error('Error saving contact:', error)
  } finally {
    isSubmitting.value = false
  }
}

const viewContact = (contact) => {
  console.log('View contact:', contact)
}

const deleteContact = async (contact) => {
  if (confirm('¿Está seguro de eliminar este contacto?')) {
    contacts.value = contacts.value.filter(c => c.id !== contact.id)
  }
}

const sendEmail = (contact) => {
  window.open(`mailto:${contact.email}`)
}

const scheduleCall = (contact) => {
  console.log('Schedule call with:', contact)
}

const exportContacts = () => {
  console.log('Exporting contacts...')
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
.contact-avatar {
  width: 40px;
  height: 40px;
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

.btn-group .dropdown-toggle::after {
  display: none;
}

@media (max-width: 768px) {
  .table-responsive {
    font-size: 0.875rem;
  }
  
  .contact-avatar {
    width: 32px;
    height: 32px;
  }
}
</style>
