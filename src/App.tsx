import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Home } from './pages/Home';
import { MergePDF } from './pages/MergePDF';
import { SplitPDF } from './pages/SplitPDF';
import { RotatePDF } from './pages/RotatePDF';
import { RemovePages } from './pages/RemovePages';
import { ExtractPages } from './pages/ExtractPages';
import { OrganizePDF } from './pages/OrganizePDF';
import { ScanPDF } from './pages/ScanPDF';
import { CompressPDF } from './pages/CompressPDF';
import { RepairPDF } from './pages/RepairPDF';
import { OCRPDF } from './pages/OCRPDF';
import { JPGtoPDF } from './pages/JPGtoPDF';
import { WORDtoPDF } from './pages/WORDtoPDF';
import { POWERPOINTtoPDF } from './pages/POWERPOINTtoPDF';
import { EXCELtoPDF } from './pages/EXCELtoPDF';
import { HTMLtoPDF } from './pages/HTMLtoPDF';
import { PDFtoJPG } from './pages/PDFtoJPG';
import { PDFtoWORD } from './pages/PDFtoWORD';
import { PDFtoPOWERPOINT } from './pages/PDFtoPOWERPOINT';
import { PDFtoEXCEL } from './pages/PDFtoEXCEL';
import { PDFtoPDFA } from './pages/PDFtoPDFA';
import { AddPageNumbers } from './pages/AddPageNumbers';
import { AddWatermark } from './pages/AddWatermark';
import { CropPDF } from './pages/CropPDF';
import { EditPDF } from './pages/EditPDF';
import { PDFForms } from './pages/PDFForms';
import { UnlockPDF } from './pages/UnlockPDF';
import { ProtectPDF } from './pages/ProtectPDF';
import { SignPDF } from './pages/SignPDF';
import { RedactPDF } from './pages/RedactPDF';
import { ComparePDF } from './pages/ComparePDF';
import { AISummarizer } from './pages/AISummarizer';
import { TranslatePDF } from './pages/TranslatePDF';
import { Contact } from './pages/Contact';
import { AboutUs } from './pages/AboutUs';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="pattern-bg" />
      <Header />
      <main style={{ minHeight: 'calc(100vh - 76px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/merge_pdf" element={<MergePDF />} />
          <Route path="/split_pdf" element={<SplitPDF />} />
          <Route path="/rotate_pdf" element={<RotatePDF />} />
          <Route path="/remove_pages" element={<RemovePages />} />
          <Route path="/extract_pages" element={<ExtractPages />} />
          <Route path="/organize_pdf" element={<OrganizePDF />} />
          <Route path="/scan_pdf" element={<ScanPDF />} />
          <Route path="/compress_pdf" element={<CompressPDF />} />
          <Route path="/repair_pdf" element={<RepairPDF />} />
          <Route path="/ocr_pdf" element={<OCRPDF />} />
          <Route path="/jpg_to_pdf" element={<JPGtoPDF />} />
          <Route path="/word-to-pdf" element={<WORDtoPDF />} />
          <Route path="/powerpoint-to-pdf" element={<POWERPOINTtoPDF />} />
          <Route path="/excel-to-pdf" element={<EXCELtoPDF />} />
          <Route path="/html_to_pdf" element={<HTMLtoPDF />} />
          <Route path="/pdf_to_jpg" element={<PDFtoJPG />} />
          <Route path="/pdf_to_word" element={<PDFtoWORD />} />
          <Route path="/pdf_to_powerpoint" element={<PDFtoPOWERPOINT />} />
          <Route path="/pdf_to_excel" element={<PDFtoEXCEL />} />
          <Route path="/pdf_to_pdfa" element={<PDFtoPDFA />} />
          <Route path="/add_page_numbers" element={<AddPageNumbers />} />
          <Route path="/add_watermark" element={<AddWatermark />} />
          <Route path="/crop_pdf" element={<CropPDF />} />
          <Route path="/edit_pdf" element={<EditPDF />} />
          <Route path="/pdf_forms" element={<PDFForms />} />
          <Route path="/unlock_pdf" element={<UnlockPDF />} />
          <Route path="/protect_pdf" element={<ProtectPDF />} />
          <Route path="/sign_pdf" element={<SignPDF />} />
          <Route path="/redact_pdf" element={<RedactPDF />} />
          <Route path="/compare_pdf" element={<ComparePDF />} />
          <Route path="/ai_summarizer" element={<AISummarizer />} />
          <Route path="/translate_pdf" element={<TranslatePDF />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          {/* We will add other routes as we implement them */}
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
