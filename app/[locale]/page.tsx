import { isLocale, defaultLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { PromptCard } from '@/components/PromptCard';
import { ModelGrid } from '@/components/ModelGrid';
import { createUmmadoClient } from '@/lib/supabase/client';
import { getUmmadoData } from '@/lib/data/getUmmadoData';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);

  let data = null;
  try {
    const client = createUmmadoClient();
    data = await getUmmadoData(client);
  } catch (error) {
    console.error('Supabase connection error:', error);
  }

  if (!data) {
    return (
      <div className="flex-1 max-w-4xl mx-auto px-4 py-12">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="text-lg mb-4">🔌 Supabase 연결 필요</p>
          <p className="text-sm">
            .env.local에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12 flex-wrap gap-4">
        <div>
          <LanguageSwitcher current={locale} />
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition">
          🌙 Dark Mode
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">ummado</h1>

      <div className="mb-12">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{dict.promptRevealed}</h2>
        <PromptCard
          isRevealed={data.prompt.isRevealed}
          text={data.prompt.text}
          lockedLabel={dict.promptLocked}
        />
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">AI Model Responses</h2>
        <ModelGrid
          data={data}
          interpretationLabel={dict.interpretation}
          reasoningLabel={dict.reasoning}
          noDataLabel={dict.noDataYet}
        />
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-12">
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          © 2026 ummado — AI Model Comparison Platform
        </p>
      </div>
    </div>
  );
}
