<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { siteConfig } from '../config/siteConfig'
import { useCartStore } from '../stores/cartStore'
import { supabase } from '../lib/supabaseClient'

interface Producto {
  id: string
  sku: string
  nombre: string
  descripcion: string
  precio: number
  stock: number
  categoria_slug: string
  especificaciones?: Record<string, string>
  imagenes: string[]
  activo: boolean
}

const {
  items: cartItems,
  totalArticulos,
  subtotal,
  impuestos,
  total,
  agregarProducto: agregarAlCarritoStore,
  actualizarCantidad,
  vaciarCarrito
} = useCartStore()

const productos = ref<Producto[]>([])
const cargando = ref(true)
const categoriaActiva = ref<string>('todos')
const busqueda = ref('')

const cartOpen = ref(false)
const checkoutOpen = ref(false)
const productoDetalle = ref<Producto | null>(null)

// Mejora 2: Toast notification state
const toastMensaje = ref('')
const mostrarToast = ref(false)
let toastTimer: any = null

function agregarProductoConToast(prod: Producto) {
  agregarAlCarritoStore(prod)
  toastMensaje.value = `¡${prod.nombre} agregado al carrito!`
  toastMensaje.value = `¡${prod.nombre} agregado al carrito!`
  mostrarToast.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    mostrarToast.value = false
  }, 3000)
}

// Mejora 3: Post-purchase order confirmation state
const ordenCreadaModal = ref(false)
const ordenCreadaCodigo = ref('')
const ordenCreadaUrlWa = ref('')
const copiadoExito = ref(false)

const datosCliente = ref({
  nombre: '',
  telefono: '',
  email: '',
  direccion: '',
  departamento: 'Suchitepéquez',
  municipio: 'Chicacao'
})
const metodoPago = ref<'contra_entrega' | 'transferencia'>('contra_entrega')
const comprobanteFile = ref<File | null>(null)
const procesandoOrden = ref(false)

onMounted(async () => {
  await cargarProductos()
})

async function cargarProductos() {
  cargando.value = true
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*, categorias(slug)')
      .eq('activo', true)

    if (!error && data && data.length > 0) {
      productos.value = data.map((p: any) => {
        let slug = p.categorias?.slug || ''
        if (!slug && p.sku) {
          if (p.sku.startsWith('COMP')) slug = 'laptops'
          else if (p.sku.startsWith('ALM')) slug = 'almacenamiento'
          else if (p.sku.startsWith('ACC')) slug = 'perifericos'
          else if (p.sku.startsWith('RED')) slug = 'redes'
          else if (p.sku.startsWith('CAM')) slug = 'seguridad'
        }
        return {
          ...p,
          precio: Number(p.precio),
          categoria_slug: slug
        }
      })
    }
  } catch (err) {
    console.error('Error cargando productos:', err)
  } finally {
    cargando.value = false
  }
}

const productosFiltrados = computed(() => {
  return productos.value.filter(p => {
    const cat = categoriaActiva.value
    let coincideCat = false

    if (cat === 'todos') {
      coincideCat = true
    } else if (cat === 'laptops' || cat === 'computo') {
      coincideCat = p.categoria_slug === 'laptops' || p.categoria_slug === 'computo'
    } else if (cat === 'almacenamiento' || cat === 'herramientas') {
      coincideCat = p.categoria_slug === 'almacenamiento' || p.categoria_slug === 'herramientas'
    } else if (cat === 'perifericos' || cat === 'accesorios') {
      coincideCat = p.categoria_slug === 'perifericos' || p.categoria_slug === 'accesorios'
    } else if (cat === 'redes') {
      coincideCat = p.categoria_slug === 'redes'
    } else if (cat === 'seguridad' || cat === 'video-vigilancia') {
      coincideCat = p.categoria_slug === 'seguridad' || p.categoria_slug === 'video-vigilancia'
    } else {
      coincideCat = p.categoria_slug === cat
    }

    const texto = `${p.nombre} ${p.sku || ''} ${p.descripcion}`.toLowerCase()
    const coincideBusqueda = texto.includes(busqueda.value.toLowerCase())

    return coincideCat && coincideBusqueda
  })
})

