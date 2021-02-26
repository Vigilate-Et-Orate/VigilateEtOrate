import URL from 'config/url.config.json'
import { ToastAndroid } from 'react-native'

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const post = async <T>(
  url: string,
  body: any,
  token?: string
): Promise<T> => {
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
  if (token) headers.Authorization = token
  const res = await fetch(URL.API + url, {
    method: 'POST',
    mode: 'cors',
    headers,
    body: JSON.stringify(body)
  })
    .then(async (res) => {
      const data = await res.json()
      if (res.status !== 200) {
        console.error(`[POST ERROR] - ${url} - `, data.error)
        ToastAndroid.show(data.error, ToastAndroid.SHORT)
      }
      return data
    })
    .catch((e) => console.error(`[POST ERROR] - ${url} - `, e.message))
  return res as T
}

export const patch = async <T>(
  url: string,
  body: any,
  token?: string
): Promise<T> => {
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
  if (token) headers.Authorization = token
  const res = await fetch(URL.API + url, {
    method: 'PATCH',
    mode: 'cors',
    headers,
    body: JSON.stringify(body)
  })
    .then(async (res) => {
      const data = await res.json()
      if (res.status !== 200) {
        console.error(`[POST ERROR] - ${url} - `, data.error)
        ToastAndroid.show(data.error, ToastAndroid.SHORT)
      }
      return data
    })
    .catch((e) => console.error(`[POST ERROR] - ${url} - `, e.message))
  return res as T
}

export const get = async <T>(url: string, token?: string): Promise<T> => {
  const headers: { [key: string]: string } = {
    Accept: 'application/json'
  }
  if (token) headers.Authorization = token
  const res = await fetch(URL.API + url, {
    headers,
    mode: 'cors'
  })
  const data = await res.json()
  if (res.status !== 200) {
    console.error(`[GET ERROR] - ${url} -`, data.error)
    ToastAndroid.show(data.error, ToastAndroid.SHORT)
  }
  return data as T
}
/* eslint-enable @typescript-eslint/explicit-module-boundary-types */

export const del = async <T>(url: string, token: string): Promise<T> => {
  const headers = {
    Accept: 'apaplication/json',
    Authorization: token
  }
  const res = await fetch(URL.API + url, {
    method: 'DELETE',
    headers,
    mode: 'cors'
  })
  const data = await res.json()
  if (res.status !== 200) {
    console.error(`[DELETE ERROR] - ${url} -`, data.error)
    ToastAndroid.show(data.error, ToastAndroid.SHORT)
  }
  return data as T
}
