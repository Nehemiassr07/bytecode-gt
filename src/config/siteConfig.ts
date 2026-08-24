export interface SiteConfig {
  nombreEmpresa: string
  eslogan: string
  colores: {
    primario: string // Azul Eléctrico
    fondoSidebar: string
  }
  metricasKPI: Array<{
    titulo: string
    valor: string
    cambio: string
    esPositivo: boolean
    icono: string
  }>
  proyectosActivos: Array<{
    id: string
    nombreProyecto: string
    cliente: string
    progreso: number
    estado: 'En Progreso' | 'En Revisión' | 'Completado'
    fechaEntrega: string
  }>
}

export const siteConfig: SiteConfig = {
  nombreEmpresa: "Pulse OS",
  eslogan: "Gestión de Proyectos & Flujos de Trabajo",
  colores: {
    primario: "#3B82F6",
    fondoSidebar: "#0B0F19"
  },
  metricasKPI: [
    { titulo: "Proyectos Activos", valor: "14", cambio: "+3 este mes", esPositivo: true, icono: "📁" },
    { titulo: "Tareas Completadas", valor: "184", cambio: "+24%", esPositivo: true, icono: "✅" },
    { titulo: "Entregables Pendientes", valor: "8", cambio: "-2", esPositivo: true, icono: "⏳" },
    { titulo: "Satisfacción Cliente", valor: "98.5%", cambio: "+1.2%", esPositivo: true, icono: "⭐" }
  ],
  proyectosActivos: [
    { id: "PRJ-101", nombreProyecto: "Rediseño de Portal Web", cliente: "Corporación Alfa", progreso: 85, estado: "En Revisión", fechaEntrega: "28 Aug" },
    { id: "PRJ-102", nombreProyecto: "Campamento Digital Q3", cliente: "Grupo Inmobiliario", progreso: 45, estado: "En Progreso", fechaEntrega: "10 Sep" },
    { id: "PRJ-103", nombreProyecto: "Implementación de CRM", cliente: "Logística Central", progreso: 100, estado: "Completado", fechaEntrega: "Ayer" },
    { id: "PRJ-104", nombreProyecto: "Auditoría de Seguridad", cliente: "Fintech Guatemala", progreso: 20, estado: "En Progreso", fechaEntrega: "25 Sep" }
  ]
}