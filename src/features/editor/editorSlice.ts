import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UploadedFile {
  name: string;
  preview: string;
}

interface EditorState {
  originalContent: string;
  translatedContent: string;
  isTranslating: boolean;
  uploadedFile: UploadedFile | null;
}

const initialState: EditorState = {
  originalContent: '',
  translatedContent: '',
  isTranslating: false,
  uploadedFile: null,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setOriginalContent: (state, action: PayloadAction<string>) => {
      state.originalContent = action.payload;
    },
    setTranslatedContent: (state, action: PayloadAction<string>) => {
      state.translatedContent = action.payload;
    },
    setIsTranslating: (state, action: PayloadAction<boolean>) => {
      state.isTranslating = action.payload;
    },
    setUploadedFile: (state, action: PayloadAction<UploadedFile | null>) => {
      state.uploadedFile = action.payload;
    },
    resetEditor: (state) => {
      state.originalContent = '';
      state.translatedContent = '';
      state.isTranslating = false;
      state.uploadedFile = null;
    },
  },
});

export const {
  setOriginalContent,
  setTranslatedContent,
  setIsTranslating,
  setUploadedFile,
  resetEditor,
} = editorSlice.actions;

export default editorSlice.reducer;
