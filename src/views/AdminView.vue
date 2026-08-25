<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabaseClient'

interface Orden {
  id: string
  codigo_orden: string
  cliente_nombre: string
  cliente_telefono: string
  direccion: string
  municipio: string
  metodo_pago: string
  comprobante_url?: string
  estado: string
  total: number
  created_at: string
}

const router = useRouter()
const ordenes = ref<Orden[]>([])
const cargando = ref(true)
const modalFotoUrl = ref<string | null>(null)

// Mejora 5: Buscador en tiempo real
const busquedaAdmin = ref('')

onMounted(async () => {
  const auth = sessionStorage.getItem('bytecode_admin_auth')
  if (!auth) {
    router.push('/')
    return
  }
  await cargarOrdenes()
})

async function cargarOrdenes() {
  cargando.value = true
  try {
    const { data, error } = await supabase
      .from('ordenes')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      ordenes.value = data
    }
  } catch (err) {
    console.error('Error al cargar órdenes:', err)
  } finally {
    cargando.value = false
  }
}

// Filtro computado para buscar entre todas las órdenes
const ordenesFiltradas = computed(() => {
  if (!busquedaAdmin.value.trim()) return ordenes.value
  const query = busquedaAdmin.value.toLowerCase().trim()
  return ordenes.value.filter(o => 
    o.codigo_orden.toLowerCase().includes(query) ||
    o.cliente_nombre.toLowerCase().includes(query) ||
    o.cliente_telefono.includes(query) ||
    o.direccion.toLowerCase().includes(query) ||
    o.estado.toLowerCase().includes(query)
  )
})

async function actualizarEstado(ordenId: string, nuevoEstado: string) {
  try {
    await supabase
      .from('ordenes')
      .update({ estado: nuevoEstado })
      .eq('id', ordenId)

    await cargarOrdenes()
  } catch (err) {
    console.error('Error al actualizar estado:', err)
  }
}

function abrirComprobante(path: string) {
  if (!path) return
  if (path.startsWith('http')) {
    modalFotoUrl.value = path
  } else {
    const { data } = supabase.storage.from('comprobantes').getPublicUrl(path)
    modalFotoUrl.value = data.publicUrl
  }
}

function cerrarSesion() {
  sessionStorage.removeItem('bytecode_admin_auth')
  router.push('/')
}
</script>

