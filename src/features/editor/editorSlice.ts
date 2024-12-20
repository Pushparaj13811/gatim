import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EditorState {
  translatedContent: string;
  isTranslating: boolean;
  from_lang: string;
  to_lang: string;
}

const initialState: EditorState = {
  translatedContent: '',
  isTranslating: false,
  from_lang: 'en',
  to_lang: 'hi',
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setTranslatedContent: (state, action: PayloadAction<string>) => {
      state.translatedContent = action.payload;
    },
    setIsTranslating: (state, action: PayloadAction<boolean>) => {
      state.isTranslating = action.payload;
    },
    setFromLang: (state, action: PayloadAction<string>) => {
      state.from_lang = action.payload;
    },
    setToLang: (state, action: PayloadAction<string>) => {
      state.to_lang = action.payload;
    }
  },
});

export const { setTranslatedContent, setIsTranslating, setFromLang, setToLang } = editorSlice.actions;
export default editorSlice.reducer;