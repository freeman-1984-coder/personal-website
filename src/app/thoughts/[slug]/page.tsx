import { getPostData, getSortedPostsData } from '@/lib/markdown';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Link from 'next/link';

export async function generateStaticParams() {
    const posts = getSortedPostsData('thoughts');
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function ThoughtPost({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const postData = getPostData('thoughts', resolvedParams.slug);

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
                        <MarkdownRenderer content={postData.content} />
                    </div>
                </article>
            </div>
        </main>
    );
}
