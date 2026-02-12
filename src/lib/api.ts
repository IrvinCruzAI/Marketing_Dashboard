type OpenRouterOptions = {
  model?: string;
  messages: {
    role: 'system' | 'user' | 'assistant';
    content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
  }[];
  stream?: boolean;
};

const DEFAULT_MODEL = 'google/gemini-2.0-flash-lite-001';

export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const fetchCompletion = async (
  options: OpenRouterOptions,
  apiKey: string,
  signal?: AbortSignal
): Promise<Response> => {
  if (!apiKey) {
    throw new ApiError('API key is required', 401);
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Client AI Marketing Dashboard',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: options.model || DEFAULT_MODEL,
      response_format: { type: 'json_object' },
      messages: options.messages,
      stream: options.stream || false
    }),
    signal
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(error.error || `API error: ${response.status}`, response.status);
  }

  return response;
};

export const generateContent = async <T>(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string
): Promise<T> => {
  const response = await fetchCompletion({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  }, apiKey);

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content) as T;
};

export const streamCompletion = async (
  systemPrompt: string,
  userPrompt: string,
  apiKey: string,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<void> => {
  const response = await fetchCompletion({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    stream: true
  }, apiKey, signal);

  const reader = response.body?.getReader();
  if (!reader) throw new Error('Response body is null');

  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk
      .split('\n')
      .filter(line => line.trim() !== '' && line.trim() !== 'data: [DONE]');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          const content = data.choices[0]?.delta?.content || '';
          if (content) onChunk(content);
        } catch (e) {
          console.error('Error parsing streaming response:', e);
        }
      }
    }
  }
};