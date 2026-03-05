"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";

export default function ExperienceStep() {
    const experience = useResumeStore((s) => s.experience);
    const addEntry = useResumeStore((s) => s.addEntry);
    const updateEntryRawData = useResumeStore((s) => s.updateEntryRawData);
    const removeEntry = useResumeStore((s) => s.removeEntry);
    const approveEntry = useResumeStore((s) => s.approveEntry);
    const generateSummary = useResumeStore((s) => s.generateSummary);
    const isAiLoading = useResumeStore((s) => s.isAiLoading);
    const aiError = useResumeStore((s) => s.aiError);
    const clearAiError = useResumeStore((s) => s.clearAiError);

    const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

    const handleAddExperience = () => {
        addEntry("experience", {
            company: "",
            job_title: "",
            location: "",
            start_date: "",
            end_date: "",
            is_current: "false",
            raw_description: "",
        });
    };

    const handleGenerate = async (index: number) => {
        clearAiError();
        setLoadingIndex(index);
        await generateSummary("experience", index, "experience");
        setLoadingIndex(null);
    };

    return (
        <div className="space-y-6">
            {/* Error banner */}
            {aiError && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-[rgba(255,107,107,0.1)] border border-[rgba(255,107,107,0.3)]">
                    <span className="text-lg mt-0.5">⚠️</span>
                    <div className="flex-1">
                        <p className="text-sm text-[var(--color-danger)] font-medium">
                            {aiError}
                        </p>
                    </div>
                    <button
                        onClick={clearAiError}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-lg border-none bg-transparent cursor-pointer"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Experience entries */}
            {experience.map((entry, index) => (
                <div
                    key={index}
                    className="glass rounded-2xl overflow-hidden transition-all duration-300"
                    style={{
                        boxShadow:
                            entry.ai_summary
                                ? "0 0 20px rgba(0,206,201,0.08)"
                                : "none",
                    }}
                >
                    {/* Card header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white text-sm font-bold">
                                {index + 1}
                            </span>
                            <h3 className="text-base font-semibold text-[var(--color-text)]">
                                {entry.raw_data.job_title && entry.raw_data.company
                                    ? `${entry.raw_data.job_title} @ ${entry.raw_data.company}`
                                    : `Experience ${index + 1}`}
                            </h3>
                        </div>
                        <button
                            onClick={() => removeEntry("experience", index)}
                            className="text-[var(--color-text-muted)] hover:text-[var(--color-danger)] text-sm border-none bg-transparent cursor-pointer transition-colors font-[inherit] px-2 py-1 rounded-lg hover:bg-[rgba(255,107,107,0.1)]"
                        >
                            Remove
                        </button>
                    </div>

                    {/* Form fields */}
                    <div className="px-6 py-5 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Company */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                    Company
                                </label>
                                <input
                                    type="text"
                                    value={entry.raw_data.company}
                                    onChange={(e) =>
                                        updateEntryRawData("experience", index, {
                                            company: e.target.value,
                                        })
                                    }
                                    placeholder="Google, Microsoft, etc."
                                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] text-sm font-[inherit] outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_2px_rgba(108,92,231,0.2)] transition-all placeholder:text-[var(--color-text-muted)]"
                                />
                            </div>

                            {/* Job Title */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                    Job Title
                                </label>
                                <input
                                    type="text"
                                    value={entry.raw_data.job_title}
                                    onChange={(e) =>
                                        updateEntryRawData("experience", index, {
                                            job_title: e.target.value,
                                        })
                                    }
                                    placeholder="Senior Software Engineer"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] text-sm font-[inherit] outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_2px_rgba(108,92,231,0.2)] transition-all placeholder:text-[var(--color-text-muted)]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {/* Location */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={entry.raw_data.location}
                                    onChange={(e) =>
                                        updateEntryRawData("experience", index, {
                                            location: e.target.value,
                                        })
                                    }
                                    placeholder="San Francisco, CA"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] text-sm font-[inherit] outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_2px_rgba(108,92,231,0.2)] transition-all placeholder:text-[var(--color-text-muted)]"
                                />
                            </div>

                            {/* Start Date */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                    Start Date
                                </label>
                                <input
                                    type="month"
                                    value={entry.raw_data.start_date}
                                    onChange={(e) =>
                                        updateEntryRawData("experience", index, {
                                            start_date: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] text-sm font-[inherit] outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_2px_rgba(108,92,231,0.2)] transition-all"
                                />
                            </div>

                            {/* End Date */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                    End Date
                                </label>
                                <input
                                    type="month"
                                    value={
                                        entry.raw_data.is_current === "true"
                                            ? ""
                                            : entry.raw_data.end_date
                                    }
                                    disabled={entry.raw_data.is_current === "true"}
                                    onChange={(e) =>
                                        updateEntryRawData("experience", index, {
                                            end_date: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] text-sm font-[inherit] outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_2px_rgba(108,92,231,0.2)] transition-all disabled:opacity-40"
                                />
                                <label className="flex items-center gap-2 mt-1 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={entry.raw_data.is_current === "true"}
                                        onChange={(e) =>
                                            updateEntryRawData("experience", index, {
                                                is_current: e.target.checked ? "true" : "false",
                                            })
                                        }
                                        className="rounded accent-[var(--color-primary)]"
                                    />
                                    <span className="text-xs text-[var(--color-text-muted)]">
                                        I currently work here
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Raw Description */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                What did you do? (raw description)
                            </label>
                            <textarea
                                value={entry.raw_data.raw_description}
                                onChange={(e) =>
                                    updateEntryRawData("experience", index, {
                                        raw_description: e.target.value,
                                    })
                                }
                                placeholder="Describe your responsibilities. Be rough — the AI will polish it!&#10;&#10;Example: built microservices, improved page load by 40%, led team of 5 engineers, migrated from monolith to k8s..."
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] text-sm font-[inherit] outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_2px_rgba(108,92,231,0.2)] transition-all resize-y leading-relaxed placeholder:text-[var(--color-text-muted)]"
                            />
                        </div>

                        {/* Generate AI Summary button */}
                        <button
                            onClick={() => handleGenerate(index)}
                            disabled={
                                isAiLoading ||
                                !entry.raw_data.raw_description.trim() ||
                                !entry.raw_data.company.trim() ||
                                !entry.raw_data.job_title.trim()
                            }
                            className={`
                w-full py-3 px-4 rounded-xl font-semibold text-sm
                border-none cursor-pointer font-[inherit]
                transition-all duration-200 flex items-center justify-center gap-2
                ${isAiLoading ||
                                    !entry.raw_data.raw_description.trim() ||
                                    !entry.raw_data.company.trim() ||
                                    !entry.raw_data.job_title.trim()
                                    ? "bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] cursor-not-allowed"
                                    : "gradient-primary text-white glow-primary hover:brightness-110"
                                }
              `}
                        >
                            {loadingIndex === index ? (
                                <>
                                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Generating AI Summary...
                                </>
                            ) : entry.ai_summary ? (
                                <>✨ Regenerate AI Summary</>
                            ) : (
                                <>✨ Generate AI Summary</>
                            )}
                        </button>
                    </div>

                    {/* AI Summary output */}
                    {entry.ai_summary && (
                        <div className="px-6 py-5 border-t border-[var(--color-border)] bg-[rgba(0,206,201,0.03)]">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">🤖</span>
                                    <h4 className="text-sm font-semibold text-[var(--color-accent)]">
                                        AI-Generated Summary
                                    </h4>
                                </div>
                                <button
                                    onClick={() => approveEntry("experience", index)}
                                    className={`
                    px-3 py-1.5 rounded-lg text-xs font-semibold
                    border-none cursor-pointer font-[inherit]
                    transition-all duration-200
                    ${entry.is_approved
                                            ? "bg-[var(--color-success)] text-white"
                                            : "bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] hover:bg-[rgba(0,184,148,0.2)] hover:text-[var(--color-success)]"
                                        }
                  `}
                                >
                                    {entry.is_approved ? "✓ Approved" : "Approve"}
                                </button>
                            </div>

                            <div className="bg-[var(--color-surface)] rounded-xl p-4 text-sm leading-relaxed text-[var(--color-text)] whitespace-pre-line">
                                {entry.ai_summary}
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* Add experience button */}
            <button
                onClick={handleAddExperience}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary-light)] hover:bg-[rgba(108,92,231,0.05)] transition-all duration-200 cursor-pointer font-[inherit] text-sm font-semibold bg-transparent flex items-center justify-center gap-2"
            >
                <span className="text-xl leading-none">+</span>
                Add Work Experience
            </button>

            {/* Empty state */}
            {experience.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-5xl mb-4">💼</p>
                    <p className="text-[var(--color-text-muted)] text-base mb-1">
                        No experience entries yet
                    </p>
                    <p className="text-[var(--color-text-muted)] text-sm">
                        Click the button above to add your work history
                    </p>
                </div>
            )}
        </div>
    );
}
