'use client';

type ModelCardProps = {
  name: string;
  accent: string;
  interpretation: string | null;
  reasoning: string | null;
  interpretationLabel: string;
  reasoningLabel: string;
  noDataLabel: string;
};

export function ModelCard({
  name,
  accent,
  interpretation,
  reasoning,
  interpretationLabel,
  reasoningLabel,
  noDataLabel,
}: ModelCardProps) {
  if (!interpretation || !reasoning) {
    return (
      <div className="w-full p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700">
        <div className={`w-3 h-3 rounded-full mb-4 ${accent}`} />
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{name}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{noDataLabel}</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-3 h-3 rounded-full ${accent}`} />
        <h3 className="font-semibold text-gray-900 dark:text-white">{name}</h3>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {interpretationLabel}
          </h4>
          <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">{interpretation}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {reasoningLabel}
          </h4>
          <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">{reasoning}</p>
        </div>
      </div>
    </div>
  );
}
