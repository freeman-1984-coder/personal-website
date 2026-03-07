import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function Mermaid({ chart }: { chart: string }) {
    let base64 = '';
    try {
        if (typeof Buffer !== 'undefined') {
            base64 = Buffer.from(chart.trim()).toString('base64');
        } else {
            base64 = btoa(unescape(encodeURIComponent(chart.trim())));
        }
        base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    } catch (e) {
        console.error("Base64 encode error:", e);
    }
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
                        let chartText = '';
                        if (Array.isArray(children)) {
                            chartText = children.map(c => typeof c === 'string' ? c : '').join('');
                        } else {
                            chartText = String(children);
                        }
                        return <Mermaid chart={chartText} />;
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
