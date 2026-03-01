export default function Thoughts() {
    return (
        <main>
            <div className="container prose fade-in-up">
                <h1 className="text-gradient" style={{ fontSize: '3rem' }}>Thoughts & Musings</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '3rem' }}>
                    My reflections on investment strategies, continuous learning, business models, and life.
                </p>

                <article className="glass glass-card delay-1" style={{ marginBottom: '2rem' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>October 20, 2024</div>
                    <h2>The Evolution of SaaS Business Models</h2>
                    <p>
                        How recurring revenue has shifted focus entirely from initial acquisition to
                        long-term retention and expansion...
                    </p>
                    <a href="#" style={{ color: 'var(--accent-hover)', fontWeight: 'bold' }}>Read more ➔</a>
                </article>

                <article className="glass glass-card delay-2">
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>October 12, 2024</div>
                    <h2>Compound Interest in Personal Growth</h2>
                    <p>
                        If you improve by 1% a day, you become 37 times better over the course of a year. Here is how I track it...
                    </p>
                    <a href="#" style={{ color: 'var(--accent-hover)', fontWeight: 'bold' }}>Read more ➔</a>
                </article>
            </div>
        </main>
    );
}
