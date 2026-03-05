/**
 * Zustand store for multi-step resume wizard state management.
 *
 * Tracks the user's progress, raw input for each aspect,
 * AI-generated summaries, and loading/error state.
 */

import { create } from "zustand";
import type { WizardStep } from "@/types/resume";
import { aspectApi, type SummarizePayload, ApiError } from "@/lib/api";

// ── Aspect data shape ────────────────────────────────────────

export interface AspectEntry {
    id?: string;
    raw_data: Record<string, string>;
    ai_summary: string;
    is_approved: boolean;
}

export interface PersonalInfoData {
    full_name: string;
    email: string;
    phone: string;
    location: string;
    linkedin_url: string;
    portfolio_url: string;
    ai_summary: string;
}

// ── Store interface ──────────────────────────────────────────

interface ResumeWizardState {
    // Navigation
    currentStep: WizardStep;
    setStep: (step: WizardStep) => void;
    nextStep: () => void;
    prevStep: () => void;

    // Resume metadata
    resumeId: string | null;
    resumeTitle: string;
    templateId: string;
    setResumeId: (id: string) => void;
    setResumeTitle: (title: string) => void;
    setTemplateId: (id: string) => void;

    // Compiled master summary
    masterSummary: string;
    setMasterSummary: (summary: string) => void;

    // Personal info (single object, no array)
    personalInfo: PersonalInfoData;
    setPersonalInfo: (data: Partial<PersonalInfoData>) => void;

    // Aspect entries (arrays of entries per type)
    education: AspectEntry[];
    experience: AspectEntry[];
    projects: AspectEntry[];
    skills: AspectEntry[];
    achievements: AspectEntry[];

    // Aspect CRUD actions
    addEntry: (aspect: AspectKey, raw_data: Record<string, string>) => void;
    updateEntryRawData: (
        aspect: AspectKey,
        index: number,
        raw_data: Record<string, string>
    ) => void;
    removeEntry: (aspect: AspectKey, index: number) => void;
    approveEntry: (aspect: AspectKey, index: number) => void;

    // AI summarization
    isAiLoading: boolean;
    aiError: string | null;
    generateSummary: (
        aspect: AspectKey,
        index: number,
        aspectType: string
    ) => Promise<void>;
    clearAiError: () => void;

    // Reset
    reset: () => void;
}

export type AspectKey =
    | "education"
    | "experience"
    | "projects"
    | "skills"
    | "achievements";

const STEPS: WizardStep[] = [
    "personal_info",
    "education",
    "experience",
    "projects",
    "skills",
    "achievements",
    "review",
];

const emptyPersonalInfo: PersonalInfoData = {
    full_name: "",
    email: "",
    phone: "",
    location: "",
    linkedin_url: "",
    portfolio_url: "",
    ai_summary: "",
};

const initialState = {
    currentStep: "personal_info" as WizardStep,
    resumeId: null as string | null,
    resumeTitle: "Untitled Resume",
    templateId: "classic",
    personalInfo: { ...emptyPersonalInfo },
    education: [] as AspectEntry[],
    experience: [] as AspectEntry[],
    projects: [] as AspectEntry[],
    skills: [] as AspectEntry[],
    achievements: [] as AspectEntry[],
    isAiLoading: false,
    aiError: null as string | null,
    masterSummary: "",
};

export const useResumeStore = create<ResumeWizardState>((set, get) => ({
    ...initialState,
    setMasterSummary: (summary: string) => set({ masterSummary: summary }),

    // ── Navigation ─────────────────────────────────────────────
    setStep: (step) => set({ currentStep: step }),

    nextStep: () => {
        const idx = STEPS.indexOf(get().currentStep);
        if (idx < STEPS.length - 1) set({ currentStep: STEPS[idx + 1] });
    },

    prevStep: () => {
        const idx = STEPS.indexOf(get().currentStep);
        if (idx > 0) set({ currentStep: STEPS[idx - 1] });
    },

    // ── Resume metadata ────────────────────────────────────────
    setResumeId: (id) => set({ resumeId: id }),
    setResumeTitle: (title) => set({ resumeTitle: title }),
    setTemplateId: (id) => set({ templateId: id }),

    // ── Personal info ──────────────────────────────────────────
    setPersonalInfo: (data) =>
        set((s) => ({ personalInfo: { ...s.personalInfo, ...data } })),

    // ── Aspect CRUD ────────────────────────────────────────────
    addEntry: (aspect, raw_data) =>
        set((s) => ({
            [aspect]: [
                ...s[aspect],
                { raw_data, ai_summary: "", is_approved: false },
            ],
        })),

    updateEntryRawData: (aspect, index, raw_data) =>
        set((s) => ({
            [aspect]: s[aspect].map((entry, i) =>
                i === index ? { ...entry, raw_data: { ...entry.raw_data, ...raw_data } } : entry
            ),
        })),

    removeEntry: (aspect, index) =>
        set((s) => ({
            [aspect]: s[aspect].filter((_, i) => i !== index),
        })),

    approveEntry: (aspect, index) =>
        set((s) => ({
            [aspect]: s[aspect].map((entry, i) =>
                i === index ? { ...entry, is_approved: !entry.is_approved } : entry
            ),
        })),

    // ── AI Summarization ───────────────────────────────────────
    clearAiError: () => set({ aiError: null }),

    generateSummary: async (aspect, index, aspectType) => {
        const state = get();
        const entry = state[aspect][index];
        if (!entry) return;

        // Need a resumeId — use a placeholder for now if not set
        const resumeId = state.resumeId || "00000000-0000-0000-0000-000000000001";

        set({ isAiLoading: true, aiError: null });

        try {
            const payload: SummarizePayload = {
                aspect_type: aspectType,
                raw_data: entry.raw_data,
            };

            const result = await aspectApi.summarize(resumeId, payload);

            // Update the specific entry with the AI summary
            set((s) => ({
                isAiLoading: false,
                [aspect]: s[aspect].map((e, i) =>
                    i === index ? { ...e, ai_summary: result.ai_summary } : e
                ),
            }));
        } catch (error) {
            const message =
                error instanceof ApiError
                    ? error.message
                    : "Failed to generate summary. Please try again.";
            set({ isAiLoading: false, aiError: message });
        }
    },

    // ── Reset ──────────────────────────────────────────────────
    reset: () => set({ ...initialState, personalInfo: { ...emptyPersonalInfo } }),
}));
