import { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import JSZip from 'jszip';
import { Uploader } from '../components/Uploader/Uploader';

export function RotatePDF() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async (files: File[]) => {
    setIsProcessing(true);
    setError(null);
    try {
      if (files.length === 1) {
        // Single file processing
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        
        const pages = pdfDoc.getPages();
        pages.forEach((page) => {
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees(currentRotation + 90));
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${file.name.replace('.pdf', '')}_rotated.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // Multiple files processing -> ZIP
        const zip = new JSZip();
        for (const file of files) {
          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          const pages = pdfDoc.getPages();
          pages.forEach((page) => {
            const currentRotation = page.getRotation().angle;
            page.setRotation(degrees(currentRotation + 90));
          });
          const pdfBytes = await pdfDoc.save();
          zip.file(`${file.name.replace('.pdf', '')}_rotated.pdf`, pdfBytes);
        }
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `rotated_pdfs.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error rotating PDFs:', err);
      setError('Failed to rotate PDF. Please make sure the files are valid PDF documents.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>Rotate PDF</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Rotate your PDFs by 90 degrees. Process multiple files at once.
          Processed locally for maximum privacy and speed.
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
        actionText="Rotate PDFs (90°)"
        isProcessing={isProcessing}
      />
    </div>
  );
}
