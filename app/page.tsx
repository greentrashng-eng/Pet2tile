import Link from 'next/link'

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <div className="eyebrow">Green Trash Limited</div>

          <h1>Pet2tile</h1>

          <p>
            A digital operational platform for recyclable collection,
            weighing, material pricing, evidence, inventory and reporting.
          </p>

          <div className="actions">
            <Link href="/pickup" className="button primary">
              Request Pickup
            </Link>

            <Link href="/login" className="button">
              Staff Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
