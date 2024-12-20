import TurndownService from "turndown";

/**
 * Converts an HTML string to a Markdown string, removing any base64 images.
 * @param html - The HTML string to be converted to Markdown.
 * @returns The converted Markdown string.
 * @throws Error if the input is not a valid string.
 */
export const htmlToMarkdown = (html: string): string => {
  if (!html || typeof html !== "string") {
    throw new Error("Invalid HTML input. Please provide a valid HTML string.");
  }

  // Remove base64 images (img tags with src starting with 'data:image')
  const cleanedHtml = html.replace(/<img [^>]*src="data:image[^"]+"[^>]*>/g, "");

  // Create an instance of TurndownService
  const turndownService = new TurndownService();

  // Convert the cleaned HTML to Markdown
  const markdown = turndownService.turndown(cleanedHtml);

  // Return the converted Markdown string
  return markdown;
};
