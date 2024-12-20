export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ne', name: 'Nepali' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
];

export function getLanguageName(code: string): string {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code)?.name || code;
}

export function getLanguageCode(name: string): string {
  return SUPPORTED_LANGUAGES.find(lang => lang.name === name)?.code || name;
}