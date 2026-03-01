import React from 'react';

export default function Knowledge() {
    return (
        <main>
            <div className="container prose fade-in-up">
                <h1 className="text-gradient" style={{ fontSize: '3rem' }}>知识库</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '3rem' }}>
                    我结构化的学习笔记、教程和各种技术的深度剖析。
                </p>

                <div className="glass glass-card delay-1" style={{ marginBottom: '2rem' }}>
                    <h2>前端开发</h2>
                    <p>关于 React、Next.js 和现代 CSS 技术的笔记。</p>
                    <a href="#" style={{ color: 'var(--accent-hover)', fontWeight: 'bold' }}>探索 ➔</a>
                </div>

                <div className="glass glass-card delay-2">
                    <h2>后端架构</h2>
                    <p>数据库设计、API 策略和可扩展的系统架构。</p>
                    <a href="#" style={{ color: 'var(--accent-hover)', fontWeight: 'bold' }}>探索 ➔</a>
                </div>
            </div>
        </main>
    );
}
