<template>
    <DashboardLayout>
      <template #header>
        <div class="d-flex justify-content-between align-items-center">
          <h1 class="h3 mb-0">{{ isEditing ? 'Editar Cliente' : 'Nuevo Cliente' }}</h1>
          <div>
            <router-link to="/sales/customers" class="btn btn-outline-secondary me-2">
              <i class="bi bi-x-lg me-1"></i> Cancelar
            </router-link>
            <button type="button" class="btn btn-primary" @click="saveCustomer">
              <i class="bi bi-check-lg me-1"></i> Guardar
            </button>
          </div>
        </div>
      </template>
  
      <div class="row g-4">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white">
              <h5 class="mb-0">Información del cliente</h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="saveCustomer">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="name" class="form-label">Nombre o Razón Social <span class="text-danger">*</span></label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="name" 
                      v-model="customer.name" 
                      :class="{ 'is-invalid': errors.name }"
                      required
                    >
                    <div class="invalid-feedback" v-if="errors.name">{{ errors.name }}</div>
                  </div>
                  <div class="col-md-6">
                    <label for="taxId" class="form-label">RUT <span class="text-danger">*</span></label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="taxId" 
                      v-model="customer.taxId" 
                      :class="{ 'is-invalid': errors.taxId }"
                      required
                    >
                    <div class="invalid-feedback" v-if="errors.taxId">{{ errors.taxId }}</div>
                  </div>
                  <div class="col-md-6">
                    <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
                    <input 
                      type="email" 
                      class="form-control" 
                      id="email" 
                      v-model="customer.email" 
                      :class="{ 'is-invalid': errors.email }"
                      required
                    >
                    <div class="invalid-feedback" v-if="errors.email">{{ errors.email }}</div>
                  </div>
                  <div class="col-md-6">
                    <label for="phone" class="form-label">Teléfono <span class="text-danger">*</span></label>
                    <input 
                      type="tel" 
                      class="form-control" 
                      id="phone" 
                      v-model="customer.phone" 
                      :class="{ 'is-invalid': errors.phone }"
                      required
                    >
                    <div class="invalid-feedback" v-if="errors.phone">{{ errors.phone }}</div>
                  </div>
                  <div class="col-md-6">
                    <label for="contactName" class="form-label">Persona de contacto</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="contactName" 
                      v-model="customer.contactName"
                    >
                  </div>
                  <div class="col-md-6">
                    <label for="contactPosition" class="form-label">Cargo</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="contactPosition" 
                      v-model="customer.contactPosition"
                    >
                  </div>
                  <div class="col-12">
                    <label for="address" class="form-label">Dirección <span class="text-danger">*</span></label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="address" 
                      v-model="customer.address" 
                      :class="{ 'is-invalid': errors.address }"
                      required
                    >
                    <div class="invalid-feedback" v-if="errors.address">{{ errors.address }}</div>
                  </div>
                  <div class="col-md-6">
                    <label for="city" class="form-label">Ciudad <span class="text-danger">*</span></label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="city" 
                      v-model="customer.city" 
                      :class="{ 'is-invalid': errors.city }"
                      required
                    >
                    <div class="invalid-feedback" v-if="errors.city">{{ errors.city }}</div>
                  </div>
                  <div class="col-md-6">
                    <label for="region" class="form-label">Región</label>
                    <select class="form-select" id="region" v-model="customer.region">
                      <option value="">Seleccione una región</option>
                      <option value="Metropolitana">Región Metropolitana</option>
                      <option value="Valparaíso">Región de Valparaíso</option>
                      <option value="Biobío">Región del Biobío</option>
                      <option value="Araucanía">Región de la Araucanía</option>
                      <option value="Otra">Otra región</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label for="zipCode" class="form-label">Código Postal</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="zipCode" 
                      v-model="customer.zipCode"
                    >
                  </div>
                  <div class="col-md-6">
                    <label for="website" class="form-label">Sitio Web</label>
                    <input 
                      type="url" 
                      class="form-control" 
                      id="website" 
                      v-model="customer.website"
                    >
                  </div>
                </div>
              </form>
            </div>
          </div>
  
          <div class="card border-0 shadow-sm mt-4">
            <div class="card-header bg-white">
              <h5 class="mb-0">Información comercial</h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="category" class="form-label">Categoría de cliente</label>
                  <select class="form-select" id="category" v-model="customer.category">
                    <option value="A">Categoría A</option>
                    <option value="B">Categoría B</option>
                    <option value="C">Categoría C</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="paymentTerms" class="form-label">Condiciones de pago</label>
                  <select class="form-select" id="paymentTerms" v-model="customer.paymentTerms">
                    <option value="immediate">Pago inmediato</option>
                    <option value="15days">15 días</option>
                    <option value="30days">30 días</option>
                    <option value="60days">60 días</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="creditLimit" class="form-label">Límite de crédito</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input 
                      type="number" 
                      class="form-control" 
                      id="creditLimit" 
                      v-model="customer.creditLimit"
                    >
                  </div>
                </div>
                <div class="col-md-6">
                  <label for="salesRep" class="form-label">Representante de ventas</label>
                  <select class="form-select" id="salesRep" v-model="customer.salesRep">
                    <option value="">Seleccione un representante</option>
                    <option value="1">Juan Pérez</option>
                    <option value="2">María González</option>
                    <option value="3">Pedro Soto</option>
                  </select>
                </div>
                <div class="col-12">
                  <label for="notes" class="form-label">Notas</label>
                  <textarea 
                    class="form-control" 
                    id="notes" 
                    rows="3" 
                    v-model="customer.notes"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white">
              <h5 class="mb-0">Estado y configuración</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label d-block">Estado del cliente</label>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" id="statusActive" value="active" v-model="customer.status">
                  <label class="form-check-label" for="statusActive">Activo</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" id="statusInactive" value="inactive" v-model="customer.status">
                  <label class="form-check-label" for="statusInactive">Inactivo</label>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Opciones adicionales</label>
                <div class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" id="sendNotifications" v-model="customer.sendNotifications">
                  <label class="form-check-label" for="sendNotifications">
                    Enviar notificaciones
                  </label>
                </div>
                <div class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" id="allowCredit" v-model="customer.allowCredit">
                  <label class="form-check-label" for="allowCredit">
                    Permitir crédito
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="isVIP" v-model="customer.isVIP">
                  <label class="form-check-label" for="isVIP">
                    Cliente VIP
                  </label>
                </div>
              </div>
            </div>
          </div>
  
          <div class="card border-0 shadow-sm mt-4" v-if="isEditing">
            <div class="card-header bg-white">
              <h5 class="mb-0">Información adicional</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label">Fecha de registro</label>
                <p class="mb-0">{{ formatDate(customer.createdAt) }}</p>
              </div>
              <div class="mb-3">
                <label class="form-label">Última actualización</label>
                <p class="mb-0">{{ formatDate(customer.updatedAt) }}</p>
              </div>
              <div class="mb-3">
                <label class="form-label">Total de compras</label>
                <p class="mb-0">{{ formatCurrency(customer.totalSales) }}</p>
              </div>
              <div>
                <label class="form-label">Última compra</label>
                <p class="mb-0">{{ formatDate(customer.lastPurchase) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  </template>
  
  <script>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import DashboardLayout from '../../components/DashboardLayout.vue';
  
  export default {
    name: 'CustomerCreateView',
    components: {
      DashboardLayout
    },
    setup() {
      const route = useRoute();
      const router = useRouter();
      const customerId = computed(() => route.params.id);
      const isEditing = computed(() => !!customerId.value);
  
      const customer = reactive({
        id: null,
        name: '',
        taxId: '',
        email: '',
        phone: '',
        contactName: '',
        contactPosition: '',
        address: '',
        city: '',
        region: '',
        zipCode: '',
        website: '',
        category: 'B',
        paymentTerms: '30days',
        creditLimit: 5000000,
        salesRep: '',
        notes: '',
        status: 'active',
        sendNotifications: true,
        allowCredit: true,
        isVIP: false,
        createdAt: null,
        updatedAt: null,
        totalSales: 0,
        lastPurchase: null
      });
  
      const errors = reactive({
        name: '',
        taxId: '',
        email: '',
        phone: '',
        address: '',
        city: ''
      });
  
      // Datos de ejemplo para edición
      const sampleCustomers = [
        {
          id: 1,
          name: 'Empresa ABC',
          taxId: '76.123.456-7',
          email: 'contacto@empresaabc.cl',
          phone: '+56 9 1234 5678',
          contactName: 'Juan Pérez',
          contactPosition: 'Gerente de Compras',
          address: 'Av. Principal 123',
          city: 'Santiago',
          region: 'Metropolitana',
          zipCode: '8320000',
          website: 'www.empresaabc.cl',
          category: 'A',
          paymentTerms: '30days',
          creditLimit: 10000000,
          salesRep: '1',
          notes: 'Cliente importante con múltiples sucursales',
          status: 'active',
          sendNotifications: true,
          allowCredit: true,
          isVIP: true,
          createdAt: '2022-01-15',
          updatedAt: '2023-05-20',
          totalSales: 12500000,
          lastPurchase: '2023-06-10'
        },
        {
          id: 2,
          name: 'Distribuidora XYZ',
          taxId: '77.987.654-3',
          email: 'ventas@distribuidoraxyz.cl',
          phone: '+56 9 8765 4321',
          contactName: 'María González',
          contactPosition: 'Directora Comercial',
          address: 'Calle Comercial 456',
          city: 'Concepción',
          region: 'Biobío',
          zipCode: '4030000',
          website: 'www.distribuidoraxyz.cl',
          category: 'A',
          paymentTerms: '60days',
          creditLimit: 8000000,
          salesRep: '2',
          notes: 'Distribuidor regional con buena capacidad de pago',
          status: 'active',
          sendNotifications: true,
          allowCredit: true,
          isVIP: false,
          createdAt: '2022-02-20',
          updatedAt: '2023-06-01',
          totalSales: 9800000,
          lastPurchase: '2023-06-08'
        }
      ];
  
      const validateForm = () => {
        let isValid = true;
        
        // Resetear errores
        Object.keys(errors).forEach(key => {
          errors[key] = '';
        });
        
        if (!customer.name.trim()) {
          errors.name = 'El nombre es obligatorio';
          isValid = false;
        }
        
        if (!customer.taxId.trim()) {
          errors.taxId = 'El RUT es obligatorio';
          isValid = false;
        }
        
        if (!customer.email.trim()) {
          errors.email = 'El email es obligatorio';
          isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
          errors.email = 'El email no es válido';
          isValid = false;
        }
        
        if (!customer.phone.trim()) {
          errors.phone = 'El teléfono es obligatorio';
          isValid = false;
        }
        
        if (!customer.address.trim()) {
          errors.address = 'La dirección es obligatoria';
          isValid = false;
        }
        
        if (!customer.city.trim()) {
          errors.city = 'La ciudad es obligatoria';
          isValid = false;
        }
        
        return isValid;
      };
  
      const saveCustomer = () => {
        if (!validateForm()) {
          // Mostrar mensaje de error
          alert('Por favor, complete todos los campos obligatorios correctamente.');
          return;
        }
        
        // Aquí iría la lógica para guardar el cliente
        // Por ahora solo simulamos y redirigimos
        
        if (isEditing.value) {
          // Actualizar cliente existente
          console.log('Cliente actualizado:', customer);
        } else {
          // Crear nuevo cliente
          customer.id = Date.now(); // Generar ID temporal
          customer.createdAt = new Date().toISOString();
          console.log('Nuevo cliente creado:', customer);
        }
        
        // Actualizar timestamp
        customer.updatedAt = new Date().toISOString();
        
        // Redirigir a la lista de clientes
        router.push('/sales/customers');
      };
  
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-CL').format(date);
      };
  
      const formatCurrency = (value) => {
        if (value === undefined || value === null) return '$0';
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
      };
  
      onMounted(() => {
        if (isEditing.value) {
          // Buscar cliente por ID (simulado)
          const foundCustomer = sampleCustomers.find(c => c.id === parseInt(customerId.value));
          if (foundCustomer) {
            // Copiar datos al objeto reactivo
            Object.assign(customer, foundCustomer);
          } else {
            // Cliente no encontrado, redirigir
            router.push('/sales/customers');
          }
        }
      });
  
      return {
        customer,
        errors,
        isEditing,
        saveCustomer,
        formatDate,
        formatCurrency
      };
    }
  };
  </script>
  