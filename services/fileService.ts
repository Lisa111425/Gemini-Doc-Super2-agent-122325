import * as mammoth from 'https://esm.sh/mammoth';
import * as pdfjsLib from 'https://esm.sh/pdfjs-dist@3.11.174';

// Handle ESM import structure where default export might contain the library
const pdf = (pdfjsLib as any).default || pdfjsLib;
const mammothClient = (mammoth as any).default || mammoth;

// Set worker source
if (pdf.GlobalWorkerOptions) {
    pdf.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;
} else {
    console.warn("AuditFlow: PDF.js GlobalWorkerOptions not found. PDF parsing may fail.");
}

export const extractTextFromFile = async (file: File): Promise<string> => {
  const fileType = file.type;

  if (fileType === 'application/pdf') {
    return extractTextFromPDF(file);
  } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return extractTextFromDocx(file);
  } else if (fileType === 'text/plain' || fileType === 'text/markdown') {
    return await file.text();
  } else {
    throw new Error('Unsupported file type');
  }
};

const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    // Use the resolved 'pdf' object which ensures we access the library correctly
    const loadingTask = pdf.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += `--- Page ${i} ---\n${pageText}\n\n`;
    }
    return fullText;
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    throw new Error("Failed to parse PDF. Please ensure it is a valid PDF file.");
  }
};

const extractTextFromDocx = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammothClient.extractRawText({ arrayBuffer: arrayBuffer });
    return result.value;
  } catch (error) {
    console.error("DOCX Parsing Error:", error);
    throw new Error("Failed to parse DOCX.");
  }
};

export const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
             const result = reader.result as string;
             // Remove data URL prefix (e.g., "data:application/pdf;base64,")
             const base64 = result.split(',')[1];
             resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}