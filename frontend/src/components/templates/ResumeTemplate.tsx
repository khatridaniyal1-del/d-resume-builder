import React from "react";

/* ═══════════════════════════════════════════════════════════════
   TYPE DEFINITIONS
   ═══════════════════════════════════════════════════════════════ */

export interface ResumeData {
    personalInfo: {
        full_name: string;
        email: string;
        phone: string;
        location: string;
        linkedin_url: string;
        portfolio_url: string;
    };
    masterSummary: string;
    experience: { ai_summary: string; raw_data: Record<string, string>; is_approved: boolean }[];
    education: { ai_summary: string; raw_data: Record<string, string>; is_approved: boolean }[];
    projects: { ai_summary: string; raw_data: Record<string, string>; is_approved: boolean }[];
    skills: { raw_data: Record<string, string> }[];
    achievements: { ai_summary: string; raw_data: Record<string, string>; is_approved: boolean }[];
}

interface Props {
    data: ResumeData;
}

function SectionHeader({ title }: { title: string }) {
    return (
        <div className="mb-4">
            <h2 className="text-[16px] font-bold text-gray-900 pb-[3px] border-b-[2px] border-gray-800 uppercase tracking-widest">
                {title}
            </h2>
        </div>
    );
}

/* ── Bullet list from AI summary text ─────────────────────── */
function BulletList({ text }: { text: string }) {
    if (!text) return null;
    const lines = text.split("\n").filter((l) => l.trim());
    return (
        <ul className="list-disc ml-5 mt-1.5 space-y-1">
            {lines.map((line, i) => (
                <li key={i} className="text-[13px] leading-[1.55] text-gray-800">
                    {line.replace(/^[-•▸*]\s*/, "")}
                </li>
            ))}
        </ul>
    );
}

/* ═══════════════════════════════════════════════════════════════
   THE RESUME TEMPLATE — pixel-matched to reference PDF
   ═══════════════════════════════════════════════════════════════ */
