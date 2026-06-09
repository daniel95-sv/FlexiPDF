import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Uploader } from '../components/Uploader/Uploader';
import { usePDFThumbnails } from '../hooks/usePDFThumbnails';
import { PDFVisualizer } from '../components/PDFVisualizer/PDFVisualizer';

export function OrganizePDF() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { thumbnails, setThumbnails, isGenerating, progress } = usePDFThumbnails(file);

  const handleFileSelect = async (files: File[]) => {
    setFile(files[0]);
    setError(null);
  };

  const executeOrganize = async () => {
    if (!file || thumbnails.length === 0) return;
    setIsProcessing(true);
    setError(null);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const targetPdf = await PDFDocument.create();
      
      const indicesToCopy = thumbnails.map(t => t.originalIndex);
      const copiedPages = await targetPdf.copyPages(sourcePdf, indicesToCopy);

      for (let i = 0; i < copiedPages.length; i++) {
        const page = copiedPages[i];
        // Apply any rotations if they were made visually
        if (thumbnails[i].rotation !== 0) {
          const currentRotation = page.getRotation().angle;
          page.setRotation(page.getRotation().constructor(currentRotation + thumbnails[i].rotation));
        }
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
          Sort, reorder, or rotate pages visually using drag and drop.
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
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Organizando: {file.name}</h3>
          
          {isGenerating ? (
            <div style={{ padding: '3rem 0', backgroundColor: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #f3f4f6' }}>
              <div style={{ color: '#2563eb', fontWeight: 600, marginBottom: '0.5rem' }}>Generando vista previa... {progress}%</div>
              <div style={{ width: '16rem', height: '0.5rem', backgroundColor: '#e5e7eb', borderRadius: '9999px', margin: '0 auto', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#3b82f6', transition: 'all 0.3s', width: `${progress}%` }}></div>
              </div>
            </div>
          ) : (
            <>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Arrastra y suelta las páginas para reordenarlas.</p>
              
              <PDFVisualizer 
                thumbnails={thumbnails}
                mode="organize"
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
                  onClick={executeOrganize}
                  disabled={isProcessing}
                  className="btn btn-primary"
                  style={{ padding: '1rem 2rem', borderRadius: '8px', border: 'none', cursor: isProcessing ? 'not-allowed' : 'pointer', fontWeight: 600 }}
                >
                  {isProcessing ? 'Procesando...' : 'Aplicar Cambios'}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
