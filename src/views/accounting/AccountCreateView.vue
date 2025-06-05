<template>
  <DashboardLayout>
    <div class="container-fluid">
      <h1 class="h3 mb-4 text-gray-800">{{ isEditing ? 'Editar Cuenta Contable' : 'Crear Nueva Cuenta Contable' }}</h1>

      <div class="card shadow mb-4">
        <div class="card-body">
          <form @submit.prevent="saveAccount">
            <div class="row">
              <div class="col-md-4 mb-3">
                <label for="accountCode" class="form-label">Código de Cuenta <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="accountCode" v-model="account.code" required placeholder="Ej: 110505">
                <small class="form-text text-muted">Según estructura PUC.</small>
              </div>
              <div class="col-md-8 mb-3">
                <label for="accountName" class="form-label">Nombre de la Cuenta <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="accountName" v-model="account.name" required placeholder="Ej: Caja General">
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="parentAccount" class="form-label">Cuenta Mayor (Padre)</label>
                <select class="form-select" id="parentAccount" v-model="account.parentId">
                  <option :value="null">-- Ninguna (Cuenta de Clase) --</option>
                  <option v-for="parentAcc in availableParentAccounts" :key="parentAcc.id" :value="parentAcc.id">
                    {{ parentAcc.code }} - {{ parentAcc.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label for="accountNature" class="form-label">Naturaleza <span class="text-danger">*</span></label>
                <select class="form-select" id="accountNature" v-model="account.nature" required>
                  <option value="D">Débito</option>
                  <option value="C">Crédito</option>
                </select>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="accountType" class="form-label">Tipo de Cuenta <span class="text-danger">*</span></label>
                <select class="form-select" id="accountType" v-model="account.type" required>
                  <option value="Clase">Clase</option>
                  <option value="Grupo">Grupo</option>
                  <option value="Cuenta">Cuenta</option>
                  <option value="Subcuenta">Subcuenta</option>
                  <option value="Auxiliar">Auxiliar</option>
                </select>
                 <small class="form-text text-muted">Define el nivel en el PUC.</small>
              </div>
               <div class="col-md-6 mb-3">
                <label for="accountStatus" class="form-label">Estado <span class="text-danger">*</span></label>
                <select class="form-select" id="accountStatus" v-model="account.status" required>
                  <option value="active">Activa</option>
                  <option value="inactive">Inactiva</option>
                </select>
              </div>
            </div>
            
            <div class="row">
                <div class="col-md-12 mb-3">
                    <div class="form-check form-switch mb-2">
                        <input class="form-check-input" type="checkbox" id="allowsMovements" v-model="account.allowsMovements">
                        <label class="form-check-label" for="allowsMovements">Permite Movimientos Directos</label>
                        <small class="form-text d-block text-muted">Marcar si esta cuenta recibirá asientos contables directamente.</small>
                    </div>
                    <div class="form-check form-switch mb-2">
                        <input class="form-check-input" type="checkbox" id="requiresThirdParty" v-model="account.requiresThirdParty">
                        <label class="form-check-label" for="requiresThirdParty">Requiere Tercero</label>
                         <small class="form-text d-block text-muted">Marcar si los movimientos en esta cuenta deben identificar un tercero (NIT/Cédula).</small>
                    </div>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="requiresCostCenter" v-model="account.requiresCostCenter">
                        <label class="form-check-label" for="requiresCostCenter">Requiere Centro de Costo</label>
                        <small class="form-text d-block text-muted">Marcar si los movimientos deben asociarse a un centro de costo.</small>
                    </div>
                </div>
            </div>

            <div class="mt-4">
              <button type="submit" class="btn btn-primary me-2">
                <i class="bi bi-save"></i> {{ isEditing ? 'Actualizar Cuenta' : 'Guardar Cuenta' }}
              </button>
              <router-link to="/accounting/chart-of-accounts" class="btn btn-secondary">
                <i class="bi bi-x-circle"></i> Cancelar
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DashboardLayout from '../../components/DashboardLayout.vue';

const route = useRoute();
const router = useRouter();
const isEditing = ref(false);
const accountId = ref(null);

const account = ref({
  code: '',
  name: '',
  parentId: null,
  nature: 'D',
  type: 'Subcuenta',
  allowsMovements: true,
  requiresThirdParty: false,
  requiresCostCenter: false,
  status: 'active',
});

// Simulación de cuentas padre disponibles (excluyendo cuentas que ya son auxiliares o de movimiento)
const allAccountsForParent = ref([
    { id: 1, code: '1', name: 'ACTIVO', allowsMovements: false },
    { id: 2, code: '11', name: 'DISPONIBLE', allowsMovements: false },
    { id: 3, code: '1105', name: 'CAJA', allowsMovements: false },
    { id: 6, code: '2', name: 'PASIVO', allowsMovements: false },
    { id: 7, code: '21', name: 'OBLIGACIONES FINANCIERAS', allowsMovements: false },
    { id: 9, code: '4', name: 'INGRESOS', allowsMovements: false },
    { id: 10, code: '41', name: 'OPERACIONALES', allowsMovements: false },
    { id: 12, code: '5', name: 'GASTOS', allowsMovements: false },
    { id: 13, code: '51', name: 'OPERACIONALES DE ADMINISTRACIÓN', allowsMovements: false },
    { id: 14, code: '5105', name: 'Gastos de Personal', allowsMovements: false },
]);

const availableParentAccounts = computed(() => {
    return allAccountsForParent.value.filter(acc => !acc.allowsMovements);
});

const saveAccount = () => {
  // Validaciones adicionales aquí
  if (isEditing.value) {
    console.log('Actualizando cuenta:', account.value);
    // Lógica de actualización (API/Store)
  } else {
    console.log('Guardando nueva cuenta:', account.value);
    // Lógica de creación (API/Store)
  }
  router.push('/accounting/chart-of-accounts');
};

onMounted(() => {
  if (route.params.id) {
    isEditing.value = true;
    accountId.value = route.params.id;
    // Cargar datos de la cuenta para edición (simulado)
    const existingAccount = allAccountsForParent.value.find(a => a.id === parseInt(accountId.value)) || 
                            { id: 4, code: '110505', name: 'Caja General', nature: 'D', type: 'Subcuenta', allowsMovements: true, parentId: 3, status: 'active' }; // Simulación
    if(existingAccount) account.value = { ...existingAccount };
  }
});
</script>
