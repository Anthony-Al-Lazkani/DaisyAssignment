import Database from "better-sqlite3"
import path from "path"
import type { Workshop, Participant, Reservation, SlotFormData } from "./types"

const DB_PATH = path.join(process.cwd(), "src", "data", "daisy.db")

let _db: Database.Database | null = null

function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH)
    _db.pragma("journal_mode = WAL")
    _db.pragma("foreign_keys = ON")
  }
  return _db
}

function initSchema(): void {
  const db = getDb()

  db.exec(`
    CREATE TABLE IF NOT EXISTS workshops (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      duration INTEGER NOT NULL,
      studio TEXT NOT NULL,
      capacity INTEGER NOT NULL,
      fill_rate INTEGER DEFAULT 0,
      price REAL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS participants (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      avatar TEXT,
      is_present INTEGER DEFAULT 0,
      has_cancelled INTEGER DEFAULT 0,
      workshop_id TEXT NOT NULL,
      FOREIGN KEY (workshop_id) REFERENCES workshops(id)
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      workshop_id TEXT NOT NULL,
      client_name TEXT NOT NULL,
      client_email TEXT NOT NULL,
      client_phone TEXT,
      date TEXT NOT NULL,
      status TEXT DEFAULT 'confirmed' CHECK(status IN ('confirmed', 'cancelled', 'pending')),
      cancellation_deadline TEXT,
      cancellation_fee_percent REAL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (workshop_id) REFERENCES workshops(id)
    );
  `)
}

initSchema()

const DEFAULT_PARTICIPANTS = [
  { name: "Sophie Martin", email: "sophie.m@email.com" },
  { name: "Lucas Bernard", email: "lucas.b@email.com" },
  { name: "Emma Petit", email: "emma.p@email.com" },
  { name: "Thomas Dubois", email: "thomas.d@email.com" },
  { name: "Camille Roux", email: "camille.r@email.com" },
  { name: "Antoine Moreau", email: "antoine.m@email.com" },
  { name: "Julie Leroy", email: "julie.l@email.com" },
  { name: "Nicolas Simon", email: "nicolas.s@email.com" },
]

export function getWorkshops(): Workshop[] {
  const db = getDb()
  const rows = db.prepare("SELECT * FROM workshops ORDER BY date, time").all() as any[]

  return rows.map((w) => {
    const participants = getParticipantsByWorkshop(w.id)
    const activeCount = participants.filter((p) => !p.hasCancelled).length
    const fillRate = w.capacity > 0 ? Math.round((activeCount / w.capacity) * 100) : 0

    const res = getReservationByWorkshop(w.id)

    return {
      id: w.id,
      title: w.title,
      date: w.date,
      time: w.time,
      duration: w.duration,
      studio: w.studio,
      capacity: w.capacity,
      fillRate,
      price: w.price,
      participants,
      reservationId: res?.id,
    }
  })
}

export function getWorkshop(id: string): Workshop | undefined {
  const db = getDb()
  const w = db.prepare("SELECT * FROM workshops WHERE id = ?").get(id) as any
  if (!w) return undefined

  const participants = getParticipantsByWorkshop(w.id)
  const activeCount = participants.filter((p) => !p.hasCancelled).length
  const fillRate = w.capacity > 0 ? Math.round((activeCount / w.capacity) * 100) : 0

  const res = getReservationByWorkshop(w.id)

  return {
    id: w.id,
    title: w.title,
    date: w.date,
    time: w.time,
    duration: w.duration,
    studio: w.studio,
    capacity: w.capacity,
    fillRate,
    price: w.price,
    participants,
    reservationId: res?.id,
  }
}

export function getTodayWorkshops(): Workshop[] {
  const today = new Date().toISOString().split("T")[0]
  const db = getDb()
  const rows = db.prepare("SELECT * FROM workshops WHERE date = ? ORDER BY time").all(today) as any[]

  return rows.map((w) => {
    const participants = getParticipantsByWorkshop(w.id)
    const activeCount = participants.filter((p) => !p.hasCancelled).length
    const fillRate = w.capacity > 0 ? Math.round((activeCount / w.capacity) * 100) : 0

    const res = getReservationByWorkshop(w.id)

    return {
      id: w.id,
      title: w.title,
      date: w.date,
      time: w.time,
      duration: w.duration,
      studio: w.studio,
      capacity: w.capacity,
      fillRate,
      price: w.price,
      participants,
      reservationId: res?.id,
    }
  })
}

function getParticipantsByWorkshop(workshopId: string): Participant[] {
  const db = getDb()
  const rows = db
    .prepare("SELECT * FROM participants WHERE workshop_id = ?")
    .all(workshopId) as any[]

  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    email: p.email,
    avatar: p.avatar ?? undefined,
    isPresent: Boolean(p.is_present),
    hasCancelled: Boolean(p.has_cancelled),
  }))
}

