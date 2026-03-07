import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Mermaid from './Mermaid';

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
