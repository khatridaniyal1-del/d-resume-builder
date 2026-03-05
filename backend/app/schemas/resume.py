"""Pydantic schemas for Resume endpoints."""

import uuid
from datetime import datetime

from pydantic import BaseModel


class ResumeCreate(BaseModel):
    title: str = "Untitled Resume"
    template_id: str = "classic"


class ResumeUpdate(BaseModel):
    title: str | None = None
    template_id: str | None = None
    master_summary: str | None = None
    is_finalized: bool | None = None


class CompilePayload(BaseModel):
    """Payload containing all approved aspect summaries for master compilation."""
    personal_info: list[str] = []
    education: list[str] = []
    experience: list[str] = []
    projects: list[str] = []
    skills: list[str] = []
    achievements: list[str] = []
    


class ResumeOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    template_id: str
    master_summary: str | None
    is_finalized: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
