import * as React from 'react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Button } from '../components/ui/button'
import { useToast } from '../components/ui/use-toast'
import { ModelProviderName, AgentConfig } from '../types'

export default function AgentConfigPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    lore: '',
    topics: '',
    adjectives: '',
    modelProvider: 'openai',
    system: '',
    messageExamples: '[]',
    postExamples: '',
    clients: [] as string[],
    plugins: [] as string[],
    style: {
      all: [] as string[],
      chat: [] as string[],
      post: [] as string[]
    },
    templates: {
      goalsTemplate: '',
      factsTemplate: '',
      messageHandlerTemplate: '',
      shouldRespondTemplate: '',
      continueMessageHandlerTemplate: '',
      evaluationTemplate: ''
    },
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
        shouldOnlyJoinInAllowedGroups: false,
        allowedGroupIds: [] as string[],
        messageSimilarityThreshold: 0.8
      },
      slack: {
        shouldIgnoreBotMessages: false,
        shouldIgnoreDirectMessages: false
      }
    },
    imageModelProvider: undefined as ModelProviderName | undefined
  })

  const validateForm = () => {
    // Required fields validation
    const requiredFields = ['name', 'bio', 'modelProvider'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        throw new Error(`${field} is required`);
      }
    }

    // Message examples JSON validation
    try {
      const messageExamples = JSON.parse(formData.messageExamples);
      if (!Array.isArray(messageExamples)) {
        throw new Error('Message examples must be an array');
      }
    } catch (error) {
      throw new Error('Invalid message examples JSON format');
    }

    // Style validation
    if (!formData.style.all.length && !formData.style.chat.length && !formData.style.post.length) {
      throw new Error('At least one style guideline is required');
    }

    // Client validation
    if (!formData.clients.length) {
      throw new Error('At least one client must be selected');
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      validateForm();

      // Prepare payload with required fields
      const payload: AgentConfig = {
        name: formData.name,
        bio: formData.bio,
        topics: formData.topics.split(',').map(t => t.trim()).filter(Boolean),
        adjectives: formData.adjectives.split(',').map(a => a.trim()).filter(Boolean),
        lore: formData.lore.split('\n').filter(Boolean),
        messageExamples: JSON.parse(formData.messageExamples),
        postExamples: formData.postExamples.split('\n').filter(Boolean),
        modelProvider: formData.modelProvider as ModelProviderName,
        style: formData.style,
        clients: formData.clients,
        plugins: formData.plugins,
      };

      // Add optional fields only if they have values
      if (formData.username) payload.username = formData.username;
      if (formData.system) payload.system = formData.system;
      if (formData.imageModelProvider) payload.imageModelProvider = formData.imageModelProvider;

      // Add templates if any template has content
      const templates = Object.fromEntries(
        Object.entries(formData.templates)
          .filter(([_, value]) => value.trim().length > 0)
      );
      if (Object.keys(templates).length > 0) {
        payload.templates = templates;
      }

      // Add client config if any client has non-default values
      const clientConfig = Object.fromEntries(
        Object.entries(formData.clientConfig)
          .filter(([_, config]) => Object.values(config).some(v => 
            typeof v === 'boolean' ? v : 
            Array.isArray(v) ? v.length > 0 : 
            typeof v === 'number' ? v !== 0 : 
            v
          ))
      );
      if (Object.keys(clientConfig).length > 0) {
        payload.clientConfig = clientConfig;
      }

      const response = await fetch('http://localhost:8000/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Agent configuration saved successfully',
        })
      } else {
        throw new Error('Failed to save agent configuration')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save agent configuration',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Configure AI Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="username">Username (optional)</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="system">System Prompt (optional)</Label>
                <Textarea
                  id="system"
                  value={formData.system}
                  onChange={(e) => setFormData({ ...formData, system: e.target.value })}
                  placeholder="Enter system prompt for the agent"
                />
              </div>
              <div>
                <Label htmlFor="imageModelProvider">Image Model Provider (optional)</Label>
                <Select
                  value={formData.imageModelProvider || ''}
                  onValueChange={(value) => setFormData({ ...formData, imageModelProvider: value as ModelProviderName })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an image model provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ModelProviderName).map((provider) => (
                      <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="bio">Biography</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="lore">Lore</Label>
              <Textarea
                id="lore"
                value={formData.lore}
                onChange={(e) => setFormData({ ...formData, lore: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="topics">Topics (comma-separated)</Label>
              <Input
                id="topics"
                value={formData.topics}
                onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="adjectives">Adjectives (comma-separated)</Label>
              <Input
                id="adjectives"
                value={formData.adjectives}
                onChange={(e) => setFormData({ ...formData, adjectives: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="modelProvider">Model Provider</Label>
              <Select
                value={formData.modelProvider}
                onValueChange={(value) => setFormData({ ...formData, modelProvider: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="eternalai">EternalAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="grok">Grok</SelectItem>
                  <SelectItem value="groq">Groq</SelectItem>
                  <SelectItem value="llama_cloud">Llama Cloud</SelectItem>
                  <SelectItem value="together">Together</SelectItem>
                  <SelectItem value="llama_local">Llama Local</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="claude_vertex">Claude Vertex</SelectItem>
                  <SelectItem value="redpill">Redpill</SelectItem>
                  <SelectItem value="openrouter">OpenRouter</SelectItem>
                  <SelectItem value="ollama">Ollama</SelectItem>
                  <SelectItem value="heurist">Heurist</SelectItem>
                  <SelectItem value="galadriel">Galadriel</SelectItem>
                  <SelectItem value="falai">Fal AI</SelectItem>
                  <SelectItem value="gaianet">GaiaNet</SelectItem>
                  <SelectItem value="ali_bailian">Ali Bailian</SelectItem>
                  <SelectItem value="volengine">Volengine</SelectItem>
                  <SelectItem value="nanogpt">NanoGPT</SelectItem>
                  <SelectItem value="hyperbolic">Hyperbolic</SelectItem>
                  <SelectItem value="venice">Venice</SelectItem>
                  <SelectItem value="akash_chat_api">Akash Chat API</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="messageExamples">Message Examples (JSON format)</Label>
              <Textarea
                id="messageExamples"
                value={formData.messageExamples}
                onChange={(e) => setFormData({ ...formData, messageExamples: e.target.value })}
                placeholder="Enter message examples in JSON format"
                required
              />
            </div>
            <div>
              <Label htmlFor="postExamples">Post Examples (one per line)</Label>
              <Textarea
                id="postExamples"
                value={formData.postExamples}
                onChange={(e) => setFormData({ ...formData, postExamples: e.target.value })}
                placeholder="Enter post examples, one per line"
                required
              />
            </div>
            <div>
              <Label>Clients</Label>
              <div className="space-y-2">
                {['discord', 'telegram', 'twitter', 'farcaster', 'lens', 'slack'].map((client) => (
                  <div key={client} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`client-${client}`}
                      checked={formData.clients.includes(client)}
                      onChange={(e) => {
                        const newClients = e.target.checked
                          ? [...formData.clients, client]
                          : formData.clients.filter(c => c !== client);
                        setFormData({ ...formData, clients: newClients });
                      }}
                    />
                    <Label htmlFor={`client-${client}`}>{client}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Style Guidelines</Label>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="styleAll">All Styles (one per line)</Label>
                  <Textarea
                    id="styleAll"
                    value={formData.style.all.join('\n')}
                    onChange={(e) => setFormData({
                      ...formData,
                      style: {
                        ...formData.style,
                        all: e.target.value.split('\n').filter(Boolean)
                      }
                    })}
                    placeholder="Enter style guidelines for all content, one per line"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="styleChat">Chat Styles (one per line)</Label>
                  <Textarea
                    id="styleChat"
                    value={formData.style.chat.join('\n')}
                    onChange={(e) => setFormData({
                      ...formData,
                      style: {
                        ...formData.style,
                        chat: e.target.value.split('\n').filter(Boolean)
                      }
                    })}
                    placeholder="Enter style guidelines for chat, one per line"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stylePost">Post Styles (one per line)</Label>
                  <Textarea
                    id="stylePost"
                    value={formData.style.post.join('\n')}
                    onChange={(e) => setFormData({
                      ...formData,
                      style: {
                        ...formData.style,
                        post: e.target.value.split('\n').filter(Boolean)
                      }
                    })}
                    placeholder="Enter style guidelines for posts, one per line"
                    required
                  />
                </div>
              </div>
            </div>
            <div>
              <Label>Templates (optional)</Label>
              <div className="space-y-2">
                {Object.entries(formData.templates).map(([key, value]) => (
                  <div key={key}>
                    <Label htmlFor={`template-${key}`}>{key}</Label>
                    <Textarea
                      id={`template-${key}`}
                      value={value}
                      onChange={(e) => setFormData({
                        ...formData,
                        templates: {
                          ...formData.templates,
                          [key]: e.target.value
                        }
                      })}
                      placeholder={`Enter ${key}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Client Configuration</Label>
              <div className="space-y-4">
                {Object.entries(formData.clientConfig).map(([clientName, config]) => (
                  <div key={clientName} className="border p-4 rounded">
                    <h3 className="text-lg font-semibold mb-2 capitalize">{clientName} Settings</h3>
                    <div className="space-y-2">
                      {Object.entries(config).map(([key, value]) => {
                        if (typeof value === 'boolean') {
                          return (
                            <div key={key} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`${clientName}-${key}`}
                                checked={value}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  clientConfig: {
                                    ...formData.clientConfig,
                                    [clientName]: {
                                      ...formData.clientConfig[clientName],
                                      [key]: e.target.checked
                                    }
                                  }
                                })}
                              />
                              <Label htmlFor={`${clientName}-${key}`}>{key}</Label>
                            </div>
                          );
                        }
                        if (typeof value === 'number') {
                          return (
                            <div key={key}>
                              <Label htmlFor={`${clientName}-${key}`}>{key}</Label>
                              <Input
                                type="number"
                                id={`${clientName}-${key}`}
                                value={value}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  clientConfig: {
                                    ...formData.clientConfig,
                                    [clientName]: {
                                      ...formData.clientConfig[clientName],
                                      [key]: parseFloat(e.target.value)
                                    }
                                  }
                                })}
                                step="0.1"
                                min="0"
                                max="1"
                              />
                            </div>
                          );
                        }
                        if (Array.isArray(value)) {
                          return (
                            <div key={key}>
                              <Label htmlFor={`${clientName}-${key}`}>{key}</Label>
                              <Input
                                id={`${clientName}-${key}`}
                                value={value.join(', ')}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  clientConfig: {
                                    ...formData.clientConfig,
                                    [clientName]: {
                                      ...formData.clientConfig[clientName],
                                      [key]: e.target.value.split(',').map(item => item.trim())
                                    }
                                  }
                                })}
                                placeholder="Enter comma-separated values"
                              />
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button type="submit">Save Configuration</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
