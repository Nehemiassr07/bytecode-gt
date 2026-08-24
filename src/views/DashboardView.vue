<script setup lang="ts">
import { siteConfig } from '../config/siteConfig'
</script>

<template>
  <div>
    <h1 class="page-title">Resumen de Operaciones</h1>
    
    <!-- Tarjetas KPI -->
    <div class="kpi-grid">
      <div v-for="(kpi, i) in siteConfig.metricasKPI" :key="i" class="kpi-card">
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
          <tr v-for="prj in siteConfig.proyectosActivos" :key="prj.id">
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
</template>

<style scoped>
.page-title { font-size: 1.5rem; margin-bottom: 1.5rem; color: #FFF; }
.kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 2rem; }
.kpi-card { background-color: #0B0F19; border: 1px solid #1E293B; border-radius: 12px; padding: 1.25rem; }
.kpi-header { display: flex; justify-content: space-between; margin-bottom: 0.75rem; color: #94A3B8; font-size: 0.85rem; }
.kpi-value { font-size: 1.6rem; font-weight: 800; color: #FFF; }
.kpi-body { display: flex; justify-content: space-between; align-items: baseline; }
.kpi-badge { font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 4px; }
.kpi-badge.positivo { background-color: rgba(59, 130, 246, 0.15); color: #60A5FA; }

.section-card { background-color: #0B0F19; border: 1px solid #1E293B; border-radius: 12px; padding: 1.5rem; }
.section-card h2 { font-size: 1.1rem; margin-bottom: 1rem; color: #FFF; }
.data-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; }
.data-table th { padding: 0.75rem; border-bottom: 1px solid #1E293B; color: #64748B; font-weight: 600; }
.data-table td { padding: 0.85rem 0.75rem; border-bottom: 1px solid #1E293B; color: #CBD5E1; }
.id-col { color: var(--color-primario, #3B82F6); font-weight: 700; }
.fecha-col { color: #64748B; font-size: 0.8rem; }

.progress-col { display: flex; align-items: center; gap: 0.75rem; }
.progress-bar-bg { background-color: #1E293B; height: 8px; border-radius: 4px; flex-grow: 1; overflow: hidden; }
.progress-bar-fill { background-color: var(--color-primario, #3B82F6); height: 100%; border-radius: 4px; }

.status-badge { padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.75rem; font-weight: 700; }
.status-badge.completado { background-color: rgba(16, 185, 129, 0.15); color: #10B981; }
.status-badge.en-progreso { background-color: rgba(59, 130, 246, 0.15); color: #60A5FA; }
.status-badge.en-revisión { background-color: rgba(245, 158, 11, 0.15); color: #F59E0B; }
</style>