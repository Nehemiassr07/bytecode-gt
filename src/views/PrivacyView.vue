<template>
  <div class="legal-page-container">
    <div class="legal-card">
      <div class="legal-header">
        <div>
          <h1>Política de Privacidad</h1>
          <span class="version-badge">BYTECODEGT • E-COMMERCE & PROTECCIÓN DE DATOS</span>
        </div>
        <span class="updated-date">Última actualización: Agosto 2026</span>
      </div>

      <div class="legal-body">
        <p>
          En <strong>BYTECODEGT</strong> nos tomamos muy en serio la seguridad y la confidencialidad de tus datos personales. Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos tu información cuando utilizas nuestro sitio web, solicitas cotizaciones en PDF o realizas compras de equipos de cómputo, redes y videovigilancia.
        </p>

        <section>
          <h2>1. INFORMACIÓN QUE RECOPILAMOS</h2>
          <p>
            <strong>• Datos de Contacto y Entrega:</strong> Al realizar una compra o solicitar una orden, recopilamos tu nombre completo, dirección exacta de envío, número de teléfono/WhatsApp y correo electrónico.
          </p>
          <p>
            <strong>• Comprobantes de Pago:</strong> Para pagos vía transferencia bancaria o depósito, recopilamos los archivos o imágenes de comprobantes adjuntos con el fin único de validar la transacción con nuestras cuentas (Banrural, BI).
          </p>
          <p>
            <strong>• Datos Técnicos Mínimos:</strong> Al navegar en nuestra plataforma, nuestros servidores pueden registrar direcciones IP, tipo de navegador y registros de sesión con fines exclusivos de seguridad y prevención de fraudes.
          </p>
        </section>

        <section>
          <h2>2. USO DE TU INFORMACIÓN</h2>
          <p>La información recopilada se utiliza estrictamente para los siguientes fines operativos:</p>
          <p>• Procesar, preparar y despachar tus pedidos de hardware y tecnología.</p>
          <p>• Notificarte el estado de tu compra, confirmación de orden y número de guía de envío por correo electrónico o WhatsApp.</p>
          <p>• Generar automáticamente cotizaciones formales en formato PDF y comprobantes de venta.</p>
          <p>• Brindarte soporte técnico postventa y gestión de garantías.</p>
        </section>

        <section>
          <h2>3. COMPARTICIÓN DE DATOS CON TERCEROS</h2>
          <p>
            <strong>BYTECODEGT no vende, alquila ni comercializa tus datos personales con ninguna empresa o tercero para fines publicitarios.</strong>
          </p>
          <p>Tus datos son compartidos únicamente bajo las siguientes circunstancias indispensables:</p>
          <p>
            • <strong>Empresas de Logística y Encomienda:</strong> Compartimos exclusivamente tu Nombre, Dirección y Teléfono con las empresas de transporte asociadas (Cargo Expreso, Guatex o mensajeros locales) para garantizar la entrega física de tus paquetes.
          </p>
          <p>
            • <strong>Servicios de Infraestructura:</strong> Utilizamos proveedores tecnológicos seguros (Base de datos Supabase, envío de correos EmailJS) bajo altos estándares de cifrado y protección de información.
          </p>
        </section>

        <section>
          <h2>4. ALMACENAMIENTO Y SEGURIDAD</h2>
          <p>
            Toda la información ingresada en el checkout y la gestión de órdenes se procesa mediante conexiones cifradas (HTTPS/SSL). El acceso a los datos de pedidos está restringido exclusivamente al personal administrativo autorizado para la preparación de encomiendas.
          </p>
        </section>

        <section>
          <h2>5. TUS DERECHOS Y CONTACTO</h2>
          <p>
            Tienes derecho a solicitar la verificación, corrección o eliminación de tus registros de usuario y compras en nuestro sistema. Para cualquier consulta referente a tus datos personales, puedes comunicarte directamente con nuestro equipo de atención a través de las líneas oficiales de WhatsApp o correo corporativo de BYTECODEGT.
          </p>
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
  color: #38bdf8;
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