import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Uploader } from '../components/Uploader/Uploader';

export function OrganizePDF() {
  const [file, setFile] = useState<File | null>(null);
  const [pageOrder, setPageOrder] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (files: File[]) => {
    try {
      const selectedFile = files[0];
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setTotalPages(pdfDoc.getPageCount());
      setFile(selectedFile);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('No se pudo leer el archivo. Verifica que sea un PDF válido.');
    }
  };

  const executeOrganize = async () => {
    if (!file || !pageOrder.trim()) return;
    setIsProcessing(true);
    setError(null);
    
    try {
      const pagesToInclude = pageOrder.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 1 && n <= totalPages);
      
      if (pagesToInclude.length === 0) {
        throw new Error("El orden proporcionado es inválido.");
      }

      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const targetPdf = await PDFDocument.create();
      
      const indicesToCopy = pagesToInclude.map(p => p - 1);
      const copiedPages = await targetPdf.copyPages(sourcePdf, indicesToCopy);

      for (const page of copiedPages) {
        targetPdf.addPage(page);
      }

      const pdfBytes = await targetPdf.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `organized_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setFile(null);
      setPageOrder('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocurrió un error al organizar el PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>Organize PDF</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Sort, reorder, or duplicate pages exactly the way you want.
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
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Organizando: <strong>{file.name}</strong> ({totalPages} páginas)</h3>
          
          <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nuevo orden de páginas separadas por coma:</label>
            <input 
              type="text" 
              value={pageOrder}
              onChange={(e) => setPageOrder(e.target.value)}
              placeholder="Ejemplo para 3 páginas: 3, 1, 2"
              style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '2px solid #eee', fontSize: '1.1rem' }}
            />
            <small style={{ color: '#6b7280', display: 'block', marginTop: '0.5rem' }}>Puedes repetir páginas (ej: 1, 1, 2) o excluir algunas.</small>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              onClick={() => setFile(null)}
              style={{ padding: '1rem 2rem', borderRadius: '8px', border: 'none', background: '#f3f4f6', color: '#4b5563', cursor: 'pointer', fontWeight: 600 }}
            >
              Cancelar
            </button>
            <button 
              onClick={executeOrganize}
              disabled={isProcessing || !pageOrder.trim()}
              className="btn btn-primary"
              style={{ padding: '1rem 2rem', borderRadius: '8px', border: 'none', cursor: pageOrder.trim() ? 'pointer' : 'not-allowed', fontWeight: 600 }}
            >
              {isProcessing ? 'Procesando...' : 'Aplicar Orden'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
