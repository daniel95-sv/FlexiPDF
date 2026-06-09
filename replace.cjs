const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'README.md',
    'index.html',
    'src/components/Footer/Footer.tsx',
    'src/components/Header/Header.tsx',
    'src/pages/AboutUs.tsx',
    'src/pages/Contact.tsx',
    'src/pages/JPGtoPDF.tsx',
    'src/pages/MergePDF.tsx',
    'src/pages/PDFtoPDFA.tsx',
    'src/pages/Privacy.tsx',
    'src/pages/Terms.tsx'
];

filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Replace exact match first
        content = content.replace(/iLoveFree/g, 'FlexiPDF');
        // Replace lowercase for title and filenames
        content = content.replace(/ilovefree/g, 'FlexiPDF');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    } else {
        console.warn(`File not found: ${file}`);
    }
});
