"""Pydantic schemas for User endpoints."""

import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr


# ── Request schemas ───────────────────────────────────────────
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ── Response schemas ──────────────────────────────────────────
class UserOut(BaseModel):
    id: uuid.UUID
    email: str
    full_name: str
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
