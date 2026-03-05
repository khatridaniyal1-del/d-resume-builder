"use client";

import { WIZARD_STEPS, STEP_LABELS, type WizardStep } from "@/types/resume";
import { useResumeStore } from "@/store/useResumeStore";

const STEP_ICONS: Record<WizardStep, string> = {
    personal_info: "👤",
    education: "🎓",
    experience: "💼",
    projects: "🚀",
    skills: "⚡",
    achievements: "🏆",
    review: "✅",
};

export default function BuilderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const currentStep = useResumeStore((s) => s.currentStep);
    const setStep = useResumeStore((s) => s.setStep);
    const currentIndex = WIZARD_STEPS.indexOf(currentStep);
    const progress = ((currentIndex + 1) / WIZARD_STEPS.length) * 100;

    return (
        <div className="min-h-screen flex bg-[var(--color-bg)]">
            {/* ── Sidebar ────────────────────────────────────────── */}
            <aside className="w-[300px] border-r border-[var(--color-border)] flex flex-col glass sticky top-0 h-screen">
                {/* Logo */}
                <div className="px-6 pt-7 pb-2">
                    <a href="/" className="flex items-center gap-2 no-underline">
                        <span className="text-2xl">✨</span>
                        <span className="text-lg font-bold gradient-text">
                            Resume Wizard
                        </span>
                    </a>
                </div>

                {/* Progress bar */}
                <div className="px-6 py-4">
                    <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-[var(--color-text-muted)]">Progress</span>
                        <span className="text-[var(--color-primary-light)] font-semibold">
                            {Math.round(progress)}%
                        </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--color-surface-elevated)] overflow-hidden">
                        <div
                            className="h-full rounded-full gradient-primary transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Step list */}
                <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                    {WIZARD_STEPS.map((step, idx) => {
                        const isActive = step === currentStep;
                        const isComplete = idx < currentIndex;

                        return (
                            <button
                                key={step}
                                onClick={() => setStep(step)}
                                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  text-left text-sm font-medium
                  transition-all duration-200 ease-out
                  border-none cursor-pointer font-[inherit]
                  ${isActive
                                        ? "bg-[rgba(108,92,231,0.15)] text-[var(--color-primary-light)] shadow-[inset_0_0_0_1px_rgba(108,92,231,0.3)]"
                                        : isComplete
                                            ? "text-[var(--color-success)] hover:bg-[rgba(0,184,148,0.08)]"
                                            : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)]"
                                    }
                `}
                            >
                                {/* Step indicator */}
                                <span
                                    className={`
                    w-8 h-8 rounded-lg flex items-center justify-center
                    text-xs font-bold shrink-0
                    transition-all duration-200
                    ${isActive
                                            ? "bg-[var(--color-primary)] text-white shadow-[0_0_12px_rgba(108,92,231,0.4)]"
                                            : isComplete
                                                ? "bg-[var(--color-success)] text-white"
                                                : "bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]"
                                        }
                  `}
                                >
                                    {isComplete ? "✓" : STEP_ICONS[step]}
                                </span>

                                {/* Label */}
                                <div className="flex flex-col">
                                    <span>{STEP_LABELS[step]}</span>
                                    {isActive && (
                                        <span className="text-[10px] text-[var(--color-text-muted)] font-normal mt-0.5">
                                            Step {idx + 1} of {WIZARD_STEPS.length}
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-[var(--color-border)]">
                    <p className="text-xs text-[var(--color-text-muted)]">
                        💡 Your progress is saved automatically
                    </p>
                </div>
            </aside>

            {/* ── Main content ───────────────────────────────────── */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-8 py-10">{children}</div>
            </main>
        </div>
    );
}
