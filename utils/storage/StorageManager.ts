/**
 * Storage Manager
 */

import { AsyncStorage } from 'react-native'

export enum Stored {
  SUBS = 'subscriptions',
  EVANGILE = 'evangile',
  MY_PRAYER = 'my-prayer',
  DAY_INFO = 'day-info',
  FIRSTNAME = 'firstname',
  INTENTIONS = 'intentions',
  FAVOURITE = 'favourites',
  LATEST_MIGRATION = 'migration',
  PRAYERS = 'prayers',
  USER = 'user',
  TOKEN = 'token'
}

/**
 * Save data
 *
 * @param {string} key - key of item
 * @param {any} data - data to be saved
 */
export const setDataAsync = async (
  key: Stored | string,
  data: string
): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    throw new Error('Failed to store ' + key)
  }
}

/**
 * Retrieve data
 *
 * @param {string} key - key of item to be retreived
 *
 * @return {any}
 */
export const getDataAsync = async <T>(
  key: Stored | string
): Promise<T | null> => {
  const data = await AsyncStorage.getItem(key)
  if (!data) return null
  return JSON.parse(data) as T
}

/**
 * Clear all Stored keys and values
 */
export const clear = async (): Promise<void> => {
  await AsyncStorage.clear()
}
