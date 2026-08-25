<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabaseClient'
import emailjs from '@emailjs/browser'

interface Orden {
  id: string
  codigo_orden: string
  cliente_nombre: string
  cliente_telefono: string
  cliente_email?: string
  direccion: string
  municipio: string
  metodo_pago: string
  comprobante_url?: string
  estado: string
  guia_envio?: string
  empresa_logistica?: string
  total: number
  created_at: string
}

interface Producto {
  id?: string
  sku: string
  nombre: string
  descripcion: string
  precio: number
  stock: number
  categoria_slug: string
  imagenes: string[]
  activo: boolean
}

const router = useRouter()
const tabActiva = ref<'ordenes' | 'productos'>('ordenes')

// Estados para Órdenes
const ordenes = ref<Orden[]>([])
const cargandoOrdenes = ref(true)
const busquedaAdmin = ref('')
const filtroEstado = ref<string>('todos')
const filtroPago = ref<string>('todos')
const modalFotoUrl = ref<string | null>(null)
const guardandoGuiaId = ref<string | null>(null)

// Estados para Productos
const productos = ref<Producto[]>([])
const cargandoProductos = ref(false)
const modalProductoOpen = ref(false)
const modoEdicion = ref(false)
const guardarCargando = ref(false)

const productoForm = ref<Producto>({
  sku: '',
  nombre: '',
  descripcion: '',
  precio: 0,
  stock: 10,
  categoria_slug: 'laptops',
  imagenes: ['https://via.placeholder.com/300'],
  activo: true
})

onMounted(async () => {
  const auth = sessionStorage.getItem('bytecode_admin_auth')
  if (!auth) {
    router.push('/')
    return
  }
  await cargarOrdenes()
  await cargarProductos()
})

async function cargarOrdenes() {
  cargandoOrdenes.value = true
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
    cargandoOrdenes.value = false
  }
}

const ordenesFiltradas = computed(() => {
  return ordenes.value.filter(o => {
    const q = busquedaAdmin.value.toLowerCase().trim()
    const coincideTexto = !q || 
      o.codigo_orden.toLowerCase().includes(q) ||
      o.cliente_nombre.toLowerCase().includes(q) ||
      o.cliente_telefono.includes(q) ||
      (o.cliente_email && o.cliente_email.toLowerCase().includes(q)) ||
      o.direccion.toLowerCase().includes(q)

    const coincideEstado = filtroEstado.value === 'todos' || o.estado === filtroEstado.value
    const coincidePago = filtroPago.value === 'todos' || o.metodo_pago === filtroPago.value

    return coincideTexto && coincideEstado && coincidePago
  })
})

async function actualizarEstadoOrden(ordenId: string, nuevoEstado: string) {
  try {
    await supabase.from('ordenes').update({ estado: nuevoEstado }).eq('id', ordenId)
    await cargarOrdenes()
  } catch (err) {
    console.error('Error actualizando estado:', err)
  }
}

async function enviarNotificacionCorreo(orden: Orden) {
  if (!orden.cliente_email) {
    alert('El cliente no tiene un correo electrónico registrado.')
    return
  }

  // Lectura segura desde variables de entorno
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  // Validar presencia de credenciales antes de ejecutar
  if (!serviceId || !templateId || !publicKey) {
    console.error('❌ Faltan las variables de entorno de EmailJS.')
    alert('⚠️ Error de configuración: No se encontraron las llaves de EmailJS en el entorno.')
    return
  }

  const templateParams = {
    to_email: orden.cliente_email,
    to_name: orden.cliente_nombre,
    codigo_orden: orden.codigo_orden,
    empresa_logistica: orden.empresa_logistica || 'Transporte Local',
    guia_envio: orden.guia_envio || 'N/A',
    total: `Q${Number(orden.total).toFixed(2)}`
  }

  try {
    emailjs.init({ publicKey })

    const response = await emailjs.send(serviceId, templateId, templateParams, {
      publicKey
    })

    console.log('✅ Correo enviado a:', orden.cliente_email, response.status, response.text)
    alert(`✅ Correo enviado exitosamente a: ${orden.cliente_email}`)
  } catch (error: any) {
    console.error('❌ Error enviando correo vía EmailJS:', error)
    alert(`⚠️ No se pudo enviar el correo (${error?.status || 404}): ${error?.text || 'Error de envío'}`)
  }
}
async function guardarGuiaLogistica(orden: Orden) {
  if (!orden.empresa_logistica || !orden.guia_envio) {
    alert('Por favor ingresa tanto la Empresa de Logística como el Número de Guía.')
    return
  }

  guardandoGuiaId.value = orden.id
  try {
    const { error } = await supabase.from('ordenes').update({
      guia_envio: orden.guia_envio,
      empresa_logistica: orden.empresa_logistica,
      estado: 'En ruta final'
    }).eq('id', orden.id)

    if (error) throw error

    await enviarNotificacionCorreo(orden)

    alert(`✅ Guía asignada exitosamente. Se ha actualizado el estado a "En ruta final" y enviado notificación por correo a: ${orden.cliente_email || 'Cliente'}`)
    await cargarOrdenes()
  } catch (err) {
    console.error('Error actualizando guía:', err)
    alert('Ocurrió un error al guardar la información de envío.')
  } finally {
    guardandoGuiaId.value = null
  }
}

