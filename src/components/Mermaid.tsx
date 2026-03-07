'use client';

import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';

export default function Mermaid({ chart }: { chart: string }) {
    const [svg, setSvg] = useState<string>('');
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
        });

        const renderChart = async () => {
            try {
                const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
                const { svg } = await mermaid.render(id, chart);
                setSvg(svg);
                setHasError(false);
            } catch (error) {
                console.error("Mermaid parsing error:", error);
                setHasError(true);
            }
        };

        if (chart) {
            renderChart();
        }
    }, [chart]);

    if (hasError) {
        return (
            <div style={{ padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', overflowX: 'auto', margin: '2rem 0' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>⚠️ 图表渲染失败，可能由于语法不兼容：</p>
                <pre style={{ fontSize: '0.85em', margin: 0 }}>{chart}</pre>
            </div>
        );
    }

    if (!svg) {
        return <div style={{ textAlign: 'center', padding: '2rem', color: '#666', margin: '2rem 0' }}>加载图表中...</div>;
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0', background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
            <div dangerouslySetInnerHTML={{ __html: svg }} style={{ maxWidth: '100%' }} />
        </div>
    );
}
