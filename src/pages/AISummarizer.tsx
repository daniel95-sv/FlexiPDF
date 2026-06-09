import { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { pipeline, env } from '@xenova/transformers';
import { Uploader } from '../components/Uploader/Uploader';

// Use same CDN worker logic for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

// Disable local models to fetch from HuggingFace hub
env.allowLocalModels = false;

export function AISummarizer() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const summarizerRef = useRef<any>(null);

  const handleProcess = async (files: File[]) => {
    setIsProcessing(true);
    setError(null);
    setSummary(null);
    setProgress('Preparando Inteligencia Artificial...');
    
    try {
      if (!summarizerRef.current) {
        setProgress('Descargando modelo neuronal (esto solo ocurrirá la primera vez)...');
        summarizerRef.current = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
      }

      setProgress('Extrayendo texto del PDF...');
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      let extractedText = '';

      for (let pageNum = 1; pageNum <= Math.min(numPages, 3); pageNum++) { // Limit to 3 pages for memory
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        for (const item of textContent.items) {
          if ('str' in item) {
            extractedText += item.str + ' ';
          }
        }
      }

      if (!extractedText.trim()) {
         throw new Error("No se pudo extraer texto del PDF.");
      }

      // Truncate to roughly 1024 tokens to avoid crashing the small model
      const truncatedText = extractedText.substring(0, 3000);

      setProgress('Analizando y resumiendo el contenido...');
      
      const result = await summarizerRef.current(truncatedText, {
        max_new_tokens: 150,
        min_new_tokens: 40,
      });

      if (result && result.length > 0) {
        setSummary(result[0].summary_text);
      } else {
        throw new Error("El modelo no devolvió un resumen.");
      }
      
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Ocurrió un error al procesar el resumen con IA.');
    } finally {
      setIsProcessing(false);
      setProgress('');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>AI Summarizer</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Extract the key points from any PDF document using local Artificial Intelligence.
        </p>
        <div style={{ marginTop: '1rem', background: '#DBEAFE', color: '#1E3A8A', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem' }}>
          <strong>Privacidad Total:</strong> El modelo de lenguaje se descarga y se ejecuta en la RAM de tu navegador. Ningún dato se envía a servidores externos.
        </div>
      </div>

      {error && (
        <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', width: '100%', maxWidth: '800px', textAlign: 'center', border: '1px solid #FCA5A5' }}>
          {error}
        </div>
      )}

      {summary && (
        <div style={{ background: '#F8FAFC', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', width: '100%', maxWidth: '800px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ✨ Resumen Generado
          </h3>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#334155' }}>
            {summary}
          </p>
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button 
              onClick={() => setSummary(null)}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              Resumir otro documento
            </button>
          </div>
        </div>
      )}

      {!isProcessing && !summary && (
        <Uploader 
          onProcess={handleProcess} 
          title="Select PDF file" 
          multiple={false} 
          actionText="Summarize with AI"
          isProcessing={isProcessing}
        />
      )}
      
      {isProcessing && (
        <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', width: '100%', maxWidth: '600px', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1.5rem', width: '50px', height: '50px', border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <style>{`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          `}</style>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Cerebro IA trabajando...</h3>
          <p style={{ fontSize: '1.1rem', color: '#4B5563', fontWeight: 500 }}>{progress}</p>
        </div>
      )}
    </div>
  );
}
