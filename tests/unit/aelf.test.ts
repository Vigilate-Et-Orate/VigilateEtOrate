import * as fetchAelf from '../../utils/aelf/fetchAelf'

test('getFormatedDate', () => {
  const date = new Date(Date.now())
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  expect(fetchAelf.getformatedDate()).toBe([year, month, day].join('-'))
})
