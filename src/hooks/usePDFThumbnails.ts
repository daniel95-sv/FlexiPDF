import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Ensure the worker is set up
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export interface PageThumbnailData {
  id: string; // Unique ID for drag and drop
  originalIndex: number; // 0-indexed original page number
  dataUrl: string; // Base64 image
  rotation: number; // 0, 90, 180, 270
  selected: boolean; // For extract/remove modes
}

export function usePDFThumbnails(file: File | null) {
  const [thumbnails, setThumbnails] = useState<PageThumbnailData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let loadingTask: pdfjsLib.PDFDocumentLoadingTask | null = null;

    const generateThumbnails = async () => {
      if (!file) {
        setThumbnails([]);
        setProgress(0);
        return;
      }

      setIsGenerating(true);
      setError(null);
      setProgress(0);
      setThumbnails([]);

      try {
        const arrayBuffer = await file.arrayBuffer();
        loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;

        const newThumbnails: PageThumbnailData[] = [];
        
        // Render in small batches to prevent blocking the UI thread completely
        const batchSize = 3; 

        for (let i = 1; i <= numPages; i++) {
          if (!isMounted) break;

          const page = await pdf.getPage(i);
          // Use a small scale to generate low-res thumbnails faster
          const viewport = page.getViewport({ scale: 0.3 }); 
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (!context) throw new Error("Canvas 2D context not supported");

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          await page.render(renderContext as any).promise;

          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

          newThumbnails.push({
            id: `page-${i}-${Date.now()}`,
            originalIndex: i - 1, // 0-indexed
            dataUrl,
            rotation: 0,
            selected: false
          });

          // Update state in batches
          if (i % batchSize === 0 || i === numPages) {
            setThumbnails([...newThumbnails]);
            setProgress(Math.round((i / numPages) * 100));
            // Small delay to let browser breathe
            await new Promise(resolve => setTimeout(resolve, 10));
          }
        }
      } catch (err: any) {
        console.error("Error generating thumbnails:", err);
        if (isMounted) {
          setError(err.message || "Failed to generate PDF thumbnails");
        }
      } finally {
        if (isMounted) {
          setIsGenerating(false);
        }
      }
    };

    generateThumbnails();

    return () => {
      isMounted = false;
      if (loadingTask) {
        loadingTask.destroy().catch(console.error);
      }
    };
  }, [file]);

  // Expose setter so components can update rotation, order, selection
  return { thumbnails, setThumbnails, isGenerating, progress, error };
}
