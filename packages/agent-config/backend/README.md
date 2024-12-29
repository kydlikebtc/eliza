# Agent Configuration Backend

This service provides the API for managing AI agent configurations in the Eliza framework.

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Set up the database:

```bash
# Create database
createdb eliza

# Run migrations
psql -d eliza -f migrations/001_create_characters_table.sql
```

3. Configure environment variables:

```bash
# Required environment variables
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eliza
DB_USER=postgres
DB_PASS=postgres
```

4. Start the service:

```bash
pnpm start
```

## API Endpoints

### POST /api/agents

Create or update an agent configuration.

Request body must match the Character interface from @elizaos/core.

Example:

```json
{
    "name": "Agent Name",
    "modelProvider": "openai",
    "bio": "Agent description",
    "lore": ["Background story"],
    "messageExamples": [
        [
            { "role": "user", "content": "Hello" },
            { "role": "assistant", "content": "Hi!" }
        ]
    ],
    "postExamples": ["Example post"],
    "topics": ["AI", "Technology"],
    "adjectives": ["Helpful", "Friendly"],
    "clients": ["discord"],
    "plugins": ["core"],
    "style": {
        "all": ["Be concise"],
        "chat": ["Be friendly"],
        "post": ["Be informative"]
    }
}
```

Response:

```json
{
    "success": true,
    "message": "Agent configuration saved successfully",
    "data": {
        "id": 1,
        "name": "Agent Name",
        "modelProvider": "openai",
        "bio": "Agent description",
        "clients": ["discord"],
        "plugins": ["core"],
        "style": {
            "all": ["Be concise"],
            "chat": ["Be friendly"],
            "post": ["Be informative"]
        }
    }
}
```
