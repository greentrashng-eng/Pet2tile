import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

type Profile = {
  full_name: string
  phone: string | null
  role: 'admin' | 'hub_operator' | 'collector'
  is_active: boolean
}

type Price = {
  material_type: string
  buy_price: number
}

type Pickup = {
  reference: string
  name: string
  phone: string
  material_type: string | null
  address: string
  status: string
  created_at: string
}

type WeighIn = {
  reference: string
  material_type: string
  verified_weight_kg: number | null
  payout_amount: number | null
  status: string
  created_at: string
}

export default async function DashboardPage() {
  const client = await createClient()

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await client
    .from('profiles')
    .select('full_name,phone,role,is_active')
    .eq('id', user.id)
    .single<Profile>()

  if (!profile || !profile.is_active) redirect('/login')

  const [
    { count: collectorCount },
    { count: pickupCount },
    { count: weighInCount },
    { data: prices },
    { data: pickups },
    { data: weighIns },
  ] = await Promise.all([
    client
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'collector'),

    client
      .from('pickup_requests')
      .select('*', { count: 'exact', head: true }),

    client
      .from('weigh_ins')
      .select('*', { count: 'exact', head: true }),

    client
      .from('material_prices')
      .select('material_type,buy_price')
      .eq('is_active', true)
      .order('material_type')
      .returns<Price[]>(),

    client
      .from('pickup_requests')
      .select(
        'reference,name,phone,material_type,address,status,created_at'
      )
      .order('created_at', { ascending: false })
      .limit(8)
      .returns<Pickup[]>(),

    client
      .from('weigh_ins')
      .select(
        'reference,material_type,verified_weight_kg,payout_amount,status,created_at'
      )
      .order('created_at', { ascending: false })
      .limit(8)
      .returns<WeighIn[]>(),
  ])

  async function signOut() {
    'use server'

    const c = await createClient()
    await c.auth.signOut()
    redirect('/login')
  }

  return (
    <main>
      <header className="header">
        <div className="container header-inner">
          <div className="brand">
            <div className="brand-mark">P2</div>
            <span>Pet2tile</span>
          </div>

          <form action={signOut}>
            <button className="btn" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <section className="container dashboard">
        <div className="topline">
          <div>
            <div className="eyebrow">Green Trash Limited</div>
            <h1>Welcome, {profile.full_name}</h1>
            <p>
              Role: <strong>{profile.role}</strong>. Pet2tile operational
              dashboard.
            </p>
          </div>
        </div>

        <div className="stat-grid">
          <div className="card stat-card">
            <div className="label-sm">Collectors</div>
            <div className="value">{collectorCount ?? 0}</div>
            <div className="sub">Registered collector profiles</div>
          </div>

          <div className="card stat-card">
            <div className="label-sm">Pickup requests</div>
            <div className="value">{pickupCount ?? 0}</div>
            <div className="sub">Community requests</div>
          </div>

          <div className="card stat-card">
            <div className="label-sm">Weigh-ins</div>
            <div className="value">{weighInCount ?? 0}</div>
            <div className="sub">Recorded collection entries</div>
          </div>

          <div className="card stat-card">
            <div className="label-sm">Active prices</div>
            <div className="value">{prices?.length ?? 0}</div>
            <div className="sub">Material price records</div>
          </div>
        </div>

        <section className="section">
          <h2>Current buying prices</h2>

          <div className="card table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Price per kg</th>
                </tr>
              </thead>

              <tbody>
                {(prices ?? []).map((price) => (
                  <tr key={price.material_type}>
                    <td>{price.material_type}</td>
                    <td>
                      ₦{Number(price.buy_price).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section">
          <h2>Recent pickup requests</h2>

          <div className="card table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Name</th>
                  <th>Material</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {(pickups ?? []).map((item) => (
                  <tr key={item.reference}>
                    <td>{item.reference}</td>
                    <td>{item.name}</td>
                    <td>{item.material_type ?? '—'}</td>
                    <td>
                      <span className="badge badge-green">
                        {item.status}
                      </span>
                    </td>
                    <td>{new Date(item.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section">
          <h2>Recent weigh-ins</h2>

          <div className="card table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Material</th>
                  <th>Weight</th>
                  <th>Payout</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {(weighIns ?? []).map((item) => (
                  <tr key={item.reference}>
                    <td>{item.reference}</td>
                    <td>{item.material_type}</td>
                    <td>
                      {item.verified_weight_kg ?? '—'} kg
                    </td>
                    <td>
                      {item.payout_amount != null
                        ? `₦${Number(item.payout_amount).toLocaleString()}`
                        : '—'}
                    </td>
                    <td>
                      <span className="badge badge-amber">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  )
}
