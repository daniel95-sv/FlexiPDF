import { useState } from 'react';

export function Contact() {
  const [answer, setAnswer] = useState('');
  const [isHuman, setIsHuman] = useState(false);
  const [error, setError] = useState(false);

  // Un simple desafío matemático para evitar bots básicos
  const checkAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim() === '8') {
      setIsHuman(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>Contacto</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Ponte en contacto con el creador de FlexiPDF.
        </p>
      </div>

      <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', width: '100%', maxWidth: '500px', textAlign: 'center' }}>
        {!isHuman ? (
          <form onSubmit={checkAnswer}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#334155' }}>
              Verificación de Seguridad
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>
              Para evitar el spam de bots automáticos, por favor resuelve este sencillo problema matemático antes de ver el correo:
            </p>
            
            <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary)' }}>
              ¿Cuánto es 5 + 3?
            </div>
            
            <input 
              type="text" 
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Escribe tu respuesta aquí"
              style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: error ? '2px solid #ef4444' : '2px solid #e2e8f0', fontSize: '1.1rem', textAlign: 'center', marginBottom: '1rem' }}
            />
            
            {error && <p style={{ color: '#ef4444', marginBottom: '1rem', fontWeight: 500 }}>Respuesta incorrecta, intenta de nuevo.</p>}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '1.1rem' }}>
              Verificar
            </button>
          </form>
        ) : (
          <div className="animate-fade-in">
            <div style={{ width: '60px', height: '60px', background: '#ecfdf5', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#0f172a' }}>Verificación Exitosa</h3>
            <p style={{ color: '#475569', marginBottom: '1.5rem' }}>Puedes enviar tus sugerencias o reportar errores al siguiente correo electrónico del creador:</p>
            
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', wordBreak: 'break-all' }}>
              <a href="mailto:sa18-009-002@esfe.agape.edu.sv" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>
                sa18-009-002@esfe.agape.edu.sv
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
