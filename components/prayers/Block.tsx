import React from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons'

import { Prayer } from 'config/types/Prayer'
import theme from 'config/theme'

export type PrayerBlockProps = {
  prayer: Prayer
  index: number
  inpair?: boolean
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
  inpair
}: PrayerBlockProps): JSX.Element => {
  const navigation = useNavigation()
  const isBig = index % 2 == (inpair ? 1 : 0)
  return (
    <TouchableOpacity
      style={isBig ? styles.bigCard : styles.card}
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
