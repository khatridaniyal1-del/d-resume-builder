export default function DashboardPage() {
    return (
        <main
            style={{
                minHeight: "100vh",
                padding: "3rem",
                maxWidth: "1000px",
                margin: "0 auto",
            }}
        >
            <h1
                style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                }}
            >
                My Resumes
            </h1>
            <p
                style={{
                    color: "var(--color-text-muted)",
                    marginBottom: "2rem",
                }}
            >
                Manage and edit your saved resumes.
            </p>

            {/* Empty state */}
            <div
                className="glass"
                style={{
                    padding: "3rem",
                    borderRadius: "16px",
                    textAlign: "center",
                }}
            >
                <p
                    style={{
                        fontSize: "3rem",
                        marginBottom: "1rem",
                    }}
                >
                    📄
                </p>
                <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
                    No resumes yet. Start building your first one!
                </p>
                <a
                    href="/builder"
                    className="gradient-primary glow-primary transition-smooth"
                    style={{
                        display: "inline-block",
                        padding: "0.75rem 2rem",
                        borderRadius: "10px",
                        color: "#fff",
                        fontWeight: 600,
                        textDecoration: "none",
                    }}
                >
                    ✨ Create Resume
                </a>
            </div>
        </main>
    );
}
