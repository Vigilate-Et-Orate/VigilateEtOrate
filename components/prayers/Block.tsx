import React from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons'

import { TPrayer } from 'config/types/Prayer'
import theme from 'config/theme'

export type PrayerBlockProps = {
  prayer: TPrayer
  index: number
  inpair?: boolean
  fav?: boolean
}

export type PrayerBlockManageNotifProps = {
  prayer: TPrayer
  onReactivate: (name: string) => void
}

export type PrayerBlockRegisterProps = {
  prayer: TPrayer
  index: number
  inpair?: boolean
  onPress: () => Promise<void>
  notif?: boolean
  time?: string
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
      onPress={() => navigation.navigate('Prayer', { prayer: prayer })}
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
  onPress,
  notif,
  time
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
      <View style={styles.actions}>
        <TouchableOpacity style={styles.registerButton} onPress={onPress}>
          <MaterialIcons
            name={notif ? 'notifications-off' : 'notifications-active'}
            size={20}
            color={theme.colors.white}
          />
        </TouchableOpacity>
        {notif && <Text style={{ fontStyle: 'italic' }}>{time}</Text>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  actions: {
    display: 'flex',
    flexDirection: 'row-reverse',
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  registerButton: {
    backgroundColor: theme.colors.blue,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 100
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
    paddingHorizontal: 10,
    paddingVertical: 17,
    borderRadius: 15,
    backgroundColor: theme.colors.white,
    marginVertical: 10,
    flexDirection: 'column',
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
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 15,
    backgroundColor: theme.colors.white,
    marginVertical: 10,
    flexDirection: 'column',
    shadowColor: '#000',
    elevation: 15,
    height: 350,
    overflow: 'hidden'
  }
})
