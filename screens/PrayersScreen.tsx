import React from 'react'
import { useNavigation } from '@react-navigation/native'
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity
} from 'react-native'

import { Title } from 'elements/text/Text'
import { Prayer } from 'config/types/Prayer'
import prayers from 'data/prayers.json'
import theme from 'config/theme'

type PrayerLineProps = {
  prayer: Prayer
}

const PrayerLine = ({ prayer }: PrayerLineProps) => {
  const navigation = useNavigation()
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Prayer', { name: prayer.name })}
    >
      <View style={{ width: '80%' }}>
        <Text style={styles.title}>{prayer.displayName}</Text>
        <Text>{prayer.description}</Text>
      </View>
    </TouchableOpacity>
  )
}

const PrayersScreen = () => {
  return (
    <ScrollView style={{ paddingHorizontal: 20 }}>
      <Title>Prières</Title>
      {prayers &&
        prayers.map((prayer: Prayer) => (
          <PrayerLine key={prayer.name} prayer={prayer} />
        ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  button: {
    color: '#35415A'
  },
  card: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    margin: 10,
    flexDirection: 'row'
  },
  title: {
    fontSize: 24,
    marginBottom: 6,
    color: theme.colors.blue
  },
  description: {
    fontSize: 14,
    color: theme.colors.gray
  }
})

export default PrayersScreen
