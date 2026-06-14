from fastapi import FastAPI

app = FastAPI(title="CivicAI AI Service", version="0.1.0")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"service": "ai-service", "status": "ok"}

