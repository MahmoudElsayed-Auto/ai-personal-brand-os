'use client'

import { useAppStore } from '@/lib/store'
import { Moon, Sun } from 'lucide-react'

export function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useAppStore()

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <Sun className="w-5 h-5 text-amber-400" />
      ) : (
        <Moon className="w-5 h-5 text-slate-300" />
      )}
    </button>
  )
}