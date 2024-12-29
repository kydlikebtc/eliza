export enum ModelProviderName {
  OPENAI = "openai",
  ETERNALAI = "eternalai",
  ANTHROPIC = "anthropic",
  GROK = "grok",
  GROQ = "groq",
  LLAMACLOUD = "llama_cloud",
  TOGETHER = "together",
  LLAMALOCAL = "llama_local",
  GOOGLE = "google",
  CLAUDE_VERTEX = "claude_vertex",
  REDPILL = "redpill",
  OPENROUTER = "openrouter",
  OLLAMA = "ollama",
  HEURIST = "heurist",
  GALADRIEL = "galadriel",
  FAL = "falai",
  GAIANET = "gaianet",
  ALI_BAILIAN = "ali_bailian",
  VOLENGINE = "volengine",
  NANOGPT = "nanogpt",
  HYPERBOLIC = "hyperbolic",
  VENICE = "venice",
  AKASH_CHAT_API = "akash_chat_api"
}

export interface Style {
  all: string[];
  chat: string[];
  post: string[];
}

export interface ClientConfig {
  discord?: {
    shouldIgnoreBotMessages?: boolean;
    shouldIgnoreDirectMessages?: boolean;
    shouldRespondOnlyToMentions?: boolean;
    messageSimilarityThreshold?: number;
  };
  telegram?: {
    shouldIgnoreBotMessages?: boolean;
    shouldIgnoreDirectMessages?: boolean;
    shouldRespondOnlyToMentions?: boolean;
    shouldOnlyJoinInAllowedGroups?: boolean;
    allowedGroupIds?: string[];
    messageSimilarityThreshold?: number;
  };
  slack?: {
    shouldIgnoreBotMessages?: boolean;
    shouldIgnoreDirectMessages?: boolean;
  };
}

export interface Templates {
  goalsTemplate?: string;
  factsTemplate?: string;
  messageHandlerTemplate?: string;
  shouldRespondTemplate?: string;
  continueMessageHandlerTemplate?: string;
  evaluationTemplate?: string;
}

export interface AgentConfig {
  name: string;
  username?: string;
  bio: string;
  lore: string[];
  topics: string[];
  adjectives: string[];
  modelProvider: ModelProviderName;
  system?: string;
  messageExamples: Array<Array<{[key: string]: any}>>;
  postExamples: string[];
  clients: string[];
  plugins: string[];
  style: Style;
  templates?: Templates;
  clientConfig?: ClientConfig;
  imageModelProvider?: ModelProviderName;
}
