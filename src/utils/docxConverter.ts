import { Document, Packer, Paragraph, HeadingLevel, TextRun } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Converts an HTML string to a DOCX file and triggers the download.
 * @param html - The HTML string to be converted.
 * @param fileName - The name of the file to be saved (default is 'converted-file.docx').
 */
export const htmlToDocx = async (html: string, fileName: string = 'converted-file.docx'): Promise<void> => {
  if (!html || typeof html !== 'string') {
    alert('Please provide valid HTML content.');
    return;
  }

  // Parse the HTML content into a DOM
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(html, 'text/html');

  // Parse the DOM to docx Paragraph objects
  const paragraphs = parseHtmlToDocx(doc.body);

  // Create a docx document
  const docx = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  // Convert the document to a Blob and trigger the download
  const blob = await Packer.toBlob(docx);
  saveAs(blob, fileName);
};

/**
 * Helper function to parse HTML content into an array of docx Paragraph objects.
 * Supports basic tags like <h1>, <h2>, <p>, <strong>, <em>, and <ul>/<li>.
 * @param element - The root HTML element to parse.
 * @returns An array of docx Paragraph objects.
 */
const parseHtmlToDocx = (element: HTMLElement): Paragraph[] => {
  const paragraphs: Paragraph[] = [];

  element.childNodes.forEach((node) => {
    if (node.nodeType === 3) {
      // Text node
      paragraphs.push(new Paragraph({ text: node.textContent || '' }));
    } else if (node.nodeType === 1) {
      // Element node
      const elementNode = node as HTMLElement;
      const tag = elementNode.tagName.toLowerCase();

      let ulElement: HTMLElement;
      let listItems: NodeList;

      switch (tag) {
        case 'h1':
          paragraphs.push(
            new Paragraph({ text: node.textContent || '', heading: HeadingLevel.HEADING_1 })
          );
          break;
        case 'h2':
          paragraphs.push(
            new Paragraph({ text: node.textContent || '', heading: HeadingLevel.HEADING_2 })
          );
          break;
        case 'p':
          paragraphs.push(new Paragraph({ text: node.textContent || '' }));
          break;
        case 'strong':
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: node.textContent || '', bold: true })],
            })
          );
          break;
        case 'em':
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: node.textContent || '', italics: true })],
            })
          );
          break;
        case 'ul':
          ulElement = node as HTMLElement;
          listItems = ulElement.querySelectorAll('li');
          listItems.forEach((li) => {
            paragraphs.push(
              new Paragraph({ text: li.textContent || '', bullet: { level: 0 } })
            );
          });
          break;
        default:
          paragraphs.push(new Paragraph({ text: node.textContent || '' }));
          break;
      }
    }
  });

  return paragraphs;
};
