import { useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import JSZip from 'jszip';
import { ToolPageTemplate } from '../components/ToolPageTemplate/ToolPageTemplate';

export function AddPageNumbers() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async (files: File[]) => {
    setIsProcessing(true);
    setError(null);
    try {
      const zip = new JSZip();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const pages = pdfDoc.getPages();
        
        for (let pageNum = 0; pageNum < pages.length; pageNum++) {
          const page = pages[pageNum];
          const { width } = page.getSize();
          const text = `${pageNum + 1}`;
          
          const textSize = 12;
          const textWidth = helveticaFont.widthOfTextAtSize(text, textSize);
          
          page.drawText(text, {
            x: width / 2 - textWidth / 2,
            y: 20, // 20 units from the bottom
            size: textSize,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
        }

        const pdfBytes = await pdfDoc.save();
        if (files.length === 1) {
          const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `numbered_${file.name}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } else {
          zip.file(`numbered_${file.name}`, pdfBytes);
        }
      }

      if (files.length > 1) {
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'numbered_pdfs.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Ocurrió un error al procesar el archivo PDF. Verifica que sea válido y no esté encriptado.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolPageTemplate 
      title="Add Page Numbers"
      description="Add page numbers to your PDFs easily. Simply drop your files and we'll stamp the numbers at the bottom."
      actionText="Add Page Numbers"
      multiple={true}
      isProcessing={isProcessing}
      error={error}
      onProcess={handleProcess}
    />
  );
}
