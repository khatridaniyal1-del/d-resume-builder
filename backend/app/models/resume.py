"""Resume ORM model."""

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Resume(Base):
    """A single resume belonging to a user, composed of modular aspects."""

    __tablename__ = "resumes"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(
        String(255), nullable=False, default="Untitled Resume"
    )
    master_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    template_id: Mapped[str] = mapped_column(
        String(50), nullable=False, default="classic"
    )
    is_finalized: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # ── Relationships ─────────────────────────────────────────
    user: Mapped["User"] = relationship("User", back_populates="resumes")

    personal_info: Mapped[list["PersonalInfo"]] = relationship(
        "PersonalInfo", back_populates="resume", cascade="all, delete-orphan", lazy="selectin"
    )
    education: Mapped[list["Education"]] = relationship(
        "Education", back_populates="resume", cascade="all, delete-orphan", lazy="selectin"
    )
    experience: Mapped[list["Experience"]] = relationship(
        "Experience", back_populates="resume", cascade="all, delete-orphan", lazy="selectin"
    )
    projects: Mapped[list["Project"]] = relationship(
        "Project", back_populates="resume", cascade="all, delete-orphan", lazy="selectin"
    )
    skills: Mapped[list["Skill"]] = relationship(
        "Skill", back_populates="resume", cascade="all, delete-orphan", lazy="selectin"
    )
    achievements: Mapped[list["Achievement"]] = relationship(
        "Achievement", back_populates="resume", cascade="all, delete-orphan", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<Resume '{self.title}' user={self.user_id}>"
