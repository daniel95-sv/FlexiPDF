export function Terms() {
  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center', letterSpacing: '-1px' }}>Terms of Use</h1>
      
      <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', lineHeight: 1.8, fontSize: '1.1rem', color: '#334155' }}>
        <p style={{ marginBottom: '1.5rem', color: '#64748b', fontSize: '0.95rem' }}>Última actualización: Junio de 2026</p>
        
        <p style={{ marginBottom: '1.5rem' }}>
          Al acceder y utilizar <strong>FlexiPDF</strong>, aceptas cumplir con los siguientes Términos de Uso. Por favor, léelos cuidadosamente.
        </p>

        <h3 style={{ fontSize: '1.3rem', color: '#0f172a', marginTop: '1.5rem', marginBottom: '0.75rem' }}>1. Naturaleza del Servicio</h3>
        <p style={{ marginBottom: '1.5rem' }}>
          FlexiPDF es una plataforma gratuita basada en tecnologías del lado del cliente (Client-Side). Las herramientas proporcionadas están diseñadas para ejecutarse localmente en su dispositivo. El servicio se proporciona "tal cual", sin garantías expresas o implícitas sobre la perfección visual de las conversiones complejas (ejemplo: extracciones de Word o Excel, las cuales son procesadas como "Best-Effort").
        </p>

        <h3 style={{ fontSize: '1.3rem', color: '#0f172a', marginTop: '1.5rem', marginBottom: '0.75rem' }}>2. Responsabilidad de los Archivos</h3>
        <p style={{ marginBottom: '1.5rem' }}>
          Dado que los archivos son manipulados exclusivamente en el navegador del usuario y no en nuestros servidores, el usuario asume la responsabilidad total de cualquier pérdida de datos, corrupción de archivos originales o uso indebido de las herramientas (como las funciones de borrado "Redact" o alteración de metadata). Recomendamos siempre trabajar sobre copias de sus documentos importantes.
        </p>

        <h3 style={{ fontSize: '1.3rem', color: '#0f172a', marginTop: '1.5rem', marginBottom: '0.75rem' }}>3. Uso Aceptable</h3>
        <p style={{ marginBottom: '1.5rem' }}>
          Usted acepta no utilizar las herramientas de FlexiPDF para falsificar documentos legales, suplantar identidades, alterar pruebas incriminatorias, o violar leyes de derechos de autor. Las herramientas de edición, firma electrónica e inyección de texto están diseñadas para fines legales y de productividad.
        </p>

        <h3 style={{ fontSize: '1.3rem', color: '#0f172a', marginTop: '1.5rem', marginBottom: '0.75rem' }}>4. Disponibilidad y Costos</h3>
        <p>
          FlexiPDF es y seguirá siendo gratuito bajo su arquitectura principal actual. Nos reservamos el derecho de modificar o discontinuar funciones específicas en caso de que integraciones de terceros (ej. servidores backend para algoritmos criptográficos) se vuelvan insostenibles.
        </p>
      </div>
    </div>
  );
}
