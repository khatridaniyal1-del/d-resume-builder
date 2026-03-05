import React from "react";
import type { ResumeData } from "./MinimalistTheme";

interface Props {
    data: ResumeData;
}

function BulletLines({ text }: { text: string }) {
    if (!text) return null;
    return (
        <ul className="space-y-1 mt-1.5">
            {text.split("\n").filter(l => l.trim()).map((line, i) => (
                <li key={i} className="text-[13px] text-gray-700 leading-relaxed flex gap-2">
                    <span className="text-gray-400 mt-0.5 shrink-0">▸</span>
                    <span>{line.replace(/^[-•▸]\s*/, "")}</span>
                </li>
            ))}
        </ul>
    );
}

const ProfessionalTheme = React.forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
    const { personalInfo, masterSummary, experience, education, projects, skills, achievements } = data;

    return (
        <div
            ref={ref}
            className="bg-white text-gray-800 min-h-[297mm] w-full max-w-[210mm] mx-auto print:shadow-none shadow-2xl"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        >
            {/* Header — navy banner */}
            <header className="bg-slate-800 text-white px-10 py-8 print:py-6">
                <h1 className="text-3xl font-bold tracking-wide text-white">
                    {personalInfo.full_name || "Your Name"}
                </h1>
                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-sm text-slate-300" style={{ fontFamily: "Arial, sans-serif" }}>
                    {personalInfo.email && (
                        <span className="flex items-center gap-1">
                            <span className="opacity-60 text-xs">✉</span> {personalInfo.email}
                        </span>
                    )}
                    {personalInfo.phone && (
                        <span className="flex items-center gap-1">
                            <span className="opacity-60 text-xs">✆</span> {personalInfo.phone}
                        </span>
                    )}
                    {personalInfo.location && (
                        <span className="flex items-center gap-1">
                            <span className="opacity-60 text-xs">⚲</span> {personalInfo.location}
                        </span>
                    )}
                    {personalInfo.linkedin_url && (
                        <span className="flex items-center gap-1">
                            <span className="opacity-60 text-xs">in</span> {personalInfo.linkedin_url}
                        </span>
                    )}
                    {personalInfo.portfolio_url && (
                        <span className="flex items-center gap-1">
                            <span className="opacity-60 text-xs">🌐</span> {personalInfo.portfolio_url}
                        </span>
                    )}
                </div>
            </header>

            <div className="px-10 py-7 print:py-5">
                {/* Professional Summary */}
                {masterSummary && (
                    <section className="mb-6">
                        <h2 className="text-base font-bold uppercase tracking-widest text-slate-700 mb-2 border-b-2 border-slate-700 pb-1">
                            Professional Summary
                        </h2>
                        <p className="text-[13px] text-gray-700 leading-relaxed italic">{masterSummary}</p>
                    </section>
                )}

                {/* Experience */}
                {experience.some(e => e.is_approved && e.ai_summary) && (
                    <section className="mb-6">
                        <h2 className="text-base font-bold uppercase tracking-widest text-slate-700 mb-3 border-b-2 border-slate-700 pb-1">
                            Professional Experience
                        </h2>
                        <div className="space-y-4">
                            {experience.filter(e => e.is_approved && e.ai_summary).map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline">
                                        <div>
                                            <span className="font-bold text-[14px] text-gray-900">{exp.raw_data.job_title}</span>
                                            <span className="text-gray-500 text-[13px]"> · {exp.raw_data.company}</span>
                                            {exp.raw_data.location && (
                                                <span className="text-gray-400 text-xs"> · {exp.raw_data.location}</span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400 italic whitespace-nowrap">
                                            {exp.raw_data.start_date} – {exp.raw_data.is_current === "true" ? "Present" : exp.raw_data.end_date}
                                        </span>
                                    </div>
                                    <BulletLines text={exp.ai_summary} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Two-column lower section */}
                <div className="grid grid-cols-[1fr_auto] gap-8">
                    <div>
                        {/* Education */}
                        {education.some(e => e.is_approved && e.ai_summary) && (
                            <section className="mb-6">
                                <h2 className="text-base font-bold uppercase tracking-widest text-slate-700 mb-3 border-b-2 border-slate-700 pb-1">
                                    Education
                                </h2>
                                <div className="space-y-3">
                                    {education.filter(e => e.is_approved && e.ai_summary).map((edu, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-baseline">
                                                <div>
                                                    <span className="font-bold text-[14px] text-gray-900">{edu.raw_data.degree} in {edu.raw_data.field_of_study}</span>
                                                    <span className="text-gray-500 text-[13px]"> · {edu.raw_data.institution}</span>
                                                </div>
                                                <span className="text-xs text-gray-400 italic">{edu.raw_data.end_date}</span>
                                            </div>
                                            <BulletLines text={edu.ai_summary} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Projects */}
                        {projects.some(p => p.is_approved && p.ai_summary) && (
                            <section className="mb-6">
                                <h2 className="text-base font-bold uppercase tracking-widest text-slate-700 mb-3 border-b-2 border-slate-700 pb-1">
                                    Projects
                                </h2>
                                <div className="space-y-3">
                                    {projects.filter(p => p.is_approved && p.ai_summary).map((proj, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-baseline">
                                                <span className="font-bold text-[14px] text-gray-900">{proj.raw_data.name}</span>
                                                {proj.raw_data.tech_stack && (
                                                    <span className="text-xs text-gray-400 italic">{proj.raw_data.tech_stack}</span>
                                                )}
                                            </div>
                                            <BulletLines text={proj.ai_summary} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Achievements */}
                        {achievements.some(a => a.is_approved && a.ai_summary) && (
                            <section className="mb-6">
                                <h2 className="text-base font-bold uppercase tracking-widest text-slate-700 mb-3 border-b-2 border-slate-700 pb-1">
                                    Awards & Certifications
                                </h2>
                                <div className="space-y-2">
                                    {achievements.filter(a => a.is_approved && a.ai_summary).map((ach, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-baseline">
                                                <span className="font-bold text-[14px] text-gray-900">{ach.raw_data.title}</span>
                                                {ach.raw_data.issuer && (
                                                    <span className="text-xs text-gray-400 italic">{ach.raw_data.issuer}</span>
                                                )}
                                            </div>
                                            <BulletLines text={ach.ai_summary} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right sidebar — Skills */}
                    {skills.length > 0 && (
                        <div className="w-44 shrink-0">
                            <h2 className="text-base font-bold uppercase tracking-widest text-slate-700 mb-3 border-b-2 border-slate-700 pb-1 whitespace-nowrap">
                                Skills
                            </h2>
                            <div className="space-y-3">
                                {skills.map((skill, i) => (
                                    <div key={i}>
                                        <p className="font-bold text-[12px] text-gray-700 uppercase tracking-wide">{skill.raw_data.category}</p>
                                        <p className="text-[12px] text-gray-600 leading-relaxed mt-0.5">
                                            {skill.raw_data.items?.split(",").map(s => s.trim()).join(" · ")}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

ProfessionalTheme.displayName = "ProfessionalTheme";
export default ProfessionalTheme;
