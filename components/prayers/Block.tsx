import React from 'react'
import { useNavigation } from '@react-navigation/native'

import { Prayer } from 'config/types/Prayer'
import { TouchableOpacity } from 'react-native-gesture-handler'

export type PrayerBlockProps = {
  prayer: Prayer
}

export const PrayerLine = ({ prayer }: PrayerBlockProps): JSX.Element => {
  const navigation = useNavigation()
  return <TouchableOpacity></TouchableOpacity>
}
