import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { ToolPageTemplate } from '../components/ToolPageTemplate/ToolPageTemplate';

export function CompressPDF() {
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
        
        // Remove metadata to save space
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('');
        pdfDoc.setCreator('');

        // Save with object streams which compresses the PDF structure
        const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
        
        if (files.length === 1) {
          const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `compressed_${file.name}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } else {
          zip.file(`compressed_${file.name}`, pdfBytes);
        }
      }

      if (files.length > 1) {
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'compressed_pdfs.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Ocurrió un error al comprimir. Asegúrate de que el PDF sea válido y no esté protegido.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolPageTemplate 
      title="Compress PDF"
      description="Reduce file size while optimizing for maximal PDF quality. (Client-side structural compression)."
      actionText="Compress PDF"
      multiple={true}
      isProcessing={isProcessing}
      error={error}
      onProcess={handleProcess}
    />
  );
}
