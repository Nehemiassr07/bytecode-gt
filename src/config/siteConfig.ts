export interface Categoria {
  id: string
  nombre: string
  slug: string
  icono: string
}

export interface SiteConfig {
  nombreEmpresa: string
  eslogan: string
  whatsapp: string
  colores: {
    primario: string      // Azul Eléctrico (Logo)
    secundario: string    // Cian Neón (Logo)
    acentoFucsia: string  // Fucsia Neón
    fondo: string
    tarjeta: string
  }
  categorias: Categoria[]
}

export const siteConfig: SiteConfig = {
  nombreEmpresa: "BYTECODE GT",
  eslogan: "Cómputo, Redes & Videovigilancia",
  whatsapp: "50231154903", // Cambia por el número receptor de pedidos
  colores: {
    primario: "#0082FB",
    secundario: "#00A3FF",
    acentoFucsia: "#FF007F",
    fondo: "#070A13",
    tarjeta: "#0B0F19"
  },
  categorias: [
    { id: "1", nombre: "Laptops y Equipos", slug: "laptops", icono: "💻" },
    { id: "2", nombre: "Almacenamiento", slug: "almacenamiento", icono: "💾" },
    { id: "3", nombre: "Periféricos y Accesorios", slug: "perifericos", icono: "🎧" },
    { id: "4", nombre: "Redes y Conectividad", slug: "redes", icono: "📡" },
    { id: "5", nombre: "Cámaras y Seguridad", slug: "seguridad", icono: "🎥" }
  ]
}