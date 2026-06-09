"use client"

import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import { ClipboardCheck, CalendarPlus, Ban } from "lucide-react"

const features = [
  {
    key: "checkin",
    href: "/check-in",
    icon: ClipboardCheck,
    title: "Présence & Check-in",
    desc: "Marquez en 30s qui est présent dans votre atelier",
  },
  {
    key: "creneau",
    href: "/slots/new",
    icon: CalendarPlus,
    title: "Ajouter un créneau",
    desc: "Ouvrez un nouveau créneau pour vos cours",
  },
  {
    key: "resa",
    href: "/slots/new",
    icon: Ban,
    title: "Annulation réservation",
    desc: "Créez un atelier → une réservation de démo est générée automatiquement",
  },
]

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  },
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <h1 className="text-2xl font-bold">Bonjour 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Bienvenue sur Daisy Pro — Gérez vos ateliers créatifs
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {features.map((f) => {
          const Icon = f.icon
          return (
            <motion.div key={f.key} variants={item}>
              <Link
                href={f.href}
                className="group block p-4 rounded-xl border-2 border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-primary/15 group-hover:scale-110">
                    <Icon className="w-5 h-5 text-primary transition-all duration-300 group-hover:rotate-3" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold group-hover:text-primary transition-colors duration-300">
                      {f.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
