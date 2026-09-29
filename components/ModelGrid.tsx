'use client';

import { ModelCard } from './ModelCard';
import { MODEL_REGISTRY, MODEL_IDS } from '@/lib/models/registry';
import { UmmadoData } from '@/lib/data/getUmmadoData';

type ModelGridProps = {
  data: UmmadoData;
  interpretationLabel: string;
  reasoningLabel: string;
  noDataLabel: string;
};

export function ModelGrid({
  data,
  interpretationLabel,
  reasoningLabel,
  noDataLabel,
}: ModelGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {MODEL_IDS.map((modelId) => {
        const config = MODEL_REGISTRY[modelId];
        const response = data.responses[modelId];

        return (
          <ModelCard
            key={modelId}
            name={config.displayName}
            accent={config.accent}
            interpretation={response?.interpretation ?? null}
            reasoning={response?.reasoning ?? null}
            interpretationLabel={interpretationLabel}
            reasoningLabel={reasoningLabel}
            noDataLabel={noDataLabel}
          />
        );
      })}
    </div>
  );
}
