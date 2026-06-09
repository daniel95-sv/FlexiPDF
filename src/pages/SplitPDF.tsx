import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { Uploader } from '../components/Uploader/Uploader';
import { usePDFThumbnails } from '../hooks/usePDFThumbnails';
import { PDFVisualizer } from '../components/PDFVisualizer/PDFVisualizer';

export function SplitPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { thumbnails, setThumbnails, isGenerating, progress } = usePDFThumbnails(file);

  const handleProcess = async (files: File[]) => {
    if (files.length === 0) return;
    setError(null);
    setFile(files[0]);
  };

  const executeSplit = async () => {
    if (!file || thumbnails.length === 0) return;
    
    setIsProcessing(true);
    setError(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const numberOfPages = pdfDoc.getPageCount();
      
      const zip = new JSZip();

      for (let i = 0; i < numberOfPages; i++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(copiedPage);
        const pdfBytes = await newPdf.save();
        zip.file(`page_${i + 1}.pdf`, pdfBytes);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${file.name.replace('.pdf', '')}_split.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setFile(null);
    } catch (err: any) {
      console.error('Error splitting PDF:', err);
      setError(err.message || 'Failed to split PDF. Please make sure the file is a valid PDF document.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>Split PDF</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Separate every page of a PDF file into independent PDF files visually.
        </p>
      </div>

      {error && (
        <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', width: '100%', maxWidth: '800px', textAlign: 'center', border: '1px solid #FCA5A5' }}>
          {error}
        </div>
      )}

      {!file ? (
        <Uploader 
          onProcess={handleProcess} 
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
              <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Tu documento se dividirá en {thumbnails.length} archivos individuales.</p>
              
              <PDFVisualizer 
                thumbnails={thumbnails}
                mode="extract" // Visual indicator
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
                  onClick={executeSplit}
                  disabled={isProcessing}
                  className="btn btn-primary"
                  style={{ padding: '1rem 2rem', borderRadius: '8px', border: 'none', cursor: isProcessing ? 'not-allowed' : 'pointer', fontWeight: 600 }}
                >
                  {isProcessing ? 'Procesando...' : `Dividir en ${thumbnails.length} PDFs`}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
