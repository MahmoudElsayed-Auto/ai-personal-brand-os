'use client'

import { useAppStore } from '@/lib/store'
import { Sidebar } from './Sidebar'
import { Menu } from 'lucide-react'

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, setSidebarOpen, darkMode } = useAppStore()

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-slate-950 text-white">
        <Sidebar />
        
        {/* Main content */}
        <div 
          className={`transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
          }`}
        >
          {/* Mobile header */}
          <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 z-30 flex items-center px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-300" />
            </button>
            <h1 className="ml-4 font-semibold text-white">AI Personal Brand OS</h1>
          </header>

          {/* Page content */}
          <main className="p-4 lg:p-8 mt-16 lg:mt-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}