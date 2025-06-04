<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form data
const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  companyName: '',
  phoneNumber: '',
  agreeTerms: false
})

const isLoading = ref(false)
const validationErrors = ref({})

// Form validation
const validateForm = () => {
  const errors = {}
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!formData.value.firstName.trim()) {
    errors.firstName = 'Por favor ingrese su nombre'
  }

  if (!formData.value.lastName.trim()) {
    errors.lastName = 'Por favor ingrese su apellido'
  }

  if (!formData.value.email.trim()) {
    errors.email = 'Por favor ingrese su correo electrónico'
  } else if (!emailRegex.test(formData.value.email)) {
    errors.email = 'Por favor ingrese un correo electrónico válido'
  }

  if (!formData.value.username.trim()) {
    errors.username = 'Por favor ingrese un nombre de usuario'
  } else if (formData.value.username.length < 4) {
    errors.username = 'El nombre de usuario debe tener al menos 4 caracteres'
  }

  if (!formData.value.password) {
    errors.password = 'Por favor ingrese una contraseña'
  } else if (formData.value.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres'
  }

  if (!formData.value.confirmPassword) {
    errors.confirmPassword = 'Por favor confirme su contraseña'
  } else if (formData.value.password !== formData.value.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
  }

  if (!formData.value.companyName.trim()) {
    errors.companyName = 'Por favor ingrese el nombre de su empresa'
  }

  if (!formData.value.agreeTerms) {
    errors.agreeTerms = 'Debe aceptar los términos y condiciones'
  }

  validationErrors.value = errors
  return Object.keys(errors).length === 0
}

