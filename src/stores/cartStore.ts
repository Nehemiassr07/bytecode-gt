import { ref, computed } from 'vue'

export interface ProductoCarrito {
  id: string
  nombre: string
  precio: number
  cantidad: number
  imagen?: string
  stock: number
}

const items = ref<ProductoCarrito[]>([])

const totalArticulos = computed<number>(() =>
  items.value.reduce((acc, item) => acc + item.cantidad, 0)
)

const subtotal = computed<number>(() =>
  items.value.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)
)

const impuestos = computed<number>(() => subtotal.value * 0.12)

const total = computed<number>(() => subtotal.value + impuestos.value)

function agregarProducto(producto: { id: string; nombre: string; precio: number; stock: number; imagenes?: string[] }) {
  const existente = items.value.find(i => i.id === producto.id)
  if (existente) {
    if (existente.cantidad < producto.stock) {
      existente.cantidad++
    }
  } else {
    items.value.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      cantidad: 1,
      imagen: producto.imagenes?.[0]
    })
  }
}

function actualizarCantidad(id: string, nuevaCantidad: number) {
  const item = items.value.find(i => i.id === id)
  if (item) {
    if (nuevaCantidad <= 0) {
      eliminarProducto(id)
    } else if (nuevaCantidad <= item.stock) {
      item.cantidad = nuevaCantidad
    }
  }
}

function eliminarProducto(id: string) {
  items.value = items.value.filter(i => i.id !== id)
}

function vaciarCarrito() {
  items.value = []
}

export function useCartStore() {
  return {
    items,
    totalArticulos,
    subtotal,
    impuestos,
    total,
    agregarProducto,
    actualizarCantidad,
    eliminarProducto,
    vaciarCarrito
  }
}