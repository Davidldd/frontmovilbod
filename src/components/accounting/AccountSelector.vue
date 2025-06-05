<template>
  <div>
    <input 
      type="text" 
      class="form-control form-control-sm" 
      v-model="searchTerm" 
      @focus="showDropdown = true"
      @blur="hideDropdown"
      placeholder="Buscar cuenta (código o nombre)..."
      @keydown.down.prevent="navigateDown"
      @keydown.up.prevent="navigateUp"
      @keydown.enter.prevent="selectHighlightedAccount"
    >
    <ul v-if="showDropdown && filteredAccounts.length > 0" class="dropdown-menu show" style="width: 100%; max-height: 200px; overflow-y: auto;">
      <li v-for="(account, index) in filteredAccounts" :key="account.id" 
          :class="{ 'active': index === highlightedIndex }"
          @mousedown.prevent="selectAccount(account)"> <!-- mousedown para que se ejecute antes del blur -->
        <a class="dropdown-item" href="#">
          {{ account.code }} - {{ account.name }}
        </a>
      </li>
    </ul>
    <div v-if="showDropdown && filteredAccounts.length === 0 && searchTerm" class="dropdown-menu show p-2 text-muted" style="width: 100%;">
      No se encontraron cuentas.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineEmits, defineProps } from 'vue';

const props = defineProps({
  modelValue: [String, Number, null] // ID de la cuenta seleccionada
});

const emit = defineEmits(['update:modelValue', 'account-selected']);

const searchTerm = ref('');
const showDropdown = ref(false);
const highlightedIndex = ref(-1);

// Simulación de cuentas (solo las que permiten movimientos)
const allAccounts = ref([
  { id: 4, code: '110505', name: 'Caja General', allowsMovements: true, requiresThirdParty: true, requiresCostCenter: false },
  { id: 5, code: '1110', name: 'BANCOS', allowsMovements: true, requiresThirdParty: false, requiresCostCenter: false },
  { id: 8, code: '2105', name: 'Bancos Nacionales', allowsMovements: true, requiresThirdParty: true, requiresCostCenter: false },
  { id: 11, code: '4135', name: 'Comercio al por mayor y al por menor', allowsMovements: true, requiresThirdParty: true, requiresCostCenter: true },
  { id: 15, code: '510506', name: 'Sueldos', allowsMovements: true, requiresThirdParty: true, requiresCostCenter: true },
  { id: 16, code: '130505', name: 'Clientes Nacionales', allowsMovements: true, requiresThirdParty: true, requiresCostCenter: false },
  { id: 17, code: '220505', name: 'Proveedores Nacionales', allowsMovements: true, requiresThirdParty: true, requiresCostCenter: false },
]);

const filteredAccounts = computed(() => {
  if (!searchTerm.value) {
    return allAccounts.value.filter(acc => acc.allowsMovements);
  }
  const lowerSearchTerm = searchTerm.value.toLowerCase();
  return allAccounts.value.filter(acc => 
    acc.allowsMovements &&
    (acc.code.includes(searchTerm.value) || acc.name.toLowerCase().includes(lowerSearchTerm))
  );
});

watch(searchTerm, () => {
  highlightedIndex.value = -1; // Reset highlight when search term changes
});

const selectAccount = (account) => {
  searchTerm.value = `${account.code} - ${account.name}`;
  emit('update:modelValue', account.id);
  emit('account-selected', account); // Emit el objeto completo de la cuenta
  showDropdown.value = false;
};

const hideDropdown = () => {
  // Pequeño delay para permitir el click en el item del dropdown
  setTimeout(() => {
    showDropdown.value = false;
  }, 150);
};

const navigateDown = () => {
  if (filteredAccounts.value.length === 0) return;
  highlightedIndex.value = (highlightedIndex.value + 1) % filteredAccounts.value.length;
};

const navigateUp = () => {
  if (filteredAccounts.value.length === 0) return;
  highlightedIndex.value = (highlightedIndex.value - 1 + filteredAccounts.value.length) % filteredAccounts.value.length;
};

const selectHighlightedAccount = () => {
  if (highlightedIndex.value >= 0 && highlightedIndex.value < filteredAccounts.value.length) {
    selectAccount(filteredAccounts.value[highlightedIndex.value]);
  } else if (filteredAccounts.value.length === 1) { // Si solo hay un resultado, seleccionarlo
    selectAccount(filteredAccounts.value[0]);
  }
};

// Si hay un modelValue inicial, intentar mostrar el nombre de la cuenta
watch(() => props.modelValue, (newVal) => {
    if (newVal && !searchTerm.value) { // Solo si no se ha buscado nada aún
        const selected = allAccounts.value.find(acc => acc.id === newVal);
        if (selected) {
            searchTerm.value = `${selected.code} - ${selected.name}`;
        }
    }
}, { immediate: true });

</script>

<style scoped>
.dropdown-menu.show {
  display: block; /* Asegura que Bootstrap muestre el dropdown */
  position: absolute; /* Para que se superponga correctamente */
  z-index: 1000; /* Encima de otros elementos */
}
.dropdown-item.active, .dropdown-item:active {
    background-color: #0d6efd; /* Color de Bootstrap para item activo */
    color: white;
}
</style>
