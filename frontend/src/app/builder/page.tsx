"use client";

import { useResumeStore } from "@/store/useResumeStore";
import { STEP_LABELS, WIZARD_STEPS } from "@/types/resume";
import PersonalInfoStep from "@/components/wizard/PersonalInfoStep";
import EducationStep from "@/components/wizard/EducationStep";
import ProjectsStep from "@/components/wizard/ProjectsStep";
import SkillsStep from "@/components/wizard/SkillsStep";
import ReviewStep from "@/components/wizard/ReviewStep";
import AchievementsStep from "@/components/wizard/AchievementsStep";
import ExperienceStep from "@/components/wizard/ExperienceStep";

export default function BuilderPage() {
    const currentStep = useResumeStore((s) => s.currentStep);
    const nextStep = useResumeStore((s) => s.nextStep);
    const prevStep = useResumeStore((s) => s.prevStep);
    const isAiLoading = useResumeStore((s) => s.isAiLoading);

    const currentIndex = WIZARD_STEPS.indexOf(currentStep);
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === WIZARD_STEPS.length - 1;

    return (
        <div>
            {/* Page header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{STEP_LABELS[currentStep]}</h1>
                <p className="text-[var(--color-text-muted)] text-base">
                    {currentStep === "review"
                        ? "Review all sections and compile your master resume."
                        : currentStep === "experience"
                            ? "Add your work experience. The AI will craft polished bullet points from your description."
                            : currentStep === "personal_info"
                                ? "Start with your basic contact information."
                                : currentStep === "education"
                                    ? "Add your educational background and qualifications."
                                    : currentStep === "projects"
                                        ? "Highlight your key projects and technical work."
                                        : currentStep === "skills"
                                            ? "List your technical and professional skills."
                                            : currentStep === "achievements"
                                                ? "Showcase your awards, certifications, and accomplishments."
                                                : "Fill in the details below and let AI craft the perfect summary."}
                </p>
            </div>

            {/* Step content */}
            <div className="mb-8">
                {currentStep === "personal_info" && <PersonalInfoStep />}
                {currentStep === "education" && <EducationStep />}
                {currentStep === "experience" && <ExperienceStep />}
                {currentStep === "projects" && <ProjectsStep />}
                {currentStep === "skills" && <SkillsStep />}

                {currentStep === "achievements" && <AchievementsStep />}

                {currentStep === "review" && <ReviewStep />}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center w-full mt-8 pt-6 border-t border-gray-700/50">
                <button
                    onClick={prevStep}
                    disabled={isFirst}
                    className={`
            glass rounded-xl px-6 py-3 font-medium text-sm
            border-none cursor-pointer font-[inherit]
            transition-all duration-200
            ${isFirst
                            ? "opacity-30 cursor-not-allowed"
                            : "hover:bg-[var(--color-surface-elevated)] text-[var(--color-text)]"
                        }
          `}
                >
                    ← Previous
                </button>

                <span className="text-xs text-[var(--color-text-muted)]">
                    {currentIndex + 1} / {WIZARD_STEPS.length}
                </span>

                <button
                    onClick={nextStep}
                    disabled={isAiLoading || isLast}
                    className={`
            gradient-primary rounded-xl px-6 py-3 font-semibold text-sm
            text-white border-none cursor-pointer font-[inherit]
            transition-all duration-200
            ${isAiLoading || isLast
                            ? "opacity-40 cursor-not-allowed"
                            : "glow-primary hover:brightness-110"
                        }
          `}
                >
                    {currentStep === "achievements"
                        ? "Review & Compile →"
                        : "Next Step →"}
                </button>
            </div>
        </div>
    );
}
