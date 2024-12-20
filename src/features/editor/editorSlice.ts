import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EditorState {
  translatedContent: string;
  isTranslating: boolean;
  from_lang: string;
}

const initialState: EditorState = {
  translatedContent: '',
  isTranslating: false,
  from_lang: 'en',
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
  },
});

export const { setTranslatedContent, setIsTranslating, setFromLang } = editorSlice.actions;
export default editorSlice.reducer;