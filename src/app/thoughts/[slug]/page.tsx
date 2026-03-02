import { getPostData, getSortedPostsData } from '@/lib/markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

export async function generateStaticParams() {
    const posts = getSortedPostsData('thoughts');
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default function ThoughtPost({ params }: { params: { slug: string } }) {
    const postData = getPostData('thoughts', params.slug);

    return (
        <main>
            <div className="container" style={{ maxWidth: '800px', margin: '4rem auto' }}>
                <Link href="/thoughts" style={{ color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
                    ← 返回碎碎念
                </Link>

                <article className="glass prose fade-in-up" style={{ padding: '3rem', borderRadius: '15px' }}>
                    <header style={{ marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                        <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{postData.title}</h1>
                        <div style={{ color: 'var(--text-secondary)' }}>{postData.date}</div>
                    </header>
                    <div style={{ color: 'var(--text-primary)', lineHeight: '1.8' }}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {postData.content}
                        </ReactMarkdown>
                    </div>
                </article>
            </div>
        </main>
    );
}