export function updateParticipantPresence(
  workshopId: string,
  participantId: string,
  isPresent: boolean
): boolean {
  const db = getDb()
  const workshop = db.prepare("SELECT id FROM workshops WHERE id = ?").get(workshopId)
  if (!workshop) return false

  const p = db
    .prepare("SELECT id FROM participants WHERE id = ? AND workshop_id = ?")
    .get(participantId, workshopId)
  if (!p) return false

  db.prepare("UPDATE participants SET is_present = ? WHERE id = ?").run(
    isPresent ? 1 : 0,
    participantId
  )
  return true
}

export function getReservation(id: string): Reservation | undefined {
  const db = getDb()
  const r = db
    .prepare(
      `SELECT r.*, w.title as workshop_title, w.date as workshop_date, w.time as workshop_time
       FROM reservations r
       JOIN workshops w ON w.id = r.workshop_id
       WHERE r.id = ?`
    )
    .get(id) as any

  if (!r) return undefined

  return {
    id: r.id,
    workshopId: r.workshop_id,
    workshopTitle: r.workshop_title,
    workshopDate: r.workshop_date,
    workshopTime: r.workshop_time,
    client: {
      name: r.client_name,
      email: r.client_email,
      phone: r.client_phone ?? "",
    },
    date: r.date,
    status: r.status,
    cancellationPolicy: {
      deadline: r.cancellation_deadline ?? "",
      feePercent: r.cancellation_fee_percent,
    },
    createdAt: r.created_at,
  }
}

export function cancelReservation(id: string): boolean {
  const db = getDb()
  const result = db
    .prepare("UPDATE reservations SET status = 'cancelled' WHERE id = ? AND status != 'cancelled'")
    .run(id)
  return result.changes > 0
}

export function createWorkshop(
  data: SlotFormData
): { workshop: Workshop; reservationId: string } {
  const db = getDb()
  const id = `w${Date.now()}`
  const fillRate = 0

  const insertWorkshop = db.prepare(
    `INSERT INTO workshops (id, title, date, time, duration, studio, capacity, fill_rate, price)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )

  const insertParticipant = db.prepare(
    `INSERT INTO participants (id, name, email, is_present, has_cancelled, workshop_id)
     VALUES (?, ?, ?, 0, 0, ?)`
  )

  const insertReservation = db.prepare(
    `INSERT INTO reservations (id, workshop_id, client_name, client_email, client_phone, date, status, cancellation_deadline, cancellation_fee_percent, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )

  const transaction = db.transaction(() => {
    insertWorkshop.run(
      id,
      data.title,
      data.date,
      data.time,
      data.duration,
      data.studio,
      data.capacity,
      fillRate,
      data.price
    )

    const participants: Participant[] = DEFAULT_PARTICIPANTS.map((p, i) => {
      const pid = `p${id}-${i}`
      insertParticipant.run(pid, p.name, p.email, id)
      return {
        id: pid,
        name: p.name,
        email: p.email,
        isPresent: false,
        hasCancelled: false,
      }
    })

    const reservationId = `r${Date.now()}`
    const deadline = `${data.date}T${data.time}:00Z`
    const today = new Date().toISOString().split("T")[0]

    insertReservation.run(
      reservationId,
      id,
      "Sophie Martin",
      "sophie.m@email.com",
      "+33 6 12 34 56 78",
      today,
      "confirmed",
      deadline,
      50,
      new Date().toISOString()
    )

    return { participants, reservationId }
  })

  const { participants, reservationId } = transaction()

  return {
    workshop: {
      id,
      title: data.title,
      date: data.date,
      time: data.time,
      duration: data.duration,
      studio: data.studio,
      capacity: data.capacity,
      fillRate,
      price: data.price,
      participants,
    },
    reservationId,
  }
}

function getReservationByWorkshop(workshopId: string): { id: string } | undefined {
  const db = getDb()
  return db.prepare("SELECT id FROM reservations WHERE workshop_id = ? LIMIT 1").get(workshopId) as any
}

export function updateWorkshop(
  id: string,
  data: Partial<Pick<Workshop, "title" | "time" | "duration" | "studio" | "capacity" | "price">>
): boolean {
  const db = getDb()
  const fields: string[] = []
  const values: any[] = []

  if (data.title !== undefined) { fields.push("title = ?"); values.push(data.title) }
  if (data.time !== undefined) { fields.push("time = ?"); values.push(data.time) }
  if (data.duration !== undefined) { fields.push("duration = ?"); values.push(data.duration) }
  if (data.studio !== undefined) { fields.push("studio = ?"); values.push(data.studio) }
  if (data.capacity !== undefined) { fields.push("capacity = ?"); values.push(data.capacity) }
  if (data.price !== undefined) { fields.push("price = ?"); values.push(data.price) }

  if (fields.length === 0) return false

  values.push(id)
  const result = db.prepare(`UPDATE workshops SET ${fields.join(", ")} WHERE id = ?`).run(...values)
  return result.changes > 0
}

export function deleteReservation(id: string): boolean {
  const db = getDb()
  const result = db.prepare("DELETE FROM reservations WHERE id = ?").run(id)
  return result.changes > 0
}

export function delay(ms: number = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
