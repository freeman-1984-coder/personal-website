import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <div className="container">
        <section style={{ textAlign: 'center', margin: '4rem 0', padding: '2rem 0' }} className="fade-in-up">
          <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>
            欢迎来到 <span className="text-gradient">Crazy Lax 空间</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem' }}>
            这是一个数字花园，在这里我分享我的项目、学习历程、深度思考以及我使用的 AI 工具。
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
              展示我构建的产品、开源贡献以及我正在进行的业余项目。
            </p>
          </Link>

          <Link href="/knowledge" className="glass glass-card fade-in-up delay-2" style={{ display: 'block' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🧠</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.8rem' }}>知识库</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              我结构化的学习笔记、教程和各种技术的深度剖析。
            </p>
          </Link>

          <Link href="/thoughts" className="glass glass-card fade-in-up delay-3" style={{ display: 'block' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💡</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.8rem' }}>思考</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              关于投资、学习策略、个人成长和商业模式的随笔。
            </p>
          </Link>

          <Link href="/tools" className="glass glass-card fade-in-up delay-4" style={{ display: 'block' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤖</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.8rem' }}>AI 工具</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              我精心挑选的工具箱和通过 AI 将生产力与创造力提升 10 倍的工作流。
            </p>
          </Link>

        </section>
      </div>
    </main>
  );
}
