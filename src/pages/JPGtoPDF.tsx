import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { ToolPageTemplate } from '../components/ToolPageTemplate/ToolPageTemplate';

export function JPGtoPDF() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async (files: File[]) => {
    setIsProcessing(true);
    setError(null);
    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        let image;
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          image = await pdfDoc.embedJpg(arrayBuffer);
        } else if (file.type === 'image/png') {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else {
          continue; // skip unsupported
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'FlexiPDF_images.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to convert images to PDF. Make sure you upload valid JPG or PNG files.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolPageTemplate 
      title="JPG to PDF"
      description="Convert JPG images to PDF in seconds. Easily adjust orientation and margins."
      actionText="Convert to PDF"
      multiple={true}
      isProcessing={isProcessing}
      error={error}
      onProcess={handleProcess}
      accept="image/jpeg, image/png, image/jpg"
    />
  );
}
