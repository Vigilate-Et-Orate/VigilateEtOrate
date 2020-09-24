import * as Storage from 'utils/storage/StorageManager'
import { Favourite } from 'config/types/Favourite'

export const isFavourite = async (name: string): Promise<boolean> => {
  const data = await Storage.getDataAsync(Storage.Stored.FAVOURITE)
  if (!data) return false
  const parsed: Favourite[] = JSON.parse(data)
  const faved = parsed.find((p) => p.name == name)?.fav
  if (!faved) return false
  return faved
}

export const toggleFavourite = async (name: string): Promise<void> => {
  const data = await Storage.getDataAsync(Storage.Stored.FAVOURITE)
  if (!data) return
  const parsed: Favourite[] = JSON.parse(data)
  parsed.forEach((p) => {
    if (p.name == name) p.fav = !p.fav
  })
  await Storage.setDataAsync(Storage.Stored.FAVOURITE, JSON.stringify(parsed))
}
