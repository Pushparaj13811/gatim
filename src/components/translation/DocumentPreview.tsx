import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Languages, X, Loader2 } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { setToLang } from '@/features/editor/editorSlice';
import { SUPPORTED_LANGUAGES as languages } from '@/lib/language';

interface DocumentPreviewProps {
  onTranslate: () => void;
}

export function DocumentPreview({ onTranslate }: DocumentPreviewProps) {
  const dispatch = useDispatch();
  const { file, preview, format, isLoading, error, documentStyles } = useSelector(
    (state: RootState) => state.document
  );
  const selectedLang = useSelector((state: RootState) => state.editor.to_lang);
  const isTranslating = useSelector((state: RootState) => state.editor.isTranslating);

  useEffect(() => {
    if (!file) return;

    dispatch(setLoading(true));
    dispatch(setError(''));

    const processFile = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();

        if (format === 'docx') {
          const { content, styles } = await extractDocxContent(arrayBuffer);
          dispatch(setPreview(content));
          dispatch(setOriginalContent(content));
          dispatch(setDocumentStyles(styles));
        } else if (format === 'txt') {
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

  const handleLanguageSelect = (lang: string) => {
    dispatch(setToLang(lang));
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
      case 'docx':
        return <DocxViewer content={preview as string} originalStyles={documentStyles} />;
      case 'txt':
        return <TextViewer content={preview as string} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="max-h-[500px] overflow-auto">{renderPreview()}</div>
      </Card>

      <div className="flex gap-4">
        <Button
          onClick={onTranslate}
          disabled={isLoading || isTranslating}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 min-w-[180px]"
        >
          {isTranslating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Translating...
            </>
          ) : (
            <>
              <Languages className="h-4 w-4 mr-2" />
              Translate Document
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isTranslating}
          className="border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>

        {/* Language Selector Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" disabled={isTranslating}>
              {selectedLang
                ? `Translate to: ${selectedLang.toUpperCase()}`
                : 'Select Target Language'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="max-h-24 overflow-y-auto bg-background shadow-md rounded-md p-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-muted"
            side="bottom"
            align="center"
            sideOffset={4}
          >
            {languages.map(({ code, name }) => (
              <DropdownMenuItem
                key={code}
                onSelect={() => handleLanguageSelect(code)}
                className="cursor-pointer hover:bg-primary rounded-md px-2 py-1"
              >
                {name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default DocumentPreview;