import * as Storage from 'utils/storage/StorageManager'
import { TFavourite } from 'config/types/Favourite'

export const isFavourite = async (
  id: string,
  favs: TFavourite[]
): Promise<boolean> => {
  let data: TFavourite[] | null
  if (favs && favs.length > 0) {
    data = favs
  } else {
    data = await Storage.getDataAsync<TFavourite[]>(Storage.Stored.FAVOURITE)
  }
  if (!data) return false
  const faved = data.find((p) => p.prayer == id)
  if (!faved) return false
  return faved.faved
}
