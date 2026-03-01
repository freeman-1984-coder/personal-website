export default function Projects() {
    return (
        <main>
            <div className="container prose fade-in-up">
                <h1 className="text-gradient" style={{ fontSize: '3rem' }}>我的项目</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '3rem' }}>这里是我最近在做的一些好玩的事情。</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Placeholder for project cards */}
                    <div className="glass glass-card delay-1">
                        <div style={{ height: '150px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginBottom: '1rem' }}></div>
                        <h3>Alpha 项目</h3>
                        <p>一个极其酷炫的项目，正在改变世界。</p>
                        <div style={{ marginTop: '1rem' }}>
                            <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'var(--accent-primary)', borderRadius: '12px', marginRight: '0.5rem' }}>React</span>
                            <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'var(--glass-border)', borderRadius: '12px' }}>Node.js</span>
                        </div>
                    </div>
                    <div className="glass glass-card delay-2">
                        <div style={{ height: '150px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginBottom: '1rem' }}></div>
                        <h3>Beta 项目</h3>
                        <p>另一个使用前沿技术打造的有趣项目。</p>
                        <div style={{ marginTop: '1rem' }}>
                            <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'var(--accent-primary)', borderRadius: '12px', marginRight: '0.5rem' }}>Python</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
