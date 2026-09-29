-- Seed data for ummado (dummy/placeholder, applied manually alongside 0001_ummado_schema.sql)

INSERT INTO ummado.prompts (slug, prompt_text, is_revealed, is_published)
VALUES (
  'umma-do-01',
  '[공개 예정] 엄마도는 한국의 유명한 밈 프롬프트입니다. 실제 프롬프트는 추후 공개될 예정입니다.',
  false,
  true
);

-- Insert dummy model responses
INSERT INTO ummado.model_responses (prompt_id, model_id, interpretation, reasoning)
SELECT
  (SELECT id FROM ummado.prompts WHERE slug = 'umma-do-01'),
  model_id,
  interpretation,
  reasoning
FROM (
  VALUES
    ('claude', '[더미 데이터] Claude의 해석: 이것은 한국 문화 속 특정한 개념을 다루는 프롬프트로 보입니다. 창의적이고 재미있는 관점에서 해석할 수 있을 것 같습니다. 사용자의 의도를 파악하기 위해 더 많은 맥락이 필요할 수 있습니다. 하지만 기본적으로 명확한 질문 형식을 갖추고 있습니다.', '[더미 데이터] Claude의 근거: 이 프롬프트는 한국의 일상 문화와 언어 패턴을 반영하고 있습니다. 밈으로서의 특성상 이면에 숨겨진 의미나 농담이 있을 가능성이 높습니다. 한국 인터넷 커뮤니티에서 viral된 표현이라는 점을 고려하면, 특정 상황이나 감정을 압축적으로 표현하는 방식으로 이해할 수 있습니다.'),
    ('gemini', '[더미 데이터] Gemini의 해석: 이것은 한국어 밈 프롬프트로, 특정한 문화적 맥락을 담고 있습니다. 간결하면서도 여러 의미층을 가질 수 있는 표현입니다. Gemini는 다양한 해석 가능성을 인식하고 있습니다.', '[더미 데이터] Gemini의 근거: 이 표현이 viral되었다는 것은 많은 사람들이 공감할 수 있는 무언가를 담고 있다는 의미입니다. 한국 인터넷 문화에서 짧고 강렬한 표현들이 빠르게 퍼지는 경향이 있으며, 이것도 그 패턴을 따르고 있습니다.'),
    ('chatgpt', '[더미 데이터] ChatGPT의 해석: 이것은 한국의 유명한 인터넷 밈으로, 특정한 상황이나 감정을 표현하는 방식입니다. 간단해 보이지만 깊은 문화적 의미를 내포하고 있을 가능성이 있습니다.', '[더미 데이터] ChatGPT의 근거: 프롬프트가 한국 커뮤니티에서 viral되었다는 점은 것은 보편적인 공감대를 형성했음을 의미합니다. 이러한 밈들은 보통 특정 상황의 본질을 날카롭게 포착한 표현들입니다. 이것도 비슷한 패턴을 보이고 있습니다.'),
    ('grok', '[더미 데이터] Grok의 해석: 한국 밈 프롬프트네요. 간단하지만 강렬한 문화적 메시지를 담고 있습니다. Grok은 이러한 인터넷 문화 표현에 대해 흥미로워합니다.', '[더미 데이터] Grok의 근거: viral된 밈이라는 것은 광범위한 공감을 얻었다는 증거입니다. 한국 인터넷 커뮤니티의 특징상, 이런 표현들은 보통 일상의 모순이나 아이러니를 포착합니다. 이 프롬프트도 그러한 특징을 가지고 있을 것으로 예상됩니다.')
) AS dummy_data(model_id, interpretation, reasoning);