<template>
  <div class="admin-view">
    <div class="admin-header">
      <div class="header-titles">
        <h1>🔒 Panel de Administración - BytecodeGt</h1>
        <p>Gestión de Pedidos, Envíos e Inventario</p>
      </div>
      <div class="header-actions">
        <button class="btn-logout" @click="cerrarSesion">Cerrar Sesión</button>
      </div>
    </div>

    <div class="admin-container">
      <div class="stats-row">
        <div class="stat-card">
          <h3>Total de Pedidos</h3>
          <p class="stat-number">{{ ordenes.length }}</p>
        </div>
        <div class="stat-card">
          <h3>Ingresos Generados</h3>
          <p class="stat-number text-green">
            Q{{ ordenes.reduce((acc, o) => acc + Number(o.total), 0).toFixed(2) }}
          </p>
        </div>
      </div>

      <div class="orders-section">
        <div class="section-title">
          <h2>📦 Registro de Compras de Clientes</h2>
          
          <!-- Mejora 5: Barra de búsqueda dentro del Admin -->
          <div class="admin-search-box">
            <span class="search-icon">🔍</span>
            <input 
              type="text" 
              v-model="busquedaAdmin" 
              placeholder="Buscar por código, cliente o teléfono..."
            />
          </div>

          <button @click="cargarOrdenes" class="btn-refresh">🔄 Actualizar</button>
        </div>

        <div v-if="cargando" class="loading-box">
          <p>Cargando órdenes desde Supabase...</p>
        </div>

        <div v-else-if="ordenesFiltradas.length === 0" class="empty-box">
          <p>No se encontraron resultados para "{{ busquedaAdmin }}".</p>
        </div>

        <div v-else class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th style="min-width: 110px;">Código</th>
                <th style="min-width: 120px;">Cliente</th>
                <th style="min-width: 110px;">Contacto</th>
                <th style="min-width: 220px;">Dirección</th>
                <th style="min-width: 150px;">Pago</th>
                <th style="min-width: 120px;">Comprobante</th>
                <th style="min-width: 100px;">Total</th>
                <th style="min-width: 130px;">Estado</th>
                <th style="min-width: 150px;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in ordenesFiltradas" :key="o.id">
                <td class="cell-nowrap"><strong class="code-highlight">{{ o.codigo_orden }}</strong></td>
                <td>{{ o.cliente_nombre }}</td>
                <td class="cell-nowrap">{{ o.cliente_telefono }}</td>
                <td>{{ o.direccion }}, {{ o.municipio }}</td>
                <td class="cell-nowrap">
                  <span class="badge-payment">
                    {{ o.metodo_pago === 'contra_entrega' ? '💵 Contra Entrega' : '🏦 Transferencia' }}
                  </span>
                </td>
                <td class="cell-nowrap">
                  <button 
                    v-if="o.comprobante_url" 
                    @click="abrirComprobante(o.comprobante_url)"
                    class="btn-proof"
                  >
                    🖼️ Ver Foto
                  </button>
                  <span v-else class="no-proof">-</span>
                </td>
                <td class="price-cell cell-nowrap">Q{{ Number(o.total).toFixed(2) }}</td>
                <td class="cell-nowrap">
                  <span class="status-pill" :class="o.estado.toLowerCase().replace(/ /g, '-')">
                    {{ o.estado }}
                  </span>
                </td>
                <td>
                  <select 
                    :value="o.estado" 
                    @change="actualizarEstado(o.id, ($event.target as HTMLSelectElement).value)"
                    class="status-select"
                  >
                    <option value="Confirmado">Confirmado</option>
                    <option value="Empacado">Empacado</option>
                    <option value="Entregado a agencia">Entregado a agencia</option>
                    <option value="En ruta final">En ruta final</option>
                    <option value="Entregado">Entregado</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Comprobante -->
    <div v-if="modalFotoUrl" class="modal-backdrop" @click.self="modalFotoUrl = null">
      <div class="proof-modal-card">
        <div class="modal-head">
          <h3>🖼️ Comprobante de Transferencia</h3>
          <button @click="modalFotoUrl = null" class="btn-close">✕</button>
        </div>
        <div class="modal-img-container">
          <img :src="modalFotoUrl" alt="Comprobante de depósito" />
        </div>
        <div class="modal-foot">
          <a :href="modalFotoUrl" target="_blank" class="btn-download">Abrir Imagen Original 🔗</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-view { min-height: 100vh; background: #070A13; color: #F8FAFC; padding: 4.5rem 1.5rem 2rem 1.5rem; }
.admin-header { display: flex; justify-content: space-between; align-items: flex-start; max-width: 1250px; margin: 0 auto 2rem auto; border-bottom: 1px solid #1E293B; padding-bottom: 1.25rem; }
.header-titles h1 { font-size: 1.5rem; color: #FFF; margin-bottom: 0.25rem; }
.header-titles p { color: #94A3B8; font-size: 0.85rem; }
.btn-logout { background: rgba(255, 0, 127, 0.1); border: 1px solid #FF007F; color: #FF007F; padding: 0.5rem 1.2rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700; cursor: pointer; }

.admin-container { max-width: 1250px; margin: 0 auto; }
.stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
.stat-card { background: #0B0F19; border: 1px solid #1E293B; border-radius: 10px; padding: 1.25rem; }
.stat-card h3 { color: #94A3B8; font-size: 0.85rem; margin-bottom: 0.5rem; }
.stat-number { font-size: 1.8rem; font-weight: 800; color: #00A3FF; }
.text-green { color: #10B981; }

.orders-section { background: #0B0F19; border: 1px solid #1E293B; border-radius: 12px; padding: 1.5rem; }
.section-title { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
.section-title h2 { font-size: 1.1rem; color: #FFF; }

.admin-search-box { position: relative; flex-grow: 1; max-width: 380px; }
.admin-search-box input { width: 100%; background: #070A13; border: 1px solid #1E293B; color: #FFF; padding: 0.45rem 0.85rem 0.45rem 2.2rem; border-radius: 6px; font-size: 0.82rem; }
.admin-search-box input:focus { outline: none; border-color: #00A3FF; }
.search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); font-size: 0.8rem; opacity: 0.5; }

.btn-refresh { background: rgba(0, 163, 255, 0.15); border: 1px solid #00A3FF; color: #00A3FF; padding: 0.45rem 0.9rem; border-radius: 6px; font-weight: 700; cursor: pointer; white-space: nowrap; }

.table-responsive { overflow-x: auto; width: 100%; }
.admin-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
.admin-table th { background: #070A13; color: #CBD5E1; padding: 0.85rem; text-align: left; border-bottom: 2px solid #1E293B; }
.admin-table td { padding: 0.85rem; border-bottom: 1px solid #1E293B; color: #CBD5E1; vertical-align: middle; }

.cell-nowrap { white-space: nowrap; }
.code-highlight { color: #00A3FF; font-weight: 800; }
.price-cell { font-weight: 800; color: #FFF; }
.badge-payment { background: #070A13; padding: 0.3rem 0.6rem; border-radius: 6px; border: 1px solid #1E293B; font-size: 0.78rem; display: inline-block; white-space: nowrap; }

.btn-proof { background: rgba(0, 163, 255, 0.15); border: 1px solid #00A3FF; color: #00A3FF; padding: 0.3rem 0.75rem; border-radius: 6px; font-size: 0.78rem; font-weight: 700; cursor: pointer; }
.no-proof { color: #64748B; font-size: 0.85rem; padding-left: 0.5rem; }

.status-select { background: #070A13; border: 1px solid #1E293B; color: #FFF; padding: 0.4rem 0.6rem; border-radius: 6px; font-size: 0.8rem; }
.loading-box, .empty-box { padding: 2rem; text-align: center; color: #94A3B8; }

.modal-backdrop { position: fixed; inset: 0; background-color: rgba(7, 10, 19, 0.85); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 200; }
.proof-modal-card { background: #0B0F19; border: 1px solid #1E293B; border-radius: 12px; padding: 1.25rem; width: 90%; max-width: 500px; }
.modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; color: #FFF; }
.btn-close { background: transparent; border: none; color: #94A3B8; font-size: 1.2rem; cursor: pointer; }
.modal-img-container { background: #070A13; border-radius: 8px; overflow: hidden; max-height: 60vh; display: flex; align-items: center; justify-content: center; border: 1px solid #1E293B; }
.modal-img-container img { max-width: 100%; max-height: 60vh; object-fit: contain; }
.modal-foot { margin-top: 1rem; text-align: right; }
.btn-download { color: #00A3FF; text-decoration: none; font-size: 0.85rem; font-weight: 700; }
</style>