function exportarCSV() {
  if (ordenes.value.length === 0) {
    alert('No hay órdenes registradas para exportar.')
    return
  }

  const encabezados = ['Codigo Orden', 'Cliente', 'Telefono', 'Correo', 'Direccion', 'Municipio', 'Metodo Pago', 'Total (Q)', 'Estado', 'Logistica', 'Guia', 'Fecha']
  const filas = ordenes.value.map(o => [
    `"${o.codigo_orden}"`,
    `"${o.cliente_nombre}"`,
    `"${o.cliente_telefono}"`,
    `"${o.cliente_email || ''}"`,
    `"${o.direccion}"`,
    `"${o.municipio}"`,
    `"${o.metodo_pago}"`,
    o.total,
    `"${o.estado}"`,
    `"${o.empresa_logistica || ''}"`,
    `"${o.guia_envio || ''}"`,
    `"${new Date(o.created_at).toLocaleDateString()}"`
  ])

  const contenido = [encabezados.join(','), ...filas.map(f => f.join(','))].join('\n')
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `Reporte_Ventas_BytecodeGt_${Date.now()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

async function cargarProductos() {
  cargandoProductos.value = true
  try {
    const { data, error } = await supabase.from('productos').select('*').order('created_at', { ascending: false })
    if (!error && data) {
      productos.value = data
    }
  } catch (err) {
    console.error('Error cargando productos:', err)
  } finally {
    cargandoProductos.value = false
  }
}

function abrirCrearProducto() {
  modoEdicion.value = false
  productoForm.value = {
    sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 10,
    categoria_slug: 'laptops',
    imagenes: ['https://via.placeholder.com/300'],
    activo: true
  }
  modalProductoOpen.value = true
}

function editarProducto(p: Producto) {
  modoEdicion.value = true
  productoForm.value = { ...p }
  modalProductoOpen.value = true
}

async function guardarProducto() {
  if (!productoForm.value.nombre || productoForm.value.precio <= 0) {
    alert('Ingresa un nombre válido y un precio mayor a 0.')
    return
  }

  guardarCargando.value = true
  try {
    if (modoEdicion.value && productoForm.value.id) {
      await supabase.from('productos').update({
        sku: productoForm.value.sku,
        nombre: productoForm.value.nombre,
        descripcion: productoForm.value.descripcion,
        precio: productoForm.value.precio,
        stock: productoForm.value.stock,
        categoria_slug: productoForm.value.categoria_slug,
        activo: productoForm.value.activo
      }).eq('id', productoForm.value.id)
    } else {
      await supabase.from('productos').insert([{
        sku: productoForm.value.sku,
        nombre: productoForm.value.nombre,
        descripcion: productoForm.value.descripcion,
        precio: productoForm.value.precio,
        stock: productoForm.value.stock,
        categoria_slug: productoForm.value.categoria_slug,
        imagenes: productoForm.value.imagenes,
        activo: productoForm.value.activo
      }])
    }

    modalProductoOpen.value = false
    await cargarProductos()
  } catch (err) {
    console.error('Error guardando producto:', err)
  } finally {
    guardarCargando.value = false
  }
}

async function cambiarEstadoProducto(p: Producto) {
  try {
    await supabase.from('productos').update({ activo: !p.activo }).eq('id', p.id)
    await cargarProductos()
  } catch (err) {
    console.error('Error cambiando estado:', err)
  }
}

async function eliminarProducto(id?: string) {
  if (!id || !confirm('¿Estás seguro de eliminar este producto definitivamente?')) return
  try {
    await supabase.from('productos').delete().eq('id', id)
    await cargarProductos()
  } catch (err) {
    console.error('Error eliminando producto:', err)
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
        <p>Gestión de Pedidos, CRUD de Productos e Inventario</p>
      </div>
      <div class="header-actions">
        <button class="btn-logout" @click="cerrarSesion">Cerrar Sesión</button>
      </div>
    </div>

    <div class="admin-container">
      <div class="tabs-nav">
        <button 
          class="tab-btn" 
          :class="{ active: tabActiva === 'ordenes' }" 
          @click="tabActiva = 'ordenes'"
        >
          📦 Gestión de Pedidos ({{ ordenes.length }})
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: tabActiva === 'productos' }" 
          @click="tabActiva = 'productos'"
        >
          🏷️ CRUD de Productos ({{ productos.length }})
        </button>
      </div>

      <!-- PESTAÑA 1: ÓRDENES -->
      <div v-if="tabActiva === 'ordenes'" class="tab-content">
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
            <h2>📦 Registro y Seguimiento de Pedidos</h2>
            <div class="action-buttons-group">
              <button @click="exportarCSV" class="btn-export">📊 Exportar Reporte CSV</button>
              <button @click="cargarOrdenes" class="btn-refresh">🔄 Actualizar</button>
            </div>
          </div>

          <div class="filters-bar">
            <div class="search-box">
              <input type="text" v-model="busquedaAdmin" placeholder="Buscar por cliente, correo, código ORD- o teléfono..." />
            </div>

            <div class="filter-select">
              <label>Estado:</label>
              <select v-model="filtroEstado">
                <option value="todos">Todos</option>
                <option value="Confirmado">Confirmado</option>
                <option value="Empacado">Empacado</option>
                <option value="Entregado a agencia">Entregado a agencia</option>
                <option value="En ruta final">En ruta final</option>
                <option value="Entregado">Entregado</option>
              </select>
            </div>

            <div class="filter-select">
              <label>Pago:</label>
              <select v-model="filtroPago">
                <option value="todos">Todos</option>
                <option value="contra_entrega">Contra Entrega</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>
          </div>

          <div v-if="cargandoOrdenes" class="loading-box"><p>Cargando pedidos...</p></div>
          <div v-else-if="ordenesFiltradas.length === 0" class="empty-box"><p>No hay pedidos que coincidan con los filtros.</p></div>

          <div v-else class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th style="min-width: 110px;">Código</th>
                  <th style="min-width: 130px;">Cliente</th>
                  <th style="min-width: 110px;">Contacto</th>
                  <th style="min-width: 200px;">Dirección</th>
                  <th style="min-width: 155px;">Pago</th>
                  <th style="min-width: 110px;">Comprobante</th>
                  <th style="min-width: 100px;">Total</th>
                  <th style="min-width: 140px;">Estado</th>
                  <th style="min-width: 250px;">Asignar Guía / Logística</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="o in ordenesFiltradas" :key="o.id">
                  <td><strong class="code-highlight">{{ o.codigo_orden }}</strong></td>
                  <td>
                    <div><strong>{{ o.cliente_nombre }}</strong></div>
                    <small v-if="o.cliente_email" class="email-subtext">{{ o.cliente_email }}</small>
                  </td>
                  <td>{{ o.cliente_telefono }}</td>
                  <td>{{ o.direccion }}, {{ o.municipio }}</td>
                  <td>
                    <span class="badge-payment">
                      <span class="badge-icon">{{ o.metodo_pago === 'contra_entrega' ? '💵' : '🏦' }}</span>
                      <span>{{ o.metodo_pago === 'contra_entrega' ? 'Contra Entrega' : 'Transferencia' }}</span>
                    </span>
                  </td>
                  <td>
                    <button v-if="o.comprobante_url" @click="abrirComprobante(o.comprobante_url)" class="btn-proof">
                      🖼️ Ver Foto
                    </button>
                    <span v-else class="no-proof">-</span>
                  </td>
                  <td class="price-cell">Q{{ Number(o.total).toFixed(2) }}</td>
                  <td>
                    <select :value="o.estado" @change="actualizarEstadoOrden(o.id, ($event.target as HTMLSelectElement).value)" class="status-select">
                      <option value="Confirmado">Confirmado</option>
                      <option value="Empacado">Empacado</option>
                      <option value="Entregado a agencia">Entregado a agencia</option>
                      <option value="En ruta final">En ruta final</option>
                      <option value="Entregado">Entregado</option>
                    </select>
                  </td>
                  <td>
                    <div class="tracking-input-group">
                      <input type="text" v-model="o.empresa_logistica" placeholder="Empresa (ej. Guatex)" class="small-input" />
                      <input type="text" v-model="o.guia_envio" placeholder="N° Guía" class="small-input" />
                      <button @click="guardarGuiaLogistica(o)" class="btn-save-mini" :disabled="guardandoGuiaId === o.id">
                        {{ guardandoGuiaId === o.id ? '⌛' : '💾' }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- PESTAÑA 2: CRUD DE PRODUCTOS -->
      <div v-if="tabActiva === 'productos'" class="tab-content">
        <div class="orders-section">
          <div class="section-title">
            <h2>🏷️ Mantenimiento de Catálogo e Inventario</h2>
            <button @click="abrirCrearProducto" class="btn-add-prod">➕ Nuevo Producto</button>
          </div>

          <div v-if="cargandoProductos" class="loading-box"><p>Cargando productos...</p></div>
          <div v-else-if="productos.length === 0" class="empty-box"><p>No hay productos registrados en el catálogo.</p></div>

          <div v-else class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in productos" :key="p.id">
                  <td><strong class="code-highlight">{{ p.sku }}</strong></td>
                  <td><strong>{{ p.nombre }}</strong></td>
                  <td><span class="cat-tag">{{ p.categoria_slug }}</span></td>
                  <td class="price-cell">Q{{ Number(p.precio).toFixed(2) }}</td>
                  <td>
                    <span :class="['stock-pill', p.stock <= 3 ? 'low-stock' : 'ok-stock']">
                      {{ p.stock }} un.
                    </span>
                  </td>
                  <td>
                    <span :class="['status-pill', p.activo ? 'activo' : 'pausado']">
                      {{ p.activo ? '🟢 Publicado' : '🔴 Pausado' }}
                    </span>
                  </td>
                  <td>
                    <div class="table-actions">
                      <button @click="editarProducto(p)" class="btn-edit">✏️ Editar</button>
                      <button @click="cambiarEstadoProducto(p)" class="btn-toggle">
                        {{ p.activo ? '⏸️ Pausar' : '▶️ Activar' }}
                      </button>
                      <button @click="eliminarProducto(p.id)" class="btn-delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Formulario Producto -->
    <div v-if="modalProductoOpen" class="modal-backdrop" @click.self="modalProductoOpen = false">
      <div class="modal-card">
        <h3>{{ modoEdicion ? '✏️ Editar Producto' : '➕ Crear Nuevo Producto' }}</h3>
        
        <form @submit.prevent="guardarProducto" class="prod-form">
          <div class="form-row">
            <div class="form-group">
              <label>SKU / Código *</label>
              <input type="text" v-model="productoForm.sku" required />
            </div>
            <div class="form-group">
              <label>Categoría *</label>
              <select v-model="productoForm.categoria_slug" required>
                <option value="laptops">Equipos de Cómputo</option>
                <option value="almacenamiento">Almacenamiento</option>
                <option value="perifericos">Accesorios & Periféricos</option>
                <option value="redes">Redes & Conectividad</option>
                <option value="seguridad">Video Vigilancia</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Nombre del Producto *</label>
            <input type="text" v-model="productoForm.nombre" required />
          </div>

          <div class="form-group">
            <label>Descripción Técnica</label>
            <textarea v-model="productoForm.descripcion" rows="3"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Precio (Q) *</label>
              <input type="number" step="0.01" v-model="productoForm.precio" required />
            </div>
            <div class="form-group">
              <label>Stock Disponible *</label>
              <input type="number" v-model="productoForm.stock" required />
            </div>
          </div>

          <div class="form-group">
            <label>URL de Imagen Principal</label>
            <input type="text" v-model="productoForm.imagenes[0]" placeholder="https://..." />
          </div>

          <div class="modal-actions">
            <button type="button" @click="modalProductoOpen = false" class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-save" :disabled="guardarCargando">
              {{ guardarCargando ? 'Guardando...' : 'Guardar Producto' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Comprobante -->
    <div v-if="modalFotoUrl" class="modal-backdrop" @click.self="modalFotoUrl = null">
      <div class="proof-modal-card">
        <div class="modal-head">
          <h3>🖼️ Comprobante de Depósito</h3>
          <button @click="modalFotoUrl = null" class="btn-close">✕</button>
        </div>
        <div class="modal-img-container">
          <img :src="modalFotoUrl" alt="Comprobante" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-view { min-height: 100vh; background: #070A13; color: #F8FAFC; padding: 4rem 1.5rem 2rem 1.5rem; }
.admin-header { display: flex; justify-content: space-between; align-items: flex-start; max-width: 1250px; margin: 0 auto 1.5rem auto; border-bottom: 1px solid #1E293B; padding-bottom: 1rem; }
.header-titles h1 { font-size: 1.5rem; color: #FFF; }
.header-titles p { color: #94A3B8; font-size: 0.85rem; }
.btn-logout { background: rgba(255, 0, 127, 0.1); border: 1px solid #FF007F; color: #FF007F; padding: 0.45rem 1.1rem; border-radius: 20px; font-weight: 700; cursor: pointer; }

.admin-container { max-width: 1250px; margin: 0 auto; }
.tabs-nav { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; }
.tab-btn { background: #0B0F19; border: 1px solid #1E293B; color: #94A3B8; padding: 0.65rem 1.25rem; border-radius: 8px; font-weight: 700; cursor: pointer; }
.tab-btn.active { background: #0082FB; color: #FFF; border-color: #00A3FF; box-shadow: 0 0 12px rgba(0, 163, 255, 0.3); }

.stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
.stat-card { background: #0B0F19; border: 1px solid #1E293B; border-radius: 10px; padding: 1.25rem; }
.stat-card h3 { color: #94A3B8; font-size: 0.85rem; }
.stat-number { font-size: 1.8rem; font-weight: 800; color: #00A3FF; }
.text-green { color: #10B981; }

.orders-section { background: #0B0F19; border: 1px solid #1E293B; border-radius: 12px; padding: 1.25rem; }
.section-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.action-buttons-group { display: flex; gap: 0.5rem; }

.btn-export { background: rgba(16, 185, 129, 0.15); border: 1px solid #10B981; color: #10B981; padding: 0.45rem 0.85rem; border-radius: 6px; font-weight: 700; cursor: pointer; }
.btn-refresh { background: rgba(0, 163, 255, 0.15); border: 1px solid #00A3FF; color: #00A3FF; padding: 0.45rem 0.85rem; border-radius: 6px; font-weight: 700; cursor: pointer; }
.btn-add-prod { background: #0082FB; border: none; color: #FFF; padding: 0.5rem 1rem; border-radius: 6px; font-weight: 700; cursor: pointer; }

.filters-bar { display: flex; gap: 1rem; margin-bottom: 1rem; align-items: center; flex-wrap: wrap; background: #070A13; padding: 0.75rem; border-radius: 8px; border: 1px solid #1E293B; }
.search-box { flex-grow: 1; }
.search-box input { width: 100%; background: #0B0F19; border: 1px solid #1E293B; color: #FFF; padding: 0.45rem 0.75rem; border-radius: 6px; font-size: 0.85rem; }
.filter-select { display: flex; align-items: center; gap: 0.4rem; color: #94A3B8; font-size: 0.82rem; }
.filter-select select { background: #0B0F19; border: 1px solid #1E293B; color: #FFF; padding: 0.4rem 0.6rem; border-radius: 6px; }

.table-responsive { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
.admin-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
.admin-table th { background: #070A13; color: #CBD5E1; padding: 0.75rem; text-align: left; border-bottom: 2px solid #1E293B; }
.admin-table td { padding: 0.75rem; border-bottom: 1px solid #1E293B; color: #CBD5E1; vertical-align: middle; }

.email-subtext { display: block; color: #64748B; font-size: 0.75rem; }
.code-highlight { color: #00A3FF; font-weight: 800; }
.price-cell { font-weight: 800; color: #FFF; white-space: nowrap; }

/* Estilos Corregidos para la casilla de Pago */
.badge-payment {
  background: #070A13;
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  border: 1px solid #1E293B;
  font-size: 0.78rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
}
.badge-icon { font-size: 0.9rem; }

.btn-proof { background: rgba(0, 163, 255, 0.15); border: 1px solid #00A3FF; color: #00A3FF; padding: 0.25rem 0.6rem; border-radius: 6px; font-weight: 700; cursor: pointer; white-space: nowrap; }
.no-proof { color: #64748B; font-size: 0.85rem; padding-left: 0.5rem; }

.status-select { background: #070A13; border: 1px solid #1E293B; color: #FFF; padding: 0.35rem; border-radius: 6px; font-size: 0.8rem; }
.tracking-input-group { display: flex; gap: 0.35rem; align-items: center; min-width: 230px; }
.small-input { width: 105px; background: #070A13; border: 1px solid #1E293B; color: #FFF; padding: 0.35rem; border-radius: 4px; font-size: 0.75rem; }
.btn-save-mini { background: #10B981; border: none; color: #FFF; padding: 0.35rem 0.6rem; border-radius: 4px; cursor: pointer; font-weight: bold; }

.stock-pill { padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 800; font-size: 0.78rem; }
.stock-pill.low-stock { background: rgba(255, 0, 127, 0.15); color: #FF007F; border: 1px solid #FF007F; }
.stock-pill.ok-stock { background: rgba(16, 185, 129, 0.15); color: #10B981; }

.status-pill.activo { color: #10B981; font-weight: 700; }
.status-pill.pausado { color: #FF007F; font-weight: 700; }

.table-actions { display: flex; gap: 0.35rem; }
.btn-edit { background: rgba(0, 163, 255, 0.15); border: 1px solid #00A3FF; color: #00A3FF; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer; }
.btn-toggle { background: #1E293B; border: none; color: #FFF; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer; }
.btn-delete { background: rgba(255, 0, 127, 0.15); border: 1px solid #FF007F; color: #FF007F; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer; }

.modal-backdrop { position: fixed; inset: 0; background: rgba(7, 10, 19, 0.85); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 200; }
.modal-card { background: #0B0F19; border: 1px solid #1E293B; border-radius: 12px; padding: 1.5rem; width: 92%; max-width: 550px; }
.prod-form { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.3rem; }
.form-group label { color: #CBD5E1; font-size: 0.8rem; font-weight: 600; }
.form-group input, .form-group select, .form-group textarea { background: #070A13; border: 1px solid #1E293B; color: #FFF; padding: 0.55rem; border-radius: 6px; font-size: 0.85rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem; }
.btn-save { background: #10B981; border: none; color: #FFF; font-weight: 700; padding: 0.6rem 1.1rem; border-radius: 6px; cursor: pointer; }
.btn-cancel { background: transparent; border: 1px solid #1E293B; color: #94A3B8; padding: 0.6rem 1.1rem; border-radius: 6px; cursor: pointer; }

.proof-modal-card { background: #0B0F19; border: 1px solid #1E293B; border-radius: 12px; padding: 1.25rem; max-width: 500px; }
.modal-head { display: flex; justify-content: space-between; align-items: center; color: #FFF; margin-bottom: 0.85rem; }
.btn-close { background: transparent; border: none; color: #94A3B8; font-size: 1.2rem; cursor: pointer; }
.modal-img-container img { max-width: 100%; border-radius: 8px; }
.loading-box, .empty-box { padding: 2rem; text-align: center; color: #94A3B8; }
</style>