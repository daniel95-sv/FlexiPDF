import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { Uploader } from '../components/Uploader/Uploader';

export function SplitPDF() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0]; // Split handles one file at a time
    
    setIsProcessing(true);
    setError(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const numberOfPages = pdfDoc.getPageCount();
      
      const zip = new JSZip();

      for (let i = 0; i < numberOfPages; i++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(copiedPage);
        const pdfBytes = await newPdf.save();
        zip.file(`page_${i + 1}.pdf`, pdfBytes);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${file.name.replace('.pdf', '')}_split.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error splitting PDF:', err);
      setError('Failed to split PDF. Please make sure the file is a valid PDF document and not password protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>Split PDF</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Separate every page of a PDF file into independent PDF files. 
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
        title="Select PDF file" 
        multiple={false} 
        actionText="Split PDF"
        isProcessing={isProcessing}
      />
    </div>
  );
}
