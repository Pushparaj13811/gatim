import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Languages, X } from 'lucide-react';
import { PDFViewer } from './viewers/PDFViewer';
import { DocxViewer } from './viewers/DocxViewer';
import { TextViewer } from './viewers/TextViewer';
import { extractDocxContent } from '@/lib/document';
import {
  setPreview,
  setOriginalContent,
  setLoading,
  setError,
  resetDocument,
  setDocumentStyles,
} from '@/features/document/documentSlice';
import type { RootState } from '@/lib/store';

interface DocumentPreviewProps {
  onTranslate: () => void;
}

export function DocumentPreview({ onTranslate }: DocumentPreviewProps) {
  const dispatch = useDispatch();
  const { file, preview, format, isLoading, error, documentStyles } = useSelector(
    (state: RootState) => state.document
  );

  useEffect(() => {
    if (!file) return;

    dispatch(setLoading(true));
    dispatch(setError(null));

    const processFile = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        
        if (format === 'pdf') {
          dispatch(setPreview(arrayBuffer));
          dispatch(setOriginalContent(''));
        } else if (format === 'docx') {
          const { content, styles } = await extractDocxContent(arrayBuffer);
          dispatch(setPreview(content));
          dispatch(setOriginalContent(content));
          dispatch(setDocumentStyles(styles));
        } else if (format === 'txt' || format === 'html') {
          const text = await file.text();
          dispatch(setPreview(text));
          dispatch(setOriginalContent(text));
        }
      } catch (err) {
        dispatch(setError('Error processing file: ' + (err as Error).message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    processFile();
  }, [dispatch, file, format]);

  if (!file || !format) return null;

  const handleCancel = () => {
    dispatch(resetDocument());
  };

  const renderPreview = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (error) {
      return <div className="text-destructive p-4">{error}</div>;
    }

    if (!preview) {
      return <div className="text-muted-foreground p-4">No preview available</div>;
    }

    switch (format) {
      case 'pdf':
        return <PDFViewer file={preview as ArrayBuffer} />;
      case 'docx':
        return <DocxViewer content={preview as string} originalStyles={documentStyles} />;
      case 'txt':
      case 'html':
        return <TextViewer content={preview as string} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="max-h-[400px] overflow-auto">
          {renderPreview()}
        </div>
      </Card>

      <div className="flex gap-4">
        <Button
          onClick={onTranslate}
          disabled={isLoading}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          <Languages className="h-4 w-4 mr-2" />
          Translate Document
        </Button>
        <Button
          variant="outline"
          onClick={handleCancel}
          className="border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}