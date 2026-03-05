"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useResumeStore } from "@/store/useResumeStore";
import { resumeApi } from "@/lib/api";

export default function ReviewStep() {
    const store = useResumeStore();
    const router = useRouter();
    const [isCompiling, setIsCompiling] = useState(false);
    const [compileResult, setCompileResult] = useState<string | null>(null);
    const [compileError, setCompileError] = useState<string | null>(null);

    const handleCompile = async () => {
        setIsCompiling(true);
        setCompileError(null);

        const personalInfoStr = [
            store.personalInfo.full_name,
            store.personalInfo.email,
            store.personalInfo.phone,
            store.personalInfo.location,
            store.personalInfo.linkedin_url,
            store.personalInfo.portfolio_url
        ].filter(Boolean).join(" | ");

        const payload = {
            personal_info: personalInfoStr ? [personalInfoStr] : [],
            education: store.education.filter(e => e.is_approved).map(e => e.ai_summary),
            experience: store.experience.filter(e => e.is_approved).map(e => e.ai_summary),
            projects: store.projects.filter(e => e.is_approved).map(e => e.ai_summary),
            skills: store.skills.map(e => `${e.raw_data.category || 'Skill'}: ${e.raw_data.items || ''}`),
            achievements: store.achievements.filter(e => e.is_approved).map(e => e.ai_summary),
        };

        const resumeId = store.resumeId || "00000000-0000-0000-0000-000000000001";

        try {
            const res = await resumeApi.compile(payload);
            const summary = res.master_summary || "Resume compiled successfully.";
            setCompileResult(summary);
            // Save to Zustand so PreviewPage can access it
            store.setMasterSummary(summary);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Failed to compile the resume.";
            setCompileError(msg);
        } finally {
            setIsCompiling(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="glass rounded-2xl p-8 border border-[var(--color-border)]">
                <h2 className="text-2xl font-bold mb-6 text-white text-center">Ready to Compile</h2>

                <div className="space-y-4 text-[var(--color-text)] mb-8">
                    <p className="text-center text-[var(--color-text-muted)]">
                        You have added the following to your resume profile:
                    </p>
                    <ul className="max-w-md mx-auto space-y-3">
                        <li className="flex justify-between border-b border-[var(--color-border)] pb-2">
                            <span>Personal Info</span>
                            <span className="font-semibold text-white">{store.personalInfo.full_name ? "1 item" : "None"}</span>
                        </li>
                        <li className="flex justify-between border-b border-[var(--color-border)] pb-2">
                            <span>Education</span>
                            <span className="font-semibold text-white">{store.education.filter(e => e.is_approved).length} approved</span>
                        </li>
                        <li className="flex justify-between border-b border-[var(--color-border)] pb-2">
                            <span>Experience</span>
                            <span className="font-semibold text-white">{store.experience.filter(e => e.is_approved).length} approved</span>
                        </li>
                        <li className="flex justify-between border-b border-[var(--color-border)] pb-2">
                            <span>Projects</span>
                            <span className="font-semibold text-white">{store.projects.filter(e => e.is_approved).length} approved</span>
                        </li>
                        <li className="flex justify-between border-b border-[var(--color-border)] pb-2">
                            <span>Skills</span>
                            <span className="font-semibold text-white">{store.skills.length} categories</span>
                        </li>
                        <li className="flex justify-between border-b border-[var(--color-border)] pb-2">
                            <span>Achievements</span>
                            <span className="font-semibold text-white">{store.achievements.filter(e => e.is_approved).length} approved</span>
                        </li>
                    </ul>
                </div>

                {compileError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg flex items-center gap-2 mb-6 max-w-xl mx-auto">
                        <span className="text-xl">⚠️</span>
                        <p className="font-medium text-sm">{compileError}</p>
                    </div>
                )}

                {!compileResult ? (
                    <div className="text-center">
                        <button
                            onClick={handleCompile}
                            disabled={isCompiling}
                            className="bg-white text-black hover:bg-gray-200 transition-colors px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            {isCompiling ? (
                                <>
                                    <div className="w-5 h-5 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                                    <span>Compiling Master Resume...</span>
                                </>
                            ) : (
                                <><span>🚀</span> Compile Master Resume</>
                            )}
                        </button>
                        <p className="mt-4 text-xs text-[var(--color-text-muted)]">
                            Our AI will combine all your approved inputs into a single, cohesive professional profile.
                        </p>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center mb-6">
                            <h3 className="text-green-400 font-bold text-xl mb-2 flex items-center justify-center gap-2">
                                <span>✅</span> Compilation Successful!
                            </h3>
                            <p className="text-[var(--color-text-muted)]">
                                Your AI master resume is ready. Choose a template and export it as a PDF.
                            </p>
                        </div>

                        {/* CTA — go to preview */}
                        <div className="text-center space-y-3">
                            <button
                                onClick={() => router.push("/preview")}
                                className="gradient-primary glow-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg text-white hover:brightness-110 transition-all"
                            >
                                <span>🎨</span> Preview & Export as PDF
                            </button>
                            <p className="text-xs text-[var(--color-text-muted)]">Pick a theme, then download your ATS-friendly resume.</p>
                        </div>

                        {/* Compact preview of compiled text */}
                        <div className="bg-[#1a1a1a] rounded-xl border border-[var(--color-border)] p-5 mt-6 max-h-52 overflow-y-auto">
                            <h4 className="text-xs uppercase tracking-widest text-[#2bbed8] font-bold mb-3">AI Professional Summary:</h4>
                            <p className="text-sm leading-relaxed text-[var(--color-text-muted)] whitespace-pre-wrap">{compileResult}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
