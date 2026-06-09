const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'pages');

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 

    files.forEach((file) => {
        if (file.endsWith('.tsx')) {
            const filePath = path.join(directoryPath, file);
            let content = fs.readFileSync(filePath, 'utf8');
            
            const oldUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs';
            const newUrl = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs';
            
            if (content.includes(oldUrl)) {
                content = content.replace(oldUrl, newUrl);
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Updated ${file}`);
            }
        }
    });
});
