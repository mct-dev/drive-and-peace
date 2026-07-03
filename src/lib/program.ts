import { formatDateISO, parseISODate } from './dates'
import type { ScheduleSlot } from '../types'

export const PROGRAM_DAYS = 90
export const PROGRAM_WEEKS = 12
export const DAYS_PER_WEEK = 7

export function daysBetween(startISO: string, endISO: string): number {
  const start = parseISODate(startISO).getTime()
  const end = parseISODate(endISO).getTime()
  return Math.floor((end - start) / (1000 * 60 * 60 * 24))
}

export function getDayNumber(startDate: string, dateISO: string): number {
  const diff = daysBetween(startDate, dateISO) + 1
  return Math.max(1, Math.min(PROGRAM_DAYS, diff))
}

export function getWeekNumber(startDate: string, dateISO: string): number {
  const dayNum = getDayNumber(startDate, dateISO)
  return Math.ceil(dayNum / DAYS_PER_WEEK)
}

export function getDayInWeek(startDate: string, dateISO: string): number {
  const dayNum = getDayNumber(startDate, dateISO)
  return ((dayNum - 1) % DAYS_PER_WEEK) + 1
}

export function getProgramWeekStart(startDate: string, weekNumber: number): string {
  const d = parseISODate(startDate)
  d.setDate(d.getDate() + (weekNumber - 1) * DAYS_PER_WEEK)
  return formatDateISO(d)
}

export function getDatesForProgramWeek(startDate: string, weekNumber: number): string[] {
  const weekStart = getProgramWeekStart(startDate, weekNumber)
  const dates: string[] = []
  const d = parseISODate(weekStart)
  for (let i = 0; i < DAYS_PER_WEEK; i++) {
    dates.push(formatDateISO(d))
    d.setDate(d.getDate() + 1)
  }
  return dates
}

export function generateDefaultSchedule(startHour = 6, endHour = 24): ScheduleSlot[] {
  const slots: ScheduleSlot[] = []
  for (let h = startHour; h <= endHour; h++) {
    const hour = h === 24 ? '00:00' : `${String(h).padStart(2, '0')}:00`
    const label = h === 12 ? '12:00 (Noon)' : h === 24 ? '12:00 (Midnight)' : hour
    slots.push({ hour: label, note: '' })
  }
  return slots
}

export function generateDriverSchedule(): ScheduleSlot[] {
  const slots: ScheduleSlot[] = []
  for (let h = 5; h <= 22; h++) {
    const hour = `${String(h).padStart(2, '0')}:00`
    slots.push({ hour, note: '' })
  }
  return slots
}

export function emptyMissions(count = 10): { id: string; text: string; done: boolean }[] {
  return Array.from({ length: count }, () => ({
    id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    text: '',
    done: false,
  }))
}
