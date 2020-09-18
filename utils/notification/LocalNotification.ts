import { ToastAndroid } from 'react-native'
import * as Notifications from 'expo-notifications'

import * as Storage from '../storage/StorageManager'
import { Prayer, NotifTime } from 'config/types/Prayer'
import { NotificationContent } from 'config/types/NotificationTypes'
import prayers from 'data/prayers.json'
import { DailyTriggerInput } from 'expo-notifications'

/**
 * Send Notification
 */
export const sendNotification = async (
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

  let times: NotifTime[] = []

  if (prayer && prayer.times && prayer?.times.length > 0) times = prayer?.times
  else {
    const timeToRemind: DailyTriggerInput = {
      hour: date.getHours(),
      minute: date.getMinutes(),
      repeats: true
    }
    times.push(timeToRemind)
  }

  const subs: string[] = []
  const contents: NotificationContent[] = []

  times.forEach(async (e) => {
    // Create notification response
    const content: NotificationContent = {
      title: 'Tout est bon !',
      body: `Rappels pour '${prayer?.displayName}' à ${e.hour}:${e.minute}`,
      sound: true
    }
    contents.push(content)

    // Get sub
    const sub = await Notifications.scheduleNotificationAsync({
      content: prayer?.notifContent || {
        title: 'Merci Seigneur',
        body: 'Offrons lui 5 minutes de notre journée',
        sound: true
      },
      trigger: e
    })
    subs.push(sub)
  })

  // Get prayer from storage
  let data = await Storage.getDataAsync(Storage.Stored.SUBS)
  let finalData: string
  if (!data) {
    // Create data array
    if (!prayer) return
    prayer.active = true
    prayer.subscription = subs
    data = JSON.stringify([prayer])
    finalData = data
  } else {
    // Upd8 subs
    const parsed: Prayer[] = JSON.parse(data)
    const storedPrayer = parsed.find((e) => e.name === name)
    if (storedPrayer) {
      if (
        storedPrayer.active &&
        storedPrayer.subscription &&
        storedPrayer.subscription[0].length > 0
      ) {
        // Already stored a subscription
        ToastAndroid.showWithGravity(
          'Vous avez déjà souscris à ces notifications',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        )
        subs.forEach(
          async (sub) =>
            await Notifications.cancelScheduledNotificationAsync(sub)
        )
        return
      } else {
        // Add or update the subscription
        parsed.map((e) => {
          if (e.name === name) {
            e.active = true
            e.subscription = subs
            return e
          }
        })
        finalData = JSON.stringify(parsed)
      }
    } else {
      // Add a subscription for this prayer
      if (!prayer) return
      prayer.active = true
      prayer.subscription = subs
      parsed.push(prayer)
      finalData = JSON.stringify(parsed)
    }
  }

  await Storage.setDataAsync(Storage.Stored.SUBS, finalData)
  contents.forEach((content) => sendNotification(content))
}

/**
 * Unsub from a notifications subscription
 */
export const unsubFromPrayer = async (name: string): Promise<void> => {
  const prayer = prayers.find((e) => e.name === name)

  const content: NotificationContent = {
    title: 'Succès ! Vous avez été désinscrit',
    body: `Plus de notificaions pour ${prayer?.displayName}`,
    sound: true
  }
  const data = await Storage.getDataAsync(Storage.Stored.SUBS)
  if (!data) return
  const parsed = JSON.parse(data)
  parsed.map(async (element: Prayer) => {
    if (element.name === name && element.subscription && element.active) {
      element.subscription.forEach(
        async (sub) => await Notifications.cancelScheduledNotificationAsync(sub)
      )
      element.active = false
      element.subscription = ['']
      sendNotification(content)
      return element
    }
  })
  await Storage.setDataAsync(Storage.Stored.SUBS, JSON.stringify(parsed))
}

/**
 * Unsubscribe to all notifications
 */
export const unsubToAll = async (): Promise<void> => {
  const content: NotificationContent = {
    title: 'Succès !',
    body: 'Vous avez été désinscrit de toutes les notifications',
    sound: true
  }
  const data = await Storage.getDataAsync(Storage.Stored.SUBS)
  if (!data) return
  const parsed = JSON.parse(data)
  parsed.map((e: Prayer) => {
    e.active = false
    e.subscription = ['']
  })
  await Notifications.cancelAllScheduledNotificationsAsync()
  await Storage.setDataAsync(Storage.Stored.SUBS, JSON.stringify(parsed))
  sendNotification(content)
}
