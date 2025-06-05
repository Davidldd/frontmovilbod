<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

// Form data
const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)
const validationErrors = ref({})

// Form validation
const validateForm = () => {
  const errors = {}

  if (!username.value.trim()) {
    errors.username = 'Por favor ingrese su nombre de usuario'
  }

  if (!password.value) {
    errors.password = 'Por favor ingrese su contraseña'
  } else if (password.value.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres'
  }

  validationErrors.value = errors
  return Object.keys(errors).length === 0
}

// Login function
const handleLogin = async (e) => {
  e.preventDefault()

  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock user data based on username
    let userData = {
      name: username.value,
      email: `${username.value}@movilbod.com`,
      role: 'user'
    }

    // Set root role for admin user
    if (username.value.toLowerCase() === 'admin' || username.value.toLowerCase() === 'root') {
      userData.role = 'root'
    }

    // Login user
    authStore.login(userData)

    console.log('Login successful:', userData)

    // Redirect to dashboard
    router.push('/dashboard')
  } catch (error) {
    console.error('Login error:', error)
    alert('Error al iniciar sesión')
  } finally {
    isLoading.value = false
  }
}

// Navigation functions
const goToRegister = () => {
  router.push('/register')
}

const goToForgotPassword = () => {
  router.push('/forgot-password')
}
</script>

<template>
  <div class="container-fluid p-0 auth-container">
    <div class="row g-0 w-100">
      <!-- Left side - Form -->
      <div class="col-12 col-md-6 d-flex align-items-center justify-content-center">
        <div class="auth-card p-4">
          <div class="text-center mb-4">
            <h1 class="brand-title mb-0">MovilBod ERP</h1>
            <p class="auth-subtitle">Sistema de Gestión Empresarial</p>
          </div>

          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h2 class="fs-4 card-title mb-4 text-center">Iniciar Sesión</h2>

              <!-- Demo Credentials Info -->
              <div class="alert alert-info mb-4">
                <small>
                  <strong>Credenciales de prueba:</strong><br>
                  Usuario: <code>admin</code> (rol root)<br>
                  Contraseña: <code>123456</code>
                </small>
              </div>

              <form @submit="handleLogin">
                <!-- Username -->
                <div class="form-floating mb-3">
                  <input
                      type="text"
                      class="form-control"
                      id="username"
                      placeholder="Nombre de Usuario"
                      v-model="username"
                      :class="{'is-invalid': validationErrors.username}"
                  >
                  <label for="username">
                    <i class="bi bi-person me-2"></i>Nombre de Usuario
                  </label>
                  <div class="invalid-feedback" v-if="validationErrors.username">
                    {{ validationErrors.username }}
                  </div>
                </div>

                <!-- Password -->
                <div class="form-floating mb-3">
                  <input
                      type="password"
                      class="form-control"
                      id="password"
                      placeholder="Contraseña"
                      v-model="password"
                      :class="{'is-invalid': validationErrors.password}"
                  >
                  <label for="password">
                    <i class="bi bi-lock me-2"></i>Contraseña
                  </label>
                  <div class="invalid-feedback" v-if="validationErrors.password">
                    {{ validationErrors.password }}
                  </div>
                </div>

                <!-- Remember Me checkbox -->
                <div class="form-check mb-3">
                  <input
                      class="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                      v-model="rememberMe"
                  >
                  <label class="form-check-label" for="rememberMe">
                    Recordarme
                  </label>
                  <span
                      class="float-end text-primary link-hover"
                      role="button"
                      @click="goToForgotPassword"
                  >
                    ¿Olvidó su contraseña?
                  </span>
                </div>

                <!-- Submit Button -->
                <div class="d-grid mb-4">
                  <button
                      type="submit"
                      class="btn btn-primary"
                      :disabled="isLoading"
                  >
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Iniciar Sesión
                  </button>
                </div>

                <!-- Register Link -->
                <div class="text-center">
                  <p class="mb-0">
                    ¿No tiene una cuenta?
                    <span
                        class="text-primary link-hover"
                        role="button"
                        @click="goToRegister"
                    >
                      Registrarse
                    </span>
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div class="text-center mt-4">
            <small class="text-muted">
              &copy; {{ new Date().getFullYear() }} MovilBod ERP. Todos los derechos reservados.
            </small>
          </div>
        </div>
      </div>

      <!-- Right side - Image -->
      <div class="col-md-6 d-none d-md-block inventory-bg position-relative">
        <div class="position-absolute top-50 start-50 translate-middle text-center text-white">
          <h2 class="display-5 fw-bold">Bienvenido a MovilBod ERP</h2>
          <p class="lead">La solución integral para gestión empresarial</p>
          <div class="features-list mt-4">
            <div class="feature-item">
              <i class="bi bi-check-circle-fill me-2"></i>
              <span>CRM Avanzado</span>
            </div>
            <div class="feature-item">
              <i class="bi bi-check-circle-fill me-2"></i>
              <span>Control de Inventarios</span>
            </div>
            <div class="feature-item">
              <i class="bi bi-check-circle-fill me-2"></i>
              <span>Facturación Electrónica</span>
            </div>
            <div class="feature-item">
              <i class="bi bi-check-circle-fill me-2"></i>
              <span>Reportes en Tiempo Real</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.features-list {
  text-align: left;
  display: inline-block;
}

.feature-item {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.feature-item i {
  color: #ffd700;
}
</style>
