<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { siteConfig } from './config/siteConfig'

const $route = useRoute()
</script>

<template>
  <!-- Banner flotante Demo -->
  <div class="demo-banner">
    <div class="demo-content">
      <span>👁️ Vista Previa: Plan <strong>Custom System</strong></span>
      
      <div class="demo-actions">
        <a href="https://www.kerubixstudio.online#planes" class="demo-back-btn">
          ← Ver otros planes
        </a>
        <a href="https://www.kerubixstudio.online#cotizador" class="demo-cta-btn">
          ⚡ Solicitar Sistema
        </a>
      </div>
    </div>
  </div>

  <div class="dashboard-layout" :style="{ '--color-primario': siteConfig.colores.primario }">
    <!-- Sidebar Lateral -->
    <aside class="sidebar">
      <div class="brand-box">
        <span class="brand-logo">⚡</span>
        <div>
          <h2>{{ siteConfig.nombreEmpresa }}</h2>
          <small>Panel de Control</small>
        </div>
      </div>

      <nav class="sidebar-nav">
        <RouterLink to="/" class="nav-item">📊 Dashboard</RouterLink>
        <RouterLink to="/clientes" class="nav-item">👥 Clientes & Pedidos</RouterLink>
        <RouterLink to="/reportes" class="nav-item">📈 Analíticas</RouterLink>
        <RouterLink to="/portal-cliente" class="nav-item">👤 Portal del Cliente</RouterLink>
      </nav>

      <div class="user-badge">
        <div class="avatar">{{ $route.path === '/portal-cliente' ? 'USER' : 'ADMIN' }}</div>
        <div class="user-info">
          <p>{{ $route.path === '/portal-cliente' ? 'Carlos Gómez' : 'Demo Admin' }}</p>
          <small>{{ $route.path === '/portal-cliente' ? 'carlos@cliente.demo' : 'admin@nexus.demo' }}</small>
        </div>
      </div>
    </aside>

    <!-- Contenido Principal -->
    <div class="main-wrapper">
      <header class="topbar">
        <h3>{{ $route.path === '/portal-cliente' ? 'Portal del Cliente' : 'Panel Administrativo' }}</h3>
        
        <div class="topbar-actions">
          <RouterLink to="/portal-cliente" class="btn-toggle-view" v-if="$route.path !== '/portal-cliente'">
            👤 Vista Cliente
          </RouterLink>
          <RouterLink to="/" class="btn-toggle-view admin-mode" v-else>
            ⚙️ Modo Admin
          </RouterLink>

          <span class="status-indicator">🟢 En Línea</span>
        </div>
      </header>

      <main class="content-body">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background-color: #070A13;
  color: #F8FAFC;
  font-family: system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
}

.demo-banner {
  background-color: #111827;
  border-bottom: 1px solid var(--color-primario, #3B82F6);
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.demo-content {
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.demo-content strong { color: var(--color-primario, #3B82F6); }

.demo-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.demo-back-btn {
  color: #94A3B8;
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 600;
}

.demo-cta-btn {
  background-color: var(--color-primario, #3B82F6);
  color: #FFF;
  font-weight: 700;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.75rem;
  white-space: nowrap;
}

.dashboard-layout {
  display: flex;
  min-height: calc(100vh - 40px);
}

.sidebar {
  width: 250px;
  background-color: #0B0F19;
  border-right: 1px solid #1E293B;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.brand-box { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
.brand-logo { font-size: 1.6rem; }
.brand-box h2 { font-size: 1.1rem; color: var(--color-primario, #3B82F6); }
.brand-box small { color: #64748B; font-size: 0.72rem; }

.sidebar-nav { display: flex; flex-direction: column; gap: 0.4rem; flex-grow: 1; }
.nav-item { color: #94A3B8; padding: 0.65rem 0.85rem; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.85rem; transition: all 0.2s; }
.nav-item.router-link-active, .nav-item:hover { background-color: rgba(59, 130, 246, 0.1); color: var(--color-primario, #3B82F6); }

.user-badge { display: flex; align-items: center; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid #1E293B; }
.avatar { background-color: var(--color-primario, #3B82F6); color: #FFF; font-weight: 800; font-size: 0.6rem; padding: 0.4rem 0.5rem; border-radius: 50%; }
.user-info p { font-size: 0.8rem; font-weight: 700; color: #FFF; }
.user-info small { color: #64748B; font-size: 0.7rem; }

.main-wrapper { flex-grow: 1; display: flex; flex-direction: column; min-width: 0; }
.topbar { background-color: #0B0F19; border-bottom: 1px solid #1E293B; padding: 0.85rem 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; }
.topbar h3 { font-size: 1rem; color: #FFF; }

.topbar-actions { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
.btn-toggle-view { background-color: rgba(59, 130, 246, 0.15); color: #60A5FA; border: 1px solid #3B82F6; padding: 0.35rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700; text-decoration: none; transition: all 0.2s; }
.btn-toggle-view:hover { background-color: #3B82F6; color: #FFF; }
.btn-toggle-view.admin-mode { background-color: rgba(245, 158, 11, 0.15); color: #F59E0B; border-color: #F59E0B; }
.status-indicator { font-size: 0.75rem; color: #10B981; }

.content-body { padding: 1.25rem; background-color: #070A13; flex-grow: 1; min-width: 0; }

@media (max-width: 768px) {
  .dashboard-layout { flex-direction: column; }
  .sidebar { width: 100%; border-right: none; border-bottom: 1px solid #1E293B; padding: 0.85rem 1rem; }
  .brand-box { margin-bottom: 0.75rem; }
  .sidebar-nav { flex-direction: row; overflow-x: auto; padding-bottom: 0.25rem; -webkit-overflow-scrolling: touch; }
  .nav-item { white-space: nowrap; font-size: 0.8rem; padding: 0.5rem 0.75rem; }
  .user-badge { display: none; }
  .content-body { padding: 1rem 0.75rem; }
}
</style>