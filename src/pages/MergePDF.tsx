import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Uploader } from '../components/Uploader/Uploader';

export function MergePDF() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async (files: File[]) => {
    setIsProcessing(true);
    setError(null);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }

      const mergedPdfBytes = await mergedPdf.save();
      
      // Trigger download
      const blob = new Blob([mergedPdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'FlexiPDF_merged.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error merging PDFs:', err);
      setError('Failed to merge PDFs. Please make sure all files are valid PDF documents and are not password protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>Merge PDF files</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Combine PDFs in the order you want with the easiest PDF merger available. 
          100% free and processed directly in your browser.
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
        actionText="Merge PDF"
        isProcessing={isProcessing}
      />
    </div>
  );
}
