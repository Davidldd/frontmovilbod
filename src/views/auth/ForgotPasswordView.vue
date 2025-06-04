<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form states
const email = ref('')
const isLoading = ref(false)
const validationError = ref('')
const isSubmitted = ref(false)

// Validate email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Submit form
const handleSubmit = async (e) => {
  e.preventDefault()

  if (!email.value.trim()) {
    validationError.value = 'Por favor ingrese su correo electrónico'
    return
  }

  if (!validateEmail(email.value)) {
    validationError.value = 'Por favor ingrese un correo electrónico válido'
    return
  }

  validationError.value = ''
  isLoading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // In a real app, here you would make an API call to request password reset
    console.log('Password reset requested for:', email.value)

    // Show success state
    isSubmitted.value = true
  } catch (error) {
    console.error('Password reset error:', error)
    alert('Error al solicitar el restablecimiento de contraseña')
  } finally {
    isLoading.value = false
  }
}

// Navigation function
const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="container-fluid p-0 auth-container">
    <div class="row g-0 w-100">
      <!-- Left side - Form -->
      <div class="col-12 col-md-6 d-flex align-items-center justify-content-center">
        <div class="auth-card p-4">
          <div class="text-center mb-4">
            <h1 class="brand-title mb-0">MovilBod</h1>
            <p class="auth-subtitle">Gestión de Inventarios</p>
          </div>

          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h2 class="fs-4 card-title mb-4 text-center">Recuperar Contraseña</h2>

              <div v-if="!isSubmitted">
                <p class="text-muted mb-4">
                  Por favor ingrese su correo electrónico y le enviaremos un enlace para restablecer su contraseña.
                </p>

                <form @submit="handleSubmit">
                  <!-- Email -->
                  <div class="form-floating mb-4">
                    <input
                        type="email"
                        class="form-control"
                        id="email"
                        placeholder="Correo Electrónico"
                        v-model="email"
                        :class="{'is-invalid': validationError}"
                    >
                    <label for="email">
                      <i class="bi bi-envelope me-2"></i>Correo Electrónico
                    </label>
                    <div class="invalid-feedback" v-if="validationError">
                      {{ validationError }}
                    </div>
                  </div>

                  <!-- Submit Button -->
                  <div class="d-grid mb-4">
                    <button
                        type="submit"
                        class="btn btn-primary"
                        :disabled="isLoading"
                    >
                      <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Enviar Enlace de Recuperación
                    </button>
                  </div>
                </form>
              </div>

              <div v-else class="text-center">
                <div class="mb-4">
                  <i class="bi bi-check-circle-fill text-success" style="font-size: 3rem;"></i>
                </div>
                <h3 class="fs-5 mb-3">Solicitud Enviada</h3>
                <p class="text-muted mb-4">
                  Hemos enviado un enlace de recuperación a <strong>{{ email }}</strong>. Por favor revise su bandeja de entrada y siga las instrucciones para restablecer su contraseña.
                </p>
              </div>

              <!-- Back to Login Link -->
              <div class="text-center">
                <p class="mb-0">
                  <span
                      class="text-primary link-hover"
                      role="button"
                      @click="goToLogin"
                  >
                    <i class="bi bi-arrow-left me-1"></i> Volver a Iniciar Sesión
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div class="text-center mt-4">
            <small class="text-muted">
              &copy; {{ new Date().getFullYear() }} MovilBod. Todos los derechos reservados.
            </small>
          </div>
        </div>
      </div>

      <!-- Right side - Image -->
      <div class="col-md-6 d-none d-md-block inventory-bg position-relative">
        <div class="position-absolute top-50 start-50 translate-middle text-center text-white">
          <h2 class="display-5 fw-bold">¿Olvidó su contraseña?</h2>
          <p class="lead">No se preocupe, le ayudaremos a recuperar su acceso</p>
        </div>
      </div>
    </div>
  </div>
</template>