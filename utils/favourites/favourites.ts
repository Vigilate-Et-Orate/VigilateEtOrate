import { TFavourite } from 'config/types/TFavourite'

export const isFavourite = (id: string, favs: TFavourite[]): boolean => {
  const faved = favs.find((p) => p.prayer == id)
  if (!faved) return false
  return faved.faved
}
