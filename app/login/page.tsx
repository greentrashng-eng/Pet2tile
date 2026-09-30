'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const client = supabase()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const { error: signInError } =
      await client.auth.signInWithPassword({
        email,
        password,
      })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.replace('/dashboard')
    router.refresh()
  }

  return (
    <main className="auth-wrap">
      <section className="auth-card">
        <div className="brand">
          <div className="brand-mark">P2</div>
          <span>Pet2tile</span>
        </div>

        <h1>Staff login</h1>

        <p style={{ color: 'var(--muted)' }}>
          Sign in to manage collections and recyclable records.
        </p>

        <form onSubmit={submit}>
          <label className="label" htmlFor="email">
            Email
          </label>

          <input
            className="input"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="label" htmlFor="password">
            Password
          </label>

          <input
            className="input"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="notice error">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button
              className="btn btn-primary"
              disabled={loading}
              type="submit"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            <Link className="btn" href="/">
              Back
            </Link>
          </div>
        </form>

        <div className="notice">
          New staff accounts should be created through Supabase
          Authentication and assigned a Pet2tile role in the
          <code>profiles</code> table.
        </div>
      </section>
    </main>
  )
}
