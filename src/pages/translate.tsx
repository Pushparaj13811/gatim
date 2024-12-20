import { useEffect } from 'react';
import LanguageDetect from 'languagedetect';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Editor } from '@/components/translation/editor';
import { FileUpload } from '@/components/translation/file-upload';
import { DocumentPreview } from '@/components/translation/DocumentPreview';
import {
  setTranslatedContent,
  setIsTranslating,
  setFromLang
} from '@/features/editor/editorSlice';
import { RootState } from '@/lib/store';
import { translateContent } from '@/services/translationService';
import { getLanguageCode, getLanguageName } from '@/lib/language';
import { useCallback } from 'react';
import { ApiError } from '@/lib/errors';

export function TranslatePage() {
  const dispatch = useDispatch();
  const { translatedContent, from_lang } = useSelector((state: RootState) => state.editor);
  const { file, originalContent } = useSelector((state: RootState) => state.document);
  const selectedLang = useSelector((state: RootState) => state.editor.to_lang);

  const to_lang = getLanguageName(selectedLang);

  const detectLanguage = useCallback((content: string) => {
    const lngDetector = new LanguageDetect();
    const detected = lngDetector.detect(content);

    if (detected && detected.length > 0) {
      const detectedLang = mapLanguageToCode(detected[0][0]);
      dispatch(setFromLang(detectedLang));
    } else {
      dispatch(setFromLang('en'));
    }
  }, [dispatch]);

  useEffect(() => {
    if (originalContent) {
      detectLanguage(originalContent);
    }
  }, [originalContent, detectLanguage]);

  const mapLanguageToCode = (language: string): string => {
    const lang = getLanguageCode(language);
    return lang || 'en';
  };

  const handleTranslate = async () => {
    if (!originalContent) {
      return;
    }

    dispatch(setIsTranslating(true));

    try {
      const response = await translateContent({
        from_lang: from_lang,
        to_lang: to_lang,
        content: originalContent,
      });
      if (response.translatedContent) {
        dispatch(setTranslatedContent(response.translatedContent));
      }
    } catch (error) {
      console.error('Translation Error:', error);
      throw new ApiError("Translation error ", 500);
    } finally {
      dispatch(setIsTranslating(false));
    }
  };

  const handleEditorChange = useCallback((content: string) => {
    dispatch(setTranslatedContent(content));
  }, [dispatch]);

  return (
    <div className="container py-8 px-2">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Document Translation
          </h1>
          <p className="text-muted-foreground">
            Upload your document and get accurate translations powered by AI.
          </p>
        </div>

        <div className="grid gap-2 lg:grid-cols-2">
          {/* Original Document Card */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Original Document</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {!file ? (
                <FileUpload />
              ) : (
                <DocumentPreview onTranslate={handleTranslate} />
              )}
            </CardContent>
          </Card>

          {/* Translated Document Card */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Translated Document</CardTitle>
            </CardHeader>
            <CardContent>
              <Editor
                content={translatedContent}
                onChange={handleEditorChange}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}