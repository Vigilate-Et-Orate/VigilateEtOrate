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
  title: string
  name: string
  description: string
}

const PrayerLine = ({ title, name, description }: PrayerLineProps) => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Prayer', { name })}
    >
      <View style={{ width: '80%' }}>
        <Text style={styles.title}>{title}</Text>
        <Text>{description}</Text>
      </View>
    </TouchableOpacity>
  )
}

const PrayersScreen = () => {
  const navigation = useNavigation()

  return (
    <ScrollView style={{ paddingHorizontal: 20 }}>
      <Title>Prières</Title>
      {prayers &&
        prayers.map((prayer: Prayer) => (
          <PrayerLine
            key={prayer.name}
            title={prayer.displayName}
            name={prayer.name}
            description={prayer.description}
          />
        ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  button: {
    color: '#35415A'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    flexDirection: 'row'
  },
  title: {
    fontSize: 20,
    color: theme.colors.blue,
    marginBottom: 4
  }
})

export default PrayersScreen
