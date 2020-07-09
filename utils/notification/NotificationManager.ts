/**
 * Notification Manager
 */
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

/**
 * Notification Peermission
 */
export const isNotificationPermittedAsync = async () => {
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
    if (existingStatus === Permissions.PermissionStatus.GRANTED) return true
    return false
  }
  return false
}

/**
 * Register For Notifications
 * 
 * @returns {string} - ExpoPushToken
 */
export const registerForNotificationsAsync =  async () => {
  if (!(await isNotificationPermittedAsync())) {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    if (status !== Permissions.PermissionStatus.GRANTED) throw new Error('Notifications not allowed...')
  }

  let token = (await Notifications.getExpoPushTokenAsync()).data
  console.log(token)

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('angelus', {
      name: 'angelus',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [100, 100, 200, 200, 200, 100, 100],
      lightColor: '#FF231F7C'
    })
  }

  return token
}