// Register function
const handleRegister = async (e) => {
  e.preventDefault()

  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // In a real app, here you would make an API call to register
    console.log('Register data:', formData.value)

    // Redirect to login
    alert('Registro exitoso. Por favor inicie sesión.')
    router.push('/login')
  } catch (error) {
    console.error('Registration error:', error)
    alert('Error al registrarse')
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
      <!-- Left side - Image -->
      <div class="col-md-6 d-none d-md-block inventory-bg position-relative">
        <div class="position-absolute top-50 start-50 translate-middle text-center text-white">
          <h2 class="display-5 fw-bold">Únase a MovilBod</h2>
          <p class="lead">Optimice su gestión de inventarios hoy mismo</p>
        </div>
      </div>

      <!-- Right side - Form -->
      <div class="col-12 col-md-6 d-flex align-items-center justify-content-center">
        <div class="auth-card p-4">
          <div class="text-center mb-4">
            <h1 class="brand-title mb-0">MovilBod</h1>
            <p class="auth-subtitle">Gestión de Inventarios</p>
          </div>

          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h2 class="fs-4 card-title mb-4 text-center">Registrarse</h2>

              <form @submit="handleRegister">
                <div class="row">
                  <!-- First Name -->
                  <div class="col-md-6 mb-3">
                    <div class="form-floating">
                      <input
                          type="text"
                          class="form-control"
                          id="firstName"
                          placeholder="Nombre"
                          v-model="formData.firstName"
                          :class="{'is-invalid': validationErrors.firstName}"
                      >
                      <label for="firstName">Nombre</label>
                      <div class="invalid-feedback" v-if="validationErrors.firstName">
                        {{ validationErrors.firstName }}
                      </div>
                    </div>
                  </div>

                  <!-- Last Name -->
                  <div class="col-md-6 mb-3">
                    <div class="form-floating">
                      <input
                          type="text"
                          class="form-control"
                          id="lastName"
                          placeholder="Apellido"
                          v-model="formData.lastName"
                          :class="{'is-invalid': validationErrors.lastName}"
                      >
                      <label for="lastName">Apellido</label>
                      <div class="invalid-feedback" v-if="validationErrors.lastName">
                        {{ validationErrors.lastName }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Email -->
                <div class="form-floating mb-3">
                  <input
                      type="email"
                      class="form-control"
                      id="email"
                      placeholder="Correo Electrónico"
                      v-model="formData.email"
                      :class="{'is-invalid': validationErrors.email}"
                  >
                  <label for="email">
                    <i class="bi bi-envelope me-2"></i>Correo Electrónico
                  </label>
                  <div class="invalid-feedback" v-if="validationErrors.email">
                    {{ validationErrors.email }}
                  </div>
                </div>

                <!-- Username -->
                <div class="form-floating mb-3">
                  <input
                      type="text"
                      class="form-control"
                      id="username"
                      placeholder="Nombre de Usuario"
                      v-model="formData.username"
                      :class="{'is-invalid': validationErrors.username}"
                  >
                  <label for="username">
                    <i class="bi bi-person me-2"></i>Nombre de Usuario
                  </label>
                  <div class="invalid-feedback" v-if="validationErrors.username">
                    {{ validationErrors.username }}
                  </div>
                </div>

                <div class="row">
                  <!-- Password -->
                  <div class="col-md-6 mb-3">
                    <div class="form-floating">
                      <input
                          type="password"
                          class="form-control"
                          id="password"
                          placeholder="Contraseña"
                          v-model="formData.password"
                          :class="{'is-invalid': validationErrors.password}"
                      >
                      <label for="password">Contraseña</label>
                      <div class="invalid-feedback" v-if="validationErrors.password">
                        {{ validationErrors.password }}
                      </div>
                    </div>
                  </div>

                  <!-- Confirm Password -->
                  <div class="col-md-6 mb-3">
                    <div class="form-floating">
                      <input
                          type="password"
                          class="form-control"
                          id="confirmPassword"
                          placeholder="Confirmar Contraseña"
                          v-model="formData.confirmPassword"
                          :class="{'is-invalid': validationErrors.confirmPassword}"
                      >
                      <label for="confirmPassword">Confirmar</label>
                      <div class="invalid-feedback" v-if="validationErrors.confirmPassword">
                        {{ validationErrors.confirmPassword }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Company Name -->
                <div class="form-floating mb-3">
                  <input
                      type="text"
                      class="form-control"
                      id="companyName"
                      placeholder="Nombre de la Empresa"
                      v-model="formData.companyName"
                      :class="{'is-invalid': validationErrors.companyName}"
                  >
                  <label for="companyName">
                    <i class="bi bi-building me-2"></i>Nombre de la Empresa
                  </label>
                  <div class="invalid-feedback" v-if="validationErrors.companyName">
                    {{ validationErrors.companyName }}
                  </div>
                </div>

                <!-- Phone Number (Optional) -->
                <div class="form-floating mb-3">
                  <input
                      type="tel"
                      class="form-control"
                      id="phoneNumber"
                      placeholder="Teléfono (Opcional)"
                      v-model="formData.phoneNumber"
                  >
                  <label for="phoneNumber">
                    <i class="bi bi-telephone me-2"></i>Teléfono (Opcional)
                  </label>
                </div>

                <!-- Terms Checkbox -->
                <div class="form-check mb-3">
                  <input
                      class="form-check-input"
                      type="checkbox"
                      id="agreeTerms"
                      v-model="formData.agreeTerms"
                      :class="{'is-invalid': validationErrors.agreeTerms}"
                  >
                  <label class="form-check-label" for="agreeTerms">
                    Acepto los términos y condiciones
                  </label>
                  <div class="invalid-feedback" v-if="validationErrors.agreeTerms">
                    {{ validationErrors.agreeTerms }}
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
                    Crear Cuenta
                  </button>
                </div>

                <!-- Login Link -->
                <div class="text-center">
                  <p class="mb-0">
                    ¿Ya tiene una cuenta?
                    <span
                        class="text-primary link-hover"
                        role="button"
                        @click="goToLogin"
                    >
                      Iniciar Sesión
                    </span>
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div class="text-center mt-4">
            <small class="text-muted">
              &copy; {{ new Date().getFullYear() }} MovilBod. Todos los derechos reservados.
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>