import React from 'react'

import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { Inter } from '@next/font/google'

// TODO this must be moved to _app.tsx
const inter = Inter()

type LayoutProps = {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => (
  <div className="bg-ink-400 flex flex-col min-h-screen antialiased text-vanilla-300">
    <main className={`flex flex-1 ${inter.className}`}>
      <section className="container max-w-6xl mx-auto flex flex-col md:flex-row">
        <Sidebar></Sidebar>
        {children}
      </section>
    </main>
  </div>
)
