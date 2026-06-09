import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Uploader } from '../components/Uploader/Uploader';

// Use same CDN worker logic for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export function TranslatePDF() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async (files: File[]) => {
    setIsProcessing(true);
    setError(null);
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      let extractedText = '';

      for (let pageNum = 1; pageNum <= Math.min(numPages, 5); pageNum++) { // Limit to 5 pages for URL size
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        for (const item of textContent.items) {
          if ('str' in item) {
            extractedText += item.str + ' ';
          }
        }
        extractedText += '\n\n';
      }

      if (!extractedText.trim()) {
         throw new Error("No se pudo extraer texto del PDF.");
      }

      // Limit characters to avoid URL length errors (approx 4000 chars)
      const truncatedText = extractedText.substring(0, 4000);
      
      const translateUrl = `https://translate.google.com/?sl=auto&tl=es&text=${encodeURIComponent(truncatedText)}&op=translate`;
      
      // Open google translate in new tab
      window.open(translateUrl, '_blank');
      
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Ocurrió un error al extraer el texto para traducción.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>Translate PDF</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Extract text from your document and translate it instantly.
        </p>
        <div style={{ marginTop: '1rem', background: '#DBEAFE', color: '#1E3A8A', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem' }}>
          Esta herramienta extraerá hasta las primeras 5 páginas de texto y abrirá automáticamente el traductor para que puedas leerlo en tu idioma natal.
        </div>
      </div>

      {error && (
        <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', width: '100%', maxWidth: '800px', textAlign: 'center', border: '1px solid #FCA5A5' }}>
          {error}
        </div>
      )}

      <Uploader 
        onProcess={handleProcess} 
        title="Select PDF file" 
        multiple={false} 
        actionText="Translate Document"
        isProcessing={isProcessing}
      />
    </div>
  );
}
