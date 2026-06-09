import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Uploader } from '../components/Uploader/Uploader';

export function PDFForms() {
  const [file, setFile] = useState<File | null>(null);
  const [fieldName, setFieldName] = useState<string>('MiCampoTexto');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (files: File[]) => {
    try {
      setFile(files[0]);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('No se pudo leer el archivo. Verifica que sea un PDF válido.');
    }
  };

  const executeForm = async () => {
    if (!file || !fieldName.trim()) return;
    setIsProcessing(true);
    setError(null);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const form = pdfDoc.getForm();
      
      const page = pdfDoc.getPage(0);
      const { height } = page.getSize();
      
      // Try to create a text field. If it exists, it will throw, so we catch or generate unique
      const uniqueFieldName = `${fieldName}_${Date.now()}`;
      const textField = form.createTextField(uniqueFieldName);
      
      textField.addToPage(page, {
        x: 50,
        y: height - 100,
        width: 200,
        height: 30,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `form_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setFile(null);
      setFieldName('');
    } catch (err: any) {
      console.error(err);
      setError('Ocurrió un error al crear el campo de formulario en el PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>PDF Forms</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          Add interactive text fields to your PDF documents so others can fill them out.
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
          title="Select PDF file" 
          multiple={false} 
          actionText="Select"
          isProcessing={isProcessing}
        />
      ) : (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', width: '100%', maxWidth: '600px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Archivo: <strong>{file.name}</strong></h3>
          
          <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nombre del campo interactivo a añadir (Página 1):</label>
            <input 
              type="text" 
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="Ej: Nombre Completo"
              style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '2px solid #eee', fontSize: '1.1rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              onClick={() => setFile(null)}
              style={{ padding: '1rem 2rem', borderRadius: '8px', border: 'none', background: '#f3f4f6', color: '#4b5563', cursor: 'pointer', fontWeight: 600 }}
            >
              Cancelar
            </button>
            <button 
              onClick={executeForm}
              disabled={isProcessing || !fieldName.trim()}
              className="btn btn-primary"
              style={{ padding: '1rem 2rem', borderRadius: '8px', border: 'none', cursor: fieldName.trim() ? 'pointer' : 'not-allowed', fontWeight: 600 }}
            >
              {isProcessing ? 'Procesando...' : 'Añadir Campo'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
