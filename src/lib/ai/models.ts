// For client side usage
export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  description: string;
  capabilities: {
    text: boolean;
    vision: boolean;
    tools: boolean;
    reasoning: boolean;
  };
}

export const AI_MODELS: Record<string, ModelInfo> = {
  // ObbyLabs Models
  "obbylabs:agent-chat": {
    id: "obbylabs:agent-chat",
    name: "Agent Chat",
    provider: "obbylabs",
    description: "Advanced agent for complex conversations",
    capabilities: {
      text: true,
      vision: true,
      tools: true,
      reasoning: true,
    },
  },
  "obbylabs:fast-chat": {
    id: "obbylabs:fast-chat",
    name: "Fast Chat",
    provider: "obbylabs",
    description: "Quick responses for simple tasks",
    capabilities: {
      text: true,
      vision: true,
      tools: true,
      reasoning: false,
    },
  },

  // OpenAI Models
  "openai:gpt-4.1": {
    id: "openai:gpt-4.1",
    name: "GPT-4.1",
    provider: "openai",
    description: "Latest GPT-4.1 model",
    capabilities: {
      text: true,
      vision: true,
      tools: true,
      reasoning: true,
    },
  },
  "openai:gpt-4.1-mini": {
    id: "openai:gpt-4.1-mini",
    name: "GPT-4.1 Mini",
    provider: "openai",
    description: "Smaller version of GPT-4.1",
    capabilities: {
      text: true,
      vision: true,
      tools: true,
      reasoning: false,
    },
  },
  "openai:gpt-4o": {
    id: "openai:gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    description: "Multimodal GPT-4o model",
    capabilities: {
      text: true,
      vision: true,
      tools: true,
      reasoning: true,
    },
  },
  "openai:gpt-4o-mini": {
    id: "openai:gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    description: "Fast and efficient GPT-4o",
    capabilities: {
      text: true,
      vision: true,
      tools: true,
      reasoning: false,
    },
  },
  "openai:o3": {
    id: "openai:o3",
    name: "o3",
    provider: "openai",
    description: "Advanced reasoning model",
    capabilities: {
      text: true,
      vision: false,
      tools: true,
      reasoning: true,
    },
  },
  "openai:o4-mini": {
    id: "openai:o4-mini",
    name: "o4 Mini",
    provider: "openai",
    description: "Compact reasoning model",
    capabilities: {
      text: true,
      vision: false,
      tools: true,
      reasoning: true,
    },
  },

  // Anthropic Models
  "anthropic:claude-sonnet-4": {
    id: "anthropic:claude-sonnet-4",
    name: "Claude Sonnet 4",
    provider: "anthropic",
    description: "Most capable Claude model",
    capabilities: {
      text: true,
      vision: true,
      tools: true,
      reasoning: true,
    },
  },
  "anthropic:claude-3.7-sonnet": {
    id: "anthropic:claude-3.7-sonnet",
    name: "Claude 3.7 Sonnet",
    provider: "anthropic",
    description: "Advanced Claude 3.7 model",
    capabilities: {
      text: true,
      vision: true,
      tools: true,
      reasoning: true,
    },
  },
  "anthropic:claude-3.5-haiku": {
    id: "anthropic:claude-3.5-haiku",
    name: "Claude 3.5 Haiku",
    provider: "anthropic",
    description: "Fast Claude model",
    capabilities: {
      text: true,
      vision: false,
      tools: true,
      reasoning: false,
    },
  },

  // Google Models
  "google:gemini-2.5-pro": {
    id: "google:gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "google",
    description: "Advanced Gemini model",
    capabilities: {
      text: true,
      vision: true,
      tools: true,
      reasoning: true,
    },
  },
  "google:gemini-2.5-flash": {
    id: "google:gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "google",
    description: "Fast Gemini model",
    capabilities: {
      text: true,
      vision: true,
      tools: true,
      reasoning: false,
    },
  },
  "google:gemini-2.0-flash": {
    id: "google:gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "google",
    description: "Stable Gemini 2.0 model",
    capabilities: {
      text: true,
      vision: true,
      tools: true,
      reasoning: true,
    },
  },

  // xAI Models
  "xai:grok-3-mini": {
    id: "xai:grok-3-mini",
    name: "Grok 3 Mini",
    provider: "xai",
    description: "Compact Grok model",
    capabilities: {
      text: true,
      vision: false,
      tools: true,
      reasoning: true,
    },
  },
};

export const MODEL_ALIASES: Record<string, string> = {
  openai: "openai:gpt-4o",
  anthropic: "anthropic:claude-sonnet-4",
  claude: "anthropic:claude-sonnet-4",
  google: "google:gemini-2.5-pro",
  gemini: "google:gemini-2.5-pro",
  xai: "xai:grok-3-mini",
  grok: "xai:grok-3-mini",
  obbylabs: "obbylabs:agent-chat",
};

export function getModelInfo(modelId: string): ModelInfo | null {
  const resolvedId = MODEL_ALIASES[modelId] || modelId;
  return AI_MODELS[resolvedId] || null;
}

export function getAllModels(): ModelInfo[] {
  return Object.values(AI_MODELS);
}

export function getModelsByProvider(provider: string): ModelInfo[] {
  return Object.values(AI_MODELS).filter(
    (model) => model.provider === provider,
  );
}

export function resolveModelId(input: string): string {
  return MODEL_ALIASES[input] || input;
}

export function isValidModelId(modelId: string): boolean {
  const resolvedId = resolveModelId(modelId);
  return resolvedId in AI_MODELS;
}

export function getProviderFromModelId(modelId: string): string | null {
  const resolvedId = resolveModelId(modelId);
  const [provider] = resolvedId.split(":");

  if (!provider || !isValidModelId(resolvedId)) {
    return null;
  }

  return provider;
}

export function validateModelIdFormat(modelId: string): {
  isValid: boolean;
  provider: string | null;
  model: string | null;
  resolvedId: string;
} {
  const resolvedId = resolveModelId(modelId);
  const [provider, model] = resolvedId.split(":");

  const isValid = provider && model && isValidModelId(resolvedId);

  return {
    isValid: Boolean(isValid),
    provider: provider || null,
    model: model || null,
    resolvedId,
  };
}
