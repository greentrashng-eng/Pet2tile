'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function PickupPage() {
  const client = supabase()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    material_type: 'PET',
    address: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function change(field: keyof typeof form, value: string) {
    setForm(current => ({ ...current, [field]: value }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    const reference = `PICK-${Date.now()}`

    const { error: insertError } = await client
      .from('pickup_requests')
      .insert({ ...form, reference })

    if (insertError) {
      setError(insertError.message)
    } else {
      setMessage(`Pickup request received. Reference: ${reference}`)
      setForm({
        name: '',
        phone: '',
        material_type: 'PET',
        address: '',
      })
    }

    setLoading(false)
  }

  return (
    <main>
      <header className="header">
        <div className="container header-inner">
          <Link className="brand" href="/">
            <div className="brand-mark">P2</div>
            <span>Pet2tile</span>
          </Link>

          <Link className="btn" href="/login">
            Staff Login
          </Link>
        </div>
      </header>

      <section className="container pickup-page">
        <div className="eyebrow">Community collection</div>

        <h1 style={{ fontSize: 40 }}>
          Request a recyclable pickup
        </h1>

        <p
          style={{
            color: 'var(--muted)',
            maxWidth: 720,
          }}
        >
          Provide your contact details and location. Green Trash can use this
          request to coordinate collection.
        </p>

        <form className="card pickup-form" onSubmit={submit}>
          <div className="form-grid">
            <div>
              <label className="label" htmlFor="name">
                Name
              </label>

              <input
                className="input"
                id="name"
                value={form.name}
                onChange={e => change('name', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="phone">
                Phone
              </label>

              <input
                className="input"
                id="phone"
                value={form.phone}
                onChange={e => change('phone', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="material">
                Material
              </label>

              <select
                className="input"
                id="material"
                value={form.material_type}
                onChange={e =>
                  change('material_type', e.target.value)
                }
              >
                <option>PET</option>
                <option>LDPE</option>
                <option>HDPE</option>
                <option>CARTONS</option>
              </select>
            </div>

            <div className="full">
              <label className="label" htmlFor="address">
                Pickup address
              </label>

              <input
                className="input"
                id="address"
                value={form.address}
                onChange={e => change('address', e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="notice error">
              {error}
            </div>
          )}

          {message && (
            <div className="notice">
              {message}
            </div>
          )}

          <div className="form-actions">
            <button
              className="btn btn-primary"
              disabled={loading}
              type="submit"
            >
              {loading ? 'Submitting…' : 'Submit request'}
            </button>

            <Link className="btn" href="/">
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  )
}
