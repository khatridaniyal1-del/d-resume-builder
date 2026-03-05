"use client";

import { useResumeStore } from "@/store/useResumeStore";

export default function ProjectsStep() {
    const projects = useResumeStore((s) => s.projects);
    const addEntry = useResumeStore((s) => s.addEntry);
    const updateEntryRawData = useResumeStore((s) => s.updateEntryRawData);
    const removeEntry = useResumeStore((s) => s.removeEntry);
    const generateSummary = useResumeStore((s) => s.generateSummary);
    const approveEntry = useResumeStore((s) => s.approveEntry);
    const isAiLoading = useResumeStore((s) => s.isAiLoading);
    const aiError = useResumeStore((s) => s.aiError);
    const clearAiError = useResumeStore((s) => s.clearAiError);

    const handleAdd = () => {
        addEntry("projects", {
            name: "",
            tech_stack: "",
            url: "",
            raw_description: "",
        });
    };

    const handleChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        updateEntryRawData("projects", index, { [name]: value });
    };

    const handleGenerate = (index: number) => {
        generateSummary("projects", index, "project");
    };

    return (
        <div className="space-y-8">
            {aiError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">⚠️</span>
                        <p className="font-medium text-sm">{aiError}</p>
                    </div>
                    <button onClick={clearAiError} className="hover:opacity-70 transition-opacity">
                        ✕
                    </button>
                </div>
            )}

            {projects.length === 0 ? (
                <div className="text-center py-10">
                    <button
                        onClick={handleAdd}
                        className="gradient-primary rounded-xl px-6 py-3 font-semibold text-white border-none cursor-pointer hover:brightness-110 transition-all glow-primary"
                    >
                        + Add Project
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {projects.map((entry, index) => (
                        <div key={index} className="glass rounded-2xl overflow-hidden border border-[var(--color-border)]">
                            <div className="bg-[var(--color-surface-elevated)] p-4 flex justify-between items-center border-b border-[var(--color-border)]">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <span className="bg-[var(--color-primary)] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                                        {index + 1}
                                    </span>
                                    {entry.raw_data.name || "New Project"}
                                </h3>
                                <button
                                    onClick={() => removeEntry("projects", index)}
                                    className="text-[var(--color-text-muted)] hover:text-red-400 transition-colors text-sm font-medium focus:outline-none"
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Project Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={entry.raw_data.name || ""}
                                            onChange={(e) => handleChange(index, e)}
                                            placeholder="AI Resume Builder"
                                            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2 outline-none focus:border-white transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Tech Stack (comma-separated)</label>
                                        <input
                                            type="text"
                                            name="tech_stack"
                                            value={entry.raw_data.tech_stack || ""}
                                            onChange={(e) => handleChange(index, e)}
                                            placeholder="React, Next.js, Python, PostgreSQL"
                                            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2 outline-none focus:border-white transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Project Link / URL (Optional)</label>
                                    <input
                                        type="url"
                                        name="url"
                                        value={entry.raw_data.url || ""}
                                        onChange={(e) => handleChange(index, e)}
                                        placeholder="https://github.com/janedoe/project"
                                        className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2 outline-none focus:border-white transition-colors"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">What did you build? (Raw Description)</label>
                                    <textarea
                                        name="raw_description"
                                        value={entry.raw_data.raw_description || ""}
                                        onChange={(e) => handleChange(index, e)}
                                        placeholder="Developed a platform that allowed users to generate AI resumes. Handled all backend architecture..."
                                        rows={4}
                                        className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-3 outline-none focus:border-white transition-colors resize-y"
                                    />
                                </div>

                                {!entry.is_approved && !entry.ai_summary && (
                                    <button
                                        onClick={() => handleGenerate(index)}
                                        disabled={isAiLoading}
                                        className="w-full gradient-primary rounded-full py-3 font-semibold text-white group flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-primary"
                                    >
                                        {isAiLoading ? (
                                            <>
                                                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                                <span>AI is thinking...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>✨</span> Generate AI Summary
                                            </>
                                        )}
                                    </button>
                                )}

                                {entry.ai_summary && (
                                    <div className="mt-6 rounded-xl overflow-hidden border border-[#2bbed8]/30 bg-[#2bbed8]/5">
                                        <div className="bg-[#2bbed8]/10 px-4 py-2 border-b border-[#2bbed8]/20 flex justify-between items-center">
                                            <span className="text-sm font-semibold flex items-center gap-2 text-[#2bbed8]">
                                                🤖 AI-Generated Summary
                                            </span>
                                            <button
                                                onClick={() => approveEntry("projects", index)}
                                                className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${entry.is_approved
                                                    ? "bg-green-500/20 text-green-400"
                                                    : "bg-[#2bbed8]/20 text-[#2bbed8] hover:bg-[#2bbed8]/30"
                                                    }`}
                                            >
                                                {entry.is_approved ? "✓ Approved" : "Approve"}
                                            </button>
                                        </div>
                                        <div className="p-4 relative">
                                            <div className="space-y-2 text-[var(--color-text)]">
                                                {entry.ai_summary.split('\n').map((line, i) => (
                                                    line.trim() ? <p key={i}>{line}</p> : null
                                                ))}
                                            </div>
                                            {!entry.is_approved && (
                                                <div className="absolute bottom-2 right-2">
                                                    <button
                                                        onClick={() => handleGenerate(index)}
                                                        disabled={isAiLoading}
                                                        className="text-xs bg-[var(--color-surface-elevated)] border border-[var(--color-border)] px-3 py-1.5 rounded-md hover:border-white transition-colors disabled:opacity-50 flex items-center gap-1"
                                                    >
                                                        <span>✨</span> Regenerate AI Summary
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={handleAdd}
                        className="w-full py-4 border-2 border-dashed border-[var(--color-border)] rounded-2xl text-[var(--color-text-muted)] hover:text-white hover:border-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] transition-all flex items-center justify-center gap-2 font-medium focus:outline-none"
                    >
                        <span>+</span> Add Another Project
                    </button>
                </div>
            )}
        </div>
    );
}
