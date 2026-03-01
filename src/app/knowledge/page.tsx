import React from 'react';

export default function Knowledge() {
    return (
        <main>
            <div className="container prose fade-in-up">
                <h1 className="text-gradient" style={{ fontSize: '3rem' }}>Knowledge Base</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '3rem' }}>
                    My structured learning notes, tutorials, and deep-dives into various technologies.
                </p>

                <div className="glass glass-card delay-1" style={{ marginBottom: '2rem' }}>
                    <h2>Frontend Development</h2>
                    <p>Notes on React, Next.js, and modern CSS techniques.</p>
                    <a href="#" style={{ color: 'var(--accent-hover)', fontWeight: 'bold' }}>Explore ➔</a>
                </div>

                <div className="glass glass-card delay-2">
                    <h2>Backend Architecture</h2>
                    <p>Database design, API strategies, and scalable system architectures.</p>
                    <a href="#" style={{ color: 'var(--accent-hover)', fontWeight: 'bold' }}>Explore ➔</a>
                </div>
            </div>
        </main>
    );
}
