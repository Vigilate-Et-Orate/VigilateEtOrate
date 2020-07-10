import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications'
import { ThemeProvider } from 'styled-components'

import * as NativeNotifs from './utils/notification/NotificationManager'
import Stack from './components/layout/Routes'
import theme from './config/theme'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
})

export default function App() {
  useEffect(() => {
    const subcription = Notifications.addPushTokenListener(NativeNotifs.registerForNotificationsAsync)
    Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification', notification)
    })
    return () => {
      Notifications.removeAllNotificationListeners()
    }
  }, [])

  return (
    <ThemeProvider theme={theme} >
      <Stack />
    </ThemeProvider>
  );
}