import { api } from '@/lib/api';
import { ApiError } from '@/lib/errors';
import { markdownToHtml } from '@/utils/htmlConverter';
import { htmlToMarkdown } from '@/utils/markdownConverter';

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

export const translateDocument = async (params: TranslationParams): Promise<TranslationResult> => {

    const markdownContent = htmlToMarkdown(params.content)

    try {
        const response = await api.translateDocument({
            from_lang: params.from_lang,
            to_lang: params.to_lang,
            content: markdownContent,
        });

        const resultContent = await markdownToHtml(response.data.translated_content)

        return {
            translatedContent: resultContent,
            from_lang: response.data.from_language,
            to_lang: response.data.to_language,
        };
    } catch (error) {
        if (error instanceof ApiError) {
            throw new Error(error.message);
        }
        throw new Error('Translation failed. Please try again.');
    }
};

export const translateContent = async (params: TranslationParams): Promise<TranslationResult> => {
    try {
        const response = await api.translateContent({
            from_lang: params.from_lang,
            to_lang: params.to_lang,
            content: params.content,
        });
        return {
            translatedContent: response.data.translated_content,
            from_lang: response.data.from_language,
            to_lang: response.data.to_language,
        };
    } catch (error) {
        if (error instanceof ApiError) {
            throw new Error(error.message);
        }
        throw new Error('Translation failed. Please try again.');
    }
};