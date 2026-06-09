import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { Uploader } from '../components/Uploader/Uploader';

// Setup PDF.js worker via CDN to ensure compatibility across Vite/Cloudflare
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export function PDFtoJPG() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async (files: File[]) => {
    setIsProcessing(true);
    setError(null);
    try {
      const zip = new JSZip();
      let totalPagesProcessed = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const arrayBuffer = await file.arrayBuffer();
        
        // Load PDF using pdf.js
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 2.0 }); // Scale 2.0 for higher quality JPG

          // Create canvas
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) continue;

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Render PDF page into canvas context
          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          await page.render(renderContext as any).promise;

          // Convert Canvas to Blob
          const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.9); // 90% quality JPG
          });

          if (blob) {
            // If it's just 1 file and 1 page, maybe we could trigger a single download.
            // But since PDFs usually have multiple pages, ZIP is best.
            const baseFileName = file.name.replace(/\.[^/.]+$/, "");
            zip.file(`${baseFileName}_page_${pageNum}.jpg`, blob);
            totalPagesProcessed++;
          }
        }
      }

      if (totalPagesProcessed > 0) {
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'extracted_images.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        setError('No se pudieron extraer imágenes de los archivos proporcionados.');
      }

    } catch (err: any) {
      console.error('Error:', err);
      setError('Ocurrió un error al convertir el PDF. Verifica que el archivo no esté protegido con contraseña.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>PDF to JPG</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Convert each page of your PDF into high quality JPG images.
        </p>
      </div>

      {error && (
        <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', width: '100%', maxWidth: '800px', textAlign: 'center', border: '1px solid #FCA5A5' }}>
          {error}
        </div>
      )}

      <Uploader 
        onProcess={handleProcess} 
        title="Select PDF files" 
        multiple={true} 
        actionText="Convert to JPG"
        isProcessing={isProcessing}
      />
    </div>
  );
}
