from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class ModelProviderName(str, Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GROK = "grok"
    LLAMA = "llama"

class AgentConfig(BaseModel):
    name: str
    biography: str
    lore: str
    topics: List[str]
    adjectives: List[str]
    model_provider: ModelProviderName
    description: Optional[str] = None
