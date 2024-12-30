from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import AgentConfig
from typing import List, Dict

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
agents: Dict[str, AgentConfig] = {}

@app.post("/api/agents")
async def create_agent(agent: AgentConfig):
    if agent.name in agents:
        raise HTTPException(status_code=400, detail="Agent already exists")
    agents[agent.name] = agent
    return agent

@app.get("/api/agents")
async def list_agents() -> List[AgentConfig]:
    return list(agents.values())

@app.get("/api/agents/{name}")
async def get_agent(name: str) -> AgentConfig:
    if name not in agents:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agents[name]

@app.put("/api/agents/{name}")
async def update_agent(name: str, agent: AgentConfig):
    if name not in agents:
        raise HTTPException(status_code=404, detail="Agent not found")
    agents[name] = agent
    return agent

@app.delete("/api/agents/{name}")
async def delete_agent(name: str):
    if name not in agents:
        raise HTTPException(status_code=404, detail="Agent not found")
    del agents[name]
    return {"message": "Agent deleted"}
