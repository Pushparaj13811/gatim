import { Document, Packer, Paragraph, HeadingLevel, TextRun, AlignmentType } from 'docx';
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
 * Supports basic tags like <h1>, <h2>, <h3>, <p>, <strong>, <em>, <ul>/<li>, and styles.
 * @param element - The root HTML element to parse.
 * @returns An array of docx Paragraph objects.
 */
const parseHtmlToDocx = (element: HTMLElement): Paragraph[] => {
  const paragraphs: Paragraph[] = [];

  element.childNodes.forEach((node) => {
    if (node.nodeType === 3) {
      // Text node
      paragraphs.push(new Paragraph({ children: [new TextRun(node.textContent || '')] }));
    } else if (node.nodeType === 1) {
      // Element node
      const elementNode = node as HTMLElement;
      const tag = elementNode.tagName.toLowerCase();
      const styles = getComputedStyle(elementNode);

      let ulElement: HTMLElement;
      let listItems: NodeList;

      const fontSize = parseFontSize(styles.fontSize); // Parse font size safely
      const marginBottom = parseMarginBottom(styles.marginBottom);

      switch (tag) {
        case 'h1':
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: node.textContent || '', bold: true, size: 64 })], // 64 half-points for H1
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.LEFT,
              spacing: { after: marginBottom },
            })
          );
          break;
        case 'h2':
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: node.textContent || '', bold: true, size: 48 })], // 48 half-points for H2
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.LEFT,
              spacing: { after: marginBottom },
            })
          );
          break;
        case 'h3':
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: node.textContent || '', bold: true, size: 36 })], // 36 half-points for H3
              heading: HeadingLevel.HEADING_3,
              alignment: AlignmentType.LEFT,
              spacing: { after: marginBottom },
            })
          );
          break;
        case 'p':
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: node.textContent || '', size: fontSize })],
              spacing: { after: marginBottom || 200 }, // Default space between paragraphs
            })
          );
          break;
        case 'strong':
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: node.textContent || '',
                  bold: true,
                  size: fontSize, // Correct font size
                }),
              ],
              spacing: { after: marginBottom || 200 },
            })
          );
          break;
        case 'em':
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: node.textContent || '',
                  italics: true,
                  size: fontSize, // Correct font size
                }),
              ],
              spacing: { after: marginBottom || 200 },
            })
          );
          break;
        case 'ul':
          ulElement = node as HTMLElement;
          listItems = ulElement.querySelectorAll('li');
          listItems.forEach((li) => {
            paragraphs.push(
              new Paragraph({
                children: [new TextRun(li.textContent || '')],
                bullet: { level: 0 },
                spacing: { after: marginBottom || 200 },
              })
            );
          });
          break;
        default:
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: node.textContent || '',
                  size: fontSize, // Correct font size
                  font: styles.fontFamily, // Font family
                  color: styles.color, // Text color
                }),
              ],
              spacing: { after: marginBottom || 200 }, // Default space between paragraphs
            })
          );
          break;
      }
    }
  });

  return paragraphs;
};

/**
 * Safely parses the font size to a valid integer.
 * @param fontSize - The font size string (e.g., "16px").
 * @returns The font size in half-points (docx expected size) or a default value of 24 if invalid.
 */
const parseFontSize = (fontSize: string): number => {
  // Extract the numeric part from the font size (e.g., "16px" -> 16)
  const size = parseInt(fontSize, 10);

  // If the size is NaN or 0, return a default value (e.g., 24 half-points)
  return isNaN(size) || size === 0 ? 24 : Math.round(size / 2); // Convert to half-points (docx format)
};

/**
 * Safely parses the margin-bottom style to add spacing between paragraphs.
 * @param marginBottom - The margin-bottom string (e.g., "10px").
 * @returns The margin-bottom value in points (docx expected spacing) or a default value of 200 (default spacing).
 */
const parseMarginBottom = (marginBottom: string): number => {
  // Extract the numeric part from the margin-bottom (e.g., "10px" -> 10)
  const marginValue = parseInt(marginBottom, 10);

  // If the value is NaN or 0, return a default margin (e.g., 200 points)
  return isNaN(marginValue) || marginValue === 0 ? 200 : marginValue * 2; // Convert to docx format (half-points)
};

/**
 * Helper function to retrieve styles from an HTML element
 * @param element - The HTMLElement to extract styles from
 * @returns An object containing the computed styles
 */
const getComputedStyle = (element: HTMLElement): CSSStyleDeclaration => {
  return window.getComputedStyle(element);
};
