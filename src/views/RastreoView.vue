<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { siteConfig } from '../config/siteConfig'

interface OrdenRastreo {
  codigo_orden: string
  cliente_nombre: string
  direccion: string
  municipio: string
  departamento: string
  metodo_pago: string
  estado: string
  guia_envio?: string
  total: number
  created_at: string
}

const codigoBusqueda = ref('')
const ordenEncontrada = ref<OrdenRastreo | null>(null)
const busquedaRealizada = ref(false)
const cargando = ref(false)
const errorMsj = ref('')

const etapas = ['Confirmado', 'Empacado', 'Entregado a agencia', 'En ruta final', 'Entregado']

function obtenerNivelPaso(estadoActual: string): number {
  const idx = etapas.indexOf(estadoActual)
  return idx !== -1 ? idx : 0
}

async function buscarOrden() {
  if (!codigoBusqueda.value.trim()) return

  cargando.value = true
  busquedaRealizada.value = false
  errorMsj.value = ''
  ordenEncontrada.value = null

  const codigoLimpio = codigoBusqueda.value.trim().toUpperCase()

  try {
    const { data, error } = await supabase
      .from('ordenes')
      .select('*')
      .eq('codigo_orden', codigoLimpio)
      .maybeSingle()

    if (error) throw error

    if (data) {
      ordenEncontrada.value = data
    } else {
      errorMsj.value = `No se encontró ninguna orden registrada con el código "${codigoLimpio}". Verifique el número e intente de nuevo.`
    }
  } catch (err) {
    console.error('Error al rastrear pedido:', err)
    errorMsj.value = 'Ocurrió un error al consultar el servidor. Intente nuevamente.'
  } finally {
    cargando.value = false
    busquedaRealizada.value = true
  }
}
</script>

