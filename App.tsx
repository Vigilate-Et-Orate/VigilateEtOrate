import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

import * as LocalNotification from './utils/notification/LocalNotification'
import * as NativeNotifs from './utils/notification/NotificationManager'

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
    <View style={styles.container}>
      <TouchableOpacity onPress={LocalNotification.registerForAngelus}>
        <Text>Angélus tous les jours à midi !</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
