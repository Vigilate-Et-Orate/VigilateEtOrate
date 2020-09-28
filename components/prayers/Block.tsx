import React, { useState } from 'react'
import { View, TouchableOpacity, StyleSheet, Text, Switch } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons'

import { Prayer } from 'config/types/Prayer'
import theme from 'config/theme'
import * as LocalNotification from 'utils/notification/LocalNotification'

export type PrayerBlockProps = {
  prayer: Prayer
  index: number
  inpair?: boolean
  fav?: boolean
}

export type PrayerBlockManageNotifProps = {
  prayer: Prayer
  onReactivate: (name: string) => void
}

export type PrayerBlockRegisterProps = {
  prayer: Prayer
  index: number
  inpair?: boolean
  onPress: () => Promise<void>
}

export const PrayerBlock = ({
  prayer,
  index,
  inpair,
  fav
}: PrayerBlockProps): JSX.Element => {
  const navigation = useNavigation()
  const isBig = index % 2 == (inpair ? 1 : 0)
  return (
    <TouchableOpacity
      style={isBig ? styles.bigCard : fav ? styles.favCard : styles.card}
      onPress={() => navigation.navigate('Prayer', { name: prayer.name })}
    >
      <View style={{ width: '80%' }}>
        <Text style={styles.title}>{prayer.displayName}</Text>
        <Text numberOfLines={isBig ? 11 : 3}>
          {isBig ? prayer.content : prayer.description}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export const PrayerBlockRegister = ({
  prayer,
  index,
  inpair,
  onPress
}: PrayerBlockRegisterProps): JSX.Element => {
  const isBig = index % 2 == (inpair ? 1 : 0)
  return (
    <View style={isBig ? styles.bigCard : styles.card}>
      <View style={{ width: '80%' }}>
        <Text style={styles.title}>{prayer.displayName}</Text>
        <Text numberOfLines={isBig ? 10 : 3}>
          {isBig ? prayer.content : prayer.description}
        </Text>
      </View>
      <TouchableOpacity style={styles.registerButton} onPress={onPress}>
        <MaterialIcons
          name="notifications-active"
          size={20}
          color={theme.colors.white}
        />
      </TouchableOpacity>
    </View>
  )
}

export const PrayerBlockManageNotification = ({
  prayer,
  onReactivate
}: PrayerBlockManageNotifProps): JSX.Element => {
  const [enabled, setEnabled] = useState(prayer.active)

  const toggleSwitch = () => {
    if (enabled) LocalNotification.unsubFromPrayer(prayer.name)
    else {
      if (prayer.times && prayer.times.length == 0) onReactivate(prayer.name)
      LocalNotification.registerForPrayer(prayer.name, new Date(Date.now()))
    }
    setEnabled(!enabled)
  }

  return (
    <View style={styles.manageNotifCard}>
      <View style={{ width: '70%' }}>
        <Text style={styles.title}>{prayer.displayName}</Text>
        <Text>{prayer.description}</Text>
      </View>
      <View
        style={{
          width: '30%',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <Switch
          trackColor={{ false: theme.colors.red, true: theme.colors.yellow }}
          thumbColor={theme.colors.blue}
          onValueChange={toggleSwitch}
          value={enabled}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  registerButton: {
    backgroundColor: theme.colors.blue,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 100,
    position: 'absolute',
    bottom: 10,
    right: 10
  },
  title: {
    color: theme.colors.blue,
    fontSize: 20,
    marginBottom: 7
  },
  manageNotifCard: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: theme.colors.white,
    elevation: 2,
    flexDirection: 'row',
    borderRadius: 15,
    marginVertical: 10
  },
  card: {
    paddingLeft: 10,
    paddingVertical: 17,
    borderRadius: 15,
    backgroundColor: theme.colors.white,
    marginVertical: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    elevation: 15,
    height: 200,
    overflow: 'hidden'
  },
  favCard: {
    paddingHorizontal: '7%',
    paddingVertical: 17,
    borderRadius: 15,
    backgroundColor: theme.colors.white,
    marginVertical: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    elevation: 15,
    height: 100,
    overflow: 'hidden'
  },
  bigCard: {
    paddingLeft: 10,
    paddingVertical: 20,
    borderRadius: 15,
    backgroundColor: theme.colors.white,
    marginVertical: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    elevation: 15,
    height: 350,
    overflow: 'hidden'
  }
})
