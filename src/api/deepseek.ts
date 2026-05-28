import { getApiKey } from './config';
import { buildRewritePrompt, buildScorePrompt, buildGeneratePrompt } from './prompts';

const API_URL = 'https://api.deepseek.com/chat/completions';

async function retryFetch(
  fn: () => Promise<Response>,
  signal?: AbortSignal,
  maxRetries = 3,
): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fn();
      if (res.ok) return res;
      if (res.status === 429) {
        const delay = Math.min(5000 * Math.pow(2, i), 20000);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw new Error(`API error: ${res.status} ${await res.text()}`);
    } catch (err) {
      if (signal?.aborted) throw err;
      if (i === maxRetries - 1) throw err;
      const delay = 1000 * Math.pow(2, i);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

export async function* streamRewrite(
  personalityTrait: string,
  previousText: string,
  signal?: AbortSignal,
): AsyncGenerator<string> {
  const apiKey = getApiKey();
  const res = await retryFetch(
    () =>
      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          stream: true,
          max_tokens: 200,
          temperature: 0.9,
          messages: [
            { role: 'system', content: buildRewritePrompt(personalityTrait) },
            { role: 'user', content: previousText },
          ],
        }),
        signal,
      }),
    signal,
  );

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop()!;
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
        try {
          const json = JSON.parse(trimmed.slice(6));
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) yield delta;
        } catch {
          // skip malformed chunks
        }
      }
    }
  }
}

export async function generatePrompt(signal?: AbortSignal): Promise<string> {
  const apiKey = getApiKey();
  const res = await retryFetch(
    () =>
      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          stream: false,
          max_tokens: 100,
          temperature: 1.2,
          messages: [
            { role: 'system', content: buildGeneratePrompt() },
          ],
        }),
        signal,
      }),
    signal,
  );

  const data = await res.json();
  return data.choices[0].message.content.trim();
}

export async function scoreDrift(
  original: string,
  final: string,
  signal?: AbortSignal,
): Promise<number> {
  const apiKey = getApiKey();
  const res = await retryFetch(
    () =>
      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          stream: false,
          max_tokens: 20,
          temperature: 0,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: buildScorePrompt() },
            { role: 'user', content: `句子A：${original}\n句子B：${final}` },
          ],
        }),
        signal,
      }),
    signal,
  );

  const data = await res.json();
  const content = JSON.parse(data.choices[0].message.content);
  const score = Number(content.score);
  return Math.max(0, Math.min(100, isNaN(score) ? 50 : score));
}
