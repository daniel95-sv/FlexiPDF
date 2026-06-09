export function AboutUs() {
  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center', letterSpacing: '-1px' }}>About Us</h1>
      
      <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', lineHeight: 1.8, fontSize: '1.1rem', color: '#334155' }}>
        <p style={{ marginBottom: '1.5rem' }}>
          Bienvenido a <strong>FlexiPDF</strong>, la alternativa revolucionaria y de código abierto para la gestión de documentos PDF.
        </p>
        
        <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>Nuestra Misión</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Creemos firmemente que la privacidad digital es un derecho fundamental, no un lujo. La mayoría de las herramientas gratuitas en internet procesan tus documentos confidenciales (contratos, identificaciones, estados financieros) subiéndolos a servidores desconocidos. Nuestra misión es ofrecer las mismas capacidades profesionales sin comprometer tu seguridad.
        </p>

        <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>¿Cómo funciona?</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          A diferencia de los servicios tradicionales, FlexiPDF utiliza una arquitectura <strong>100% Client-Side</strong>. Esto significa que cuando editas, unes o comprimes un PDF, todo el cálculo matemático ocurre directamente en la memoria RAM de tu propio navegador web (tu computadora o celular).
        </p>
        <p style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--primary)', fontStyle: 'italic' }}>
          "Tus documentos nunca salen de tu dispositivo. Jamás vemos, guardamos ni tocamos tus archivos."
        </p>

        <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>Gratis y Open Source</h2>
        <p>
          Este proyecto se mantiene gratuito gracias a que no requerimos pagar costosos servidores de almacenamiento. Al procesar todo de forma local, podemos ofrecerte conversiones y manipulaciones de PDF sin límites de peso y sin cobrarte suscripciones mensuales.
        </p>
      </div>
    </div>
  );
}
