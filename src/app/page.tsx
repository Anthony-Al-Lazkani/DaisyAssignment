import Link from "next/link"

const features = [
  {
    href: "/check-in",
    icon: "✅",
    title: "Présence & Check-in",
    desc: "Marquez en 30s qui est présent dans votre atelier",
    color: "border-primary/30 hover:border-primary",
  },
  {
    href: "/slots/new",
    icon: "➕",
    title: "Ajouter un créneau",
    desc: "Ouvrez un nouveau créneau pour vos cours",
    color: "border-primary/30 hover:border-primary",
  },
  {
    href: "/reservations/r1",
    icon: "📋",
    title: "Annulation réservation",
    desc: "Consultez et gérez les annulations",
    color: "border-primary/30 hover:border-primary",
  },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bonjour 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Bienvenue sur Daisy Pro — Gérez vos ateliers créatifs
        </p>
      </div>

      <div className="space-y-4">
        {features.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className={`block p-4 rounded-xl border-2 bg-card transition-all ${f.color}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">{f.icon}</span>
              <div>
                <h2 className="font-semibold">{f.title}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
