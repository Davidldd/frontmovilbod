<template>
  <DashboardLayout>
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-1">Mi Perfil</h2>
              <p class="text-muted mb-0">Gestiona tu información personal y configuraciones</p>
            </div>
            <div>
              <button class="btn btn-outline-secondary me-2" @click="cancelChanges" v-if="hasChanges">
                <i class="bi bi-x me-2"></i>Cancelar
              </button>
              <button class="btn btn-primary" @click="saveChanges" :disabled="!hasChanges">
                <i class="bi bi-save me-2"></i>Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Card -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-auto">
                  <div class="position-relative">
                    <img 
                      :src="userProfile.avatar || '/placeholder.svg?height=80&width=80'" 
                      alt="Avatar" 
                      class="rounded-circle"
                      style="width: 80px; height: 80px; object-fit: cover;"
                    >
                    <button 
                      class="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle p-1"
                      @click="$refs.avatarInput.click()"
                      style="width: 28px; height: 28px;"
                      title="Cambiar avatar"
                    >
                      <i class="bi bi-camera" style="font-size: 10px;"></i>
                    </button>
                    <input 
                      ref="avatarInput" 
                      type="file" 
                      accept="image/*" 
                      class="d-none"
                      @change="handleAvatarChange"
                    >
                  </div>
                </div>
                <div class="col">
                  <h4 class="mb-1">{{ userProfile.firstName }} {{ userProfile.lastName }}</h4>
                  <p class="text-muted mb-1">{{ userProfile.email }}</p>
                  <div class="d-flex align-items-center">
                    <span class="badge bg-success me-2">{{ userProfile.role }}</span>
                    <small class="text-muted">Último acceso: {{ formatDate(userProfile.lastLogin) }}</small>
                  </div>
                </div>
                <div class="col-auto">
                  <div class="text-end">
                    <div class="text-muted small">Miembro desde</div>
                    <div class="fw-bold">{{ formatDate(userProfile.createdAt) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header border-0">
              <ul class="nav nav-tabs card-header-tabs" role="tablist">
                <li class="nav-item" role="presentation">
                  <button 
                    class="nav-link" 
                    :class="{ active: activeTab === 'personal' }"
                    @click="activeTab = 'personal'"
                    type="button"
                  >
                    <i class="fas fa-user me-2"></i>Información Personal
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button 
                    class="nav-link" 
                    :class="{ active: activeTab === 'security' }"
                    @click="activeTab = 'security'"
                    type="button"
                  >
                    <i class="fas fa-shield-alt me-2"></i>Seguridad
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button 
                    class="nav-link" 
                    :class="{ active: activeTab === 'preferences' }"
                    @click="activeTab = 'preferences'"
                    type="button"
                  >
                    <i class="fas fa-cog me-2"></i>Preferencias
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button 
                    class="nav-link" 
                    :class="{ active: activeTab === 'notifications' }"
                    @click="activeTab = 'notifications'"
                    type="button"
                  >
                    <i class="fas fa-bell me-2"></i>Notificaciones
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button 
                    class="nav-link" 
                    :class="{ active: activeTab === 'activity' }"
                    @click="activeTab = 'activity'"
                    type="button"
                  >
                    <i class="fas fa-history me-2"></i>Actividad
                  </button>
                </li>
              </ul>
            </div>

            <div class="card-body">
              <!-- Personal Information Tab -->
              <div v-show="activeTab === 'personal'">
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Nombre *</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="userProfile.firstName"
                        @input="markAsChanged"
                      >
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Apellido *</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="userProfile.lastName"
                        @input="markAsChanged"
                      >
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Email *</label>
                      <input 
                        type="email" 
                        class="form-control" 
                        v-model="userProfile.email"
                        @input="markAsChanged"
                      >
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Teléfono</label>
                      <input 
                        type="tel" 
                        class="form-control" 
                        v-model="userProfile.phone"
                        @input="markAsChanged"
                      >
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Cargo</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="userProfile.position"
                        @input="markAsChanged"
                      >
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Departamento</label>
                      <select class="form-select" v-model="userProfile.department" @change="markAsChanged">
                        <option value="">Seleccionar departamento</option>
                        <option value="ventas">Ventas</option>
                        <option value="compras">Compras</option>
                        <option value="contabilidad">Contabilidad</option>
                        <option value="inventario">Inventario</option>
                        <option value="administracion">Administración</option>
                        <option value="sistemas">Sistemas</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Dirección</label>
                  <textarea 
                    class="form-control" 
                    rows="2" 
                    v-model="userProfile.address"
                    @input="markAsChanged"
                  ></textarea>
                </div>

                <div class="row">
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Ciudad</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="userProfile.city"
                        @input="markAsChanged"
                      >
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Estado/Provincia</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="userProfile.state"
                        @input="markAsChanged"
                      >
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Código Postal</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="userProfile.zipCode"
                        @input="markAsChanged"
                      >
                    </div>
                  </div>
                </div>
              </div>

              <!-- Security Tab -->
              <div v-show="activeTab === 'security'">
                <div class="row">
                  <div class="col-md-6">
                    <h5 class="mb-3">Cambiar Contraseña</h5>
                    <div class="mb-3">
                      <label class="form-label">Contraseña Actual</label>
                      <input 
                        type="password" 
                        class="form-control" 
                        v-model="passwordForm.currentPassword"
                      >
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Nueva Contraseña</label>
                      <input 
                        type="password" 
                        class="form-control" 
                        v-model="passwordForm.newPassword"
                      >
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Confirmar Nueva Contraseña</label>
                      <input 
                        type="password" 
                        class="form-control" 
                        v-model="passwordForm.confirmPassword"
                      >
                    </div>
                    <button class="btn btn-primary" @click="changePassword">
                      <i class="fas fa-key me-2"></i>Cambiar Contraseña
                    </button>
                  </div>

                  <div class="col-md-6">
                    <h5 class="mb-3">Autenticación de Dos Factores</h5>
                    <div class="card bg-light">
                      <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <h6 class="mb-1">2FA {{ userProfile.twoFactorEnabled ? 'Activado' : 'Desactivado' }}</h6>
                            <small class="text-muted">
                              {{ userProfile.twoFactorEnabled ? 'Tu cuenta está protegida' : 'Mejora la seguridad de tu cuenta' }}
                            </small>
                          </div>
                          <div class="form-check form-switch">
                            <input 
                              class="form-check-input" 
                              type="checkbox" 
                              v-model="userProfile.twoFactorEnabled"
                              @change="toggleTwoFactor"
                            >
                          </div>
                        </div>
                      </div>
                    </div>

                    <h5 class="mb-3 mt-4">Sesiones Activas</h5>
                    <div class="list-group">
                      <div 
                        v-for="session in activeSessions" 
                        :key="session.id"
                        class="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <div class="fw-bold">{{ session.device }}</div>
                          <small class="text-muted">{{ session.location }} • {{ formatDate(session.lastActive) }}</small>
                        </div>
                        <div>
                          <span v-if="session.current" class="badge bg-success">Actual</span>
                          <button v-else class="btn btn-sm btn-outline-danger" @click="terminateSession(session.id)">
                            Terminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Preferences Tab -->
              <div v-show="activeTab === 'preferences'">
                <div class="row">
                  <div class="col-md-6">
                    <h5 class="mb-3">Configuración General</h5>
                    
                    <div class="mb-3">
                      <label class="form-label">Idioma</label>
                      <select class="form-select" v-model="userProfile.language" @change="markAsChanged">
                        <option value="es">Español</option>
                        <option value="en">English</option>
                        <option value="pt">Português</option>
                      </select>
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Zona Horaria</label>
                      <select class="form-select" v-model="userProfile.timezone" @change="markAsChanged">
                        <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                        <option value="America/New_York">Nueva York (GMT-5)</option>
                        <option value="America/Los_Angeles">Los Ángeles (GMT-8)</option>
                        <option value="Europe/Madrid">Madrid (GMT+1)</option>
                      </select>
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Formato de Fecha</label>
                      <select class="form-select" v-model="userProfile.dateFormat" @change="markAsChanged">
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Moneda</label>
                      <select class="form-select" v-model="userProfile.currency" @change="markAsChanged">
                        <option value="MXN">Peso Mexicano (MXN)</option>
                        <option value="USD">Dólar Americano (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                      </select>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <h5 class="mb-3">Tema y Apariencia</h5>
                    
                    <div class="mb-3">
                      <label class="form-label">Tema</label>
                      <div class="btn-group w-100" role="group">
                        <input 
                          type="radio" 
                          class="btn-check" 
                          name="theme" 
                          id="light-theme" 
                          value="light"
                          v-model="selectedTheme"
                          @change="changeTheme"
                        >
                        <label class="btn btn-outline-primary" for="light-theme">
                          <i class="fas fa-sun me-2"></i>Claro
                        </label>

                        <input 
                          type="radio" 
                          class="btn-check" 
                          name="theme" 
                          id="dark-theme" 
                          value="dark"
                          v-model="selectedTheme"
                          @change="changeTheme"
                        >
                        <label class="btn btn-outline-primary" for="dark-theme">
                          <i class="fas fa-moon me-2"></i>Oscuro
                        </label>

                        <input 
                          type="radio" 
                          class="btn-check" 
                          name="theme" 
                          id="auto-theme" 
                          value="auto"
                          v-model="selectedTheme"
                          @change="changeTheme"
                        >
                        <label class="btn btn-outline-primary" for="auto-theme">
                          <i class="fas fa-adjust me-2"></i>Auto
                        </label>
                      </div>
                    </div>

                    <div class="mb-3">
                      <div class="form-check form-switch">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          v-model="userProfile.compactMode"
                          @change="markAsChanged"
                        >
                        <label class="form-check-label">Modo Compacto</label>
                      </div>
                      <small class="text-muted">Reduce el espaciado para mostrar más información</small>
                    </div>

                    <div class="mb-3">
                      <div class="form-check form-switch">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          v-model="userProfile.animationsEnabled"
                          @change="markAsChanged"
                        >
                        <label class="form-check-label">Animaciones</label>
                      </div>
                      <small class="text-muted">Habilita transiciones y animaciones</small>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Notifications Tab -->
              <div v-show="activeTab === 'notifications'">
                <div class="row">
                  <div class="col-md-6">
                    <h5 class="mb-3">Notificaciones por Email</h5>
                    
                    <div class="mb-3">
                      <div class="form-check form-switch">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          v-model="notifications.email.newOrders"
                          @change="markAsChanged"
                        >
                        <label class="form-check-label">Nuevos Pedidos</label>
                      </div>
                    </div>

                    <div class="mb-3">
                      <div class="form-check form-switch">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          v-model="notifications.email.lowStock"
                          @change="markAsChanged"
                        >
                        <label class="form-check-label">Stock Bajo</label>
                      </div>
                    </div>

                    <div class="mb-3">
                      <div class="form-check form-switch">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          v-model="notifications.email.paymentReceived"
                          @change="markAsChanged"
                        >
                        <label class="form-check-label">Pagos Recibidos</label>
                      </div>
                    </div>

                    <div class="mb-3">
                      <div class="form-check form-switch">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          v-model="notifications.email.systemUpdates"
                          @change="markAsChanged"
                        >
                        <label class="form-check-label">Actualizaciones del Sistema</label>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <h5 class="mb-3">Notificaciones Push</h5>
                    
                    <div class="mb-3">
                      <div class="form-check form-switch">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          v-model="notifications.push.enabled"
                          @change="markAsChanged"
                        >
                        <label class="form-check-label">Habilitar Notificaciones Push</label>
                      </div>
                    </div>

                    <div class="mb-3">
                      <div class="form-check form-switch">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          v-model="notifications.push.urgentAlerts"
                          @change="markAsChanged"
                          :disabled="!notifications.push.enabled"
                        >
                        <label class="form-check-label">Alertas Urgentes</label>
                      </div>
                    </div>

                    <div class="mb-3">
                      <div class="form-check form-switch">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          v-model="notifications.push.dailySummary"
                          @change="markAsChanged"
                          :disabled="!notifications.push.enabled"
                        >
                        <label class="form-check-label">Resumen Diario</label>
                      </div>
                    </div>

                    <h5 class="mb-3 mt-4">Horario de Notificaciones</h5>
                    <div class="row">
                      <div class="col-6">
                        <div class="mb-3">
                          <label class="form-label">Desde</label>
                          <input 
                            type="time" 
                            class="form-control" 
                            v-model="notifications.schedule.start"
                            @change="markAsChanged"
                          >
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="mb-3">
                          <label class="form-label">Hasta</label>
                          <input 
                            type="time" 
                            class="form-control" 
                            v-model="notifications.schedule.end"
                            @change="markAsChanged"
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Activity Tab -->
              <div v-show="activeTab === 'activity'">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h5 class="mb-0">Actividad Reciente</h5>
                  <div>
                    <select class="form-select form-select-sm" v-model="activityFilter">
                      <option value="all">Todas las actividades</option>
                      <option value="login">Inicios de sesión</option>
                      <option value="profile">Cambios de perfil</option>
                      <option value="security">Seguridad</option>
                      <option value="system">Sistema</option>
                    </select>
                  </div>
                </div>

                <div class="timeline">
                  <div 
                    v-for="activity in filteredActivities" 
                    :key="activity.id"
                    class="timeline-item mb-3"
                  >
                    <div class="card">
                      <div class="card-body py-3">
                        <div class="d-flex align-items-start">
                          <div class="me-3">
                            <div 
                              class="rounded-circle d-flex align-items-center justify-content-center"
                              :class="getActivityIconClass(activity.type)"
                              style="width: 40px; height: 40px;"
                            >
                              <i :class="getActivityIcon(activity.type)"></i>
                            </div>
                          </div>
                          <div class="flex-grow-1">
                            <div class="d-flex justify-content-between align-items-start">
                              <div>
                                <h6 class="mb-1">{{ activity.title }}</h6>
                                <p class="text-muted mb-1">{{ activity.description }}</p>
                                <small class="text-muted">
                                  <i class="fas fa-clock me-1"></i>{{ formatDate(activity.timestamp) }}
                                </small>
                              </div>
                              <span 
                                class="badge"
                                :class="getActivityBadgeClass(activity.type)"
                              >
                                {{ activity.type }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="text-center mt-4" v-if="filteredActivities.length === 0">
                  <i class="fas fa-history fa-3x text-muted mb-3"></i>
                  <p class="text-muted">No hay actividades para mostrar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../../stores/themeStore'
import { useAuthStore } from '../../stores/authStore'
import DashboardLayout from '../../components/DashboardLayout.vue'

const router = useRouter()
const themeStore = useThemeStore()
const authStore = useAuthStore()

// Reactive data
const activeTab = ref('personal')
const hasChanges = ref(false)
const selectedTheme = ref('light')
const activityFilter = ref('all')

const userProfile = ref({
  firstName: 'Juan Carlos',
  lastName: 'Pérez García',
  email: 'juan.perez@movilbod.com',
  phone: '+52 55 1234 5678',
  position: 'Gerente de Ventas',
  department: 'ventas',
  address: 'Av. Insurgentes Sur 1234, Col. Del Valle',
  city: 'Ciudad de México',
  state: 'CDMX',
  zipCode: '03100',
  avatar: null,
  role: 'Administrador',
  lastLogin: new Date('2024-01-15T10:30:00'),
  createdAt: new Date('2023-06-15T09:00:00'),
  language: 'es',
  timezone: 'America/Mexico_City',
  dateFormat: 'DD/MM/YYYY',
  currency: 'MXN',
  compactMode: false,
  animationsEnabled: true,
  twoFactorEnabled: false
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const notifications = ref({
  email: {
    newOrders: true,
    lowStock: true,
    paymentReceived: true,
    systemUpdates: false
  },
  push: {
    enabled: true,
    urgentAlerts: true,
    dailySummary: false
  },
  schedule: {
    start: '09:00',
    end: '18:00'
  }
})

const activeSessions = ref([
  {
    id: 1,
    device: 'Chrome en Windows',
    location: 'Ciudad de México, México',
    lastActive: new Date(),
    current: true
  },
  {
    id: 2,
    device: 'Safari en iPhone',
    location: 'Ciudad de México, México',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    current: false
  },
  {
    id: 3,
    device: 'Firefox en Windows',
    location: 'Guadalajara, México',
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
    current: false
  }
])

const recentActivities = ref([
  {
    id: 1,
    type: 'login',
    title: 'Inicio de sesión exitoso',
    description: 'Acceso desde Chrome en Windows',
    timestamp: new Date()
  },
  {
    id: 2,
    type: 'profile',
    title: 'Perfil actualizado',
    description: 'Se actualizó la información de contacto',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 3,
    type: 'security',
    title: 'Contraseña cambiada',
    description: 'Se cambió la contraseña de la cuenta',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: 4,
    type: 'system',
    title: 'Configuración actualizada',
    description: 'Se cambiaron las preferencias de notificación',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000)
  },
  {
    id: 5,
    type: 'login',
    title: 'Inicio de sesión',
    description: 'Acceso desde Safari en iPhone',
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000)
  }
])

// Computed
const filteredActivities = computed(() => {
  if (activityFilter.value === 'all') {
    return recentActivities.value
  }
  return recentActivities.value.filter(activity => activity.type === activityFilter.value)
})

// Methods
const markAsChanged = () => {
  hasChanges.value = true
}

const saveChanges = () => {
  // Aquí iría la lógica para guardar los cambios
  console.log('Guardando cambios del perfil...', userProfile.value)
  hasChanges.value = false
  
  // Simular notificación de éxito
  alert('Perfil actualizado correctamente')
}

const cancelChanges = () => {
  // Aquí iría la lógica para revertir los cambios
  hasChanges.value = false
  alert('Cambios cancelados')
}

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      userProfile.value.avatar = e.target.result
      markAsChanged()
    }
    reader.readAsDataURL(file)
  }
}

const changePassword = () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('Las contraseñas no coinciden')
    return
  }
  
  // Aquí iría la lógica para cambiar la contraseña
  console.log('Cambiando contraseña...')
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  alert('Contraseña cambiada correctamente')
}

