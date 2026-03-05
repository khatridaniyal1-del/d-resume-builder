import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "AI Resume Builder — Craft Your Perfect Resume",
    description:
        "Build a polished, ATS-optimized resume step-by-step with AI-powered summarization. Transform raw career data into professional bullet points instantly.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body suppressHydrationWarning>{children}</body>
        </html>
    );
}
