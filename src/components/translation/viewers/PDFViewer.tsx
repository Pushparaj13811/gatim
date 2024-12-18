import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useTheme } from '@/components/theme-provider';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  file: ArrayBuffer;
}

export function PDFViewer({ file }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const { theme } = useTheme();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  // Convert ArrayBuffer to Uint8Array and then to base64
  const base64String = btoa(
    new Uint8Array(file).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
  const dataUrl = `data:application/pdf;base64,${base64String}`;

  return (
    <div className="pdf-viewer">
      <style>
        {`
          .pdf-viewer .react-pdf__Page__textContent {
            color: ${theme === 'dark' ? '#ffffff' : '#000000'} !important;
          }
          .pdf-viewer .react-pdf__Page__annotations.annotationLayer {
            color: ${theme === 'dark' ? '#ffffff' : '#000000'} !important;
          }
        `}
      </style>
      <Document
        file={dataUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="flex items-center justify-center h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }
        error={
          <div className="flex items-center justify-center h-[400px] text-destructive">
            Failed to load PDF. Please try again.
          </div>
        }
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="mb-4"
            scale={1.0}
          />
        ))}
      </Document>
    </div>
  );
}