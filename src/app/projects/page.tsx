export default function Projects() {
    return (
        <main>
            <div className="container prose fade-in-up">
                <h1 className="text-gradient" style={{ fontSize: '3rem' }}>My Projects</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '3rem' }}>Here are some of the things I've been working on.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Placeholder for project cards */}
                    <div className="glass glass-card delay-1">
                        <div style={{ height: '150px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginBottom: '1rem' }}></div>
                        <h3>Project Alpha</h3>
                        <p>A cool project doing amazing things.</p>
                        <div style={{ marginTop: '1rem' }}>
                            <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'var(--accent-primary)', borderRadius: '12px', marginRight: '0.5rem' }}>React</span>
                            <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'var(--glass-border)', borderRadius: '12px' }}>Node.js</span>
                        </div>
                    </div>
                    <div className="glass glass-card delay-2">
                        <div style={{ height: '150px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginBottom: '1rem' }}></div>
                        <h3>Project Beta</h3>
                        <p>Another fascinating project using cutting edge tech.</p>
                        <div style={{ marginTop: '1rem' }}>
                            <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'var(--accent-primary)', borderRadius: '12px', marginRight: '0.5rem' }}>Python</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
