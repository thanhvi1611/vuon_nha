import dayjs from 'dayjs'

export function shouldNotify(now, reminderTime) {
  const current = dayjs(now).format('HH:mm')
  return current === reminderTime
}
