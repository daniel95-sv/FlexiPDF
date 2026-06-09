import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Uploader } from '../components/Uploader/Uploader';

export function RepairPDF() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleProcess = async (files: File[]) => {
    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      
      // Load ignoring encryption and trying to force parse
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      
      // Save it back to regenerate xref tables and structural streams
      const pdfBytes = await pdfDoc.save();
      
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `repaired_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setSuccess(true);
    } catch (err: any) {
      console.error('Error:', err);
      setError('El archivo está demasiado dañado para ser reparado localmente. Intenta recuperar una versión anterior.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>Repair PDF</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Try to fix corrupted or damaged PDF documents and recover data.
        </p>
      </div>

      {error && (
        <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', width: '100%', maxWidth: '800px', textAlign: 'center', border: '1px solid #FCA5A5' }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ background: '#F0FDF4', color: '#16A34A', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', width: '100%', maxWidth: '800px', textAlign: 'center', border: '1px solid #BBF7D0' }}>
          El PDF ha sido reestructurado y descargado exitosamente.
        </div>
      )}

      <Uploader 
        onProcess={handleProcess} 
        title="Select corrupted PDF" 
        multiple={false} 
        actionText="Repair PDF"
        isProcessing={isProcessing}
      />
    </div>
  );
}
