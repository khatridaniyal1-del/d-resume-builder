"use client";

import { useResumeStore } from "@/store/useResumeStore";

export default function SkillsStep() {
    const skills = useResumeStore((s) => s.skills);
    const addEntry = useResumeStore((s) => s.addEntry);
    const updateEntryRawData = useResumeStore((s) => s.updateEntryRawData);
    const removeEntry = useResumeStore((s) => s.removeEntry);

    const handleAdd = () => {
        addEntry("skills", {
            category: "",
            items: "",
        });
    };

    const handleChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        updateEntryRawData("skills", index, { [name]: value });
    };

    return (
        <div className="space-y-8">
            {skills.length === 0 ? (
                <div className="text-center py-10">
                    <button
                        onClick={handleAdd}
                        className="gradient-primary rounded-xl px-6 py-3 font-semibold text-white border-none cursor-pointer hover:brightness-110 transition-all glow-primary"
                    >
                        + Add Skill Category
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {skills.map((entry, index) => (
                        <div key={index} className="glass rounded-2xl overflow-hidden border border-[var(--color-border)]">
                            <div className="bg-[var(--color-surface-elevated)] p-4 flex justify-between items-center border-b border-[var(--color-border)]">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <span className="bg-[var(--color-primary)] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                                        {index + 1}
                                    </span>
                                    {entry.raw_data.category || "New Category"}
                                </h3>
                                <button
                                    onClick={() => removeEntry("skills", index)}
                                    className="text-[var(--color-text-muted)] hover:text-red-400 transition-colors text-sm font-medium focus:outline-none"
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Skill Category</label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={entry.raw_data.category || ""}
                                        onChange={(e) => handleChange(index, e)}
                                        placeholder="e.g., Languages, Frameworks, Cloud"
                                        className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2 outline-none focus:border-white transition-colors"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Skills (Comma Separated)</label>
                                    <textarea
                                        name="items"
                                        value={entry.raw_data.items || ""}
                                        onChange={(e) => handleChange(index, e)}
                                        placeholder="JavaScript, Python, TypeScript, SQL..."
                                        rows={2}
                                        className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-3 outline-none focus:border-white transition-colors resize-y"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={handleAdd}
                        className="w-full py-4 border-2 border-dashed border-[var(--color-border)] rounded-2xl text-[var(--color-text-muted)] hover:text-white hover:border-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] transition-all flex items-center justify-center gap-2 font-medium focus:outline-none"
                    >
                        <span>+</span> Add Another Category
                    </button>
                </div>
            )}
        </div>
    );
}
