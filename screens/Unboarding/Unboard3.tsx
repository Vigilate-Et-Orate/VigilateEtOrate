import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'

import theme from 'config/theme'
import { useNavigation } from '@react-navigation/native'
import { PrayerBlockRegister } from 'components/prayers/Block'
import { Prayer } from 'config/types/Prayer'
import allPrayers from 'data/prayers.json'
import * as LocalNotification from 'utils/notification/LocalNotification'

const Unboard = (): JSX.Element => {
  const navigation = useNavigation()
  const [prayers, setPrayers] = useState<Prayer[]>([])
  const [showModal, setShowModal] = useState(false)
  const [currentPrayer, setCurrentPrayer] = useState('')
  const [date, setDate] = useState(new Date(Date.now()))

  useEffect(() => {
    const tmp = allPrayers.filter(
      (p) =>
        p.name == 'angelus' ||
        p.name == 'consecration' ||
        p.name == 'je-vous-salue-marie'
    )
    setPrayers(tmp)
  }, [])

  const onDateChange = (event: any, selectedDate?: Date | undefined) => {
    if (!event) return
    const currentdate = selectedDate || date
    setDate(currentdate)
    setShowModal(false)
    if (currentPrayer && currentPrayer.length > 0) {
      LocalNotification.registerForPrayer(currentPrayer, currentdate)
      setCurrentPrayer('')
    }
  }

  const register = async (prayer: Prayer) => {
    if (prayer.times && prayer.times.length == 0) {
      setShowModal(true)
      setCurrentPrayer(prayer.name)
    } else {
      LocalNotification.registerForPrayer(prayer.name, new Date(Date.now()))
    }
  }

  return (
    <View style={styles.background}>
      {showModal && (
        <DateTimePicker
          mode="time"
          value={date}
          is24Hour={true}
          display="default"
          onChange={onDateChange}
        />
      )}
      <Text style={styles.title}>Les Notifications les plus utilisées</Text>
      {prayers.length > 0 && (
        <View style={styles.container}>
          <View style={styles.column}>
            <PrayerBlockRegister
              prayer={prayers[0]}
              index={1}
              onPress={() => register(prayers[0])}
            />
            <PrayerBlockRegister
              prayer={prayers[2]}
              index={1}
              onPress={() => register(prayers[2])}
            />
          </View>
          <View style={styles.column}>
            <PrayerBlockRegister
              prayer={prayers[1]}
              index={0}
              onPress={() => register(prayers[1])}
            />
          </View>
        </View>
      )}
      <View style={styles.button}>
        <TouchableOpacity
          style={{
            backgroundColor: theme.colors.blue,
            paddingHorizontal: 25,
            paddingVertical: 10,
            borderRadius: 30
          }}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={{ color: theme.colors.white, fontSize: 20 }}>
            Continuer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: theme.colors.lightBlue,
    height: '100%'
  },
  container: {
    flexDirection: 'row',
    width: '100%'
  },
  column: {
    flexDirection: 'column',
    alignContent: 'center',
    width: '40%',
    marginHorizontal: 20
  },
  title: {
    color: theme.colors.white,
    marginBottom: 10,
    marginTop: '20%',
    paddingHorizontal: 25,
    fontSize: 36
  },
  button: {
    position: 'absolute',
    bottom: '17%',
    right: '10%'
  }
})

export default Unboard
