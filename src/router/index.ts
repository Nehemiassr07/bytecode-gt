import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'tienda',
      component: () => import('../views/TiendaView.vue') // Catálogo General & Carrito
    },
    {
      path: '/rastreo',
      name: 'rastreo',
      component: () => import('../views/RastreoView.vue') // Módulo de Tracking de Órdenes
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue') // Panel Administrativo (CRUD & Órdenes)
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router