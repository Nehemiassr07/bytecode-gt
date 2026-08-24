<script setup lang="ts">
// Dejar el script vacío si no requerimos variables locales
</script>

<template>
  <div class="client-portal">
    <div class="welcome-card">
      <div class="user-greeting">
        <h1>¡Hola, Carlos Gómez! 👋</h1>
        <p>Estado de tu proyecto: <strong>Rediseño de Portal Web</strong></p>
      </div>
      <span class="plan-badge">Fase Final: 85% Completado</span>
    </div>

    <!-- Avance del Proyecto del Cliente -->
    <div class="card-section">
      <h2>Entregables & Módulos</h2>
      <div class="deliverable-list">
        <div class="deliverable-item">
          <div class="item-info">
            <span class="check-icon">✅</span>
            <div>
              <strong>Diseño de Prototipo en Figma</strong>
              <small>Aprobado por el cliente</small>
            </div>
          </div>
          <span class="tag-done">Completado</span>
        </div>

        <div class="deliverable-item">
          <div class="item-info">
            <span class="check-icon">✅</span>
            <div>
              <strong>Desarrollo Frontend & Interfaz</strong>
              <small>Desplegado en servidor de pruebas</small>
            </div>
          </div>
          <span class="tag-done">Completado</span>
        </div>

        <div class="deliverable-item">
          <div class="item-info">
            <span class="check-icon pending">⏳</span>
            <div>
              <strong>Pruebas de Rendimiento & SEO</strong>
              <small>En proceso de revisión final</small>
            </div>
          </div>
          <span class="tag-review">En Revisión</span>
        </div>
      </div>
    </div>

    <!-- Archivos Adjuntos / Entregables para descargar -->
    <div class="card-section">
      <h2>Archivos & Documentación del Proyecto</h2>
      <div class="file-grid">
        <div class="file-card">
          <span class="file-icon">📄</span>
          <div class="file-details">
            <strong>Manual de Marca.pdf</strong>
            <small>2.4 MB</small>
          </div>
          <button class="btn-dl">Descargar</button>
        </div>

        <div class="file-card">
          <span class="file-icon">🎨</span>
          <div class="file-details">
            <strong>Logotipos_Exportados.zip</strong>
            <small>15.8 MB</small>
          </div>
          <button class="btn-dl">Descargar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.client-portal { display: flex; flex-direction: column; gap: 1.5rem; }
.welcome-card {
  background: linear-gradient(135deg, #0B0F19 0%, #111827 100%);
  border: 1px solid var(--color-primario, #3B82F6);
  border-radius: 14px;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}
.user-greeting h1 { font-size: 1.5rem; color: #FFF; margin-bottom: 0.4rem; }
.user-greeting p { color: #CBD5E1; font-size: 0.95rem; }
.user-greeting strong { color: var(--color-primario, #3B82F6); }
.plan-badge { background: rgba(59, 130, 246, 0.15); color: #60A5FA; border: 1px solid #3B82F6; padding: 0.4rem 1rem; border-radius: 20px; font-weight: 700; font-size: 0.85rem; }

.card-section { background: #0B0F19; border: 1px solid #1E293B; border-radius: 12px; padding: 1.5rem; }
.card-section h2 { color: #FFF; font-size: 1.1rem; margin-bottom: 1rem; }

.deliverable-list { display: flex; flex-direction: column; gap: 0.75rem; }
.deliverable-item { background: #070A13; border: 1px solid #1E293B; border-radius: 8px; padding: 1rem; display: flex; justify-content: space-between; align-items: center; }
.item-info { display: flex; align-items: center; gap: 0.8rem; }
.item-info strong { display: block; color: #FFF; font-size: 0.9rem; }
.item-info small { color: #64748B; font-size: 0.78rem; }
.check-icon { font-size: 1.2rem; }

.tag-done { background: rgba(16, 185, 129, 0.15); color: #10B981; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700; }
.tag-review { background: rgba(245, 158, 11, 0.15); color: #F59E0B; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700; }

.file-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
.file-card { background: #070A13; border: 1px solid #1E293B; border-radius: 8px; padding: 1rem; display: flex; align-items: center; gap: 0.8rem; }
.file-icon { font-size: 1.8rem; }
.file-details { flex-grow: 1; }
.file-details strong { display: block; color: #FFF; font-size: 0.85rem; }
.file-details small { color: #64748B; font-size: 0.75rem; }
.btn-dl { background: #1E293B; color: #FFF; border: none; padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.78rem; cursor: pointer; }
.btn-dl:hover { background: var(--color-primario); }
</style>