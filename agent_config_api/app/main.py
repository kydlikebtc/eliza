from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg
from .models import Character

app = FastAPI()

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}


@app.post("/api/agents")
async def create_agent(character: Character):
    """
    Create or update an agent configuration.
    The character payload must match the Character interface from @elizaos/core.
    """
    try:
        # TODO: In production, we would:
        # 1. Store the character config in a database
        # 2. Initialize the agent runtime with the new config
        # 3. Handle any initialization errors
        # For now, we'll just validate and return success
        
        return {
            "success": True,
            "message": "Agent configuration saved successfully",
            "data": {
                "name": character.name,
                "modelProvider": character.modelProvider,
                "bio": character.bio,
                "clients": [client.value for client in character.clients]
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create agent: {str(e)}"
        )
