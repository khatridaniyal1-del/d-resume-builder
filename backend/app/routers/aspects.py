"""Aspect routes — CRUD + AI summarization for each resume section."""

import uuid
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.aspects import (
    Achievement,
    Education,
    Experience,
    PersonalInfo,
    Project,
    Skill,
)
from app.schemas.aspects import (
    AchievementCreate,
    AchievementOut,
    EducationCreate,
    EducationOut,
    ExperienceCreate,
    ExperienceOut,
    PersonalInfoCreate,
    PersonalInfoOut,
    ProjectCreate,
    ProjectOut,
    SkillCreate,
    SkillOut,
    SummarizeRequest,
    SummarizeResponse,
)
from app.services import ai_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/resumes/{resume_id}/aspects", tags=["Aspects"])

# ── Helper ────────────────────────────────────────────────────

ASPECT_MAP = {
    "personal_info": (PersonalInfo, PersonalInfoCreate, PersonalInfoOut),
    "education": (Education, EducationCreate, EducationOut),
    "experience": (Experience, ExperienceCreate, ExperienceOut),
    "project": (Project, ProjectCreate, ProjectOut),
    "skill": (Skill, SkillCreate, SkillOut),
    "achievement": (Achievement, AchievementCreate, AchievementOut),
}

VALID_ASPECT_TYPES = list(ASPECT_MAP.keys())


def _get_model(aspect_type: str):
    if aspect_type not in ASPECT_MAP:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown aspect type: {aspect_type}. Must be one of {VALID_ASPECT_TYPES}",
        )
    return ASPECT_MAP[aspect_type]


# ── AI Summarization (MUST be before /{aspect_type} routes) ──

@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_aspect(
    resume_id: uuid.UUID,
    payload: SummarizeRequest,
):
    """Send raw aspect data to the AI and receive a polished summary.

    Accepts a JSON body with:
    - aspect_type: one of "education", "experience", "project", "achievement",
                   "personal_info", "skill"
    - raw_data: dict of the raw user-input fields for that aspect

    Returns:
    - ai_summary: the AI-generated professional bullet points
    """
    # Validate aspect type
    if payload.aspect_type not in VALID_ASPECT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid aspect_type: '{payload.aspect_type}'. "
                   f"Must be one of {VALID_ASPECT_TYPES}",
        )

    try:
        summary = await ai_service.summarize_aspect(
            aspect_type=payload.aspect_type,
            raw_data=payload.raw_data,
        )
        return SummarizeResponse(ai_summary=summary)

    except RuntimeError as e:
        logger.error("AI summarization failed: %s", e)
        raise HTTPException(
            status_code=503,
            detail=str(e),
        )


# ── Generic CRUD ──────────────────────────────────────────────

@router.get("/{aspect_type}", status_code=status.HTTP_200_OK)
async def list_aspects(
    resume_id: uuid.UUID,
    aspect_type: str,
    db: AsyncSession = Depends(get_db),
):
    """List all entries for a given aspect type within a resume."""
    model, _, _ = _get_model(aspect_type)
    query = select(model).where(model.resume_id == resume_id)
    if hasattr(model, "display_order"):
        query = query.order_by(model.display_order)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/{aspect_type}", status_code=status.HTTP_201_CREATED)
async def create_aspect(
    resume_id: uuid.UUID,
    aspect_type: str,
    payload: dict,
    db: AsyncSession = Depends(get_db),
):
    """Create a new aspect entry for a resume."""
    model, schema_create, _ = _get_model(aspect_type)
    validated = schema_create(**payload)
    entry = model(resume_id=resume_id, **validated.model_dump())
    db.add(entry)
    await db.flush()
    await db.refresh(entry)
    return entry


@router.delete("/{aspect_type}/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_aspect(
    resume_id: uuid.UUID,
    aspect_type: str,
    entry_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Delete a single aspect entry."""
    model, _, _ = _get_model(aspect_type)
    result = await db.execute(
        select(model).where(model.id == entry_id, model.resume_id == resume_id)
    )
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=404, detail="Aspect entry not found.")
    await db.delete(entry)
