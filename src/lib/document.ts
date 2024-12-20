import mammoth from 'mammoth';

export async function extractDocxContent(arrayBuffer: ArrayBuffer) {
  const result = await mammoth.convertToHtml(
    { arrayBuffer },
    {
      styleMap: [
        "p[style-name='Normal'] => p.normal",
        "p[style-name='Heading 1'] => h1.heading1",
        "p[style-name='Heading 2'] => h2.heading2",
        "p[style-name='Heading 3'] => h3.heading3",
        "r[style-name='Emphasis'] => em",
        "r[style-name='Strong'] => strong",
        "table => table.docx-table",
        "tr => tr.docx-tr",
        "td => td.docx-td",
      ],
      includeDefaultStyleMap: true,
      transformDocument: (element) => {
        // Preserve original style attributes
        if (element.styleId) {
          element.setAttribute('data-style-name', element.styleId);
        }
        return element;
      },
    }
  );

  // Extract and process styles
  const styleMap = new Map<string, string>();
  const parser = new DOMParser();
  const doc = parser.parseFromString(result.value, 'text/html');
  
  // Process all elements with style attributes
  doc.querySelectorAll('[style]').forEach((element) => {
    const style = element.getAttribute('style');
    const className = element.className;
    if (style) {
      if (className) {
        styleMap.set(`.${className}`, style);
      } else {
        styleMap.set(element.tagName.toLowerCase(), style);
      }
    }
  });

  // Process elements with data-style-name
  doc.querySelectorAll('[data-style-name]').forEach((element) => {
    const styleName = element.getAttribute('data-style-name');
    if (styleName) {
      const className = `docx-style-${styleName.toLowerCase().replace(/\s+/g, '-')}`;
      element.classList.add(className);
    }
  });

  // Combine all styles
  const styles = Array.from(styleMap.entries())
    .map(([selector, style]) => `${selector} { ${style} }`)
    .join('\n');

  // Add default DOCX styles
  const defaultStyles = `
    .docx-table { width: 100%; border-collapse: collapse; margin: 1em 0; }
    .docx-td, .docx-th { border: 1px solid; padding: 0.5em; }
    .heading1 { font-size: 2em; font-weight: bold; margin: 1em 0; }
    .heading2 { font-size: 1.5em; font-weight: bold; margin: 0.83em 0; }
    .heading3 { font-size: 1.17em; font-weight: bold; margin: 0.67em 0; }
  `;

  return {
    content: result.value,
    styles: defaultStyles + '\n' + styles,
  };
}