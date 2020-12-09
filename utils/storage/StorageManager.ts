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

export const setDataAsync = async (key: Stored, data: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    throw new Error('Failed to store ' + key)
  }
}

export const getSeveralAsync = async (
  keys: Stored[]
): Promise<[string, string][]> => {
  try {
    const data = await AsyncStorage.multiGet(keys)
    console.log('data multi get', data)
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
