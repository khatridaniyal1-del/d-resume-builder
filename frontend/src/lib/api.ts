/**
 * API client for communicating with the FastAPI backend.
 * Handles all HTTP calls, error handling, and response typing.
 */

import axios, { AxiosError } from "axios";

const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
    timeout: 30000, // 30s — AI calls can take time
});

// ── Error handling ───────────────────────────────────────────

export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

function handleError(error: unknown): never {
    if (error instanceof AxiosError) {
        const status = error.response?.status ?? 0;
        const detail =
            error.response?.data?.detail ?? error.message ?? "Unknown error";

        if (status === 503) {
            throw new ApiError(
                "The AI service is temporarily unavailable. Please try again in a moment.",
                503
            );
        }
        if (status === 422) {
            throw new ApiError(
                "Invalid data submitted. Please check your inputs.",
                422
            );
        }
        if (!error.response) {
            throw new ApiError(
                "Unable to connect to the server. Is the backend running?",
                0
            );
        }
        throw new ApiError(String(detail), status);
    }
    throw new ApiError("An unexpected error occurred.", 500);
}

// ── Types ────────────────────────────────────────────────────

export interface SummarizePayload {
    aspect_type: string;
    raw_data: Record<string, unknown>;
}

export interface SummarizeResult {
    ai_summary: string;
}

export interface ResumePayload {
    title?: string;
    template_id?: string;
}

export interface ResumeResult {
    id: string;
    user_id: string;
    title: string;
    template_id: string;
    master_summary: string | null;
    is_finalized: boolean;
    created_at: string;
    updated_at: string;
}

// ── Auth ─────────────────────────────────────────────────────

export const authApi = {
    register: async (data: {
        email: string;
        password: string;
        full_name: string;
    }) => {
        try {
            const res = await api.post("/auth/register", data);
            return res.data;
        } catch (e) {
            handleError(e);
        }
    },
    login: async (data: { email: string; password: string }) => {
        try {
            const res = await api.post("/auth/login", data);
            return res.data;
        } catch (e) {
            handleError(e);
        }
    },
};

// ── Resumes ──────────────────────────────────────────────────

export const resumeApi = {
    create: async (data: ResumePayload): Promise<ResumeResult> => {
        try {
            const res = await api.post("/resumes/", data);
            return res.data;
        } catch (e) {
            handleError(e);
        }
    },
    list: async (): Promise<ResumeResult[]> => {
        try {
            const res = await api.get("/resumes/");
            return res.data;
        } catch (e) {
            handleError(e);
        }
    },
    get: async (id: string): Promise<ResumeResult> => {
        try {
            const res = await api.get(`/resumes/${id}`);
            return res.data;
        } catch (e) {
            handleError(e);
        }
    },
    update: async (
        id: string,
        data: Record<string, unknown>
    ): Promise<ResumeResult> => {
        try {
            const res = await api.patch(`/resumes/${id}`, data);
            return res.data;
        } catch (e) {
            handleError(e);
        }
    },
    delete: async (id: string): Promise<void> => {
        try {
            await api.delete(`/resumes/${id}`);
        } catch (e) {
            handleError(e);
        }
    },
    compile: async (
        data: Record<string, string[]>
    ): Promise<{ master_summary: string }> => {
        try {
            const res = await api.post(`/resumes/compile`, data);
            return res.data;
        } catch (e) {
            handleError(e);
        }
    },
};

// ── Aspects ──────────────────────────────────────────────────

export const aspectApi = {
    list: async (resumeId: string, aspectType: string) => {
        try {
            const res = await api.get(
                `/resumes/${resumeId}/aspects/${aspectType}`
            );
            return res.data;
        } catch (e) {
            handleError(e);
        }
    },

    create: async (
        resumeId: string,
        aspectType: string,
        data: Record<string, unknown>
    ) => {
        try {
            const res = await api.post(
                `/resumes/${resumeId}/aspects/${aspectType}`,
                data
            );
            return res.data;
        } catch (e) {
            handleError(e);
        }
    },

    delete: async (
        resumeId: string,
        aspectType: string,
        entryId: string
    ): Promise<void> => {
        try {
            await api.delete(
                `/resumes/${resumeId}/aspects/${aspectType}/${entryId}`
            );
        } catch (e) {
            handleError(e);
        }
    },

    /**
     * Call the AI to generate a polished summary for an aspect.
     *
     * @param resumeId - UUID of the resume
     * @param payload  - { aspect_type, raw_data }
     * @returns The AI-generated summary text
     */
    summarize: async (
        resumeId: string,
        payload: SummarizePayload
    ): Promise<SummarizeResult> => {
        try {
            const res = await api.post(
                `/resumes/${resumeId}/aspects/summarize`,
                payload
            );
            return res.data;
        } catch (e) {
            handleError(e);
        }
    },
};

export default api;
