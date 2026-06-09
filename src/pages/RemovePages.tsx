import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Uploader } from '../components/Uploader/Uploader';

export function RemovePages() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pagesInput, setPagesInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (files: File[]) => {
    if (files.length === 0) return;
    setError(null);
    setIsProcessing(true);
    const selectedFile = files[0];
    
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setPageCount(pdfDoc.getPageCount());
      setFile(selectedFile);
    } catch (err) {
      console.error(err);
      setError("Error al cargar el archivo PDF. Asegúrate de que no esté protegido con contraseña.");
    } finally {
      setIsProcessing(false);
    }
  };

  const executeRemoval = async () => {
    if (!file || !pagesInput) return;
    setIsProcessing(true);
    setError(null);
    
    try {
      // Parse pages (e.g. "1, 3, 5-7")
      const pagesToRemove = new Set<number>();
      const parts = pagesInput.split(',').map(s => s.trim());
      
      for (const part of parts) {
        if (part.includes('-')) {
          const [startStr, endStr] = part.split('-');
          const start = parseInt(startStr);
          const end = parseInt(endStr);
          if (!isNaN(start) && !isNaN(end) && start <= end) {
            for (let i = start; i <= end; i++) {
              pagesToRemove.add(i);
            }
          }
        } else {
          const pageNum = parseInt(part);
          if (!isNaN(pageNum)) {
            pagesToRemove.add(pageNum);
          }
        }
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // pdf-lib removes by index (0-based)
      // We must remove in reverse order so indices don't shift!
      const sortedToRemove = Array.from(pagesToRemove)
        .filter(p => p >= 1 && p <= pageCount)
        .sort((a, b) => b - a); // Descending

      if (sortedToRemove.length === pageCount) {
        throw new Error("No puedes eliminar todas las páginas del documento.");
      }

      for (const pageNum of sortedToRemove) {
        pdfDoc.removePage(pageNum - 1);
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `removed_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Reset
      setFile(null);
      setPagesInput('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al eliminar las páginas.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>Remove Pages</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Remove pages from a PDF document. Select a file to get started.
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
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Archivo: <strong>{file.name}</strong> ({pageCount} páginas)</h3>
          
          <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Páginas a eliminar (ej. 1, 3, 5-8):</label>
            <input 
              type="text" 
              value={pagesInput}
              onChange={(e) => setPagesInput(e.target.value)}
              placeholder="1, 2, 4-6..."
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
              onClick={executeRemoval}
              disabled={isProcessing || !pagesInput.trim()}
              className="btn btn-primary"
              style={{ padding: '1rem 2rem', borderRadius: '8px', border: 'none', cursor: pagesInput.trim() ? 'pointer' : 'not-allowed', fontWeight: 600 }}
            >
              {isProcessing ? 'Procesando...' : 'Eliminar Páginas'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
