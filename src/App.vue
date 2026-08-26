<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { siteConfig } from './config/siteConfig'
</script>

<template>
  <div class="bytecode-app" :style="{ 
    '--color-primario': siteConfig.colores.primario,
    '--color-secundario': siteConfig.colores.secundario,
    '--color-fucsia': siteConfig.colores.acentoFucsia
  }">
    <!-- Navegación Flotante Minimalista -->
    <nav class="top-floating-nav">
      <RouterLink to="/" class="nav-pill-btn">🛍️ Catálogo</RouterLink>
      <RouterLink to="/rastreo" class="nav-pill-btn">📦 Rastrear Pedido</RouterLink>
    </nav>

    <!-- Cuerpo Principal -->
    <main class="content-body">
      <RouterView />
    </main>

    <!-- Widget Flotante WhatsApp -->
    <a 
      :href="`https://wa.me/${siteConfig.whatsapp}?text=Hola%20BytecodeGt,%20deseo%20asesor%C3%ADa%20técnica`" 
      target="_blank" 
      rel="noopener noreferrer" 
      class="whatsapp-float-btn"
      title="Asesoría Técnica WhatsApp"
    >
      💬
    </a>

    <!-- Footer General -->
    <footer class="main-footer">
      <div class="footer-container">
        <div class="footer-info">
          <p>
            <RouterLink to="/admin" class="secret-trigger" title="Acceso Administrativo">© 2026 🔒</RouterLink>
            <strong>BYTECODEGT</strong>. Cómputo, Redes & Video Vigilancia.
          </p>
        </div>

        <div class="footer-legal-col">
          <span class="footer-title">LEGAL</span>
          <RouterLink to="/terms" class="legal-link">Terms of Service</RouterLink>
          <RouterLink to="/privacy" class="legal-link">Privacy Policy</RouterLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }

/* Scrollbar Personalizada Neón Oscura */
::-webkit-scrollbar {
  width: 8px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #070A13;
}
::-webkit-scrollbar-thumb {
  background: #1E293B;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-secundario, #00A3FF);
}

body {
  background-color: #070A13;
  color: #F8FAFC;
  font-family: system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
}

.bytecode-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Botones de Navegación Flotantes */
.top-floating-nav {
  position: absolute;
  top: 1.25rem;
  right: 1.5rem;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-pill-btn {
  color: #CBD5E1;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background-color: rgba(11, 15, 25, 0.75);
  border: 1px solid #1E293B;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;
}

.nav-pill-btn:hover, .nav-pill-btn.router-link-active {
  color: var(--color-secundario);
  border-color: var(--color-secundario);
  background-color: rgba(0, 163, 255, 0.15);
  box-shadow: 0 0 12px rgba(0, 163, 255, 0.25);
}

.content-body { flex-grow: 1; }

/* Botón Flotante WhatsApp */
.whatsapp-float-btn {
  position: fixed; bottom: 20px; right: 20px;
  width: 52px; height: 52px; background-color: #10B981;
  color: #FFF; border-radius: 50%; display: flex;
  align-items: center; justify-content: center;
  font-size: 1.5rem; text-decoration: none;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4); z-index: 99;
}

/* Footer General */
.main-footer {
  background: #0b1120;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1.5rem 0;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.footer-info p {
  margin: 0;
  color: #94a3b8;
  font-size: 0.9rem;
}

.secret-trigger {
  cursor: pointer;
  user-select: none;
  margin-right: 0.35rem;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s;
}

.secret-trigger:hover {
  opacity: 0.7;
}

.footer-legal-col {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.footer-title {
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.legal-link {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.legal-link:hover {
  color: #38bdf8;
}

@media (max-width: 600px) {
  .top-floating-nav {
    position: relative;
    top: 0;
    right: 0;
    justify-content: center;
    padding: 1rem 0 0 0;
  }
}
</style>