import { useState, useRef } from 'react';
import mammoth from 'mammoth';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Uploader } from '../components/Uploader/Uploader';

export function WORDtoPDF() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleProcess = async (files: File[]) => {
    setIsProcessing(true);
    setError(null);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 1. Read word file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        // 2. Convert raw Word Document to HTML using Mammoth
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const html = result.value;

        if (containerRef.current) {
          // 3. Inject HTML to DOM so we can capture it
          // Add some basic Word-like styling for better representation
          containerRef.current.innerHTML = `
            <div style="padding: 40px; font-family: 'Calibri', 'Arial', sans-serif; line-height: 1.5; color: black; background: white;">
              ${html}
            </div>
          `;
          
          await new Promise(r => setTimeout(r, 500)); // Wait for DOM to paint

          // 4. Capture with HTML2Canvas
          const canvas = await html2canvas(containerRef.current, {
            scale: 2,
            useCORS: true
          });

          // 5. Convert to PDF
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });

          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
          
          const finalName = file.name.replace(/\.[^/.]+$/, "");
          pdf.save(`${finalName}_converted.pdf`);
          
          // Cleanup
          containerRef.current.innerHTML = '';
        }
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError('Error al convertir el archivo Word. Es posible que el documento esté encriptado o corrupto.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>Word to PDF</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Convert your DOCX documents to PDF instantly in your browser.
        </p>
        <div style={{ marginTop: '1rem', background: '#FEF3C7', color: '#92400E', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem' }}>
          <strong>Modo Client-Side:</strong> La conversión se realiza de forma gratuita en tu navegador. Estilos complejos o tablas avanzadas pueden lucir diferentes al documento original.
        </div>
      </div>

      {error && (
        <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', width: '100%', maxWidth: '800px', textAlign: 'center', border: '1px solid #FCA5A5' }}>
          {error}
        </div>
      )}

      <Uploader 
        onProcess={handleProcess} 
        title="Select Word files" 
        multiple={true} 
        actionText="Convert to PDF"
        isProcessing={isProcessing}
        accept=".docx"
      />

      {/* Hidden container for rendering Word HTML */}
      <div 
        ref={containerRef}
        style={{
          position: 'absolute',
          top: '-99999px',
          left: '-99999px',
          width: '794px', // A4 pixel width approx at 96 DPI
          background: 'white',
          zIndex: -1
        }}
      ></div>
    </div>
  );
}
