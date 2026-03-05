"""FastAPI application entrypoint."""

import sys
print("[BOOT] main.py loading...", flush=True)

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

print("[BOOT] importing settings...", flush=True)
from app.config import settings
print(f"[BOOT] APP_ENV={settings.app_env}, CORS={settings.cors_origins}", flush=True)
print(f"[BOOT] DB URL prefix: {settings.database_url[:30]}...", flush=True)

print("[BOOT] importing routers...", flush=True)
from app.routers import aspects, auth, resumes
print("[BOOT] all imports done!", flush=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle events."""
    # TODO: Run Alembic migrations or create tables on startup in dev
    yield


app = FastAPI(
    title="AI Resume Builder API",
    description="Backend API for the AI-Powered Step-by-Step Resume Builder",
    version="0.1.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────
app.include_router(auth.router, prefix="/api/v1")
app.include_router(resumes.router, prefix="/api/v1")
app.include_router(aspects.router, prefix="/api/v1")


@app.get("/", tags=["Health"])
async def health_check():
    """Root health-check endpoint."""
    return {"status": "healthy", "app": "AI Resume Builder API", "version": "0.1.0"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
