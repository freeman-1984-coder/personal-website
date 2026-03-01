export default function Tools() {
    return (
        <main>
            <div className="container prose fade-in-up">
                <h1 className="text-gradient" style={{ fontSize: '3rem' }}>AI Tool Arsenal</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '3rem' }}>
                    My personally curated list of AI tools and configurations to maximize productivity.
                </p>

                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>

                    <div className="glass glass-card delay-1">
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>🤖 DeepSeek / ChatGPT</h3>
                        <p>Used for daily problem solving, ideation, and drafting structured documents.</p>
                        <div style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                            Tags: <span style={{ color: 'var(--accent-hover)' }}>LLM</span>, <span style={{ color: 'var(--accent-hover)' }}>Text Gen</span>
                        </div>
                    </div>

                    <div className="glass glass-card delay-2">
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>💻 Cursor / GitHub Copilot</h3>
                        <p>The best AI programming tools that literally write the boilerplate for you and speed up the coding process by 10x.</p>
                        <div style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                            Tags: <span style={{ color: 'var(--accent-hover)' }}>Coding</span>, <span style={{ color: 'var(--accent-hover)' }}>IDE</span>
                        </div>
                    </div>

                    <div className="glass glass-card delay-3">
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>📝 Notion AI</h3>
                        <p>Summarizing meeting notes, translating text, and organizing my reading list intuitively.</p>
                        <div style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                            Tags: <span style={{ color: 'var(--accent-hover)' }}>Productivity</span>, <span style={{ color: 'var(--accent-hover)' }}>Notes</span>
                        </div>
                    </div>

                </section>
            </div>
        </main>
    );
}
