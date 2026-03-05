"""Pydantic schemas for all resume aspect sections."""

import uuid
from datetime import date, datetime

from pydantic import BaseModel


# ═══════════════════════════════════════════════════════════════
# Personal Info
# ═══════════════════════════════════════════════════════════════
class PersonalInfoCreate(BaseModel):
    full_name: str
    email: str
    phone: str | None = None
    location: str | None = None
    linkedin_url: str | None = None
    portfolio_url: str | None = None


class PersonalInfoOut(PersonalInfoCreate):
    id: uuid.UUID
    resume_id: uuid.UUID
    ai_summary: str | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ═══════════════════════════════════════════════════════════════
# Education
# ═══════════════════════════════════════════════════════════════
class EducationCreate(BaseModel):
    institution: str
    degree: str
    field_of_study: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    gpa: float | None = None
    raw_description: str | None = None


class EducationOut(EducationCreate):
    id: uuid.UUID
    resume_id: uuid.UUID
    ai_summary: str | None = None
    is_approved: bool
    display_order: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ═══════════════════════════════════════════════════════════════
# Experience
# ═══════════════════════════════════════════════════════════════
class ExperienceCreate(BaseModel):
    company: str
    job_title: str
    location: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    is_current: bool = False
    raw_description: str | None = None


class ExperienceOut(ExperienceCreate):
    id: uuid.UUID
    resume_id: uuid.UUID
    ai_summary: str | None = None
    is_approved: bool
    display_order: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ═══════════════════════════════════════════════════════════════
# Project
# ═══════════════════════════════════════════════════════════════
class ProjectCreate(BaseModel):
    name: str
    tech_stack: str | None = None
    url: str | None = None
    raw_description: str | None = None


class ProjectOut(ProjectCreate):
    id: uuid.UUID
    resume_id: uuid.UUID
    ai_summary: str | None = None
    is_approved: bool
    display_order: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ═══════════════════════════════════════════════════════════════
# Skill
# ═══════════════════════════════════════════════════════════════
class SkillCreate(BaseModel):
    category: str
    items: str
    proficiency_level: str | None = None


class SkillOut(SkillCreate):
    id: uuid.UUID
    resume_id: uuid.UUID
    display_order: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ═══════════════════════════════════════════════════════════════
# Achievement
# ═══════════════════════════════════════════════════════════════
class AchievementCreate(BaseModel):
    title: str
    issuer: str | None = None
    date_received: date | None = None
    raw_description: str | None = None


class AchievementOut(AchievementCreate):
    id: uuid.UUID
    resume_id: uuid.UUID
    ai_summary: str | None = None
    is_approved: bool
    display_order: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ═══════════════════════════════════════════════════════════════
# AI Summarize request/response (shared by all aspects)
# ═══════════════════════════════════════════════════════════════
class SummarizeRequest(BaseModel):
    """Send raw data to the AI for polished summary generation."""
    aspect_type: str  # "education", "experience", "project", "achievement"
    raw_data: dict  # the raw fields for the aspect


class SummarizeResponse(BaseModel):
    ai_summary: str
