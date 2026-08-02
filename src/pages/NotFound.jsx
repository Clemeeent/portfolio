import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-sm tracking-[0.14em] text-muted uppercase">404</p>
      <h1 className="display max-w-[16ch] text-4xl font-medium text-balance text-ink sm:text-6xl">
        This page doesn’t exist.
      </h1>
      <Link
        to="/"
        className="text-base text-ink underline decoration-hairline underline-offset-4 transition-colors hover:decoration-ink"
      >
        Back to selected works
      </Link>
    </main>
  )
}
