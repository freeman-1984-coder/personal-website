import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <div className="container">
        <section style={{ textAlign: 'center', margin: '4rem 0', padding: '2rem 0' }} className="fade-in-up">
          <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>
            Welcome to <span className="text-gradient">Crazy Lax Space</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem' }}>
            A digital garden where I share my projects, learning journey, deep thoughts, and the AI tools I use.
          </p>
          <a href="#explore" className="btn btn-primary">Start Exploring</a>
        </section>

        <section id="explore" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginTop: '6rem'
        }}>

          <Link href="/projects" className="glass glass-card fade-in-up delay-1" style={{ display: 'block' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚀</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.8rem' }}>Projects</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              A showcase of things I've built, open-source contributions, and side projects I'm working on.
            </p>
          </Link>

          <Link href="/knowledge" className="glass glass-card fade-in-up delay-2" style={{ display: 'block' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🧠</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.8rem' }}>Knowledge Base</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              My structured learning notes, tutorials, and deep-dives into various technologies.
            </p>
          </Link>

          <Link href="/thoughts" className="glass glass-card fade-in-up delay-3" style={{ display: 'block' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💡</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.8rem' }}>Thoughts</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Musings on investment, learning strategies, personal growth, and business models.
            </p>
          </Link>

          <Link href="/tools" className="glass glass-card fade-in-up delay-4" style={{ display: 'block' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤖</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.8rem' }}>AI Tools</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              My curated toolbox and workflows using AI to 10x productivity and creativity.
            </p>
          </Link>

        </section>
      </div>
    </main>
  );
}
