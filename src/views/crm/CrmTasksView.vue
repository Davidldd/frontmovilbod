<template>
  <DashboardLayout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3">Gestión de Tareas</h1>
        <div class="btn-group">
          <button class="btn btn-outline-secondary" @click="toggleView">
            <i class="bi" :class="viewMode === 'list' ? 'bi-kanban' : 'bi-list'"></i>
            {{ viewMode === 'list' ? 'Vista Kanban' : 'Vista Lista' }}
          </button>
          <button class="btn btn-outline-primary" @click="exportTasks">
            <i class="bi bi-download me-2"></i>Exportar
          </button>
          <button class="btn btn-primary" @click="openNewTaskModal">
            <i class="bi bi-plus-lg me-2"></i>Nueva Tarea
          </button>
        </div>
      </div>

      <!-- Task Stats -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="task-stat">
            <div class="stat-icon bg-primary">
              <i class="bi bi-list-task"></i>
            </div>
            <div class="stat-content">
              <h4>{{ taskStats.total }}</h4>
              <p>Total Tareas</p>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="task-stat">
            <div class="stat-icon bg-warning">
              <i class="bi bi-clock"></i>
            </div>
            <div class="stat-content">
              <h4>{{ taskStats.pending }}</h4>
              <p>Pendientes</p>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="task-stat">
            <div class="stat-icon bg-info">
              <i class="bi bi-arrow-clockwise"></i>
            </div>
            <div class="stat-content">
              <h4>{{ taskStats.inProgress }}</h4>
              <p>En Progreso</p>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="task-stat">
            <div class="stat-icon bg-success">
              <i class="bi bi-check-circle"></i>
            </div>
            <div class="stat-content">
              <h4>{{ taskStats.completed }}</h4>
              <p>Completadas</p>
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
                  id="searchTask"
                  placeholder="Buscar tarea"
                  v-model="filters.search"
                >
                <label for="searchTask">
                  <i class="bi bi-search me-2"></i>Buscar tarea
                </label>
              </div>
            </div>
            <div class="col-12 col-md-2">
              <div class="form-floating">
                <select class="form-select" id="statusFilter" v-model="filters.status">
                  <option value="">Todos los estados</option>
                  <option value="pending">Pendiente</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="completed">Completada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
                <label for="statusFilter">Estado</label>
              </div>
            </div>
            <div class="col-12 col-md-2">
              <div class="form-floating">
                <select class="form-select" id="priorityFilter" v-model="filters.priority">
                  <option value="">Todas las prioridades</option>
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
                <label for="priorityFilter">Prioridad</label>
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
            <div class="col-12 col-md-2">
              <div class="form-floating">
                <input type="date" class="form-control" id="dueDateFilter" v-model="filters.dueDate">
                <label for="dueDateFilter">Fecha Límite</label>
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
          <div v-for="status in taskStatuses" :key="status.id" class="kanban-column">
            <div class="column-header">
              <h6>{{ status.name }}</h6>
              <span class="task-count">{{ getTasksByStatus(status.id).length }}</span>
            </div>
            <div class="column-content">
              <div 
                v-for="task in getTasksByStatus(status.id)" 
                :key="task.id" 
                class="task-card"
                @click="viewTask(task)"
              >
                <div class="task-header">
                  <h6>{{ task.title }}</h6>
                  <span class="priority-badge" :class="getPriorityClass(task.priority)">
                    {{ getPriorityText(task.priority) }}
                  </span>
                </div>
                <p class="task-description">{{ task.description }}</p>
                <div class="task-meta">
                  <div class="task-type">
                    <i class="bi" :class="getTaskTypeIcon(task.type)"></i>
                    {{ task.type }}
                  </div>
                  <div class="task-due-date" :class="{ 'overdue': isOverdue(task.dueDate) }">
                    <i class="bi bi-calendar"></i>
                    {{ task.dueDate }}
                  </div>
                </div>
                <div class="task-footer">
                  <img :src="getUserAvatar(task.assignedTo)" class="assignee-avatar" :alt="getUserName(task.assignedTo)">
                  <span class="assignee-name">{{ getUserName(task.assignedTo) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="card border-0 shadow-sm">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Tarea</th>
                  <th>Tipo</th>
                  <th>Prioridad</th>
                  <th>Estado</th>
                  <th>Asignado a</th>
                  <th>Fecha Límite</th>
                  <th>Progreso</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="task in filteredTasks" :key="task.id">
                  <td>
                    <div>
                      <h6 class="mb-0">{{ task.title }}</h6>
                      <small class="text-muted">{{ task.description }}</small>
                    </div>
                  </td>
                  <td>
                    <span class="badge bg-light text-dark">
                      <i class="bi" :class="getTaskTypeIcon(task.type)"></i>
                      {{ task.type }}
                    </span>
                  </td>
                  <td>
                    <span class="badge" :class="getPriorityClass(task.priority)">
                      {{ getPriorityText(task.priority) }}
                    </span>
                  </td>
                  <td>
                    <span class="badge" :class="getStatusClass(task.status)">
                      {{ getStatusText(task.status) }}
                    </span>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <img :src="getUserAvatar(task.assignedTo)" class="user-avatar me-2" :alt="getUserName(task.assignedTo)">
                      <span>{{ getUserName(task.assignedTo) }}</span>
                    </div>
                  </td>
                  <td>
                    <span :class="{ 'text-danger': isOverdue(task.dueDate) }">
                      {{ task.dueDate }}
                    </span>
                  </td>
                  <td>
                    <div class="progress" style="height: 8px;">
                      <div class="progress-bar" :style="{ width: task.progress + '%' }" :class="getProgressClass(task.progress)"></div>
                    </div>
                    <small>{{ task.progress }}%</small>
                  </td>
                  <td>
                    <div class="btn-group">
                      <button class="btn btn-sm btn-outline-primary" @click="viewTask(task)">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-secondary" @click="editTask(task)">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <div class="dropdown">
                        <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                          <i class="bi bi-three-dots"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="#" @click="markAsCompleted(task)" v-if="task.status !== 'completed'">
                            <i class="bi bi-check-circle me-2"></i>Marcar como Completada
                          </a></li>
                          <li><a class="dropdown-item" href="#" @click="duplicateTask(task)">
                            <i class="bi bi-files me-2"></i>Duplicar
                          </a></li>
                          <li><hr class="dropdown-divider"></li>
                          <li><a class="dropdown-item text-danger" href="#" @click="deleteTask(task)">
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
        </div>
      </div>
    </div>

    <!-- New Task Modal -->
    <div class="modal fade" id="newTaskModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingTask ? 'Editar Tarea' : 'Nueva Tarea' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveTask">
              <div class="row g-3">
                <div class="col-md-8">
                  <label class="form-label">Título</label>
                  <input type="text" class="form-control" v-model="taskForm.title" required>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Tipo</label>
                  <select class="form-select" v-model="taskForm.type" required>
                    <option value="Llamada">Llamada</option>
                    <option value="Email">Email</option>
                    <option value="Reunión">Reunión</option>
                    <option value="Seguimiento">Seguimiento</option>
                    <option value="Propuesta">Propuesta</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div class="col-12">
                  <label class="form-label">Descripción</label>
                  <textarea class="form-control" v-model="taskForm.description" rows="3"></textarea>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Prioridad</label>
                  <select class="form-select" v-model="taskForm.priority" required>
                    <option value="high">Alta</option>
                    <option value="medium">Media</option>
                    <option value="low">Baja</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Estado</label>
                  <select class="form-select" v-model="taskForm.status" required>
                    <option value="pending">Pendiente</option>
                    <option value="in_progress">En Progreso</option>
                    <option value="completed">Completada</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Progreso (%)</label>
                  <input type="number" class="form-control" v-model="taskForm.progress" min="0" max="100">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Asignar a</label>
                  <select class="form-select" v-model="taskForm.assignedTo" required>
                    <option v-for="user in users" :key="user.id" :value="user.id">
                      {{ user.name }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Fecha Límite</label>
                  <input type="date" class="form-control" v-model="taskForm.dueDate" required>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting" @click="saveTask">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              {{ editingTask ? 'Guardar Cambios' : 'Crear Tarea' }}
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
const users = ref([
  { id: 1, name: 'Juan Pérez', avatar: 'https://via.placeholder.com/32' },
  { id: 2, name: 'María García', avatar: 'https://via.placeholder.com/32' },
  { id: 3, name: 'Carlos López', avatar: 'https://via.placeholder.com/32' }
])

const taskStatuses = ref([
  { id: 'pending', name: 'Pendientes' },
  { id: 'in_progress', name: 'En Progreso' },
  { id: 'completed', name: 'Completadas' },
  { id: 'cancelled', name: 'Canceladas' }
])

const tasks = ref([
  {
    id: 1,
    title: 'Llamada de seguimiento - TechCorp',
    description: 'Realizar llamada de seguimiento para revisar propuesta enviada',
    type: 'Llamada',
    priority: 'high',
    status: 'pending',
    assignedTo: 1,
    dueDate: '2024-02-25',
    progress: 0,
    createdAt: '2024-02-20'
  },
  {
    id: 2,
    title: 'Enviar propuesta - Manufacturing Plus',
    description: 'Preparar y enviar propuesta técnica y comercial',
    type: 'Propuesta',
    priority: 'high',
    status: 'in_progress',
    assignedTo: 2,
    dueDate: '2024-02-28',
    progress: 60,
    createdAt: '2024-02-18'
  },
  {
    id: 3,
    title: 'Reunión de cierre - HealthCare',
    description: 'Reunión final para cerrar la oportunidad',
    type: 'Reunión',
    priority: 'medium',
    status: 'completed',
    assignedTo: 3,
    dueDate: '2024-02-22',
    progress: 100,
    createdAt: '2024-02-15'
  },
  {
    id: 4,
    title: 'Email de bienvenida - StartUp Inc',
    description: 'Enviar email de bienvenida al nuevo lead',
    type: 'Email',
    priority: 'low',
    status: 'pending',
    assignedTo: 1,
    dueDate: '2024-03-01',
    progress: 0,
    createdAt: '2024-02-21'
  }
])

const viewMode = ref('list')

const taskStats = computed(() => {
  return {
    total: tasks.value.length,
    pending: tasks.value.filter(t => t.status === 'pending').length,
    inProgress: tasks.value.filter(t => t.status === 'in_progress').length,
    completed: tasks.value.filter(t => t.status === 'completed').length
  }
})

// Filters
const filters = ref({
  search: '',
  status: '',
  priority: '',
  assigned: '',
  dueDate: ''
})

// Form state
const taskForm = ref({
  title: '',
  description: '',
  type: 'Llamada',
  priority: 'medium',
  status: 'pending',
  assignedTo: '',
  dueDate: '',
  progress: 0
})

const isSubmitting = ref(false)
const editingTask = ref(null)

// Computed properties
const filteredTasks = computed(() => {
  let filtered = tasks.value

  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    filtered = filtered.filter(task =>
      task.title.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm)
    )
  }

  if (filters.value.status) {
    filtered = filtered.filter(task => task.status === filters.value.status)
  }

  if (filters.value.priority) {
    filtered = filtered.filter(task => task.priority === filters.value.priority)
  }

  if (filters.value.assigned) {
    filtered = filtered.filter(task => task.assignedTo === filters.value.assigned)
  }

  if (filters.value.dueDate) {
    filtered = filtered.filter(task => task.dueDate === filters.value.dueDate)
  }

  return filtered
})

// Methods
const toggleView = () => {
  viewMode.value = viewMode.value === 'list' ? 'kanban' : 'list'
}

const resetFilters = () => {
  filters.value = {
    search: '',
    status: '',
    priority: '',
    assigned: '',
    dueDate: ''
  }
}

const getTasksByStatus = (status) => {
  return filteredTasks.value.filter(task => task.status === status)
}

const getPriorityClass = (priority) => {
  const classes = {
    'high': 'bg-danger',
    'medium': 'bg-warning',
    'low': 'bg-success'
  }
  return classes[priority] || 'bg-secondary'
}

const getPriorityText = (priority) => {
  const texts = {
    'high': 'Alta',
    'medium': 'Media',
    'low': 'Baja'
  }
  return texts[priority] || priority
}

const getStatusClass = (status) => {
  const classes = {
    'pending': 'bg-warning',
    'in_progress': 'bg-info',
    'completed': 'bg-success',
    'cancelled': 'bg-danger'
  }
  return classes[status] || 'bg-secondary'
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

const getTaskTypeIcon = (type) => {
  const icons = {
    'Llamada': 'bi-telephone',
    'Email': 'bi-envelope',
    'Reunión': 'bi-calendar-event',
    'Seguimiento': 'bi-arrow-clockwise',
    'Propuesta': 'bi-file-text',
    'Otro': 'bi-three-dots'
  }
  return icons[type] || 'bi-list-task'
}

const getProgressClass = (progress) => {
  if (progress >= 80) return 'bg-success'
  if (progress >= 50) return 'bg-info'
  if (progress >= 25) return 'bg-warning'
  return 'bg-danger'
}

const getUserName = (userId) => {
  const user = users.value.find(u => u.id === userId)
  return user ? user.name : 'Sin asignar'
}

const getUserAvatar = (userId) => {
  const user = users.value.find(u => u.id === userId)
  return user ? user.avatar : 'https://via.placeholder.com/32'
}

const isOverdue = (dueDate) => {
  return new Date(dueDate) < new Date()
}

const openNewTaskModal = () => {
  editingTask.value = null
  taskForm.value = {
    title: '',
    description: '',
    type: 'Llamada',
    priority: 'medium',
    status: 'pending',
    assignedTo: '',
    dueDate: '',
    progress: 0
  }
  const modal = new Modal(document.getElementById('newTaskModal'))
  modal.show()
}

const editTask = (task) => {
  editingTask.value = task
  taskForm.value = { ...task }
  const modal = new Modal(document.getElementById('newTaskModal'))
  modal.show()
}

const saveTask = async () => {
  isSubmitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (editingTask.value) {
      const index = tasks.value.findIndex(t => t.id === editingTask.value.id)
      tasks.value[index] = { ...editingTask.value, ...taskForm.value }
    } else {
      tasks.value.push({
        id: tasks.value.length + 1,
        ...taskForm.value,
        createdAt: new Date().toISOString().split('T')[0]
      })
    }
    
    Modal.getInstance(document.getElementById('newTaskModal')).hide()
  } catch (error) {
    console.error('Error saving task:', error)
  } finally {
    isSubmitting.value = false
  }
}

const viewTask = (task) => {
  console.log('View task:', task)
}

const markAsCompleted = (task) => {
  task.status = 'completed'
  task.progress = 100
}

const duplicateTask = (task) => {
  const newTask = {
    ...task,
    id: tasks.value.length + 1,
    title: `${task.title} (Copia)`,
    status: 'pending',
    progress: 0,
    createdAt: new Date().toISOString().split('T')[0]
  }
  tasks.value.push(newTask)
}

const deleteTask = async (task) => {
  if (confirm('¿Está seguro de eliminar esta tarea?')) {
    tasks.value = tasks.value.filter(t => t.id !== task.id)
  }
}

const exportTasks = () => {
  console.log('Exporting tasks...')
}
</script>

<style scoped>
.task-stat {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
}

.task-stat:hover {
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

.task-count {
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

.task-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.task-header h6 {
  margin: 0;
  font-size: 0.875rem;
  color: #2d3748;
  font-weight: 600;
  flex: 1;
}

.priority-badge {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  margin-left: 0.5rem;
}

.task-description {
  margin: 0;
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.task-type,
.task-due-date {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #a0aec0;
}

.task-due-date.overdue {
  color: #e53e3e;
  font-weight: 600;
}

.task-footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.assignee-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.assignee-name {
  font-size: 0.75rem;
  color: #4a5568;
  font-weight: 500;
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
  
  .task-stat {
    flex-direction: column;
    text-align: center;
  }
}
</style>
