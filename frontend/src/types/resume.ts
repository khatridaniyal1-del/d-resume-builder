/**
 * TypeScript interfaces mirroring the backend Pydantic schemas.
 */

export interface User {
    id: string;
    email: string;
    full_name: string;
    created_at: string;
}

export interface Resume {
    id: string;
    user_id: string;
    title: string;
    template_id: string;
    master_summary: string | null;
    is_finalized: boolean;
    created_at: string;
    updated_at: string;
}

export interface PersonalInfo {
    id: string;
    resume_id: string;
    full_name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin_url?: string;
    portfolio_url?: string;
    ai_summary?: string;
}

export interface Education {
    id: string;
    resume_id: string;
    institution: string;
    degree: string;
    field_of_study?: string;
    start_date?: string;
    end_date?: string;
    gpa?: number;
    raw_description?: string;
    ai_summary?: string;
    is_approved: boolean;
    display_order: number;
}

export interface Experience {
    id: string;
    resume_id: string;
    company: string;
    job_title: string;
    location?: string;
    start_date?: string;
    end_date?: string;
    is_current: boolean;
    raw_description?: string;
    ai_summary?: string;
    is_approved: boolean;
    display_order: number;
}

export interface Project {
    id: string;
    resume_id: string;
    name: string;
    tech_stack?: string;
    url?: string;
    raw_description?: string;
    ai_summary?: string;
    is_approved: boolean;
    display_order: number;
}

export interface Skill {
    id: string;
    resume_id: string;
    category: string;
    items: string;
    proficiency_level?: string;
    display_order: number;
}

export interface Achievement {
    id: string;
    resume_id: string;
    title: string;
    issuer?: string;
    date_received?: string;
    raw_description?: string;
    ai_summary?: string;
    is_approved: boolean;
    display_order: number;
}

/** The wizard step identifiers */
export type WizardStep =
    | "personal_info"
    | "education"
    | "experience"
    | "projects"
    | "skills"
    | "achievements"
    | "review";

export const WIZARD_STEPS: WizardStep[] = [
    "personal_info",
    "education",
    "experience",
    "projects",
    "skills",
    "achievements",
    "review",
];

export const STEP_LABELS: Record<WizardStep, string> = {
    personal_info: "Personal Info",
    education: "Education",
    experience: "Experience",
    projects: "Projects",
    skills: "Skills",
    achievements: "Achievements",
    review: "Review & Compile",
};
