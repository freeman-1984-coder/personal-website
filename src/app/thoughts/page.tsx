export default function Thoughts() {
    return (
        <main>
            <div className="container prose fade-in-up">
                <h1 className="text-gradient" style={{ fontSize: '3rem' }}>思考</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '3rem' }}>
                    投资、生活、和我的一些想法。
                </p>

                <article className="glass glass-card delay-1" style={{ marginBottom: '2rem' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>2024年10月20日</div>
                    <h2>SaaS 商业模式的演变</h2>
                    <p>
                        经常性收入如何将重点从最初的用户获取完全转移到长期的客户留存与扩张...
                    </p>
                    <a href="#" style={{ color: 'var(--accent-hover)', fontWeight: 'bold' }}>阅读更多 ➔</a>
                </article>

                <article className="glass glass-card delay-2">
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>2024年10月12日</div>
                    <h2>个人成长的复利效应</h2>
                    <p>
                        如果你每天进步 1%，一年下来你将变得强大 37 倍。这是我如何记录这一过程的...
                    </p>
                    <a href="#" style={{ color: 'var(--accent-hover)', fontWeight: 'bold' }}>阅读更多 ➔</a>
                </article>
            </div>
        </main>
    );
}
