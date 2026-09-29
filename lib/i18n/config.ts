export const locales = ['en', 'ko'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
export const localeCatalog = { en: 'English', ko: '한국어' };

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);
