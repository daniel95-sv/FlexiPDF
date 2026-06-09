import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { Uploader } from '../components/Uploader/Uploader';

// Use same CDN worker logic for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export function PDFtoWORD() {
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

      const paragraphs: Paragraph[] = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        setProgress(`Extrayendo texto de la página ${pageNum}/${numPages}...`);
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        let lastY = -1;
        let currentLine = '';

        for (const item of textContent.items) {
          if (!('str' in item)) continue;
          
          if (lastY !== -1 && Math.abs(item.transform[5] - lastY) > 5) {
            if (currentLine.trim()) {
              paragraphs.push(new Paragraph({
                children: [new TextRun(currentLine)],
              }));
            }
            currentLine = '';
          }
          currentLine += item.str + ' ';
          lastY = item.transform[5];
        }

        if (currentLine.trim()) {
          paragraphs.push(new Paragraph({
            children: [new TextRun(currentLine)],
          }));
        }

        // Add a page break if it's not the last page
        if (pageNum < numPages) {
           paragraphs.push(new Paragraph({ children: [new TextRun({ text: '', break: 1 })] }));
        }
      }

      setProgress('Generando documento Word...');
      
      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs.length ? paragraphs : [new Paragraph("Documento sin texto extraíble.")],
        }],
      });

      const blob = await Packer.toBlob(doc);
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${file.name.replace('.pdf', '')}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (err: any) {
      console.error('Error:', err);
      setError('Ocurrió un error al convertir el PDF. Asegúrate de que contiene texto.');
    } finally {
      setIsProcessing(false);
      setProgress('');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>PDF to WORD</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Convert PDF documents to editable Word files (.docx).
        </p>
        <div style={{ marginTop: '1rem', background: '#FEF3C7', color: '#92400E', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem' }}>
          <strong>Aviso Client-Side:</strong> Esta herramienta extrae el texto puro para crear el archivo Word sin costo. Las imágenes y diseños gráficos complejos no serán replicados.
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
          actionText="Convert to Word"
          isProcessing={isProcessing}
        />
      ) : (
        <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', width: '100%', maxWidth: '600px', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1.5rem', width: '50px', height: '50px', border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <style>{`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          `}</style>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Generando Word...</h3>
          <p style={{ fontSize: '1.1rem', color: '#4B5563', fontWeight: 500 }}>{progress}</p>
        </div>
      )}
    </div>
  );
}
