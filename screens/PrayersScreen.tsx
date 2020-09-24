import React from 'react'
import { useNavigation } from '@react-navigation/native'
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native'

import { Prayer } from 'config/types/Prayer'
import prayers from 'data/prayers.json'
import theme from 'config/theme'

type PrayerLineProps = {
  prayer: Prayer
}

const PrayerLine = ({ prayer }: PrayerLineProps): JSX.Element => {
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

const PrayersScreen = (): JSX.Element => {
  return (
    <View style={styles.background}>
      <View style={styles.header}>
        <View
          style={{ flexDirection: 'row', height: '60%', position: 'relative' }}
        >
          <View style={{ position: 'absolute', top: 20, left: '15%' }}>
            <Image
              style={{ width: 80, height: 70 }}
              source={require('../assets/newIconolive.png')}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row-reverse',
            height: '40%',
            paddingHorizontal: 40
          }}
        >
          <Text style={{ color: '#f6f4f4', fontSize: 32 }}>Prières</Text>
        </View>
      </View>
      <ScrollView style={styles.body}>
        <View
          style={
            prayers.length > 4 ? styles.roundedView : styles.roundedViewHeight
          }
        >
          {prayers &&
            prayers.map((prayer: Prayer) => (
              <PrayerLine key={prayer.name} prayer={prayer} />
            ))}
        </View>
      </ScrollView>
    </View>
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
    color: theme.colors.blue
  },
  background: {
    height: '100%',
    backgroundColor: theme.colors.blue
  },
  body: {
    height: '125%'
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
    width: '100%',
    height: '15%',
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 30
  },
  roundedView: {
    marginTop: '40%',
    backgroundColor: theme.colors.lightBlue,
    borderRadius: 30,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 35,
    height: '100%'
  },
  roundedViewHeight: {
    marginTop: '40%',
    backgroundColor: theme.colors.lightBlue,
    borderRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 35,
    height: 750
  }
})

export default PrayersScreen
