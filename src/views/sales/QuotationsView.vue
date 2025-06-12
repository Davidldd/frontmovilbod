<template>
    <DashboardLayout>
      <template #header>
        <div class="d-flex justify-content-between align-items-center">
          <h1 class="h3 mb-0">Cotizaciones</h1>
          <div>
            <router-link to="/sales/quotations/create" class="btn btn-primary">
              <i class="bi bi-plus-lg me-1"></i> Nueva Cotización
            </router-link>
          </div>
        </div>
      </template>
  
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white py-3">
          <div class="row g-3 align-items-center">
            <div class="col-md-3">
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0">
                  <i class="bi bi-search text-muted"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control border-start-0" 
                  placeholder="Buscar cotizaciones..." 
                  v-model="searchTerm"
                >
              </div>
            </div>
            <div class="col-md-2">
              <select class="form-select" v-model="filterStatus">
                <option value="">Todos los estados</option>
                <option value="draft">Borrador</option>
                <option value="sent">Enviada</option>
                <option value="approved">Aprobada</option>
                <option value="rejected">Rechazada</option>
                <option value="expired">Vencida</option>
              </select>
            </div>
            <div class="col-md-2">
              <select class="form-select" v-model="filterDate">
                <option value="">Todas las fechas</option>
                <option value="today">Hoy</option>
                <option value="week">Esta semana</option>
                <option value="month">Este mes</option>
                <option value="quarter">Este trimestre</option>
              </select>
            </div>
            <div class="col-md-auto ms-auto">
              <div class="btn-group">
                <button type="button" class="btn btn-outline-secondary">
                  <i class="bi bi-funnel"></i>
                </button>
                <button type="button" class="btn btn-outline-secondary">
                  <i class="bi bi-download"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th scope="col">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" v-model="selectAll" @change="toggleSelectAll">
                    </div>
                  </th>
                  <th scope="col"># Cotización</th>
                  <th scope="col">Cliente</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Vencimiento</th>
                  <th scope="col">Total</th>
                  <th scope="col">Estado</th>
                  <th scope="col" class="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="quotation in filteredQuotations" :key="quotation.id" class="align-middle">
                  <td>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" v-model="selectedQuotations" :value="quotation.id">
                    </div>
                  </td>
                  <td>
                    <div class="fw-medium">{{ quotation.number }}</div>
                    <div class="small text-muted">{{ quotation.reference }}</div>
                  </td>
                  <td>
                    <div>{{ quotation.customerName }}</div>
                    <div class="small text-muted">{{ quotation.customerEmail }}</div>
                  </td>
                  <td>{{ formatDate(quotation.date) }}</td>
                  <td>
                    <div :class="getExpirationClass(quotation.expirationDate)">
                      {{ formatDate(quotation.expirationDate) }}
                    </div>
                  </td>
                  <td>{{ formatCurrency(quotation.total) }}</td>
                  <td>
                    <span :class="getStatusBadgeClass(quotation.status)">
                      {{ getStatusLabel(quotation.status) }}
                    </span>
                  </td>
                  <td>
                    <div class="dropdown">
                      <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        <i class="bi bi-three-dots"></i>
                      </button>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#" @click="viewQuotation(quotation)">
                          <i class="bi bi-eye me-2"></i>Ver detalles
                        </a></li>
                        <li><router-link :to="`/sales/quotations/edit/${quotation.id}`" class="dropdown-item">
                          <i class="bi bi-pencil me-2"></i>Editar
                        </router-link></li>
                        <li><a class="dropdown-item" href="#" @click="duplicateQuotation(quotation)">
                          <i class="bi bi-files me-2"></i>Duplicar
                        </a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" @click="sendQuotation(quotation)">
                          <i class="bi bi-envelope me-2"></i>Enviar por email
                        </a></li>
                        <li><a class="dropdown-item" href="#" @click="downloadPDF(quotation)">
                          <i class="bi bi-file-pdf me-2"></i>Descargar PDF
                        </a></li>
                        <li v-if="quotation.status === 'sent'"><a class="dropdown-item text-success" href="#" @click="approveQuotation(quotation)">
                          <i class="bi bi-check-circle me-2"></i>Aprobar
                        </a></li>
                        <li v-if="quotation.status === 'approved'"><a class="dropdown-item text-primary" href="#" @click="convertToOrder(quotation)">
                          <i class="bi bi-arrow-right-circle me-2"></i>Convertir a orden
                        </a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger" href="#" @click="confirmDelete(quotation)">
                          <i class="bi bi-trash me-2"></i>Eliminar
                        </a></li>
                      </ul>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredQuotations.length === 0">
                  <td colspan="8" class="text-center py-4">
                    <div class="text-muted">
                      <i class="bi bi-search fs-4 d-block mb-2"></i>
                      No se encontraron cotizaciones con los filtros seleccionados
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="card-footer bg-white border-0 py-3">
          <div class="row align-items-center">
            <div class="col">
              <span class="text-muted">Mostrando {{ filteredQuotations.length }} de {{ quotations.length }} cotizaciones</span>
            </div>
            <div class="col-auto">
              <nav aria-label="Page navigation">
                <ul class="pagination pagination-sm mb-0">
                  <li class="page-item disabled">
                    <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Anterior</a>
                  </li>
                  <li class="page-item active"><a class="page-link" href="#">1</a></li>
                  <li class="page-item"><a class="page-link" href="#">2</a></li>
                  <li class="page-item"><a class="page-link" href="#">3</a></li>
                  <li class="page-item">
                    <a class="page-link" href="#">Siguiente</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal de confirmación de eliminación -->
      <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="deleteModalLabel">Confirmar eliminación</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" v-if="quotationToDelete">
              <p>¿Está seguro que desea eliminar la cotización <strong>{{ quotationToDelete.number }}</strong>?</p>
              <p class="text-danger mb-0">Esta acción no se puede deshacer.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-danger" @click="deleteQuotation">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal de detalles de cotización -->
      <div class="modal fade" id="viewModal" tabindex="-1" aria-labelledby="viewModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="viewModalLabel">Detalles de la cotización</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" v-if="selectedQuotation">
              <div class="row mb-4">
                <div class="col-md-6">
                  <h6 class="text-muted mb-3">Información general</h6>
                  <p class="mb-1"><strong>Número:</strong> {{ selectedQuotation.number }}</p>
                  <p class="mb-1"><strong>Referencia:</strong> {{ selectedQuotation.reference }}</p>
                  <p class="mb-1"><strong>Fecha:</strong> {{ formatDate(selectedQuotation.date) }}</p>
                  <p class="mb-1"><strong>Vencimiento:</strong> {{ formatDate(selectedQuotation.expirationDate) }}</p>
                  <p class="mb-1"><strong>Estado:</strong> 
                    <span :class="getStatusBadgeClass(selectedQuotation.status)">
                      {{ getStatusLabel(selectedQuotation.status) }}
                    </span>
                  </p>
                </div>
                <div class="col-md-6">
                  <h6 class="text-muted mb-3">Cliente</h6>
                  <p class="mb-1"><strong>Nombre:</strong> {{ selectedQuotation.customerName }}</p>
                  <p class="mb-1"><strong>Email:</strong> {{ selectedQuotation.customerEmail }}</p>
                  <p class="mb-1"><strong>Teléfono:</strong> {{ selectedQuotation.customerPhone }}</p>
                  <p class="mb-1"><strong>Dirección:</strong> {{ selectedQuotation.customerAddress }}</p>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <h6 class="text-muted mb-3">Productos cotizados</h6>
                  <div class="table-responsive">
                    <table class="table table-sm table-bordered">
                      <thead class="table-light">
                        <tr>
                          <th>Producto</th>
                          <th>Descripción</th>
                          <th>Cantidad</th>
                          <th>Precio unitario</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in selectedQuotation.items" :key="index">
                          <td>{{ item.product }}</td>
                          <td>{{ item.description }}</td>
                          <td>{{ item.quantity }}</td>
                          <td>{{ formatCurrency(item.unitPrice) }}</td>
                          <td>{{ formatCurrency(item.total) }}</td>
                        </tr>
                      </tbody>
                      <tfoot class="table-light">
                        <tr>
                          <td colspan="4" class="text-end"><strong>Subtotal:</strong></td>
                          <td><strong>{{ formatCurrency(selectedQuotation.subtotal) }}</strong></td>
                        </tr>
                        <tr>
                          <td colspan="4" class="text-end"><strong>IVA (19%):</strong></td>
                          <td><strong>{{ formatCurrency(selectedQuotation.tax) }}</strong></td>
                        </tr>
                        <tr>
                          <td colspan="4" class="text-end"><strong>Total:</strong></td>
                          <td><strong>{{ formatCurrency(selectedQuotation.total) }}</strong></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
              <div class="row mt-3" v-if="selectedQuotation.notes">
                <div class="col-12">
                  <h6 class="text-muted mb-2">Notas</h6>
                  <p class="mb-0">{{ selectedQuotation.notes }}</p>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button type="button" class="btn btn-outline-primary" @click="downloadPDF(selectedQuotation)">
                <i class="bi bi-file-pdf me-1"></i> Descargar PDF
              </button>
              <router-link :to="`/sales/quotations/edit/${selectedQuotation?.id}`" class="btn btn-primary">
                Editar cotización
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import DashboardLayout from '../../components/DashboardLayout.vue';
  
  export default {
    name: 'QuotationsView',
    components: {
      DashboardLayout
    },
    setup() {
      const searchTerm = ref('');
      const filterStatus = ref('');
      const filterDate = ref('');
      const selectedQuotations = ref([]);
      const selectAll = ref(false);
      const quotationToDelete = ref(null);
      const selectedQuotation = ref(null);
  
      // Datos de ejemplo
      const quotations = ref([
        {
          id: 1,
          number: 'COT-2023-0125',
          reference: 'Equipos de oficina',
          date: '2023-06-10',
          expirationDate: '2023-06-25',
          customerName: 'Empresa ABC',
          customerEmail: 'contacto@empresaabc.cl',
          customerPhone: '+56 9 1234 5678',
          customerAddress: 'Av. Principal 123, Santiago',
          status: 'sent',
          subtotal: 1050420,
          tax: 199580,
          total: 1250000,
          items: [
            { product: 'Escritorio ejecutivo', description: 'Escritorio de madera con cajones', quantity: 5, unitPrice: 150000, total: 750000 },
            { product: 'Silla ergonómica', description: 'Silla de oficina con soporte lumbar', quantity: 5, unitPrice: 80000, total: 400000 },
            { product: 'Lámpara LED', description: 'Lámpara de escritorio LED regulable', quantity: 5, unitPrice: 25000, total: 125000 }
          ],
          notes: 'Precios válidos por 15 días. Incluye instalación gratuita.'
        },
        {
          id: 2,
          number: 'COT-2023-0124',
          reference: 'Material de construcción',
          date: '2023-06-08',
          expirationDate: '2023-06-23',
          customerName: 'Constructora XYZ',
          customerEmail: 'ventas@constructoraxyz.cl',
          customerPhone: '+56 9 8765 4321',
          customerAddress: 'Calle Industrial 456, Concepción',
          status: 'approved',
          subtotal: 2100840,
          tax: 399160,
          total: 2500000,
          items: [
            { product: 'Cemento', description: 'Saco de cemento 25kg', quantity: 100, unitPrice: 8000, total: 800000 },
            { product: 'Fierro', description: 'Varilla de fierro 12mm', quantity: 50, unitPrice: 15000, total: 750000 },
            { product: 'Arena', description: 'Metro cúbico de arena', quantity: 20, unitPrice: 25000, total: 500000 },
            { product: 'Grava', description: 'Metro cúbico de grava', quantity: 15, unitPrice: 30000, total: 450000 }
          ],
          notes: 'Entrega en obra. Precios incluyen transporte.'
        },
        {
          id: 3,
          number: 'COT-2023-0123',
          reference: 'Equipos informáticos',
          date: '2023-06-05',
          expirationDate: '2023-06-20',
          customerName: 'Tecnología Avanzada',
          customerEmail: 'compras@tecavanzada.cl',
          customerPhone: '+56 9 2345 6789',
          customerAddress: 'Av. Tecnológica 789, Santiago',
          status: 'draft',
          subtotal: 1680672,
          tax: 319328,
          total: 2000000,
          items: [
            { product: 'Laptop Dell', description: 'Laptop Dell Inspiron 15', quantity: 10, unitPrice: 120000, total: 1200000 },
            { product: 'Monitor', description: 'Monitor LED 24 pulgadas', quantity: 10, unitPrice: 80000, total: 800000 }
          ],
          notes: 'Garantía de 2 años. Soporte técnico incluido.'
        },
        {
          id: 4,
          number: 'COT-2023-0122',
          reference: 'Mobiliario restaurante',
          date: '2023-06-02',
          expirationDate: '2023-06-17',
          customerName: 'Restaurante El Buen Sabor',
          customerEmail: 'info@elbuensabor.cl',
          customerPhone: '+56 9 3456 7890',
          customerAddress: 'Plaza Central 234, Valparaíso',
          status: 'rejected',
          subtotal: 840336,
          tax: 159664,
          total: 1000000,
          items: [
            { product: 'Mesa restaurante', description: 'Mesa de madera para 4 personas', quantity: 15, unitPrice: 40000, total: 600000 },
            { product: 'Silla restaurante', description: 'Silla de madera tapizada', quantity: 60, unitPrice: 8000, total: 480000 }
          ],
          notes: 'Diseño personalizado según especificaciones del cliente.'
        },
        {
          id: 5,
          number: 'COT-2023-0121',
          reference: 'Herramientas industriales',
          date: '2023-05-30',
          expirationDate: '2023-06-14',
          customerName: 'Industrias del Norte',
          customerEmail: 'compras@industriasnorte.cl',
          customerPhone: '+56 9 4567 8901',
          customerAddress: 'Zona Industrial 567, Antofagasta',
          status: 'expired',
          subtotal: 1260504,
          tax: 239496,
          total: 1500000,
          items: [
            { product: 'Taladro industrial', description: 'Taladro de columna 1HP', quantity: 3, unitPrice: 250000, total: 750000 },
            { product: 'Soldadora', description: 'Soldadora MIG 200A', quantity: 2, unitPrice: 180000, total: 360000 },
            { product: 'Compresor', description: 'Compresor de aire 100L', quantity: 1, unitPrice: 320000, total: 320000 }
          ],
          notes: 'Incluye capacitación en uso de equipos.'
        }
      ]);
  
      const filteredQuotations = computed(() => {
        return quotations.value.filter(quotation => {
          const matchesSearch = searchTerm.value === '' || 
            quotation.number.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
            quotation.customerName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
            quotation.reference.toLowerCase().includes(searchTerm.value.toLowerCase());
          
          const matchesStatus = filterStatus.value === '' || quotation.status === filterStatus.value;
          
          let matchesDate = true;
          if (filterDate.value) {
            const quotationDate = new Date(quotation.date);
            const today = new Date();
            
            switch (filterDate.value) {
              case 'today':
                matchesDate = quotationDate.toDateString() === today.toDateString();
                break;
              case 'week':
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                matchesDate = quotationDate >= weekAgo;
                break;
              case 'month':
                matchesDate = quotationDate.getMonth() === today.getMonth() && 
                             quotationDate.getFullYear() === today.getFullYear();
                break;
              case 'quarter':
                const currentQuarter = Math.floor(today.getMonth() / 3);
                const quotationQuarter = Math.floor(quotationDate.getMonth() / 3);
                matchesDate = quotationQuarter === currentQuarter && 
                             quotationDate.getFullYear() === today.getFullYear();
                break;
            }
          }
          
          return matchesSearch && matchesStatus && matchesDate;
        });
      });
  
      const toggleSelectAll = () => {
        if (selectAll.value) {
          selectedQuotations.value = filteredQuotations.value.map(quotation => quotation.id);
        } else {
          selectedQuotations.value = [];
        }
      };
  
      const confirmDelete = (quotation) => {
        quotationToDelete.value = quotation;
        const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
      };
  
      const deleteQuotation = () => {
        if (quotationToDelete.value) {
          quotations.value = quotations.value.filter(q => q.id !== quotationToDelete.value.id);
          selectedQuotations.value = selectedQuotations.value.filter(id => id !== quotationToDelete.value.id);
          const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
          modal.hide();
          quotationToDelete.value = null;
        }
      };
  
      const viewQuotation = (quotation) => {
        selectedQuotation.value = quotation;
        const modal = new bootstrap.Modal(document.getElementById('viewModal'));
        modal.show();
      };
  
      const duplicateQuotation = (quotation) => {
        const newQuotation = {
          ...quotation,
          id: Date.now(),
          number: `COT-2023-${String(quotations.value.length + 1).padStart(4, '0')}`,
          date: new Date().toISOString().split('T')[0],
          expirationDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'draft'
        };
        quotations.value.unshift(newQuotation);
      };
  
      const sendQuotation = (quotation) => {
        // Simular envío de cotización
        quotation.status = 'sent';
        alert(`Cotización ${quotation.number} enviada por email a ${quotation.customerEmail}`);
      };
  
      const approveQuotation = (quotation) => {
        quotation.status = 'approved';
        alert(`Cotización ${quotation.number} aprobada`);
      };
  
      const convertToOrder = (quotation) => {
        // Aquí se redirigiría a crear una orden de venta basada en la cotización
        alert(`Convirtiendo cotización ${quotation.number} a orden de venta...`);
      };
  
      const downloadPDF = (quotation) => {
        // Simular descarga de PDF
        alert(`Descargando PDF de cotización ${quotation.number}...`);
      };
  
      const formatCurrency = (value) => {
        if (value === undefined || value === null) return '$0';
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
      };
  
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-CL').format(date);
      };
  
      const getStatusLabel = (status) => {
        const labels = {
          draft: 'Borrador',
          sent: 'Enviada',
          approved: 'Aprobada',
          rejected: 'Rechazada',
          expired: 'Vencida'
        };
        return labels[status] || status;
      };
  
      const getStatusBadgeClass = (status) => {
        switch (status) {
          case 'draft': return 'badge bg-secondary';
          case 'sent': return 'badge bg-primary';
          case 'approved': return 'badge bg-success';
          case 'rejected': return 'badge bg-danger';
          case 'expired': return 'badge bg-warning text-dark';
          default: return 'badge bg-secondary';
        }
      };
  
      const getExpirationClass = (expirationDate) => {
        const today = new Date();
        const expDate = new Date(expirationDate);
        const diffTime = expDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'text-danger';
        if (diffDays <= 3) return 'text-warning';
        return '';
      };
  
      onMounted(() => {
        // Inicializar modales de Bootstrap si es necesario
      });
  
      return {
        searchTerm,
        filterStatus,
        filterDate,
        quotations,
        filteredQuotations,
        selectedQuotations,
        selectAll,
        quotationToDelete,
        selectedQuotation,
        toggleSelectAll,
        confirmDelete,
        deleteQuotation,
        viewQuotation,
        duplicateQuotation,
        sendQuotation,
        approveQuotation,
        convertToOrder,
        downloadPDF,
        formatCurrency,
        formatDate,
        getStatusLabel,
        getStatusBadgeClass,
        getExpirationClass
      };
    }
  };
  </script>
  