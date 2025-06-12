<template>
    <DashboardLayout>
      <div class="container-fluid">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h3 mb-1">{{ isEditing ? 'Editar Empresa' : 'Nueva Empresa' }}</h1>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <router-link to="/dashboard">Dashboard</router-link>
                </li>
                <li class="breadcrumb-item">
                  <router-link to="/crm/companies">Empresas</router-link>
                </li>
                <li class="breadcrumb-item active">{{ isEditing ? 'Editar' : 'Nueva' }}</li>
              </ol>
            </nav>
          </div>
          <div class="btn-group">
            <router-link to="/crm/companies" class="btn btn-outline-secondary">
              <i class="bi bi-arrow-left me-2"></i>Volver
            </router-link>
          </div>
        </div>
  
        <!-- Company Form -->
        <div class="row">
          <div class="col-lg-8">
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white">
                <h5 class="card-title mb-0">
                  <i class="bi bi-building-add me-2 text-primary"></i>
                  Información de la Empresa
                </h5>
              </div>
              <div class="card-body">
                <form @submit.prevent="saveCompany">
                  <div class="row g-3">
                    <!-- Basic Information -->
                    <div class="col-12">
                      <h6 class="text-muted mb-3">
                        <i class="bi bi-info-circle me-2"></i>Información Básica
                      </h6>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Nombre de la Empresa <span class="text-danger">*</span></label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="companyForm.name" 
                        required
                        :class="{ 'is-invalid': errors.name }"
                      >
                      <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Industria <span class="text-danger">*</span></label>
                      <select 
                        class="form-select" 
                        v-model="companyForm.industry" 
                        required
                        :class="{ 'is-invalid': errors.industry }"
                      >
                        <option value="">Seleccionar industria</option>
                        <option v-for="industry in industries" :key="industry" :value="industry">
                          {{ industry }}
                        </option>
                      </select>
                      <div v-if="errors.industry" class="invalid-feedback">{{ errors.industry }}</div>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Email <span class="text-danger">*</span></label>
                      <input 
                        type="email" 
                        class="form-control" 
                        v-model="companyForm.email" 
                        required
                        :class="{ 'is-invalid': errors.email }"
                      >
                      <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Teléfono</label>
                      <input 
                        type="tel" 
                        class="form-control" 
                        v-model="companyForm.phone"
                        :class="{ 'is-invalid': errors.phone }"
                      >
                      <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
                    </div>
  
                    <div class="col-md-6">
                      <label class="form-label">Sitio Web</label>
                      <input 
                        type="url" 
                        class="form-control" 
                        v-model="companyForm.website"
                        placeholder="https://ejemplo.com"
                        :class="{ 'is-invalid': errors.website }"
                      >
                      <div v-if="errors.website" class="invalid-feedback">{{ errors.website }}</div>
                    </div>
  
                    <div class="col-md-6">
                      <label class="form-label">Tamaño de la Empresa</label>
                      <select 
                        class="form-select" 
                        v-model="companyForm.size"
                        :class="{ 'is-invalid': errors.size }"
                      >
                        <option value="small">Pequeña (1-50 empleados)</option>
                        <option value="medium">Mediana (51-250 empleados)</option>
                        <option value="large">Grande (250+ empleados)</option>
                      </select>
                      <div v-if="errors.size" class="invalid-feedback">{{ errors.size }}</div>
                    </div>
  
                    <!-- Address Information -->
                    <div class="col-12 mt-4">
                      <h6 class="text-muted mb-3">
                        <i class="bi bi-geo-alt me-2"></i>Información de Dirección
                      </h6>
                    </div>
                    
                    <div class="col-12">
                      <label class="form-label">Dirección</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="companyForm.address"
                        placeholder="Calle, número, apartamento"
                        :class="{ 'is-invalid': errors.address }"
                      >
                      <div v-if="errors.address" class="invalid-feedback">{{ errors.address }}</div>
                    </div>
                    
                    <div class="col-md-4">
                      <label class="form-label">Ciudad</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="companyForm.city"
                        :class="{ 'is-invalid': errors.city }"
                      >
                      <div v-if="errors.city" class="invalid-feedback">{{ errors.city }}</div>
                    </div>
                    
                    <div class="col-md-4">
                      <label class="form-label">Estado/Provincia</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="companyForm.state"
                        :class="{ 'is-invalid': errors.state }"
                      >
                      <div v-if="errors.state" class="invalid-feedback">{{ errors.state }}</div>
                    </div>
                    
                    <div class="col-md-4">
                      <label class="form-label">Código Postal</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="companyForm.zipCode"
                        :class="{ 'is-invalid': errors.zipCode }"
                      >
                      <div v-if="errors.zipCode" class="invalid-feedback">{{ errors.zipCode }}</div>
                    </div>
  
                    <!-- Financial Information -->
                    <div class="col-12 mt-4">
                      <h6 class="text-muted mb-3">
                        <i class="bi bi-currency-dollar me-2"></i>Información Financiera
                      </h6>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Ingresos Anuales (USD)</label>
                      <input 
                        type="number" 
                        class="form-control" 
                        v-model="companyForm.revenue" 
                        min="0"
                        step="1000"
                        :class="{ 'is-invalid': errors.revenue }"
                      >
                      <div v-if="errors.revenue" class="invalid-feedback">{{ errors.revenue }}</div>
                    </div>
  
                    <div class="col-md-6">
                      <label class="form-label">Número de Empleados</label>
                      <input 
                        type="number" 
                        class="form-control" 
                        v-model="companyForm.employees" 
                        min="1"
                        :class="{ 'is-invalid': errors.employees }"
                      >
                      <div v-if="errors.employees" class="invalid-feedback">{{ errors.employees }}</div>
                    </div>
  
                    <!-- Additional Information -->
                    <div class="col-12 mt-4">
                      <h6 class="text-muted mb-3">
                        <i class="bi bi-file-text me-2"></i>Información Adicional
                      </h6>
                    </div>
                    
                    <div class="col-12">
                      <label class="form-label">Descripción</label>
                      <textarea 
                        class="form-control" 
                        v-model="companyForm.description" 
                        rows="4"
                        placeholder="Descripción de la empresa, servicios, productos..."
                        :class="{ 'is-invalid': errors.description }"
                      ></textarea>
                      <div v-if="errors.description" class="invalid-feedback">{{ errors.description }}</div>
                    </div>
  
                    <div class="col-12">
                      <label class="form-label">Notas Internas</label>
                      <textarea 
                        class="form-control" 
                        v-model="companyForm.notes" 
                        rows="3"
                        placeholder="Notas internas sobre la empresa..."
                        :class="{ 'is-invalid': errors.notes }"
                      ></textarea>
                      <div v-if="errors.notes" class="invalid-feedback">{{ errors.notes }}</div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
  
          <!-- Sidebar -->
          <div class="col-lg-4">
            <!-- Actions Card -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white">
                <h6 class="card-title mb-0">
                  <i class="bi bi-lightning me-2 text-warning"></i>
                  Acciones
                </h6>
              </div>
              <div class="card-body">
                <div class="d-grid gap-2">
                  <button 
                    type="submit" 
                    class="btn btn-primary" 
                    @click="saveCompany"
                    :disabled="isSubmitting"
                  >
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-check-circle me-2"></i>
                    {{ isEditing ? 'Actualizar Empresa' : 'Crear Empresa' }}
                  </button>
                  
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary"
                    @click="resetForm"
                  >
                    <i class="bi bi-arrow-clockwise me-2"></i>
                    Limpiar Formulario
                  </button>
                  
                  <router-link 
                    to="/crm/companies" 
                    class="btn btn-outline-danger"
                  >
                    <i class="bi bi-x-circle me-2"></i>
                    Cancelar
                  </router-link>
                </div>
              </div>
            </div>
  
            <!-- Company Logo Card -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white">
                <h6 class="card-title mb-0">
                  <i class="bi bi-image me-2 text-info"></i>
                  Logo de la Empresa
                </h6>
              </div>
              <div class="card-body text-center">
                <div class="company-logo-preview mb-3">
                  <img 
                    :src="companyForm.logo || '/placeholder.svg?height=120&width=120&text=Logo'" 
                    alt="Logo de la empresa" 
                    class="img-fluid rounded"
                    style="max-height: 120px; max-width: 120px;"
                  >
                </div>
                <input 
                  type="file" 
                  class="form-control" 
                  accept="image/*"
                  @change="handleLogoUpload"
                >
                <small class="text-muted">Formatos: JPG, PNG, GIF (máx. 2MB)</small>
              </div>
            </div>
  
            <!-- Tips Card -->
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-light">
                <h6 class="card-title mb-0">
                  <i class="bi bi-lightbulb me-2 text-info"></i>
                  Consejos
                </h6>
              </div>
              <div class="card-body">
                <ul class="list-unstyled mb-0">
                  <li class="mb-2">
                    <i class="bi bi-check-circle text-success me-2"></i>
                    <small>Completa toda la información disponible</small>
                  </li>
                  <li class="mb-2">
                    <i class="bi bi-check-circle text-success me-2"></i>
                    <small>Verifica que el email y sitio web sean válidos</small>
                  </li>
                  <li class="mb-2">
                    <i class="bi bi-check-circle text-success me-2"></i>
                    <small>Agrega una descripción detallada</small>
                  </li>
                  <li>
                    <i class="bi bi-check-circle text-success me-2"></i>
                    <small>Sube un logo de alta calidad</small>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import DashboardLayout from '../../components/DashboardLayout.vue'
  
  const router = useRouter()
  const route = useRoute()
  
  const isEditing = ref(false)
  const isSubmitting = ref(false)
  const errors = ref({})
  
  const companyForm = ref({
    name: '',
    industry: '',
    email: '',
    phone: '',
    website: '',
    size: 'medium',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    revenue: 0,
    employees: 1,
    description: '',
    notes: '',
    logo: ''
  })
  
  const industries = ref([
    'Tecnología',
    'Manufactura',
    'Servicios Financieros',
    'Salud',
    'Educación',
    'Retail',
    'Construcción',
    'Agricultura',
    'Transporte',
    'Energía',
    'Telecomunicaciones',
    'Entretenimiento',
    'Consultoría',
    'Inmobiliaria',
    'Alimentaria'
  ])
  
  const loadCompany = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock data for editing
      companyForm.value = {
        name: 'TechCorp Solutions',
        industry: 'Tecnología',
        email: 'info@techcorp.com',
        phone: '+1 234 567 8901',
        website: 'https://techcorp.com',
        size: 'large',
        address: '123 Tech Street',
        city: 'San Francisco',
        state: 'California',
        zipCode: '94105',
        revenue: 5000000,
        employees: 150,
        description: 'Empresa líder en soluciones tecnológicas empresariales con más de 10 años de experiencia.',
        notes: 'Cliente potencial con alto valor.',
        logo: '/placeholder.svg?height=120&width=120&text=TechCorp'
      }
    } catch (error) {
      console.error('Error loading company:', error)
    }
  }
  
  const validateForm = () => {
    errors.value = {}
    
    if (!companyForm.value.name.trim()) {
      errors.value.name = 'El nombre de la empresa es requerido'
    }
    
    if (!companyForm.value.industry) {
      errors.value.industry = 'La industria es requerida'
    }
    
    if (!companyForm.value.email.trim()) {
      errors.value.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyForm.value.email)) {
      errors.value.email = 'El email no es válido'
    }
    
    if (companyForm.value.website && !/^https?:\/\/.+/.test(companyForm.value.website)) {
      errors.value.website = 'El sitio web debe incluir http:// o https://'
    }
    
    return Object.keys(errors.value).length === 0
  }
  
  const saveCompany = async () => {
    if (!validateForm()) {
      return
    }
    
    isSubmitting.value = true
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Show success message
      alert(isEditing.value ? 'Empresa actualizada exitosamente' : 'Empresa creada exitosamente')
      
      // Redirect to companies list
      router.push('/crm/companies')
    } catch (error) {
      console.error('Error saving company:', error)
      alert('Error al guardar la empresa. Por favor intenta nuevamente.')
    } finally {
      isSubmitting.value = false
    }
  }
  
  const resetForm = () => {
    companyForm.value = {
      name: '',
      industry: '',
      email: '',
      phone: '',
      website: '',
      size: 'medium',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      revenue: 0,
      employees: 1,
      description: '',
      notes: '',
      logo: ''
    }
    errors.value = {}
  }
  
  const handleLogoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('El archivo es demasiado grande. Máximo 2MB.')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        companyForm.value.logo = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }
  
  onMounted(() => {
    // Check if editing
    if (route.params.id) {
      isEditing.value = true
      loadCompany(route.params.id)
    }
  })
  </script>
  
  <style scoped>
  .card {
    transition: var(--transition-fast);
  }
  
  .card:hover {
    transform: translateY(-2px);
  }
  
  .form-label {
    font-weight: 500;
    color: var(--text-color);
  }
  
  .form-control:focus,
  .form-select:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 0.2rem rgba(107, 70, 193, 0.25);
  }
  
  .btn-primary {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
  }
  
  .btn-primary:hover {
    background-color: var(--primary-dark);
    border-color: var(--primary-dark);
  }
  
  .text-primary {
    color: var(--primary-color) !important;
  }
  
  .text-warning {
    color: var(--warning-color) !important;
  }
  
  .text-info {
    color: var(--secondary-color) !important;
  }
  
  .text-success {
    color: var(--success-color) !important;
  }
  
  .breadcrumb-item a {
    color: var(--gray-600);
    text-decoration: none;
  }
  
  .breadcrumb-item a:hover {
    color: var(--primary-color);
  }
  
  .breadcrumb-item.active {
    color: var(--text-color);
  }
  
  .company-logo-preview {
    border: 2px dashed #dee2e6;
    border-radius: 8px;
    padding: 1rem;
    background-color: #f8f9fa;
  }
  
  @media (max-width: 768px) {
    .col-lg-4 {
      margin-top: 2rem;
    }
  }
  </style>
  