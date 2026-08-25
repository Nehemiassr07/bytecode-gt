<template>
  <div class="legal-page-container">
    <div class="legal-card">
      <div class="legal-header">
        <div>
          <h1>Términos y Condiciones de Servicio</h1>
          <span class="version-badge">BYTECODEGT • E-COMMERCE LEGAL</span>
        </div>
        <span class="updated-date">Última actualización: Agosto 2026</span>
      </div>

      <div class="legal-body">
        <p>
          Bienvenido a <strong>BYTECODEGT</strong>. Al utilizar nuestra plataforma web, generar cotizaciones en PDF, registrar pedidos o adquirir equipos de cómputo, redes y videovigilancia, aceptas cumplir con los siguientes Términos y Condiciones.
        </p>

        <section>
          <h2>1. PRECIOS, INVENTARIO Y ERRORES TIPOGRÁFICOS</h2>
          <p>• Todos los precios están expresados en <strong>Quetzales (Q)</strong> e incluyen el Impuesto al Valor Agregado (IVA 12%).</p>
          <p>• El inventario y los precios están sujetos a cambios sin previo aviso debido a la fluctuación de costos de importación.</p>
          <p>• <em>Protección por error evidente:</em> En caso de un error tipográfico o fallo de sistema en la publicación del precio de un producto, BYTECODEGT se reserva el derecho de cancelar la orden y reembolsar cualquier monto pagado sin obligación de entrega.</p>
        </section>

        <section>
          <h2>2. PROCESAMIENTO DE PEDIDOS Y PAGOS</h2>
          <p>• <strong>Pago Contra Entrega:</strong> Disponible únicamente para zonas con cobertura directa autorizada. El cliente se compromete a cancelar el monto exacto en efectivo al momento de la entrega.</p>
          <p>• <strong>Transferencias / Depósitos:</strong> Los pedidos pagados vía transferencia bancaria (Banrural, BI) requieren la verificación manual del comprobante adjunto antes del despacho.</p>
        </section>

        <section>
          <h2>3. ENVÍOS Y DESPACHO POR ENCOMIENDA</h2>
          <p>• Los envíos fuera de la capital o zona central se realizan mediante empresas de transporte asociadas (Guatex, Cargo Expreso, etc.).</p>
          <p>• Una vez que el paquete es entregado a la empresa de transporte y se genera el número de guía, los tiempos exactos de entrega y el manejo físico quedan bajo la responsabilidad operativa de la logística contratada.</p>
        </section>

        <section>
          <h2>4. POLÍTICA DE GARANTÍAS Y DEVOLUCIONES</h2>
          <p>• Todos los equipos nuevos cuentan con garantía limitada por defectos de fábrica.</p>
          <p>• <strong>Exclusiones de Garantía:</strong> La garantía no cubre daños causados por picos de voltaje, sobretensiones eléctricas, humedad, desgaste natural, modificaciones de firmware o mala instalación técnica por parte del comprador.</p>
        </section>

        <section>
          <h2>5. LIMITACIÓN DE RESPONSABILIDAD TÉCNICA</h2>
          <p>• BYTECODEGT no se hace responsable por pérdida de información contenida en discos duros, sistemas de almacenamiento o mal uso e interrupciones en sistemas de videovigilancia configurados por terceros.</p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.legal-page-container {
  min-height: 100vh;
  padding: 3rem 1.5rem;
  display: flex;
  justify-content: center;
  background: radial-gradient(circle at top, #1e293b 0%, #0f172a 100%);
}

.legal-card {
  max-width: 900px;
  width: 100%;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2.5rem;
  color: #cbd5e1;
}

.legal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
}

.legal-header h1 {
  color: #f8fafc;
  font-size: 2rem;
  margin: 0;
}

.version-badge {
  display: inline-block;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #10b981;
  letter-spacing: 0.05em;
}

.updated-date {
  font-size: 0.85rem;
  color: #64748b;
}

.legal-body p {
  line-height: 1.7;
  margin-bottom: 0.85rem;
}

.legal-body section {
  margin-top: 2rem;
}

.legal-body h2 {
  color: #f1f5f9;
  font-size: 1.05rem;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}
</style>