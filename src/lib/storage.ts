import type { AttemptRecord } from '../types'

const STORAGE_KEY = 'act-practice/attempts'

export function loadAttempts(): AttemptRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as AttemptRecord[]
  } catch {
    return []
  }
}

export function saveAttempt(attempt: AttemptRecord): void {
  try {
    const attempts = loadAttempts()
    attempts.unshift(attempt)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts))
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — silently skip persistence.
  }
}

export function clearAttempts(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
