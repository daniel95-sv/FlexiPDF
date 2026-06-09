import { useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import JSZip from 'jszip';
import { Uploader } from '../components/Uploader/Uploader';

export function RedactPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [redactArea, setRedactArea] = useState<'top' | 'bottom' | 'both'>('both');
  const [height, setHeight] = useState<number>(50); // height of redaction box
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setError(null);
  };

  const executeRedact = async () => {
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
          const { width, height: pageHeight } = page.getSize();
          
          if (redactArea === 'top' || redactArea === 'both') {
            page.drawRectangle({
              x: 0,
              y: pageHeight - height,
              width: width,
              height: height,
              color: rgb(0, 0, 0),
            });
          }
          
          if (redactArea === 'bottom' || redactArea === 'both') {
            page.drawRectangle({
              x: 0,
              y: 0,
              width: width,
              height: height,
              color: rgb(0, 0, 0),
            });
          }
        }

        const pdfBytes = await pdfDoc.save();
        if (files.length === 1) {
          const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `redacted_${file.name}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          processedCount++;
          break;
        } else {
          zip.file(`redacted_${file.name}`, pdfBytes);
          processedCount++;
        }
      }

      if (files.length > 1 && processedCount > 0) {
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'redacted_pdfs.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      
      // Reset
      setFiles([]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al censurar el PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>Redact PDF</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Permanently remove sensitive information by blacking out areas (e.g. Headers/Footers).
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
          
          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Área a censurar:</label>
            <select 
              value={redactArea}
              onChange={(e) => setRedactArea(e.target.value as any)}
              style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '2px solid #eee', fontSize: '1.1rem' }}
            >
              <option value="both">Encabezado y Pie de Página</option>
              <option value="top">Solo Encabezado (Arriba)</option>
              <option value="bottom">Solo Pie de Página (Abajo)</option>
            </select>
          </div>

          <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Grosor del bloque negro (Puntos):</label>
            <input 
              type="number" 
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              placeholder="50"
              style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '2px solid #eee', fontSize: '1.1rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              onClick={() => setFiles([])}
              style={{ padding: '1rem 2rem', borderRadius: '8px', border: 'none', background: '#f3f4f6', color: '#4b5563', cursor: 'pointer', fontWeight: 600 }}
            >
              Cancelar
            </button>
            <button 
              onClick={executeRedact}
              disabled={isProcessing || height < 0}
              className="btn btn-primary"
              style={{ padding: '1rem 2rem', borderRadius: '8px', border: 'none', cursor: height >= 0 ? 'pointer' : 'not-allowed', fontWeight: 600 }}
            >
              {isProcessing ? 'Procesando...' : 'Censurar PDF'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
