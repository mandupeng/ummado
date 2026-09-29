export type ModelId = 'claude' | 'gemini' | 'chatgpt' | 'grok';

export type ModelConfig = {
  id: ModelId;
  displayName: string;
  accent: string; // hex or pmd token class name
  provider: {
    kind: 'anthropic' | 'google' | 'openai' | 'openai-compatible';
    apiModel: string;
    baseURL?: string;
    apiKeyEnv: string;
  };
};

export const MODEL_REGISTRY: Record<ModelId, ModelConfig> = {
  claude: {
    id: 'claude',
    displayName: 'Claude',
    accent: 'bg-blue-500',
    provider: {
      kind: 'anthropic',
      apiModel: 'claude-opus-4-1',
      apiKeyEnv: 'ANTHROPIC_API_KEY',
    },
  },
  gemini: {
    id: 'gemini',
    displayName: 'Gemini',
    accent: 'bg-orange-500',
    provider: {
      kind: 'google',
      apiModel: 'gemini-2.0-flash',
      apiKeyEnv: 'GOOGLE_API_KEY',
    },
  },
  chatgpt: {
    id: 'chatgpt',
    displayName: 'ChatGPT',
    accent: 'bg-green-500',
    provider: {
      kind: 'openai',
      apiModel: 'gpt-4o',
      apiKeyEnv: 'OPENAI_API_KEY',
    },
  },
  grok: {
    id: 'grok',
    displayName: 'Grok',
    accent: 'bg-purple-500',
    provider: {
      kind: 'openai-compatible',
      apiModel: 'grok-2-1212',
      baseURL: 'https://api.x.ai/v1',
      apiKeyEnv: 'XAI_API_KEY',
    },
  },
};

export const MODEL_IDS = Object.keys(MODEL_REGISTRY) as ModelId[];
