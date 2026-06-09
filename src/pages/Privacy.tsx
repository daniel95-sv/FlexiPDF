export function Privacy() {
  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center', letterSpacing: '-1px' }}>Privacy Policy</h1>
      
      <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', lineHeight: 1.8, fontSize: '1.1rem', color: '#334155' }}>
        <p style={{ marginBottom: '1.5rem', color: '#64748b', fontSize: '0.95rem' }}>Última actualización: Junio de 2026</p>
        
        <p style={{ marginBottom: '1.5rem' }}>
          La privacidad de tus datos es la razón de ser de <strong>FlexiPDF</strong>. Esta política explica de forma clara y directa cómo manejamos (o más bien, cómo NO manejamos) tu información.
        </p>

        <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>Procesamiento Local (Client-Side)</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          A diferencia de los procesadores de PDF en la nube, el 99% de las herramientas de FlexiPDF (incluyendo OCR y Resumidor de Inteligencia Artificial) se descargan como scripts en tu navegador web. Cuando "subes" un archivo a nuestra plataforma, este nunca viaja a través de internet. <strong>Tus archivos PDF son procesados utilizando el hardware de tu propia computadora o teléfono inteligente.</strong>
        </p>

        <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>¿Qué información recopilamos?</h2>
        <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
          <li style={{ marginBottom: '0.5rem' }}><strong>Archivos PDF:</strong> NINGUNA. No vemos, interceptamos, analizamos ni almacenamos los documentos que procesas.</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Datos Personales:</strong> NINGUNA. No requerimos cuentas, ni correos, ni tarjetas de crédito para usar la plataforma.</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Analíticas Básicas:</strong> Utilizamos servicios de análisis estándar de la industria (provistos por Cloudflare Pages) única y exclusivamente para medir el tráfico web (conocer cuántas visitas recibe la página), de manera completamente anónima.</li>
        </ul>

        <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>Excepciones Técnicas</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          La única herramienta que requiere comunicación con nuestros servidores Cloudflare backend es la protección de grado militar (Protect PDF), debido a las limitaciones matemáticas del navegador para encriptar mediante algoritmos AES-256 complejos. En dicho caso, el archivo sube, se encripta e instantáneamente se destruye de la memoria volatil del servidor sin ser almacenado en ningún disco duro.
        </p>

        <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px' }}>
          <h4 style={{ color: '#16a34a', margin: 0, marginBottom: '0.5rem' }}>Garantía Open Source</h4>
          <p style={{ margin: 0, fontSize: '1rem' }}>
            Nuestra promesa de privacidad no se basa en confiar en nuestra palabra. Todo nuestro código fuente es público y de código abierto. Cualquier desarrollador o auditor de ciberseguridad puede verificar que no existe código malicioso ni transferencias de datos ocultas.
          </p>
        </div>
      </div>
    </div>
  );
}