<template>
  <div class="rastreo-view">
    <div class="rastreo-container">
      <!-- Encabezado -->
      <div class="rastreo-header">
        <span class="badge-neon">📦 Seguimiento de Envíos</span>
        <h1>Consulta de Estado de Pedido</h1>
        <p>Ingresa tu código de orden (ej. ORD-123456) para verificar el progreso de tu despacho en tiempo real.</p>
      </div>

      <!-- Buscador -->
      <form @submit.prevent="buscarOrden" class="search-card">
        <div class="input-group">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            v-model="codigoBusqueda" 
            placeholder="Ingrese el código de orden (ej. ORD-849302)"
            required 
          />
          <button type="submit" class="btn-search" :disabled="cargando">
            {{ cargando ? 'Consultando...' : 'Rastrear Pedido' }}
          </button>
        </div>
      </form>

      <!-- Mensaje de Error / No Encontrado -->
      <div v-if="busquedaRealizada && errorMsj" class="error-box">
        <p>⚠️ {{ errorMsj }}</p>
      </div>

      <!-- Resultado de la Orden -->
      <div v-if="ordenEncontrada" class="result-card">
        <div class="order-top-bar">
          <div>
            <small>Código de Seguimiento</small>
            <h2>{{ ordenEncontrada.codigo_orden }}</h2>
          </div>
          <div class="status-badge" :class="ordenEncontrada.estado.toLowerCase().replace(/ /g, '-')">
            ● {{ ordenEncontrada.estado }}
          </div>
        </div>

        <!-- Línea de Tiempo / Tracker -->
        <div class="tracker-timeline">
          <div 
            v-for="(etapa, index) in etapas" 
            :key="etapa" 
            class="timeline-step"
            :class="{ active: index <= obtenerNivelPaso(ordenEncontrada.estado) }"
          >
            <div class="step-circle">
              <span v-if="index < obtenerNivelPaso(ordenEncontrada.estado)">✓</span>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span class="step-label">{{ etapa }}</span>
          </div>
        </div>

        <!-- Detalles del Despacho -->
        <div class="details-grid">
          <div class="detail-item">
            <span class="label">Destinatario:</span>
            <span class="value">{{ ordenEncontrada.cliente_nombre }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Dirección de Entrega:</span>
            <span class="value">{{ ordenEncontrada.direccion }}, {{ ordenEncontrada.municipio }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Método de Pago:</span>
            <span class="value">
              {{ ordenEncontrada.metodo_pago === 'contra_entrega' ? '💵 Pago Contra Entrega' : '🏦 Transferencia Bancaria' }}
            </span>
          </div>
          <div class="detail-item">
            <span class="label">Total de la Orden:</span>
            <span class="value price">Q{{ Number(ordenEncontrada.total).toFixed(2) }}</span>
          </div>
        </div>

        <!-- Botón de Asistencia -->
        <div class="help-box">
          <p>¿Tienes dudas sobre la entrega de tu pedido?</p>
          <a 
            :href="`https://wa.me/${siteConfig.whatsapp}?text=Hola%20BytecodeGt,%20necesito%20asistencia%20con%20mi%20orden%20${ordenEncontrada.codigo_orden}`" 
            target="_blank" 
            class="btn-support-wa"
          >
            💬 Contactar a Soporte por WhatsApp
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rastreo-view {
  min-height: calc(100vh - 120px);
  padding: 3rem 1.25rem;
  background: linear-gradient(180deg, #070A13 0%, #0B0F19 100%);
  display: flex;
  justify-content: center;
}

.rastreo-container {
  width: 100%;
  max-width: 800px;
}

.rastreo-header {
  text-align: center;
  margin-bottom: 2rem;
}

.badge-neon {
  background: rgba(0, 163, 255, 0.12);
  color: var(--color-secundario, #00A3FF);
  border: 1px solid var(--color-secundario, #00A3FF);
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-block;
  margin-bottom: 0.75rem;
}

.rastreo-header h1 {
  font-size: 2rem;
  color: #FFF;
  margin-bottom: 0.5rem;
}

.rastreo-header p {
  color: #94A3B8;
  font-size: 0.95rem;
}

.search-card {
  background: #0B0F19;
  border: 1px solid #1E293B;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  margin-bottom: 1.5rem;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  opacity: 0.5;
}

.input-group input {
  flex-grow: 1;
  background: #070A13;
  border: 1px solid #1E293B;
  color: #FFF;
  padding: 0.85rem 1rem 0.85rem 2.8rem;
  border-radius: 8px;
  font-size: 0.95rem;
}

.input-group input:focus {
  outline: none;
  border-color: var(--color-secundario, #00A3FF);
}

.btn-search {
  background: var(--color-primario, #0082FB);
  border: none;
  color: #FFF;
  font-weight: 700;
  padding: 0.85rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.2s;
}

.btn-search:hover {
  opacity: 0.9;
}

.error-box {
  background: rgba(255, 0, 127, 0.1);
  border: 1px solid #FF007F;
  color: #FF007F;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-size: 0.9rem;
}

.result-card {
  background: #0B0F19;
  border: 1px solid #1E293B;
  border-radius: 14px;
  padding: 1.75rem;
  box-shadow: 0 10px 30px rgba(0, 130, 251, 0.15);
}

.order-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #1E293B;
  padding-bottom: 1.25rem;
  margin-bottom: 2rem;
}

.order-top-bar small {
  color: #64748B;
  font-size: 0.8rem;
}

.order-top-bar h2 {
  color: var(--color-secundario, #00A3FF);
  font-size: 1.5rem;
  margin-top: 0.2rem;
}

.status-badge {
  background: rgba(16, 185, 129, 0.15);
  color: #10B981;
  border: 1px solid #10B981;
  padding: 0.4rem 0.85rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.85rem;
}

.tracker-timeline {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: 2.5rem;
  padding: 0 0.5rem;
}

.tracker-timeline::before {
  content: '';
  position: absolute;
  top: 18px;
  left: 30px;
  right: 30px;
  height: 3px;
  background: #1E293B;
  z-index: 1;
}

.timeline-step {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.step-circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #070A13;
  border: 2px solid #1E293B;
  color: #64748B;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.85rem;
  transition: all 0.3s;
}

.timeline-step.active .step-circle {
  background: var(--color-primario, #0082FB);
  border-color: var(--color-secundario, #00A3FF);
  color: #FFF;
  box-shadow: 0 0 12px rgba(0, 163, 255, 0.5);
}

.step-label {
  color: #64748B;
  font-size: 0.78rem;
  font-weight: 600;
  text-align: center;
}

.timeline-step.active .step-label {
  color: #F8FAFC;
}

.details-grid {
  background: #070A13;
  border: 1px solid #1E293B;
  border-radius: 10px;
  padding: 1.25rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item .label {
  color: #64748B;
  font-size: 0.8rem;
}

.detail-item .value {
  color: #F8FAFC;
  font-size: 0.9rem;
  font-weight: 600;
}

.detail-item .price {
  color: var(--color-secundario, #00A3FF);
  font-size: 1.1rem;
  font-weight: 800;
}

.help-box {
  text-align: center;
  border-top: 1px solid #1E293B;
  padding-top: 1.25rem;
}

.help-box p {
  color: #94A3B8;
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
}

.btn-support-wa {
  display: inline-block;
  background: #10B981;
  color: #FFF;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.88rem;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  transition: opacity 0.2s;
}

.btn-support-wa:hover {
  opacity: 0.9;
}

@media (max-width: 650px) {
  .input-group {
    flex-direction: column;
  }
  .search-icon {
    top: 1rem;
  }
  .input-group input {
    width: 100%;
  }
  .btn-search {
    width: 100%;
  }
  .details-grid {
    grid-template-columns: 1fr;
  }
  .step-label {
    font-size: 0.65rem;
  }
}
</style>