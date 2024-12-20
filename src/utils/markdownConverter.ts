import TurndownService from "turndown";

/**
 * Converts an HTML string to a Markdown string.
 * @param html - The HTML string to be converted to Markdown.
 * @returns The converted Markdown string.
 * @throws Error if the input is not a valid string.
 */
export const htmlToMarkdown = (html: string): string => {
  if (!html || typeof html !== "string") {
    throw new Error("Invalid HTML input. Please provide a valid HTML string.");
  }

  // Create an instance of TurndownService
  const turndownService = new TurndownService();

  // Return the converted Markdown string
  return turndownService.turndown(html);
};
