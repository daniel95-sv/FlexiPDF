import { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pixelmatch from 'pixelmatch';
import { Uploader } from '../components/Uploader/Uploader';

// Use same CDN worker logic for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export function ComparePDF() {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [diffPercent, setDiffPercent] = useState<number | null>(null);

  const handleProcess1 = (files: File[]) => { setFile1(files[0]); setError(null); };
  const handleProcess2 = (files: File[]) => { setFile2(files[0]); setError(null); };

  const renderPageToCanvas = async (file: File): Promise<ImageData> => {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    
    const viewport = page.getViewport({ scale: 1.0 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    const context = canvas.getContext('2d')!;
    await page.render({ canvasContext: context, viewport: viewport } as any).promise;
    
    return context.getImageData(0, 0, canvas.width, canvas.height);
  };

  const executeCompare = async () => {
    if (!file1 || !file2 || !canvasRef.current) return;
    setIsProcessing(true);
    setError(null);
    setDiffPercent(null);
    
    try {
      const img1 = await renderPageToCanvas(file1);
      const img2 = await renderPageToCanvas(file2);

      const width = Math.max(img1.width, img2.width);
      const height = Math.max(img1.height, img2.height);

      // We need identical sizes for pixelmatch
      if (img1.width !== img2.width || img1.height !== img2.height) {
        throw new Error("Los PDFs tienen dimensiones de página diferentes y no se pueden comparar píxel por píxel con exactitud.");
      }

      const diffCanvas = canvasRef.current;
      diffCanvas.width = width;
      diffCanvas.height = height;
      const diffContext = diffCanvas.getContext('2d')!;
      const diffImageData = diffContext.createImageData(width, height);

      const numDiffPixels = pixelmatch(img1.data, img2.data, diffImageData.data, width, height, { threshold: 0.1 });
      
      diffContext.putImageData(diffImageData, 0, 0);
      
      const totalPixels = width * height;
      setDiffPercent((numDiffPixels / totalPixels) * 100);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al comparar los documentos.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>Compare PDF</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Visually compare the first page of two PDF documents and highlight differences.
        </p>
      </div>

      {error && (
        <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', width: '100%', maxWidth: '800px', textAlign: 'center', border: '1px solid #FCA5A5' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
        <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
          {!file1 ? (
            <Uploader onProcess={handleProcess1} title="Original PDF" multiple={false} actionText="Upload Original" isProcessing={false} />
          ) : (
            <div style={{ padding: '1rem', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px' }}>✅ {file1.name}</div>
          )}
        </div>
        
        <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
          {!file2 ? (
            <Uploader onProcess={handleProcess2} title="Modified PDF" multiple={false} actionText="Upload Modified" isProcessing={false} />
          ) : (
            <div style={{ padding: '1rem', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px' }}>✅ {file2.name}</div>
          )}
        </div>
      </div>

      {file1 && file2 && (
        <div style={{ marginTop: '2rem' }}>
           <button 
              onClick={executeCompare}
              disabled={isProcessing}
              className="btn btn-primary"
              style={{ padding: '1rem 2rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              {isProcessing ? 'Comparando...' : 'Comparar Documentos'}
            </button>
        </div>
      )}

      <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        {diffPercent !== null && (
          <h3 style={{ marginBottom: '1rem', color: diffPercent > 0 ? '#DC2626' : '#16A34A' }}>
            Diferencia Visual: {diffPercent.toFixed(2)}%
          </h3>
        )}
        <canvas ref={canvasRef} style={{ maxWidth: '100%', border: diffPercent !== null ? '1px solid #ddd' : 'none', boxShadow: diffPercent !== null ? '0 10px 30px rgba(0,0,0,0.1)' : 'none' }}></canvas>
      </div>
    </div>
  );
}
