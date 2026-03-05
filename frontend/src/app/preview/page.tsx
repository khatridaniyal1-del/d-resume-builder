"use client";

import { useRef, useState, useCallback } from "react";
import { useReactToPrint } from "react-to-print";
import { useResumeStore } from "@/store/useResumeStore";
import ResumeTemplate from "@/components/templates/ResumeTemplate";
import type { ResumeData } from "@/components/templates/ResumeTemplate";

export default function PreviewPage() {
    const [isPrinting, setIsPrinting] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);
    const store = useResumeStore();

    /* Build the data object from Zustand store */
    const resumeData: ResumeData = {
        personalInfo: store.personalInfo,
        masterSummary: store.masterSummary,
        experience: store.experience,
        education: store.education,
        projects: store.projects,
        skills: store.skills,
        achievements: store.achievements,
    };

    const handleBeforePrint = useCallback(() => {
        setIsPrinting(true);
        return Promise.resolve();
    }, []);

    const handleAfterPrint = useCallback(() => {
        setIsPrinting(false);
    }, []);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `${store.personalInfo.full_name || "Resume"}_${new Date().getFullYear()}`,
        onBeforePrint: handleBeforePrint,
        onAfterPrint: handleAfterPrint,
    });

    return (
        <div className="min-h-screen bg-gray-100 print:bg-white">
            {/* ── Top control bar (hidden when printing) ── */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm print:hidden">
                <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-4">
                        <a
                            href="/builder"
                            className="text-gray-500 hover:text-gray-800 transition-colors text-sm flex items-center gap-1"
                        >
                            ← Back to Wizard
                        </a>
                        <div className="h-5 w-px bg-gray-300" />
                        <h1 className="font-bold text-base text-gray-800">Resume Preview</h1>
                    </div>

                    <button
                        onClick={() => handlePrint()}
                        disabled={isPrinting}
                        className="bg-gray-900 hover:bg-black text-white px-6 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow"
                    >
                        {isPrinting ? (
                            <>
                                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                Preparing...
                            </>
                        ) : (
                            <>⬇ Download PDF</>
                        )}
                    </button>
                </div>
            </div>

            {/* ── A4 preview area ── */}
            <div className="py-8 px-4 flex justify-center print:p-0 print:block">
                <ResumeTemplate ref={printRef} data={resumeData} />
            </div>
        </div>
    );
}
