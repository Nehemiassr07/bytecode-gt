<script setup lang="ts">
import { ref } from 'vue'

const metricasKPI = ref([
  { titulo: 'Ventas del Mes', valor: 'Q18,450.00', cambio: '+12%', esPositivo: true, icono: '💰' },
  { titulo: 'Órdenes Activas', valor: '8', cambio: '+3', esPositivo: true, icono: '📦' },
  { titulo: 'Clientes Nuevos', valor: '24', cambio: '+18%', esPositivo: true, icono: '👥' }
])

const proyectosActivos = ref([
  { id: 'PRJ-001', nombreProyecto: 'Instalación Cámaras CCTV', cliente: 'Farmacia Local', progreso: 85, estado: 'En Progreso', fechaEntrega: '28/08/2026' },
  { id: 'PRJ-002', nombreProyecto: 'Red Cableado Estructurado', cliente: 'Oficina Central', progreso: 100, estado: 'Completado', fechaEntrega: '20/08/2026' },
  { id: 'PRJ-003', nombreProyecto: 'Mantenimiento de Laptops', cliente: 'Colegio Privado', progreso: 40, estado: 'En Revisión', fechaEntrega: '02/09/2026' }
])
</script>

<template>
  <div class="dashboard-layout">
    <h1 class="page-title">Resumen de Operaciones</h1>
    
    <!-- Tarjetas KPI -->
    <div class="kpi-grid">
      <div v-for="(kpi, i) in metricasKPI" :key="i" class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">{{ kpi.titulo }}</span>
          <span class="kpi-icon">{{ kpi.icono }}</span>
        </div>
        <div class="kpi-body">
          <span class="kpi-value">{{ kpi.valor }}</span>
          <span class="kpi-badge" :class="{ positivo: kpi.esPositivo }">
            {{ kpi.cambio }}
          </span>
        </div>
      </div>
    </div>

    <!-- Tabla de Proyectos con Barras de Progreso -->
    <div class="section-card">
      <h2>Proyectos en Desarrollo</h2>
      
      <!-- Contenedor con Scroll Horizontal para Móvil -->
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Proyecto</th>
              <th>Cliente</th>
              <th>Progreso</th>
              <th>Estado</th>
              <th>Entrega</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prj in proyectosActivos" :key="prj.id">
              <td class="id-col">{{ prj.id }}</td>
              <td><strong>{{ prj.nombreProyecto }}</strong></td>
              <td>{{ prj.cliente }}</td>
              <td class="progress-col">
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" :style="{ width: prj.progreso + '%' }"></div>
                </div>
                <small>{{ prj.progreso }}%</small>
              </td>
              <td>
                <span class="status-badge" :class="prj.estado.toLowerCase().replace(' ', '-')">
                  {{ prj.estado }}
                </span>
              </td>
              <td class="fecha-col">{{ prj.fechaEntrega }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-layout { padding: 2rem 1rem; max-width: 1200px; margin: 0 auto; }
.page-title { font-size: 1.35rem; margin-bottom: 1.25rem; color: #FFF; }
.kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
.kpi-card { background-color: #0B0F19; border: 1px solid #1E293B; border-radius: 12px; padding: 1rem; }
.kpi-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: #94A3B8; font-size: 0.78rem; }
.kpi-value { font-size: 1.35rem; font-weight: 800; color: #FFF; }
.kpi-body { display: flex; justify-content: space-between; align-items: baseline; }
.kpi-badge { font-size: 0.7rem; font-weight: 700; padding: 0.15rem 0.4rem; border-radius: 4px; }
.kpi-badge.positivo { background-color: rgba(59, 130, 246, 0.15); color: #60A5FA; }

.section-card { background-color: #0B0F19; border: 1px solid #1E293B; border-radius: 12px; padding: 1.25rem; }
.section-card h2 { font-size: 1.05rem; margin-bottom: 1rem; color: #FFF; }

.table-responsive {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.data-table {
  width: 100%;
  min-width: 580px;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.85rem;
}

.data-table th { padding: 0.75rem; border-bottom: 1px solid #1E293B; color: #64748B; font-weight: 600; }
.data-table td { padding: 0.85rem 0.75rem; border-bottom: 1px solid #1E293B; color: #CBD5E1; }
.id-col { color: var(--color-primario, #3B82F6); font-weight: 700; }
.fecha-col { color: #64748B; font-size: 0.78rem; }

.progress-col { display: flex; align-items: center; gap: 0.5rem; min-width: 120px; }
.progress-bar-bg { background-color: #1E293B; height: 8px; border-radius: 4px; flex-grow: 1; overflow: hidden; }
.progress-bar-fill { background-color: var(--color-primario, #3B82F6); height: 100%; border-radius: 4px; }

.status-badge { padding: 0.2rem 0.55rem; border-radius: 12px; font-size: 0.72rem; font-weight: 700; white-space: nowrap; }
.status-badge.completado { background-color: rgba(16, 185, 129, 0.15); color: #10B981; }
.status-badge.en-progreso { background-color: rgba(59, 130, 246, 0.15); color: #60A5FA; }
.status-badge.en-revisión { background-color: rgba(245, 158, 11, 0.15); color: #F59E0B; }
</style>