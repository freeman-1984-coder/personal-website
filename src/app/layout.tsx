import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Crazy Lax - Digital Garden',
  description: 'A personal space for projects, knowledge, thoughts, and tools by Crazy Lax.',
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
              <li><Link href="/" className="nav-link">Home</Link></li>
              <li><Link href="/projects" className="nav-link">Projects</Link></li>
              <li><Link href="/knowledge" className="nav-link">Knowledge</Link></li>
              <li><Link href="/thoughts" className="nav-link">Thoughts</Link></li>
              <li><Link href="/tools" className="nav-link">AI Tools</Link></li>
            </ul>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
