import Link from 'next/link';
import { locales, defaultLocale, type Locale } from '@/lib/i18n/config';

const LABELS: Record<Locale, string> = { en: 'EN', ko: '한국어' };

export function LanguageSwitcher({ current }: { current: Locale }) {
  return (
    <nav className="flex gap-2 text-sm" aria-label="Language">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={locale === defaultLocale ? '/' : `/${locale}`}
          aria-current={locale === current ? 'true' : undefined}
          className={`rounded-full px-3 py-1 border ${locale === current ? 'border-violet-500 text-violet-400' : 'border-white/20'}`}
        >
          {LABELS[locale]}
        </Link>
      ))}
    </nav>
  );
}
