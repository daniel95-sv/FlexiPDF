# FlexiPDF 🚀
**El clon definitivo, gratuito y de código abierto de iLovePDF.**

![FlexiPDF Preview](https://img.shields.io/badge/Status-Production%20Ready-success)
![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Client%20Side-blue)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)

FlexiPDF es una poderosa plataforma web que incluye más de 30 herramientas de manipulación, conversión y análisis de documentos PDF. 

**La principal diferencia:** FlexiPDF está diseñada con una arquitectura **100% Client-Side**. Esto significa que **ningún documento abandona tu computadora**. Todo el procesamiento masivo, incluyendo el Reconocimiento Óptico de Caracteres (OCR) con Inteligencia Artificial, ocurre estrictamente en la memoria RAM de tu navegador. Máxima privacidad, latencia nula y cero costos de servidor.

## 🌟 Características Principales

### 🛠️ Manipulación Avanzada de PDFs
- **Merge & Split:** Une y divide documentos instantáneamente sin límites de tamaño de subida.
- **Compress PDF:** Reduce drásticamente el peso de tus PDFs usando reestructuración de Object Streams.
- **Rotate, Extract & Remove:** Gira hojas, extrae páginas específicas o elimina contenido confidencial.
- **Organize & Edit:** Reordena las hojas, añade firmas dibujadas interactivamente y crea o llena formularios.
- **Watermark & Page Numbers:** Estampa marcas de agua personalizadas y añade numeración dinámica a tus documentos.

### 🔄 Conversores (Gratuitos)
- **PDF a Imágenes & Imágenes a PDF:** Extrae páginas enteras en alta resolución (JPG) o crea un PDF a partir de una galería.
- **HTML a PDF:** Renderiza código o dominios visuales hacia documentos PDF.
- **PDF a Word, Excel & PowerPoint:** Extrae el texto, datos y tablas desde tu navegador, y reconstruye archivos de Microsoft Office de manera gratuita (Conversión de texto puro, *Best-Effort*).

### 🤖 Inteligencia Artificial Integrada (Local)
- **OCR PDF:** Extrae texto real de archivos PDF escaneados o imágenes bloqueadas usando redes neuronales locales (`tesseract.js`).
- **AI Summarizer:** Descarga un pequeño modelo de lenguaje (`Transformers.js`) a tu caché y resume grandes volúmenes de texto de forma offline y privada.

## 🚀 Despliegue en Cloudflare Pages

El proyecto compila sin depender de ningún backend o API externa (con excepción opcional de encriptación militar en la carpeta `/backend`).

Para subirlo a producción de forma rápida y escalable:
1. Conecta este repositorio en tu cuenta de **Cloudflare Pages**.
2. Selecciona **Vite** como framework.
3. El comando de compilación es `npm run build`.
4. El directorio de salida es `dist`.

*(Cloudflare se encargará de gestionar el `public/_redirects` incorporado para que el enrutamiento visual de Single Page Application funcione perfectamente).*

## 💻 Desarrollo Local

¿Quieres probar, modificar o mejorar el código en tu computadora?

1. Clona el repositorio:
   ```bash
   git clone https://github.com/TU-USUARIO/FlexiPDF-Web.git
   cd FlexiPDF-Web
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor local de desarrollo:
   ```bash
   npm run dev
   ```

4. Compila para producción:
   ```bash
   npm run build
   ```

## 🏗️ Stack Tecnológico
* **React 18 + TypeScript**
* **Vite** (Empaquetador ultra-rápido)
* **pdf-lib** (Manipulación estructural del PDF, uniones, encriptación)
* **pdf.js** de Mozilla (Renderización fotográfica en Canvas, extracción de texto)
* **Transformers.js** & **Tesseract.js** (Motores de IA locales)
* **React Router v6** (Enrutamiento dinámico SPA)

## 🛡️ Aviso Legal
FlexiPDF es una herramienta construida enteramente con fines educativos y de empoderamiento open-source. No guarda relación con herramientas comerciales de nombre similar. Tu privacidad es tuya. 
