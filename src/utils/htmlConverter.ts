import { marked } from "marked";

/**
 * Converts a Markdown string to an HTML string asynchronously.
 * @param markdown - The Markdown string to be converted to HTML.
 * @returns A Promise resolving to the converted HTML string.
 * @throws Error if the input is not a valid string.
 */
export const markdownToHtml = async (markdown: string): Promise<string> => {
  if (!markdown || typeof markdown !== "string") {
    throw new Error("Invalid Markdown input. Please provide a valid Markdown string.");
  }

  // If there's any asynchronous operation (e.g., I/O), handle it here
  return marked(markdown); // `marked` is synchronous, so this works even in async context
};