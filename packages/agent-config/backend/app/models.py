from enum import Enum
from typing import List, Optional, Union, Dict, Any
from pydantic import BaseModel, Field

class ModelProviderName(str, Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GROK = "grok"
    GOOGLE = "google"
    CLAUDE_VERTEX = "claude_vertex"
    REDPILL = "redpill"
    OPENROUTER = "openrouter"
    OLLAMA = "ollama"
    HEURIST = "heurist"
    GALADRIEL = "galadriel"
    FAL = "fal"
    GAIANET = "gaianet"
    ALI_BAILIAN = "ali_bailian"
    VOLENGINE = "volengine"
    NANOGPT = "nanogpt"
    HYPERBOLIC = "hyperbolic"
    VENICE = "venice"
    AKASH_CHAT_API = "akash_chat_api"

class Clients(str, Enum):
    DISCORD = "discord"
    TELEGRAM = "telegram"
    TWITTER = "twitter"
    SLACK = "slack"
    FARCASTER = "farcaster"
    LENS = "lens"

class MessageExample(BaseModel):
    role: str
    content: str

class StyleConfig(BaseModel):
    all: List[str]
    chat: List[str]
    post: List[str]

class VoiceConfig(BaseModel):
    model: Optional[str] = None
    url: Optional[str] = None
    elevenlabs: Optional[Dict[str, Any]] = None

class ClientPlatformConfig(BaseModel):
    shouldIgnoreBotMessages: Optional[bool] = None
    shouldIgnoreDirectMessages: Optional[bool] = None
    shouldRespondOnlyToMentions: Optional[bool] = None
    messageSimilarityThreshold: Optional[float] = None
    isPartOfTeam: Optional[bool] = None
    teamAgentIds: Optional[List[str]] = None
    teamLeaderId: Optional[str] = None
    teamMemberInterestKeywords: Optional[List[str]] = None

class ClientConfig(BaseModel):
    discord: Optional[ClientPlatformConfig] = None
    telegram: Optional[ClientPlatformConfig] = None
    slack: Optional[ClientPlatformConfig] = None

class Settings(BaseModel):
    secrets: Optional[Dict[str, str]] = None
    intiface: Optional[bool] = None
    voice: Optional[VoiceConfig] = None
    model: Optional[str] = None
    embeddingModel: Optional[str] = None
    chains: Optional[Dict[str, List[Any]]] = None

class TwitterProfile(BaseModel):
    id: str
    username: str
    screenName: str
    bio: str
    nicknames: Optional[List[str]] = None

class NFTConfig(BaseModel):
    prompt: str

class Character(BaseModel):
    name: str
    modelProvider: ModelProviderName
    imageModelProvider: Optional[ModelProviderName] = None
    modelEndpointOverride: Optional[str] = None
    templates: Optional[Dict[str, str]] = None
    bio: Union[str, List[str]]
    lore: List[str]
    messageExamples: List[List[MessageExample]]
    postExamples: List[str]
    topics: List[str]
    adjectives: List[str]
    knowledge: Optional[List[str]] = None
    clients: List[Clients]
    plugins: List[str]
    settings: Optional[Settings] = None
    clientConfig: Optional[ClientConfig] = None
    style: StyleConfig
    twitterProfile: Optional[TwitterProfile] = None
    nft: Optional[NFTConfig] = None
