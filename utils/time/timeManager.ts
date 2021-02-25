export type TTime = {
  hour: number
  minute: number
  daysLeft: number
  repeat: boolean
}

export const timeToString = (time: TTime): string => {
  return `${time.hour}:${time.minute}|${time.daysLeft}${
    time.repeat ? '|R' : ''
  }`
}

export const stringToTime = (time: string): TTime | undefined => {
  const parsed = time.split('|')
  if (parsed.length < 2) return
  const repeat = parsed.length === 3
  const t = parsed[0].split(':')
  if (t.length < 2) return
  const daysLeft = +parsed[1]
  return {
    hour: +t[0],
    minute: +t[1],
    daysLeft,
    repeat
  }
}

export const timeToTimestamp = (time: TTime): number => {
  const date = new Date()
  date.setHours(time.hour)
  date.setMinutes(time.minute)
  return date.getTime()
}

export const stringToTimestamp = (time: string): number => {
  const parsed = time.split('|')
  if (parsed.length < 2) return -1
  const dateParsed = parsed[0].split(':')
  const date = new Date(Date.now())
  date.setHours(+dateParsed[0] - date.getTimezoneOffset() / 60)
  date.setMinutes(+dateParsed[1])
  return date.getTime()
}

export const timestampToReadable = (time: number): string => {
  const date = new Date(time)
  const dateString = `${date.getHours()}:${date.getMinutes()}${
    date.getMinutes() > 9 ? '' : '0'
  }`
  return dateString
}

export const stringTimeToReadable = (time: string): string => {
  const timestamp = stringToTimestamp(time)
  return timestampToReadable(timestamp)
}
