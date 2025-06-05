<template>
  <DashboardLayout>
    <div class="container-fluid">
      <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Plan de Cuentas (PUC)</h1>
        <router-link to="/accounting/account/new" class="btn btn-primary btn-icon-split">
          <span class="icon text-white-50"><i class="bi bi-plus-lg"></i></span>
          <span class="text">Crear Nueva Cuenta</span>
        </router-link>
      </div>

      <div class="card shadow mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Listado de Cuentas Contables</h6>
        </div>
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-md-4">
              <input type="text" class="form-control" placeholder="Buscar por código o nombre..." v-model="searchTerm" @input="filterAccounts">
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-hover table-bordered" id="dataTable" width="100%" cellspacing="0">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre de la Cuenta</th>
                  <th>Naturaleza</th>
                  <th>Tipo</th>
                  <th>Permite Mov.</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="account in filteredAccounts" :key="account.id">
                  <tr :style="{ 'padding-left': account.level * 20 + 'px' }">
                    <td>{{ account.code }}</td>
                    <td>
                      <span :style="{ 'margin-left': account.level * 15 + 'px' }">
                        {{ account.name }}
                      </span>
                    </td>
                    <td>{{ account.nature === 'D' ? 'Débito' : 'Crédito' }}</td>
                    <td>{{ account.type }}</td>
                    <td>
                      <span :class="account.allowsMovements ? 'badge bg-success' : 'badge bg-danger'">
                        {{ account.allowsMovements ? 'Sí' : 'No' }}
                      </span>
                    </td>
                    <td>
                      <router-link :to="`/accounting/account/${account.id}/edit`" class="btn btn-sm btn-info me-1" title="Editar">
                        <i class="bi bi-pencil-square"></i>
                      </router-link>
                      <button class="btn btn-sm btn-danger" @click="deleteAccount(account.id)" title="Eliminar" :disabled="!canDelete(account)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                </template>
                <tr v-if="filteredAccounts.length === 0">
                    <td colspan="6" class="text-center">No se encontraron cuentas.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import DashboardLayout from '../../components/DashboardLayout.vue';
// En una aplicación real, esto vendría de un store o API
const allAccounts = ref([
  { id: 1, code: '1', name: 'ACTIVO', nature: 'D', type: 'Clase', allowsMovements: false, level: 0, parentId: null, hasChildren: true, hasMovements: false },
  { id: 2, code: '11', name: 'DISPONIBLE', nature: 'D', type: 'Grupo', allowsMovements: false, level: 1, parentId: 1, hasChildren: true, hasMovements: false },
  { id: 3, code: '1105', name: 'CAJA', nature: 'D', type: 'Cuenta', allowsMovements: false, level: 2, parentId: 2, hasChildren: true, hasMovements: false },
  { id: 4, code: '110505', name: 'Caja General', nature: 'D', type: 'Subcuenta', allowsMovements: true, level: 3, parentId: 3, hasChildren: false, hasMovements: true },
  { id: 5, code: '1110', name: 'BANCOS', nature: 'D', type: 'Cuenta', allowsMovements: true, level: 2, parentId: 2, hasChildren: false, hasMovements: false },
  { id: 6, code: '2', name: 'PASIVO', nature: 'C', type: 'Clase', allowsMovements: false, level: 0, parentId: null, hasChildren: true, hasMovements: false },
  { id: 7, code: '21', name: 'OBLIGACIONES FINANCIERAS', nature: 'C', type: 'Grupo', allowsMovements: false, level: 1, parentId: 6, hasChildren: true, hasMovements: false },
  { id: 8, code: '2105', name: 'Bancos Nacionales', nature: 'C', type: 'Cuenta', allowsMovements: true, level: 2, parentId: 7, hasChildren: false, hasMovements: false },
  { id: 9, code: '4', name: 'INGRESOS', nature: 'C', type: 'Clase', allowsMovements: false, level: 0, parentId: null, hasChildren: true, hasMovements: false },
  { id: 10, code: '41', name: 'OPERACIONALES', nature: 'C', type: 'Grupo', allowsMovements: false, level: 1, parentId: 9, hasChildren: true, hasMovements: false },
  { id: 11, code: '4135', name: 'Comercio al por mayor y al por menor', nature: 'C', type: 'Cuenta', allowsMovements: true, level: 2, parentId: 10, hasChildren: false, hasMovements: true },
  { id: 12, code: '5', name: 'GASTOS', nature: 'D', type: 'Clase', allowsMovements: false, level: 0, parentId: null, hasChildren: true, hasMovements: false },
  { id: 13, code: '51', name: 'OPERACIONALES DE ADMINISTRACIÓN', nature: 'D', type: 'Grupo', allowsMovements: false, level: 1, parentId: 12, hasChildren: true, hasMovements: false },
  { id: 14, code: '5105', name: 'Gastos de Personal', nature: 'D', type: 'Cuenta', allowsMovements: false, level: 2, parentId: 13, hasChildren: true, hasMovements: false },
  { id: 15, code: '510506', name: 'Sueldos', nature: 'D', type: 'Subcuenta', allowsMovements: true, level: 3, parentId: 14, hasChildren: false, hasMovements: false },
]);

const searchTerm = ref('');

const filteredAccounts = computed(() => {
  if (!searchTerm.value) {
    return allAccounts.value;
  }
  const lowerSearchTerm = searchTerm.value.toLowerCase();
  return allAccounts.value.filter(acc => 
    acc.code.includes(searchTerm.value) || acc.name.toLowerCase().includes(lowerSearchTerm)
  );
});

const deleteAccount = (accountId) => {
  if (confirm('¿Está seguro de que desea eliminar esta cuenta? Esta acción no se puede deshacer.')) {
    // Lógica para eliminar la cuenta (ej. llamar a una API/store)
    allAccounts.value = allAccounts.value.filter(acc => acc.id !== accountId);
    console.log(`Cuenta ${accountId} eliminada (simulado)`);
  }
};

const canDelete = (account) => {
  // No se puede eliminar si tiene subcuentas o si ya tiene movimientos (simulado)
  return !account.hasChildren && !account.hasMovements;
};

// Lógica para ordenar y mostrar jerárquicamente (simplificada aquí)
// Una implementación real usaría una estructura de árbol o procesaría los datos para mostrarlos correctamente.
// La propiedad 'level' ayuda con la indentación.
</script>

<style scoped>
/* Estilos para la indentación en la tabla */
.table td:first-child {
  /* text-indent: calc(var(--level, 0) * 20px); */ /* No funciona directamente en Vue template style */
}
.badge {
  font-size: 0.8em;
}
</style>
