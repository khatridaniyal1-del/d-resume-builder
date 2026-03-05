"""AI service — interfaces with Groq (via OpenAI-compatible SDK) for summarization, tailoring, and scoring."""

import json
import logging

from openai import AsyncOpenAI, APIError, APITimeoutError, RateLimitError

from app.config import settings
from app.utils.prompts import (
    ASPECT_SUMMARIZE_PROMPT,
    MASTER_COMPILE_PROMPT,
    ENHANCE_BULLET_PROMPT,
    JD_TAILOR_PROMPT,
    COVER_LETTER_PROMPT,
    ATS_SCORE_PROMPT,
)

logger = logging.getLogger(__name__)

# ── Shared client (lazy-initialized) ─────────────────────────
_client: AsyncOpenAI | None = None

# Groq Llama 3.1 — blazing fast and free tier compatible
MODEL = "llama-3.1-8b-instant"
MAX_TOKENS = 1024
TEMPERATURE = 0.7


def _get_client() -> AsyncOpenAI:
    """Return a singleton AsyncOpenAI client pointed at Google Gemini."""
    global _client
    if _client is None:
        if not settings.groq_api_key:
            raise RuntimeError(
                "GROQ_API_KEY is not set. Get one free at https://console.groq.com/keys "
                "and add it to backend/.env"
            )
        _client = AsyncOpenAI(
            api_key=settings.groq_api_key,
            base_url="https://api.groq.com/openai/v1",
            timeout=30.0,
        )
    return _client


async def _chat(system_prompt: str, user_message: str = "") -> str:
    """Send a chat completion request and return the assistant's reply.

    Centralised helper with error handling for all AI calls.
    """
    client = _get_client()
    # Groq supports the standard OpenAI message format seamlessly
    messages = [{"role": "system", "content": system_prompt}]
    if user_message:
        messages.append({"role": "user", "content": user_message})

    try:
        response = await client.chat.completions.create(
            model=MODEL,
            messages=messages,
            max_tokens=MAX_TOKENS,
            temperature=TEMPERATURE,
        )
        content = response.choices[0].message.content
        return content.strip() if content else ""

    except APITimeoutError:
        logger.error("Groq API request timed out.")
        raise RuntimeError("The AI service timed out. Please try again.")
    except RateLimitError:
        logger.error("Groq API rate limit exceeded.")
        raise RuntimeError("AI rate limit reached. Please wait a moment and retry.")
    except APIError as e:
        logger.error("Groq API error: %s", e)
        raise RuntimeError(f"AI service error: {e.message}")
    except Exception as e:
        logger.exception("Unexpected error calling Groq API.")
        raise RuntimeError(f"Unexpected AI error: {str(e)}")


# ═══════════════════════════════════════════════════════════════
# Aspect Summarization (Primary wizard feature)
# ═══════════════════════════════════════════════════════════════
async def summarize_aspect(aspect_type: str, raw_data: dict) -> str:
    """Generate a polished professional summary for a single resume aspect."""
    formatted_data = "\n".join(f"- {k}: {v}" for k, v in raw_data.items() if v)
    prompt = ASPECT_SUMMARIZE_PROMPT.format(
        aspect_type=aspect_type,
        raw_data=formatted_data,
    )
    return await _chat(prompt)


# ═══════════════════════════════════════════════════════════════
# Master Resume Compilation
# ═══════════════════════════════════════════════════════════════
async def compile_master_resume(aspect_summaries: dict[str, list[str]]) -> str:
    """Compile all approved aspect summaries into a single cohesive master resume."""
    sections = []
    for section_name, summaries in aspect_summaries.items():
        header = section_name.replace("_", " ").title()
        section_text = f"## {header}\n" + "\n".join(summaries)
        sections.append(section_text)

    all_sections = "\n\n".join(sections)
    prompt = MASTER_COMPILE_PROMPT.format(section_summaries=all_sections)
    return await _chat(prompt)


# ═══════════════════════════════════════════════════════════════
# Bullet Enhancement
# ═══════════════════════════════════════════════════════════════
async def enhance_bullet(bullet: str, instruction: str = "rewrite for higher impact") -> str:
    """Rewrite a single bullet point for higher impact or metric focus."""
    prompt = ENHANCE_BULLET_PROMPT.format(instruction=instruction, bullet=bullet)
    return await _chat(prompt)


# ═══════════════════════════════════════════════════════════════
# JD Tailoring
# ═══════════════════════════════════════════════════════════════
async def tailor_to_jd(resume_text: str, job_description: str) -> str:
    """Analyze resume against a job description and suggest improvements."""
    prompt = JD_TAILOR_PROMPT.format(
        resume_text=resume_text, job_description=job_description
    )
    return await _chat(prompt)


# ═══════════════════════════════════════════════════════════════
# Grammar & Tone Checker
# ═══════════════════════════════════════════════════════════════
async def check_grammar_tone(text: str) -> dict:
    """Proofread text for grammar and tone issues."""
    prompt = (
        "You are a professional proofreader. Check the following resume text for "
        "grammar, spelling, and tone issues. Return a JSON object with keys: "
        '"issues" (list of strings describing problems) and '
        '"corrected_text" (the fixed version).\n\n'
        f"Text:\n{text}"
    )
    result = await _chat(prompt)
    try:
        return json.loads(result)
    except json.JSONDecodeError:
        return {"issues": [], "corrected_text": result}


# ═══════════════════════════════════════════════════════════════
# Cover Letter Generator
# ═══════════════════════════════════════════════════════════════
async def generate_cover_letter(resume_text: str, job_posting: str) -> str:
    """Generate a customized cover letter from resume + job posting."""
    prompt = COVER_LETTER_PROMPT.format(
        resume_text=resume_text, job_posting=job_posting
    )
    return await _chat(prompt)


# ═══════════════════════════════════════════════════════════════
# ATS Score Predictor
# ═══════════════════════════════════════════════════════════════
async def predict_ats_score(resume_text: str) -> dict:
    """Score the resume on ATS-friendliness metrics."""
    prompt = ATS_SCORE_PROMPT.format(resume_text=resume_text)
    result = await _chat(
        prompt + '\n\nReturn ONLY a JSON object with keys: '
        '"overall_score", "readability", "keyword_density", "formatting" '
        '(each 0-100), and "suggestions" (list of strings).'
    )
    try:
        return json.loads(result)
    except json.JSONDecodeError:
        return {
            "overall_score": 0,
            "readability": 0,
            "keyword_density": 0,
            "formatting": 0,
            "suggestions": [result],
        }
