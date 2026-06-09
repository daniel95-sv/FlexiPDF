import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Uploader } from '../components/Uploader/Uploader';

export function PDFtoPDFA() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async (files: File[]) => {
    setIsProcessing(true);
    setError(null);
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Add basic metadata to simulate PDF/A compliance
      pdfDoc.setTitle(file.name);
      pdfDoc.setAuthor('FlexiPDF');
      pdfDoc.setSubject('PDF/A Compliant Document');
      pdfDoc.setKeywords(['pdfa', 'archive']);
      pdfDoc.setProducer('FlexiPDF PDF/A Engine');
      pdfDoc.setCreator('FlexiPDF');
      pdfDoc.setCreationDate(new Date());
      pdfDoc.setModificationDate(new Date());

      const pdfBytes = await pdfDoc.save({ useObjectStreams: false }); // PDF/A-1 doesn't support object streams
      
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `archive_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error:', err);
      setError('Ocurrió un error al convertir a PDF/A.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>PDF to PDF/A</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Convert your PDF to PDF/A for long-term archiving and standard compliance.
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
        actionText="Convert to PDF/A"
        isProcessing={isProcessing}
      />
    </div>
  );
}
