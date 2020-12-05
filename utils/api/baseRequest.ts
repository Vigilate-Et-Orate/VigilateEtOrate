import URL from 'config/url.config.json'
import { ToastAndroid } from 'react-native'

export const post = async <T>(url: string, body: any, token?: string) => {
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
      if (res.status !== 200) ToastAndroid.show(data.error, ToastAndroid.SHORT)
      return data
    })
    .catch((e) => console.error('ERROOOOOOR=', e.message))
  return res as T
}

export const get = async <T>(url: string, token?: string) => {
  const headers: { [key: string]: string } = {
    Accept: 'application/json'
  }
  if (token) headers.Authorization = token
  const res = await fetch(URL.API + url, {
    headers,
    mode: 'cors'
  })
  const data = await res.json()
  if (res.status !== 200) ToastAndroid.show(data.error, ToastAndroid.SHORT)
  return data as T
}
