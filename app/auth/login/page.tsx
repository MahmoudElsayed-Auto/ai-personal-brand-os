'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/services/auth.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    console.log('[LOGIN] SUBMIT FIRED')
    e.preventDefault()
    e.stopPropagation()

    console.log('[LOGIN] PREVENT DEFAULT CALLED')

    try {
      console.log('[LOGIN] HANDLE LOGIN START')
      const result = await authService.signIn(email, password)
      console.log('[LOGIN] LOGIN SUCCESS', { user: result.user?.id })

      console.log('[LOGIN] REDIRECT CALLED via router.push and router.refresh')
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      console.error('[LOGIN] ERROR:', err)
      setError(err instanceof Error ? err.message : 'Failed to login')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-4 p-6 bg-card border rounded-lg"
      >
        <h1 className="text-2xl font-bold">Log In</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">
          Log In
        </Button>
        <p className="text-sm text-center">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}