function generarCotizacionPDF() {
  if (cartItems.value.length === 0) return

  const fecha = new Date().toLocaleDateString('es-GT')
  const correlativo = `COT-${Math.floor(100000 + Math.random() * 900000)}`

  const filasHtml = cartItems.value.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.nombre}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.cantidad}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">Q${item.precio.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">Q${(item.precio * item.cantidad).toFixed(2)}</td>
    </tr>
  `).join('')

  const contenidoWindow = window.open('', '_blank')
  if (contenidoWindow) {
    contenidoWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Cotización Formal - ${correlativo}</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 40px; color: #1E293B; }
          .header { display: flex; justify-content: space-between; border-bottom: 3px solid #0082FB; padding-bottom: 15px; margin-bottom: 25px; }
          .logo { font-size: 26px; font-weight: bold; color: #0082FB; }
          .info { text-align: right; font-size: 13px; color: #64748B; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #0082FB; color: white; padding: 10px; text-align: left; font-size: 13px; }
          .totals { margin-top: 25px; text-align: right; font-size: 15px; }
          .totals strong { font-size: 19px; color: #0082FB; }
          .footer { margin-top: 40px; font-size: 11px; color: #94A3B8; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">BYTECODE GT</div>
            <div style="font-size: 12px; color: #64748B;">Cómputo, Redes & Videovigilancia</div>
          </div>
          <div class="info">
            <strong style="font-size: 15px; color: #0F172A;">COTIZACIÓN FORMAL</strong><br>
            N°: ${correlativo}<br>
            Fecha: ${fecha}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th style="text-align: center;">Cantidad</th>
              <th style="text-align: right;">Precio Unitario</th>
              <th style="text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${filasHtml}
          </tbody>
        </table>

        <div class="totals">
          <p>Subtotal: Q${subtotal.value.toFixed(2)}</p>
          <p>IVA (12%): Q${impuestos.value.toFixed(2)}</p>
          <p><strong>Total Cotizado: Q${total.value.toFixed(2)}</strong></p>
        </div>

        <div class="footer">
          <p>Validez de cotización: 15 días. Precios sujetos a disponibilidad de stock.</p>
          <p>BYTECODE GT • Chicacao, Suchitepéquez, Guatemala</p>
        </div>
      </body>
      </html>
    `)
    contenidoWindow.document.close()
    contenidoWindow.focus()
    setTimeout(() => { contenidoWindow.print() }, 250)
  }
}
async function procesarPedido() {
  if (
    !datosCliente.value.nombre || 
    !datosCliente.value.telefono || 
    !datosCliente.value.direccion || 
    !datosCliente.value.email
  ) {
    alert('Por favor completa todos los campos obligatorios, incluyendo tu Correo Electrónico.')
    return
  }

  procesandoOrden.value = true
  const codigoOrden = `ORD-${Math.floor(100000 + Math.random() * 900000)}`

  try {
    let comprobantePublicUrl: string | null = null

    if (metodoPago.value === 'transferencia' && comprobanteFile.value) {
      const file = comprobanteFile.value
      const fileExt = file.name.split('.').pop()
      const fileName = `${codigoOrden}-${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('comprobantes')
        .upload(fileName, file, { cacheControl: '3600', upsert: true })

      if (!uploadErr && uploadData) {
        const { data: publicData } = supabase.storage
          .from('comprobantes')
          .getPublicUrl(uploadData.path)
        comprobantePublicUrl = publicData.publicUrl
      }
    }

    const { error: dbErr } = await supabase.from('ordenes').insert([{
      codigo_orden: codigoOrden,
      cliente_nombre: datosCliente.value.nombre,
      cliente_telefono: datosCliente.value.telefono,
      cliente_email: datosCliente.value.email,
      direccion: datosCliente.value.direccion,
      departamento: datosCliente.value.departamento,
      municipio: datosCliente.value.municipio,
      metodo_pago: metodoPago.value,
      comprobante_url: comprobantePublicUrl,
      estado: 'Confirmado',
      total: total.value
    }])

    if (dbErr) throw dbErr

    const productosTexto = cartItems.value.map(i => `• ${i.cantidad}x ${i.nombre}`).join('\n')
    let msj = `Hola BytecodeGt! He realizado la Orden *${codigoOrden}*\n\n` +
              `*Cliente:* ${datosCliente.value.nombre}\n` +
              `*Teléfono:* ${datosCliente.value.telefono}\n` +
              `*Correo:* ${datosCliente.value.email}\n` +
              `*Dirección:* ${datosCliente.value.direccion}, ${datosCliente.value.municipio}\n` +
              `*Pago:* ${metodoPago.value === 'contra_entrega' ? 'Pago Contra Entrega' : 'Transferencia Bancaria'}\n\n` +
              `*Productos:* \n${productosTexto}\n\n` +
              `*Total:* Q${total.value.toFixed(2)}`

    if (comprobantePublicUrl) {
      msj += `\n\n*Comprobante Adjunto:* ${comprobantePublicUrl}`
    }

    ordenCreadaCodigo.value = codigoOrden
    ordenCreadaUrlWa.value = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(msj)}`

    vaciarCarrito()
    checkoutOpen.value = false
    cartOpen.value = false
    comprobanteFile.value = null

    ordenCreadaModal.value = true
  } catch (err) {
    console.error('Error al procesar la orden:', err)
    alert('Ocurrió un error al registrar la orden.')
  } finally {
    procesandoOrden.value = false
  }
}

function copiarCodigo() {
  navigator.clipboard.writeText(ordenCreadaCodigo.value)
  copiadoExito.value = true
  setTimeout(() => { copiadoExito.value = false }, 2500)
}

function handleFileUpload(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    comprobanteFile.value = target.files[0]
  }
}
</script>

