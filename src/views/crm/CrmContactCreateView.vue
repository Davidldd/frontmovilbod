<template>
    <DashboardLayout>
      <div class="container-fluid">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h3 mb-1">{{ isEditing ? 'Editar Contacto' : 'Nuevo Contacto' }}</h1>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <router-link to="/dashboard">Dashboard</router-link>
                </li>
                <li class="breadcrumb-item">
                  <router-link to="/crm/contacts">Contactos</router-link>
                </li>
                <li class="breadcrumb-item active">{{ isEditing ? 'Editar' : 'Nuevo' }}</li>
              </ol>
            </nav>
          </div>
          <div class="btn-group">
            <router-link to="/crm/contacts" class="btn btn-outline-secondary">
              <i class="bi bi-arrow-left me-2"></i>Volver
            </router-link>
          </div>
        </div>
  
        <!-- Contact Form -->
        <div class="row">
          <div class="col-lg-8">
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white">
                <h5 class="card-title mb-0">
                  <i class="bi bi-person-plus me-2 text-primary"></i>
                  Información del Contacto
                </h5>
              </div>
              <div class="card-body">
                <form @submit.prevent="saveContact">
                  <div class="row g-3">
                    <!-- Personal Information -->
                    <div class="col-12">
                      <h6 class="text-muted mb-3">
                        <i class="bi bi-person me-2"></i>Información Personal
                      </h6>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Nombre <span class="text-danger">*</span></label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="contactForm.name" 
                        required
                        :class="{ 'is-invalid': errors.name }"
                      >
                      <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Apellido <span class="text-danger">*</span></label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="contactForm.lastName" 
                        required
                        :class="{ 'is-invalid': errors.lastName }"
                      >
                      <div v-if="errors.lastName" class="invalid-feedback">{{ errors.lastName }}</div>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Email <span class="text-danger">*</span></label>
                      <input 
                        type="email" 
                        class="form-control" 
                        v-model="contactForm.email" 
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
                        v-model="contactForm.phone"
                        :class="{ 'is-invalid': errors.phone }"
                      >
                      <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
                    </div>
  
                    <!-- Professional Information -->
                    <div class="col-12 mt-4">
                      <h6 class="text-muted mb-3">
                        <i class="bi bi-briefcase me-2"></i>Información Profesional
                      </h6>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Empresa</label>
                      <select 
                        class="form-select" 
                        v-model="contactForm.companyId"
                        :class="{ 'is-invalid': errors.companyId }"
                      >
                        <option value="">Seleccionar empresa</option>
                        <option v-for="company in companies" :key="company.id" :value="company.id">
                          {{ company.name }}
                        </option>
                      </select>
                      <div v-if="errors.companyId" class="invalid-feedback">{{ errors.companyId }}</div>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Cargo</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="contactForm.position"
                        :class="{ 'is-invalid': errors.position }"
                      >
                      <div v-if="errors.position" class="invalid-feedback">{{ errors.position }}</div>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Estado</label>
                      <select 
                        class="form-select" 
                        v-model="contactForm.status"
                        :class="{ 'is-invalid': errors.status }"
                      >
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                        <option value="prospect">Prospecto</option>
                      </select>
                      <div v-if="errors.status" class="invalid-feedback">{{ errors.status }}</div>
                    </div>
  
                    <!-- Additional Information -->
                    <div class="col-12 mt-4">
                      <h6 class="text-muted mb-3">
                        <i class="bi bi-info-circle me-2"></i>Información Adicional
                      </h6>
                    </div>
                    
                    <div class="col-12">
                      <label class="form-label">Notas</label>
                      <textarea 
                        class="form-control" 
                        v-model="contactForm.notes" 
                        rows="4"
                        placeholder="Información adicional sobre el contacto..."
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
                    @click="saveContact"
                    :disabled="isSubmitting"
                  >
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-check-circle me-2"></i>
                    {{ isEditing ? 'Actualizar Contacto' : 'Crear Contacto' }}
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
                    to="/crm/contacts" 
                    class="btn btn-outline-danger"
                  >
                    <i class="bi bi-x-circle me-2"></i>
                    Cancelar
                  </router-link>
                </div>
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
                    <small>Verifica que el email sea válido</small>
                  </li>
                  <li class="mb-2">
                    <i class="bi bi-check-circle text-success me-2"></i>
                    <small>Asocia el contacto con su empresa</small>
                  </li>
                  <li>
                    <i class="bi bi-check-circle text-success me-2"></i>
                    <small>Agrega notas relevantes para el seguimiento</small>
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
  
  const companies = ref([
    { id: 1, name: 'ABC Corp' },
    { id: 2, name: 'XYZ Ltd' },
    { id: 3, name: 'DEF Inc' },
    { id: 4, name: 'Tech Solutions S.A.S' },
    { id: 5, name: 'Innovate Co.' }
  ])
  
  const loadContact = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock data for editing
      contactForm.value = {
        name: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '+57 300 123 4567',
        position: 'Gerente de Ventas',
        companyId: 1,
        status: 'active',
        notes: 'Cliente potencial con alto interés en nuestros productos.'
      }
    } catch (error) {
      console.error('Error loading contact:', error)
    }
  }
  
  const validateForm = () => {
    errors.value = {}
    
    if (!contactForm.value.name.trim()) {
      errors.value.name = 'El nombre es requerido'
    }
    
    if (!contactForm.value.lastName.trim()) {
      errors.value.lastName = 'El apellido es requerido'
    }
    
    if (!contactForm.value.email.trim()) {
      errors.value.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.value.email)) {
      errors.value.email = 'El email no es válido'
    }
    
    return Object.keys(errors.value).length === 0
  }
  
  const saveContact = async () => {
    if (!validateForm()) {
      return
    }
    
    isSubmitting.value = true
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Show success message
      alert(isEditing.value ? 'Contacto actualizado exitosamente' : 'Contacto creado exitosamente')
      
      // Redirect to contacts list
      router.push('/crm/contacts')
    } catch (error) {
      console.error('Error saving contact:', error)
      alert('Error al guardar el contacto. Por favor intenta nuevamente.')
    } finally {
      isSubmitting.value = false
    }
  }
  
  const resetForm = () => {
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
    errors.value = {}
  }
  
  onMounted(() => {
    // Check if editing
    if (route.params.id) {
      isEditing.value = true
      loadContact(route.params.id)
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
  
  @media (max-width: 768px) {
    .col-lg-4 {
      margin-top: 2rem;
    }
  }
  </style>
  