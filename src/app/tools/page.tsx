import Link from 'next/link';
import { getSortedPostsData } from '@/lib/markdown';

export default function Tools() {
    const posts = getSortedPostsData('tools');

    return (
        <main>
            <div className="container prose fade-in-up">
                <h1 className="text-gradient" style={{ fontSize: '3rem' }}>AI 工具</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '3rem' }}>
                    记录的一些AI 工具，以及我在用的一些AI 工具。
                </p>

                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>

                    {/* Hardcoded interactive tool: MSTR Black Hole */}
                    <div className="glass glass-card delay-1">
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>MSTR 比特币黑洞</h3>
                        <p>可视化呈现微策略（MicroStrategy）疯狂的比特币吞噬与黑洞效应，极具视觉冲击力的实时数据看板。</p>
                        <div style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                            <Link href="/tools/mstr-black-hole" style={{ color: 'var(--accent-hover)', fontWeight: 'bold' }}>
                                立即体验 ➔
                            </Link>
                        </div>
                    </div>

                    {posts.map((post, index) => (
                        <div key={post.slug} className={`glass glass-card delay-${((index + 1) % 4) + 1}`}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{post.title}</h3>
                            <p>{post.description}</p>
                            <div style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                                <Link href={`/tools/${post.slug}`} style={{ color: 'var(--accent-hover)', fontWeight: 'bold' }}>
                                    阅读更多 ➔
                                </Link>
                            </div>
                        </div>
                    ))}

                </section>

                {posts.length === 0 && (
                    <p style={{ color: 'var(--text-secondary)' }}>还没有发布任何内容，去 `content/tools` 目录下新建 markdown 吧！</p>
                )}
            </div>
        </main>
    );
}
