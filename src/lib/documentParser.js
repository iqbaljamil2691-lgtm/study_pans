/**
 * Multi-format Document Text Extraction Parser
 * Supports: .txt, .pdf, .docx, .pptx
 */
import JSZip from 'jszip';
import mammoth from 'mammoth';

/**
 * Extracts plain text from a File object based on its file extension.
 * @param {File} file 
 * @returns {Promise<{ text: string, type: string, pageOrSlideCount: number, wordCount: number }>}
 */
export async function parseDocument(file) {
  const fileName = file.name.toLowerCase();
  let extractedText = '';
  let type = 'unknown';
  let pageOrSlideCount = 1;

  try {
    if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
      type = 'TXT Document';
      extractedText = await parseTxtFile(file);
    } else if (fileName.endsWith('.pdf')) {
      type = 'PDF Document';
      extractedText = await parsePdfFile(file);
      // Rough page estimation based on form feed or page dividers
      const pages = extractedText.split(/--- Page \d+ ---/g);
      if (pages.length > 1) pageOrSlideCount = pages.length - 1;
    } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      type = 'DOCX Word Document';
      extractedText = await parseDocxFile(file);
    } else if (fileName.endsWith('.pptx') || fileName.endsWith('.ppt')) {
      type = 'PPTX Presentation Slides';
      const pptResult = await parsePptxFile(file);
      extractedText = pptResult.text;
      pageOrSlideCount = pptResult.slideCount;
    } else {
      // Fallback text reader
      type = 'Text Document';
      extractedText = await parseTxtFile(file);
    }

    const words = extractedText.trim().split(/\s+/).filter(Boolean);
    
    return {
      text: extractedText,
      type,
      pageOrSlideCount,
      wordCount: words.length,
      fileName: file.name,
      fileSize: formatFileSize(file.size),
      uploadedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error parsing file ${file.name}:`, error);
    throw new Error(`Failed to parse ${file.name}: ${error.message}`);
  }
}

/**
 * Parse plain text files
 */
async function parseTxtFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result || '');
    reader.onerror = (e) => reject(new Error('Failed to read text file.'));
    reader.readAsText(file);
  });
}

/**
 * Parse DOCX files using mammoth.js
 */
async function parseDocxFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value || '';
}

/**
 * Parse PPTX files by unzipping ppt/slides/slide*.xml and extracting text nodes (<a:t>)
 */
async function parsePptxFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  
  // Find all slide XML files
  const slideFiles = [];
  zip.forEach((relativePath) => {
    if (relativePath.match(/^ppt\/slides\/slide\d+\.xml$/i)) {
      slideFiles.push(relativePath);
    }
  });

  // Sort slides numerically (slide1.xml, slide2.xml, slide10.xml, etc.)
  slideFiles.sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0], 10);
    const numB = parseInt(b.match(/\d+/)[0], 10);
    return numA - numB;
  });

  let fullText = '';
  let slideCount = slideFiles.length || 1;

  for (let i = 0; i < slideFiles.length; i++) {
    const slidePath = slideFiles[i];
    const xmlText = await zip.file(slidePath).async('text');
    
    // Extract text inside <a:t> XML tags using regex
    const textMatches = xmlText.match(/<a:t[^>]*>(.*?)<\/a:t>/g) || [];
    const slideText = textMatches
      .map(tag => tag.replace(/<[^>]+>/g, '').trim())
      .filter(Boolean)
      .join(' ');

    if (slideText) {
      fullText += `--- Slide ${i + 1} ---\n${slideText}\n\n`;
    }
  }

  if (!fullText) {
    fullText = `Extracted presentation metadata from ${file.name}.`;
  }

  return { text: fullText, slideCount };
}

/**
 * Parse PDF file using pdfjs-dist dynamically loaded or web worker fallback
 */
async function parsePdfFile(file) {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    // Set worker source if available
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const tokenizedText = await page.getTextContent();
      const pageText = tokenizedText.items.map(item => item.str).join(' ');
      text += `--- Page ${i} ---\n${pageText}\n\n`;
    }
    return text;
  } catch (err) {
    console.warn('PDF.js dynamic load failed, using basic binary text extraction fallback:', err);
    // Fallback: simple text decoding from binary buffer for basic readable text
    const text = await parseTxtFile(file);
    return text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ');
  }
}

/**
 * Format bytes to readable string (e.g. 1.2 MB)
 */
function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
