"""Resume service — business logic for resume operations."""


async def get_all_approved_summaries(resume) -> dict[str, list[str]]:
    """Collect all approved AI summaries from a resume's aspects.

    Returns:
        A dict mapping aspect type names to lists of approved summary strings.
    """
    summaries: dict[str, list[str]] = {}

    if resume.personal_info:
        summaries["personal_info"] = [
            p.ai_summary for p in resume.personal_info if p.ai_summary
        ]

    for aspect_name, items in [
        ("education", resume.education),
        ("experience", resume.experience),
        ("projects", resume.projects),
        ("achievements", resume.achievements),
    ]:
        approved = [
            item.ai_summary
            for item in items
            if getattr(item, "is_approved", False) and item.ai_summary
        ]
        if approved:
            summaries[aspect_name] = approved

    if resume.skills:
        summaries["skills"] = [
            f"{s.category}: {s.items}" for s in resume.skills
        ]

    return summaries
