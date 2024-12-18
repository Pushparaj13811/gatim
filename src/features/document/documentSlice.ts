import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DocumentState {
  file: File | null;
  preview: string | ArrayBuffer | null;
  originalContent: string;
  documentStyles: string;
  isLoading: boolean;
  error: string | null;
  format: 'pdf' | 'docx' | 'txt' | 'html' | null;
}

const initialState: DocumentState = {
  file: null,
  preview: null,
  originalContent: '',
  documentStyles: '',
  isLoading: false,
  error: null,
  format: null,
};

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    setDocument: (state, action: PayloadAction<{ file: File; format: DocumentState['format'] }>) => {
      state.file = action.payload.file;
      state.format = action.payload.format;
      state.error = null;
    },
    setPreview: (state, action: PayloadAction<string | ArrayBuffer>) => {
      state.preview = action.payload;
    },
    setOriginalContent: (state, action: PayloadAction<string>) => {
      state.originalContent = action.payload;
    },
    setDocumentStyles: (state, action: PayloadAction<string>) => {
      state.documentStyles = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    resetDocument: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setDocument,
  setPreview,
  setOriginalContent,
  setDocumentStyles,
  setLoading,
  setError,
  resetDocument,
} = documentSlice.actions;

export default documentSlice.reducer;