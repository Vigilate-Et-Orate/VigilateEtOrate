import React, { useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { Keyboard } from 'react-native'

import RootReducer from 'red/reducers/RootReducer'
import * as Notifications from 'expo-notifications'
import * as NativeNotifs from './utils/notification/NotificationManager'
import Stack from './components/layout/Routes'

const store = createStore(RootReducer)

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
})

const App = (): JSX.Element => {
  useEffect(() => {
    NativeNotifs.registerForNotificationsAsync()
    const subReceived = Notifications.addNotificationReceivedListener(
      (notification) => {
        if (!notification) return
      }
    )
    SplashScreen.preventAutoHideAsync()

    return () => {
      subReceived.remove()
      Keyboard.removeAllListeners('keyboardDidShow')
      Keyboard.removeAllListeners('keyboardDidHide')
    }
  }, [])

  return (
    <Provider store={store}>
      <Stack />
    </Provider>
  )
}

export default App
