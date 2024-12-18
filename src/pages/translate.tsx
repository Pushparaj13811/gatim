import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Editor } from '@/components/translation/editor';
import { FileUpload } from '@/components/translation/file-upload';
import { DocumentPreview } from '@/components/translation/DocumentPreview';
import { setTranslatedContent, setIsTranslating } from '@/features/editor/editorSlice';
import type { RootState } from '@/lib/store';

export function TranslatePage() {
  const dispatch = useDispatch();
  const { translatedContent, isTranslating } = useSelector(
    (state: RootState) => state.editor
  );
  const { file, originalContent } = useSelector(
    (state: RootState) => state.document
  );

  const handleTranslate = () => {
    dispatch(setIsTranslating(true));
    // Simulate translation
    setTimeout(() => {
      dispatch(setTranslatedContent(originalContent));
      dispatch(setIsTranslating(false));
    }, 2000);
  };

  return (
    <div className="container py-8 px-2 ">
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
                onChange={(content) => dispatch(setTranslatedContent(content))}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}