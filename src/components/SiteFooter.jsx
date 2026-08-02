export default function SiteFooter() {
  return (
    <footer className="border-t border-hairline px-5 py-14 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="display max-w-[14ch] text-3xl font-medium text-ink sm:text-5xl">
            Let’s work together.
          </p>
          <a
            href="mailto:clement.lebau@gmail.com"
            className="mt-5 inline-block text-base text-ink underline decoration-hairline underline-offset-4 transition-colors hover:decoration-ink"
          >
            clement.lebau@gmail.com
          </a>
        </div>

        <nav className="flex gap-6 text-sm text-muted">
          <a className="transition-colors hover:text-ink" href="#">
            LinkedIn
          </a>
          <a className="transition-colors hover:text-ink" href="#">
            Read.cv
          </a>
          <a className="transition-colors hover:text-ink" href="#">
            Dribbble
          </a>
        </nav>
      </div>

      <p className="mx-auto mt-14 w-full max-w-[1400px] text-xs text-muted">
        © {new Date().getFullYear()} Clément Lebau. Built with React.
      </p>
    </footer>
  )
}
