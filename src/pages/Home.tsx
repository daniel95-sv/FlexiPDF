import { 
  FilePlus2, SplitSquareHorizontal, FileArchive, Settings2, FileOutput, Shield, Unlock, Droplet, 
  Trash2, ScanLine, Wrench, ScanText, Image, FileText, Presentation, Table, Globe,
  ImageDown, LayoutTemplate, SquarePen, FormInput, PenTool, Eraser, Columns, BrainCircuit, Languages,
  Crop, Type
} from 'lucide-react';
import { ToolCard } from '../components/ToolCard/ToolCard';
import styles from './Home.module.css';

export function Home() {
  const categories = [
    {
      title: "ORGANIZE PDF",
      tools: [
        { to: "/merge_pdf", icon: <FilePlus2 size={32} strokeWidth={1.5} />, title: "Merge PDF", description: "Combine PDFs in the order you want." },
        { to: "/split_pdf", icon: <SplitSquareHorizontal size={32} strokeWidth={1.5} />, title: "Split PDF", description: "Separate one page or a whole set." },
        { to: "/remove_pages", icon: <Trash2 size={32} strokeWidth={1.5} />, title: "Remove pages", description: "Remove pages from a PDF document." },
        { to: "/extract_pages", icon: <FileOutput size={32} strokeWidth={1.5} />, title: "Extract pages", description: "Extract pages from your PDF." },
        { to: "/organize_pdf", icon: <LayoutTemplate size={32} strokeWidth={1.5} />, title: "Organize PDF", description: "Sort, add and delete PDF pages." },
        { to: "/scan_pdf", icon: <ScanLine size={32} strokeWidth={1.5} />, title: "Scan to PDF", description: "Capture document scans from mobile or webcam." },
      ]
    },
    {
      title: "OPTIMIZE PDF",
      tools: [
        { to: "/compress_pdf", icon: <FileArchive size={32} strokeWidth={1.5} />, title: "Compress PDF", description: "Reduce file size while optimizing quality." },
        { to: "/repair_pdf", icon: <Wrench size={32} strokeWidth={1.5} />, title: "Repair PDF", description: "Repair a damaged PDF and recover data." },
        { to: "/ocr_pdf", icon: <ScanText size={32} strokeWidth={1.5} />, title: "OCR PDF", description: "Convert scanned PDFs to searchable PDFs." },
      ]
    },
    {
      title: "CONVERT TO PDF",
      tools: [
        { to: "/jpg_to_pdf", icon: <Image size={32} strokeWidth={1.5} />, title: "JPG to PDF", description: "Convert JPG images to PDF in seconds." },
        { to: "/word_to_pdf", icon: <FileText size={32} strokeWidth={1.5} />, title: "WORD to PDF", description: "Make DOC and DOCX files easy to read." },
        { to: "/powerpoint_to_pdf", icon: <Presentation size={32} strokeWidth={1.5} />, title: "POWERPOINT to PDF", description: "Turn PPT into easy to read PDFs." },
        { to: "/excel_to_pdf", icon: <Table size={32} strokeWidth={1.5} />, title: "EXCEL to PDF", description: "Pull data from Excel to PDF." },
        { to: "/html_to_pdf", icon: <Globe size={32} strokeWidth={1.5} />, title: "HTML to PDF", description: "Convert webpages to PDF documents." },
      ]
    },
    {
      title: "CONVERT FROM PDF",
      tools: [
        { to: "/pdf_to_jpg", icon: <ImageDown size={32} strokeWidth={1.5} />, title: "PDF to JPG", description: "Extract images or convert pages to JPG." },
        { to: "/pdf_to_word", icon: <FileText size={32} strokeWidth={1.5} />, title: "PDF to WORD", description: "Convert your PDF to editable DOCX." },
        { to: "/pdf_to_powerpoint", icon: <Presentation size={32} strokeWidth={1.5} />, title: "PDF to POWERPOINT", description: "Turn PDF files into PPT slideshows." },
        { to: "/pdf_to_excel", icon: <Table size={32} strokeWidth={1.5} />, title: "PDF to EXCEL", description: "Pull data from PDFs into Excel spreadsheets." },
        { to: "/pdf_to_pdfa", icon: <FileArchive size={32} strokeWidth={1.5} />, title: "PDF to PDF/A", description: "Convert PDF to PDF/A for archiving." },
      ]
    },
    {
      title: "EDIT PDF",
      tools: [
        { to: "/rotate_pdf", icon: <Settings2 size={32} strokeWidth={1.5} />, title: "Rotate PDF", description: "Rotate your PDFs the way you need them." },
        { to: "/add_page_numbers", icon: <Type size={32} strokeWidth={1.5} />, title: "Add page numbers", description: "Add page numbers to your PDFs." },
        { to: "/add_watermark", icon: <Droplet size={32} strokeWidth={1.5} />, title: "Add watermark", description: "Stamp an image or text over your PDF." },
        { to: "/crop_pdf", icon: <Crop size={32} strokeWidth={1.5} />, title: "Crop PDF", description: "Crop PDF margins or blank areas." },
        { to: "/edit_pdf", icon: <SquarePen size={32} strokeWidth={1.5} />, title: "Edit PDF", description: "Add text, images, shapes or freehand annotations." },
        { to: "/pdf_forms", icon: <FormInput size={32} strokeWidth={1.5} />, title: "PDF Forms", description: "Create or fill PDF forms." },
      ]
    },
    {
      title: "PDF SECURITY",
      tools: [
        { to: "/unlock_pdf", icon: <Unlock size={32} strokeWidth={1.5} />, title: "Unlock PDF", description: "Remove PDF password security." },
        { to: "/protect_pdf", icon: <Shield size={32} strokeWidth={1.5} />, title: "Protect PDF", description: "Encrypt your PDF with a password." },
        { to: "/sign_pdf", icon: <PenTool size={32} strokeWidth={1.5} />, title: "Sign PDF", description: "Sign yourself or request signatures." },
        { to: "/redact_pdf", icon: <Eraser size={32} strokeWidth={1.5} />, title: "Redact PDF", description: "Permanently remove sensitive information." },
        { to: "/compare_pdf", icon: <Columns size={32} strokeWidth={1.5} />, title: "Compare PDF", description: "Highlight differences between two PDFs." },
      ]
    },
    {
      title: "PDF INTELLIGENCE",
      tools: [
        { to: "/ai_summarizer", icon: <BrainCircuit size={32} strokeWidth={1.5} />, title: "AI Summarizer", description: "Summarize PDF documents locally." },
        { to: "/translate_pdf", icon: <Languages size={32} strokeWidth={1.5} />, title: "Translate PDF", description: "Translate PDFs using local AI models." },
      ]
    }
  ];

  return (
    <div className="animate-fade-in">
      <div className={styles.hero}>
        <h1 className={styles.title}>Every tool you need to work with PDFs in one place</h1>
        <h2 className={styles.subtitle}>
          Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! Merge, split, compress, extract, rotate, and watermark PDFs with just a few clicks.
        </h2>
      </div>

      <div className="container" style={{ paddingBottom: '6rem' }}>
        {categories.map((category, catIndex) => (
          <div key={catIndex} style={{ marginBottom: '4rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-light)', marginBottom: '1.5rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {category.title}
            </h3>
            <div className={styles.toolsGrid} style={{ padding: 0 }}>
              {category.tools.map((tool, index) => (
                <ToolCard 
                  key={index}
                  to={tool.to}
                  icon={tool.icon}
                  title={tool.title}
                  description={tool.description}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
