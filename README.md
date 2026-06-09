# Daisy Pro

**Daisy Pro** est une interface SaaS B2B pour les ateliers créatifs — avec une **base de données SQLite** pour une persistance réelle.

## Features

| # | Feature | Flux |
|---|---------|------|
| A | **Présence & Check-in** | Liste des ateliers du jour → détail → marquer présent/absent |
| B | **Ajout d'un créneau** | Formulaire → prévisualisation → confirmation (persisté en SQLite) |
| C | **Annulation d'une réservation** | Détail + politique → impact → confirmation avec 3 états |

## Lancer le projet

```bash
npm install
npm run dev       # → http://localhost:3000 (base vide)
```

Stack : **Next.js 16** + **TailwindCSS v4** + **shadcn/ui** + **better-sqlite3**

## Architecture

```
src/
├── lib/
│   ├── db.ts          # Connection SQLite, schéma, CRUD complet
│   └── types.ts       # Types partagés
├── app/api/           # 7 routes API → SQLite
├── components/
│   ├── check-in/      # Liste ateliers → détail → toggle présence
│   ├── slots/         # Formulaire → preview → confirmation
│   └── reservations/  # Détail → politique → dialogue d'annulation
└── data/
    └── daisy.db       # Fichier SQLite (créé automatiquement)
```

### Démarrage à vide

La base de données est créée automatiquement et vide au premier lancement.
1. **Créer un atelier** via `/slots/new` (formulaire date/heure/durée/capacité/prix)
2. La création génère automatiquement 8 participants fictifs + 1 réservation de démo
3. L'atelier apparaît dans la **liste du jour** → on peut y faire l'appel
4. La réservation permet de tester le **flux d'annulation** (3 états)

### Découpage technique

- **SQLite (`better-sqlite3`)** : chaque mutation (`check-in`, `création`, `annulation`) écrit immédiatement sur disque.
- **Participants générés à la création** : liste statique de 8 noms créés en DB lors de l'ajout d'un créneau (pas de seed préalable).
- **`serverExternalPackages`** : configuré dans `next.config.ts` pour isoler `better-sqlite3` côté serveur.

### Arbitrages UI

| Décision | Pourquoi |
|----------|----------|
| **Skeletons** | Donne un aperçu du contenu à venir |
| **Mobile-first 360–414px** | Usage quotidien sur tablette/téléphone en atelier |
| **Crème `#FCF8E8` / Violet `#800080` / Corail `#F24E3E`** | Charte Daisy — chaleureux, atelier créatif |
| **Preview avant création** | L'artiste vérifie avant de valider |
| **3 états d'annulation** | Non annulable (rouge), warning (frais), gratuit (vert) |
| **Latence simulée (800ms)** | Rend les loading states visibles en démo |

## API Routes

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/workshops` | GET | Tous les ateliers |
| `/api/workshops/today` | GET | Ateliers du jour |
| `/api/workshops/:id` | GET | Détail + participants |
| `/api/workshops/:id/checkin` | PATCH | Toggle présence |
| `/api/slots` | POST | Créer un créneau (+ participants + réservation) |
| `/api/reservations/:id` | GET | Détail réservation |
| `/api/reservations/:id/cancel` | POST | Annuler (avec calcul d'impact) |
