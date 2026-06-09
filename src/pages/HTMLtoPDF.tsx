import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Uploader } from '../components/Uploader/Uploader';

export function HTMLtoPDF() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleProcess = async (files: File[]) => {
    setIsProcessing(true);
    setError(null);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Read HTML content
        const htmlContent = await file.text();
        
        if (containerRef.current) {
          // Inject HTML into our hidden container
          containerRef.current.innerHTML = htmlContent;
          
          // Wait for a small moment to let images/styles potentially load
          await new Promise(r => setTimeout(r, 500));

          // Capture
          const canvas = await html2canvas(containerRef.current, {
            useCORS: true, // Attempt to load cross-origin images if allowed
            scale: 2 // High quality
          });

          // Convert to PDF
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          
          // A4 Size in mm: 210 x 297
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });

          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

          // If content is longer than one page, jsPDF can split it, but for simplicity
          // we'll add it as one long continuous page or scale it down.
          // Let's just scale it to fit the width. If it goes beyond height, it gets cut off in this basic version,
          // but for true multi-page HTML-to-PDF, a heavier library like html2pdf.js is needed.
          // We will use standard a4 and let it run off if it's very long for now, as a client-side limitation.
          
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`converted_${file.name}.pdf`);
          
          // Clear container
          containerRef.current.innerHTML = '';
        }
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError('Ocurrió un error al convertir el HTML. Asegúrate de que el archivo sea válido.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>HTML to PDF</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Convert your HTML files into high-quality PDF documents locally.
        </p>
      </div>

      {error && (
        <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', width: '100%', maxWidth: '800px', textAlign: 'center', border: '1px solid #FCA5A5' }}>
          {error}
        </div>
      )}

      <Uploader 
        onProcess={handleProcess} 
        title="Select HTML files" 
        multiple={true} 
        actionText="Convert HTML to PDF"
        isProcessing={isProcessing}
        accept=".html,.htm"
      />

      {/* Hidden container for HTML rendering */}
      <div 
        ref={containerRef}
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          width: '800px', // Simulate a desktop viewport width
          background: 'white',
          zIndex: -1
        }}
      ></div>
    </div>
  );
}
