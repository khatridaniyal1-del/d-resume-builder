"""Resume CRUD routes."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.resume import Resume
from app.schemas.resume import ResumeCreate, ResumeOut, ResumeUpdate, CompilePayload
from app.services import ai_service

router = APIRouter(prefix="/resumes", tags=["Resumes"])

# TODO: Replace hardcoded user_id with auth dependency
TEMP_USER_ID = uuid.UUID("00000000-0000-0000-0000-000000000001")


@router.post("/", response_model=ResumeOut, status_code=status.HTTP_201_CREATED)
async def create_resume(payload: ResumeCreate, db: AsyncSession = Depends(get_db)):
    """Create a new resume for the authenticated user."""
    resume = Resume(user_id=TEMP_USER_ID, **payload.model_dump())
    db.add(resume)
    await db.flush()
    await db.refresh(resume)
    return resume


@router.get("/", response_model=list[ResumeOut])
async def list_resumes(db: AsyncSession = Depends(get_db)):
    """List all resumes for the authenticated user."""
    result = await db.execute(
        select(Resume).where(Resume.user_id == TEMP_USER_ID).order_by(Resume.updated_at.desc())
    )
    return result.scalars().all()


@router.get("/{resume_id}", response_model=ResumeOut)
async def get_resume(resume_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Retrieve a single resume by ID."""
    result = await db.execute(select(Resume).where(Resume.id == resume_id))
    resume = result.scalar_one_or_none()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")
    return resume


@router.patch("/{resume_id}", response_model=ResumeOut)
async def update_resume(
    resume_id: uuid.UUID, payload: ResumeUpdate, db: AsyncSession = Depends(get_db)
):
    """Update resume metadata (title, template, finalization flag)."""
    result = await db.execute(select(Resume).where(Resume.id == resume_id))
    resume = result.scalar_one_or_none()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(resume, field, value)

    await db.flush()
    await db.refresh(resume)
    return resume


@router.post("/compile")
async def compile_resume(payload: CompilePayload):
    """AI-compile all approved aspect summaries into a master resume.
    
    This endpoint is stateless — it takes the payload, calls the AI service,
    and returns the compiled master summary without touching the database.
    """
    try:
        master_summary = await ai_service.compile_master_resume(payload.model_dump())
        return {"master_summary": master_summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compile resume: {str(e)}")



@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(resume_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Delete a resume and all its aspects (cascade)."""
    result = await db.execute(select(Resume).where(Resume.id == resume_id))
    resume = result.scalar_one_or_none()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")
    await db.delete(resume)
