import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Uploader } from '../components/Uploader/Uploader';
import { usePDFThumbnails } from '../hooks/usePDFThumbnails';
import { PDFVisualizer } from '../components/PDFVisualizer/PDFVisualizer';

export function ExtractPages() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { thumbnails, setThumbnails, isGenerating, progress } = usePDFThumbnails(file);

  const handleFileSelect = async (files: File[]) => {
    if (files.length === 0) return;
    setError(null);
    setFile(files[0]);
  };

  const executeExtraction = async () => {
    if (!file || thumbnails.length === 0) return;
    
    const pagesToExtract = thumbnails.filter(t => t.selected).map(t => t.originalIndex);
    
    if (pagesToExtract.length === 0) {
      setError("Por favor selecciona al menos una página para extraer.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const targetPdf = await PDFDocument.create();
      
      const sortedToExtract = pagesToExtract.sort((a, b) => a - b); // Ascending

      const copiedPages = await targetPdf.copyPages(sourcePdf, sortedToExtract);

      for (const page of copiedPages) {
        targetPdf.addPage(page);
      }

      const pdfBytes = await targetPdf.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `extracted_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setFile(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al extraer las páginas.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>Extract Pages</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Extract pages from your PDF document into a new PDF visually.
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
              <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Haz clic en las páginas que deseas <strong>extraer</strong>.</p>
              
              <PDFVisualizer 
                thumbnails={thumbnails}
                mode="extract"
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
                  onClick={executeExtraction}
                  disabled={isProcessing}
                  className="btn btn-primary"
                  style={{ padding: '1rem 2rem', borderRadius: '8px', border: 'none', cursor: isProcessing ? 'not-allowed' : 'pointer', fontWeight: 600 }}
                >
                  {isProcessing ? 'Procesando...' : `Extraer ${thumbnails.filter(t => t.selected).length} páginas`}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
