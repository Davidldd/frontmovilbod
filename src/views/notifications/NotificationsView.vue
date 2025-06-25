<template>
    <DashboardLayout>
    <div class="notifications-view p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="h4">Todas las Notificaciones</h2>
        <button 
          v-if="allNotifications.length > 0" 
          class="btn btn-sm btn-outline-primary"
          @click="clearAllNotifications"
        >
          <i class="bi bi-trash me-1"></i> Limpiar Todas
        </button>
      </div>
  
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-2">Cargando notificaciones...</p>
      </div>
  
      <div v-else-if="allNotifications.length === 0" class="text-center py-5">
        <i class="bi bi-bell-slash display-1 text-muted mb-3"></i>
        <h3 class="h5">No hay notificaciones</h3>
        <p class="text-muted">Parece que todo está tranquilo por aquí.</p>
      </div>
  
      <div v-else class="list-group">
        <div 
          v-for="notification in allNotifications" 
          :key="notification.id" 
          class="list-group-item list-group-item-action notification-list-item"
          :class="`notification-item-${notification.type}`"
        >
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1 notification-title">
              <i :class="getNotificationIcon(notification.type)" class="me-2"></i>
              {{ notification.title }}
            </h5>
            <small class="text-muted">{{ notification.time }}</small>
          </div>
          <p class="mb-1 notification-message">{{ notification.message }}</p>
          <small class="text-muted">ID: {{ notification.id }}</small>
        </div>
      </div>
    </div>
</DashboardLayout>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import DashboardLayout from '../../components/DashboardLayout.vue';
  // En una aplicación real, importarías tu store de notificaciones
  // import { useNotificationStore } from '@/stores/notificationStore';
  
  // Datos de ejemplo, simula un store o API
  const exampleNotifications = ref([
    { id: 1, type: 'success', title: 'Reporte Generado', message: 'El reporte de ventas mensual ha sido generado exitosamente.', time: 'Hace 5 min' },
    { id: 2, type: 'info', title: 'Orden Despachada', message: 'La orden #OV-0025 ha sido despachada exitosamente.', time: 'Hace 1 hora' },
    { id: 3, type: 'warning', title: 'Stock Bajo', message: 'El producto "Laptop Dell" tiene stock bajo (5 unidades).', time: 'Hace 2 horas' },
    { id: 4, type: 'error', title: 'Error de Sincronización', message: 'No se pudo sincronizar con el servidor externo.', time: 'Hace 3 horas' },
    { id: 5, type: 'info', title: 'Nuevo Lead Asignado', message: 'Se te ha asignado un nuevo lead: "Empresa XYZ".', time: 'Ayer' },
    { id: 6, type: 'success', title: 'Pago Recibido', message: 'Se recibió el pago para la factura #FAC-0012.', time: 'Ayer' },
  ]);
  
  const isLoading = ref(true);
  const allNotifications = ref([]);
  
  // const notificationStore = useNotificationStore(); // Si tuvieras un store
  
  onMounted(async () => {
    // Simular carga de notificaciones
    // allNotifications.value = await notificationStore.fetchAllNotifications();
    setTimeout(() => {
      allNotifications.value = [...exampleNotifications.value].sort((a, b) => new Date(b.time) - new Date(a.time)); // Simular orden por tiempo
      isLoading.value = false;
    }, 1000);
  });
  
  const getNotificationIcon = (type) => {
    const icons = {
      success: 'bi bi-check-circle-fill',
      warning: 'bi bi-exclamation-triangle-fill',
      error: 'bi bi-x-circle-fill',
      info: 'bi bi-info-circle-fill'
    };
    return icons[type] || 'bi bi-bell-fill';
  };
  
  const clearAllNotifications = () => {
    // Lógica para limpiar todas las notificaciones
    // await notificationStore.clearAll();
    allNotifications.value = [];
    exampleNotifications.value = []; // Limpiar también los datos de ejemplo
    console.log('Todas las notificaciones limpiadas');
  };
  </script>
  
  <style scoped>
  .notifications-view {
    max-width: 900px;
    margin: 0 auto;
  }
  
  .notification-list-item {
    border-left-width: 4px;
    border-left-style: solid;
    margin-bottom: 0.5rem;
    border-radius: 0.375rem;
  }
  
  .notification-item-success {
    border-left-color: var(--bs-success);
  }
  .notification-item-info {
    border-left-color: var(--bs-info);
  }
  .notification-item-warning {
    border-left-color: var(--bs-warning);
  }
  .notification-item-error {
    border-left-color: var(--bs-danger);
  }
  
  .notification-title {
    font-size: 1rem;
    font-weight: 500;
  }
  .notification-message {
    font-size: 0.9rem;
    color: var(--bs-gray-700);
  }
  
  .dark-theme .notification-message {
    color: var(--bs-gray-400);
  }
  
  .dark-theme .list-group-item {
    background-color: var(--bs-gray-800);
    border-color: var(--bs-gray-700);
  }
  
  .dark-theme .list-group-item .text-muted {
     color: var(--bs-gray-500) !important;
  }
  </style>
  