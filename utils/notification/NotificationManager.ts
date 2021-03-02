/**
 * Notification Manager
 */
import { Platform } from 'react-native'
import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'
import theme from 'config/theme'

/**
 * Notification Permission
 */
export const isNotificationPermittedAsync = async (): Promise<boolean> => {
  if (Constants.isDevice) {
    const status = await Notifications.getPermissionsAsync()
    if (!status) return true
    return false
  }
  return false
}

/**
 * Get Notification Token
 */
export const getExponentToken = async (): Promise<Notifications.ExpoPushToken> => {
  return await Notifications.getExpoPushTokenAsync()
}

/**
 * Register For Notifications
 *
 * @returns {string} - ExpoPushToken
 */
export const registerForNotificationsAsync = async (): Promise<string> => {
  if (!(await isNotificationPermittedAsync())) {
    const { status } = await Notifications.requestPermissionsAsync()
    if (status !== 'granted') return ''
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('prayers', {
      name: 'prayer',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [100, 100, 200, 200, 200, 100, 100],
      lightColor: theme.colors.blue
    })
    Notifications.setNotificationChannelAsync('intentions', {
      name: 'intention',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [100, 100, 100, 100, 200, 200],
      lightColor: theme.colors.blue
    })
  }

  return token
}
