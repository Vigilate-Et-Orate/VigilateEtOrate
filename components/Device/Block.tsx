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
        <Text style={styles.text}>{device.name || device.id}</Text>
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
    elevation: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardLeft: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row'
  },
  thisText: {
    fontSize: 15,
    color: theme.colors.yellow,
    marginLeft: 10
  },
  text: {
    fontSize: 18,
    color: theme.colors.white
  }
})

export default DeviceBlock
