export type AIModel = {
  id: string;
  name: string;
  provider: string;
  inputPerMillion: number;
  outputPerMillion: number;
  contextTokens: number;
  modality: "text" | "multimodal";
};

/** Illustrative API pricing (USD per 1M tokens). Not live rates — verify with providers. */
export const MODELS: AIModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    inputPerMillion: 2.5,
    outputPerMillion: 10,
    contextTokens: 128000,
    modality: "multimodal",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o mini",
    provider: "OpenAI",
    inputPerMillion: 0.15,
    outputPerMillion: 0.6,
    contextTokens: 128000,
    modality: "multimodal",
  },
  {
    id: "o3-mini",
    name: "o3-mini",
    provider: "OpenAI",
    inputPerMillion: 1.1,
    outputPerMillion: 4.4,
    contextTokens: 200000,
    modality: "text",
  },
  {
    id: "claude-sonnet-4",
    name: "Claude Sonnet 4",
    provider: "Anthropic",
    inputPerMillion: 3,
    outputPerMillion: 15,
    contextTokens: 1000000,
    modality: "multimodal",
  },
  {
    id: "claude-haiku-35",
    name: "Claude 3.5 Haiku",
    provider: "Anthropic",
    inputPerMillion: 0.8,
    outputPerMillion: 4,
    contextTokens: 200000,
    modality: "multimodal",
  },
  {
    id: "gemini-25-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    inputPerMillion: 1.25,
    outputPerMillion: 10,
    contextTokens: 1000000,
    modality: "multimodal",
  },
  {
    id: "gemini-25-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    inputPerMillion: 0.15,
    outputPerMillion: 0.6,
    contextTokens: 1000000,
    modality: "multimodal",
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    inputPerMillion: 0.27,
    outputPerMillion: 1.1,
    contextTokens: 64000,
    modality: "text",
  },
  {
    id: "llama-405b",
    name: "Llama 3.1 405B",
    provider: "Meta (via partners)",
    inputPerMillion: 5,
    outputPerMillion: 15,
    contextTokens: 128000,
    modality: "text",
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "Mistral",
    inputPerMillion: 2,
    outputPerMillion: 6,
    contextTokens: 128000,
    modality: "text",
  },
  {
    id: "grok-3",
    name: "Grok 3",
    provider: "xAI",
    inputPerMillion: 3,
    outputPerMillion: 15,
    contextTokens: 131072,
    modality: "text",
  },
  {
    id: "command-r-plus",
    name: "Command R+",
    provider: "Cohere",
    inputPerMillion: 2.5,
    outputPerMillion: 10,
    contextTokens: 128000,
    modality: "text",
  },
];

export function blendedPricePerM(model: AIModel): number {
  return (model.inputPerMillion + model.outputPerMillion) / 2;
}
