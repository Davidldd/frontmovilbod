<template>
  <DashboardLayout>
    <div class="suppliers-view">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Proveedores</h2>
          <p class="text-muted mb-0">Gestión de proveedores</p>
        </div>
        <button class="btn btn-primary" @click="$router.push('/purchases/suppliers/create')">
          <i class="fas fa-plus"></i> Nuevo Proveedor
        </button>
      </div>

      <!-- Filters -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <label class="form-label">Buscar</label>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="NIT, razón social o nombre comercial..."
                  v-model="filters.search"
                >
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group">
                <label class="form-label">Estado</label>
                <select class="form-select" v-model="filters.status">
                  <option value="">Todos</option>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group">
                <label class="form-label">Tipo</label>
                <select class="form-select" v-model="filters.type">
                  <option value="">Todos</option>
                  <option value="Productos">Productos</option>
                  <option value="Servicios">Servicios</option>
                  <option value="Mixto">Mixto</option>
                </select>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label class="form-label">&nbsp;</label>
                <button class="btn btn-outline-secondary w-100" @click="clearFilters">
                  <i class="fas fa-times"></i> Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Suppliers Table -->
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>NIT</th>
                  <th>Razón Social</th>
                  <th>Nombre Comercial</th>
                  <th>Contacto</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="supplier in filteredSuppliers" :key="supplier.id">
                  <td>{{ supplier.nit }}</td>
                  <td>{{ supplier.businessName }}</td>
                  <td>{{ supplier.tradeName }}</td>
                  <td>{{ supplier.contactPerson }}</td>
                  <td>{{ supplier.phone }}</td>
                  <td>{{ supplier.email }}</td>
                  <td>{{ supplier.type }}</td>
                  <td>
                    <span :class="supplier.status === 'Activo' ? 'badge bg-success' : 'badge bg-secondary'">
                      {{ supplier.status }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-primary" @click="editSupplier(supplier.id)">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-outline-info" @click="viewSupplier(supplier.id)">
                        <i class="fas fa-eye"></i>
                      </button>
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                          <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="#" @click="createPurchaseOrder(supplier.id)">
                            <i class="fas fa-file-invoice"></i> Nueva OC
                          </a></li>
                          <li><a class="dropdown-item" href="#" @click="viewPurchaseHistory(supplier.id)">
                            <i class="fas fa-history"></i> Historial de Compras
                          </a></li>
                          <li><hr class="dropdown-divider"></li>
                          <li><a class="dropdown-item text-danger" href="#" @click="toggleSupplierStatus(supplier.id)">
                            <i class="fas fa-ban"></i> {{ supplier.status === 'Activo' ? 'Desactivar' : 'Activar' }}
                          </a></li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <nav class="mt-4">
            <ul class="pagination justify-content-center">
              <li class="page-item disabled">
                <span class="page-link">Anterior</span>
              </li>
              <li class="page-item active">
                <span class="page-link">1</span>
              </li>
              <li class="page-item">
                <a class="page-link" href="#">2</a>
              </li>
              <li class="page-item">
                <a class="page-link" href="#">3</a>
              </li>
              <li class="page-item">
                <a class="page-link" href="#">Siguiente</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from '../../components/DashboardLayout.vue'

export default {
  name: 'SuppliersView',
  components: {
    DashboardLayout
  },
  data() {
    return {
      filters: {
        search: '',
        status: '',
        type: ''
      },
      suppliers: [
        {
          id: 1,
          nit: '900123456-1',
          businessName: 'Proveedor ABC S.A.S.',
          tradeName: 'ABC Suministros',
          contactPerson: 'Juan Pérez',
          phone: '(601) 234-5678',
          email: 'contacto@abc.com',
          type: 'Productos',
          status: 'Activo'
        },
        {
          id: 2,
          nit: '800987654-2',
          businessName: 'Distribuidora XYZ Ltda.',
          tradeName: 'XYZ Distribuciones',
          contactPerson: 'María García',
          phone: '(602) 987-6543',
          email: 'ventas@xyz.com',
          type: 'Mixto',
          status: 'Activo'
        },
        {
          id: 3,
          nit: '700456789-3',
          businessName: 'Suministros DEF S.A.',
          tradeName: 'DEF Suministros',
          contactPerson: 'Carlos López',
          phone: '(603) 456-7890',
          email: 'info@def.com',
          type: 'Servicios',
          status: 'Inactivo'
        }
      ]
    }
  },
  computed: {
    filteredSuppliers() {
      return this.suppliers.filter(supplier => {
        const matchesSearch = !this.filters.search || 
          supplier.nit.toLowerCase().includes(this.filters.search.toLowerCase()) ||
          supplier.businessName.toLowerCase().includes(this.filters.search.toLowerCase()) ||
          supplier.tradeName.toLowerCase().includes(this.filters.search.toLowerCase())
        
        const matchesStatus = !this.filters.status || supplier.status === this.filters.status
        const matchesType = !this.filters.type || supplier.type === this.filters.type
        
        return matchesSearch && matchesStatus && matchesType
      })
    }
  },
  methods: {
    clearFilters() {
      this.filters = {
        search: '',
        status: '',
        type: ''
      }
    },
    editSupplier(id) {
      this.$router.push(`/purchases/suppliers/${id}/edit`)
    },
    viewSupplier(id) {
      this.$router.push(`/purchases/suppliers/${id}`)
    },
    createPurchaseOrder(supplierId) {
      this.$router.push(`/purchases/orders/create?supplier=${supplierId}`)
    },
    viewPurchaseHistory(supplierId) {
      this.$router.push(`/purchases/orders?supplier=${supplierId}`)
    },
    toggleSupplierStatus(id) {
      const supplier = this.suppliers.find(s => s.id === id)
      if (supplier) {
        supplier.status = supplier.status === 'Activo' ? 'Inactivo' : 'Activo'
      }
    }
  }
}
</script>
