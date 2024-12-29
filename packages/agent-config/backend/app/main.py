from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg
from .models import Character
import os

# Database configuration
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "eliza")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "postgres")

DB_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

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
        # Validate required fields
        if not character.name:
            raise ValueError("Name is required")
        if not character.modelProvider:
            raise ValueError("Model provider is required")
        if not character.bio:
            raise ValueError("Bio is required")
        if not character.lore:
            raise ValueError("Lore is required")
        if not character.messageExamples:
            raise ValueError("Message examples are required")
        if not character.postExamples:
            raise ValueError("Post examples are required")
        if not character.topics:
            raise ValueError("Topics are required")
        if not character.adjectives:
            raise ValueError("Adjectives are required")
        if not character.clients:
            raise ValueError("At least one client is required")
        if not character.plugins:
            raise ValueError("At least one plugin is required")
        if not character.style:
            raise ValueError("Style configuration is required")

        # Store character config in database
        async with psycopg.AsyncConnection.connect(DB_URL) as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    INSERT INTO characters (name, config, created_at, updated_at)
                    VALUES (%s, %s, NOW(), NOW())
                    ON CONFLICT (name) DO UPDATE
                    SET config = %s, updated_at = NOW()
                    RETURNING id
                    """,
                    (character.name, character.json(), character.json())
                )
                character_id = await cur.fetchone()

        # Initialize agent runtime with new config
        # Note: In production, this would be handled by a separate service
        # that manages agent lifecycles
        
        return {
            "success": True,
            "message": "Agent configuration saved successfully",
            "data": {
                "id": character_id[0] if character_id else None,
                "name": character.name,
                "modelProvider": character.modelProvider,
                "bio": character.bio,
                "clients": [client.value for client in character.clients],
                "plugins": character.plugins,
                "style": character.style.dict()
            }
        }
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except psycopg.Error as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create agent: {str(e)}"
        )
