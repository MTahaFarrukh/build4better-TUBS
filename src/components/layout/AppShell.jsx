import { Smartphone } from 'lucide-react'

export default function AppShell({ children, showBrand = true, onBrandClick }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(22,125,104,0.14),transparent_65%)]"
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-10 pt-5 sm:px-6 lg:px-8">
        {showBrand && (
          <header className="mb-6 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onBrandClick}
              className="group flex items-center gap-3 rounded-2xl text-left focus-visible:outline-offset-4"
              aria-label="Digital Ustaad home"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest text-ivory shadow-soft transition-transform duration-300 group-hover:scale-[1.03]">
                <Smartphone className="h-6 w-6" aria-hidden="true" />
              </span>
              <span>
                <span className="font-display block text-xl font-semibold tracking-tight text-forest sm:text-2xl">
                  Digital Ustaad
                </span>
                <span className="text-sm text-forest-muted">Learn your phone with patience</span>
              </span>
            </button>
          </header>
        )}

        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </div>
  )
}
