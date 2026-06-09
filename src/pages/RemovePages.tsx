import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Uploader } from '../components/Uploader/Uploader';
import { usePDFThumbnails } from '../hooks/usePDFThumbnails';
import { PDFVisualizer } from '../components/PDFVisualizer/PDFVisualizer';

export function RemovePages() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { thumbnails, setThumbnails, isGenerating, progress } = usePDFThumbnails(file);

  const handleFileSelect = async (files: File[]) => {
    if (files.length === 0) return;
    setError(null);
    setFile(files[0]);
  };

  const executeRemoval = async () => {
    if (!file || thumbnails.length === 0) return;
    
    const pagesToRemove = thumbnails.filter(t => t.selected).map(t => t.originalIndex);
    
    if (pagesToRemove.length === 0) {
      setError("Por favor selecciona al menos una página para eliminar.");
      return;
    }
    
    if (pagesToRemove.length === thumbnails.length) {
      setError("No puedes eliminar todas las páginas del documento.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Remove in descending order
      const sortedToRemove = pagesToRemove.sort((a, b) => b - a);
      for (const pageNum of sortedToRemove) {
        pdfDoc.removePage(pageNum);
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
      
      setFile(null);
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
          Remove pages from a PDF document visually by selecting them.
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
        <div style={{ width: '100%', maxWidth: '1024px', textAlign: 'center', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Archivo: {file.name}</h3>
          
          {isGenerating ? (
            <div style={{ padding: '3rem 0', backgroundColor: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #f3f4f6' }}>
              <div style={{ color: '#2563eb', fontWeight: 600, marginBottom: '0.5rem' }}>Generando vista previa... {progress}%</div>
              <div style={{ width: '16rem', height: '0.5rem', backgroundColor: '#e5e7eb', borderRadius: '9999px', margin: '0 auto', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#3b82f6', transition: 'all 0.3s', width: `${progress}%` }}></div>
              </div>
            </div>
          ) : (
            <>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Haz clic en las páginas que deseas <strong>eliminar</strong>.</p>
              
              <PDFVisualizer 
                thumbnails={thumbnails}
                mode="remove"
                onUpdate={setThumbnails}
              />

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                <button 
                  onClick={() => setFile(null)}
                  style={{ padding: '1rem 2rem', borderRadius: '8px', border: 'none', background: '#f3f4f6', color: '#4b5563', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancelar
                </button>
                <button 
                  onClick={executeRemoval}
                  disabled={isProcessing}
                  className="btn btn-primary"
                  style={{ padding: '1rem 2rem', borderRadius: '8px', border: 'none', cursor: isProcessing ? 'not-allowed' : 'pointer', fontWeight: 600 }}
                >
                  {isProcessing ? 'Procesando...' : `Eliminar ${thumbnails.filter(t => t.selected).length} páginas`}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
