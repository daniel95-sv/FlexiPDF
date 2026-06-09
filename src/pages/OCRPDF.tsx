import { useState } from 'react';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import { Uploader } from '../components/Uploader/Uploader';

// Use same CDN worker logic for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export function OCRPDF() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async (files: File[]) => {
    setIsProcessing(true);
    setError(null);
    setProgress('Iniciando motores de IA local...');
    
    try {
      const file = files[0]; // Process one by one for OCR
      const arrayBuffer = await file.arrayBuffer();
      
      setProgress('Cargando PDF...');
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      let extractedText = '';

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        setProgress(`Renderizando página ${pageNum}/${numPages}...`);
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport } as any).promise;
        const imgData = canvas.toDataURL('image/jpeg', 0.9);

        setProgress(`Leyendo texto de página ${pageNum} con Inteligencia Artificial...`);
        // Run OCR on the image
        const { data: { text } } = await Tesseract.recognize(
          imgData,
          'eng+spa', // English and Spanish
          {
            logger: m => {
              if (m.status === 'recognizing text') {
                setProgress(`Página ${pageNum}: ${Math.round(m.progress * 100)}% analizado`);
              }
            }
          }
        );
        
        extractedText += `\n--- Página ${pageNum} ---\n\n` + text + '\n';
      }

      setProgress('Finalizando documento...');

      // Save TXT
      const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ocr_result_${file.name}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (err: any) {
      console.error('Error:', err);
      setError('Ocurrió un error en el reconocimiento óptico (OCR).');
    } finally {
      setIsProcessing(false);
      setProgress('');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>OCR PDF (IA Local)</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Extract text from scanned PDFs using Artificial Intelligence directly in your browser.
        </p>
        <div style={{ marginTop: '1rem', background: '#DBEAFE', color: '#1E3A8A', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem' }}>
          <strong>100% Privado:</strong> Tus documentos nunca abandonan tu computadora. La Inteligencia Artificial OCR corre enteramente usando la memoria de tu navegador.
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
          title="Select scanned PDF" 
          multiple={false} 
          actionText="Extract Text"
          isProcessing={isProcessing}
        />
      ) : (
        <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', width: '100%', maxWidth: '600px', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1.5rem', width: '50px', height: '50px', border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <style>{`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          `}</style>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Procesando Inteligencia Artificial...</h3>
          <p style={{ fontSize: '1.1rem', color: '#4B5563', fontWeight: 500 }}>{progress}</p>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#9CA3AF' }}>Esto puede tardar varios minutos dependiendo de la potencia de tu equipo.</p>
        </div>
      )}
    </div>
  );
}
