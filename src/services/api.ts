const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Generic API call handler
 */
async function apiCall<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `API call failed with status ${response.status}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'API call failed');
  }

  return data.data;
}

// ==========================================
// Idea Generator API
// ==========================================
export const ideasApi = {
  generate: (body: {
    niche: string;
    targetAudience?: string;
    contentStyle?: string;
    count?: number;
  }) => apiCall('/ideas/generate', body),

  getTrending: (body: { niche?: string; count?: number }) =>
    apiCall('/ideas/trending', body),
};

// ==========================================
// Prompt Generator API
// ==========================================
export const promptsApi = {
  generate: (body: {
    topic: string;
    platform?: string;
    style?: string;
    duration?: string;
    niche?: string;
    extraDetails?: string;
  }) => apiCall('/prompts/generate', body),
};

// ==========================================
// Script Generator API
// ==========================================
export const scriptsApi = {
  generate: (body: {
    topic: string;
    style?: string;
    duration?: string;
    targetAudience?: string;
    tone?: string;
  }) => apiCall('/scripts/generate', body),

  generateHooks: (body: { topic: string; count?: number }) =>
    apiCall('/scripts/hook', body),

  stream: async (
    body: { topic: string; style?: string; duration?: string },
    onChunk: (content: string) => void,
    onDone: () => void,
    onError: (error: string) => void,
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/scripts/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Stream failed');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onDone();
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                onError(parsed.error);
                return;
              }
              if (parsed.content) {
                onChunk(parsed.content);
              }
            } catch {
              // skip invalid JSON
            }
          }
        }
      }
      onDone();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Stream failed');
    }
  },
};

// ==========================================
// Thumbnail API
// ==========================================
export const thumbnailsApi = {
  generate: (body: {
    topic: string;
    style?: string;
    platform?: string;
    count?: number;
    colorScheme?: string;
  }) => apiCall('/thumbnails/generate', body),
};

// ==========================================
// SEO API
// ==========================================
export const seoApi = {
  generateTitles: (body: {
    topic: string;
    keywords?: string[];
    platform?: string;
    count?: number;
  }) => apiCall('/seo/titles', body),

  researchKeywords: (body: { topic: string; niche?: string }) =>
    apiCall('/seo/keywords', body),

  generateDescription: (body: {
    topic: string;
    keywords?: string[];
    includeTimestamps?: boolean;
  }) => apiCall('/seo/description', body),
};

// ==========================================
// Shorts/Reels API
// ==========================================
export const shortsApi = {
  generate: (body: {
    topic: string;
    platform?: string;
    style?: string;
    count?: number;
    duration?: string;
    niche?: string;
  }) => apiCall('/shorts/generate', body),

  generateHooks: (body: { niche: string; count?: number }) =>
    apiCall('/shorts/hooks', body),
};

// ==========================================
// Instagram API
// ==========================================
export const instagramApi = {
  generateCaptions: (body: {
    topic: string;
    tone?: string;
    includeEmojis?: boolean;
    includeHashtags?: boolean;
    count?: number;
    niche?: string;
    postType?: string;
  }) => apiCall('/instagram/captions', body),

  generateBio: (body: { niche: string; name?: string; style?: string }) =>
    apiCall('/instagram/bio', body),
};

// ==========================================
// Health Check
// ==========================================
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
};
