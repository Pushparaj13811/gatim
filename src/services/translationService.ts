import { api } from '@/lib/api';
import { ApiError } from '@/lib/errors';
import { markdownToHtml } from '@/utils/htmlConverter';

export interface TranslationParams {
  from_lang: string;
  to_lang: string;
  content: string;
}

export interface TranslationResult {
  translatedContent: string;
  from_lang?: string;
  to_lang?: string;
  error?: string;
}

// Function to split content into chunks of a specific length
// const splitContentIntoChunks = (content: string, chunkSize: number): string[] => {
//   const chunks = [];
//   let start = 0;
  
//   while (start < content.length) {
//     chunks.push(content.slice(start, start + chunkSize));
//     start += chunkSize;
//   }

//   return chunks;
// };

export const translateContent = async (params: TranslationParams): Promise<TranslationResult> => {
  // const chunkSize = 2000; // Define the chunk size based on your API's limit
  const chunks = params.content

  try {
    // const translatedChunks: string[] = [];

    // // Translate each chunk sequentially
    // for (const chunk of chunks) {
    //   const response = await api.translateContent({
    //     from_lang: params.from_lang,
    //     to_lang: params.to_lang,
    //     content: chunks,
    //   });

    //   // Process each chunk's translation
    //   const resultContent = await markdownToHtml(response.data.translated_content);
    //   translatedChunks.push(resultContent);
    // }

    // // Merge all translated chunks sequentially
    // const mergedContent = translatedChunks.join('');

    const response = await api.translateContent({
      from_lang: params.from_lang,
      to_lang: params.to_lang,
      content: chunks,
    });

    const resultContent = await markdownToHtml(response.data.translated_content);

    return {
      translatedContent: resultContent,
      from_lang: params.from_lang,
      to_lang: params.to_lang,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
    throw new Error('Translation failed. Please try again.');
  }
};

// export const translateDocument = async (params: TranslationParams): Promise<TranslationResult> => {
//   try {
//     const response = await api.translateDocument({
//       from_lang: params.from_lang,
//       to_lang: params.to_lang,
//       content: params.content,
//     });
//     return {
//       translatedContent: response.data.translated_content,
//       from_lang: response.data.from_language,
//       to_lang: response.data.to_language,
//     };
//   } catch (error) {
//     if (error instanceof ApiError) {
//       throw new Error(error.message);
//     }
//     throw new Error('Translation failed. Please try again.');
//   }
// };
