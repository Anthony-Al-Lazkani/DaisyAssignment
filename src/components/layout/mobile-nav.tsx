"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { House, ClipboardCheck, CalendarPlus, Ticket } from "lucide-react"

const navItems = [
  { href: "/", label: "Accueil", icon: House },
  { href: "/check-in", label: "Check-in", icon: ClipboardCheck },
  { href: "/slots/new", label: "Créneau", icon: CalendarPlus },
  { href: "/reservations/r1", label: "Résa.", icon: Ticket },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 text-xs transition-all duration-200 relative ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <span className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? "scale-110" : ""}`} />
              <span className={isActive ? "font-semibold" : ""}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
