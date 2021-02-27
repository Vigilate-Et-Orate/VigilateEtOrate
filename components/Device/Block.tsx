import theme from 'config/theme'
import { TDevice } from 'config/types/TDevices'
import { ExpoPushToken, getExpoPushTokenAsync } from 'expo-notifications'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

const DeviceBlock = ({
  device,
  deleteDevice
}: {
  device: TDevice
  deleteDevice: (id: string) => void
}): JSX.Element => {
  const [expoToken, setToken] = useState<ExpoPushToken>()

  useEffect(() => {
    getExpoPushTokenAsync().then((expoPushToken) => {
      setToken(expoPushToken)
    })
  })

  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.text}>{device.name || device._id}</Text>
        {expoToken && expoToken.data === device.token && (
          <Text style={styles.thisText}>- This Device</Text>
        )}
      </View>
      <MaterialIcons.Button
        name="phonelink-erase"
        size={25}
        borderRadius={20}
        backgroundColor={theme.colors.blue}
        onPress={() => deleteDevice(device._id)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.blue,
    borderRadius: 15,
    display: 'flex',
    elevation: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  cardLeft: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row'
  },
  text: {
    color: theme.colors.white,
    fontSize: 18
  },
  thisText: {
    color: theme.colors.yellow,
    fontSize: 15,
    marginLeft: 10
  }
})

export default DeviceBlock
