import { TPrayer, TPrayersActionTypes } from 'config/types/Prayer'
import CONST from 'config/constants'
import * as Storage from 'utils/storage/StorageManager'

export function updatePrayers(
  prayers: TPrayer[],
  store?: boolean
): TPrayersActionTypes {
  if (store) Storage.setDataAsync(Storage.Stored.PRAYERS, prayers)
  return {
    type: CONST.PRAYERS.PRAYERS_UPDATE,
    prayers
  }
}
