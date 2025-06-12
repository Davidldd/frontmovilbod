<template>
    <div class="position-relative">
      <div class="input-group">
        <input
          type="text"
          class="form-control"
          :class="inputClass"
          v-model="searchTerm"
          @input="onSearch"
          @focus="showDropdown = true"
          @blur="onBlur"
          :placeholder="placeholder"
          autocomplete="off"
        >
        <button
          class="btn btn-outline-secondary"
          type="button"
          @click="toggleDropdown"
        >
          <i class="bi bi-chevron-down"></i>
        </button>
      </div>
      
      <div
        v-if="showDropdown && (filteredCustomers.length > 0 || searchTerm)"
        class="dropdown-menu show w-100 mt-1"
        style="max-height: 300px; overflow-y: auto;"
      >
        <div v-if="filteredCustomers.length === 0 && searchTerm" class="dropdown-item-text text-muted">
          <i class="bi bi-search me-2"></i>
          No se encontraron clientes con "{{ searchTerm }}"
        </div>
        <div v-if="filteredCustomers.length === 0 && searchTerm" class="dropdown-divider"></div>
        <a
          v-if="filteredCustomers.length === 0 && searchTerm"
          href="#"
          class="dropdown-item text-primary"
          @click.prevent="createNewCustomer"
        >
          <i class="bi bi-plus-circle me-2"></i>
          Crear nuevo cliente "{{ searchTerm }}"
        </a>
        
        <a
          v-for="customer in filteredCustomers"
          :key="customer.id"
          href="#"
          class="dropdown-item"
          @click.prevent="selectCustomer(customer)"
          :class="{ active: selectedCustomer?.id === customer.id }"
        >
          <div class="d-flex align-items-center">
            <div class="avatar-circle bg-light text-secondary me-2">
              {{ getInitials(customer.name) }}
            </div>
            <div class="flex-grow-1">
              <div class="fw-medium">{{ customer.name }}</div>
              <div class="small text-muted">{{ customer.email }}</div>
            </div>
            <div class="text-end">
              <span :class="getCategoryBadgeClass(customer.category)">
                {{ customer.category }}
              </span>
            </div>
          </div>
        </a>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, watch } from 'vue';
  
  export default {
    name: 'CustomerSelector',
    props: {
      modelValue: {
        type: [String, Number],
        default: null
      },
      placeholder: {
        type: String,
        default: 'Buscar cliente...'
      },
      inputClass: {
        type: String,
        default: ''
      }
    },
    emits: ['update:modelValue', 'customer-selected'],
    setup(props, { emit }) {
      const searchTerm = ref('');
      const showDropdown = ref(false);
      const selectedCustomer = ref(null);
  
      // Datos de ejemplo de clientes
      const customers = ref([
        {
          id: 1,
          name: 'Empresa ABC',
          email: 'contacto@empresaabc.cl',
          phone: '+56 9 1234 5678',
          address: 'Av. Principal 123, Santiago',
          contactName: 'Juan Pérez',
          category: 'A'
        },
        {
          id: 2,
          name: 'Distribuidora XYZ',
          email: 'ventas@distribuidoraxyz.cl',
          phone: '+56 9 8765 4321',
          address: 'Calle Comercial 456, Concepción',
          contactName: 'María González',
          category: 'A'
        },
        {
          id: 3,
          name: 'Comercial 123',
          email: 'info@comercial123.cl',
          phone: '+56 9 2345 6789',
          address: 'Pasaje Industrial 789, Valparaíso',
          contactName: 'Pedro Soto',
          category: 'B'
        },
        {
          id: 4,
          name: 'Tienda Online',
          email: 'contacto@tiendaonline.cl',
          phone: '+56 9 3456 7890',
          address: 'Av. Digital 234, Santiago',
          contactName: 'Ana Muñoz',
          category: 'C'
        },
        {
          id: 5,
          name: 'Mayorista Central',
          email: 'ventas@mayoristacentral.cl',
          phone: '+56 9 4567 8901',
          address: 'Calle Mayor 567, Temuco',
          contactName: 'Roberto Díaz',
          category: 'B'
        }
      ]);
  
      const filteredCustomers = computed(() => {
        if (!searchTerm.value) return customers.value;
        
        return customers.value.filter(customer =>
          customer.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          customer.contactName.toLowerCase().includes(searchTerm.value.toLowerCase())
        );
      });
  
      const onSearch = () => {
        showDropdown.value = true;
      };
  
      const onBlur = () => {
        // Delay hiding dropdown to allow click events
        setTimeout(() => {
          showDropdown.value = false;
        }, 200);
      };
  
      const toggleDropdown = () => {
        showDropdown.value = !showDropdown.value;
      };
  
      const selectCustomer = (customer) => {
        selectedCustomer.value = customer;
        searchTerm.value = customer.name;
        showDropdown.value = false;
        
        emit('update:modelValue', customer.id);
        emit('customer-selected', customer);
      };
  
      const createNewCustomer = () => {
        // Aquí se redirigiría a crear un nuevo cliente
        // Por ahora solo mostramos un alert
        alert(`Crear nuevo cliente: ${searchTerm.value}`);
        showDropdown.value = false;
      };
  
      const getInitials = (name) => {
        if (!name) return '';
        return name
          .split(' ')
          .map(word => word.charAt(0))
          .join('')
          .substring(0, 2)
          .toUpperCase();
      };
  
      const getCategoryBadgeClass = (category) => {
        switch (category) {
          case 'A': return 'badge bg-success';
          case 'B': return 'badge bg-primary';
          case 'C': return 'badge bg-info';
          default: return 'badge bg-secondary';
        }
      };
  
      // Watch for external changes to modelValue
      watch(() => props.modelValue, (newValue) => {
        if (newValue) {
          const customer = customers.value.find(c => c.id === newValue);
          if (customer) {
            selectedCustomer.value = customer;
            searchTerm.value = customer.name;
          }
        } else {
          selectedCustomer.value = null;
          searchTerm.value = '';
        }
      }, { immediate: true });
  
      return {
        searchTerm,
        showDropdown,
        selectedCustomer,
        filteredCustomers,
        onSearch,
        onBlur,
        toggleDropdown,
        selectCustomer,
        createNewCustomer,
        getInitials,
        getCategoryBadgeClass
      };
    }
  };
  </script>
  
  <style scoped>
  .avatar-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 0.75rem;
  }
  
  .dropdown-menu {
    z-index: 1050;
  }
  </style>
  