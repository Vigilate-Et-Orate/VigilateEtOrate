import React from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { Prayer } from 'config/types/Prayer'
import theme from 'config/theme'

export type PrayerBlockProps = {
  prayer: Prayer
  index: number
  inpair?: boolean
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

const styles = StyleSheet.create({
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
    height: 150,
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
    height: 300,
    overflow: 'hidden'
  }
})
