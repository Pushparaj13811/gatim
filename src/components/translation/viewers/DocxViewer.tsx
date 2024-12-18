import { useEffect, useRef, useMemo } from 'react';
import DOMPurify from 'dompurify';

interface DocxViewerProps {
  content: string;
  originalStyles?: string;
}

export function DocxViewer({ content, originalStyles }: DocxViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const sanitizedContent = useMemo(() => {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'b', 'i', 'u', 's', 'em', 'strong', 'a', 'p', 'br', 
        'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'div', 'span', 'img'
      ],
      ALLOWED_ATTR: ['href', 'src', 'style', 'class', 'id', 'data-style-name'],
      ADD_TAGS: ['style'],
      ADD_ATTR: ['style', 'class', 'id', 'data-style-name']
    });
  }, [content]);

  useEffect(() => {
    if (containerRef.current) {
      // Remove existing styles
      const existingStyles = containerRef.current.querySelectorAll('style');
      existingStyles.forEach(el => el.remove());
      
      // Add base styles for common elements
      const baseStyles = `
        .docx-viewer {
          font-family: 'Calibri', sans-serif;
          line-height: 1.5;
          color: inherit;
        }
        .docx-viewer h1 { font-size: 2em; margin: 0.67em 0; font-weight: bold; }
        .docx-viewer h2 { font-size: 1.5em; margin: 0.75em 0; font-weight: bold; }
        .docx-viewer h3 { font-size: 1.17em; margin: 0.83em 0; font-weight: bold; }
        .docx-viewer p { margin: 1em 0; }
        .docx-viewer table { border-collapse: collapse; width: 100%; }
        .docx-viewer td, .docx-viewer th { border: 1px solid; padding: 0.5em; }
      `;

      // Combine base styles with original document styles
      const styleSheet = document.createElement('style');
      styleSheet.textContent = baseStyles + (originalStyles || '');
      containerRef.current.appendChild(styleSheet);
    }
  }, [originalStyles]);

  return (
    <div 
      ref={containerRef}
      className="docx-viewer w-full overflow-auto prose prose-sm max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}