import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-xl font-bold text-primary">✦ Daisy Pro</span>
      </Link>
    </header>
  )
}
