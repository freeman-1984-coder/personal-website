import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <div className="container">
        <section style={{ textAlign: 'center', margin: '4rem 0', padding: '2rem 0' }} className="fade-in-up">
          <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>
            <span className="text-gradient">Crazy Lax</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem' }}>
            这里是我存放代码、笔记和一些思考的地方。
          </p>
          <a href="#explore" className="btn btn-primary">开始探索</a>
        </section>

        <section id="explore" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginTop: '6rem'
        }}>

          <Link href="/projects" className="glass glass-card fade-in-up delay-1" style={{ display: 'block' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚀</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.8rem' }}>项目</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              我参与或创建的一些项目和代码。
            </p>
          </Link>

          <Link href="/knowledge" className="glass glass-card fade-in-up delay-2" style={{ display: 'block' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🧠</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.8rem' }}>知识库</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              记录技术细节和踩过的坑。
            </p>
          </Link>

          <Link href="/thoughts" className="glass glass-card fade-in-up delay-3" style={{ display: 'block' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💡</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.8rem' }}>思考</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              投资、生活、和我的一些想法。
            </p>
          </Link>

          <Link href="/tools" className="glass glass-card fade-in-up delay-4" style={{ display: 'block' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤖</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.8rem' }}>AI 工具</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              记录的一些AI 工具，以及我在用的一些AI 工具。
            </p>
          </Link>

        </section>
      </div>
    </main>
  );
}
