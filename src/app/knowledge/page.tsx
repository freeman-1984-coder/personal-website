import Link from 'next/link';
import { getSortedPostsData } from '@/lib/markdown';

export default function Knowledge() {
    const posts = getSortedPostsData('knowledge');

    return (
        <main>
            <div className="container prose fade-in-up">
                <h1 className="text-gradient" style={{ fontSize: '3rem' }}>知识库</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '3rem' }}>
                    记录技术细节和踩过的坑。
                </p>

                {posts.map((post, index) => (
                    <div key={post.slug} className={`glass glass-card delay-${(index % 3) + 1}`} style={{ marginBottom: '2rem' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{post.date}</div>
                        <h2>{post.title}</h2>
                        <p>{post.description}</p>
                        <Link href={`/knowledge/${post.slug}`} style={{ color: 'var(--accent-hover)', fontWeight: 'bold' }}>探索 ➔</Link>
                    </div>
                ))}

                {posts.length === 0 && (
                    <p style={{ color: 'var(--text-secondary)' }}>还没有发布任何内容，去 `content/knowledge` 目录下新建 markdown 吧！</p>
                )}
            </div>
        </main>
    );
}
