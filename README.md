# Daisy Pro

**Daisy Pro** est une interface SaaS B2B pour les ateliers créatifs. Cette implémentation couvre **3 fonctionnalités clés** du quotidien des artistes.

## Features

| # | Feature | Flux |
|---|---------|------|
| A | **Présence & Check-in** | Liste des ateliers du jour → détail → marquer présent/absent |
| B | **Ajout d'un créneau** | Formulaire (date, heure, durée, capacité, prix) → prévisualisation → confirmation |
| C | **Annulation d'une réservation** | Détail réservation + politique → impact → confirmation avec 3 états |

## Lancer le projet

```bash
npm install
npm run dev      # → http://localhost:3000
npm run build    # build de production
```

Stack : **Next.js 16** + **TailwindCSS v4** + **shadcn/ui** (Base UI)

## Architecture des composants

```
components/
├── layout/          Header + MobileNav (bottom tab)
├── shared/          StateWrapper (loading/empty/error + retry)
├── check-in/        TodayWorkshopsList → WorkshopCard → ParticipantRow + Toggle
├── slots/           SlotForm → SlotPreview → SlotConfirmation
└── reservations/    ReservationDetail → ClientInfo, CancellationPolicy, CancellationDialog
```

### Découpage — pourquoi ?

- **StateWrapper** : centralise les 4 états (loading, empty, error, success) — élimine la duplication dans chaque page. Chaque page reçoit `{loading, error, data, children}` et passe le fetch au parent.
- **Séparation feature par dossier** : chaque feature a son propre module — quelqu'un qui reprend le code demain voit immédiatement le périmètre de chaque fonctionnalité.
- **MobileNav en bas** : mobile-first (360–414px). Thumb zone = navigation à une main. 4 onglets : Accueil, Check-in, Créneau, Réservation.

### Arbitrages UI

| Décision | Pourquoi |
|----------|----------|
| **Skeletons** plutôt que spinners | Donne un aperçu du contenu à venir, plus natif |
| **Icônes emoji** en remplacement d'icônes vectorielles | Pas de dépendance lourde, évocateur immédiat, léger |
| **Créme `#FCF8E8` en fond** | Charte Daisy — chaleureux, atelier créatif |
| **Violet `#800080` primaire / Corail `#F24E3E` accent** | Contrasté, lisible, personnalité forte |
| **Preview avant création** | Évite les erreurs de saisie — l'artiste vérifie avant de valider |
| **3 états d'annulation** | Non annulable (rouge), warning (jaune, frais), succès (vert, gratuit) — visible en 1 coup d'œil |
| **Simulated latency (800ms)** | Volontaire — rend les loading states visibles en démo |

## API Routes (mock)

Toutes les routes retournent `{ data?, error? }` avec un délai simulé.

- `GET /api/workshops` — tous les ateliers
- `GET /api/workshops/today` — ateliers du jour
- `GET /api/workshops/:id` — détail d'un atelier avec participants
- `PATCH /api/workshops/:id/checkin` — toggle présence
- `POST /api/slots` — créer un créneau
- `GET /api/reservations/:id` — détail réservation
- `POST /api/reservations/:id/cancel` — annuler (+ calcul impact)
