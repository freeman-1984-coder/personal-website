import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function Mermaid({ chart }: { chart: string }) {
    const base64 = Buffer.from(chart.trim()).toString('base64');
    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
            <img
                src={`https://mermaid.ink/img/${base64}`}
                alt="Mermaid diagram"
                style={{ maxWidth: '100%', borderRadius: '8px', background: 'white', padding: '1rem' }}
            />
        </div>
    );
}

export default function MarkdownRenderer({ content }: { content: string }) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                code(props) {
                    const { children, className, node, ...rest } = props;
                    const match = /language-(\w+)/.exec(className || '');

                    if (match && match[1] === 'mermaid') {
                        return <Mermaid chart={String(children)} />;
                    }

                    return (
                        <code className={className} {...rest}>
                            {children}
                        </code>
                    );
                }
            }}
        >
            {content}
        </ReactMarkdown>
    );
}
