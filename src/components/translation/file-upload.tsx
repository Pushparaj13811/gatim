import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { setDocument } from '@/features/document/documentSlice';
import type { DocumentState } from '@/features/document/documentSlice';
import { Toast, ToastProvider, ToastTitle, ToastDescription } from '@radix-ui/react-toast';

const getFileFormat = (file: File): DocumentState['format'] => {
  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    return 'docx';
  if (file.type === 'text/plain') return 'txt';
  return null;
};

export function FileUpload() {
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const format = getFileFormat(file);
      if (!format) {
        setErrorMessage('Unsupported file format. Please upload a PDF, DOCX, TXT, or HTML file.');
        setShowToast(true);
        return;
      }

      dispatch(setDocument({ file, format }));
    },
    [dispatch]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/html': ['.html'],
    },
    multiple: false,
  });

  return (
    <ToastProvider>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-accent' : 'border-muted-foreground/25'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-8 w-8 mb-4 text-muted-foreground" />
        {isDragActive ? (
          <p>Drop the file here...</p>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground">
              Drag and drop a file here, or click to select a file
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Supports PDF, DOCX, TXT, and HTML files
            </p>
          </div>
        )}
      </div>

      {/* Toast for unsupported file format */}
      <Toast
        open={showToast}
        onOpenChange={(open) => setShowToast(open)}
        className="bg-red-500 text-white p-4 rounded shadow-lg"
      >
        <ToastTitle>Error</ToastTitle>
        <ToastDescription>{errorMessage}</ToastDescription>
      </Toast>
    </ToastProvider>
  );
}

export default FileUpload;