import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Uploader } from '../components/Uploader/Uploader';

export function EXCELtoPDF() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleProcess = async (files: File[]) => {
    setIsProcessing(true);
    setError(null);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 1. Read Excel file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        // 2. Parse workbook with XLSX
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        // We will just convert the first sheet for this simple implementation
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // 3. Convert sheet to HTML table
        const htmlTable = XLSX.utils.sheet_to_html(worksheet);

        if (containerRef.current) {
          // 4. Inject HTML into DOM with some grid styling
          containerRef.current.innerHTML = `
            <div style="padding: 20px; font-family: 'Calibri', sans-serif; background: white;">
              <h2 style="text-align: center; margin-bottom: 20px;">${file.name} - ${firstSheetName}</h2>
              <style>
                table { width: 100%; border-collapse: collapse; }
                td, th { border: 1px solid #d1d5db; padding: 8px; font-size: 12px; }
              </style>
              ${htmlTable}
            </div>
          `;
          
          await new Promise(r => setTimeout(r, 500)); // wait for render

          // 5. Capture with HTML2Canvas
          const canvas = await html2canvas(containerRef.current, {
            scale: 2,
            useCORS: true
          });

          // 6. Convert to PDF
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          const pdf = new jsPDF({
            orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
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
      setError('Error al convertir el archivo Excel. Verifica que el archivo sea válido (.xlsx o .xls).');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>Excel to PDF</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Convert your Excel spreadsheets to PDF locally.
        </p>
        <div style={{ marginTop: '1rem', background: '#FEF3C7', color: '#92400E', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem' }}>
          <strong>Modo Client-Side:</strong> Extrae los datos y tablas de la primera hoja de tu Excel y los convierte en un PDF estructurado. Gráficos interactivos no son soportados en este modo gratuito.
        </div>
      </div>

      {error && (
        <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', width: '100%', maxWidth: '800px', textAlign: 'center', border: '1px solid #FCA5A5' }}>
          {error}
        </div>
      )}

      <Uploader 
        onProcess={handleProcess} 
        title="Select Excel files" 
        multiple={true} 
        actionText="Convert to PDF"
        isProcessing={isProcessing}
        accept=".xlsx,.xls,.csv"
      />

      <div 
        ref={containerRef}
        style={{
          position: 'absolute',
          top: '-99999px',
          left: '-99999px',
          width: '1000px', // Wider base for excel files
          background: 'white',
          zIndex: -1
        }}
      ></div>
    </div>
  );
}
