<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { siteConfig } from './config/siteConfig'

const router = useRouter()
const showLoginModal = ref(false)
const adminPassword = ref('')
const loginError = ref('')

function intentarAccesoAdmin() {
  loginError.value = ''
  if (adminPassword.value === 'bytecode2026') {
    showLoginModal.value = false
    adminPassword.value = ''
    sessionStorage.setItem('bytecode_admin_auth', 'true')
    router.push('/admin')
  } else {
    loginError.value = 'Contraseña incorrecta'
  }
}
</script>

<template>
  <div class="bytecode-app" :style="{ 
    '--color-primario': siteConfig.colores.primario,
    '--color-secundario': siteConfig.colores.secundario,
    '--color-fucsia': siteConfig.colores.acentoFucsia
  }">
    <!-- Navegación Flotante Minimalista (Sin Barra Superior Oscura ni Línea Azul) -->
    <nav class="top-floating-nav">
      <RouterLink to="/" class="nav-pill-btn">🛍️ Catálogo</RouterLink>
      <RouterLink to="/rastreo" class="nav-pill-btn">📦 Rastrear Pedido</RouterLink>
    </nav>

    <!-- Cuerpo Principal -->
    <main class="content-body">
      <RouterView />
    </main>

    <!-- Modal Admin Oculto -->
    <div v-if="showLoginModal" class="modal-backdrop" @click.self="showLoginModal = false">
      <div class="login-card">
        <h3>🔒 Acceso Restringido</h3>
        <p>Introduce la clave de administración de BytecodeGt:</p>

        <form @submit.prevent="intentarAccesoAdmin">
          <input 
            type="password" 
            v-model="adminPassword" 
            placeholder="Contraseña de administrador" 
            class="auth-input"
            autofocus 
          />
          <p v-if="loginError" class="auth-error">{{ loginError }}</p>

          <div class="modal-actions">
            <button type="button" @click="showLoginModal = false" class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-login">Ingresar</button>
          </div>
        </form>
      </div>
    </div>

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
        <p>
          <span @click="showLoginModal = true" class="secret-trigger" title="Acceso Administrativo">© 2026 🔒</span>
          <strong>BYTECODEGT</strong>. Cómputo, Redes & Video Vigilancia.
        </p>
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

/* Botones de Navegación Flotantes (Sin barra bloqueante) */
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

/* Modal Admin */
.modal-backdrop {
  position: fixed; inset: 0;
  background-color: rgba(7, 10, 19, 0.85);
  backdrop-filter: blur(5px);
  display: flex; align-items: center; justify-content: center;
  z-index: 200;
}

.login-card {
  background-color: #0B0F19;
  border: 1px solid var(--color-primario);
  border-radius: 12px; padding: 1.75rem;
  width: 90%; max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 130, 251, 0.25);
}

.login-card h3 { color: #FFF; margin-bottom: 0.5rem; font-size: 1.2rem; }
.login-card p { color: #94A3B8; font-size: 0.85rem; margin-bottom: 1.25rem; }

.auth-input {
  width: 100%; padding: 0.75rem;
  background-color: #070A13; border: 1px solid #1E293B;
  border-radius: 8px; color: #FFF; font-size: 0.9rem; margin-bottom: 0.75rem;
}

.auth-input:focus { outline: none; border-color: var(--color-secundario); }
.auth-error { color: var(--color-fucsia); font-size: 0.8rem; margin-bottom: 0.75rem; }

.modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; }
.btn-cancel { background: transparent; border: 1px solid #1E293B; color: #94A3B8; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; }
.btn-login { background: var(--color-primario); border: none; color: #FFF; font-weight: 700; padding: 0.5rem 1.25rem; border-radius: 6px; cursor: pointer; }

/* Botón Flotante WhatsApp */
.whatsapp-float-btn {
  position: fixed; bottom: 20px; right: 20px;
  width: 52px; height: 52px; background-color: #10B981;
  color: #FFF; border-radius: 50%; display: flex;
  align-items: center; justify-content: center;
  font-size: 1.5rem; text-decoration: none;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4); z-index: 99;
}

.main-footer {
  background-color: #0B0F19; border-top: 1px solid #1E293B;
  padding: 1.25rem; text-align: center; color: #64748B; font-size: 0.82rem;
}

.secret-trigger { cursor: pointer; user-select: none; transition: opacity 0.2s; }
.secret-trigger:hover { opacity: 0.7; }

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