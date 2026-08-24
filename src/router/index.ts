import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import ClientesView from '../views/ClientesView.vue'
import ReportesView from '../views/ReportesView.vue'
import PortalClienteView from '../views/PortalClienteView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardView },
    { path: '/clientes', name: 'clientes', component: ClientesView },
    { path: '/reportes', name: 'reportes', component: ReportesView },
    { path: '/portal-cliente', name: 'portal-cliente', component: PortalClienteView }
  ]
})

export default router