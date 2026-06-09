import { useState } from 'react';
import { Uploader } from '../components/Uploader/Uploader';

export function ProtectPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (files: File[]) => {
    setFile(files[0]);
    setError(null);
  };

  const executeProtect = async () => {
    if (!file || !password) return;
    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('password', password);

      // Endpoint hacia nuestro Cloudflare Worker (Fase 9 Backend)
      // Nota: En desarrollo local esto puede fallar si no estás ejecutando "wrangler dev"
      const response = await fetch('/api/protect-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('El backend (Cloudflare Worker) rechazó la solicitud o no está desplegado.');
      }

      // El Worker debería devolver el PDF binario protegido
      const blob = await response.blob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `protected_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setFile(null);
      setPassword('');
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Error al conectar con el motor de encriptación (Cloudflare). Asegúrate de que el Backend esté desplegado.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>Protect PDF</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Encrypt your PDF with a password. This secure feature requires our Cloudflare backend infrastructure.
        </p>
      </div>

      {error && (
        <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', width: '100%', maxWidth: '800px', textAlign: 'center', border: '1px solid #FCA5A5' }}>
          {error}
        </div>
      )}

      {!file ? (
        <Uploader 
          onProcess={handleFileSelect} 
          title="Select PDF file" 
          multiple={false} 
          actionText="Select"
          isProcessing={isProcessing}
        />
      ) : (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', width: '100%', maxWidth: '600px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Proteger: <strong>{file.name}</strong></h3>
          
          <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Contraseña de seguridad (AES-256):</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa una contraseña fuerte"
              style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '2px solid #eee', fontSize: '1.1rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              onClick={() => setFile(null)}
              style={{ padding: '1rem 2rem', borderRadius: '8px', border: 'none', background: '#f3f4f6', color: '#4b5563', cursor: 'pointer', fontWeight: 600 }}
            >
              Cancelar
            </button>
            <button 
              onClick={executeProtect}
              disabled={isProcessing || !password}
              className="btn btn-primary"
              style={{ padding: '1rem 2rem', borderRadius: '8px', border: 'none', cursor: password ? 'pointer' : 'not-allowed', fontWeight: 600 }}
            >
              {isProcessing ? 'Encriptando en el servidor...' : 'Proteger y Descargar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
