import * as Storage from 'utils/storage/StorageManager'
import {
  TLectureAelf,
  TInformationAelf,
  IResponseAelf
} from 'config/types/AelfApi'
import URL from 'config/url.config.json'

export function getformatedDate(): string {
  const d = new Date(Date.now()),
    year = d.getFullYear()
  let month = '' + (d.getMonth() + 1),
    day = '' + d.getDate()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}

export const getDailyGospel = async (): Promise<TLectureAelf | undefined> => {
  const date = getformatedDate()
  const url = URL.AELF + `/messes/${date}/france`
  const res = await fetch(url)
  if (res.status !== 200) return
  const data: IResponseAelf = await res.json()
  const evangile = data.messes[0].lectures.find(
    (e: TLectureAelf) => e.type === 'evangile'
  )
  if (!evangile) return
  let html = evangile.contenu
  html = html.replace(/<\/p>/gi, '\n')
  html = html.replace(/<[^>]+>/gi, '')
  evangile.contenu = html
  await Storage.setDataAsync(Storage.Stored.EVANGILE, evangile)
  return evangile
}

export const getDailySaint = async (): Promise<
  TInformationAelf | undefined
> => {
  const date = getformatedDate()
  const url = URL.AELF + `/informations/${date}/france`
  const res = await fetch(url)
  if (res.status !== 200) return
  const data: TInformationAelf = await res.json()
  await Storage.setDataAsync(Storage.Stored.DAY_INFO, data)
  return data
}