const ResumeTemplate = React.forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
    const { personalInfo: p, masterSummary, experience, education, projects, skills, achievements } = data;

    const approvedExp = experience.filter((e) => e.is_approved && e.ai_summary);
    const approvedEdu = education.filter((e) => e.is_approved && e.ai_summary);
    const approvedProj = projects.filter((e) => e.is_approved && e.ai_summary);
    const approvedAch = achievements.filter((e) => e.is_approved && e.ai_summary);

    /* Contact row items */
    const contactParts = [p.phone, p.email, p.linkedin_url, p.portfolio_url, p.location].filter(Boolean);

    return (
        <div
            ref={ref}
            className="bg-white text-gray-900 w-full max-w-[8.5in] min-h-[11in] mx-auto p-[0.75in] print:p-0 print:shadow-none shadow-xl flex flex-col gap-7 box-border"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: "13px", lineHeight: 1.45 }}
        >
            {/* ────────────────────────────────────────────────
                HEADER — Name + Contact Info (centered)
                ──────────────────────────────────────────────── */}
            <header className="text-center">
                <h1 className="text-[28px] font-extrabold tracking-wide text-gray-900 mb-2">
                    {p.full_name || "Your Name"}
                </h1>
                {contactParts.length > 0 && (
                    <div className="flex flex-wrap justify-center items-center gap-4 text-[12px] text-gray-600 mt-1">
                        {contactParts.map((part, i) => (
                            <span key={i} className="flex items-center gap-4">
                                {i > 0 && <span className="text-gray-400">•</span>}
                                <span>{part}</span>
                            </span>
                        ))}
                    </div>
                )}
            </header>

            {/* ────────────────────────────────────────────────
                PROFESSIONAL SUMMARY
                ──────────────────────────────────────────────── */}
            {masterSummary && (
                <section>
                    <SectionHeader title="Professional Summary" />
                    <p className="text-[13px] leading-[1.65] text-gray-800 text-justify italic pl-1">
                        {masterSummary}
                    </p>
                </section>
            )}

            {/* ────────────────────────────────────────────────
                EDUCATION
                ──────────────────────────────────────────────── */}
            {approvedEdu.length > 0 && (
                <section className="mb-1">
                    <SectionHeader title="Education" />
                    <div className="space-y-3 pl-1">
                        {approvedEdu.map((edu, i) => (
                            <div key={i}>
                                <p className="text-[14px] font-bold text-gray-900">{edu.raw_data.institution}</p>
                                <p className="text-[13px] text-gray-700">
                                    {edu.raw_data.degree}
                                    {edu.raw_data.field_of_study ? ` in ${edu.raw_data.field_of_study}` : ""}
                                </p>
                                {(edu.raw_data.start_date || edu.raw_data.end_date) && (
                                    <p className="text-[12px] text-gray-500">
                                        {edu.raw_data.start_date}
                                        {edu.raw_data.end_date ? ` – ${edu.raw_data.end_date}` : " – Present"}
                                    </p>
                                )}
                                <BulletList text={edu.ai_summary} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ────────────────────────────────────────────────
                EXPERIENCE
                ──────────────────────────────────────────────── */}
            {approvedExp.length > 0 && (
                <section className="mb-1">
                    <SectionHeader title="Experience" />
                    <div className="space-y-4 pl-1">
                        {approvedExp.map((exp, i) => (
                            <div key={i}>
                                <p className="text-[14px] font-bold text-gray-900">
                                    {exp.raw_data.company}
                                </p>
                                <p className="text-[13px] text-gray-700">{exp.raw_data.job_title}</p>
                                <p className="text-[12px] text-gray-500">
                                    {exp.raw_data.start_date}
                                    {" – "}
                                    {exp.raw_data.is_current === "true" ? "Present" : exp.raw_data.end_date}
                                </p>
                                <BulletList text={exp.ai_summary} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ────────────────────────────────────────────────
                PROJECTS
                ──────────────────────────────────────────────── */}
            {approvedProj.length > 0 && (
                <section className="mb-1">
                    <SectionHeader title="Projects" />
                    <div className="space-y-4 pl-1">
                        {approvedProj.map((proj, i) => (
                            <div key={i}>
                                <p className="text-[14px]">
                                    <span className="font-bold text-gray-900">{proj.raw_data.name}</span>
                                    {proj.raw_data.tech_stack && (
                                        <>
                                            <span className="text-gray-500 mx-1.5">|</span>
                                            <span className="italic text-gray-600 text-[13px]">
                                                {proj.raw_data.tech_stack}
                                            </span>
                                        </>
                                    )}
                                </p>
                                <BulletList text={proj.ai_summary} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ────────────────────────────────────────────────
                AWARDS / CERTIFICATIONS
                ──────────────────────────────────────────────── */}
            {approvedAch.length > 0 && (
                <section className="mb-1">
                    <SectionHeader title="Certifications" />
                    <div className="space-y-3 pl-1">
                        {approvedAch.map((ach, i) => (
                            <div key={i}>
                                <p className="text-[14px] font-bold text-gray-900">{ach.raw_data.title}</p>
                                {ach.raw_data.issuer && (
                                    <p className="text-[13px] text-gray-600">{ach.raw_data.issuer}</p>
                                )}
                                <BulletList text={ach.ai_summary} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ────────────────────────────────────────────────
                SKILLS
                ──────────────────────────────────────────────── */}
            {skills.length > 0 && (
                <section className="mb-1">
                    <SectionHeader title="Skills" />
                    <div className="space-y-1.5 pl-1">
                        {skills.map((skill, i) => (
                            <p key={i} className="text-[13px] text-gray-800 leading-relaxed">
                                <span className="font-bold">{skill.raw_data.category}:</span>{" "}
                                {skill.raw_data.items}
                            </p>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
});

ResumeTemplate.displayName = "ResumeTemplate";
export default ResumeTemplate;
