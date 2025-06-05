<template>
  <DashboardLayout>
    <div class="crm-dashboard">
      <!-- Header -->
      <div class="dashboard-header mb-4">
        <h1 class="h3 mb-0">Dashboard CRM</h1>
        <p class="text-muted">Gestión de relaciones con clientes</p>
      </div>

      <!-- Stats Cards -->
      <div class="row g-4 mb-4">
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="stats-card">
            <div class="stats-icon bg-primary">
              <i class="bi bi-people"></i>
            </div>
            <div class="stats-content">
              <h3>{{ crmStats.totalContacts }}</h3>
              <p>Contactos Totales</p>
              <span class="stats-change positive">+15.2%</span>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-lg-3">
          <div class="stats-card">
            <div class="stats-icon bg-success">
              <i class="bi bi-person-plus"></i>
            </div>
            <div class="stats-content">
              <h3>{{ crmStats.newLeads }}</h3>
              <p>Nuevos Leads</p>
              <span class="stats-change positive">+8.5%</span>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-lg-3">
          <div class="stats-card">
            <div class="stats-icon bg-warning">
              <i class="bi bi-bullseye"></i>
            </div>
            <div class="stats-content">
              <h3>{{ crmStats.activeOpportunities }}</h3>
              <p>Oportunidades Activas</p>
              <span class="stats-change positive">+12.3%</span>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-lg-3">
          <div class="stats-card">
            <div class="stats-icon bg-info">
              <i class="bi bi-currency-dollar"></i>
            </div>
            <div class="stats-content">
              <h3>${{ crmStats.pipelineValue.toLocaleString() }}</h3>
              <p>Valor del Pipeline</p>
              <span class="stats-change positive">+22.1%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="row g-4">
        <!-- Sales Pipeline -->
        <div class="col-12 col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="card-title mb-0">Pipeline de Ventas</h5>
                <button class="btn btn-sm btn-outline-primary">
                  <i class="bi bi-plus-lg me-1"></i>Nueva Oportunidad
                </button>
              </div>
              
              <div class="pipeline-stages">
                <div v-for="stage in pipelineStages" :key="stage.id" class="pipeline-stage">
                  <div class="stage-header">
                    <h6>{{ stage.name }}</h6>
                    <span class="stage-count">{{ stage.opportunities.length }}</span>
                  </div>
                  <div class="stage-content">
                    <div v-for="opportunity in stage.opportunities" :key="opportunity.id" class="opportunity-card">
                      <div class="opportunity-header">
                        <h6>{{ opportunity.title }}</h6>
                        <span class="opportunity-value">${{ opportunity.value.toLocaleString() }}</span>
                      </div>
                      <p class="opportunity-company">{{ opportunity.company }}</p>
                      <div class="opportunity-footer">
                        <span class="opportunity-date">{{ opportunity.date }}</span>
                        <span class="opportunity-probability">{{ opportunity.probability }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activities -->
        <div class="col-12 col-lg-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h5 class="card-title mb-4">Actividades Recientes</h5>
              <div class="activity-list">
                <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
                  <div class="activity-icon" :class="`text-${activity.color}`">
                    <i class="bi" :class="activity.icon"></i>
                  </div>
                  <div class="activity-content">
                    <p class="activity-description">{{ activity.description }}</p>
                    <small class="activity-time">{{ activity.time }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="row g-4 mt-4">
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h5 class="card-title mb-4">Acciones Rápidas</h5>
              <div class="row g-3">
                <div class="col-6 col-md-3">
                  <router-link to="/crm/contacts/new" class="quick-action-card">
                    <div class="quick-action-icon bg-primary">
                      <i class="bi bi-person-plus"></i>
                    </div>
                    <span>Nuevo Contacto</span>
                  </router-link>
                </div>
                <div class="col-6 col-md-3">
                  <router-link to="/crm/companies/new" class="quick-action-card">
                    <div class="quick-action-icon bg-success">
                      <i class="bi bi-building-add"></i>
                    </div>
                    <span>Nueva Empresa</span>
                  </router-link>
                </div>
                <div class="col-6 col-md-3">
                  <router-link to="/crm/leads/new" class="quick-action-card">
                    <div class="quick-action-icon bg-warning">
                      <i class="bi bi-person-plus-fill"></i>
                    </div>
                    <span>Nuevo Lead</span>
                  </router-link>
                </div>
                <div class="col-6 col-md-3">
                  <router-link to="/crm/opportunities/new" class="quick-action-card">
                    <div class="quick-action-icon bg-info">
                      <i class="bi bi-bullseye"></i>
                    </div>
                    <span>Nueva Oportunidad</span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue'
import DashboardLayout from '../../components/DashboardLayout.vue'

const crmStats = ref({
  totalContacts: 1250,
  newLeads: 85,
  activeOpportunities: 42,
  pipelineValue: 485000
})

const pipelineStages = ref([
  {
    id: 1,
    name: 'Prospecto',
    opportunities: [
      { id: 1, title: 'Proyecto ABC Corp', company: 'ABC Corp', value: 25000, date: '2024-02-20', probability: 20 },
      { id: 2, title: 'Sistema XYZ Ltd', company: 'XYZ Ltd', value: 15000, date: '2024-02-18', probability: 15 }
    ]
  },
  {
    id: 2,
    name: 'Calificado',
    opportunities: [
      { id: 3, title: 'Consultoría DEF Inc', company: 'DEF Inc', value: 35000, date: '2024-02-15', probability: 40 },
      { id: 4, title: 'Desarrollo GHI Co', company: 'GHI Co', value: 45000, date: '2024-02-12', probability: 45 }
    ]
  },
  {
    id: 3,
    name: 'Propuesta',
    opportunities: [
      { id: 5, title: 'Integración JKL SA', company: 'JKL SA', value: 65000, date: '2024-02-10', probability: 70 }
    ]
  },
  {
    id: 4,
    name: 'Negociación',
    opportunities: [
      { id: 6, title: 'Migración MNO Ltd', company: 'MNO Ltd', value: 85000, date: '2024-02-08', probability: 85 }
    ]
  }
])

const recentActivities = ref([
  { id: 1, description: 'Llamada con ABC Corp programada', time: 'Hace 10 min', icon: 'bi-telephone', color: 'primary' },
  { id: 2, description: 'Nuevo lead desde formulario web', time: 'Hace 25 min', icon: 'bi-person-plus', color: 'success' },
  { id: 3, description: 'Propuesta enviada a DEF Inc', time: 'Hace 1 hora', icon: 'bi-file-text', color: 'warning' },
  { id: 4, description: 'Reunión completada con GHI Co', time: 'Hace 2 horas', icon: 'bi-calendar-check', color: 'info' }
])
</script>

<style scoped>
.crm-dashboard {
  padding: 0;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.stats-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
}

.stats-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.stats-content h3 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
}

.stats-content p {
  margin: 0;
  color: #718096;
  font-size: 0.875rem;
}

.stats-change {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
}

.stats-change.positive {
  background: #c6f6d5;
  color: #22543d;
}

.pipeline-stages {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
}

.pipeline-stage {
  min-width: 280px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
}

.stage-header {
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1rem;
}

.stage-header h6 {
  margin: 0;
  color: #2d3748;
}

.stage-count {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.stage-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.opportunity-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.opportunity-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.opportunity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.opportunity-header h6 {
  margin: 0;
  font-size: 0.875rem;
  color: #2d3748;
}

.opportunity-value {
  font-weight: 600;
  color: #667eea;
  font-size: 0.875rem;
}

.opportunity-company {
  margin: 0;
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 0.75rem;
}

.opportunity-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.opportunity-date,
.opportunity-probability {
  font-size: 0.75rem;
  color: #a0aec0;
}

.opportunity-probability {
  background: #e2e8f0;
  padding: 0.125rem 0.375rem;
  border-radius: 10px;
  font-weight: 600;
}

.activity-list {
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f7fafc;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  background: #f7fafc;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-description {
  margin: 0;
  font-size: 0.875rem;
  color: #2d3748;
}

.activity-time {
  color: #718096;
  font-size: 0.75rem;
}

.quick-action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  text-decoration: none;
  color: #2d3748;
  transition: all 0.2s ease;
}

.quick-action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: #2d3748;
}

.quick-action-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

@media (max-width: 768px) {
  .pipeline-stages {
    flex-direction: column;
  }
  
  .pipeline-stage {
    min-width: auto;
  }
  
  .stats-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>
