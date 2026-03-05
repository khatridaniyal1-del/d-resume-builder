"use client";

import { useResumeStore } from "@/store/useResumeStore";

export default function PersonalInfoStep() {
    const personalInfo = useResumeStore((s) => s.personalInfo);
    const setPersonalInfo = useResumeStore((s) => s.setPersonalInfo);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPersonalInfo({ [name]: value });
    };

    return (
        <div className="space-y-6">
            <div className="glass rounded-2xl p-6 sm:p-8 border border-[var(--color-border)]">
                <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-text-muted)]">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="full_name"
                            value={personalInfo.full_name}
                            onChange={handleChange}
                            placeholder="Jane Doe"
                            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 outline-none focus:border-white transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-text-muted)]">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={personalInfo.email}
                            onChange={handleChange}
                            placeholder="jane.doe@example.com"
                            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 outline-none focus:border-white transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-text-muted)]">
                            Phone
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={personalInfo.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 123-4567"
                            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 outline-none focus:border-white transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-text-muted)]">
                            Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={personalInfo.location}
                            onChange={handleChange}
                            placeholder="San Francisco, CA"
                            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 outline-none focus:border-white transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-text-muted)]">
                            LinkedIn URL
                        </label>
                        <input
                            type="url"
                            name="linkedin_url"
                            value={personalInfo.linkedin_url}
                            onChange={handleChange}
                            placeholder="linkedin.com/in/janedoe"
                            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 outline-none focus:border-white transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-text-muted)]">
                            Portfolio / Website
                        </label>
                        <input
                            type="url"
                            name="portfolio_url"
                            value={personalInfo.portfolio_url}
                            onChange={handleChange}
                            placeholder="janedoe.com"
                            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 outline-none focus:border-white transition-colors"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
