import Link from 'next/link';
import { getSortedPostsData } from '@/lib/markdown';

export default function Projects() {
    const posts = getSortedPostsData('projects');

    return (
        <main>
            <div className="container prose fade-in-up">
                <h1 className="text-gradient" style={{ fontSize: '3rem' }}>项目</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '3rem' }}>我参与或创建的一些项目和代码。</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {posts.map((post, index) => (
                        <div key={post.slug} className={`glass glass-card delay-${(index % 3) + 1}`}>
                            <div style={{ height: '150px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginBottom: '1rem' }}></div>
                            <h3>{post.title}</h3>
                            <p>{post.description}</p>
                            <div style={{ marginTop: '1rem' }}>
                                <Link href={`/projects/${post.slug}`} style={{ fontSize: '0.9rem', color: 'var(--accent-hover)', fontWeight: 'bold' }}>
                                    查看详情 ➔
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {posts.length === 0 && (
                    <p style={{ color: 'var(--text-secondary)' }}>还没有发布任何内容，去 `content/projects` 目录下新建 markdown 吧！</p>
                )}
            </div>
        </main>
    );
}
