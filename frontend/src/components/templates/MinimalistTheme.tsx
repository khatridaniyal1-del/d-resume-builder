import React from "react";

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mb-6 print:mb-5">
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 border-b border-slate-200 pb-1 mb-3">
                {title}
            </h2>
            {children}
        </section>
    );
}

function BulletLines({ text }: { text: string }) {
    if (!text) return null;
    return (
        <ul className="space-y-1 mt-1">
            {text.split("\n").filter(l => l.trim()).map((line, i) => (
                <li key={i} className="text-sm text-slate-700 leading-relaxed pl-3 border-l-2 border-slate-200">
                    {line.replace(/^[-•]\s*/, "")}
                </li>
            ))}
        </ul>
    );
}

const MinimalistTheme = React.forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
    const { personalInfo, masterSummary, experience, education, projects, skills, achievements } = data;

    return (
        <div
            ref={ref}
            className="bg-white text-slate-800 font-sans min-h-[297mm] w-full max-w-[210mm] mx-auto px-12 py-10 print:px-10 print:py-8 print:shadow-none shadow-2xl"
            style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}
        >
            {/* Header */}
            <header className="mb-7 pb-5 border-b-2 border-slate-800">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                    {personalInfo.full_name || "Your Name"}
                </h1>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-500">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>· {personalInfo.phone}</span>}
                    {personalInfo.location && <span>· {personalInfo.location}</span>}
                    {personalInfo.linkedin_url && (
                        <span>· <span className="text-blue-600">{personalInfo.linkedin_url}</span></span>
                    )}
                    {personalInfo.portfolio_url && (
                        <span>· <span className="text-blue-600">{personalInfo.portfolio_url}</span></span>
                    )}
                </div>
            </header>

            {/* Professional Summary */}
            {masterSummary && (
                <Section title="Professional Summary">
                    <p className="text-sm text-slate-700 leading-relaxed">{masterSummary}</p>
                </Section>
            )}

            {/* Experience */}
            {experience.some(e => e.is_approved && e.ai_summary) && (
                <Section title="Work Experience">
                    <div className="space-y-4">
                        {experience.filter(e => e.is_approved && e.ai_summary).map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <div>
                                        <span className="font-semibold text-sm text-slate-900">{exp.raw_data.job_title}</span>
                                        <span className="text-slate-500 text-sm"> · {exp.raw_data.company}</span>
                                    </div>
                                    <span className="text-xs text-slate-400 whitespace-nowrap">
                                        {exp.raw_data.start_date} – {exp.raw_data.is_current === "true" ? "Present" : exp.raw_data.end_date}
                                    </span>
                                </div>
                                <BulletLines text={exp.ai_summary} />
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Education */}
            {education.some(e => e.is_approved && e.ai_summary) && (
                <Section title="Education">
                    <div className="space-y-3">
                        {education.filter(e => e.is_approved && e.ai_summary).map((edu, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <div>
                                        <span className="font-semibold text-sm text-slate-900">{edu.raw_data.degree} in {edu.raw_data.field_of_study}</span>
                                        <span className="text-slate-500 text-sm"> · {edu.raw_data.institution}</span>
                                    </div>
                                    <span className="text-xs text-slate-400">{edu.raw_data.end_date}</span>
                                </div>
                                <BulletLines text={edu.ai_summary} />
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Projects */}
            {projects.some(p => p.is_approved && p.ai_summary) && (
                <Section title="Projects">
                    <div className="space-y-3">
                        {projects.filter(p => p.is_approved && p.ai_summary).map((proj, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <span className="font-semibold text-sm text-slate-900">{proj.raw_data.name}</span>
                                    {proj.raw_data.tech_stack && (
                                        <span className="text-xs text-slate-400">{proj.raw_data.tech_stack}</span>
                                    )}
                                </div>
                                <BulletLines text={proj.ai_summary} />
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <Section title="Skills">
                    <div className="space-y-1">
                        {skills.map((skill, i) => (
                            <div key={i} className="text-sm text-slate-700">
                                <span className="font-semibold text-slate-800">{skill.raw_data.category}: </span>
                                {skill.raw_data.items}
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Achievements */}
            {achievements.some(a => a.is_approved && a.ai_summary) && (
                <Section title="Awards & Certifications">
                    <div className="space-y-3">
                        {achievements.filter(a => a.is_approved && a.ai_summary).map((ach, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <span className="font-semibold text-sm text-slate-900">{ach.raw_data.title}</span>
                                    {ach.raw_data.issuer && (
                                        <span className="text-xs text-slate-400">{ach.raw_data.issuer}</span>
                                    )}
                                </div>
                                <BulletLines text={ach.ai_summary} />
                            </div>
                        ))}
                    </div>
                </Section>
            )}
        </div>
    );
});

MinimalistTheme.displayName = "MinimalistTheme";
export default MinimalistTheme;
