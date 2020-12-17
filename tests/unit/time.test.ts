import {
  TTime,
  timeToString,
  stringTimeToReadable
} from 'utils/time/timeManager'

test('Time To String', () => {
  const time: TTime = {
    hour: 10,
    minute: 10,
    repeat: true,
    daysLeft: 0
  }
  expect(timeToString(time)).toBe('10:10|0|R')
})

test('String to Time Readable', () => {
  const time = '10:10'
  expect(stringTimeToReadable(time)).toBe('11:10')
})
