<template>
    <DashboardLayout>
      <div class="container-fluid">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h3 mb-1">{{ isEditing ? 'Editar Lead' : 'Nuevo Lead' }}</h1>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <router-link to="/dashboard">Dashboard</router-link>
                </li>
                <li class="breadcrumb-item">
                  <router-link to="/crm/leads">Leads</router-link>
                </li>
                <li class="breadcrumb-item active">{{ isEditing ? 'Editar' : 'Nuevo' }}</li>
              </ol>
            </nav>
          </div>
          <div class="btn-group">
            <router-link to="/crm/leads" class="btn btn-outline-secondary">
              <i class="bi bi-arrow-left me-2"></i>Volver
            </router-link>
          </div>
        </div>
  
        <!-- Lead Form -->
        <div class="row">
          <div class="col-lg-8">
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white">
                <h5 class="card-title mb-0">
                  <i class="bi bi-person-plus me-2 text-primary"></i>
                  Información del Lead
                </h5>
              </div>
              <div class="card-body">
                <form @submit.prevent="saveLead">
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
                        v-model="leadForm.name" 
                        required
                        :class="{ 'is-invalid': errors.name }"
                      />
                      <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Apellido</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="leadForm.lastName"
                        :class="{ 'is-invalid': errors.lastName }"
                      />
                      <div v-if="errors.lastName" class="invalid-feedback">{{ errors.lastName }}</div>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Email <span class="text-danger">*</span></label>
                      <input 
                        type="email" 
                        class="form-control" 
                        v-model="leadForm.email" 
                        required
                        :class="{ 'is-invalid': errors.email }"
                      />
                      <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Teléfono</label>
                      <input 
                        type="tel" 
                        class="form-control" 
                        v-model="leadForm.phone"
                        :class="{ 'is-invalid': errors.phone }"
                      />
                      <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
                    </div>
  
                    <!-- Company Information -->
                    <div class="col-12 mt-4">
                      <h6 class="text-muted mb-3">
                        <i class="bi bi-building me-2"></i>Información de la Empresa
                      </h6>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Empresa</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="leadForm.company"
                        :class="{ 'is-invalid': errors.company }"
                      />
                      <div v-if="errors.company" class="invalid-feedback">{{ errors.company }}</div>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Cargo</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="leadForm.position"
                        :class="{ 'is-invalid': errors.position }"
                      />
                      <div v-if="errors.position" class="invalid-feedback">{{ errors.position }}</div>
                    </div>
  
                    <!-- Lead Information -->
                    <div class="col-12 mt-4">
                      <h6 class="text-muted mb-3">
                        <i class="bi bi-bullseye me-2"></i>Información del Lead
                      </h6>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Fuente del Lead</label>
                      <select 
                        class="form-select" 
                        v-model="leadForm.source"
                        :class="{ 'is-invalid': errors.source }"
                      >
                        <option value="">Seleccionar fuente</option>
                        <option v-for="source in leadSources" :key="source" :value="source">
                          {{ source }}
                        </option>
                      </select>
                      <div v-if="errors.source" class="invalid-feedback">{{ errors.source }}</div>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Estado</label>
                      <select 
                        class="form-select" 
                        v-model="leadForm.status"
                        :class="{ 'is-invalid': errors.status }"
                      >
                        <option value="new">Nuevo</option>
                        <option value="contacted">Contactado</option>
                        <option value="qualified">Calificado</option>
                        <option value="converted">Convertido</option>
                        <option value="lost">Perdido</option>
                      </select>
                      <div v-if="errors.status" class="invalid-feedback">{{ errors.status }}</div>
                    </div>
  
                    <div class="col-md-6">
                      <label class="form-label">Puntuación (0-100)</label>
                      <input 
                        type="range" 
                        class="form-range" 
                        v-model="leadForm.score" 
                        min="0" 
                        max="100"
                        :class="{ 'is-invalid': errors.score }"
                      />
                      <div class="d-flex justify-content-between">
                        <small class="text-muted">0</small>
                        <strong class="text-primary">{{ leadForm.score }}</strong>
                        <small class="text-muted">100</small>
                      </div>
                      <div v-if="errors.score" class="invalid-feedback">{{ errors.score }}</div>
                    </div>
  
                    <div class="col-md-6">
                      <label class="form-label">Asignar a</label>
                      <select 
                        class="form-select" 
                        v-model="leadForm.assignedTo"
                        :class="{ 'is-invalid': errors.assignedTo }"
                      >
                        <option value="">Sin asignar</option>
                        <option v-for="user in users" :key="user.id" :value="user.id">
                          {{ user.name }}
                        </option>
                      </select>
                      <div v-if="errors.assignedTo" class="invalid-feedback">{{ errors.assignedTo }}</div>
                    </div>
  
                    <div class="col-md-6">
                      <label class="form-label">Valor Estimado (USD)</label>
                      <input 
                        type="number" 
                        class="form-control" 
                        v-model="leadForm.estimatedValue" 
                        min="0"
                        step="100"
                        :class="{ 'is-invalid': errors.estimatedValue }"
                      />
                      <div v-if="errors.estimatedValue" class="invalid-feedback">{{ errors.estimatedValue }}</div>
                    </div>
  
                    <div class="col-md-6">
                      <label class="form-label">Fecha de Seguimiento</label>
                      <input 
                        type="date" 
                        class="form-control" 
                        v-model="leadForm.followUpDate"
                        :class="{ 'is-invalid': errors.followUpDate }"
                      />
                      <div v-if="errors.followUpDate" class="invalid-feedback">{{ errors.followUpDate }}</div>
                    </div>
  
                    <!-- Additional Information -->
                    <div class="col-12 mt-4">
                      <h6 class="text-muted mb-3">
                        <i class="bi bi-file-text me-2"></i>Información Adicional
                      </h6>
                    </div>
                    
                    <div class="col-12">
                      <label class="form-label">Intereses/Necesidades</label>
                      <textarea 
                        class="form-control" 
                        v-model="leadForm.interests" 
                        rows="3"
                        placeholder="Describe los intereses o necesidades del lead..."
                        :class="{ 'is-invalid': errors.interests }"
                      ></textarea>
                      <div v-if="errors.interests" class="invalid-feedback">{{ errors.interests }}</div>
                    </div>
  
                    <div class="col-12">
                      <label class="form-label">Notas</label>
                      <textarea 
                        class="form-control" 
                        v-model="leadForm.notes" 
                        rows="4"
                        placeholder="Notas adicionales sobre el lead..."
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
                    @click="saveLead"
                    :disabled="isSubmitting"
                  >
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-check-circle me-2"></i>
                    {{ isEditing ? 'Actualizar Lead' : 'Crear Lead' }}
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
                    to="/crm/leads" 
                    class="btn btn-outline-danger"
                  >
                    <i class="bi bi-x-circle me-2"></i>
                    Cancelar
                  </router-link>
                </div>
              </div>
            </div>
  
            <!-- Score Indicator -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white">
                <h6 class="card-title mb-0">
                  <i class="bi bi-speedometer2 me-2 text-info"></i>
                  Indicador de Puntuación
                </h6>
              </div>
              <div class="card-body text-center">
                <div class="score-circle mb-3" :class="getScoreClass(leadForm.score)">
                  <span class="score-value">{{ leadForm.score }}</span>
                </div>
                <p class="mb-0">
                  <strong>{{ getScoreLabel(leadForm.score) }}</strong>
                </p>
                <small class="text-muted">{{ getScoreDescription(leadForm.score) }}</small>
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
                    <small>Asigna una puntuación realista</small>
                  </li>
                  <li class="mb-2">
                    <i class="bi bi-check-circle text-success me-2"></i>
                    <small>Programa una fecha de seguimiento</small>
                  </li>
                  <li>
                    <i class="bi bi-check-circle text-success me-2"></i>
                    <small>Documenta intereses y necesidades</small>
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
  
  const leadForm = ref({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    source: '',
    status: 'new',
    score: 50,
    assignedTo: '',
    estimatedValue: 0,
    followUpDate: '',
    interests: '',
    notes: ''
  })
  
  const leadSources = ref([
    'Sitio Web',
    'Redes Sociales',
    'Email Marketing',
    'Referido',
    'Evento',
    'Llamada Fría',
    'Publicidad Online',
    'SEO/SEM',
    'Webinar',
    'Feria Comercial'
  ])
  
  const users = ref([
    { id: 1, name: 'Juan Pérez' },
    { id: 2, name: 'María García' },
    { id: 3, name: 'Carlos López' },
    { id: 4, name: 'Ana Rodríguez' }
  ])
  
  const loadLead = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock data for editing
      leadForm.value = {
        name: 'Roberto',
        lastName: 'Silva',
        email: 'roberto.silva@email.com',
        phone: '+57 300 123 4567',
        company: 'Tech Solutions',
        position: 'Gerente de TI',
        source: 'Sitio Web',
        status: 'contacted',
        score: 75,
        assignedTo: 1,
        estimatedValue: 15000,
        followUpDate: '2024-03-15',
        interests: 'Interesado en soluciones de automatización y software personalizado.',
        notes: 'Lead calificado con alto potencial de conversión.'
      }
    } catch (error) {
      console.error('Error loading lead:', error)
    }
  }
  
  const validateForm = () => {
    errors.value = {}
    
    if (!leadForm.value.name.trim()) {
      errors.value.name = 'El nombre es requerido'
    }
    
    if (!leadForm.value.email.trim()) {
      errors.value.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadForm.value.email)) {
      errors.value.email = 'El email no es válido'
    }
    
    return Object.keys(errors.value).length === 0
  }
  
  const saveLead = async () => {
    if (!validateForm()) {
      return
    }
    
    isSubmitting.value = true
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Show success message
      alert(isEditing.value ? 'Lead actualizado exitosamente' : 'Lead creado exitosamente')
      
      // Redirect to leads list
      router.push('/crm/leads')
    } catch (error) {
      console.error('Error saving lead:', error)
      alert('Error al guardar el lead. Por favor intenta nuevamente.')
    } finally {
      isSubmitting.value = false
    }
  }
  
  const resetForm = () => {
    leadForm.value = {
      name: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      source: '',
      status: 'new',
      score: 50,
      assignedTo: '',
      estimatedValue: 0,
      followUpDate: '',
      interests: '',
      notes: ''
    }
    errors.value = {}
  }
  
  const getScoreClass = (score) => {
    if (score >= 80) return 'score-hot'
    if (score >= 50) return 'score-warm'
    return 'score-cold'
  }
  
  const getScoreLabel = (score) => {
    if (score >= 80) return 'Caliente'
    if (score >= 50) return 'Tibio'
    return 'Frío'
  }
  
  const getScoreDescription = (score) => {
    if (score >= 80) return 'Alta probabilidad de conversión'
    if (score >= 50) return 'Probabilidad media de conversión'
    return 'Baja probabilidad de conversión'
  }
  
  onMounted(() => {
    // Check if editing
    if (route.params.id) {
      isEditing.value = true
      loadLead(route.params.id)
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
  
  .score-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    font-weight: bold;
    font-size: 1.5rem;
    color: white;
  }
  
  .score-hot {
    background: linear-gradient(135deg, #dc3545, #fd7e14);
  }
  
  .score-warm {
    background: linear-gradient(135deg, #ffc107, #fd7e14);
  }
  
  .score-cold {
    background: linear-gradient(135deg, #6c757d, #adb5bd);
  }
  
  .score-value {
    font-size: 1.25rem;
    font-weight: 700;
  }
  
  @media (max-width: 768px) {
    .col-lg-4 {
      margin-top: 2rem;
    }
  }
  </style>
  