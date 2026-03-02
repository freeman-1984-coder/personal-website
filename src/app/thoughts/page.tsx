import Link from 'next/link';
import { getSortedPostsData } from '@/lib/markdown';

export default function Thoughts() {
    const posts = getSortedPostsData('thoughts');

    return (
        <main>
            <div className="container prose fade-in-up">
                <h1 className="text-gradient" style={{ fontSize: '3rem' }}>思考</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '3rem' }}>
                    投资、生活、和我的一些想法。
                </p>

                {posts.map((post, index) => (
                    <article key={post.slug} className={`glass glass-card delay-${(index % 3) + 1}`} style={{ marginBottom: '2rem' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{post.date}</div>
                        <h2>{post.title}</h2>
                        <p>{post.description}</p>
                        <Link href={`/thoughts/${post.slug}`} style={{ color: 'var(--accent-hover)', fontWeight: 'bold' }}>
                            阅读更多 ➔
                        </Link>
                    </article>
                ))}

                {posts.length === 0 && (
                    <p style={{ color: 'var(--text-secondary)' }}>还没有发布任何内容，去 `content/thoughts` 目录下新建 markdown 吧！</p>
                )}
            </div>
        </main>
    );
}
