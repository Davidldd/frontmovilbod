<template>
  <DashboardLayout>
    <div class="supplier-create-view">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">{{ isEditing ? 'Editar' : 'Nuevo' }} Proveedor</h2>
          <p class="text-muted mb-0">{{ isEditing ? 'Modificar información del proveedor' : 'Registrar nuevo proveedor' }}</p>
        </div>
        <button class="btn btn-outline-secondary" @click="$router.go(-1)">
          <i class="fas fa-arrow-left"></i> Volver
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="saveSupplier">
        <div class="row">
          <!-- Información Fiscal -->
          <div class="col-md-8">
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="card-title mb-0">Información Fiscal</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-3">
                    <div class="form-group mb-3">
                      <label class="form-label">Tipo de Identificación *</label>
                      <select class="form-select" v-model="supplier.idType" required>
                        <option value="">Seleccionar...</option>
                        <option value="NIT">NIT</option>
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="CE">Cédula de Extranjería</option>
                        <option value="PP">Pasaporte</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group mb-3">
                      <label class="form-label">Número de Identificación *</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="supplier.idNumber"
                        placeholder="Ej: 900123456-1"
                        required
                      >
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="form-group mb-3">
                      <label class="form-label">Dígito de Verificación</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="supplier.checkDigit"
                        placeholder="DV"
                        maxlength="1"
                      >
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group mb-3">
                      <label class="form-label">Razón Social *</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="supplier.businessName"
                        placeholder="Nombre legal de la empresa"
                        required
                      >
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group mb-3">
                      <label class="form-label">Nombre Comercial</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="supplier.tradeName"
                        placeholder="Nombre comercial"
                      >
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group mb-3">
                      <label class="form-label">Régimen Fiscal</label>
                      <select class="form-select" v-model="supplier.taxRegime">
                        <option value="">Seleccionar...</option>
                        <option value="Responsable IVA">Responsable de IVA</option>
                        <option value="No Responsable IVA">No Responsable de IVA</option>
                        <option value="Gran Contribuyente">Gran Contribuyente</option>
                        <option value="Régimen Simple">Régimen Simple de Tributación</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group mb-3">
                      <label class="form-label">Tipo de Proveedor *</label>
                      <select class="form-select" v-model="supplier.type" required>
                        <option value="">Seleccionar...</option>
                        <option value="Productos">Productos</option>
                        <option value="Servicios">Servicios</option>
                        <option value="Mixto">Mixto</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group mb-3">
                      <label class="form-label">Estado *</label>
                      <select class="form-select" v-model="supplier.status" required>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Información de Contacto -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="card-title mb-0">Información de Contacto</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-12">
                    <div class="form-group mb-3">
                      <label class="form-label">Dirección *</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="supplier.address"
                        placeholder="Dirección completa"
                        required
                      >
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group mb-3">
                      <label class="form-label">Ciudad *</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="supplier.city"
                        placeholder="Ciudad"
                        required
                      >
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group mb-3">
                      <label class="form-label">Departamento</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="supplier.state"
                        placeholder="Departamento"
                      >
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group mb-3">
                      <label class="form-label">Código Postal</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="supplier.postalCode"
                        placeholder="Código postal"
                      >
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group mb-3">
                      <label class="form-label">Teléfono *</label>
                      <input 
                        type="tel" 
                        class="form-control" 
                        v-model="supplier.phone"
                        placeholder="(601) 234-5678"
                        required
                      >
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group mb-3">
                      <label class="form-label">Email *</label>
                      <input 
                        type="email" 
                        class="form-control" 
                        v-model="supplier.email"
                        placeholder="contacto@proveedor.com"
                        required
                      >
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group mb-3">
                      <label class="form-label">Sitio Web</label>
                      <input 
                        type="url" 
                        class="form-control" 
                        v-model="supplier.website"
                        placeholder="https://www.proveedor.com"
                      >
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group mb-3">
                      <label class="form-label">Persona de Contacto</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="supplier.contactPerson"
                        placeholder="Nombre del contacto principal"
                      >
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group mb-3">
                      <label class="form-label">Cargo del Contacto</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="supplier.contactPosition"
                        placeholder="Cargo o posición"
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Condiciones Comerciales -->
          <div class="col-md-4">
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="card-title mb-0">Condiciones Comerciales</h5>
              </div>
              <div class="card-body">
                <div class="form-group mb-3">
                  <label class="form-label">Plazo de Pago (días)</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    v-model="supplier.paymentTerms"
                    placeholder="30"
                    min="0"
                  >
                </div>
                <div class="form-group mb-3">
                  <label class="form-label">Límite de Crédito</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    v-model="supplier.creditLimit"
                    placeholder="0"
                    min="0"
                  >
                </div>
                <div class="form-group mb-3">
                  <label class="form-label">Moneda</label>
                  <select class="form-select" v-model="supplier.currency">
                    <option value="COP">Peso Colombiano (COP)</option>
                    <option value="USD">Dólar Americano (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </select>
                </div>
                <div class="form-group mb-3">
                  <label class="form-label">Descuento por Pronto Pago (%)</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    v-model="supplier.earlyPaymentDiscount"
                    placeholder="0"
                    min="0"
                    max="100"
                    step="0.01"
                  >
                </div>
              </div>
            </div>

            <!-- Notas -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="card-title mb-0">Notas Adicionales</h5>
              </div>
              <div class="card-body">
                <div class="form-group">
                  <textarea 
                    class="form-control" 
                    rows="4" 
                    v-model="supplier.notes"
                    placeholder="Observaciones, términos especiales, etc."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-outline-secondary" @click="$router.go(-1)">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary">
            <i class="fas fa-save"></i> {{ isEditing ? 'Actualizar' : 'Guardar' }} Proveedor
          </button>
        </div>
      </form>
    </div>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from '../../components/DashboardLayout.vue'

export default {
  name: 'SupplierCreateView',
  components: {
    DashboardLayout
  },
  data() {
    return {
      supplier: {
        idType: '',
        idNumber: '',
        checkDigit: '',
        businessName: '',
        tradeName: '',
        taxRegime: '',
        type: '',
        status: 'Activo',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        phone: '',
        email: '',
        website: '',
        contactPerson: '',
        contactPosition: '',
        paymentTerms: 30,
        creditLimit: 0,
        currency: 'COP',
        earlyPaymentDiscount: 0,
        notes: ''
      }
    }
  },
  computed: {
    isEditing() {
      return this.$route.params.id !== undefined
    }
  },
  mounted() {
    if (this.isEditing) {
      this.loadSupplier()
    }
  },
  methods: {
    loadSupplier() {
      // Simular carga de datos del proveedor
      const supplierId = this.$route.params.id
      console.log('Cargando proveedor:', supplierId)
      
      // Datos de ejemplo
      this.supplier = {
        idType: 'NIT',
        idNumber: '900123456-1',
        checkDigit: '1',
        businessName: 'Proveedor ABC S.A.S.',
        tradeName: 'ABC Suministros',
        taxRegime: 'Responsable IVA',
        type: 'Productos',
        status: 'Activo',
        address: 'Calle 123 #45-67',
        city: 'Bogotá',
        state: 'Cundinamarca',
        postalCode: '110111',
        phone: '(601) 234-5678',
        email: 'contacto@abc.com',
        website: 'https://www.abc.com',
        contactPerson: 'Juan Pérez',
        contactPosition: 'Gerente Comercial',
        paymentTerms: 30,
        creditLimit: 5000000,
        currency: 'COP',
        earlyPaymentDiscount: 2,
        notes: 'Proveedor confiable con buenos precios'
      }
    },
    saveSupplier() {
      // Validaciones básicas
      if (!this.supplier.businessName || !this.supplier.idNumber || !this.supplier.email) {
        alert('Por favor complete los campos obligatorios')
        return
      }

      // Simular guardado
      console.log('Guardando proveedor:', this.supplier)
      
      // Mostrar mensaje de éxito
      alert(this.isEditing ? 'Proveedor actualizado exitosamente' : 'Proveedor creado exitosamente')
      
      // Redirigir a la lista de proveedores
      this.$router.push('/purchases/suppliers')
    }
  }
}
</script>
