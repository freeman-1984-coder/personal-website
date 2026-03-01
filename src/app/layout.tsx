import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Crazy Lax - 数字花园',
  description: 'Crazy Lax 的个人空间，记录项目、知识、思考与 AI 工具。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="bg-blobs"></div>
        <nav className="navbar">
          <div className="container nav-container">
            <Link href="/" className="nav-logo text-gradient">
              Crazy Lax
            </Link>
            <ul className="nav-links">
              <li><Link href="/" className="nav-link">首页</Link></li>
              <li><Link href="/projects" className="nav-link">项目</Link></li>
              <li><Link href="/knowledge" className="nav-link">知识库</Link></li>
              <li><Link href="/thoughts" className="nav-link">思考</Link></li>
              <li><Link href="/tools" className="nav-link">AI 工具</Link></li>
            </ul>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
