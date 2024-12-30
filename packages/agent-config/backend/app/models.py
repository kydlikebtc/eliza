from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class ModelProviderName(str, Enum):
    OPENAI = "openai"
    ETERNALAI = "eternalai"
    ANTHROPIC = "anthropic"
    GROK = "grok"
    GROQ = "groq"
    LLAMACLOUD = "llama_cloud"
    TOGETHER = "together"
    LLAMALOCAL = "llama_local"
    GOOGLE = "google"
    CLAUDE_VERTEX = "claude_vertex"
    REDPILL = "redpill"
    OPENROUTER = "openrouter"
    OLLAMA = "ollama"
    HEURIST = "heurist"
    GALADRIEL = "galadriel"
    FAL = "falai"
    GAIANET = "gaianet"
    ALI_BAILIAN = "ali_bailian"
    VOLENGINE = "volengine"
    NANOGPT = "nanogpt"
    HYPERBOLIC = "hyperbolic"
    VENICE = "venice"
    AKASH_CHAT_API = "akash_chat_api"

class Style(BaseModel):
    all: List[str]
    chat: List[str]
    post: List[str]

class AgentConfig(BaseModel):
    name: str
    bio: str
    lore: List[str]
    topics: List[str]
    adjectives: List[str]
    model_provider: ModelProviderName
    message_examples: List[List[dict]]
    post_examples: List[str]
    clients: List[str]
    plugins: List[str]
    style: Style
