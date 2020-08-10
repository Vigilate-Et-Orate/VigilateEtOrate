import { ToastAndroid } from 'react-native'
import * as Notifications from 'expo-notifications'

import * as Storage from '../storage/StorageManager'
import { Prayer } from 'config/types/Prayer'
import { NotificationContent } from 'config/types/NotificationTypes'
import prayers from 'data/prayers.json'

/**
 * Send Notification
 */
const sendNotification = async (
  content: NotificationContent
): Promise<void> => {
  Notifications.scheduleNotificationAsync({
    content,
    trigger: null
  })
}

/**
 * Register for notification
 */
export const registerForPrayer = async (
  name: string,
  date: Date
): Promise<void> => {
  const prayer = prayers.find((e) => e.name === name)
  const timeToRemind = {
    hour: date.getHours(),
    minute: date.getMinutes(),
    repeat: true
  }
  // Create notification response
  const content: NotificationContent = {
    title: 'Tout est bon !',
    body: `Rappels pour '${prayer?.displayName}'`
  }

  // Store data
  let data = await Storage.getDataAsync(Storage.Stored.SUBS)
  if (!data) {
    // Create data array
    data = JSON.stringify([prayer])
  } else {
    // Upd8 subs
    const parsed: Prayer[] = JSON.parse(data)
    const storedPrayer = parsed.find((e) => e.name === name)
    if (!storedPrayer) {
      // Add prayer to list
    }
  }
}

/**
 * Register for Angelus daily notification
 */
export const registerForAngelusAsync = async (): Promise<void> => {
  const midday = {
    hour: 12,
    minute: 0,
    repeats: true
  }
  // Create notification content
  const content = {
    title: 'Tout est bon!',
    body: "Vous avez souscrit aux rappels quotidients pour l'Angelus"
  } as NotificationContent

  // Store prayer
  let data = await Storage.getDataAsync(Storage.Stored.SUBS)
  if (!data) {
    data = JSON.stringify([
      {
        name: 'angelus',
        active: true
      } as Sub
    ])
  } else {
    const parsedData = JSON.parse(data) as Sub[]
    if (parsedData && parsedData.length > 0) {
      const data = parsedData.find((elem: Sub) => elem.name === 'angelus')
      if (data?.active !== true)
        parsedData[
          parsedData.findIndex((elem: Sub) => elem.name === 'angelus')
        ].active = true
      else {
        ToastAndroid.showWithGravity(
          'Vous avez deja souscris a ces notifications',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        )
        return
      }
    } else {
      parsedData.push({ name: 'angelus', active: true } as Sub)
    }
    data = JSON.stringify(parsedData)
  }

  await Storage.setDataAsync(Storage.Stored.SUBS, data)
  sendNotification(content)

  const subs = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Angeluuuuus',
      body: "Il est l'heure de chanter l'Angélus"
    },
    trigger: midday
  })
}

/**
 * Unregister from angelus
 */

/**
 * Unsubscribe to all notifications
 */
export const unsubToAll = async (): Promise<void> => {
  const content = {
    title: 'Successfully unsubscribed from all',
    body: 'You will not receive otifications anymore'
  } as NotificationContent
  sendNotification(content)
  const data = JSON.parse(
    (await Storage.getDataAsync(Storage.Stored.SUBS)) || ''
  ) as Sub[]
  if (!data) return
  data.map((elem: Sub) => {
    elem.active = false
  })
  await Storage.setDataAsync(Storage.Stored.SUBS, JSON.stringify(data))

  await Notifications.cancelAllScheduledNotificationsAsync()
}
