<template>
  <div class="supplier-selector">
    <div class="input-group">
      <input 
        type="text" 
        class="form-control" 
        :value="displayValue"
        @input="onSearch"
        @focus="showDropdown = true"
        placeholder="Buscar proveedor por NIT o nombre..."
        :required="required"
        readonly
      >
      <button 
        class="btn btn-outline-secondary" 
        type="button" 
        @click="toggleDropdown"
      >
        <i class="fas fa-chevron-down"></i>
      </button>
      <button 
        class="btn btn-outline-primary" 
        type="button" 
        @click="showCreateModal"
      >
        <i class="fas fa-plus"></i>
      </button>
    </div>

    <!-- Dropdown -->
    <div class="dropdown-menu w-100" :class="{ show: showDropdown }" style="max-height: 300px; overflow-y: auto;">
      <div class="px-3 py-2">
        <input 
          type="text" 
          class="form-control form-control-sm" 
          v-model="searchTerm"
          placeholder="Buscar..."
          @input="filterSuppliers"
        >
      </div>
      <div class="dropdown-divider"></div>
      <a 
        class="dropdown-item" 
        href="#" 
        v-for="supplier in filteredSuppliers" 
        :key="supplier.id"
        @click="selectSupplier(supplier)"
      >
        <div>
          <strong>{{ supplier.businessName }}</strong>
          <br>
          <small class="text-muted">{{ supplier.nit }} - {{ supplier.contactPerson }}</small>
        </div>
      </a>
      <div class="dropdown-item text-muted" v-if="filteredSuppliers.length === 0">
        No se encontraron proveedores
      </div>
    </div>

    <!-- Create Supplier Modal -->
    <div class="modal fade" id="createSupplierModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Crear Nuevo Proveedor</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="createSupplier">
              <div class="mb-3">
                <label class="form-label">NIT *</label>
                <input type="text" class="form-control" v-model="newSupplier.nit" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Razón Social *</label>
                <input type="text" class="form-control" v-model="newSupplier.businessName" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Nombre Comercial</label>
                <input type="text" class="form-control" v-model="newSupplier.tradeName">
              </div>
              <div class="mb-3">
                <label class="form-label">Persona de Contacto</label>
                <input type="text" class="form-control" v-model="newSupplier.contactPerson">
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Teléfono</label>
                    <input type="tel" class="form-control" v-model="newSupplier.phone">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" v-model="newSupplier.email">
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="createSupplier">Crear Proveedor</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SupplierSelector',
  props: {
    modelValue: {
      type: [Number, String],
      default: null
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'supplier-selected'],
  data() {
    return {
      showDropdown: false,
      searchTerm: '',
      selectedSupplier: null,
      newSupplier: {
        nit: '',
        businessName: '',
        tradeName: '',
        contactPerson: '',
        phone: '',
        email: ''
      },
      suppliers: [
        {
          id: 1,
          nit: '900123456-1',
          businessName: 'Proveedor ABC S.A.S.',
          tradeName: 'ABC Suministros',
          contactPerson: 'Juan Pérez',
          phone: '(601) 234-5678',
          email: 'contacto@abc.com'
        },
        {
          id: 2,
          nit: '800987654-2',
          businessName: 'Distribuidora XYZ Ltda.',
          tradeName: 'XYZ Distribuciones',
          contactPerson: 'María García',
          phone: '(602) 987-6543',
          email: 'ventas@xyz.com'
        },
        {
          id: 3,
          nit: '700456789-3',
          businessName: 'Suministros DEF S.A.',
          tradeName: 'DEF Suministros',
          contactPerson: 'Carlos López',
          phone: '(603) 456-7890',
          email: 'info@def.com'
        }
      ],
      filteredSuppliers: []
    }
  },
  computed: {
    displayValue() {
      if (this.selectedSupplier) {
        return `${this.selectedSupplier.businessName} (${this.selectedSupplier.nit})`
      }
      return ''
    }
  },
  mounted() {
    this.filteredSuppliers = [...this.suppliers]
    
    // Load selected supplier if modelValue is provided
    if (this.modelValue) {
      this.selectedSupplier = this.suppliers.find(s => s.id === this.modelValue)
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },
    onSearch(event) {
      this.searchTerm = event.target.value
      this.filterSuppliers()
      this.showDropdown = true
    },
    filterSuppliers() {
      if (!this.searchTerm) {
        this.filteredSuppliers = [...this.suppliers]
      } else {
        this.filteredSuppliers = this.suppliers.filter(supplier => 
          supplier.nit.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          supplier.businessName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          supplier.tradeName.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      }
    },
    selectSupplier(supplier) {
      this.selectedSupplier = supplier
      this.showDropdown = false
      this.searchTerm = ''
      
      // Emit events
      this.$emit('update:modelValue', supplier.id)
      this.$emit('supplier-selected', supplier)
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.showDropdown = false
      }
    },
    showCreateModal() {
      this.newSupplier = {
        nit: '',
        businessName: '',
        tradeName: '',
        contactPerson: '',
        phone: '',
        email: ''
      }
      const modal = new bootstrap.Modal(document.getElementById('createSupplierModal'))
      modal.show()
    },
    createSupplier() {
      // Validaciones básicas
      if (!this.newSupplier.nit || !this.newSupplier.businessName) {
        alert('Por favor complete los campos obligatorios')
        return
      }

      // Crear nuevo proveedor
      const newId = Math.max(...this.suppliers.map(s => s.id)) + 1
      const supplier = {
        id: newId,
        ...this.newSupplier
      }

      this.suppliers.push(supplier)
      this.filteredSuppliers = [...this.suppliers]

      // Seleccionar el nuevo proveedor
      this.selectSupplier(supplier)

      alert('Proveedor creado exitosamente')
      
      // Cerrar modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('createSupplierModal'))
      modal.hide()
    }
  }
}
</script>

<style scoped>
.supplier-selector {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
}
</style>
