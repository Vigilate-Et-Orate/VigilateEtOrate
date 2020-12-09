/**
 * API Functions to interract with server
 */
// import Constants from 'expo-constants'
import { ToastAndroid } from 'react-native'

import * as StorageManager from 'utils/storage/StorageManager'
import * as api from 'utils/api/baseRequest'
import { ISignInResponse, TUser, IMeResponse } from 'config/types/User'
import { TPrayerResponse, TPrayer } from 'config/types/Prayer'

/**
 * SignIn With Credentials
 */
export const signInCredentials = async (
  email: string,
  password: string
): Promise<boolean> => {
  const res = await api.post<ISignInResponse>('/login', {
    email,
    password
  })

  if (res.error) return false
  ToastAndroid.show('Bienvenue' + res.user.firstname, ToastAndroid.SHORT)
  StorageManager.setDataAsync(StorageManager.Stored.TOKEN, res.token)
  StorageManager.setDataAsync(
    StorageManager.Stored.USER,
    JSON.stringify(res.user)
  )
  return true
}

export const registerCredentials = async (
  email: string,
  firstname: string,
  lastname: string,
  password: string
): Promise<boolean> => {
  const res = await api.post<ISignInResponse>('/register', {
    email,
    firstname,
    lastname,
    password
  })

  if (res.error) return false
  ToastAndroid.show('Bienvenue' + res.user.firstname, ToastAndroid.SHORT)
  StorageManager.setDataAsync(StorageManager.Stored.TOKEN, res.token)
  StorageManager.setDataAsync(
    StorageManager.Stored.USER,
    JSON.stringify(res.user)
  )
  return true
}

/**
 * User
 */
export const getUserData = async (
  token: string
): Promise<TUser | undefined> => {
  const res = await api.get<IMeResponse>('/me', token)
  if (res.error) return
  StorageManager.setDataAsync(StorageManager.Stored.USER, res.user)
  return res.user as TUser
}

/**
 * Prayers
 */
export const getPrayers = async (): Promise<TPrayer[] | undefined> => {
  const res = await api.get<TPrayerResponse>('/prayers')

  if (res.error) return
  StorageManager.setDataAsync(
    StorageManager.Stored.PRAYERS,
    JSON.stringify(res.prayers)
  )
  return res.prayers as TPrayer[]
}
