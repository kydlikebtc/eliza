import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { ModelProviderName } from "../types";
import { useToast } from "../components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface CharacterConfig {
  name: string;
  modelProvider: ModelProviderName;
  bio: string[];
  lore: string[];
  messageExamples: Array<Array<{
    role: string;
    content: string;
  }>>;
  postExamples: string[];
  topics: string[];
  adjectives: string[];
  clients: string[];
  plugins: string[];
  style: {
    all: string[];
    chat: string[];
    post: string[];
  };
  settings: {
    voice?: {
      model?: string;
      elevenlabs?: {
        voiceId?: string;
        stability?: string;
      };
    };
    secrets?: Record<string, unknown>;
    chains?: {
      evm?: string[];
      solana?: string[];
    };
  };
  clientConfig?: {
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
      messageSimilarityThreshold?: number;
    };
  };
}

export function AgentConfigPage() {
  const [character, setCharacter] = useState<CharacterConfig>({
    name: "",
    modelProvider: ModelProviderName.OPENAI,
    bio: [],
    lore: [],
    messageExamples: [],
    postExamples: [],
    topics: [],
    adjectives: [],
    clients: [],
    plugins: [],
    style: {
      all: [],
      chat: [],
      post: []
    },
    settings: {},
    clientConfig: {
      discord: {
        shouldIgnoreBotMessages: false,
        shouldIgnoreDirectMessages: false,
        shouldRespondOnlyToMentions: false,
        messageSimilarityThreshold: 0.8
      },
      telegram: {
        shouldIgnoreBotMessages: false,
        shouldIgnoreDirectMessages: false,
        shouldRespondOnlyToMentions: false,
        messageSimilarityThreshold: 0.8
      }
    }
  });

  const handleInputChange = (field: string, value: any) => {
    setCharacter(prev => ({ ...prev, [field]: value }));
  };

  const handleBioChange = (value: string) => {
    handleInputChange("bio", value.split("\n"));
  };

  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("http://localhost:8000/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(character),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Agent configuration saved successfully",
          variant: "default",
        });
      } else {
        throw new Error(result.detail || "Failed to save agent configuration");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save agent configuration",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Agent Configuration</CardTitle>
          <CardDescription>Configure your AI agent's personality and settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={character.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter agent name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="modelProvider">Model Provider</Label>
            <Select
              value={character.modelProvider}
              onValueChange={(value) => handleInputChange("modelProvider", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a model provider" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ModelProviderName).map((provider) => (
                <SelectItem key={provider} value={provider}>
                  {provider.charAt(0).toUpperCase() + provider.slice(1).toLowerCase().replace(/_/g, ' ')}
                </SelectItem>
              ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biography</Label>
            <Textarea
              id="bio"
              value={character.bio.join("\n")}
              onChange={(e) => handleBioChange(e.target.value)}
              placeholder="Enter agent biography (one line per entry)"
              className="h-32"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="voice-model">Voice Model (Optional)</Label>
            <Input
              id="voice-model"
              value={character.settings.voice?.model || ""}
              onChange={(e) => 
                setCharacter(prev => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    voice: {
                      ...prev.settings.voice,
                      model: e.target.value
                    }
                  }
                }))
              }
              placeholder="Enter voice model"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lore">Lore</Label>
            <Textarea
              id="lore"
              value={character.lore.join("\n")}
              onChange={(e) => handleInputChange("lore", e.target.value.split("\n"))}
              placeholder="Enter character lore (one line per entry)"
              className="h-32"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topics">Topics</Label>
            <Textarea
              id="topics"
              value={character.topics.join("\n")}
              onChange={(e) => handleInputChange("topics", e.target.value.split("\n"))}
              placeholder="Enter known topics (one per line)"
              className="h-24"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adjectives">Character Traits</Label>
            <Textarea
              id="adjectives"
              value={character.adjectives.join("\n")}
              onChange={(e) => handleInputChange("adjectives", e.target.value.split("\n"))}
              placeholder="Enter character traits (one per line)"
              className="h-24"
            />
          </div>

          <div className="space-y-2">
            <Label>Writing Style</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="style-all">All</Label>
                <Textarea
                  id="style-all"
                  value={character.style.all.join("\n")}
                  onChange={(e) => 
                    setCharacter(prev => ({
                      ...prev,
                      style: {
                        ...prev.style,
                        all: e.target.value.split("\n")
                      }
                    }))
                  }
                  placeholder="General style"
                  className="h-24"
                />
              </div>
              <div>
                <Label htmlFor="style-chat">Chat</Label>
                <Textarea
                  id="style-chat"
                  value={character.style.chat.join("\n")}
                  onChange={(e) => 
                    setCharacter(prev => ({
                      ...prev,
                      style: {
                        ...prev.style,
                        chat: e.target.value.split("\n")
                      }
                    }))
                  }
                  placeholder="Chat style"
                  className="h-24"
                />
              </div>
              <div>
                <Label htmlFor="style-post">Post</Label>
                <Textarea
                  id="style-post"
                  value={character.style.post.join("\n")}
                  onChange={(e) => 
                    setCharacter(prev => ({
                      ...prev,
                      style: {
                        ...prev.style,
                        post: e.target.value.split("\n")
                      }
                    }))
                  }
                  placeholder="Post style"
                  className="h-24"
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSave}
            className="w-full"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Configuration"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default AgentConfigPage;
