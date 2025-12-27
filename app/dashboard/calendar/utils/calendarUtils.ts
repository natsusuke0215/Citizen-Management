import { TimeSlot } from '../types'

export const getTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = []
  for (let hour = 8; hour <= 22; hour++) {
    slots.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      hour
    })
  }
  return slots
}

