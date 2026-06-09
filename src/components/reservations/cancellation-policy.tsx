export function CancellationPolicy() {
  return (
    <div className="rounded-xl border-2 border-border bg-card p-4 space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Politique d'annulation</h3>
      <p className="text-sm">
        Annulation possible <strong>jusqu'à 3h avant</strong> le début de l'atelier.
      </p>
      <p className="text-sm text-muted-foreground">
        Passé ce délai, l'annulation n'est plus possible.
      </p>
    </div>
  )
}