<template>
  <div class="tienda-view">
    <!-- Toast Notification (Mejora 2) -->
    <Transition name="toast">
      <div v-if="mostrarToast" class="toast-notification">
        <span class="toast-icon">✨</span>
        <span class="toast-text">{{ toastMensaje }}</span>
      </div>
    </Transition>

    <section class="tienda-hero">
      <div class="container hero-container-flex">
        <div class="hero-logo-box">
          <img src="/logo.png" alt="BYTECODEGT Logo" class="hero-logo-img" />
        </div>

        <span class="badge-tech-neon">⚡ Catálogo de Alta Tecnología</span>
        <h1>Equipos de Cómputo, Redes & Video Vigilancia</h1>
        <p>Soluciones integrales para empresas, instaladores y profesionales en Guatemala.</p>

        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            v-model="busqueda" 
            placeholder="Buscar por producto, marca o código de parte (ej. Cat6, Hikvision, Switch)..." 
          />
        </div>
      </div>
    </section>

    <div class="container main-content-layout">
      <div class="categories-bar">
        <button 
          class="cat-chip" 
          :class="{ active: categoriaActiva === 'todos' }" 
          @click="categoriaActiva = 'todos'"
        >
          🌐 Todos los Productos
        </button>

        <button 
          v-for="cat in siteConfig.categorias" 
          :key="cat.id" 
          class="cat-chip"
          :class="{ active: categoriaActiva === cat.slug }"
          @click="categoriaActiva = cat.slug"
        >
          {{ cat.icono }} {{ cat.nombre }}
        </button>
      </div>

      <div v-if="cargando" class="loading-box">
        <p>Cargando inventario de BytecodeGt...</p>
      </div>

      <div v-else-if="productosFiltrados.length === 0" class="empty-box">
        <p>No se encontraron productos en esta categoría o búsqueda.</p>
      </div>

      <div v-else class="products-grid">
        <div v-for="p in productosFiltrados" :key="p.id" class="product-card">
          <div class="product-img-box" @click="productoDetalle = p">
            <img :src="p.imagenes[0] || 'https://via.placeholder.com/300'" :alt="p.nombre" />
            <span v-if="p.stock <= 3" class="stock-warning-fucsia">🔥 ¡Últimas unidades!</span>
          </div>

          <div class="product-info">
            <small v-if="p.sku" class="code-tag">SKU: {{ p.sku }}</small>
            <h3 @click="productoDetalle = p">{{ p.nombre }}</h3>
            <p class="desc-short">{{ p.descripcion }}</p>

            <div class="product-bottom">
              <div class="price-box">
                <span class="currency">Q</span>
                <span class="amount">{{ p.precio.toFixed(2) }}</span>
              </div>

              <button class="btn-add-cart" @click="agregarProductoConToast(p)">
                🛒 Agregar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Detalle de Producto -->
    <div v-if="productoDetalle" class="modal-backdrop" @click.self="productoDetalle = null">
      <div class="specs-modal-card">
        <button class="btn-close-modal" @click="productoDetalle = null">✕</button>
        <div class="specs-grid">
          <div class="modal-img-box">
            <img :src="productoDetalle.imagenes[0]" :alt="productoDetalle.nombre" />
          </div>
          <div class="modal-details">
            <span class="code-tag">SKU: {{ productoDetalle.sku || 'N/A' }}</span>
            <h2>{{ productoDetalle.nombre }}</h2>
            <p class="modal-desc">{{ productoDetalle.descripcion }}</p>

            <div class="stock-status" :class="{ ok: productoDetalle.stock > 0 }">
              <span>● Stock Disponible: <strong>{{ productoDetalle.stock }} unidades</strong></span>
            </div>

            <div v-if="productoDetalle.especificaciones" class="tech-table">
              <h4>Especificaciones Técnicas:</h4>
              <ul>
                <li v-for="(val, key) in productoDetalle.especificaciones" :key="key">
                  <strong>{{ key }}:</strong> {{ val }}
                </li>
              </ul>
            </div>

            <div class="modal-bottom">
              <span class="modal-price">Q{{ productoDetalle.precio.toFixed(2) }}</span>
              <button class="btn-confirm" @click="agregarProductoConToast(productoDetalle); productoDetalle = null; cartOpen = true">
                🛒 Añadir al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón Flotante Carrito -->
    <button class="cart-trigger-btn" @click="cartOpen = true">
      🛒 <span class="badge-fucsia">{{ totalArticulos }}</span>
    </button>

    <!-- Sidebar Carrito -->
    <div v-if="cartOpen" class="cart-drawer-backdrop" @click.self="cartOpen = false">
      <div class="cart-drawer">
        <div class="drawer-header">
          <h2>Mi Carrito de Compras</h2>
          <button @click="cartOpen = false" class="btn-close">✕</button>
        </div>

        <div v-if="cartItems.length === 0" class="cart-empty">
          <p>Tu carrito está vacío 🛒</p>
        </div>

        <div v-else class="drawer-body">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <div class="item-details">
              <h4>{{ item.nombre }}</h4>
              <p>Q{{ item.precio.toFixed(2) }} c/u</p>
            </div>

            <div class="item-controls">
              <button @click="actualizarCantidad(item.id, item.cantidad - 1)">-</button>
              <span>{{ item.cantidad }}</span>
              <button @click="actualizarCantidad(item.id, item.cantidad + 1)">+</button>
            </div>
          </div>
        </div>

        <div v-if="cartItems.length > 0" class="drawer-footer">
          <div class="breakdown">
            <div><span>Subtotal:</span> <strong>Q{{ subtotal.toFixed(2) }}</strong></div>
            <div><span>IVA (12%):</span> <strong>Q{{ impuestos.toFixed(2) }}</strong></div>
            <div class="total-row"><span>Total:</span> <strong>Q{{ total.toFixed(2) }}</strong></div>
          </div>

          <div class="cart-actions-grid">
            <button class="btn-pdf" @click="generarCotizacionPDF">
              📄 Descargar Cotización PDF
            </button>
            <button class="btn-checkout" @click="checkoutOpen = true">
              ⚡ Procesar Orden
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Checkout -->
    <div v-if="checkoutOpen" class="modal-backdrop" @click.self="checkoutOpen = false">
      <div class="checkout-card">
        <h2>Confirmación y Entrega</h2>
        <p class="subtitle">Ingresa tus datos para procesar el despacho</p>

        <form @submit.prevent="procesarPedido" class="checkout-form">
          <div class="form-group">
            <label>Nombre Completo *</label>
            <input type="text" v-model="datosCliente.nombre" required placeholder="Ej. Juan Pérez" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Teléfono WhatsApp *</label>
              <input type="tel" v-model="datosCliente.telefono" required placeholder="Ej. 55554444" />
            </div>
            <div class="form-group">
              <label>Correo Electrónico *</label>
              <input type="email" v-model="datosCliente.email" required placeholder="cliente@correo.com" />
            </div>
          </div>

          <div class="form-group">
            <label>Dirección Exacta de Entrega *</label>
            <input type="text" v-model="datosCliente.direccion" required placeholder="Calle, avenida, zona, número de casa" />
          </div>

          <div class="form-group">
            <label>Método de Pago *</label>
            <div class="payment-options">
              <label :class="{ active: metodoPago === 'contra_entrega' }">
                <input type="radio" value="contra_entrega" v-model="metodoPago" />
                💵 Pago Contra Entrega
              </label>
              <label :class="{ active: metodoPago === 'transferencia' }">
                <input type="radio" value="transferencia" v-model="metodoPago" />
                🏦 Transferencia / Depósito
              </label>
            </div>
          </div>

          <div v-if="metodoPago === 'transferencia'" class="bank-details-box">
            <p><strong>Cuentas Bancarias para Depósito:</strong></p>
            <small>Banrural Monetaria: 3000-123456-7 (BytecodeGt)</small><br>
            <small>BI Monetaria: 001-987654-2 (BytecodeGt)</small>

            <div class="form-group mt-2">
              <label>Adjuntar Comprobante (Imagen/PDF)</label>
              <input type="file" @change="handleFileUpload" accept="image/*,application/pdf" />
            </div>
          </div>

          <div class="checkout-actions">
            <button type="button" @click="checkoutOpen = false" class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-confirm" :disabled="procesandoOrden">
              {{ procesandoOrden ? 'Procesando...' : 'Confirmar Orden por WhatsApp 🚀' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Confirmación de Orden Creada + Copiar Código -->
    <div v-if="ordenCreadaModal" class="modal-backdrop">
      <div class="order-success-card">
        <div class="success-icon-badge">🎉</div>
        <h2>¡Orden Creada Exitosamente!</h2>
        <p class="success-subtitle">Guarda tu código para rastrear el envío de tu paquete:</p>

        <div class="code-copy-box">
          <span class="code-text">{{ ordenCreadaCodigo }}</span>
          <button @click="copiarCodigo" class="btn-copy">
            {{ copiadoExito ? '✅ Copiado' : '📋 Copiar' }}
          </button>
        </div>

        <div class="success-actions">
          <a 
            :href="ordenCreadaUrlWa" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="btn-wa-final"
            @click="ordenCreadaModal = false"
          >
            💬 Continuar por WhatsApp 🚀
          </a>
        </div>
      </div>
    </div>
  </div> 
</template>

<style scoped>
.tienda-view { min-height: 100vh; padding-bottom: 4rem; position: relative; }
.container { max-width: 1250px; margin: 0 auto; padding: 0 1.25rem; }

/* Toast Styles */
.toast-notification {
  position: fixed;
  top: 25px;
  right: 25px;
  background: #0B0F19;
  border: 1px solid #00A3FF;
  box-shadow: 0 0 20px rgba(0, 163, 255, 0.4);
  color: #FFF;
  padding: 0.85rem 1.25rem;
  border-radius: 10px;
  z-index: 999;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
  font-weight: 700;
}
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-20px); }

