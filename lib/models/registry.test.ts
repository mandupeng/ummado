import { describe, it, expect } from 'vitest';
import { MODEL_REGISTRY, MODEL_IDS } from './registry';

describe('MODEL_REGISTRY', () => {
  it('should have exactly 4 models', () => {
    expect(MODEL_IDS).toHaveLength(4);
  });

  it('should have claude, gemini, chatgpt, grok', () => {
    expect(MODEL_IDS).toEqual(expect.arrayContaining(['claude', 'gemini', 'chatgpt', 'grok']));
  });

  it('each model should have required fields', () => {
    MODEL_IDS.forEach((modelId) => {
      const config = MODEL_REGISTRY[modelId];
      expect(config).toBeDefined();
      expect(config.id).toBeDefined();
      expect(config.displayName).toBeDefined();
      expect(config.accent).toBeDefined();
      expect(config.provider).toBeDefined();
      expect(config.provider.kind).toBeDefined();
      expect(config.provider.apiModel).toBeDefined();
      expect(config.provider.apiKeyEnv).toBeDefined();
    });
  });
});
