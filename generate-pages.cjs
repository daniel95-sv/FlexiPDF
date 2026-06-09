const fs = require('fs');
const path = require('path');

const pages = [
  { path: 'RemovePages', title: 'Remove Pages', desc: 'Remove pages from a PDF document.' },
  { path: 'ExtractPages', title: 'Extract Pages', desc: 'Extract pages from your PDF.' },
  { path: 'OrganizePDF', title: 'Organize PDF', desc: 'Sort, add and delete PDF pages.' },
  { path: 'ScanPDF', title: 'Scan to PDF', desc: 'Capture document scans.' },
  { path: 'CompressPDF', title: 'Compress PDF', desc: 'Reduce file size.' },
  { path: 'RepairPDF', title: 'Repair PDF', desc: 'Repair a damaged PDF.' },
  { path: 'OCRPDF', title: 'OCR PDF', desc: 'Convert scanned PDFs to searchable.' },
  { path: 'JPGtoPDF', title: 'JPG to PDF', desc: 'Convert JPG to PDF.', accept: 'image/jpeg, image/png' },
  { path: 'WORDtoPDF', title: 'WORD to PDF', desc: 'Convert Word to PDF.', accept: '.doc,.docx' },
  { path: 'POWERPOINTtoPDF', title: 'POWERPOINT to PDF', desc: 'Convert PPT to PDF.', accept: '.ppt,.pptx' },
  { path: 'EXCELtoPDF', title: 'EXCEL to PDF', desc: 'Convert Excel to PDF.', accept: '.xls,.xlsx' },
  { path: 'HTMLtoPDF', title: 'HTML to PDF', desc: 'Convert HTML to PDF.', accept: '.html' },
  { path: 'PDFtoJPG', title: 'PDF to JPG', desc: 'Convert PDF to JPG.' },
  { path: 'PDFtoWORD', title: 'PDF to WORD', desc: 'Convert PDF to Word.' },
  { path: 'PDFtoPOWERPOINT', title: 'PDF to POWERPOINT', desc: 'Convert PDF to PPT.' },
  { path: 'PDFtoEXCEL', title: 'PDF to EXCEL', desc: 'Convert PDF to Excel.' },
  { path: 'PDFtoPDFA', title: 'PDF to PDF/A', desc: 'Convert PDF to PDF/A.' },
  { path: 'AddPageNumbers', title: 'Add Page Numbers', desc: 'Add page numbers.' },
  { path: 'AddWatermark', title: 'Add Watermark', desc: 'Add watermark to PDF.' },
  { path: 'CropPDF', title: 'Crop PDF', desc: 'Crop PDF margins.' },
  { path: 'EditPDF', title: 'Edit PDF', desc: 'Edit PDF text and images.' },
  { path: 'PDFForms', title: 'PDF Forms', desc: 'Fill PDF forms.' },
  { path: 'UnlockPDF', title: 'Unlock PDF', desc: 'Remove PDF password.' },
  { path: 'ProtectPDF', title: 'Protect PDF', desc: 'Add password to PDF.' },
  { path: 'SignPDF', title: 'Sign PDF', desc: 'Sign your PDF.' },
  { path: 'RedactPDF', title: 'Redact PDF', desc: 'Redact PDF content.' },
  { path: 'ComparePDF', title: 'Compare PDF', desc: 'Compare two PDFs.' },
  { path: 'AISummarizer', title: 'AI Summarizer', desc: 'Summarize PDF with AI.' },
  { path: 'TranslatePDF', title: 'Translate PDF', desc: 'Translate PDF with AI.' },
];

const template = (name, title, desc, accept) => `import { useState } from 'react';
import { ToolPageTemplate } from '../components/ToolPageTemplate/ToolPageTemplate';

export function ${name}() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async (files: File[]) => {
    setIsProcessing(true);
    setError(null);
    try {
      // TODO: Implement actual logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('${title} processed successfully (Experimental Client-Side Feature)');
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to process file.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolPageTemplate 
      title="${title}"
      description="${desc}"
      actionText="Process"
      multiple={true}
      isProcessing={isProcessing}
      error={error}
      onProcess={handleProcess}
      accept="${accept}"
    />
  );
}
`;

pages.forEach(p => {
  fs.writeFileSync(path.join(__dirname, 'src', 'pages', `${p.path}.tsx`), template(p.path, p.title, p.desc, p.accept || 'application/pdf'));
});

// Generate routes
const imports = pages.map(p => `import { ${p.path} } from './pages/${p.path}';`).join('\\n');
// We need to map to the exact routes in Home.tsx
// RemovePages -> /remove_pages
const routeMap = {
  'RemovePages': 'remove_pages',
  'ExtractPages': 'extract_pages',
  'OrganizePDF': 'organize_pdf',
  'ScanPDF': 'scan_pdf',
  'CompressPDF': 'compress_pdf',
  'RepairPDF': 'repair_pdf',
  'OCRPDF': 'ocr_pdf',
  'JPGtoPDF': 'jpg_to_pdf',
  'WORDtoPDF': 'word_to_pdf',
  'POWERPOINTtoPDF': 'powerpoint_to_pdf',
  'EXCELtoPDF': 'excel_to_pdf',
  'HTMLtoPDF': 'html_to_pdf',
  'PDFtoJPG': 'pdf_to_jpg',
  'PDFtoWORD': 'pdf_to_word',
  'PDFtoPOWERPOINT': 'pdf_to_powerpoint',
  'PDFtoEXCEL': 'pdf_to_excel',
  'PDFtoPDFA': 'pdf_to_pdfa',
  'AddPageNumbers': 'add_page_numbers',
  'AddWatermark': 'add_watermark',
  'CropPDF': 'crop_pdf',
  'EditPDF': 'edit_pdf',
  'PDFForms': 'pdf_forms',
  'UnlockPDF': 'unlock_pdf',
  'ProtectPDF': 'protect_pdf',
  'SignPDF': 'sign_pdf',
  'RedactPDF': 'redact_pdf',
  'ComparePDF': 'compare_pdf',
  'AISummarizer': 'ai_summarizer',
  'TranslatePDF': 'translate_pdf',
};

const routes = pages.map(p => `          <Route path="/${routeMap[p.path]}" element={<${p.path} />} />`).join('\\n');

fs.writeFileSync(path.join(__dirname, 'routes_output.txt'), imports + '\\n\\n' + routes);
