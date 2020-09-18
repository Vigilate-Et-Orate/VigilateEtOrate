import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import * as Notifications from 'expo-notifications'

import * as NativeNotifs from './utils/notification/NotificationManager'
import Stack from './components/layout/Routes'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
})

export default function App() {
  useEffect(() => {
    const token = NativeNotifs.registerForNotificationsAsync()
    // const subscription = Notifications.addPushTokenListener()
    const subReceived = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification RECEIVED', notification)
      }
    )

    return () => {
      subReceived.remove()
    }
  }, [])

  return <Stack />
}
