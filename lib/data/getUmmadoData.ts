import { SupabaseClient } from '@supabase/supabase-js';
import { ModelId } from '@/lib/models/registry';

export type UmmadoData = {
  prompt: {
    id: string;
    slug: string;
    isRevealed: boolean;
    text: string | null;
  };
  responses: Record<
    ModelId,
    {
      interpretation: string;
      reasoning: string;
    } | null
  >;
};

export async function getUmmadoData(client: SupabaseClient): Promise<UmmadoData | null> {
  // Fetch the first (and only for v1) published prompt
  const { data: prompts, error: promptError } = await client
    .from('prompts')
    .select('id, slug, is_revealed, prompt_text')
    .eq('is_published', true)
    .limit(1)
    .single();

  if (promptError || !prompts) {
    return null;
  }

  // Fetch all model responses for this prompt
  const { data: responses, error: responsesError } = await client
    .from('model_responses')
    .select('model_id, interpretation, reasoning')
    .eq('prompt_id', prompts.id);

  if (responsesError) {
    console.error('Error fetching model responses:', responsesError);
    return null;
  }

  // Shape the responses into a map by model_id
  const responseMap = (responses ?? []).reduce(
    (acc, response) => {
      acc[response.model_id as ModelId] = {
        interpretation: response.interpretation,
        reasoning: response.reasoning,
      };
      return acc;
    },
    {} as Record<ModelId, { interpretation: string; reasoning: string }>
  );

  return {
    prompt: {
      id: prompts.id,
      slug: prompts.slug,
      isRevealed: prompts.is_revealed,
      text: prompts.is_revealed ? prompts.prompt_text : null,
    },
    responses: {
      claude: responseMap.claude ?? null,
      gemini: responseMap.gemini ?? null,
      chatgpt: responseMap.chatgpt ?? null,
      grok: responseMap.grok ?? null,
    },
  };
}
