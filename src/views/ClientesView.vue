<template>
  <div class="card-box">
    <h1>Gestión de Clientes & Permisos</h1>
    <p>Este módulo permite administrar roles de usuarios, permisos y estados de cuenta en tiempo real.</p>
    <div class="fake-action-bar">
      <input type="text" placeholder="🔍 Buscar por nombre o ID..." class="search-input" />
      <button class="btn-add">+ Nuevo Cliente</button>
    </div>
  </div>
</template>

<style scoped>
.card-box { background-color: #0B0F19; border: 1px solid #1E293B; padding: 2rem; border-radius: 12px; }
h1 { font-size: 1.5rem; color: #FFF; margin-bottom: 0.5rem; }
p { color: #94A3B8; margin-bottom: 1.5rem; }
.fake-action-bar { display: flex; gap: 1rem; }
.search-input { background: #070A13; border: 1px solid #1E293B; color: #FFF; padding: 0.75rem 1rem; border-radius: 8px; flex-grow: 1; }
.btn-add { background: var(--color-primario, #F59E0B); color: #070A13; font-weight: 700; border: none; padding: 0.75rem 1.25rem; border-radius: 8px; cursor: pointer; }
</style>