.tienda-hero {
  background: linear-gradient(180deg, #0B0F19 0%, #070A13 100%);
  padding: 2.5rem 0 2rem 0;
  text-align: center;
}

.hero-container-flex { display: flex; flex-direction: column; align-items: center; justify-content: center; }
.hero-logo-box { display: flex; justify-content: center; align-items: center; margin-bottom: 1.2rem; width: 100%; }

.hero-logo-img {
  height: 320px;
  width: auto;
  max-width: 90vw;
  object-fit: contain;
  mix-blend-mode: screen;
}

.badge-tech-neon {
  background: rgba(255, 0, 127, 0.12);
  color: #FF007F;
  border: 1px solid #FF007F;
  box-shadow: 0 0 12px rgba(255, 0, 127, 0.25);
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-block;
}

.tienda-hero h1 { font-size: 2rem; color: #FFF; margin: 1rem 0 0.4rem 0; }
.tienda-hero p { color: #94A3B8; font-size: 0.95rem; margin-bottom: 1.5rem; }

.search-box { width: 100%; max-width: 650px; margin: 0 auto; position: relative; }
.search-box input { width: 100%; padding: 0.85rem 1rem 0.85rem 2.8rem; background-color: #0B0F19; border: 1px solid #1E293B; border-radius: 10px; color: #FFF; font-size: 0.9rem; }
.search-box input:focus { outline: none; border-color: var(--color-secundario); }
.search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); opacity: 0.6; }

.categories-bar { display: flex; gap: 0.6rem; overflow-x: auto; padding: 1rem 0; margin-bottom: 1.25rem; }
.cat-chip { background: #0B0F19; border: 1px solid #1E293B; color: #CBD5E1; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.82rem; font-weight: 600; white-space: nowrap; cursor: pointer; transition: all 0.2s; }
.cat-chip.active, .cat-chip:hover { background: var(--color-primario); color: #FFF; border-color: var(--color-secundario); box-shadow: 0 0 10px rgba(0, 163, 255, 0.3); }

.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.25rem; }
.product-card { background: #0B0F19; border: 1px solid #1E293B; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
.product-card:hover { border-color: var(--color-secundario); }

.product-img-box { height: 170px; position: relative; cursor: pointer; background: #070A13; }
.product-img-box img { width: 100%; height: 100%; object-fit: cover; }

.stock-warning-fucsia { position: absolute; top: 10px; right: 10px; background: #FF007F; color: #FFF; font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 800; box-shadow: 0 0 10px rgba(255, 0, 127, 0.5); }
.product-info { padding: 1.1rem; display: flex; flex-direction: column; flex-grow: 1; }
.code-tag { color: #64748B; font-size: 0.75rem; }
.product-info h3 { color: #FFF; font-size: 0.98rem; margin: 0.25rem 0 0.4rem 0; cursor: pointer; }
.desc-short { color: #94A3B8; font-size: 0.82rem; line-height: 1.4; margin-bottom: 1rem; flex-grow: 1; }

.product-bottom { display: flex; justify-content: space-between; align-items: center; }
.price-box { color: var(--color-secundario); font-weight: 800; font-size: 1.2rem; }
.currency { font-size: 0.85rem; margin-right: 2px; }

.btn-add-cart { background: rgba(0, 163, 255, 0.15); color: var(--color-secundario); border: 1px solid var(--color-secundario); padding: 0.4rem 0.75rem; border-radius: 6px; font-weight: 700; font-size: 0.8rem; cursor: pointer; }

.modal-backdrop { position: fixed; inset: 0; background-color: rgba(7, 10, 19, 0.85); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 200; }
.specs-modal-card { background: #0B0F19; border: 1px solid #1E293B; border-radius: 14px; padding: 1.75rem; width: 92%; max-width: 750px; position: relative; }
.btn-close-modal { position: absolute; top: 15px; right: 15px; background: transparent; border: none; color: #94A3B8; font-size: 1.2rem; cursor: pointer; }
.specs-grid { display: grid; grid-template-columns: 280px 1fr; gap: 1.5rem; margin-top: 0.5rem; }
.modal-img-box img { width: 100%; border-radius: 10px; height: 220px; object-fit: cover; }
.modal-details h2 { color: #FFF; font-size: 1.25rem; margin-bottom: 0.5rem; }
.modal-desc { color: #94A3B8; font-size: 0.88rem; margin-bottom: 0.85rem; }
.stock-status { color: #10B981; font-size: 0.82rem; margin-bottom: 1rem; }
.tech-table { background: #070A13; padding: 0.85rem; border-radius: 8px; margin-bottom: 1.25rem; }
.tech-table h4 { color: #FFF; font-size: 0.85rem; margin-bottom: 0.4rem; }
.tech-table ul { list-style: none; color: #CBD5E1; font-size: 0.8rem; }
.tech-table li { margin-bottom: 0.25rem; }
.modal-bottom { display: flex; justify-content: space-between; align-items: center; }
.modal-price { color: var(--color-secundario); font-size: 1.5rem; font-weight: 800; }

.cart-trigger-btn { position: fixed; bottom: 85px; right: 20px; width: 52px; height: 52px; background: var(--color-primario); border: none; border-radius: 50%; color: #FFF; font-size: 1.4rem; cursor: pointer; box-shadow: 0 4px 16px rgba(0, 130, 251, 0.4); z-index: 98; }
.badge-fucsia { position: absolute; top: -4px; right: -4px; background: #FF007F; color: #FFF; font-size: 0.75rem; font-weight: 800; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(255, 0, 127, 0.6); }

.cart-drawer-backdrop { position: fixed; inset: 0; background: rgba(7, 10, 19, 0.8); z-index: 150; display: flex; justify-content: flex-end; }
.cart-drawer { width: 100%; max-width: 420px; background: #0B0F19; height: 100%; display: flex; flex-direction: column; padding: 1.5rem; }
.drawer-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1E293B; padding-bottom: 1rem; }
.drawer-header h2 { color: #FFF; font-size: 1.2rem; }
.btn-close { background: transparent; border: none; color: #94A3B8; font-size: 1.2rem; cursor: pointer; }
.drawer-body { flex-grow: 1; overflow-y: auto; padding: 1rem 0; }
.cart-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #1E293B; }
.item-details h4 { color: #FFF; font-size: 0.88rem; }
.item-details p { color: var(--color-secundario); font-size: 0.82rem; font-weight: 700; }
.item-controls { display: flex; align-items: center; gap: 0.5rem; }
.item-controls button { width: 26px; height: 26px; background: #1E293B; border: none; color: #FFF; border-radius: 4px; cursor: pointer; }

.drawer-footer { border-top: 1px solid #1E293B; padding-top: 1rem; }
.breakdown div { display: flex; justify-content: space-between; color: #94A3B8; font-size: 0.85rem; margin-bottom: 0.35rem; }
.total-row { color: #FFF !important; font-size: 1rem !important; }
.cart-actions-grid { display: flex; flex-direction: column; gap: 0.6rem; margin-top: 1rem; }
.btn-pdf { background: transparent; border: 1px solid var(--color-secundario); color: var(--color-secundario); padding: 0.65rem; border-radius: 8px; font-weight: 700; cursor: pointer; }
.btn-checkout { background: var(--color-primario); border: none; color: #FFF; padding: 0.75rem; border-radius: 8px; font-weight: 700; cursor: pointer; }

.checkout-card { background: #0B0F19; border: 1px solid #1E293B; border-radius: 12px; padding: 1.5rem; width: 92%; max-width: 550px; }
.checkout-card h2 { color: #FFF; font-size: 1.2rem; }
.subtitle { color: #94A3B8; font-size: 0.82rem; margin-bottom: 1rem; }

.checkout-form { display: flex; flex-direction: column; gap: 0.75rem; }
.form-group { display: flex; flex-direction: column; gap: 0.3rem; }
.form-group label { color: #CBD5E1; font-size: 0.8rem; font-weight: 600; }
.form-group input[type="text"], .form-group input[type="tel"], .form-group input[type="email"] { background: #070A13; border: 1px solid #1E293B; color: #FFF; padding: 0.6rem; border-radius: 6px; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.payment-options { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.payment-options label { background: #070A13; border: 1px solid #1E293B; padding: 0.65rem; border-radius: 8px; color: #CBD5E1; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; }
.payment-options label.active { border-color: var(--color-secundario); background: rgba(0, 163, 255, 0.1); color: #FFF; }

.bank-details-box { background: rgba(0, 130, 251, 0.08); border: 1px dashed var(--color-primario); padding: 0.75rem; border-radius: 8px; color: #CBD5E1; font-size: 0.8rem; }
.checkout-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.85rem; }
.btn-confirm { background: #10B981; border: none; color: #FFF; font-weight: 700; padding: 0.65rem 1.1rem; border-radius: 6px; cursor: pointer; }
.btn-cancel { background: transparent; border: 1px solid #1E293B; color: #94A3B8; padding: 0.65rem 1.1rem; border-radius: 6px; cursor: pointer; }

/* Modal Orden Creada + Copiar Código */
.order-success-card { background: #0B0F19; border: 1px solid #00A3FF; border-radius: 14px; padding: 2rem; width: 92%; max-width: 450px; text-align: center; box-shadow: 0 0 30px rgba(0, 163, 255, 0.25); }
.success-icon-badge { font-size: 2.5rem; margin-bottom: 0.5rem; }
.order-success-card h2 { color: #FFF; font-size: 1.35rem; margin-bottom: 0.4rem; }
.success-subtitle { color: #94A3B8; font-size: 0.85rem; margin-bottom: 1.25rem; }
.code-copy-box { background: #070A13; border: 1px dashed #00A3FF; padding: 0.75rem 1rem; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.code-text { color: #00A3FF; font-weight: 800; font-size: 1.2rem; }
.btn-copy { background: rgba(0, 163, 255, 0.15); border: 1px solid #00A3FF; color: #00A3FF; padding: 0.4rem 0.85rem; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 0.8rem; }
.btn-wa-final { width: 100%; background: #10B981; border: none; color: #FFF; padding: 0.85rem; border-radius: 8px; font-weight: 800; font-size: 0.95rem; cursor: pointer; }
</style>