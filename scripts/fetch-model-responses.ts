#!/usr/bin/env tsx

import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { createUmmadoClient } from '@/lib/supabase/client';
import { MODEL_REGISTRY, MODEL_IDS } from '@/lib/models/registry';

const SYSTEM_PROMPT = `당신은 주어진 프롬프트를 분석하고 해석하는 AI입니다.
다음 두 가지를 JSON 형식으로 응답해야 합니다:
1. interpretation: 프롬프트의 의미를 약 50단어로 간결하게 해석합니다.
2. reasoning: 위 해석의 근거를 두괄식(결론을 먼저 제시)으로 약 100단어로 설명합니다.

반드시 유효한 JSON 형식으로만 응답하세요.
{
  "interpretation": "...",
  "reasoning": "..."
}`;

async function fetchForModel(
  modelId: string,
  promptText: string
): Promise<{ interpretation: string; reasoning: string } | null> {
  const config = MODEL_REGISTRY[modelId as keyof typeof MODEL_REGISTRY];
  if (!config) {
    console.error(`Unknown model: ${modelId}`);
    return null;
  }

  const apiKey = process.env[config.provider.apiKeyEnv];
  if (!apiKey) {
    console.warn(`Skipping ${modelId}: ${config.provider.apiKeyEnv} not set`);
    return null;
  }

  try {
    let response: string | null = null;

    if (config.provider.kind === 'anthropic') {
      const client = new Anthropic({ apiKey });
      const msg = await client.messages.create({
        model: config.provider.apiModel,
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `다음 프롬프트를 분석해주세요:\n\n${promptText}`,
          },
        ],
      });
      response =
        msg.content[0].type === 'text' ? msg.content[0].text : null;
    } else if (config.provider.kind === 'google') {
      const client = new GoogleGenerativeAI(apiKey);
      const model = client.getGenerativeModel({ model: config.provider.apiModel });
      const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\n다음 프롬프트를 분석해주세요:\n\n${promptText}`,
              },
            ],
          },
        ],
      });
      response = result.response.text();
    } else if (config.provider.kind === 'openai' || config.provider.kind === 'openai-compatible') {
      const client = new OpenAI({
        apiKey,
        ...(config.provider.baseURL && { baseURL: config.provider.baseURL }),
      });
      const msg = await client.chat.completions.create({
        model: config.provider.apiModel,
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `다음 프롬프트를 분석해주세요:\n\n${promptText}`,
          },
        ],
      });
      response = msg.choices[0]?.message.content ?? null;
    }

    if (!response) {
      console.error(`No response from ${modelId}`);
      return null;
    }

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error(`Could not extract JSON from ${modelId} response`);
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      interpretation: parsed.interpretation || '',
      reasoning: parsed.reasoning || '',
    };
  } catch (error) {
    console.error(`Error fetching from ${modelId}:`, error);
    return null;
  }
}

async function main() {
  const slug = process.argv[2] || 'umma-do-01';

  // Get Supabase client with service role key
  const client = createUmmadoClient({ isServiceRole: true });

  // Fetch prompt
  const { data: prompt, error: promptError } = await client
    .from('prompts')
    .select('id, prompt_text')
    .eq('slug', slug)
    .single();

  if (promptError || !prompt) {
    console.error(`Prompt not found: ${slug}`);
    process.exit(1);
  }

  console.log(`Fetching responses for prompt: ${slug}`);
  console.log(`Prompt text: ${prompt.prompt_text}\n`);

  // Fetch responses for each model
  const results: Record<string, { interpretation: string; reasoning: string } | null> = {};
  for (const modelId of MODEL_IDS) {
    console.log(`  Fetching ${modelId}...`);
    results[modelId] = await fetchForModel(modelId, prompt.prompt_text);
  }

  // Upsert into database
  console.log('\nUpserting results into database...');
  for (const modelId of MODEL_IDS) {
    const result = results[modelId];
    if (!result) {
      console.warn(`Skipped ${modelId} (no result)`);
      continue;
    }

    const { error } = await client
      .from('model_responses')
      .upsert(
        {
          prompt_id: prompt.id,
          model_id: modelId,
          interpretation: result.interpretation,
          reasoning: result.reasoning,
        },
        { onConflict: 'prompt_id,model_id' }
      );

    if (error) {
      console.error(`Error upserting ${modelId}:`, error);
    } else {
      console.log(`  ✓ ${modelId} upserted`);
    }
  }

  console.log('\nDone!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
