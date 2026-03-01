export default function Tools() {
    return (
        <main>
            <div className="container prose fade-in-up">
                <h1 className="text-gradient" style={{ fontSize: '3rem' }}>AI 工具</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '3rem' }}>
                    记录的一些AI 工具，以及我在用的一些AI 工具。
                </p>

                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>

                    <div className="glass glass-card delay-1">
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>🤖 DeepSeek / ChatGPT</h3>
                        <p>用于日常问题排查、创意激荡以及起草结构化文档。</p>
                        <div style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                            标签: <span style={{ color: 'var(--accent-hover)' }}>大模型</span>, <span style={{ color: 'var(--accent-hover)' }}>文本生成</span>
                        </div>
                    </div>

                    <div className="glass glass-card delay-2">
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>💻 Cursor / GitHub Copilot</h3>
                        <p>最好的 AI 编程工具，能够直接写出基础代码，将编码过程加速十倍。</p>
                        <div style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                            标签: <span style={{ color: 'var(--accent-hover)' }}>编程</span>, <span style={{ color: 'var(--accent-hover)' }}>IDE编辑器</span>
                        </div>
                    </div>

                    <div className="glass glass-card delay-3">
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>📝 Notion AI</h3>
                        <p>用于总结会议纪要、翻译文本和更加直观地整理我的阅读列表。</p>
                        <div style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                            标签: <span style={{ color: 'var(--accent-hover)' }}>生产力</span>, <span style={{ color: 'var(--accent-hover)' }}>笔记簿</span>
                        </div>
                    </div>

                </section>
            </div>
        </main>
    );
}
