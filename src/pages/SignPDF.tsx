import { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { PDFDocument } from 'pdf-lib';
import { Uploader } from '../components/Uploader/Uploader';

export function SignPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sigCanvas = useRef<SignatureCanvas | null>(null);

  const handleFileSelect = (files: File[]) => {
    setFile(files[0]);
    setError(null);
  };

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  const executeSign = async () => {
    if (!file || !sigCanvas.current || sigCanvas.current.isEmpty()) {
      setError('Por favor dibuja tu firma antes de continuar.');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // 1. Get Signature as PNG
      const signatureDataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      const sigImageBytes = await fetch(signatureDataUrl).then(res => res.arrayBuffer());

      // 2. Load PDF
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // 3. Embed signature
      const signatureImage = await pdfDoc.embedPng(sigImageBytes);
      
      // 4. Draw on the last page at the bottom right
      const pages = pdfDoc.getPages();
      const lastPage = pages[pages.length - 1];
      const { width } = lastPage.getSize();
      
      // Scale signature to fit nicely (e.g. max width 150px)
      const sigDims = signatureImage.scaleToFit(150, 100);

      lastPage.drawImage(signatureImage, {
        x: width - sigDims.width - 50,
        y: 50,
        width: sigDims.width,
        height: sigDims.height,
      });

      // 5. Save and Download
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `signed_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setFile(null);
    } catch (err: any) {
      console.error('Error:', err);
      setError('Ocurrió un error al firmar el documento.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>Sign PDF</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Draw your signature and append it to your document instantly.
        </p>
      </div>

      {error && (
        <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', width: '100%', maxWidth: '800px', textAlign: 'center', border: '1px solid #FCA5A5' }}>
          {error}
        </div>
      )}

      {!file ? (
        <Uploader 
          onProcess={handleFileSelect} 
          title="Select PDF to Sign" 
          multiple={false} 
          actionText="Select Document"
          isProcessing={isProcessing}
        />
      ) : (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            Dibuja tu firma para <strong>{file.name}</strong>
          </h3>
          
          <div style={{ border: '2px dashed #CBD5E1', borderRadius: '8px', background: '#F8FAFC', cursor: 'crosshair', width: '100%', maxWidth: '500px' }}>
            <SignatureCanvas 
              ref={sigCanvas} 
              penColor="black"
              canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} 
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button 
              onClick={clearSignature}
              style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: '#F1F5F9', color: '#475569', cursor: 'pointer', fontWeight: 600 }}
            >
              Borrar
            </button>
            <button 
              onClick={executeSign}
              disabled={isProcessing}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              {isProcessing ? 'Firmando...' : 'Firmar Documento'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
