<template>
    <DashboardLayout>
      <div class="container-fluid">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h3 mb-1">{{ isEditing ? 'Editar Oportunidad' : 'Nueva Oportunidad' }}</h1>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <router-link to="/dashboard">Dashboard</router-link>
                </li>
                <li class="breadcrumb-item">
                  <router-link to="/crm/opportunities">Oportunidades</router-link>
                </li>
                <li class="breadcrumb-item active">{{ isEditing ? 'Editar' : 'Nueva' }}</li>
              </ol>
            </nav>
          </div>
          <div class="btn-group">
            <router-link to="/crm/opportunities" class="btn btn-outline-secondary">
              <i class="bi bi-arrow-left me-2"></i>Volver
            </router-link>
          </div>
        </div>
  
        <!-- Opportunity Form -->
        <div class="row">
          <div class="col-lg-8">
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white">
                <h5 class="card-title mb-0">
                  <i class="bi bi-bullseye me-2 text-primary"></i>
                  Información de la Oportunidad
                </h5>
              </div>
              <div class="card-body">
                <form @submit.prevent="saveOpportunity">
                  <div class="row g-3">
                    <!-- Basic Information -->
                    <div class="col-12">
                      <h6 class="text-muted mb-3">
                        <i class="bi bi-info-circle me-2"></i>Información Básica
                      </h6>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Título <span class="text-danger">*</span></label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="opportunityForm.title" 
                        required
                        :class="{ 'is-invalid': errors.title }"
                      >
                      <div v-if="errors.title" class="invalid-feedback">{{ errors.title }}</div>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Empresa <span class="text-danger">*</span></label>
                      <select 
                        class="form-select" 
                        v-model="opportunityForm.companyId" 
                        required
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
                      <label class="form-label">Contacto Principal</label>
                      <select 
                        class="form-select" 
                        v-model="opportunityForm.contactId"
                        :class="{ 'is-invalid': errors.contactId }"
                      >
                        <option value="">Seleccionar contacto</option>
                        <option v-for="contact in contacts" :key="contact.id" :value="contact.id">
                          {{ contact.name }}
                        </option>
                      </select>
                      <div v-if="errors.contactId" class="invalid-feedback">{{ errors.contactId }}</div>
                    </div>
  
                    <div class="col-md-6">
                      <label class="form-label">Propietario <span class="text-danger">*</span></label>
                      <select 
                        class="form-select" 
                        v-model="opportunityForm.ownerId" 
                        required
                        :class="{ 'is-invalid': errors.ownerId }"
                      >
                        <option value="">Seleccionar propietario</option>
                        <option v-for="user in users" :key="user.id" :value="user.id">
                          {{ user.name }}
                        </option>
                      </select>
                      <div v-if="errors.ownerId" class="invalid-feedback">{{ errors.ownerId }}</div>
                    </div>
  
                    <!-- Financial Information -->
                    <div class="col-12 mt-4">
                      <h6 class="text-muted mb-3">
                        <i class="bi bi-currency-dollar me-2"></i>Información Financiera
                      </h6>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Valor (USD) <span class="text-danger">*</span></label>
                      <input 
                        type="number" 
                        class="form-control" 
                        v-model="opportunityForm.value" 
                        min="0"
                        step="100"
                        required
                        :class="{ 'is-invalid': errors.value }"
                      >
                      <div v-if="errors.value" class="invalid-feedback">{{ errors.value }}</div>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Probabilidad (%)</label>
                      <input 
                        type="range" 
                        class="form-range" 
                        v-model="opportunityForm.probability" 
                        min="0" 
                        max="100"
                        :class="{ 'is-invalid': errors.probability }"
                      >
                      <div class="d-flex justify-content-between">
                        <small class="text-muted">0%</small>
                        <strong class="text-primary">{{ opportunityForm.probability }}%</strong>
                        <small class="text-muted">100%</small>
                      </div>
                      <div v-if="errors.probability" class="invalid-feedback">{{ errors.probability }}</div>
                    </div>
  
                    <!-- Pipeline Information -->
                    <div class="col-12 mt-4">
                      <h6 class="text-muted mb-3">
                        <i class="bi bi-diagram-3 me-2"></i>Pipeline
                      </h6>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Etapa <span class="text-danger">*</span></label>
                      <select 
                        class="form-select" 
                        v-model="opportunityForm.stageId" 
                        required
                        :class="{ 'is-invalid': errors.stageId }"
                      >
                        <option value="">Seleccionar etapa</option>
                        <option v-for="stage in pipelineStages" :key="stage.id" :value="stage.id">
                          {{ stage.name }}
                        </option>
                      </select>
                      <div v-if="errors.stageId" class="invalid-feedback">{{ errors.stageId }}</div>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Fecha de Cierre Estimada <span class="text-danger">*</span></label>
                      <input 
                        type="date" 
                        class="form-control" 
                        v-model="opportunityForm.closeDate" 
                        required
                        :class="{ 'is-invalid': errors.closeDate }"
                      >
                      <div v-if="errors.closeDate" class="invalid-feedback">{{ errors.closeDate }}</div>
                    </div>
  
                    <div class="col-md-6">
                      <label class="form-label">Fuente</label>
                      <select 
                        class="form-select" 
                        v-model="opportunityForm.source"
                        :class="{ 'is-invalid': errors.source }"
                      >
                        <option value="">Seleccionar fuente</option>
                        <option v-for="source in opportunitySources" :key="source" :value="source">
                          {{ source }}
                        </option>
                      </select>
                      <div v-if="errors.source" class="invalid-feedback">{{ errors.source }}</div>
                    </div>
  
                    <div class="col-md-6">
                      <label class="form-label">Tipo</label>
                      <select 
                        class="form-select" 
                        v-model="opportunityForm.type"
                        :class="{ 'is-invalid': errors.type }"
                      >
                        <option value="">Seleccionar tipo</option>
                        <option value="new_business">Nuevo Negocio</option>
                        <option value="existing_customer">Cliente Existente</option>
                        <option value="renewal">Renovación</option>
                        <option value="upgrade">Upgrade</option>
                      </select>
                      <div v-if="errors.type" class="invalid-feedback">{{ errors.type }}</div>
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
                        v-model="opportunityForm.description" 
                        rows="4"
                        placeholder="Describe la oportunidad, productos/servicios involucrados..."
                        :class="{ 'is-invalid': errors.description }"
                      ></textarea>
                      <div v-if="errors.description" class="invalid-feedback">{{ errors.description }}</div>
                    </div>
  
                    <div class="col-12">
                      <label class="form-label">Próximos Pasos</label>
                      <textarea 
                        class="form-control" 
                        v-model="opportunityForm.nextSteps" 
                        rows="3"
                        placeholder="Define los próximos pasos para avanzar la oportunidad..."
                        :class="{ 'is-invalid': errors.nextSteps }"
                      ></textarea>
                      <div v-if="errors.nextSteps" class="invalid-feedback">{{ errors.nextSteps }}</div>
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
                    @click="saveOpportunity"
                    :disabled="isSubmitting"
                  >
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-check-circle me-2"></i>
                    {{ isEditing ? 'Actualizar Oportunidad' : 'Crear Oportunidad' }}
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
                    to="/crm/opportunities" 
                    class="btn btn-outline-danger"
                  >
                    <i class="bi bi-x-circle me-2"></i>
                    Cancelar
                  </router-link>
                </div>
              </div>
            </div>
  
            <!-- Opportunity Summary -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white">
                <h6 class="card-title mb-0">
                  <i class="bi bi-bar-chart me-2 text-info"></i>
                  Resumen
                </h6>
              </div>
              <div class="card-body">
                <div class="summary-item">
                  <span class="summary-label">Valor:</span>
                  <span class="summary-value">${{ Number(opportunityForm.value || 0).toLocaleString() }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Probabilidad:</span>
                  <span class="summary-value">{{ opportunityForm.probability }}%</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Valor Esperado:</span>
                  <span class="summary-value text-success">
                    ${{ Math.round((opportunityForm.value || 0) * (opportunityForm.probability || 0) / 100).toLocaleString() }}
                  </span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Etapa:</span>
                  <span class="summary-value">{{ getStageName(opportunityForm.stageId) }}</span>
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
                    <small>Define un título claro y descriptivo</small>
                  </li>
                  <li class="mb-2">
                    <i class="bi bi-check-circle text-success me-2"></i>
                    <small>Asigna un valor realista</small>
                  </li>
                  <li class="mb-2">
                    <i class="bi bi-check-circle text-success me-2"></i>
                    <small>Establece una fecha de cierre realista</small>
                  </li>
                  <li>
                    <i class="bi bi-check-circle text-success me-2"></i>
                    <small>Define claramente los próximos pasos</small>
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
  
  const opportunityForm = ref({
    title: '',
    companyId: '',
    contactId: '',
    ownerId: '',
    value: 0,
    probability: 50,
    stageId: '',
    closeDate: '',
    source: '',
    type: '',
    description: '',
    nextSteps: ''
  })
  
  const companies = ref([
    { id: 1, name: 'TechCorp Solutions' },
    { id: 2, name: 'Manufacturing Plus' },
    { id: 3, name: 'HealthCare Innovations' },
    { id: 4, name: 'StartUp Inc' }
  ])
  
  const contacts = ref([
    { id: 1, name: 'Juan Pérez' },
    { id: 2, name: 'María García' },
    { id: 3, name: 'Carlos López' },
    { id: 4, name: 'Ana Rodríguez' }
  ])
  
  const users = ref([
    { id: 1, name: 'Juan Pérez' },
    { id: 2, name: 'María García' },
    { id: 3, name: 'Carlos López' }
  ])
  
  const pipelineStages = ref([
    { id: 1, name: 'Prospecto' },
    { id: 2, name: 'Calificado' },
    { id: 3, name: 'Propuesta' },
    { id: 4, name: 'Negociación' },
    { id: 5, name: 'Cerrado Ganado' },
    { id: 6, name: 'Cerrado Perdido' }
  ])
  
  const opportunitySources = ref([
    'Sitio Web',
    'Referido',
    'Llamada Fría',
    'Email Marketing',
    'Redes Sociales',
    'Evento',
    'Partner',
    'Publicidad'
  ])
  
  const loadOpportunity = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock data for editing
      opportunityForm.value = {
        title: 'Sistema ERP Completo',
        companyId: 1,
        contactId: 1,
        ownerId: 1,
        value: 85000,
        probability: 75,
        stageId: 4,
        closeDate: '2024-03-15',
        source: 'Referido',
        type: 'new_business',
        description: 'Implementación completa de sistema ERP para empresa de tecnología con módulos de CRM, inventario y contabilidad.',
        nextSteps: 'Presentar propuesta técnica y comercial. Programar demo del sistema.'
      }
    } catch (error) {
      console.error('Error loading opportunity:', error)
    }
  }
  
  const validateForm = () => {
    errors.value = {}
    
    if (!opportunityForm.value.title.trim()) {
      errors.value.title = 'El título es requerido'
    }
    
    if (!opportunityForm.value.companyId) {
      errors.value.companyId = 'La empresa es requerida'
    }
    
    if (!opportunityForm.value.ownerId) {
      errors.value.ownerId = 'El propietario es requerido'
    }
    
    if (!opportunityForm.value.value || opportunityForm.value.value <= 0) {
      errors.value.value = 'El valor debe ser mayor a 0'
    }
    
    if (!opportunityForm.value.stageId) {
      errors.value.stageId = 'La etapa es requerida'
    }
    
    if (!opportunityForm.value.closeDate) {
      errors.value.closeDate = 'La fecha de cierre es requerida'
    }
    
    return Object.keys(errors.value).length === 0
  }
  
  const saveOpportunity = async () => {
    if (!validateForm()) {
      return
    }
    
    isSubmitting.value = true
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Show success message
      alert(isEditing.value ? 'Oportunidad actualizada exitosamente' : 'Oportunidad creada exitosamente')
      
      // Redirect to opportunities list
      router.push('/crm/opportunities')
    } catch (error) {
      console.error('Error saving opportunity:', error)
      alert('Error al guardar la oportunidad. Por favor intenta nuevamente.')
    } finally {
      isSubmitting.value = false
    }
  }
  
  const resetForm = () => {
    opportunityForm.value = {
      title: '',
      companyId: '',
      contactId: '',
      ownerId: '',
      value: 0,
      probability: 50,
      stageId: '',
      closeDate: '',
      source: '',
      type: '',
      description: '',
      nextSteps: ''
    }
    errors.value = {}
  }
  
  const getStageName = (stageId) => {
    const stage = pipelineStages.value.find(s => s.id === stageId)
    return stage ? stage.name : 'Sin etapa'
  }
  
  onMounted(() => {
    // Check if editing
    if (route.params.id) {
      isEditing.value = true
      loadOpportunity(route.params.id)
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
  
  .summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f1f3f4;
  }
  
  .summary-item:last-child {
    border-bottom: none;
  }
  
  .summary-label {
    font-weight: 500;
    color: var(--gray-600);
  }
  
  .summary-value {
    font-weight: 600;
    color: var(--text-color);
  }
  
  @media (max-width: 768px) {
    .col-lg-4 {
      margin-top: 2rem;
    }
  }
  </style>
  