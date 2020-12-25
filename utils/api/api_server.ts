/**
 * API Functions to interract with server
 */
// import Constants from 'expo-constants'
import { ToastAndroid } from 'react-native'
import * as Device from 'expo-device'

import * as StorageManager from 'utils/storage/StorageManager'
import * as api from 'utils/api/baseRequest'
import { ISignInResponse, TUser, IMeResponse } from 'config/types/User'
import { TPrayerResponse, TPrayer } from 'config/types/Prayer'
import {
  TFavourite,
  TFavouriteResponse,
  TToggleFavResponse
} from 'config/types/Favourite'
import { TDevice, TDeviceResponse } from 'config/types/TDevices'
import { TNotif, TNotifResponse, TNotifsResponse } from 'config/types/TNotif'

/**
 * SignIn With Credentials
 */
export const signInCredentials = async (
  email: string,
  password: string
): Promise<{ user: TUser; token: string } | undefined> => {
  const res = await api.post<ISignInResponse>('/login', {
    email,
    password
  })

  if (res.error) return
  ToastAndroid.show('Bienvenue' + res.user.firstname, ToastAndroid.SHORT)
  StorageManager.setDataAsync(StorageManager.Stored.TOKEN, res.token)
  StorageManager.setDataAsync(
    StorageManager.Stored.USER,
    JSON.stringify(res.user)
  )
  return {
    user: res.user,
    token: res.token
  }
}

export const registerCredentials = async (
  email: string,
  firstname: string,
  lastname: string,
  password: string
): Promise<{ user: TUser; token: string } | undefined> => {
  const res = await api.post<ISignInResponse>('/register', {
    email,
    firstname,
    lastname,
    password
  })

  if (res.error) return
  ToastAndroid.show('Bienvenue' + res.user.firstname, ToastAndroid.SHORT)
  StorageManager.setDataAsync(StorageManager.Stored.TOKEN, res.token)
  StorageManager.setDataAsync(
    StorageManager.Stored.USER,
    JSON.stringify(res.user)
  )
  return {
    user: res.user,
    token: res.token
  }
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
 * Device
 */
export const registerDevice = async (
  token: string,
  deviceToken: string
): Promise<TDevice | undefined> => {
  const res = await api.post<TDeviceResponse>(
    '/devices',
    {
      name: Device.deviceName,
      token: deviceToken
    },
    token
  )

  if (res.error) return
  return res
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

/**
 * Favourites
 */
export const getFavourites = async (
  tok?: string
): Promise<TFavourite[] | undefined> => {
  let token = tok
  if (!token) {
    const data = await StorageManager.getDataAsync<string>(
      StorageManager.Stored.TOKEN
    )
    if (!data) return
    token = data
  }
  const res = await api.get<TFavouriteResponse>('/favourites', token)
  if (res.error) return
  StorageManager.setDataAsync(StorageManager.Stored.FAVOURITE, res)
  return res as TFavourite[]
}

export const toggleFavourite = async (
  faved: boolean,
  prayerId: string,
  userId: string,
  tok?: string
): Promise<TFavourite | undefined> => {
  let token = tok
  if (!token) {
    const data = await StorageManager.getDataAsync<string>(
      StorageManager.Stored.TOKEN
    )
    if (!data) return
    token = data
  }
  let favs = await StorageManager.getDataAsync<TFavourite[]>(
    StorageManager.Stored.FAVOURITE
  )
  const res = await api.post<TToggleFavResponse>(
    '/favourites',
    {
      prayerId,
      userId,
      faved
    },
    token
  )
  if (res.error || !favs) return
  let changed = false
  favs = favs.map((f) => {
    if (f.id === res.id) {
      f.faved = res.faved
      changed = true
    }
    return f
  })
  if (!changed) favs.push(res)
  StorageManager.setDataAsync(StorageManager.Stored.FAVOURITE, favs)
  return res
}

/**
 * Notification
 */
export const getNotifs = async (tok: string): Promise<TNotif[] | undefined> => {
  let token = tok
  if (!token) {
    const data = await StorageManager.getDataAsync<string>(
      StorageManager.Stored.TOKEN
    )
    if (!data) return
    token = data
  }
  const res = await api.get<TNotifsResponse>('/notifications', token)
  if (res.error) return
  await StorageManager.setDataAsync(StorageManager.Stored.NOTIFS, res)
  return res
}

export const registerForNotification = async (
  tok: string,
  notifContent: string,
  time: string
): Promise<TNotif | undefined> => {
  let token = tok
  if (!token) {
    const data = await StorageManager.getDataAsync<string>(
      StorageManager.Stored.TOKEN
    )
    if (!data) return
    token = data
  }
  const res = await api.post<TNotifResponse>(
    '/notifications',
    {
      time,
      prayerContentId: notifContent
    },
    token
  )
  if (res.error) return
  return res
}

export const removeNotification = async (
  tok: string,
  id: string
): Promise<(TNotif & { error?: string }) | undefined> => {
  let token = tok
  if (!token) {
    const data = await StorageManager.getDataAsync<string>(
      StorageManager.Stored.TOKEN
    )
    if (!data) return
    token = data
  }
  const res = await api.del<TNotif & { error?: string }>(
    '/notifications/' + id,
    token
  )
  if (res.error) return
  return res
}
