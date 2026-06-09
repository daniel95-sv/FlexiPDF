import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { ToolPageTemplate } from '../components/ToolPageTemplate/ToolPageTemplate';

export function UnlockPDF() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async (files: File[]) => {
    setIsProcessing(true);
    setError(null);
    try {
      const zip = new JSZip();
      let processedCount = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const arrayBuffer = await file.arrayBuffer();
        
        let pdfDoc;
        try {
          // Attempt to load without password first
          pdfDoc = await PDFDocument.load(arrayBuffer);
        } catch (err: any) {
          if (err.message && err.message.includes('encrypted')) {
            // Document is encrypted, prompt for password
            let password = prompt(`El archivo "${file.name}" está protegido. Ingresa la contraseña:`);
            let loaded = false;
            
            while (!loaded && password !== null) {
              try {
                pdfDoc = await PDFDocument.load(arrayBuffer, { password } as any);
                loaded = true;
              } catch (pwErr: any) {
                if (pwErr.message && pwErr.message.includes('encrypted')) {
                  password = prompt(`Contraseña incorrecta para "${file.name}". Intenta de nuevo:`);
                } else {
                  throw pwErr;
                }
              }
            }
            
            if (!loaded) {
              // User cancelled prompt
              continue; 
            }
          } else {
            throw err;
          }
        }

        if (pdfDoc) {
          // Guardar el PDF (se guarda sin encriptación por defecto en pdf-lib)
          const pdfBytes = await pdfDoc.save();
          if (files.length === 1) {
            // Single file download
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `unlocked_${file.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            processedCount++;
            break;
          } else {
            zip.file(`unlocked_${file.name}`, pdfBytes);
            processedCount++;
          }
        }
      }

      if (files.length > 1 && processedCount > 0) {
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'unlocked_pdfs.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      
      if (processedCount === 0) {
         setError('No se pudo desbloquear ningún archivo. Quizás cancelaste la contraseña.');
      }

    } catch (err) {
      console.error('Error:', err);
      setError('Ocurrió un error al procesar el documento. Verifica si es un PDF válido.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolPageTemplate 
      title="Unlock PDF"
      description="Remove PDF password security, giving you the freedom to use your PDFs as you want."
      actionText="Unlock PDF"
      multiple={true}
      isProcessing={isProcessing}
      error={error}
      onProcess={handleProcess}
    />
  );
}
