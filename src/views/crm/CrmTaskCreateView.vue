<template>
    <DashboardLayout>
      <div class="container-fluid">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h3 mb-1">{{ isEditing ? 'Editar Tarea' : 'Nueva Tarea' }}</h1>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <router-link to="/dashboard">Dashboard</router-link>
                </li>
                <li class="breadcrumb-item">
                  <router-link to="/crm/tasks">Tareas</router-link>
                </li>
                <li class="breadcrumb-item active">{{ isEditing ? 'Editar' : 'Nueva' }}</li>
              </ol>
            </nav>
          </div>
          <div class="btn-group">
            <router-link to="/crm/tasks" class="btn btn-outline-secondary">
              <i class="bi bi-arrow-left me-2"></i>Volver
            </router-link>
          </div>
        </div>
  
        <!-- Task Form -->
        <div class="row">
          <div class="col-lg-8">
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white">
                <h5 class="card-title mb-0">
                  <i class="bi bi-check-square me-2 text-primary"></i>
                  Información de la Tarea
                </h5>
              </div>
              <div class="card-body">
                <form @submit.prevent="saveTask">
                  <div class="row g-3">
                    <!-- Basic Information -->
                    <div class="col-12">
                      <h6 class="text-muted mb-3">
                        <i class="bi bi-info-circle me-2"></i>Información Básica
                      </h6>
                    </div>
                    
                    <div class="col-12">
                      <label class="form-label">Título <span class="text-danger">*</span></label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="taskForm.title" 
                        required
                        :class="{ 'is-invalid': errors.title }"
                      >
                      <div v-if="errors.title" class="invalid-feedback">{{ errors.title }}</div>
                    </div>
                    
                    <div class="col-12">
                      <label class="form-label">Descripción</label>
                      <textarea 
                        class="form-control" 
                        v-model="taskForm.description" 
                        rows="4"
                        placeholder="Describe la tarea en detalle..."
                        :class="{ 'is-invalid': errors.description }"
                      ></textarea>
                      <div v-if="errors.description" class="invalid-feedback">{{ errors.description }}</div>
                    </div>
  
                    <!-- Assignment and Priority -->
                    <div class="col-12 mt-4">
                      <h6 class="text-muted mb-3">
                        <i class="bi bi-person-gear me-2"></i>Asignación y Prioridad
                      </h6>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Asignado a <span class="text-danger">*</span></label>
                      <select 
                        class="form-select" 
                        v-model="taskForm.assignedTo" 
                        required
                        :class="{ 'is-invalid': errors.assignedTo }"
                      >
                        <option value="">Seleccionar usuario</option>
                        <option v-for="user in users" :key="user.id" :value="user.id">
                          {{ user.name }}
                        </option>
                      </select>
                      <div v-if="errors.assignedTo" class="invalid-feedback">{{ errors.assignedTo }}</div>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Prioridad</label>
                      <select 
                        class="form-select" 
                        v-model="taskForm.priority"
                        :class="{ 'is-invalid': errors.priority }"
                      >
                        <option value="low">Baja</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                        <option value="urgent">Urgente</option>
                      </select>
                      <div v-if="errors.priority" class="invalid-feedback">{{ errors.priority }}</div>
                    </div>
  
                    <div class="col-md-6">
                      <label class="form-label">Estado</label>
                      <select 
                        class="form-select" 
                        v-model="taskForm.status"
                        :class="{ 'is-invalid': errors.status }"
                      >
                        <option value="pending">Pendiente</option>
                        <option value="in_progress">En Progreso</option>
                        <option value="completed">Completada</option>
                        <option value="cancelled">Cancelada</option>
                      </select>
                      <div v-if="errors.status" class="invalid-feedback">{{ errors.status }}</div>
                    </div>
  
                    <div class="col-md-6">
                      <label class="form-label">Tipo de Tarea</label>
                      <select 
                        class="form-select" 
                        v-model="taskForm.type"
                        :class="{ 'is-invalid': errors.type }"
                      >
                        <option value="">Seleccionar tipo</option>
                        <option value="call">Llamada</option>
                        <option value="email">Email</option>
                        <option value="meeting">Reunión</option>
                        <option value="follow_up">Seguimiento</option>
                        <option value="demo">Demo</option>
                        <option value="proposal">Propuesta</option>
                        <option value="other">Otro</option>
                      </select>
                      <div v-if="errors.type" class="invalid-feedback">{{ errors.type }}</div>
                    </div>
  
                    <!-- Dates and Time -->
                    <div class="col-12 mt-4">
                      <h6 class="text-muted mb-3">
                        <i class="bi bi-calendar me-2"></i>Fechas y Tiempo
                      </h6>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Fecha de Vencimiento <span class="text-danger">*</span></label>
                      <input 
                        type="date" 
                        class="form-control" 
                        v-model="taskForm.dueDate" 
                        required
                        :class="{ 'is-invalid': errors.dueDate }"
                      >
                      <div v-if="errors.dueDate" class="invalid-feedback">{{ errors.dueDate }}</div>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Hora de Vencimiento</label>
                      <input 
                        type="time" 
                        class="form-control" 
                        v-model="taskForm.dueTime"
                        :class="{ 'is-invalid': errors.dueTime }"
                      >
                      <div v-if="errors.dueTime" class="invalid-feedback">{{ errors.dueTime }}</div>
                    </div>
  
                    <div class="col-md-6">
                      <label class="form-label">Fecha de Recordatorio</label>
                      <input 
                        type="date" 
                        class="form-control" 
                        v-model="taskForm.reminderDate"
                        :class="{ 'is-invalid': errors.reminderDate }"
                      >
                      <div v-if="errors.reminderDate" class="invalid-feedback">{{ errors.reminderDate }}</div>
                    </div>
  
                    <div class="col-md-6">
                      <label class="form-label">Hora de Recordatorio</label>
                      <input 
                        type="time" 
                        class="form-control" 
                        v-model="taskForm.reminderTime"
                        :class="{ 'is-invalid': errors.reminderTime }"
                      >
                      <div v-if="errors.reminderTime" class="invalid-feedback">{{ errors.reminderTime }}</div>
                    </div>
  
                    <!-- Related Records -->
                    <div class="col-12 mt-4">
                      <h6 class="text-muted mb-3">
                        <i class="bi bi-link-45deg me-2"></i>Registros Relacionados
                      </h6>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Contacto Relacionado</label>
                      <select 
                        class="form-select" 
                        v-model="taskForm.contactId"
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
                      <label class="form-label">Oportunidad Relacionada</label>
                      <select 
                        class="form-select" 
                        v-model="taskForm.opportunityId"
                        :class="{ 'is-invalid': errors.opportunityId }"
                      >
                        <option value="">Seleccionar oportunidad</option>
                        <option v-for="opportunity in opportunities" :key="opportunity.id" :value="opportunity.id">
                          {{ opportunity.title }}
                        </option>
                      </select>
                      <div v-if="errors.opportunityId" class="invalid-feedback">{{ errors.opportunityId }}</div>
                    </div>
  
                    <!-- Additional Information -->
                    <div class="col-12 mt-4">
                      <h6 class="text-muted mb-3">
                        <i class="bi bi-file-text me-2"></i>Información Adicional
                      </h6>
                    </div>
                    
                    <div class="col-12">
                      <label class="form-label">Notas</label>
                      <textarea 
                        class="form-control" 
                        v-model="taskForm.notes" 
                        rows="3"
                        placeholder="Notas adicionales sobre la tarea..."
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
                    @click="saveTask"
                    :disabled="isSubmitting"
                  >
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-check-circle me-2"></i>
                    {{ isEditing ? 'Actualizar Tarea' : 'Crear Tarea' }}
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
                    to="/crm/tasks" 
                    class="btn btn-outline-danger"
                  >
                    <i class="bi bi-x-circle me-2"></i>
                    Cancelar
                  </router-link>
                </div>
              </div>
            </div>
  
            <!-- Task Summary -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white">
                <h6 class="card-title mb-0">
                  <i class="bi bi-info-circle me-2 text-info"></i>
                  Resumen
                </h6>
              </div>
              <div class="card-body">
                <div class="summary-item">
                  <span class="summary-label">Prioridad:</span>
                  <span class="summary-value" :class="getPriorityClass(taskForm.priority)">
                    {{ getPriorityText(taskForm.priority) }}
                  </span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Estado:</span>
                  <span class="summary-value" :class="getStatusClass(taskForm.status)">
                    {{ getStatusText(taskForm.status) }}
                  </span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Vencimiento:</span>
                  <span class="summary-value">
                    {{ taskForm.dueDate ? formatDate(taskForm.dueDate) : 'Sin fecha' }}
                  </span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Asignado a:</span>
                  <span class="summary-value">{{ getUserName(taskForm.assignedTo) }}</span>
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
                    <small>Define un título claro y específico</small>
                  </li>
                  <li class="mb-2">
                    <i class="bi bi-check-circle text-success me-2"></i>
                    <small>Establece fechas de vencimiento realistas</small>
                  </li>
                  <li class="mb-2">
                    <i class="bi bi-check-circle text-success me-2"></i>
                    <small>Asigna la prioridad correcta</small>
                  </li>
                  <li>
                    <i class="bi bi-check-circle text-success me-2"></i>
                    <small>Relaciona con contactos u oportunidades</small>
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
  
  const taskForm = ref({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    status: 'pending',
    type: '',
    dueDate: '',
    dueTime: '',
    reminderDate: '',
    reminderTime: '',
    contactId: '',
    opportunityId: '',
    notes: ''
  })
  
  const users = ref([
    { id: 1, name: 'Juan Pérez' },
    { id: 2, name: 'María García' },
    { id: 3, name: 'Carlos López' },
    { id: 4, name: 'Ana Rodríguez' }
  ])
  
  const contacts = ref([
    { id: 1, name: 'Juan Pérez - TechCorp' },
    { id: 2, name: 'María García - XYZ Ltd' },
    { id: 3, name: 'Carlos López - DEF Inc' }
  ])
  
  const opportunities = ref([
    { id: 1, title: 'Sistema ERP Completo - TechCorp' },
    { id: 2, title: 'Consultoría Digital - Manufacturing Plus' },
    { id: 3, title: 'Software Personalizado - HealthCare' }
  ])
  
  const loadTask = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock data for editing
      taskForm.value = {
        title: 'Llamada de seguimiento con cliente',
        description: 'Realizar llamada de seguimiento para revisar propuesta enviada la semana pasada.',
        assignedTo: 1,
        priority: 'high',
        status: 'pending',
        type: 'call',
        dueDate: '2024-03-15',
        dueTime: '10:00',
        reminderDate: '2024-03-14',
        reminderTime: '16:00',
        contactId: 1,
        opportunityId: 1,
        notes: 'Cliente mostró interés en la propuesta. Revisar dudas sobre implementación.'
      }
    } catch (error) {
      console.error('Error loading task:', error)
    }
  }
  
  const validateForm = () => {
    errors.value = {}
    
    if (!taskForm.value.title.trim()) {
      errors.value.title = 'El título es requerido'
    }
    
    if (!taskForm.value.assignedTo) {
      errors.value.assignedTo = 'Debe asignar la tarea a un usuario'
    }
    
    if (!taskForm.value.dueDate) {
      errors.value.dueDate = 'La fecha de vencimiento es requerida'
    }
    
    return Object.keys(errors.value).length === 0
  }
  
  const saveTask = async () => {
    if (!validateForm()) {
      return
    }
    
    isSubmitting.value = true
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Show success message
      alert(isEditing.value ? 'Tarea actualizada exitosamente' : 'Tarea creada exitosamente')
      
      // Redirect to tasks list
      router.push('/crm/tasks')
    } catch (error) {
      console.error('Error saving task:', error)
      alert('Error al guardar la tarea. Por favor intenta nuevamente.')
    } finally {
      isSubmitting.value = false
    }
  }
  
  const resetForm = () => {
    taskForm.value = {
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      status: 'pending',
      type: '',
      dueDate: '',
      dueTime: '',
      reminderDate: '',
      reminderTime: '',
      contactId: '',
      opportunityId: '',
      notes: ''
    }
    errors.value = {}
  }
  
  const getPriorityClass = (priority) => {
    const classes = {
      'low': 'text-success',
      'medium': 'text-warning',
      'high': 'text-danger',
      'urgent': 'text-danger fw-bold'
    }
    return classes[priority] || 'text-secondary'
  }
  
  const getPriorityText = (priority) => {
    const texts = {
      'low': 'Baja',
      'medium': 'Media',
      'high': 'Alta',
      'urgent': 'Urgente'
    }
    return texts[priority] || priority
  }
  
  const getStatusClass = (status) => {
    const classes = {
      'pending': 'text-warning',
      'in_progress': 'text-info',
      'completed': 'text-success',
      'cancelled': 'text-danger'
    }
    return classes[status] || 'text-secondary'
  }
  
  const getStatusText = (status) => {
    const texts = {
      'pending': 'Pendiente',
      'in_progress': 'En Progreso',
      'completed': 'Completada',
      'cancelled': 'Cancelada'
    }
    return texts[status] || status
  }
  
  const getUserName = (userId) => {
    const user = users.value.find(u => u.id === userId)
    return user ? user.name : 'Sin asignar'
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  onMounted(() => {
    // Check if editing
    if (route.params.id) {
      isEditing.value = true
      loadTask(route.params.id)
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
  