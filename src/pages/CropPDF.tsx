import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { Uploader } from '../components/Uploader/Uploader';

export function CropPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [margin, setMargin] = useState<number>(36); // Default 0.5 inch (36 points)
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setError(null);
  };

  const executeCrop = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setError(null);
    
    try {
      const zip = new JSZip();
      let processedCount = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        
        const pages = pdfDoc.getPages();
        
        for (let pageNum = 0; pageNum < pages.length; pageNum++) {
          const page = pages[pageNum];
          const { width, height } = page.getSize();
          
          // Crop by setting the crop box inward by 'margin' points
          page.setCropBox(margin, margin, width - (margin * 2), height - (margin * 2));
        }

        const pdfBytes = await pdfDoc.save();
        if (files.length === 1) {
          const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `cropped_${file.name}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          processedCount++;
          break;
        } else {
          zip.file(`cropped_${file.name}`, pdfBytes);
          processedCount++;
        }
      }

      if (files.length > 1 && processedCount > 0) {
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'cropped_pdfs.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      
      // Reset
      setFiles([]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al recortar el PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>Crop PDF</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Remove margins from your PDF documents.
        </p>
      </div>

      {error && (
        <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', width: '100%', maxWidth: '800px', textAlign: 'center', border: '1px solid #FCA5A5' }}>
          {error}
        </div>
      )}

      {files.length === 0 ? (
        <Uploader 
          onProcess={handleFileSelect} 
          title="Select PDF files" 
          multiple={true} 
          actionText="Select"
          isProcessing={isProcessing}
        />
      ) : (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', width: '100%', maxWidth: '600px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{files.length} archivo(s) seleccionado(s)</h3>
          
          <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Margen a recortar (Puntos de impresión):</label>
            <input 
              type="number" 
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              placeholder="36"
              style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '2px solid #eee', fontSize: '1.1rem' }}
            />
            <small style={{ color: '#6b7280', display: 'block', marginTop: '0.5rem' }}>Nota: 72 puntos = 1 pulgada.</small>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              onClick={() => setFiles([])}
              style={{ padding: '1rem 2rem', borderRadius: '8px', border: 'none', background: '#f3f4f6', color: '#4b5563', cursor: 'pointer', fontWeight: 600 }}
            >
              Cancelar
            </button>
            <button 
              onClick={executeCrop}
              disabled={isProcessing || margin < 0}
              className="btn btn-primary"
              style={{ padding: '1rem 2rem', borderRadius: '8px', border: 'none', cursor: margin >= 0 ? 'pointer' : 'not-allowed', fontWeight: 600 }}
            >
              {isProcessing ? 'Procesando...' : 'Recortar PDF'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