const toggleTwoFactor = () => {
  // Aquí iría la lógica para activar/desactivar 2FA
  console.log('Toggle 2FA:', userProfile.value.twoFactorEnabled)
  markAsChanged()
}

const terminateSession = (sessionId) => {
  // Aquí iría la lógica para terminar una sesión
  activeSessions.value = activeSessions.value.filter(session => session.id !== sessionId)
  alert('Sesión terminada')
}

const changeTheme = () => {
  themeStore.setTheme(selectedTheme.value)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

const getActivityIcon = (type) => {
  const icons = {
    login: 'bi bi-box-arrow-in-right',
    profile: 'bi bi-person-gear',
    security: 'bi bi-shield-check',
    system: 'bi bi-gear'
  }
  return icons[type] || 'bi bi-info-circle'
}

const getActivityIconClass = (type) => {
  const classes = {
    login: 'bg-success text-white',
    profile: 'bg-primary text-white',
    security: 'bg-warning text-dark',
    system: 'bg-info text-white'
  }
  return classes[type] || 'bg-secondary text-white'
}

const getActivityBadgeClass = (type) => {
  const classes = {
    login: 'bg-success',
    profile: 'bg-primary',
    security: 'bg-warning',
    system: 'bg-info'
  }
  return classes[type] || 'bg-secondary'
}

// Lifecycle
onMounted(() => {
  selectedTheme.value = themeStore.theme
  
  // Sincronizar datos del usuario con el store de autenticación
  if (authStore.user) {
    userProfile.value.firstName = authStore.user.firstName || userProfile.value.firstName
    userProfile.value.lastName = authStore.user.lastName || userProfile.value.lastName
    userProfile.value.email = authStore.user.email || userProfile.value.email
    userProfile.value.role = authStore.role || userProfile.value.role
  }
})
</script>

<style scoped>
.timeline-item {
  position: relative;
}

.timeline-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 20px;
  top: 60px;
  width: 2px;
  height: calc(100% - 20px);
  background-color: #dee2e6;
}

.form-check-input:disabled + .form-check-label {
  opacity: 0.5;
}

.nav-tabs .nav-link {
  border: none;
  color: #6c757d;
  transition: all 0.3s ease;
}

.nav-tabs .nav-link:hover {
  color: #0d6efd;
  border-color: transparent;
}

.nav-tabs .nav-link.active {
  background-color: transparent;
  border-bottom: 2px solid #0d6efd;
  color: #0d6efd;
  font-weight: 500;
}

.btn-group .btn-check:checked + .btn {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: white;
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid rgba(0, 0, 0, 0.125);
  transition: box-shadow 0.15s ease-in-out;
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.badge {
  font-size: 0.75em;
}

.position-relative .btn {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.timeline {
  position: relative;
}

.form-control:focus,
.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

.text-muted {
  color: #6c757d !important;
}

@media (max-width: 768px) {
  .d-flex.justify-content-between {
    flex-direction: column;
    gap: 1rem;
  }
  
  .col-auto .text-end {
    text-align: left !important;
    margin-top: 1rem;
  }
}
</style>
