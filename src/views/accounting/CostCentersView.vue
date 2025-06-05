<template>
  <DashboardLayout>
    <div class="container-fluid">
      <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Centros de Costo</h1>
        <button class="btn btn-primary btn-icon-split" @click="openCreateModal">
          <span class="icon text-white-50"><i class="bi bi-plus-lg"></i></span>
          <span class="text">Nuevo Centro de Costo</span>
        </button>
      </div>

      <div class="card shadow mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Listado de Centros de Costo</h6>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover table-bordered" width="100%" cellspacing="0">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cc in costCenters" :key="cc.id">
                  <td>{{ cc.code }}</td>
                  <td>{{ cc.name }}</td>
                  <td>
                    <span :class="cc.status === 'active' ? 'badge bg-success' : 'badge bg-danger'">
                      {{ cc.status === 'active' ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-info me-1" @click="openEditModal(cc)" title="Editar">
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" @click="deleteCostCenter(cc.id)" title="Eliminar" :disabled="cc.hasMovements">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
                 <tr v-if="costCenters.length === 0">
                    <td colspan="4" class="text-center">No hay centros de costo definidos.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal para Crear/Editar Centro de Costo -->
      <div class="modal fade" id="costCenterModal" tabindex="-1" aria-labelledby="costCenterModalLabel" aria-hidden="true" ref="ccModalRef">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="costCenterModalLabel">{{ isEditingModal ? 'Editar' : 'Nuevo' }} Centro de Costo</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveCostCenter">
                <div class="mb-3">
                  <label for="ccCode" class="form-label">Código <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="ccCode" v-model="currentCostCenter.code" required>
                </div>
                <div class="mb-3">
                  <label for="ccName" class="form-label">Nombre <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="ccName" v-model="currentCostCenter.name" required>
                </div>
                <div class="mb-3">
                  <label for="ccStatus" class="form-label">Estado <span class="text-danger">*</span></label>
                  <select class="form-select" id="ccStatus" v-model="currentCostCenter.status" required>
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                  <button type="submit" class="btn btn-primary">{{ isEditingModal ? 'Actualizar' : 'Guardar' }}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DashboardLayout from '../../components/DashboardLayout.vue';
import { Modal } from 'bootstrap'; // Import Bootstrap's Modal

const costCenters = ref([
  { id: 1, code: '001', name: 'Administración', status: 'active', hasMovements: true },
  { id: 2, code: '002', name: 'Ventas Nacional', status: 'active', hasMovements: false },
  { id: 3, code: '003', name: 'Producción A', status: 'inactive', hasMovements: false },
  { id: 4, code: '101', name: 'Proyectos Especiales', status: 'active', hasMovements: true },
]);

const isEditingModal = ref(false);
const currentCostCenter = ref({ id: null, code: '', name: '', status: 'active' });
const ccModalRef = ref(null); // Reference to the modal DOM element
let ccModalInstance = null; // To store the Bootstrap Modal instance

onMounted(() => {
  if (ccModalRef.value) {
    ccModalInstance = new Modal(ccModalRef.value);
  }
});

const openCreateModal = () => {
  isEditingModal.value = false;
  currentCostCenter.value = { id: null, code: '', name: '', status: 'active' };
  if (ccModalInstance) ccModalInstance.show();
};

const openEditModal = (cc) => {
  isEditingModal.value = true;
  currentCostCenter.value = { ...cc }; // Create a copy to edit
  if (ccModalInstance) ccModalInstance.show();
};

const saveCostCenter = () => {
  if (isEditingModal.value) {
    // Update existing
    const index = costCenters.value.findIndex(c => c.id === currentCostCenter.value.id);
    if (index !== -1) {
      costCenters.value[index] = { ...currentCostCenter.value };
    }
  } else {
    // Create new
    const newId = costCenters.value.length > 0 ? Math.max(...costCenters.value.map(c => c.id)) + 1 : 1;
    costCenters.value.push({ ...currentCostCenter.value, id: newId, hasMovements: false });
  }
  if (ccModalInstance) ccModalInstance.hide();
};

const deleteCostCenter = (id) => {
  const cc = costCenters.value.find(c => c.id === id);
  if (cc && cc.hasMovements) {
    alert('No se puede eliminar un centro de costo que ya tiene movimientos asociados.');
    return;
  }
  if (confirm('¿Está seguro de que desea eliminar este centro de costo?')) {
    costCenters.value = costCenters.value.filter(c => c.id !== id);
  }
};
</script>
