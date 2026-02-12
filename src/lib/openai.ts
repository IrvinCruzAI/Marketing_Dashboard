import OpenAI from 'openai';

export class OpenAIError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'OpenAIError';
    this.status = status;
  }
}

export const generateImage = async (
  prompt: string,
  apiKey: string,
  style?: string,
  size: '1024x1024' | '1792x1024' | '1024x1792' = '1024x1024',
  quality: 'standard' | 'hd' = 'standard'
): Promise<{ url: string; cost: number }> => {
  if (!apiKey) {
    throw new OpenAIError('OpenAI API key is required', 401);
  }

  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });

  try {
    // Add style to prompt if provided
    const enhancedPrompt = style ? `${prompt}. Style: ${style}` : prompt;

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      size,
      quality,
      response_format: 'url',
      n: 1
    });

    if (!response.data || response.data.length === 0) {
      throw new OpenAIError('No image generated', 500);
    }

    const cost = calculateImageCost(size, quality);

    return {
      url: response.data[0].url!,
      cost
    };
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      throw new OpenAIError(error.message, error.status || 500);
    }
    throw new OpenAIError('Failed to generate image', 500);
  }
};

export const calculateImageCost = (size: string = '1024x1024', quality: string = 'standard'): number => {
  // DALL-E 3 pricing
  if (size === '1024x1024') {
    return quality === 'hd' ? 0.080 : 0.040;
  }
  if (size === '1792x1024' || size === '1024x1792') {
    return quality === 'hd' ? 0.120 : 0.080;
  }
  return 0.040; // default
};