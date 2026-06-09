import { useState } from 'react';
import { ToolPageTemplate } from '../components/ToolPageTemplate/ToolPageTemplate';

export function POWERPOINTtoPDF() {
  const [isProcessing] = useState(false);
  const [error] = useState<string | null>(null);

  const handleProcess = async () => {
    alert('La conversión de PowerPoint a PDF de forma nativa requiere motores de renderizado de diapositivas que exceden la capacidad del navegador. Esta herramienta estará disponible en la actualización de backend (Cloudflare Workers) para asegurar un formato idéntico al original.');
  };

  return (
    <ToolPageTemplate 
      title="PowerPoint to PDF"
      description="Convert PPTX presentations to PDF. This feature relies on our secure backend infrastructure to maintain 1:1 slide formatting."
      actionText="Convert PowerPoint to PDF"
      multiple={false}
      isProcessing={isProcessing}
      error={error}
      onProcess={handleProcess}
    />
  );
}
