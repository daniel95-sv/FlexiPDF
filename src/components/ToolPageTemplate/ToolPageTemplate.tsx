
import { Uploader } from '../Uploader/Uploader';

interface ToolPageTemplateProps {
  title: string;
  description: string;
  actionText: string;
  multiple: boolean;
  isProcessing: boolean;
  error: string | null;
  onProcess: (files: File[]) => void;
  accept?: string;
}

export function ToolPageTemplate({
  title, description, actionText, multiple, isProcessing, error, onProcess, accept = "application/pdf"
}: ToolPageTemplateProps) {
  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>{title}</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: 1.6 }}>{description}</p>
      </div>

      {error && (
        <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', width: '100%', maxWidth: '800px', textAlign: 'center', border: '1px solid #FCA5A5' }}>
          {error}
        </div>
      )}

      <Uploader 
        onProcess={onProcess} 
        title={`Select files`} 
        multiple={multiple} 
        actionText={actionText}
        isProcessing={isProcessing}
        accept={accept}
      />
    </div>
  );
}
