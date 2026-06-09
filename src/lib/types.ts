export interface Workshop {
  id: string
  title: string
  date: string
  time: string
  duration: number
  studio: string
  capacity: number
  fillRate: number
  price: number
  participants: Participant[]
  reservationId?: string
}

export interface Participant {
  id: string
  name: string
  email: string
  avatar?: string
  isPresent: boolean
  hasCancelled: boolean
}

export interface Reservation {
  id: string
  workshopId: string
  workshopTitle: string
  workshopDate: string
  workshopTime: string
  client: {
    name: string
    email: string
    phone: string
  }
  date: string
  status: 'confirmed' | 'cancelled' | 'pending'
  createdAt: string
}

export interface CancellationInfo {
  isCancellable: boolean
  reason?: string
}

export interface SlotFormData {
  title: string
  date: string
  time: string
  duration: number
  studio: string
  capacity: number
  price: number
}

export type StatusState = 'loading' | 'empty' | 'error' | 'success'

export interface ApiResponse<T> {
  data?: T
  error?: string
}
