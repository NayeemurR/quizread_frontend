import { PDFDocument } from "pdf-lib";

/**
 * Extract the total number of pages from a PDF file
 * @param {File} pdfFile - The PDF file to analyze
 * @returns {Promise<number>} - The total number of pages in the PDF
 */
export async function getPdfPageCount(pdfFile) {
  try {
    // Convert File to ArrayBuffer
    const arrayBuffer = await pdfFile.arrayBuffer();

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    // Get the page count
    const pageCount = pdfDoc.getPageCount();

    console.log(`PDF "${pdfFile.name}" has ${pageCount} pages`);
    return pageCount;
  } catch (error) {
    console.error("Error extracting PDF page count:", error);
    throw new Error(`Failed to extract page count from PDF: ${error.message}`);
  }
}

/**
 * Validate if a file is a valid PDF
 * @param {File} file - The file to validate
 * @returns {boolean} - True if the file is a valid PDF
 */
export function isValidPdf(file) {
  return file && file.type === "application/pdf";
}
