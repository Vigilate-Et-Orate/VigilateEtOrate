/**
 * Storage Manager
 */

import AsyncStorage from '@react-native-async-storage/async-storage'

export enum Stored {
  NOTIFS = 'notifications',
  EVANGILE = 'evangile',
  // MY_PRAYER = 'my-prayer',
  DAY_INFO = 'day-info',
  INTENTIONS = 'intentions',
  FAVOURITE = 'favourites',
  LATEST_MIGRATION = 'migration',
  PRAYERS = 'prayers',
  USER = 'user',
  TOKEN = 'token'
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const setDataAsync = async (key: Stored, data: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    throw new Error('Failed to store ' + key)
  }
}
/* eslint-enable @typescript-eslint/explicit-module-boundary-types */

export const getSeveralAsync = async (
  keys: Stored[]
): Promise<[string, string | null][]> => {
  try {
    const data = await AsyncStorage.multiGet(keys)
    return data
  } catch (e) {
    throw new Error('Failed to get several keys')
  }
}

export const getDataAsync = async <T>(
  key: Stored | string
): Promise<T | null> => {
  const data = await AsyncStorage.getItem(key)
  if (!data) return null
  return JSON.parse(data) as T
}

export const removeDataAsync = async (key: Stored): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key)
  } catch (e) {
    throw new Error('Failed to delete key=' + key)
  }
}

export const clear = async (): Promise<void> => {
  await AsyncStorage.clear()
}
