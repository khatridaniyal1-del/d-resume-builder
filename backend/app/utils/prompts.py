"""AI prompt templates for resume summarization and compilation."""

# ── Aspect Summarization ─────────────────────────────────────
ASPECT_SUMMARIZE_PROMPT = """You are an expert resume writer. Given the following raw data
for a "{aspect_type}" section of a resume, generate a polished, professional summary
written in concise bullet points. Use strong action verbs and quantify achievements
where possible. Keep the tone confident and professional.

Raw data:
{raw_data}

Return ONLY the polished bullet points, no additional commentary."""


# ── Master Resume Compilation ────────────────────────────────
MASTER_COMPILE_PROMPT = """You are an expert resume writer. Based on the candidate data below,
write a concise Professional Summary for the top of their resume.

RULES:
- Write EXACTLY 3-4 sentences.
- Highlight their core technical skills, years-equivalent experience, and strongest achievements.
- Use confident, third-person professional tone (do NOT use "I").
- Do NOT include headers, bullet points, markdown, or any formatting.
- Do NOT include conversational filler like "Here is..." or "Based on the data...".
- Return ONLY the plain-text paragraph. Nothing else.

Candidate data:
{section_summaries}"""


# ── Bullet Enhancement ───────────────────────────────────────
ENHANCE_BULLET_PROMPT = """You are an expert resume writer. Rewrite the following resume
bullet point to be more impactful. Instruction: {instruction}

Original: {bullet}

Return ONLY the rewritten bullet point."""


# ── JD Tailoring ─────────────────────────────────────────────
JD_TAILOR_PROMPT = """You are a career coach. Analyze the following resume against the
target job description. Identify missing keywords, suggest specific rewrites for
bullet points to better align with the role, and highlight strengths that match.

Resume:
{resume_text}

Job Description:
{job_description}

Provide your analysis in a structured format with sections:
1. Keyword Gaps
2. Suggested Rewrites
3. Matching Strengths"""


# ── Cover Letter ─────────────────────────────────────────────
COVER_LETTER_PROMPT = """You are an expert career writer. Using the candidate's resume
and the target job posting below, write a compelling, personalized cover letter.
Keep it under 400 words, professional yet genuine.

Resume:
{resume_text}

Job Posting:
{job_posting}"""


# ── ATS Score ────────────────────────────────────────────────
ATS_SCORE_PROMPT = """You are an ATS (Applicant Tracking System) expert. Score the
following resume on these criteria (0-100 each):
1. Readability
2. Keyword Density
3. Formatting & Structure

Provide an overall score and specific improvement suggestions.

Resume:
{resume_text}"""
