import { useState, useRef, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Camera } from 'lucide-react';

export function ScanPDF() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Cleanup stream on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error(err);
      setError('No se pudo acceder a la cámara. Verifica los permisos de tu navegador.');
    }
  };

  const captureFrame = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImages(prev => [...prev, dataUrl]);
      }
    }
  };

  const removeImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
  };

  const generatePDF = async () => {
    if (capturedImages.length === 0) return;
    setIsProcessing(true);
    setError(null);
    try {
      const pdfDoc = await PDFDocument.create();

      for (const dataUrl of capturedImages) {
        const imageBytes = await fetch(dataUrl).then(res => res.arrayBuffer());
        const image = await pdfDoc.embedJpg(imageBytes);
        
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
      link.download = 'scanned_document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Cleanup
      setCapturedImages([]);
    } catch (err) {
      console.error('Error:', err);
      setError('Ocurrió un error al generar el PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>Scan to PDF</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Capture documents directly from your webcam or mobile camera and save them as PDF.
        </p>
      </div>

      {error && (
        <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', width: '100%', maxWidth: '800px', textAlign: 'center', border: '1px solid #FCA5A5' }}>
          {error}
        </div>
      )}

      <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Camera Viewport */}
        <div style={{ width: '100%', background: '#000', borderRadius: '12px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', position: 'relative' }}>
          {!stream ? (
            <button 
              onClick={startCamera}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <Camera size={48} />
              <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Permitir acceso a la cámara</span>
            </button>
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              style={{ width: '100%', maxHeight: '600px', objectFit: 'contain' }}
            />
          )}
        </div>

        {/* Capture Button */}
        {stream && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={captureFrame}
              className="btn btn-primary"
              style={{ borderRadius: '50px', padding: '1rem 3rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Camera size={24} />
              Capturar Página
            </button>
          </div>
        )}

        {/* Captured Images Preview */}
        {capturedImages.length > 0 && (
          <div>
            <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Páginas Escaneadas ({capturedImages.length})</h3>
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
              {capturedImages.map((img, i) => (
                <div key={i} style={{ position: 'relative', minWidth: '120px' }}>
                  <img src={img} alt={`Page ${i+1}`} style={{ width: '120px', height: '160px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #e5e7eb' }} />
                  <button 
                    onClick={() => removeImage(i)}
                    style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button 
                onClick={generatePDF}
                disabled={isProcessing}
                className="btn btn-primary"
              >
                {isProcessing ? 'Generando PDF...' : 'Generar PDF Final'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
