import Link from "next/link";

export default function HomePage() {
    return (
        <main
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Background gradient orbs */}
            <div
                style={{
                    position: "absolute",
                    top: "-20%",
                    left: "-10%",
                    width: "600px",
                    height: "600px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(108,92,231,0.15) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "-20%",
                    right: "-10%",
                    width: "500px",
                    height: "500px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(0,206,201,0.12) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            {/* Hero content */}
            <div style={{ textAlign: "center", maxWidth: "720px", zIndex: 1 }}>
                <p
                    style={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        color: "var(--color-accent)",
                        marginBottom: "1rem",
                    }}
                >
                    AI-Powered Resume Builder
                </p>

                <h1
                    style={{
                        fontSize: "clamp(2.5rem, 6vw, 4rem)",
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: "1.5rem",
                    }}
                >
                    Craft Your{" "}
                    <span className="gradient-text">Perfect Resume</span>
                    <br />
                    Step by Step
                </h1>

                <p
                    style={{
                        fontSize: "1.125rem",
                        color: "var(--color-text-muted)",
                        maxWidth: "540px",
                        margin: "0 auto 2.5rem",
                        lineHeight: 1.7,
                    }}
                >
                    Our interactive AI wizard guides you through each section of your
                    resume, instantly transforming your raw input into polished,
                    professional bullet points.
                </p>

                <div
                    style={{
                        display: "flex",
                        gap: "1rem",
                        justifyContent: "center",
                        flexWrap: "wrap",
                    }}
                >
                    <Link
                        href="/builder"
                        className="gradient-primary glow-primary transition-smooth"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.875rem 2rem",
                            borderRadius: "12px",
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: "1rem",
                            textDecoration: "none",
                        }}
                    >
                        ✨ Start Building
                    </Link>

                    <Link
                        href="/dashboard"
                        className="glass transition-smooth"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.875rem 2rem",
                            borderRadius: "12px",
                            color: "var(--color-text)",
                            fontWeight: 500,
                            fontSize: "1rem",
                            textDecoration: "none",
                        }}
                    >
                        📄 My Resumes
                    </Link>
                </div>
            </div>

            {/* Feature cards */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "1.5rem",
                    maxWidth: "900px",
                    width: "100%",
                    marginTop: "5rem",
                    zIndex: 1,
                }}
            >
                {[
                    {
                        icon: "🧙",
                        title: "AI Wizard",
                        desc: "Step-by-step guided experience with instant AI-powered summaries.",
                    },
                    {
                        icon: "🎯",
                        title: "JD Tailoring",
                        desc: "Paste a job description and let AI optimize your resume to match.",
                    },
                    {
                        icon: "📊",
                        title: "ATS Scoring",
                        desc: "Real-time ATS compatibility scoring with improvement suggestions.",
                    },
                ].map((feature) => (
                    <div
                        key={feature.title}
                        className="glass transition-smooth"
                        style={{
                            padding: "1.75rem",
                            borderRadius: "16px",
                            textAlign: "center",
                        }}
                    >
                        <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
                            {feature.icon}
                        </div>
                        <h3
                            style={{
                                fontSize: "1.125rem",
                                fontWeight: 600,
                                marginBottom: "0.5rem",
                            }}
                        >
                            {feature.title}
                        </h3>
                        <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
                            {feature.desc}
                        </p>
                    </div>
                ))}
            </div>
        </main>
    );
}
