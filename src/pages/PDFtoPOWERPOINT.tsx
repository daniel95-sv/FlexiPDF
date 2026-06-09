import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pptxgen from 'pptxgenjs';
import { Uploader } from '../components/Uploader/Uploader';

// Use same CDN worker logic for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export function PDFtoPOWERPOINT() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async (files: File[]) => {
    setIsProcessing(true);
    setError(null);
    setProgress('Leyendo documento PDF...');
    
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      const pptx = new pptxgen();

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        setProgress(`Convirtiendo página ${pageNum}/${numPages} a diapositiva...`);
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const slide = pptx.addSlide();
        
        let lastY = -1;
        let currentLine = '';
        let yPos = 1; // start near top

        for (const item of textContent.items) {
          if (!('str' in item)) continue;
          
          if (lastY !== -1 && Math.abs(item.transform[5] - lastY) > 5) {
            if (currentLine.trim()) {
              slide.addText(currentLine, { x: 0.5, y: yPos, w: '90%', fontSize: 14, color: '363636' });
              yPos += 0.4;
            }
            currentLine = '';
          }
          currentLine += item.str + ' ';
          lastY = item.transform[5];
        }

        if (currentLine.trim()) {
          slide.addText(currentLine, { x: 0.5, y: yPos, w: '90%', fontSize: 14, color: '363636' });
        }
      }

      setProgress('Generando archivo PowerPoint...');
      
      const blob = await pptx.write({ outputType: "blob" }) as Blob;
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${file.name.replace('.pdf', '')}.pptx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (err: any) {
      console.error('Error:', err);
      setError('Ocurrió un error al convertir el PDF a PowerPoint. Asegúrate de que contiene texto.');
    } finally {
      setIsProcessing(false);
      setProgress('');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>PDF to POWERPOINT</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Convert PDF documents to editable PowerPoint presentations (.pptx).
        </p>
        <div style={{ marginTop: '1rem', background: '#FEF3C7', color: '#92400E', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem' }}>
          <strong>Aviso Client-Side:</strong> Esta herramienta extrae el texto y lo coloca en diapositivas separadas de forma gratuita. Los diseños gráficos complejos no serán replicados.
        </div>
      </div>

      {error && (
        <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', width: '100%', maxWidth: '800px', textAlign: 'center', border: '1px solid #FCA5A5' }}>
          {error}
        </div>
      )}

      {!isProcessing ? (
        <Uploader 
          onProcess={handleProcess} 
          title="Select PDF file" 
          multiple={false} 
          actionText="Convert to PowerPoint"
          isProcessing={isProcessing}
        />
      ) : (
        <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', width: '100%', maxWidth: '600px', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1.5rem', width: '50px', height: '50px', border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <style>{`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          `}</style>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Generando PPTX...</h3>
          <p style={{ fontSize: '1.1rem', color: '#4B5563', fontWeight: 500 }}>{progress}</p>
        </div>
      )}
    </div>
  );
}
